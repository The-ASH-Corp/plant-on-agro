import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { treeVarietyRoutes } from './tree-variety.routes';
import { adoptionPlanRoutes } from './adoption-plan.routes';
import { treeInstanceRoutes } from './tree-instance.routes';
import { certificateRoutes } from './certificate.routes';
import { landingPageRoutes } from './landing-page.routes';
import { orderRoutes } from './order.routes';
import { locationRoutes } from './location.routes';
import { uploadRoutes } from './upload.routes';
import { ApiResponse } from '../../shared/utils/api-response';

const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', (_req, res) => {
  ApiResponse.success(
    res,
    {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    'Server is healthy'
  );
});

// Resource routes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/tree-varieties', treeVarietyRoutes);
apiRouter.use('/adoption-plans', adoptionPlanRoutes);
apiRouter.use('/tree-instances', treeInstanceRoutes);
apiRouter.use('/certificates', certificateRoutes);
apiRouter.use('/landing-page', landingPageRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/locations', locationRoutes);
apiRouter.use('/upload', uploadRoutes);

export const routes = apiRouter;
