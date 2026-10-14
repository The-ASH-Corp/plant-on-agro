import { Request, Response, NextFunction } from 'express';
import { CreateTreeInstanceUseCase } from '../../application/use-cases/tree-instances/create-tree-instance.use-case';
import { GetTreeInstancesUseCase } from '../../application/use-cases/tree-instances/get-tree-instances.use-case';
import { GetTreeInstanceByIdUseCase } from '../../application/use-cases/tree-instances/get-tree-instance-by-id.use-case';
import { GetTreeInstanceByTagUseCase } from '../../application/use-cases/tree-instances/get-tree-instance-by-tag.use-case';
import { UpdateTreeInstanceUseCase } from '../../application/use-cases/tree-instances/update-tree-instance.use-case';
import { DeleteTreeInstanceUseCase } from '../../application/use-cases/tree-instances/delete-tree-instance.use-case';
import { ApiResponse } from '../../shared/utils/api-response';

export class TreeInstanceController {
  constructor(
    private readonly createTreeInstanceUseCase: CreateTreeInstanceUseCase,
    private readonly getTreeInstancesUseCase: GetTreeInstancesUseCase,
    private readonly getTreeInstanceByIdUseCase: GetTreeInstanceByIdUseCase,
    private readonly getTreeInstanceByTagUseCase: GetTreeInstanceByTagUseCase,
    private readonly updateTreeInstanceUseCase: UpdateTreeInstanceUseCase,
    private readonly deleteTreeInstanceUseCase: DeleteTreeInstanceUseCase
  ) {}

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createTreeInstanceUseCase.execute(req.body);
      ApiResponse.created(res, result, 'Tree instance created and geotagged successfully');
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getTreeInstancesUseCase.execute(req.query as any);
      ApiResponse.success(res, result, 'Tree instances retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.getTreeInstanceByIdUseCase.execute(id as string);
      ApiResponse.success(res, result, 'Tree instance retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getByTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tag } = req.params;
      const result = await this.getTreeInstanceByTagUseCase.execute(tag as string);
      ApiResponse.success(res, result, 'Tree instance retrieved by tag successfully');
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.updateTreeInstanceUseCase.execute(id as string, req.body);
      ApiResponse.success(res, result, 'Tree instance updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.deleteTreeInstanceUseCase.execute(id as string);
      ApiResponse.success(res, { deleted: result }, 'Tree instance deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
