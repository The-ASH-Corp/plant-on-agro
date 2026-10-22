import { Router } from 'express';
import { Container } from '../../infrastructure/di/container';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/v1/visits - Schedule / Book a plantation visit
router.post('/', (req, res, next) => Container.visitBookingController.create(req, res, next));

// GET /api/v1/visits/my-visits - Get visits for authenticated user or by email query
router.get('/my-visits', (req, res, next) => Container.visitBookingController.getMyVisits(req, res, next));

// GET /api/v1/visits - List all visits with filtering (Admin)
router.get(
  '/',
  authenticate,
  authorize('admin'),
  (req, res, next) => Container.visitBookingController.getAll(req, res, next)
);

// GET /api/v1/visits/:id - Get specific visit details by ID or booking reference
router.get('/:id', (req, res, next) => Container.visitBookingController.getById(req, res, next));

// PATCH /api/v1/visits/:id/status - Update visit booking status / guide assignment (Admin)
router.patch(
  '/:id/status',
  authenticate,
  authorize('admin'),
  (req, res, next) => Container.visitBookingController.updateStatus(req, res, next)
);

// POST /api/v1/visits/:id/memories - Add memory photos & notes to visit
router.post(
  '/:id/memories',
  (req, res, next) => Container.visitBookingController.addMemories(req, res, next)
);

// DELETE /api/v1/visits/:id - Cancel / delete booking (Admin)
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  (req, res, next) => Container.visitBookingController.delete(req, res, next)
);

export const visitBookingRoutes = router;
