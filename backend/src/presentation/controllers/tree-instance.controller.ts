import { Request, Response, NextFunction } from 'express';
import { CreateTreeInstanceUseCase } from '../../application/use-cases/tree-instances/create-tree-instance.use-case';
import { GetTreeInstancesUseCase } from '../../application/use-cases/tree-instances/get-tree-instances.use-case';
import { GetTreeInstanceByIdUseCase } from '../../application/use-cases/tree-instances/get-tree-instance-by-id.use-case';
import { GetTreeInstanceByTagUseCase } from '../../application/use-cases/tree-instances/get-tree-instance-by-tag.use-case';
import { UpdateTreeInstanceUseCase } from '../../application/use-cases/tree-instances/update-tree-instance.use-case';
import { DeleteTreeInstanceUseCase } from '../../application/use-cases/tree-instances/delete-tree-instance.use-case';
import { TreeInstanceResponseDto } from '../../application/dto/tree-instance-response.dto';
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

  /**
   * Redacts buyer PII (adopterEmail, orderRef, personal adopterName) for unauthenticated guests
   * and for buyers viewing specimens that do not belong to them. Admins and owners receive full data.
   */
  private redactForRequester(req: Request, item: TreeInstanceResponseDto): TreeInstanceResponseDto {
    const user = req.user;
    if (user?.role === 'admin') {
      return item;
    }

    const userEmail = (user?.email || '').trim().toLowerCase();
    const itemEmail = (item.adopterEmail || '').trim().toLowerCase();
    if (user && userEmail && itemEmail && userEmail === itemEmail) {
      return item;
    }

    return {
      ...item,
      adopterEmail: '',
      orderRef: '',
      adopterName: item.adopterName ? 'Verified Adopter' : '',
    };
  }

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createTreeInstanceUseCase.execute(req.body);
      ApiResponse.created(res, result, 'Tree instance created successfully');
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query: Record<string, any> = { ...req.query };
      const user = req.user;

      if (!user) {
        // Prevent unauthenticated email/order enumeration via query filters
        delete query.adopterEmail;
        delete query.orderRef;
      } else if (user.role !== 'admin') {
        // Buyers cannot query other adopters' emails or orders
        if (query.adopterEmail) {
          query.adopterEmail = user.email;
        }
        if (query.orderRef) {
          query.adopterEmail = user.email;
        }
      }

      const result = await this.getTreeInstancesUseCase.execute(query as any);
      const sanitized = {
        ...result,
        items: result.items.map((item) => this.redactForRequester(req, item)),
      };
      ApiResponse.success(res, sanitized, 'Tree instances retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.getTreeInstanceByIdUseCase.execute(id as string);
      ApiResponse.success(res, this.redactForRequester(req, result), 'Tree instance retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getByTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tag } = req.params;
      const result = await this.getTreeInstanceByTagUseCase.execute(tag as string);
      ApiResponse.success(res, this.redactForRequester(req, result), 'Tree instance retrieved by tag successfully');
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
