import { Router } from 'express';
import { Container } from '../../infrastructure/di/container';
import {
  paymentRateLimiter,
  paymentVerifyRateLimiter,
} from '../middlewares/rate-limiter.middleware';

const router = Router();

// GET /api/v1/payment/config - Public payment gateway config (public key, currency)
router.get('/config', (req, res, next) => Container.paymentController.getConfig(req, res, next));

// POST /api/v1/payment/create-order - Create Razorpay order for tree adoption checkout (Strict 5 per 10 min)
router.post('/create-order', paymentRateLimiter, (req, res, next) =>
  Container.paymentController.createOrder(req, res, next)
);

// POST /api/v1/payment/verify - Verify Razorpay payment signature (Strict 10 per 10 min)
router.post('/verify', paymentVerifyRateLimiter, (req, res, next) =>
  Container.paymentController.verifyPayment(req, res, next)
);

export const paymentRoutes = router;
