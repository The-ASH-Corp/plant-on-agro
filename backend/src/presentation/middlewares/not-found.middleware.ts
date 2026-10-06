import { Request, Response } from 'express';
import { ApiResponse } from '../../shared/utils/api-response';
import { HttpStatus } from '../../shared/constants/http-status';

export const notFoundHandler = (req: Request, res: Response): Response => {
  return ApiResponse.error(
    res,
    `Cannot ${req.method} ${req.originalUrl} - Route not found`,
    HttpStatus.NOT_FOUND
  );
};
