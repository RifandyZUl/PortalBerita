/**
 * Redis Client Infrastructure
 * 
 * Production-ready Redis client with automatic fail-safe / graceful degradation.
 * If Redis is unavailable or fails, the application continues to function normally.
 * 
 * @module infrastructure/cache/redisClient
 */

import Redis from 'ioredis';
import logger from '../../utils/logger.js';

class RedisClientService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.initClient();
  }

  initClient() {
    // Check if Redis is configured or explicitly disabled
    if (process.env.REDIS_ENABLED === 'false') {
      logger.info('Redis cache is explicitly disabled (REDIS_ENABLED=false)');
      return;
    }

    const redisUrl = process.env.REDIS_URL;
    const redisHost = process.env.REDIS_HOST;

    if (!redisUrl && !redisHost) {
      logger.info('No Redis configuration found (REDIS_URL / REDIS_HOST). Cache operates in pass-through mode.');
      return;
    }

    try {
      const options = {
        maxRetriesPerRequest: 1,
        connectTimeout: 4000,
        enableOfflineQueue: false, // Don't queue requests if Redis is disconnected
        retryStrategy(times) {
          if (times > 3) {
            // Stop aggressive retrying to avoid spamming logs when Redis is down
            return 30000; // Retry every 30s
          }
          return Math.min(times * 1000, 3000);
        }
      };

      if (redisUrl) {
        this.client = new Redis(redisUrl, options);
      } else {
        this.client = new Redis({
          host: redisHost,
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
          password: process.env.REDIS_PASSWORD || undefined,
          ...options
        });
      }

      this.client.on('connect', () => {
        this.isConnected = true;
        logger.info('✅ Redis Cache connected successfully');
      });

      this.client.on('ready', () => {
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        logger.warn(`Redis connection error: ${err.message}. Gracefully degrading to database.`);
      });

      this.client.on('close', () => {
        this.isConnected = false;
      });
    } catch (error) {
      logger.warn(`Failed to initialize Redis client: ${error.message}. Running without cache.`);
      this.client = null;
      this.isConnected = false;
    }
  }

  /**
   * Ambil data dari cache berdasarkan key
   * @param {string} key
   * @returns {Promise<any|null>}
   */
  async get(key) {
    if (!this.client || !this.isConnected) return null;
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      logger.warn(`Redis get error on key "${key}": ${err.message}`);
      return null;
    }
  }

  /**
   * Simpan data ke cache dengan TTL (dalam detik)
   * @param {string} key
   * @param {any} value
   * @param {number} ttlSeconds (default: 300 = 5 menit)
   */
  async set(key, value, ttlSeconds = 300) {
    if (!this.client || !this.isConnected) return;
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds > 0) {
        await this.client.set(key, serialized, 'EX', ttlSeconds);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (err) {
      logger.warn(`Redis set error on key "${key}": ${err.message}`);
    }
  }

  /**
   * Hapus single key dari cache
   * @param {string} key
   */
  async del(key) {
    if (!this.client || !this.isConnected) return;
    try {
      await this.client.del(key);
    } catch (err) {
      logger.warn(`Redis del error on key "${key}": ${err.message}`);
    }
  }

  /**
   * Hapus banyak key berdasarkan pola (pattern) menggunakan SCAN (non-blocking)
   * @param {string} pattern Contoh: 'portal:news:*'
   */
  async delPattern(pattern) {
    if (!this.client || !this.isConnected) return;
    try {
      let cursor = '0';
      do {
        const [nextCursor, keys] = await this.client.scan(cursor, 'MATCH', pattern, 'COUNT', 50);
        cursor = nextCursor;
        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      } while (cursor !== '0');
    } catch (err) {
      logger.warn(`Redis delPattern error on pattern "${pattern}": ${err.message}`);
    }
  }

  /**
   * Cek status koneksi Redis
   * @returns {boolean}
   */
  isReady() {
    return this.isConnected;
  }
}

// Export singleton instance
const redisClient = new RedisClientService();
export default redisClient;
