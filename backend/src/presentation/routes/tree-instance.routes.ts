import { Router } from 'express';
import { Container } from '../../infrastructure/di/container';
import { validateRequest } from '../middlewares/validate.middleware';
import { authenticate, optionalAuthenticate, authorize } from '../middlewares/auth.middleware';
import {
  createTreeInstanceSchema,
  updateTreeInstanceSchema,
  getTreeInstanceByIdSchema,
  getTreeInstanceByTagSchema,
  queryTreeInstancesSchema,
} from '../validators/tree-instance.validator';

const router = Router();

// GET /api/v1/tree-instances - List tree instances (redacts other buyers' PII for guests/buyers)
router.get(
  '/',
  optionalAuthenticate,
  validateRequest({ query: queryTreeInstancesSchema }),
  Container.treeInstanceController.getAll
);

// GET /api/v1/tree-instances/tag/:tag - Lookup tree instance by unique tag (PII redacted for non-owners)
router.get(
  '/tag/:tag',
  optionalAuthenticate,
  validateRequest({ params: getTreeInstanceByTagSchema }),
  Container.treeInstanceController.getByTag
);

// GET /api/v1/tree-instances/:id - Get single tree instance by ID (PII redacted for non-owners)
router.get(
  '/:id',
  optionalAuthenticate,
  validateRequest({ params: getTreeInstanceByIdSchema }),
  Container.treeInstanceController.getById
);

// POST /api/v1/tree-instances - Create / log a new tree instance
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateRequest({ body: createTreeInstanceSchema }),
  Container.treeInstanceController.create
);

// PUT /api/v1/tree-instances/:id - Update an existing tree instance (e.g. health status, notes, image)
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest({
    params: getTreeInstanceByIdSchema,
    body: updateTreeInstanceSchema,
  }),
  Container.treeInstanceController.update
);

// DELETE /api/v1/tree-instances/:id - Delete a tree instance
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest({ params: getTreeInstanceByIdSchema }),
  Container.treeInstanceController.delete
);

export const treeInstanceRoutes = router;

