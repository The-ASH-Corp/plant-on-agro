import { Request, Response, NextFunction } from 'express';
import { GetLandingPageUseCase } from '../../application/use-cases/landing-page/get-landing-page.use-case';
import { UpdateLandingPageUseCase } from '../../application/use-cases/landing-page/update-landing-page.use-case';
import { ResetLandingPageUseCase } from '../../application/use-cases/landing-page/reset-landing-page.use-case';
import { ApiResponse } from '../../shared/utils/api-response';

export class LandingPageController {
  constructor(
    private readonly getLandingPageUseCase: GetLandingPageUseCase,
    private readonly updateLandingPageUseCase: UpdateLandingPageUseCase,
    private readonly resetLandingPageUseCase: ResetLandingPageUseCase
  ) {}

  public get = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getLandingPageUseCase.execute();
      ApiResponse.success(res, result, 'Landing page content retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.updateLandingPageUseCase.execute(req.body);
      ApiResponse.success(res, result, 'Landing page content updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public reset = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.resetLandingPageUseCase.execute();
      ApiResponse.success(res, result, 'Landing page content reset to defaults successfully');
    } catch (error) {
      next(error);
    }
  };
}
