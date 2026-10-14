import { Request, Response, NextFunction } from 'express';
import { CreateTreeVarietyUseCase } from '../../application/use-cases/tree-varieties/create-tree-variety.use-case';
import { GetTreeVarietiesUseCase } from '../../application/use-cases/tree-varieties/get-tree-varieties.use-case';
import { GetTreeVarietyByIdUseCase } from '../../application/use-cases/tree-varieties/get-tree-variety-by-id.use-case';
import { UpdateTreeVarietyUseCase } from '../../application/use-cases/tree-varieties/update-tree-variety.use-case';
import { DeleteTreeVarietyUseCase } from '../../application/use-cases/tree-varieties/delete-tree-variety.use-case';
import { ApiResponse } from '../../shared/utils/api-response';

export class TreeVarietyController {
  constructor(
    private readonly createTreeVarietyUseCase: CreateTreeVarietyUseCase,
    private readonly getTreeVarietiesUseCase: GetTreeVarietiesUseCase,
    private readonly getTreeVarietyByIdUseCase: GetTreeVarietyByIdUseCase,
    private readonly updateTreeVarietyUseCase: UpdateTreeVarietyUseCase,
    private readonly deleteTreeVarietyUseCase: DeleteTreeVarietyUseCase
  ) {}

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createTreeVarietyUseCase.execute(req.body);
      ApiResponse.created(res, result, 'Tree variety created successfully');
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getTreeVarietiesUseCase.execute(req.query as any);
      ApiResponse.success(res, result, 'Tree varieties retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.getTreeVarietyByIdUseCase.execute(id as string);
      ApiResponse.success(res, result, 'Tree variety retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.updateTreeVarietyUseCase.execute(id as string, req.body);
      ApiResponse.success(res, result, 'Tree variety updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.deleteTreeVarietyUseCase.execute(id as string);
      ApiResponse.success(res, { deleted: result }, 'Tree variety deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
