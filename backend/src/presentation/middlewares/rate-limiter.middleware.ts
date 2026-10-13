import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../../shared/utils/api-response';
import { HttpStatus } from '../../shared/constants/http-status';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  limit: 10,                 // Limit each IP to 10 registration attempts per window
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (_req, res) => {
    ApiResponse.error(
      res,
      'Too many registration attempts from this IP address. Please try again after 15 minutes.',
      HttpStatus.TOO_MANY_REQUESTS
    );
  },
});
