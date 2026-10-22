import { Request, Response, NextFunction } from 'express';
import { CreateExperienceUseCase } from '../../application/use-cases/experiences/create-experience.use-case';
import { GetExperiencesUseCase } from '../../application/use-cases/experiences/get-experiences.use-case';
import { GetExperienceByIdUseCase } from '../../application/use-cases/experiences/get-experience-by-id.use-case';
import { UpdateExperienceUseCase } from '../../application/use-cases/experiences/update-experience.use-case';
import { DeleteExperienceUseCase } from '../../application/use-cases/experiences/delete-experience.use-case';
import { ApiResponse } from '../../shared/utils/api-response';

export class ExperienceController {
  constructor(
    private readonly createExperienceUseCase: CreateExperienceUseCase,
    private readonly getExperiencesUseCase: GetExperiencesUseCase,
    private readonly getExperienceByIdUseCase: GetExperienceByIdUseCase,
    private readonly updateExperienceUseCase: UpdateExperienceUseCase,
    private readonly deleteExperienceUseCase: DeleteExperienceUseCase
  ) {}

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createExperienceUseCase.execute(req.body);
      ApiResponse.created(res, result, 'Experience created successfully');
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getExperiencesUseCase.execute(req.query as any);
      ApiResponse.success(res, result, 'Experiences retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.getExperienceByIdUseCase.execute(id as string);
      ApiResponse.success(res, result, 'Experience retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.updateExperienceUseCase.execute(id as string, req.body);
      ApiResponse.success(res, result, 'Experience updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.deleteExperienceUseCase.execute(id as string);
      ApiResponse.success(res, { deleted: result }, 'Experience deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
