/**
 * Author Repository
 * 
 * Repository layer untuk Author model.
 * Menangani semua operasi data access untuk Author.
 * 
 * @module repositories/AuthorRepository
 */

import db from '../infrastructure/database/models/index.js';

const { Author, News } = db;

export class AuthorRepository {
  /**
   * Create new author
   * 
   * @param {Object} data - Author data
   * @returns {Promise<Object>} Created author object
   */
  async create(data) {
    return await Author.create(data);
  }

  /**
   * Find author by primary key
   * 
   * @param {number} id - Author ID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Author object or null
   */
  async findById(id, options = {}) {
    return await Author.findByPk(id, options);
  }

  /**
   * Find author by name
   * 
   * @param {string} name - Author name
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Author object or null
   */
  async findByName(name, options = {}) {
    return await Author.findOne({
      where: { name },
      ...options
    });
  }

  /**
   * Find and count all authors
   * 
   * @param {Object} options - Query options
   * @returns {Promise<Object>} { count, rows }
   */
  async findAndCountAll(options = {}) {
    return await Author.findAndCountAll(options);
  }

  /**
   * Find all authors
   * 
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of author objects
   */
  async findAll(options = {}) {
    return await Author.findAll(options);
  }

  /**
   * Update author by ID
   * 
   * @param {number} id - Author ID
   * @param {Object} data - Update data
   * @returns {Promise<Array>} [affectedRows, updatedRows]
   */
  async update(id, data) {
    return await Author.update(data, {
      where: { authorId: id },
      returning: true
    });
  }

  /**
   * Delete author by ID
   * 
   * @param {number} id - Author ID
   * @returns {Promise<number>} Number of deleted rows
   */
  async delete(id) {
    return await Author.destroy({
      where: { authorId: id }
    });
  }

  /**
   * Check if author has news
   * 
   * @param {number} id - Author ID
   * @returns {Promise<boolean>} True if author has news
   */
  async hasNews(id) {
    const count = await News.count({
      where: { authorId: id }
    });
    return count > 0;
  }

  /**
   * Get author with news count
   * 
   * @param {number} id - Author ID
   * @returns {Promise<Object|null>} Author with news count
   */
  async findByIdWithNewsCount(id) {
    const author = await Author.findByPk(id);
    if (!author) return null;

    const newsCount = await News.count({
      where: { authorId: id }
    });

    return {
      ...author.toJSON(),
      newsCount
    };
  }
}

