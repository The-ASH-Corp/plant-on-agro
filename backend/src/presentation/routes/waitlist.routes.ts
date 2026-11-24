import { Router } from 'express';
import { WaitlistController } from '../controllers/waitlist.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const controller = new WaitlistController();

// Public: user joins waitlist
router.post('/', controller.create);

// Admin: view all waitlist entries
router.get('/', authenticate, authorize('admin'), controller.getAll);

// Admin: update status (e.g. marked as contacted)
router.patch('/:id/status', authenticate, authorize('admin'), controller.updateStatus);

// Admin: delete waitlist lead
router.delete('/:id', authenticate, authorize('admin'), controller.delete);

export const waitlistRoutes = router;

