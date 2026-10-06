import http from 'http';
import { createApp } from './app';
import { env } from './config/env';
import { Database } from './infrastructure/database/connection';

const bootstrap = async (): Promise<void> => {
  try {
    // 1. Initialize Database connection
    await Database.connect();

    // 2. Initialize Express application
    const app = createApp();
    const server = http.createServer(app);

    // 3. Start listening
    server.listen(env.PORT, () => {
      console.log(`🚀 Plant-on-Agro Server running on port ${env.PORT} [${env.NODE_ENV}]`);
      console.log(`📡 Health check available at: http://localhost:${env.PORT}/api/v1/health`);
    });

    // 4. Graceful shutdown handler
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

      server.close(async () => {
        console.log('🔒 HTTP server closed');
        try {
          await Database.disconnect();
          console.log('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during database disconnect:', error);
          process.exit(1);
        }
      });

      // Force shutdown if taking longer than 10s
      setTimeout(() => {
        console.error('⚠️ Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason: unknown) => {
      console.error('💥 Unhandled Rejection:', reason);
    });

    process.on('uncaughtException', (error: Error) => {
      console.error('💥 Uncaught Exception:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to bootstrap application:', error);
    process.exit(1);
  }
};

void bootstrap();