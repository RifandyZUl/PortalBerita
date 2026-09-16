/**
 * News Helper Utilities
 * 
 * Utility functions untuk News operations.
 * Mengikuti DRY principle dan Single Responsibility Principle.
 * 
 * @module utils/newsHelpers
 */

import sanitizeHtml from 'sanitize-html';
import slugify from 'slugify';

/**
 * HTML Sanitization Configuration
 */
const HTML_SANITIZE_CONFIG = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
  allowedAttributes: {
    '*': ['style', 'class'],
    a: ['href', 'target'],
    img: ['src', 'alt', 'width', 'height'],
  },
};

/**
 * Generate slug from title
 * 
 * @param {string} title - News title
 * @returns {string} Generated slug
 */
export const generateSlug = (title) => {
  return slugify(title, { lower: true, strict: true });
};

/**
 * Sanitize HTML content
 * 
 * @param {string} content - Raw HTML content
 * @returns {string} Sanitized HTML content
 */
export const sanitizeContent = (content) => {
  return sanitizeHtml(content, HTML_SANITIZE_CONFIG);
};

/**
 * Generate summary from HTML content
 * 
 * @param {string} htmlContent - HTML content
 * @param {number} maxLength - Maximum summary length (default: 200)
 * @returns {string} Plain text summary
 */
export const generateSummary = (htmlContent, maxLength = 200) => {
  const plainText = stripHtmlTags(htmlContent);
  return plainText.substring(0, maxLength);
};

/**
 * Strip HTML tags from string
 * 
 * @param {string} html - HTML string
 * @returns {string} Plain text
 */
export const stripHtmlTags = (html) => {
  return html?.replace(/<[^>]*>/g, '').trim() || '';
};

/**
 * Map news to public format
 * 
 * @param {Object} news - News object from database
 * @returns {Object} Formatted news object for public API
 */
export const mapNewsToPublicFormat = (news) => {
  return {
    id: news.newsId,
    title: news.title,
    summary: news.summary,
    content: news.content,
    image_url: news.imageUrl,
    category: news.Category?.name || '-',
    createdAt: news.publishedAt,
    slug: news.slug,
    views: news.views || 0,
    authorName: news.Author?.name || 'Unknown',
  };
};

/**
 * Map news list to public format
 * 
 * @param {Array} newsList - Array of news objects
 * @returns {Array} Array of formatted news objects
 */
export const mapNewsListToPublicFormat = (newsList) => {
  return newsList.map(mapNewsToPublicFormat);
};

/**
 * Build where clause for news queries
 * 
 * @param {Object} filters - Filter options
 * @param {boolean} isAdmin - Is admin request
 * @returns {Object} Sequelize where clause
 */
export const buildNewsWhereClause = (filters = {}, isAdmin = false) => {
  const { status, categoryId } = filters;
  const where = {};

  if (!isAdmin) {
    where.status = 'published';
  } else if (status) {
    where.status = status;
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  return where;
};

/**
 * Validate required news fields
 * 
 * @param {Object} newsData - News data object
 * @returns {boolean} True if all required fields present
 */
export const validateRequiredNewsFields = (newsData) => {
  const { title, content, categoryId, authorId } = newsData;
  return !!(title && content && categoryId && authorId);
};

