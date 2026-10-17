import { Router } from 'express';
import { Container } from '../../infrastructure/di/container';
import { validateRequest } from '../middlewares/validate.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { updateLandingPageSchema } from '../validators/landing-page.validator';

const router = Router();

// GET /api/v1/landing-page - Public get landing page content
router.get('/', Container.landingPageController.get);

// PUT /api/v1/landing-page - Update landing page content
router.put(
  '/',
  authenticate,
  authorize('admin'),
  validateRequest({ body: updateLandingPageSchema }),
  Container.landingPageController.update
);

// POST /api/v1/landing-page/reset - Reset landing page content to defaults
router.post(
  '/reset',
  authenticate,
  authorize('admin'),
  Container.landingPageController.reset
);

export const landingPageRoutes = router;

