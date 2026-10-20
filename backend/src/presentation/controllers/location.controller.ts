import { Request, Response, NextFunction } from 'express';
import { CreateLocationUseCase } from '../../application/use-cases/locations/create-location.use-case';
import { GetLocationsUseCase } from '../../application/use-cases/locations/get-locations.use-case';
import { GetLocationByIdUseCase } from '../../application/use-cases/locations/get-location-by-id.use-case';
import { UpdateLocationUseCase } from '../../application/use-cases/locations/update-location.use-case';
import { DeleteLocationUseCase } from '../../application/use-cases/locations/delete-location.use-case';
import { ApiResponse } from '../../shared/utils/api-response';

export class LocationController {
  constructor(
    private readonly createLocationUseCase: CreateLocationUseCase,
    private readonly getLocationsUseCase: GetLocationsUseCase,
    private readonly getLocationByIdUseCase: GetLocationByIdUseCase,
    private readonly updateLocationUseCase: UpdateLocationUseCase,
    private readonly deleteLocationUseCase: DeleteLocationUseCase
  ) {}

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createLocationUseCase.execute(req.body);
      ApiResponse.created(res, result, 'Plantation reserve location created successfully');
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getLocationsUseCase.execute(req.query as any);
      ApiResponse.success(res, result, 'Plantation reserve locations retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.getLocationByIdUseCase.execute(id as string);
      ApiResponse.success(res, result, 'Plantation reserve location retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.updateLocationUseCase.execute(id as string, req.body);
      ApiResponse.success(res, result, 'Plantation reserve location updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.deleteLocationUseCase.execute(id as string);
      ApiResponse.success(res, { deleted: result }, 'Plantation reserve location deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
