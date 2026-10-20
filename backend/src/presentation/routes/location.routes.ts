import { Router } from 'express';
import { Container } from '../../infrastructure/di/container';
import { validateRequest } from '../middlewares/validate.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
  createLocationSchema,
  updateLocationSchema,
  getLocationByIdSchema,
  queryLocationsSchema,
} from '../validators/location.validator';

const router = Router();

// GET /api/v1/locations - List locations with filtering and pagination
router.get(
  '/',
  validateRequest({ query: queryLocationsSchema }),
  Container.locationController.getAll
);

// GET /api/v1/locations/:id - Get single location by ID
router.get(
  '/:id',
  validateRequest({ params: getLocationByIdSchema }),
  Container.locationController.getById
);

// POST /api/v1/locations - Create a new location (Admin only)
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateRequest({ body: createLocationSchema }),
  Container.locationController.create
);

// PUT /api/v1/locations/:id - Update an existing location (Admin only)
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest({
    params: getLocationByIdSchema,
    body: updateLocationSchema,
  }),
  Container.locationController.update
);

// DELETE /api/v1/locations/:id - Delete a location (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest({ params: getLocationByIdSchema }),
  Container.locationController.delete
);

export const locationRoutes = router;
