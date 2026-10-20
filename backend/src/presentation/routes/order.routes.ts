import { Router } from 'express';
import { Container } from '../../infrastructure/di/container';
import { validateRequest } from '../middlewares/validate.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  getOrderByIdSchema,
  getOrderByNumberSchema,
  queryOrdersSchema,
} from '../validators/order.validator';

const router = Router();

// GET /api/v1/orders - List orders with filters & pagination
router.get(
  '/',
  authenticate,
  validateRequest({ query: queryOrdersSchema }),
  (req, res, next) => {
    // If buyer, filter to their own email
    if (req.user && req.user.role === 'buyer') {
      req.query.adopterEmail = req.user.email;
    }
    return Container.orderController.getAll(req, res, next);
  }
);

// POST /api/v1/orders/mark-all-read - Mark all unread orders as reviewed (Admin)
router.post(
  '/mark-all-read',
  authenticate,
  authorize('admin'),
  Container.orderController.markAllAsRead
);

// GET /api/v1/orders/number/:orderNumber - Lookup order by human-readable number
router.get(
  '/number/:orderNumber',
  authenticate,
  validateRequest({ params: getOrderByNumberSchema }),
  Container.orderController.getByNumber
);

// GET /api/v1/orders/:id - Get single order by database ID
router.get(
  '/:id',
  authenticate,
  validateRequest({ params: getOrderByIdSchema }),
  Container.orderController.getById
);

// POST /api/v1/orders - Create / place an adoption order (Open for adoption checkout)
router.post(
  '/',
  validateRequest({ body: createOrderSchema }),
  Container.orderController.create
);

// PUT or PATCH /api/v1/orders/:id/status - Update order workflow status (Admin)
router.put(
  '/:id/status',
  authenticate,
  authorize('admin'),
  validateRequest({
    params: getOrderByIdSchema,
    body: updateOrderStatusSchema,
  }),
  Container.orderController.updateStatus
);

router.patch(
  '/:id/status',
  authenticate,
  authorize('admin'),
  validateRequest({
    params: getOrderByIdSchema,
    body: updateOrderStatusSchema,
  }),
  Container.orderController.updateStatus
);

// DELETE /api/v1/orders/:id - Delete order (Admin)
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest({ params: getOrderByIdSchema }),
  Container.orderController.delete
);

export const orderRoutes = router;
