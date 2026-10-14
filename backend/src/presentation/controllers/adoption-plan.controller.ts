import { Request, Response, NextFunction } from 'express';
import { CreateAdoptionPlanUseCase } from '../../application/use-cases/adoption-plans/create-adoption-plan.use-case';
import { GetAdoptionPlansUseCase } from '../../application/use-cases/adoption-plans/get-adoption-plans.use-case';
import { GetAdoptionPlanByIdUseCase } from '../../application/use-cases/adoption-plans/get-adoption-plan-by-id.use-case';
import { UpdateAdoptionPlanUseCase } from '../../application/use-cases/adoption-plans/update-adoption-plan.use-case';
import { DeleteAdoptionPlanUseCase } from '../../application/use-cases/adoption-plans/delete-adoption-plan.use-case';
import { ApiResponse } from '../../shared/utils/api-response';

export class AdoptionPlanController {
  constructor(
    private readonly createAdoptionPlanUseCase: CreateAdoptionPlanUseCase,
    private readonly getAdoptionPlansUseCase: GetAdoptionPlansUseCase,
    private readonly getAdoptionPlanByIdUseCase: GetAdoptionPlanByIdUseCase,
    private readonly updateAdoptionPlanUseCase: UpdateAdoptionPlanUseCase,
    private readonly deleteAdoptionPlanUseCase: DeleteAdoptionPlanUseCase
  ) {}

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createAdoptionPlanUseCase.execute(req.body);
      ApiResponse.created(res, result, 'Adoption plan created successfully');
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getAdoptionPlansUseCase.execute(req.query as any);
      ApiResponse.success(res, result, 'Adoption plans retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.getAdoptionPlanByIdUseCase.execute(id as string);
      ApiResponse.success(res, result, 'Adoption plan retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.updateAdoptionPlanUseCase.execute(id as string, req.body);
      ApiResponse.success(res, result, 'Adoption plan updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.deleteAdoptionPlanUseCase.execute(id as string);
      ApiResponse.success(res, { deleted: result }, 'Adoption plan deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
