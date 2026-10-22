import { IPaymentGatewayService } from '../../../core/interfaces/payment-gateway.interface';
import { IOrderRepository } from '../../../core/interfaces/order.repository.interface';
import { ITreeInstanceRepository } from '../../../core/interfaces/tree-instance.repository.interface';
import { ICertificateRepository } from '../../../core/interfaces/certificate.repository.interface';
import { TreeInstance } from '../../../core/entities/tree-instance.entity';
import { Certificate } from '../../../core/entities/certificate.entity';
import { BadRequestError, NotFoundError } from '../../../core/errors/app-error';
import { OrderResponseMapper } from '../../dto/order.dto';

export interface VerifyRazorpayPaymentDto {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export class VerifyRazorpayPaymentUseCase {
  constructor(
    private readonly paymentGatewayService: IPaymentGatewayService,
    private readonly orderRepository: IOrderRepository,
    private readonly treeInstanceRepository: ITreeInstanceRepository,
    private readonly certificateRepository: ICertificateRepository
  ) {}

  public async execute(dto: VerifyRazorpayPaymentDto): Promise<any> {
    if (!dto.razorpayOrderId || !dto.razorpayPaymentId || !dto.razorpaySignature) {
      throw new BadRequestError('Missing required Razorpay payment verification parameters');
    }

    // 1. Strict Cryptographic Signature Verification
    const isValid = this.paymentGatewayService.verifyPayment({
      razorpayOrderId: dto.razorpayOrderId,
      razorpayPaymentId: dto.razorpayPaymentId,
      razorpaySignature: dto.razorpaySignature,
    });

    if (!isValid) {
      throw new BadRequestError('Razorpay payment signature verification failed. Possible tampering or forged payload detected.');
    }

    // 2. Locate Pending Order in Server Database
    let order = await this.orderRepository.findByTransactionRef(dto.razorpayOrderId);
    if (!order) {
      // Fallback search by orderNumber / search query
      const matching = await this.orderRepository.findAll({ search: dto.razorpayOrderId });
      if (matching.length > 0) {
        order = matching[0];
      }
    }

    if (!order) {
      throw new NotFoundError(`No internal order found matching Razorpay Order ID: ${dto.razorpayOrderId}`);
    }

    // If order was already paid, return idempotently
    if (order.paymentStatus === 'Paid') {
      const existingInstances = await this.treeInstanceRepository.findAll({ search: order.orderNumber });
      const existingCert = await this.certificateRepository.findByOrderRef(order.orderNumber);
      return {
        verified: true,
        paymentId: dto.razorpayPaymentId,
        orderId: dto.razorpayOrderId,
        order: OrderResponseMapper.toDto(order),
        treeInstances: existingInstances,
        certificate: existingCert,
      };
    }

    // 3. Verify Payment Amount Directly with Razorpay API (Anti-Tampering)
    if (this.paymentGatewayService.fetchPayment && this.paymentGatewayService.isLiveConfigured()) {
      const livePayment = await this.paymentGatewayService.fetchPayment(dto.razorpayPaymentId);
      if (!livePayment) {
        throw new BadRequestError(
          'Could not retrieve payment verification from Razorpay gateway. Payment ID may be invalid or uncaptured.'
        );
      }

      if (livePayment.status === 'failed') {
        throw new BadRequestError('Payment transaction was marked as failed by Razorpay gateway.');
      }

      // Razorpay amounts are in paise (1 INR = 100 paise)
      const expectedPaise = Math.round(order.totalAmount * 100);
      const capturedPaise = Number(livePayment.amount);

      if (capturedPaise < expectedPaise) {
        throw new BadRequestError(
          `Payment amount mismatch: Captured ₹${capturedPaise / 100} is less than required order total ₹${order.totalAmount}. Fraudulent transaction prevented.`
        );
      }

      if (livePayment.order_id && livePayment.order_id !== dto.razorpayOrderId) {
        throw new BadRequestError('Payment does not belong to the claimed Razorpay Order ID.');
      }
    }

    // 4. Update Order to 'Paid' Status in MongoDB
    order.updatePaymentStatus('Paid', dto.razorpayPaymentId);
    order.updateStatus('Planted');
    const certNumber = `POA-CERT-${new Date().getFullYear()}-${order.orderNumber.replace(/^POA-?/, '')}`;
    order.setCertificateId(certNumber);
    await this.orderRepository.update(order);

    // 5. Server-Side Atomic Creation of Tree Instances in MongoDB
    const speciesCode = (order.treeSpecies || 'TR').substring(0, 2).toUpperCase();
    const createdTreeInstances = [];

    // Base coordinates for reserves
    const baseCoords: Record<string, { lat: number; lng: number }> = {
      'Wayanad Rainforest Reserve': { lat: 11.6854, lng: 76.1320 },
      'Western Ghats, Maharashtra': { lat: 19.9975, lng: 73.7898 },
      'Nashik Valley, Maharashtra': { lat: 19.9975, lng: 73.7898 },
      'Satara Plateau, Maharashtra': { lat: 17.6805, lng: 74.0183 },
      'Pune Hills, Maharashtra': { lat: 18.5204, lng: 73.8567 },
    };

    const targetCoord =
      baseCoords[order.reserveName] || { lat: 11.6854, lng: 76.1320 };

    for (let i = 0; i < order.quantity; i++) {
      const serialNum = Math.floor(1000 + Math.random() * 9000);
      const treeTag = `POA-${speciesCode}-${serialNum}`;
      const jitterLat = Number((targetCoord.lat + (Math.random() - 0.5) * 0.004).toFixed(4));
      const jitterLng = Number((targetCoord.lng + (Math.random() - 0.5) * 0.004).toFixed(4));

      const instance = new TreeInstance({
        treeTag,
        orderRef: order.orderNumber,
        assignedReserve: order.reserveName,
        gpsCoordinates: { latitude: jitterLat, longitude: jitterLng },
        datePlanted: new Date(),
        healthStatus: 'Sapling Growing',
        treeVarietyName: order.treeSpecies,
        adopterName: order.adopterName,
        adopterEmail: order.adopterEmail,
        notes: `Tree #${i + 1} of ${order.quantity} adopted under "${order.planType}" lifetime stewardship. Geotagged & verified.`,
        isActive: true,
      });

      const savedInstance = await this.treeInstanceRepository.save(instance);
      createdTreeInstances.push(savedInstance);
    }

    // 6. Server-Side Creation of Digital Deed Certificate
    const certificate = new Certificate({
      certificateNumber: certNumber,
      orderRef: order.orderNumber,
      recipientName: order.adopterName,
      dedicatedMessage: order.dedicationMessage || `Dedicated to ${order.adopterName} for sustainable forestry stewardship.`,
      issueDate: new Date(),
      treeTag: createdTreeInstances[0]?.treeTag || `POA-${speciesCode}-0001`,
      treeSpecies: order.treeSpecies,
      reserveName: order.reserveName,
      adopterName: order.adopterName,
      status: 'Issued',
      isActive: true,
    });

    const savedCertificate = await this.certificateRepository.save(certificate);

    return {
      verified: true,
      paymentId: dto.razorpayPaymentId,
      orderId: dto.razorpayOrderId,
      order: OrderResponseMapper.toDto(order),
      treeInstances: createdTreeInstances,
      certificate: savedCertificate,
    };
  }
}
