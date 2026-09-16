/**
 * Filter Helper Utilities
 * 
 * Utility functions untuk filter operations.
 * Mengikuti DRY principle dan Single Responsibility Principle.
 * 
 * @module utils/filterHelpers
 */

import { Op } from 'sequelize';

/**
 * Build where clause for comment filters
 * 
 * @param {Object} filters - Filter options
 * @returns {Object} Sequelize where clause
 */
export const buildCommentWhereClause = (filters = {}) => {
  const { status, search } = filters;
  const where = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.comment = { [Op.iLike]: `%${search}%` };
  }

  return where;
};

/**
 * Build search query for news
 * 
 * @param {string} keyword - Search keyword
 * @returns {Object} Sequelize where clause with OR conditions
 */
export const buildNewsSearchWhereClause = (keyword) => {
  return {
    [Op.or]: [
      { title: { [Op.iLike]: `%${keyword}%` } },
      { content: { [Op.iLike]: `%${keyword}%` } }
    ]
  };
};

