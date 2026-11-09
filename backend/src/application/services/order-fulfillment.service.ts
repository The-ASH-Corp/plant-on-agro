import { IOrderRepository } from '../../core/interfaces/order.repository.interface';
import { ITreeInstanceRepository } from '../../core/interfaces/tree-instance.repository.interface';
import { ICertificateRepository } from '../../core/interfaces/certificate.repository.interface';
import { IMailService } from '../../core/interfaces/mail-service.interface';
import { Order } from '../../core/entities/order.entity';
import { TreeInstance } from '../../core/entities/tree-instance.entity';
import { Certificate } from '../../core/entities/certificate.entity';
import { redisService } from '../../infrastructure/redis/redis.client';

export interface FulfillmentResult {
  order: Order;
  treeInstances: TreeInstance[];
  certificate: Certificate | null;
}

export class OrderFulfillmentService {
  // In-process registry to coalesce concurrent execution promises within the same Node.js instance
  private static readonly activeFulfillments = new Map<string, Promise<FulfillmentResult>>();

  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly treeInstanceRepository: ITreeInstanceRepository,
    private readonly certificateRepository: ICertificateRepository,
    private readonly mailService?: IMailService
  ) {}

  public async fulfillOrder(order: Order, paymentId: string): Promise<FulfillmentResult> {
    const orderNumber = order.orderNumber;

    // Fast-path: If an in-flight fulfillment promise already exists for this order in this process, await it
    const inFlight = OrderFulfillmentService.activeFulfillments.get(orderNumber);
    if (inFlight) {
      return inFlight;
    }

    const fulfillmentPromise = this.executeFulfillOrderWithLock(order, paymentId);
    OrderFulfillmentService.activeFulfillments.set(orderNumber, fulfillmentPromise);

    try {
      return await fulfillmentPromise;
    } finally {
      OrderFulfillmentService.activeFulfillments.delete(orderNumber);
    }
  }

  private async executeFulfillOrderWithLock(order: Order, paymentId: string): Promise<FulfillmentResult> {
    const orderNumber = order.orderNumber;
    const lockKey = `lock:fulfillment:${orderNumber}`;
    const workerId = `${process.pid}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const lockTtlMs = 30000; // 30 seconds

    let lockAcquired = await this.acquireDistributedLock(lockKey, workerId, lockTtlMs);

    if (!lockAcquired) {
      // Another worker/container holds the distributed lock. Poll up to 10 seconds (50 x 200ms)
      let attempts = 50;
      while (!lockAcquired && attempts > 0) {
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Re-check order status in DB to see if the concurrent process completed fulfillment
        const freshOrder = await this.orderRepository.findByOrderNumber(orderNumber);
        if (freshOrder && freshOrder.paymentStatus === 'Paid') {
          const existingInstances = await this.treeInstanceRepository.findByOrderRef(orderNumber);
          const existingCerts = await this.certificateRepository.findByOrderRef(orderNumber);
          return {
            order: freshOrder,
            treeInstances: existingInstances,
            certificate: existingCerts.length > 0 ? existingCerts[0] : null,
          };
        }

        lockAcquired = await this.acquireDistributedLock(lockKey, workerId, lockTtlMs);
        attempts--;
      }
    }

    try {
      // Re-fetch fresh order from database to prevent stale in-memory state
      const freshOrder = (await this.orderRepository.findByOrderNumber(orderNumber)) || order;

      // If order was already fulfilled, return existing records idempotently
      if (freshOrder.paymentStatus === 'Paid') {
        const existingInstances = await this.treeInstanceRepository.findByOrderRef(freshOrder.orderNumber);
        const existingCerts = await this.certificateRepository.findByOrderRef(freshOrder.orderNumber);
        return {
          order: freshOrder,
          treeInstances: existingInstances,
          certificate: existingCerts.length > 0 ? existingCerts[0] : null,
        };
      }

      let isFirstFulfillment = false;

      // 1. Update Order Status (retain Razorpay Order ID and Payment ID together)
      const existingRef = freshOrder.transactionRef || '';
      const combinedRef =
        existingRef && !existingRef.includes(paymentId)
          ? `${existingRef}|${paymentId}`
          : existingRef || paymentId;

      freshOrder.updatePaymentStatus('Paid', combinedRef);
      freshOrder.updateStatus('New Request');

      const cleanOrderNumber = freshOrder.orderNumber.replace(/^POA-?/, '');

      await this.orderRepository.update(freshOrder);
      isFirstFulfillment = true;

      // 2. DO NOT automatically or randomly assign tree instances upon purchase.
      // Tree instances must be explicitly assigned and managed by an Administrator
      // when advancing the order to "Planted" status.
      const createdTreeInstances: TreeInstance[] = [];

      // 3. Digital Deed Certificate: NEVER issued right after payment while order is 'New Request'.
      // Certificate is officially minted only when Admin marks status as 'Planted' with exact GPS coordinates.
      let certificate: Certificate | null = null;
      const existingCerts = await this.certificateRepository.findByOrderRef(freshOrder.orderNumber);
      if (existingCerts.length > 0 && existingCerts[0].status === 'Issued') {
        certificate = existingCerts[0];
      }

      // 4. Dispatch Payment Complete with Invoice & Confirmation Email (Only on initial fulfillment)
      if (isFirstFulfillment && this.mailService && freshOrder.adopterEmail) {
        this.mailService
          .sendPaymentReceiptWithInvoiceEmail({
            to: freshOrder.adopterEmail,
            customerName: freshOrder.adopterName,
            orderNumber: freshOrder.orderNumber,
            transactionRef: combinedRef,
            date: freshOrder.createdAt || new Date(),
            amount: freshOrder.totalAmount,
            treeSpecies: freshOrder.treeSpecies,
            planType: freshOrder.planType,
            reserveName: freshOrder.reserveName,
            quantity: freshOrder.quantity,
            certificateNumber: certificate ? certificate.certificateNumber : 'Unlocks Upon Field Planting',
            treeTags: createdTreeInstances.map((t) => t.treeTag),
            dedicationMessage: freshOrder.dedicationMessage,
          })
          .catch((err) => console.error('Failed to dispatch payment invoice email:', err));
      }

      return {
        order: freshOrder,
        treeInstances: createdTreeInstances,
        certificate,
      };
    } finally {
      await this.releaseDistributedLock(lockKey, workerId);
    }
  }

  private async acquireDistributedLock(
    lockKey: string,
    workerId: string,
    ttlMs: number
  ): Promise<boolean> {
    if (!redisService.isReady()) {
      return true; // Gracefully rely on in-memory lock if Redis is not configured/ready
    }
    try {
      const client = redisService.getClient();
      const res = await client.set(lockKey, workerId, 'PX', ttlMs, 'NX');
      return res === 'OK';
    } catch (err) {
      console.warn(`[Fulfillment Lock] Redis lock error for ${lockKey}, falling back to local lock:`, err);
      return true;
    }
  }

  private async releaseDistributedLock(
    lockKey: string,
    workerId: string
  ): Promise<void> {
    if (!redisService.isReady()) {
      return;
    }
    try {
      const client = redisService.getClient();
      const luaScript = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
        else
          return 0
        end
      `;
      await client.eval(luaScript, 1, lockKey, workerId);
    } catch (err) {
      console.warn(`[Fulfillment Lock] Redis unlock error for ${lockKey}:`, err);
    }
  }
}
