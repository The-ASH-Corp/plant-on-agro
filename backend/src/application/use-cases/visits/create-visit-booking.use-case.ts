import { IVisitBookingRepository } from '../../../core/interfaces/visit-booking.repository.interface';
import { ITreeInstanceRepository } from '../../../core/interfaces/tree-instance.repository.interface';
import { IOrderRepository } from '../../../core/interfaces/order.repository.interface';
import { IMailService } from '../../../core/interfaces/mail-service.interface';
import { VisitBooking } from '../../../core/entities/visit-booking.entity';
import { BadRequestError } from '../../../core/errors/app-error';

export interface CreateVisitBookingDto {
  adopterName: string;
  adopterEmail: string;
  adopterPhone?: string;
  experienceId?: string;
  experienceTitle?: string;
  reserveName: string;
  visitDate: string; // YYYY-MM-DD
  timeSlot: string;
  numberOfGuests?: number;
  associatedTrees?: string[];
  specialRequests?: string;
}

export class CreateVisitBookingUseCase {
  constructor(
    private readonly visitBookingRepository: IVisitBookingRepository,
    private readonly treeInstanceRepository?: ITreeInstanceRepository,
    private readonly orderRepository?: IOrderRepository,
    private readonly mailService?: IMailService
  ) {}

  public async execute(dto: CreateVisitBookingDto): Promise<VisitBooking> {
    const email = (dto.adopterEmail || '').trim().toLowerCase();
    if (!email) {
      throw new BadRequestError('An adopter email is required to schedule a plantation visit.');
    }

    // Verify client has completed at least one tree adoption / purchase
    if (this.treeInstanceRepository && this.orderRepository) {
      const instances = await this.treeInstanceRepository.findAll({ search: email });
      const hasAdoptedTree = instances.some(
        (t) => t.adopterEmail && t.adopterEmail.trim().toLowerCase() === email
      );

      if (!hasAdoptedTree) {
        const orders = await this.orderRepository.findAll({ search: email });
        const hasPaidOrder = orders.some(
          (o) =>
            o.adopterEmail &&
            o.adopterEmail.trim().toLowerCase() === email &&
            o.paymentStatus === 'Paid'
        );

        if (!hasPaidOrder) {
          throw new BadRequestError(
            'Plantation visits are an exclusive benefit reserved for patrons who have already adopted a tree. Please adopt a tree first to unlock complimentary visits.'
          );
        }
      }
    }
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const dateCode = dto.visitDate.replace(/-/g, '').slice(2);
    const bookingReference = `VB-${dateCode}-${randomSuffix}`;
    const guestPassCode = `PASS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const booking = new VisitBooking({
      bookingReference,
      adopterName: dto.adopterName,
      adopterEmail: dto.adopterEmail,
      adopterPhone: dto.adopterPhone,
      experienceId: dto.experienceId,
      experienceTitle: dto.experienceTitle || 'General Plantation & Agro-Forest Visit',
      reserveName: dto.reserveName,
      visitDate: dto.visitDate,
      timeSlot: dto.timeSlot,
      numberOfGuests: dto.numberOfGuests ?? 1,
      associatedTrees: dto.associatedTrees ?? [],
      specialRequests: dto.specialRequests,
      status: 'Confirmed',
      guestPassCode,
      memories: [],
    });

    const savedBooking = await this.visitBookingRepository.save(booking);

    if (this.mailService && dto.adopterEmail) {
      this.mailService
        .sendVisitBookingConfirmationEmail({
          to: dto.adopterEmail,
          adopterName: dto.adopterName,
          bookingReference,
          visitDate: dto.visitDate,
          timeSlot: dto.timeSlot,
          reserveName: dto.reserveName,
          numberOfGuests: dto.numberOfGuests ?? 1,
          experienceTitle: dto.experienceTitle,
          guestPassCode,
        })
        .catch((err) => console.error('Failed to dispatch visit booking confirmation email:', err));
    }

    return savedBooking;
  }
}
