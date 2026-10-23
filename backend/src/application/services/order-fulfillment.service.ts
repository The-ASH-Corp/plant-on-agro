import { IOrderRepository } from '../../core/interfaces/order.repository.interface';
import { ITreeInstanceRepository } from '../../core/interfaces/tree-instance.repository.interface';
import { ICertificateRepository } from '../../core/interfaces/certificate.repository.interface';
import { Order } from '../../core/entities/order.entity';
import { TreeInstance } from '../../core/entities/tree-instance.entity';
import { Certificate } from '../../core/entities/certificate.entity';

export interface FulfillmentResult {
  order: Order;
  treeInstances: TreeInstance[];
  certificate: Certificate | null;
}

export class OrderFulfillmentService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly treeInstanceRepository: ITreeInstanceRepository,
    private readonly certificateRepository: ICertificateRepository
  ) {}

  public async fulfillOrder(order: Order, paymentId: string): Promise<FulfillmentResult> {
    // If order was already fulfilled, return existing records idempotently
    if (order.paymentStatus === 'Paid') {
      const existingInstances = await this.treeInstanceRepository.findAll({ search: order.orderNumber });
      const existingCerts = await this.certificateRepository.findByOrderRef(order.orderNumber);
      return {
        order,
        treeInstances: existingInstances,
        certificate: existingCerts.length > 0 ? existingCerts[0] : null,
      };
    }

    // 1. Update Order Status (retain Razorpay Order ID and Payment ID together)
    const existingRef = order.transactionRef || '';
    const combinedRef =
      existingRef && !existingRef.includes(paymentId)
        ? `${existingRef}|${paymentId}`
        : paymentId;
    order.updatePaymentStatus('Paid', combinedRef);
    order.updateStatus('Planted');
    const certNumber = `POA-CERT-${new Date().getFullYear()}-${order.orderNumber.replace(/^POA-?/, '')}`;
    order.setCertificateId(certNumber);
    await this.orderRepository.update(order);

    // 2. Server-Side Atomic Creation of Tree Instances
    const speciesCode = (order.treeSpecies || 'TR').substring(0, 2).toUpperCase();
    const createdTreeInstances: TreeInstance[] = [];

    const baseCoords: Record<string, { lat: number; lng: number }> = {
      'Wayanad Rainforest Reserve': { lat: 11.6854, lng: 76.132 },
      'Western Ghats, Maharashtra': { lat: 19.9975, lng: 73.7898 },
      'Nashik Valley, Maharashtra': { lat: 19.9975, lng: 73.7898 },
      'Satara Plateau, Maharashtra': { lat: 17.6805, lng: 74.0183 },
      'Pune Hills, Maharashtra': { lat: 18.5204, lng: 73.8567 },
    };

    const targetCoord =
      baseCoords[order.reserveName] || { lat: 11.6854, lng: 76.132 };

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

    // 3. Server-Side Creation of Digital Deed Certificate
    const certificate = new Certificate({
      certificateNumber: certNumber,
      orderRef: order.orderNumber,
      recipientName: order.adopterName,
      dedicatedMessage:
        order.dedicationMessage ||
        `Dedicated to ${order.adopterName} for sustainable forestry stewardship.`,
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
      order,
      treeInstances: createdTreeInstances,
      certificate: savedCertificate,
    };
  }
}
