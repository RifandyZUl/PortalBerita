/**
 * Logger Utility
 * 
 * Centralized logging menggunakan Winston.
 * Menyediakan structured logging dengan level yang berbeda untuk development dan production.
 * 
 * @module utils/logger
 */

import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which logs to display based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define format for logs
const format = winston.format.combine(
  // Add timestamp
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  // Tell Winston that the logs must be colored
  winston.format.colorize({ all: true }),
  // Define the format of the message
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define format for file logs (without colors)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

import fs from 'fs';

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format,
  }),
];

// Only enable file transports in non-serverless environments (Vercel is read-only)
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  try {
    const logsDir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    transports.push(
      new winston.transports.File({
        filename: path.join(logsDir, 'error.log'),
        level: 'error',
        format: fileFormat,
      }),
      new winston.transports.File({
        filename: path.join(logsDir, 'combined.log'),
        format: fileFormat,
      })
    );
  } catch (err) {
    // Graceful fallback to console only
  }
}

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format: fileFormat,
  transports,
  // Do not exit on handled exceptions
  exitOnError: false,
});

/**
 * Log error with context
 * 
 * @param {Error} error - Error object
 * @param {Object} context - Additional context (req, userId, etc.)
 */
export const logError = (error, context = {}) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    ...context,
  };

  logger.error(JSON.stringify(errorInfo, null, 2));
};

/**
 * Log warning
 * 
 * @param {string} message - Warning message
 * @param {Object} context - Additional context
 */
export const logWarn = (message, context = {}) => {
  logger.warn(message, context);
};

/**
 * Log info
 * 
 * @param {string} message - Info message
 * @param {Object} context - Additional context
 */
export const logInfo = (message, context = {}) => {
  logger.info(message, context);
};

/**
 * Log HTTP request
 * 
 * @param {string} message - HTTP message
 * @param {Object} context - Additional context
 */
export const logHttp = (message, context = {}) => {
  logger.http(message, context);
};

/**
 * Log debug (only in development)
 * 
 * @param {string} message - Debug message
 * @param {Object} context - Additional context
 */
export const logDebug = (message, context = {}) => {
  logger.debug(message, context);
};

// Export default logger instance
export default logger;

