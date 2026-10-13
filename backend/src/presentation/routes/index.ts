import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
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

export const routes = apiRouter;
