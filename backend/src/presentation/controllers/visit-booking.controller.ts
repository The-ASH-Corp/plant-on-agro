import { Request, Response, NextFunction } from 'express';
import { CreateVisitBookingUseCase } from '../../application/use-cases/visits/create-visit-booking.use-case';
import { GetVisitBookingsUseCase } from '../../application/use-cases/visits/get-visit-bookings.use-case';
import { GetVisitBookingByIdUseCase } from '../../application/use-cases/visits/get-visit-booking-by-id.use-case';
import { GetMyVisitsUseCase } from '../../application/use-cases/visits/get-my-visits.use-case';
import { UpdateVisitStatusUseCase } from '../../application/use-cases/visits/update-visit-status.use-case';
import { AddVisitMemoryUseCase } from '../../application/use-cases/visits/add-visit-memory.use-case';
import { DeleteVisitBookingUseCase } from '../../application/use-cases/visits/delete-visit-booking.use-case';
import { ApiResponse } from '../../shared/utils/api-response';
import { ForbiddenError, UnauthorizedError } from '../../core/errors/app-error';

export class VisitBookingController {
  constructor(
    private readonly createVisitBookingUseCase: CreateVisitBookingUseCase,
    private readonly getVisitBookingsUseCase: GetVisitBookingsUseCase,
    private readonly getVisitBookingByIdUseCase: GetVisitBookingByIdUseCase,
    private readonly getMyVisitsUseCase: GetMyVisitsUseCase,
    private readonly updateVisitStatusUseCase: UpdateVisitStatusUseCase,
    private readonly addVisitMemoryUseCase: AddVisitMemoryUseCase,
    private readonly deleteVisitBookingUseCase: DeleteVisitBookingUseCase
  ) {}

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError('Authentication required to schedule a plantation visit');
      }

      // Non-admin users can only book visits under their own authenticated email
      const effectiveEmail =
        user.role === 'admin' && req.body.adopterEmail
          ? req.body.adopterEmail
          : user.email;

      const payload = {
        ...req.body,
        adopterEmail: effectiveEmail,
        adopterName: req.body.adopterName || (user as any).name,
      };

      const result = await this.createVisitBookingUseCase.execute(payload);
      ApiResponse.created(res, result, 'Visit booking scheduled successfully! Your visitor pass has been generated.');
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getVisitBookingsUseCase.execute(req.query as any);
      ApiResponse.success(res, result, 'Visit bookings retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getMyVisits = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError('Authentication required to view visit bookings');
      }

      // Buyers can strictly view only their own email; admins may pass ?email=
      const email =
        user.role === 'admin' && typeof req.query.email === 'string' && req.query.email.trim()
          ? req.query.email.trim()
          : user.email;

      const result = await this.getMyVisitsUseCase.execute(email);
      ApiResponse.success(res, result, 'Your scheduled visits retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError('Authentication required to view visit booking');
      }

      const { id } = req.params;
      const result = await this.getVisitBookingByIdUseCase.execute(id as string);

      if (user.role !== 'admin') {
        const bookingEmail = (result.adopterEmail || '').trim().toLowerCase();
        const userEmail = (user.email || '').trim().toLowerCase();
        if (!userEmail || bookingEmail !== userEmail) {
          throw new ForbiddenError('Access denied: You can only view your own visit bookings');
        }
      }

      ApiResponse.success(res, result, 'Visit booking retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.updateVisitStatusUseCase.execute(id as string, req.body);
      ApiResponse.success(res, result, 'Visit booking status updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public addMemories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.addVisitMemoryUseCase.execute(id as string, req.body, req.user);
      ApiResponse.success(res, result, 'Visit memories recorded successfully');
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.deleteVisitBookingUseCase.execute(id as string);
      ApiResponse.success(res, { deleted: result }, 'Visit booking cancelled/deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
