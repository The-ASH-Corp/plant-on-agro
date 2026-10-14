import { Router } from 'express';
import { Container } from '../../infrastructure/di/container';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  createTreeInstanceSchema,
  updateTreeInstanceSchema,
  getTreeInstanceByIdSchema,
  getTreeInstanceByTagSchema,
  queryTreeInstancesSchema,
} from '../validators/tree-instance.validator';

const router = Router();

// GET /api/v1/tree-instances - List tree instances with filters and pagination
router.get(
  '/',
  validateRequest({ query: queryTreeInstancesSchema }),
  Container.treeInstanceController.getAll
);

// GET /api/v1/tree-instances/tag/:tag - Lookup tree instance by unique tag
router.get(
  '/tag/:tag',
  validateRequest({ params: getTreeInstanceByTagSchema }),
  Container.treeInstanceController.getByTag
);

// GET /api/v1/tree-instances/:id - Get single tree instance by ID
router.get(
  '/:id',
  validateRequest({ params: getTreeInstanceByIdSchema }),
  Container.treeInstanceController.getById
);

// POST /api/v1/tree-instances - Create / log a new tree instance
router.post(
  '/',
  validateRequest({ body: createTreeInstanceSchema }),
  Container.treeInstanceController.create
);

// PUT /api/v1/tree-instances/:id - Update an existing tree instance (e.g. health status, GPS)
router.put(
  '/:id',
  validateRequest({
    params: getTreeInstanceByIdSchema,
    body: updateTreeInstanceSchema,
  }),
  Container.treeInstanceController.update
);

// DELETE /api/v1/tree-instances/:id - Delete a tree instance
router.delete(
  '/:id',
  validateRequest({ params: getTreeInstanceByIdSchema }),
  Container.treeInstanceController.delete
);

export const treeInstanceRoutes = router;
