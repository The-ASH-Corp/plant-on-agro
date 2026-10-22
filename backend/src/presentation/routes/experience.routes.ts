import { Router } from 'express';
import { Container } from '../../infrastructure/di/container';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/v1/experiences - List active experiences (Public)
router.get('/', (req, res, next) => Container.experienceController.getAll(req, res, next));

// GET /api/v1/experiences/:id - Get single experience by ID or slug (Public)
router.get('/:id', (req, res, next) => Container.experienceController.getById(req, res, next));

// POST /api/v1/experiences - Create new experience (Admin)
router.post(
  '/',
  authenticate,
  authorize('admin'),
  (req, res, next) => Container.experienceController.create(req, res, next)
);

// PUT /api/v1/experiences/:id - Update experience (Admin)
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  (req, res, next) => Container.experienceController.update(req, res, next)
);

// DELETE /api/v1/experiences/:id - Delete experience (Admin)
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  (req, res, next) => Container.experienceController.delete(req, res, next)
);

export const experienceRoutes = router;
