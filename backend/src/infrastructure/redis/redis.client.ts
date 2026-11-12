import Redis, { RedisOptions } from 'ioredis';
import { env } from '../../config/env';
import { ensureRedisContainerSync } from './redis-docker.helper';

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
    // Automatically ensure the Redis Docker container is running if connecting locally
    try {
      ensureRedisContainerSync();
    } catch (err: any) {
      console.warn('⚠️ [REDIS] Auto-start check failed:', err.message);
    }

    const options: RedisOptions = {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD || undefined,
      lazyConnect: false,
      maxRetriesPerRequest: 3,
      enableOfflineQueue: true,
      retryStrategy: (times: number) => {
        if (times > 20) {
          console.error('❌ [REDIS] Max reconnection attempts (20) reached. Verify that Redis / Docker is active.');
          return null;
        }
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

  /**
   * Retrieves and deserializes a JSON-cached item from Redis.
   */
  public async get<T>(key: string): Promise<T | null> {
    if (!this.isReady()) return null;
    try {
      const data = await this.getClient().get(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch {
      return null;
    }
  }

  /**
   * Serializes and caches an item in Redis with an expiration TTL (default: 300s / 5 mins).
   */
  public async set(key: string, value: unknown, ttlSeconds = 300): Promise<boolean> {
    if (!this.isReady()) return false;
    try {
      const serialized = JSON.stringify(value);
      await this.getClient().set(key, serialized, 'EX', ttlSeconds);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Deletes a cached key from Redis.
   */
  public async del(key: string): Promise<boolean> {
    if (!this.isReady()) return false;
    try {
      await this.getClient().del(key);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Deletes all cached keys matching a specific pattern (e.g. 'poa:catalog:*').
   */
  public async delPattern(pattern: string): Promise<void> {
    if (!this.isReady()) return;
    try {
      const keys = await this.getClient().keys(pattern);
      if (keys.length > 0) {
        await this.getClient().del(...keys);
      }
    } catch (err) {
      console.warn('⚠️ [REDIS] Error deleting pattern keys:', err);
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
