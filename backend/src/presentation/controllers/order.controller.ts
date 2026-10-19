import { Request, Response, NextFunction } from 'express';
import { CreateOrderUseCase } from '../../application/use-cases/orders/create-order.use-case';
import { GetOrdersUseCase } from '../../application/use-cases/orders/get-orders.use-case';
import { GetOrderByIdUseCase } from '../../application/use-cases/orders/get-order-by-id.use-case';
import { GetOrderByNumberUseCase } from '../../application/use-cases/orders/get-order-by-number.use-case';
import { UpdateOrderStatusUseCase } from '../../application/use-cases/orders/update-order-status.use-case';
import { MarkOrdersReadUseCase } from '../../application/use-cases/orders/mark-orders-read.use-case';
import { DeleteOrderUseCase } from '../../application/use-cases/orders/delete-order.use-case';
import { ApiResponse } from '../../shared/utils/api-response';

export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrdersUseCase: GetOrdersUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly getOrderByNumberUseCase: GetOrderByNumberUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly markOrdersReadUseCase: MarkOrdersReadUseCase,
    private readonly deleteOrderUseCase: DeleteOrderUseCase
  ) {}

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createOrderUseCase.execute(req.body);
      ApiResponse.created(res, result, 'Tree adoption and plantation order logged successfully');
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { limit, skip, ...filter } = req.query;
      // Multi-tenant & buyer security guard: restrict buyers to their own email
      if (req.user && req.user.role === 'buyer') {
        (filter as any).adopterEmail = req.user.email;
      }
      const numLimit = limit !== undefined ? Number(limit) : 50;
      const numSkip = skip !== undefined ? Number(skip) : 0;
      const result = await this.getOrdersUseCase.execute(filter as any, numLimit, numSkip);
      ApiResponse.success(res, result, 'Adoption orders retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.getOrderByIdUseCase.execute(id as string);
      ApiResponse.success(res, result, 'Order retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getByNumber = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { orderNumber } = req.params;
      const result = await this.getOrderByNumberUseCase.execute(orderNumber as string);
      ApiResponse.success(res, result, 'Order retrieved by number successfully');
    } catch (error) {
      next(error);
    }
  };

  public updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, notes, gpsCoords } = req.body;
      const result = await this.updateOrderStatusUseCase.execute(
        id as string,
        status,
        notes,
        gpsCoords
      );
      ApiResponse.success(res, result, `Order status updated to "${status}" successfully`);
    } catch (error) {
      next(error);
    }
  };

  public markAllAsRead = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.markOrdersReadUseCase.execute();
      ApiResponse.success(res, result, 'All new orders marked as reviewed');
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.deleteOrderUseCase.execute(id as string);
      ApiResponse.success(res, null, 'Order deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
