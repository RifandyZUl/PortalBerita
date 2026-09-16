/**
 * In-Memory Cache Implementation
 * 
 * Simple in-memory cache menggunakan Map dengan TTL (Time To Live).
 * Cocok untuk single server instance.
 * 
 * @module utils/cache-memory
 */

/**
 * Cache storage
 * @type {Map<string, {value: any, expiresAt: number}>}
 */
const cache = new Map();

/**
 * Default TTL: 5 menit (dalam milliseconds)
 */
const DEFAULT_TTL = 5 * 60 * 1000;

/**
 * Set cache value
 * 
 * @param {string} key - Cache key
 * @param {any} value - Cache value
 * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
 */
export const setCache = (key, value, ttl = DEFAULT_TTL) => {
  const expiresAt = Date.now() + ttl;
  cache.set(key, { value, expiresAt });
};

/**
 * Get cache value
 * 
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} Cached value or null if not found/expired
 */
export const getCache = async (key) => {
  const item = cache.get(key);
  
  if (!item) {
    return null;
  }

  // Check if expired
  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return null;
  }

  return item.value;
};

/**
 * Delete cache by key
 * 
 * @param {string} key - Cache key
 * @returns {Promise<void>} For API compatibility with Redis
 */
export const deleteCache = async (key) => {
  cache.delete(key);
};

/**
 * Clear all cache
 * 
 * @returns {Promise<void>} For API compatibility with Redis
 */
export const clearCache = async () => {
  cache.clear();
};

/**
 * Clear cache by pattern
 * 
 * @param {string} pattern - Pattern to match (e.g., 'dashboard:*')
 * @returns {Promise<void>} For API compatibility with Redis
 */
export const clearCacheByPattern = async (pattern) => {
  const regex = new RegExp(pattern.replace('*', '.*'));
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key);
    }
  }
};

/**
 * Get cache statistics
 * 
 * @returns {Promise<Object>} Cache statistics
 */
export const getCacheStats = async () => {
  const now = Date.now();
  let valid = 0;
  let expired = 0;

  for (const item of cache.values()) {
    if (now > item.expiresAt) {
      expired++;
    } else {
      valid++;
    }
  }

  return {
    total: cache.size,
    valid,
    expired,
    type: 'memory'
  };
};

/**
 * Clean expired cache entries
 * Runs automatically, but can be called manually
 * 
 * @returns {Promise<void>} For API compatibility with Redis
 */
export const cleanExpiredCache = async () => {
  const now = Date.now();
  for (const [key, item] of cache.entries()) {
    if (now > item.expiresAt) {
      cache.delete(key);
    }
  }
};

// Auto-clean expired cache every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanExpiredCache, 10 * 60 * 1000);
}

