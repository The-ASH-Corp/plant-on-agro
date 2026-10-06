import { Router } from 'express';
import { Container } from '../../infrastructure/di/container';
import { validateRequest } from '../middlewares/validate.middleware';
import { createUserSchema, getUserByIdSchema } from '../validators/user.validator';

const router = Router();

router.post(
  '/',
  validateRequest({ body: createUserSchema }),
  Container.userController.create
);

router.get(
  '/:id',
  validateRequest({ params: getUserByIdSchema }),
  Container.userController.getById
);

export const userRoutes = router;
