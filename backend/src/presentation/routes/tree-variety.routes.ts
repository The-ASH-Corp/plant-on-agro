import { Router } from 'express';
import { Container } from '../../infrastructure/di/container';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  createTreeVarietySchema,
  updateTreeVarietySchema,
  getTreeVarietyByIdSchema,
  queryTreeVarietiesSchema,
} from '../validators/tree-variety.validator';

const router = Router();

// GET /api/v1/tree-varieties - List trees with filtering and pagination
router.get(
  '/',
  validateRequest({ query: queryTreeVarietiesSchema }),
  Container.treeVarietyController.getAll
);

// GET /api/v1/tree-varieties/:id - Get single tree by ID
router.get(
  '/:id',
  validateRequest({ params: getTreeVarietyByIdSchema }),
  Container.treeVarietyController.getById
);

// POST /api/v1/tree-varieties - Create a new tree variety
router.post(
  '/',
  validateRequest({ body: createTreeVarietySchema }),
  Container.treeVarietyController.create
);

// PUT /api/v1/tree-varieties/:id - Update an existing tree variety
router.put(
  '/:id',
  validateRequest({
    params: getTreeVarietyByIdSchema,
    body: updateTreeVarietySchema,
  }),
  Container.treeVarietyController.update
);

// DELETE /api/v1/tree-varieties/:id - Delete a tree variety
router.delete(
  '/:id',
  validateRequest({ params: getTreeVarietyByIdSchema }),
  Container.treeVarietyController.delete
);

export const treeVarietyRoutes = router;
