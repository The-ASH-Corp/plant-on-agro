import { Router } from 'express';
import { WaitlistController } from '../controllers/waitlist.controller';

const router = Router();
const controller = new WaitlistController();

// Public: user joins waitlist
router.post('/', controller.create);

// Admin: view all waitlist entries
router.get('/', controller.getAll);

// Admin: update status (e.g. marked as contacted)
router.patch('/:id/status', controller.updateStatus);

// Admin: delete waitlist lead
router.delete('/:id', controller.delete);

export const waitlistRoutes = router;

