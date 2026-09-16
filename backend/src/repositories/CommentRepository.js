/**
 * Comment Repository
 * 
 * Repository layer untuk Comment model.
 * Menangani semua operasi data access untuk Comment.
 * 
 * @module repositories/CommentRepository
 */

import db from '../infrastructure/database/models/index.js';

const { Comment, News } = db;

export class CommentRepository {
  /**
   * Create new comment
   * 
   * @param {Object} data - Comment data
   * @returns {Promise<Object>} Created comment object
   */
  async create(data) {
    return await Comment.create(data);
  }

  /**
   * Find comment by primary key
   * 
   * @param {number} id - Comment ID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Comment object or null
   */
  async findById(id, options = {}) {
    return await Comment.findByPk(id, {
      include: options.include || [
        { model: News, as: 'news', attributes: ['newsId', 'title'] }
      ],
      ...options
    });
  }

  /**
   * Find and count all comments
   * 
   * @param {Object} options - Query options
   * @returns {Promise<Object>} { count, rows }
   */
  async findAndCountAll(options = {}) {
    return await Comment.findAndCountAll({
      include: options.include || [
        { model: News, as: 'news', attributes: ['newsId', 'title'] }
      ],
      ...options
    });
  }

  /**
   * Find all comments
   * 
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of comment objects
   */
  async findAll(options = {}) {
    return await Comment.findAll({
      include: options.include || [
        { model: News, as: 'news', attributes: ['newsId', 'title'] }
      ],
      ...options
    });
  }

  /**
   * Find comments by news ID
   * 
   * @param {number} newsId - News ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of comment objects
   */
  async findByNewsId(newsId, options = {}) {
    return await Comment.findAll({
      where: { newsId },
      ...options
    });
  }

  /**
   * Update comment by ID
   * 
   * @param {number} id - Comment ID
   * @param {Object} data - Update data
   * @returns {Promise<Array>} [affectedRows, updatedRows]
   */
  async update(id, data) {
    return await Comment.update(data, {
      where: { commentId: id },
      returning: true
    });
  }

  /**
   * Delete comment by ID
   * 
   * @param {number} id - Comment ID
   * @returns {Promise<number>} Number of deleted rows
   */
  async delete(id) {
    return await Comment.destroy({
      where: { commentId: id }
    });
  }
}

