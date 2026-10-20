import { Order } from '../../../core/entities/order.entity';
import { IOrderDocument } from '../models/order.model';

export class OrderMapper {
  public static toDomain(doc: IOrderDocument): Order {
    return new Order({
      id: doc._id ? String(doc._id) : undefined,
      orderNumber: doc.orderNumber,
      invoiceNumber: doc.invoiceNumber,
      adopterName: doc.adopterName,
      adopterEmail: doc.adopterEmail,
      adopterPhone: doc.adopterPhone,
      billingAddress: doc.billingAddress
        ? {
            street: doc.billingAddress.street || '',
            city: doc.billingAddress.city || '',
            state: doc.billingAddress.state || '',
            country: doc.billingAddress.country || 'India',
            postalCode: doc.billingAddress.postalCode || '',
          }
        : undefined,
      items: Array.isArray(doc.items)
        ? doc.items.map((it: any) => ({
            treeVarietyId: it.treeVarietyId || '',
            treeSpecies: it.treeSpecies || '',
            scientificName: it.scientificName || '',
            category: it.category || '',
            planType: it.planType || '',
            reserveName: it.reserveName || '',
            gpsCoords: it.gpsCoords || '',
            quantity: Number(it.quantity) || 1,
            unitPrice: Number(it.unitPrice) || 0,
            subtotal: Number(it.subtotal) || 0,
          }))
        : [],
      treeSpecies: doc.treeSpecies,
      scientificName: doc.scientificName,
      category: doc.category,
      reserveName: doc.reserveName,
      gpsCoords: doc.gpsCoords,
      planType: doc.planType,
      dedicationMessage: doc.dedicationMessage,
      quantity: doc.quantity,
      totalAmount: doc.totalAmount,
      paymentMethod: doc.paymentMethod,
      paymentStatus: doc.paymentStatus,
      transactionRef: doc.transactionRef,
      status: doc.status,
      certificateId: doc.certificateId,
      ndviScore: doc.ndviScore,
      isRead: doc.isRead,
      notes: doc.notes,
      datePlanted: doc.datePlanted,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  public static toPersistence(entity: Order): Partial<IOrderDocument> {
    return {
      orderNumber: entity.orderNumber,
      invoiceNumber: entity.invoiceNumber,
      adopterName: entity.adopterName,
      adopterEmail: entity.adopterEmail,
      adopterPhone: entity.adopterPhone,
      billingAddress: entity.billingAddress,
      items: entity.items,
      treeSpecies: entity.treeSpecies,
      scientificName: entity.scientificName,
      category: entity.category,
      reserveName: entity.reserveName,
      gpsCoords: entity.gpsCoords,
      planType: entity.planType,
      dedicationMessage: entity.dedicationMessage,
      quantity: entity.quantity,
      totalAmount: entity.totalAmount,
      paymentMethod: entity.paymentMethod,
      paymentStatus: entity.paymentStatus,
      transactionRef: entity.transactionRef,
      status: entity.status,
      certificateId: entity.certificateId,
      ndviScore: entity.ndviScore,
      isRead: entity.isRead,
      notes: entity.notes,
      datePlanted: entity.datePlanted,
    };
  }
}
