import { UserPayload } from '../../core/interfaces/jwt-service.interface';

export type Nullable<T> = T | null;

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
