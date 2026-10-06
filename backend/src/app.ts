import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { routes } from './presentation/routes';
import { notFoundHandler } from './presentation/middlewares/not-found.middleware';
import { errorHandler } from './presentation/middlewares/error.middleware';

export const createApp = (): Application => {
  const app = express();

  // Security & standard middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
      credentials: true,
    })
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
