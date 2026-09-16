/**
 * Repository Helper Utilities
 * 
 * Utility functions untuk repository operations.
 * Mengikuti DRY principle dan Single Responsibility Principle.
 * 
 * @module utils/repositoryHelpers
 */

import db from '../infrastructure/database/models/index.js';

const { Category, Author, Admin } = db;

/**
 * Include configuration for News queries
 */
const NEWS_INCLUDE_CONFIG = {
  Category: {
    model: Category,
    as: 'Category',
    attributes: ['categoryId', 'name', 'slug']
  },
  Author: {
    model: Author,
    as: 'Author',
    attributes: ['authorId', 'name', 'bio']
  },
  Admin: {
    model: Admin,
    as: 'Admin',
    attributes: ['adminId', 'username', 'email']
  }
};

/**
 * Build includes array for Sequelize queries
 * 
 * @param {Array|string} includeNames - Include names (array or string)
 * @param {Object} includeConfig - Include configuration object
 * @returns {Array} Sequelize include array
 */
export const buildIncludes = (includeNames, includeConfig = NEWS_INCLUDE_CONFIG) => {
  if (Array.isArray(includeNames)) {
    return includeNames
      .map(name => includeConfig[name])
      .filter(Boolean);
  }

  if (typeof includeNames === 'string') {
    return includeConfig[includeNames] ? [includeConfig[includeNames]] : [];
  }

  // Default: include all
  return Object.values(includeConfig);
};

