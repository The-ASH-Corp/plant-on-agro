import { Router } from 'express';
import { Container } from '../../infrastructure/di/container';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  createAdoptionPlanSchema,
  updateAdoptionPlanSchema,
  getAdoptionPlanByIdSchema,
  queryAdoptionPlansSchema,
} from '../validators/adoption-plan.validator';

const router = Router();

// GET /api/v1/adoption-plans - List plans with filters & pagination
router.get(
  '/',
  validateRequest({ query: queryAdoptionPlansSchema }),
  Container.adoptionPlanController.getAll
);

// GET /api/v1/adoption-plans/:id - Get single plan by ID
router.get(
  '/:id',
  validateRequest({ params: getAdoptionPlanByIdSchema }),
  Container.adoptionPlanController.getById
);

// POST /api/v1/adoption-plans - Create a new plan
router.post(
  '/',
  validateRequest({ body: createAdoptionPlanSchema }),
  Container.adoptionPlanController.create
);

// PUT /api/v1/adoption-plans/:id - Update an existing plan
router.put(
  '/:id',
  validateRequest({
    params: getAdoptionPlanByIdSchema,
    body: updateAdoptionPlanSchema,
  }),
  Container.adoptionPlanController.update
);

// DELETE /api/v1/adoption-plans/:id - Delete a plan
router.delete(
  '/:id',
  validateRequest({ params: getAdoptionPlanByIdSchema }),
  Container.adoptionPlanController.delete
);

export const adoptionPlanRoutes = router;
