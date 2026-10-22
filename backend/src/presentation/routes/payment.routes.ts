import { Router } from 'express';
import { Container } from '../../infrastructure/di/container';

const router = Router();

// GET /api/v1/payment/config - Public payment gateway config (public key, currency)
router.get('/config', (req, res, next) => Container.paymentController.getConfig(req, res, next));

// POST /api/v1/payment/create-order - Create Razorpay order for tree adoption checkout
router.post('/create-order', (req, res, next) => Container.paymentController.createOrder(req, res, next));

// POST /api/v1/payment/verify - Verify Razorpay payment signature
router.post('/verify', (req, res, next) => Container.paymentController.verifyPayment(req, res, next));

export const paymentRoutes = router;
