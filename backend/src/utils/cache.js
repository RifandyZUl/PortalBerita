/**
 * Cache Utility - Unified Cache Interface
 * 
 * Unified cache interface yang support both in-memory dan Redis.
 * Otomatis memilih implementasi berdasarkan environment variables.
 * 
 * Priority:
 * 1. Redis (jika REDIS_URL atau REDIS_HOST+REDIS_PORT tersedia)
 * 2. In-Memory (fallback default)
 * 
 * @module utils/cache
 */

// Determine which cache implementation to use
const useRedis = !!(process.env.REDIS_URL || (process.env.REDIS_HOST && process.env.REDIS_PORT));

// Lazy load cache implementation
let cacheImpl = null;
let cacheType = null;

/**
 * Initialize cache implementation
 * 
 * @returns {Promise<void>}
 */
const initCache = async () => {
  if (cacheImpl) {
    return;
  }

  if (useRedis) {
    try {
      cacheImpl = await import('./cache-redis.js');
      cacheType = 'redis';
      console.log('✅ Using Redis cache');
    } catch (error) {
      console.warn('⚠️ Redis import failed, falling back to in-memory cache:', error.message);
      cacheImpl = await import('./cache-memory.js');
      cacheType = 'memory';
    }
  } else {
    cacheImpl = await import('./cache-memory.js');
    cacheType = 'memory';
    if (process.env.NODE_ENV !== 'test') {
      console.log('✅ Using in-memory cache');
    }
  }
};

/**
 * Set cache value
 * 
 * @param {string} key - Cache key
 * @param {any} value - Cache value
 * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
 */
export const setCache = async (key, value, ttl) => {
  await initCache();
  try {
    return await cacheImpl.setCache(key, value, ttl);
  } catch (error) {
    if (cacheType === 'redis') {
      try {
        cacheImpl = await import('./cache-memory.js');
        cacheType = 'memory';
        return await cacheImpl.setCache(key, value, ttl);
      } catch (fallbackError) {
        return;
      }
    }
  }
};

/**
 * Get cache value
 * 
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} Cached value or null if not found/expired
 */
export const getCache = async (key) => {
  await initCache();
  return await cacheImpl.getCache(key);
};

/**
 * Delete cache by key
 * 
 * @param {string} key - Cache key
 */
export const deleteCache = async (key) => {
  await initCache();
  return await cacheImpl.deleteCache(key);
};

/**
 * Clear all cache
 */
export const clearCache = async () => {
  await initCache();
  return await cacheImpl.clearCache();
};

/**
 * Clear cache by pattern
 * 
 * @param {string} pattern - Pattern to match (e.g., 'dashboard:*')
 */
export const clearCacheByPattern = async (pattern) => {
  await initCache();
  return await cacheImpl.clearCacheByPattern(pattern);
};

/**
 * Get cache statistics
 * 
 * @returns {Promise<Object>} Cache statistics
 */
export const getCacheStats = async () => {
  await initCache();
  return await cacheImpl.getCacheStats();
};

/**
 * Clean expired cache entries
 */
export const cleanExpiredCache = async () => {
  await initCache();
  return await cacheImpl.cleanExpiredCache();
};

/**
 * Get cache type (redis or memory)
 * 
 * @returns {string} Cache type
 */
export const getCacheType = () => {
  return cacheType || (useRedis ? 'redis' : 'memory');
};
