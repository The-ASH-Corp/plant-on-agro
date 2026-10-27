import Redis, { RedisOptions } from 'ioredis';
import { env } from '../../config/env';

export class RedisClientService {
  private static instance: RedisClientService | null = null;
  private client: Redis | null = null;
  private isConnected = false;

  private constructor() {
    this.initClient();
  }

  public static getInstance(): RedisClientService {
    if (!RedisClientService.instance) {
      RedisClientService.instance = new RedisClientService();
    }
    return RedisClientService.instance;
  }

  private initClient(): void {
    const options: RedisOptions = {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD || undefined,
      lazyConnect: false,
      maxRetriesPerRequest: 3,
      enableOfflineQueue: true,
      retryStrategy: (times: number) => {
        // Exponential backoff with a cap of 3 seconds
        const delay = Math.min(times * 150, 3000);
        console.warn(`🔄 [REDIS] Reconnecting attempt #${times} in ${delay}ms...`);
        return delay;
      },
      reconnectOnError: (err: Error) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true; // Reconnect on failover
        }
        return false;
      },
    };

    try {
      this.client = env.REDIS_URL
        ? new Redis(env.REDIS_URL, options)
        : new Redis(options);

      this.client.on('connect', () => {
        console.log('🔌 [REDIS] Socket connection established.');
      });

      this.client.on('ready', () => {
        this.isConnected = true;
        console.log(`✅ [REDIS] Connected and ready at ${env.REDIS_HOST}:${env.REDIS_PORT}`);
      });

      this.client.on('error', (err: Error) => {
        this.isConnected = false;
        console.error('❌ [REDIS ERROR] Connection failed:', err.message);
      });

      this.client.on('close', () => {
        this.isConnected = false;
        console.warn('⚠️ [REDIS] Connection closed.');
      });

      this.client.on('reconnecting', () => {
        this.isConnected = false;
        console.log('🔄 [REDIS] Reconnecting...');
      });
    } catch (error) {
      console.error('❌ [REDIS] Initialization error:', error);
      this.client = null;
      this.isConnected = false;
    }
  }

  public getClient(): Redis {
    if (!this.client) {
      this.initClient();
    }
    return this.client!;
  }

  public isReady(): boolean {
    return this.isConnected && this.client !== null && this.client.status === 'ready';
  }

  public async ping(): Promise<boolean> {
    if (!this.client) return false;
    try {
      const response = await this.client.ping();
      return response === 'PONG';
    } catch {
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.quit();
        console.log('🔒 [REDIS] Disconnected cleanly.');
      } catch (err) {
        console.error('⚠️ [REDIS] Error during disconnect:', err);
        this.client.disconnect();
      } finally {
        this.client = null;
        this.isConnected = false;
      }
    }
  }
}

export const redisService = RedisClientService.getInstance();
export const redisClient = redisService.getClient();
