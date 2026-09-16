/**
 * Redis Cache Implementation
 * 
 * Production-ready Redis cache wrapper powered by ioredis singleton client.
 * Provides unified interface and graceful degradation.
 * 
 * @module utils/cache-redis
 */

import redisClient from '../infrastructure/cache/redisClient.js';
import logger from './logger.js';

const DEFAULT_TTL_MS = 5 * 60 * 1000;

/**
 * Set cache value
 * 
 * @param {string} key - Cache key
 * @param {any} value - Cache value
 * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
 * @returns {Promise<void>}
 */
export const setCache = async (key, value, ttl = DEFAULT_TTL_MS) => {
  try {
    const ttlSeconds = Math.max(1, Math.floor(ttl / 1000));
    await redisClient.set(key, value, ttlSeconds);
  } catch (error) {
    logger.warn(`Redis setCache error on key "${key}": ${error.message}`);
  }
};

/**
 * Get cache value
 * 
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} Cached value or null if not found/expired
 */
export const getCache = async (key) => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    logger.warn(`Redis getCache error on key "${key}": ${error.message}`);
    return null;
  }
};

/**
 * Delete cache by key
 * 
 * @param {string} key - Cache key
 * @returns {Promise<void>}
 */
export const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.warn(`Redis deleteCache error on key "${key}": ${error.message}`);
  }
};

/**
 * Clear all cache
 * 
 * @returns {Promise<void>}
 */
export const clearCache = async () => {
  try {
    if (redisClient.client && redisClient.isConnected) {
      await redisClient.client.flushdb();
    }
  } catch (error) {
    logger.warn(`Redis clearCache error: ${error.message}`);
  }
};

/**
 * Clear cache by pattern
 * 
 * @param {string} pattern - Pattern to match (e.g., 'dashboard:*' or 'news:*')
 * @returns {Promise<void>}
 */
export const clearCacheByPattern = async (pattern) => {
  try {
    await redisClient.delPattern(pattern);
  } catch (error) {
    logger.warn(`Redis clearCacheByPattern error for "${pattern}": ${error.message}`);
  }
};

/**
 * Get cache statistics
 * 
 * @returns {Promise<Object>} Cache statistics
 */
export const getCacheStats = async () => {
  if (!redisClient.isReady()) {
    return {
      total: 0,
      valid: 0,
      expired: 0,
      type: 'redis',
      connected: false
    };
  }

  try {
    const dbSize = await redisClient.client.dbsize();
    return {
      total: dbSize,
      valid: dbSize,
      expired: 0,
      type: 'redis',
      connected: true
    };
  } catch (error) {
    return {
      total: 0,
      valid: 0,
      expired: 0,
      type: 'redis',
      connected: false
    };
  }
};

/**
 * Clean expired cache entries
 * Redis handles expiration automatically via TTL
 * 
 * @returns {Promise<void>}
 */
export const cleanExpiredCache = async () => {
  return Promise.resolve();
};

/**
 * Close Redis connection
 * 
 * @returns {Promise<void>}
 */
export const closeConnection = async () => {
  try {
    if (redisClient.client && redisClient.isConnected) {
      await redisClient.client.quit();
    }
  } catch (error) {
    logger.warn(`Redis closeConnection error: ${error.message}`);
  }
};
