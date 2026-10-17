import { Router } from 'express';
import { Container } from '../../infrastructure/di/container';
import { validateRequest } from '../middlewares/validate.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
  createCertificateSchema,
  updateCertificateSchema,
  getCertificateByIdSchema,
  getCertificateByNumberSchema,
  verifyCertificateSchema,
  queryCertificatesSchema,
} from '../validators/certificate.validator';

const router = Router();

// GET /api/v1/certificates - List all certificates with filters & pagination (Admin)
router.get(
  '/',
  authenticate,
  authorize('admin'),
  validateRequest({ query: queryCertificatesSchema }),
  Container.certificateController.getAll
);

// GET /api/v1/certificates/verify/:hashOrNumber - Public verification of deed authenticity
router.get(
  '/verify/:hashOrNumber',
  validateRequest({ params: verifyCertificateSchema }),
  Container.certificateController.verify
);

// GET /api/v1/certificates/number/:certificateNumber - Get certificate by human-readable number
router.get(
  '/number/:certificateNumber',
  authenticate,
  validateRequest({ params: getCertificateByNumberSchema }),
  Container.certificateController.getByNumber
);

// GET /api/v1/certificates/:id - Get single certificate by database ID
router.get(
  '/:id',
  authenticate,
  validateRequest({ params: getCertificateByIdSchema }),
  Container.certificateController.getById
);

// POST /api/v1/certificates - Create a new certificate record (Admin)
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateRequest({ body: createCertificateSchema }),
  Container.certificateController.create
);

// PUT /api/v1/certificates/:id - Update an existing certificate (Admin)
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest({
    params: getCertificateByIdSchema,
    body: updateCertificateSchema,
  }),
  Container.certificateController.update
);

// DELETE /api/v1/certificates/:id - Delete a certificate (Admin)
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest({ params: getCertificateByIdSchema }),
  Container.certificateController.delete
);

export const certificateRoutes = router;
