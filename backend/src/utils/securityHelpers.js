/**
 * Security Helper Utilities
 * 
 * Utility functions untuk security operations seperti sanitization.
 * Mengikuti security best practices untuk mencegah XSS dan injection attacks.
 * 
 * @module utils/securityHelpers
 */

import sanitizeHtml from 'sanitize-html';

/**
 * HTML Sanitization Configuration untuk Comment
 * Lebih strict daripada news content karena comment adalah user-generated content
 */
const COMMENT_SANITIZE_CONFIG = {
  allowedTags: [], // Tidak ada HTML tags yang diizinkan untuk comment
  allowedAttributes: {},
  textContent: true, // Hanya text content yang diizinkan
};

/**
 * HTML Sanitization Configuration untuk Author Bio dan Category Description
 */
const TEXT_SANITIZE_CONFIG = {
  allowedTags: ['p', 'br', 'strong', 'em', 'u'],
  allowedAttributes: {},
};

/**
 * Sanitize comment text
 * Menghapus semua HTML tags dan script untuk mencegah XSS
 * 
 * @param {string} text - Raw comment text
 * @returns {string} Sanitized comment text
 */
export const sanitizeComment = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Sanitize HTML
  let sanitized = sanitizeHtml(text, COMMENT_SANITIZE_CONFIG);

  // Remove any remaining script patterns
  sanitized = sanitized
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<script/gi, '')
    .replace(/<\/script>/gi, '');

  // Trim whitespace
  return sanitized.trim();
};

/**
 * Sanitize text content (for bio, description, etc.)
 * Allows limited HTML tags but removes dangerous content
 * 
 * @param {string} text - Raw text content
 * @returns {string} Sanitized text content
 */
export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Sanitize HTML with limited allowed tags
  let sanitized = sanitizeHtml(text, TEXT_SANITIZE_CONFIG);

  // Remove any remaining script patterns
  sanitized = sanitized
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');

  return sanitized.trim();
};

/**
 * Sanitize name (author name, category name, etc.)
 * Removes HTML and special characters that could be used for injection
 * 
 * @param {string} name - Raw name
 * @returns {string} Sanitized name
 */
export const sanitizeName = (name) => {
  if (!name || typeof name !== 'string') {
    return '';
  }

  // Remove HTML tags
  let sanitized = sanitizeHtml(name, { allowedTags: [] });

  // Remove any remaining script patterns
  sanitized = sanitized
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<script/gi, '')
    .replace(/<\/script>/gi, '');

  return sanitized.trim();
};

/**
 * Validate and sanitize email
 * 
 * @param {string} email - Raw email
 * @returns {string} Normalized email or empty string if invalid
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return '';
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const normalized = email.trim().toLowerCase();

  if (!emailRegex.test(normalized)) {
    return '';
  }

  return normalized;
};

