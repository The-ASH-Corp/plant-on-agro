import { Response } from 'express';
import { HttpStatus, HttpStatusCode } from '../constants/http-status';

export interface ApiResponsePayload<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: unknown;
  };
  timestamp: string;
}

export class ApiResponse {
  public static success<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode: HttpStatusCode = HttpStatus.OK,
    meta?: ApiResponsePayload['meta']
  ): Response {
    const payload: ApiResponsePayload<T> = {
      success: true,
      message,
      data,
      ...(meta && { meta }),
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }

  public static created<T>(
    res: Response,
    data: T,
    message = 'Created successfully'
  ): Response {
    return this.success(res, data, message, HttpStatus.CREATED);
  }

  public static error(
    res: Response,
    message = 'An unexpected error occurred',
    statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    errors?: unknown
  ): Response {
    const payload: ApiResponsePayload = {
      success: false,
      message,
      ...(errors ? { errors } : {}),
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }
}
