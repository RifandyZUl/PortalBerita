/**
 * Request Logger Middleware
 * 
 * Middleware untuk logging HTTP requests menggunakan Morgan.
 * Menyediakan structured logging untuk semua incoming requests.
 * 
 * @module middlewares/requestLogger
 */

import morgan from 'morgan';
import { logHttp } from '../utils/logger.js';

// Custom token untuk user ID
morgan.token('userId', (req) => {
  return req.admin?.adminId || req.user?.userId || '-';
});

// Custom token untuk response time dengan format yang lebih baik
morgan.token('response-time-ms', (req, res) => {
  return `${res['response-time']}ms`;
});

/**
 * Morgan format untuk development
 * Format: timestamp method url status response-time userId
 */
const developmentFormat = ':method :url :status :response-time-ms :userId';

/**
 * Morgan format untuk production
 * Format: method url status response-time userId ip user-agent
 */
const productionFormat = ':method :url :status :response-time-ms :userId :remote-addr :user-agent';

/**
 * Custom stream untuk Morgan
 * Menggunakan Winston logger untuk logging
 */
const stream = {
  write: (message) => {
    // Remove trailing newline
    const cleanMessage = message.trim();
    logHttp(cleanMessage);
  },
};

/**
 * Skip logging untuk health check atau static files
 */
const skip = (req, res) => {
  // Skip logging untuk:
  // - Health check endpoints
  // - Static files (jika ada)
  return (
    req.url === '/health' ||
    req.url === '/favicon.ico' ||
    req.url.startsWith('/static')
  );
};

/**
 * Request logger middleware
 * 
 * @param {string} format - Morgan format (optional)
 * @returns {Function} Express middleware
 */
export const requestLogger = (format = null) => {
  const env = process.env.NODE_ENV || 'development';
  const morganFormat = format || (env === 'production' ? productionFormat : developmentFormat);

  return morgan(morganFormat, {
    stream,
    skip,
  });
};

export default requestLogger;

