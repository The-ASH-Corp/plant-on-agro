import { Request, Response } from 'express';
import rateLimit, { Options } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redisClient } from '../../infrastructure/redis/redis.client';
import { ApiResponse } from '../../shared/utils/api-response';
import { HttpStatus } from '../../shared/constants/http-status';
import { normalizeEmail } from '../../shared/utils/string.util';

/**
 * Normalizes client IP addresses by unwrapping IPv6-mapped IPv4 addresses (::ffff:x.x.x.x)
 */
export function getClientIp(req: Request): string {
  // If behind a trusted reverse proxy (e.g. Nginx, Cloudflare, AWS ALB)
  const cfConnectingIp = req.headers['cf-connecting-ip'];
  if (typeof cfConnectingIp === 'string' && cfConnectingIp.trim().length > 0) {
    return normalizeIp(cfConnectingIp);
  }

  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim().length > 0) {
    const firstIp = forwarded.split(',')[0].trim();
    if (firstIp) return normalizeIp(firstIp);
  }

  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim().length > 0) {
    return normalizeIp(realIp);
  }

  return normalizeIp(req.ip || req.socket?.remoteAddress || '127.0.0.1');
}

function normalizeIp(ip: string): string {
  const trimmed = ip.trim();
  if (trimmed.startsWith('::ffff:')) {
    return trimmed.substring(7);
  }
  return trimmed;
}

/**
 * Normalizes target account identifier (email) for targeted account abuse protection
 */
export function getEmailIdentifier(req: Request): string {
  const rawEmail = req.body?.email || req.query?.email || req.params?.email;
  if (typeof rawEmail === 'string' && rawEmail.trim().length > 0) {
    return `email:${normalizeEmail(rawEmail)}`;
  }
  return `ip:${getClientIp(req)}`;
}

/**
 * Helper to build Redis stores with standardized prefixing
 */
function createRedisStore(prefix: string): RedisStore {
  return new RedisStore({
    sendCommand: (command: string, ...args: string[]) =>
      redisClient.call(command, ...args) as Promise<any>,
    prefix: `poa:rl:${prefix}:`,
  });
}

/**
 * 1. Global API Rate Limiter
 * - Window: 15 minutes
 * - Limit: 600 requests per IP
 * - Skips: CORS preflight (OPTIONS), health check (/health), static uploads (/uploads)
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  store: createRedisStore('global'),
  keyGenerator: (req) => getClientIp(req),
  skip: (req) =>
    req.method === 'OPTIONS' ||
    req.path === '/health' ||
    req.originalUrl?.includes('/health') ||
    req.originalUrl?.startsWith('/uploads'),
  handler: (_req: Request, res: Response) => {
    ApiResponse.error(
      res,
      'Too many requests from this IP address. Please slow down and try again later.',
      HttpStatus.TOO_MANY_REQUESTS
    );
  },
});

/**
 * 2. Authentication Rate Limiter (Login & Registration)
 * - Window: 15 minutes
 * - Limit: 10 attempts per IP
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  store: createRedisStore('auth'),
  keyGenerator: (req) => getClientIp(req),
  handler: (_req: Request, res: Response) => {
    ApiResponse.error(
      res,
      'Too many authentication attempts from this IP address. For your security, please wait 15 minutes before trying again.',
      HttpStatus.TOO_MANY_REQUESTS
    );
  },
});

/**
 * 3. OTP Request Rate Limiters (Dual-Layer: IP + Target Email)
 * - Protects against SMS/email flooding, harassment, and botnet spam
 */
const otpRequestIpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 10,                 // Max 10 requests per hour per IP
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  store: createRedisStore('otp_req_ip'),
  keyGenerator: (req) => getClientIp(req),
  handler: (_req: Request, res: Response) => {
    ApiResponse.error(
      res,
      'Too many verification code requests from this device/IP. Please wait an hour before requesting another code.',
      HttpStatus.TOO_MANY_REQUESTS
    );
  },
});

const otpRequestEmailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5,                  // Max 5 OTP requests per hour per email address
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  store: createRedisStore('otp_req_email'),
  keyGenerator: (req) => getEmailIdentifier(req),
  handler: (_req: Request, res: Response) => {
    ApiResponse.error(
      res,
      'Too many verification codes requested for this email address. Please check your inbox or wait before requesting another code.',
      HttpStatus.TOO_MANY_REQUESTS
    );
  },
});

export const otpRequestRateLimiter = [otpRequestIpLimiter, otpRequestEmailLimiter];

/**
 * 4. OTP Verification Rate Limiters (Dual-Layer: IP + Target Email)
 * - Protects against 6-digit brute-force enumeration attacks
 */
const otpVerifyIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 15,                 // Max 15 verification submissions per 15 min per IP
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  store: createRedisStore('otp_ver_ip'),
  keyGenerator: (req) => getClientIp(req),
  handler: (_req: Request, res: Response) => {
    ApiResponse.error(
      res,
      'Too many verification attempts from this IP address. Please wait 15 minutes before trying again.',
      HttpStatus.TOO_MANY_REQUESTS
    );
  },
});

const otpVerifyEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,                 // Max 10 verification submissions per 15 min per email
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  store: createRedisStore('otp_ver_email'),
  keyGenerator: (req) => getEmailIdentifier(req),
  handler: (_req: Request, res: Response) => {
    ApiResponse.error(
      res,
      'Too many verification attempts for this account. Please request a new verification code or wait 15 minutes.',
      HttpStatus.TOO_MANY_REQUESTS
    );
  },
});

export const otpVerifyRateLimiter = [otpVerifyIpLimiter, otpVerifyEmailLimiter];

/**
 * 5. Password Reset Submission Rate Limiter
 * - Window: 15 minutes
 * - Limit: 5 submissions per IP
 */
export const passwordResetRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  store: createRedisStore('reset_pwd'),
  keyGenerator: (req) => getClientIp(req),
  handler: (_req: Request, res: Response) => {
    ApiResponse.error(
      res,
      'Too many password reset submissions. Please wait 15 minutes before trying again.',
      HttpStatus.TOO_MANY_REQUESTS
    );
  },
});

/**
 * 6. Payment Order Creation Rate Limiter
 * - Window: 10 minutes
 * - Limit: 10 orders per IP
 */
export const paymentRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  store: createRedisStore('pay_order'),
  keyGenerator: (req) => getClientIp(req),
  handler: (_req: Request, res: Response) => {
    ApiResponse.error(
      res,
      'Too many payment order attempts from this IP address. Please wait 10 minutes before initiating another transaction.',
      HttpStatus.TOO_MANY_REQUESTS
    );
  },
});

/**
 * 7. Payment Verification Rate Limiter
 * - Window: 10 minutes
 * - Limit: 15 verifications per IP
 */
export const paymentVerifyRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 15,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  store: createRedisStore('pay_verify'),
  keyGenerator: (req) => getClientIp(req),
  handler: (_req: Request, res: Response) => {
    ApiResponse.error(
      res,
      'Too many payment verification attempts from this IP address. Please wait before trying again.',
      HttpStatus.TOO_MANY_REQUESTS
    );
  },
});
