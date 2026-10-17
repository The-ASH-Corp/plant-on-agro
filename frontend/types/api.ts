export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: ApiFieldError[] | string | unknown;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: unknown;
  };
  timestamp: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  limit: number;
  skip?: number;
  page?: number;
  totalPages?: number;
}


export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly fieldErrors: Record<string, string>;
  public readonly rawErrors?: unknown;
  public readonly isNetworkError: boolean;

  constructor(
    message: string,
    statusCode = 500,
    fieldErrors: Record<string, string> = {},
    rawErrors?: unknown,
    isNetworkError = false
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
    this.rawErrors = rawErrors;
    this.isNetworkError = isNetworkError;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
