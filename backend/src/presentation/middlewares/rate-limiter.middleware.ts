import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../../shared/utils/api-response';
import { HttpStatus } from '../../shared/constants/http-status';


export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  limit: 100,               // Limit each IP to 100 requests per window
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: (req) => req.path === '/health' || req.originalUrl?.includes('/health'),
  handler: (_req, res) => {
    ApiResponse.error(
      res,
      'Too many requests from this IP address. Please try again after 15 minutes.',
      HttpStatus.TOO_MANY_REQUESTS
    );
  },
});


export const paymentRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10-minute window
  limit: 5,                  // Limit each IP to 5 order creations per window
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (_req, res) => {
    ApiResponse.error(
      res,
      'Too many payment order attempts from this IP address. Please wait 10 minutes before initiating another transaction.',
      HttpStatus.TOO_MANY_REQUESTS
    );
  },
});

export const paymentVerifyRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10-minute window
  limit: 10,                 // Limit each IP to 10 verification attempts per window
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (_req, res) => {
    ApiResponse.error(
      res,
      'Too many payment verification attempts from this IP address. Please wait before trying again.',
      HttpStatus.TOO_MANY_REQUESTS
    );
  },
});


export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  limit: 10,                 // Limit each IP to 10 registration / login attempts per window
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (_req, res) => {
    ApiResponse.error(
      res,
      'Too many authentication attempts from this IP address. Please try again after 15 minutes.',
      HttpStatus.TOO_MANY_REQUESTS
    );
  },
});
