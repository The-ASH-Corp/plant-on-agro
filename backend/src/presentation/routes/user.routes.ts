import { Router } from 'express';
import { Container } from '../../infrastructure/di/container';
import { validateRequest } from '../middlewares/validate.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
  createUserSchema,
  updateUserSchema,
  getUserByIdSchema,
  queryUsersSchema,
} from '../validators/user.validator';

const router = Router();

// GET /api/v1/users - List users with pagination (Admin only)
router.get(
  '/',
  authenticate,
  authorize('admin'),
  validateRequest({ query: queryUsersSchema }),
  Container.userController.getAll
);

// GET /api/v1/users/:id - Get user by ID (Authenticated)
router.get(
  '/:id',
  authenticate,
  validateRequest({ params: getUserByIdSchema }),
  Container.userController.getById
);

// POST /api/v1/users - Create user
router.post(
  '/',
  validateRequest({ body: createUserSchema }),
  Container.userController.create
);

// PUT /api/v1/users/:id - Update user (Authenticated)
router.put(
  '/:id',
  authenticate,
  validateRequest({
    params: getUserByIdSchema,
    body: updateUserSchema,
  }),
  Container.userController.update
);

// DELETE /api/v1/users/:id - Delete user (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest({ params: getUserByIdSchema }),
  Container.userController.delete
);

export const userRoutes = router;


