import express, { Application } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { routes } from './presentation/routes';
import { notFoundHandler } from './presentation/middlewares/not-found.middleware';
import { errorHandler } from './presentation/middlewares/error.middleware';
import { globalRateLimiter } from './presentation/middlewares/rate-limiter.middleware';
import morgan from 'morgan';

export const createApp = (): Application => {
  const app = express();

  // Security & standard middlewares
  app.disable('x-powered-by');
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
    })
  );
  app.use(
    cors({
      origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
      credentials: true,
    })
  );

  // Static uploads directory for tree photographs
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));

  app.use(morgan('dev'));

  // Global Rate Limiter applied to all API endpoints
  app.use('/api', globalRateLimiter);

  // Root redirect/health
  app.get('/', (_req, res) => {
    res.json({
      name: 'Plant-on-Agro API',
      version: '1.0.0',
      docs: '/api/v1/health',
    });
  });

  // API Versioning
  app.use('/api/v1', routes);

  // 404 Not Found Handler
  app.use(notFoundHandler);

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};
