import { VisitBooking, VisitBookingStatus } from '../../../core/entities/visit-booking.entity';
import { IVisitBookingDocument } from '../models/visit-booking.model';

export class VisitBookingMapper {
  public static toDomain(doc: IVisitBookingDocument): VisitBooking {
    return new VisitBooking({
      id: doc._id ? String(doc._id) : undefined,
      bookingReference: doc.bookingReference,
      adopterName: doc.adopterName,
      adopterEmail: doc.adopterEmail,
      adopterPhone: doc.adopterPhone,
      experienceId: doc.experienceId || undefined,
      experienceTitle: doc.experienceTitle,
      reserveName: doc.reserveName,
      visitDate: doc.visitDate,
      timeSlot: doc.timeSlot,
      numberOfGuests: doc.numberOfGuests,
      associatedTrees: doc.associatedTrees,
      specialRequests: doc.specialRequests,
      status: doc.status as VisitBookingStatus,
      guestPassCode: doc.guestPassCode,
      guideName: doc.guideName,
      notes: doc.notes,
      memories: Array.isArray(doc.memories)
        ? doc.memories.map((m: any) => ({
            imageUrl: m.imageUrl,
            caption: m.caption,
            recordedAt: m.recordedAt,
          }))
        : [],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  public static toPersistence(entity: VisitBooking): Partial<IVisitBookingDocument> {
    return {
      bookingReference: entity.bookingReference,
      adopterName: entity.adopterName,
      adopterEmail: entity.adopterEmail,
      adopterPhone: entity.adopterPhone,
      experienceId: entity.experienceId,
      experienceTitle: entity.experienceTitle,
      reserveName: entity.reserveName,
      visitDate: entity.visitDate,
      timeSlot: entity.timeSlot,
      numberOfGuests: entity.numberOfGuests,
      associatedTrees: entity.associatedTrees,
      specialRequests: entity.specialRequests,
      status: entity.status,
      guestPassCode: entity.guestPassCode,
      guideName: entity.guideName,
      notes: entity.notes,
      memories: entity.memories.map((m) => ({
        imageUrl: m.imageUrl,
        caption: m.caption || '',
        recordedAt: m.recordedAt || new Date(),
      })),
    };
  }
}
