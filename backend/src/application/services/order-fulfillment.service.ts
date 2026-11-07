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
      freshOrder.updateStatus('Planted');

      const cleanOrderNumber = freshOrder.orderNumber.replace(/^POA-?/, '');
      const certNumber = `POA-CERT-${new Date().getFullYear()}-${cleanOrderNumber}`;
      freshOrder.setCertificateId(certNumber);

      await this.orderRepository.update(freshOrder);
      isFirstFulfillment = true;

      // 2. Server-Side Idempotent Creation of Tree Instances
      const speciesCode = (freshOrder.treeSpecies || 'TR').substring(0, 2).toUpperCase();
      let createdTreeInstances = await this.treeInstanceRepository.findByOrderRef(freshOrder.orderNumber);

      const baseCoords: Record<string, { lat: number; lng: number }> = {
        'Wayanad Rainforest Reserve': { lat: 11.6854, lng: 76.132 },
        'Western Ghats, Maharashtra': { lat: 19.9975, lng: 73.7898 },
        'Nashik Valley, Maharashtra': { lat: 19.9975, lng: 73.7898 },
        'Satara Plateau, Maharashtra': { lat: 17.6805, lng: 74.0183 },
        'Pune Hills, Maharashtra': { lat: 18.5204, lng: 73.8567 },
      };

      let targetCoord = baseCoords[freshOrder.reserveName] || { lat: 11.6854, lng: 76.132 };
      if (freshOrder.gpsCoords && freshOrder.gpsCoords.includes(',')) {
        const [parsedLat, parsedLng] = freshOrder.gpsCoords.split(',').map((s) => Number(s.trim()));
        if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
          targetCoord = { lat: parsedLat, lng: parsedLng };
        }
      }

      if (createdTreeInstances.length < freshOrder.quantity) {
        const needed = freshOrder.quantity - createdTreeInstances.length;
        const startIndex = createdTreeInstances.length;

        for (let i = 0; i < needed; i++) {
          const itemIndex = startIndex + i + 1;
          const treeTag = `POA-${speciesCode}-${cleanOrderNumber}-${String(itemIndex).padStart(3, '0')}`;
          const jitterLat = Number((targetCoord.lat + (Math.random() - 0.5) * 0.004).toFixed(4));
          const jitterLng = Number((targetCoord.lng + (Math.random() - 0.5) * 0.004).toFixed(4));

          const instance = new TreeInstance({
            treeTag,
            orderRef: freshOrder.orderNumber,
            assignedReserve: freshOrder.reserveName,
            gpsCoordinates: { latitude: jitterLat, longitude: jitterLng },
            datePlanted: new Date(),
            healthStatus: 'Sapling Growing',
            treeVarietyName: freshOrder.treeSpecies,
            adopterName: freshOrder.adopterName,
            adopterEmail: freshOrder.adopterEmail,
            notes: `Tree #${itemIndex} of ${freshOrder.quantity} adopted under "${freshOrder.planType}" lifetime stewardship. Geotagged & verified.`,
            isActive: true,
          });

          try {
            const savedInstance = await this.treeInstanceRepository.save(instance);
            createdTreeInstances.push(savedInstance);
          } catch (err: any) {
            // Gracefully catch duplicate key collision and reuse existing record
            if (err.code === 11000 || err.message?.includes('E11000')) {
              const existing = await this.treeInstanceRepository.findByTag(treeTag);
              if (existing) {
                createdTreeInstances.push(existing);
              }
            } else {
              throw err;
            }
          }
        }
      }

      // 3. Server-Side Idempotent Creation of Digital Deed Certificate
      let certificate: Certificate | null = null;
      const existingCerts = await this.certificateRepository.findByOrderRef(freshOrder.orderNumber);

      if (existingCerts.length > 0) {
        certificate = existingCerts[0];
      } else {
        const newCertificate = new Certificate({
          certificateNumber: certNumber,
          orderRef: freshOrder.orderNumber,
          recipientName: freshOrder.adopterName,
          dedicatedMessage:
            freshOrder.dedicationMessage ||
            `Dedicated to ${freshOrder.adopterName} for sustainable forestry stewardship.`,
          issueDate: new Date(),
          treeTag: createdTreeInstances[0]?.treeTag || `POA-${speciesCode}-${cleanOrderNumber}-001`,
          treeSpecies: freshOrder.treeSpecies,
          reserveName: freshOrder.reserveName,
          adopterName: freshOrder.adopterName,
          status: 'Issued',
          isActive: true,
        });

        try {
          certificate = await this.certificateRepository.save(newCertificate);
        } catch (err: any) {
          // Gracefully catch duplicate key collision without 500 error and load existing
          if (err.code === 11000 || err.message?.includes('E11000')) {
            const existing =
              (await this.certificateRepository.findByCertificateNumber(certNumber)) ||
              (await this.certificateRepository.findByOrderRef(freshOrder.orderNumber))[0];
            certificate = existing || null;
          } else {
            throw err;
          }
        }
      }

      // 4. Dispatch Payment Complete with Invoice & Certificate Details Email (Only on initial fulfillment)
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
            certificateNumber: certNumber,
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
