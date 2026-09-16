/**
 * Cache Middleware
 * 
 * Express middleware for transparent Redis caching and automatic invalidation.
 * 
 * @module middlewares/cacheMiddleware
 */

import redisClient from '../infrastructure/cache/redisClient.js';
import logger from '../utils/logger.js';

/**
 * Middleware untuk menyimpan dan mengambil respons HTTP GET dari Redis.
 * 
 * @param {number} ttlSeconds - Masa aktif cache dalam detik (default: 300 / 5 menit)
 * @param {string} prefix - Namespace key cache (default: 'portal')
 * @returns {import('express').RequestHandler}
 */
export const cacheResponse = (ttlSeconds = 300, prefix = 'portal') => {
  return async (req, res, next) => {
    // Hanya lakukan caching pada request HTTP GET
    if (req.method !== 'GET') {
      return next();
    }

    // Bentuk key yang unik berdasarkan endpoint dan parameter query
    const queryString = Object.keys(req.query).length > 0 
      ? `:${JSON.stringify(req.query)}` 
      : '';
    const cacheKey = `${prefix}:${req.baseUrl}${req.path}${queryString}`;

    try {
      // Cek apakah data sudah ada di Redis
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('X-Cache-TTL', `${ttlSeconds}s`);
        return res.status(200).json(cachedData);
      }

      // Jika belum ada di cache (MISS), intercept res.json untuk menyimpannya nanti
      res.setHeader('X-Cache', 'MISS');

      const originalJson = res.json.bind(res);

      res.json = (body) => {
        // Simpan hanya jika response status sukses (200)
        if (res.statusCode === 200 && body) {
          redisClient.set(cacheKey, body, ttlSeconds).catch((err) => {
            logger.warn(`Failed to cache response for ${cacheKey}: ${err.message}`);
          });
        }
        return originalJson(body);
      };

      next();
    } catch (err) {
      logger.warn(`Cache middleware bypass on error: ${err.message}`);
      next();
    }
  };
};

/**
 * Middleware untuk meng-invalidate cache secara otomatis setelah operasi mutasi (POST, PUT, DELETE) berhasil.
 * 
 * @param {string|string[]} patterns - Pola key yang akan dihapus (misal: 'portal:/api/news*')
 * @returns {import('express').RequestHandler}
 */
export const invalidateCache = (patterns = []) => {
  const patternList = Array.isArray(patterns) ? patterns : [patterns];

  return (req, res, next) => {
    res.on('finish', () => {
      // Invalidate hanya jika operasi mutasi menghasilkan response sukses (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        patternList.forEach((pattern) => {
          redisClient.delPattern(pattern).catch((err) => {
            logger.warn(`Cache invalidation failed for pattern "${pattern}": ${err.message}`);
          });
        });
      }
    });

    next();
  };
};
