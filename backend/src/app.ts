import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { routes } from './presentation/routes';
import { notFoundHandler } from './presentation/middlewares/not-found.middleware';
import { errorHandler } from './presentation/middlewares/error.middleware';
import morgan from 'morgan';

export const createApp = (): Application => {
  const app = express();

  // Security & standard middlewares
  app.disable('x-powered-by');
  app.use(
    helmet({
      contentSecurityPolicy: true,
      crossOriginEmbedderPolicy: true,
    })
  );
  app.use(
    cors({
      origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
      credentials: true,
    })
  );

  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));

  app.use(morgan("dev"))
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
