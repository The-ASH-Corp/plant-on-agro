import { Request, Response, NextFunction } from 'express';
import { CreateCertificateUseCase } from '../../application/use-cases/certificates/create-certificate.use-case';
import { GetCertificatesUseCase } from '../../application/use-cases/certificates/get-certificates.use-case';
import { GetCertificateByIdUseCase } from '../../application/use-cases/certificates/get-certificate-by-id.use-case';
import { GetCertificateByNumberUseCase } from '../../application/use-cases/certificates/get-certificate-by-number.use-case';
import { VerifyCertificateUseCase } from '../../application/use-cases/certificates/verify-certificate.use-case';
import { UpdateCertificateUseCase } from '../../application/use-cases/certificates/update-certificate.use-case';
import { DeleteCertificateUseCase } from '../../application/use-cases/certificates/delete-certificate.use-case';
import { ApiResponse } from '../../shared/utils/api-response';

export class CertificateController {
  constructor(
    private readonly createCertificateUseCase: CreateCertificateUseCase,
    private readonly getCertificatesUseCase: GetCertificatesUseCase,
    private readonly getCertificateByIdUseCase: GetCertificateByIdUseCase,
    private readonly getCertificateByNumberUseCase: GetCertificateByNumberUseCase,
    private readonly verifyCertificateUseCase: VerifyCertificateUseCase,
    private readonly updateCertificateUseCase: UpdateCertificateUseCase,
    private readonly deleteCertificateUseCase: DeleteCertificateUseCase
  ) {}

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createCertificateUseCase.execute(req.body);
      ApiResponse.created(res, result, 'Certificate created successfully');
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getCertificatesUseCase.execute(req.query as any);
      ApiResponse.success(res, result, 'Certificates retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.getCertificateByIdUseCase.execute(id as string);
      ApiResponse.success(res, result, 'Certificate retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getByNumber = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const certificateNumber = (req.params.certificateNumber || req.params.number) as string;
      const result = await this.getCertificateByNumberUseCase.execute(certificateNumber);
      ApiResponse.success(res, result, 'Certificate retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public verify = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const identifier = (req.params.hashOrNumber || req.params.identifier) as string;
      const result = await this.verifyCertificateUseCase.execute(identifier);
      ApiResponse.success(res, result, 'Certificate verified successfully');
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.updateCertificateUseCase.execute(id as string, req.body);
      ApiResponse.success(res, result, 'Certificate updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.deleteCertificateUseCase.execute(id as string);
      ApiResponse.success(res, { deleted: result }, 'Certificate deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
