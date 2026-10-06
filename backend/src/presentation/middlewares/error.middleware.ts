import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../../core/errors/app-error';
import { ApiResponse } from '../../shared/utils/api-response';
import { HttpStatus } from '../../shared/constants/http-status';
import { env } from '../../config/env';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response | void => {
  // Operational AppError (domain & application known errors)
  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.statusCode, err.errors);
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return ApiResponse.error(
      res,
      'Validation failed',
      HttpStatus.UNPROCESSABLE_ENTITY,
      formattedErrors
    );
  }

  // MongoDB duplicate key error (code 11000)
  if ('code' in err && (err as { code: number }).code === 11000) {
    const keyPattern = (err as { keyPattern?: Record<string, number> }).keyPattern;
    const field = keyPattern ? Object.keys(keyPattern)[0] : 'field';
    return ApiResponse.error(
      res,
      `A record with this ${field} already exists`,
      HttpStatus.CONFLICT
    );
  }

  // MongoDB CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return ApiResponse.error(res, 'Invalid resource identifier format', HttpStatus.BAD_REQUEST);
  }

  // Unhandled / unexpected internal server errors
  console.error('💥 Unhandled Error:', err);

  const message =
    env.NODE_ENV === 'production' ? 'Internal server error' : err.message;

  return ApiResponse.error(
    res,
    message,
    HttpStatus.INTERNAL_SERVER_ERROR,
    env.NODE_ENV === 'development' ? { stack: err.stack } : undefined
  );
};
