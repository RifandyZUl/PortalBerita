/**
 * Category Repository
 * 
 * Repository layer untuk Category model.
 * Menangani semua operasi data access untuk Category.
 * 
 * @module repositories/CategoryRepository
 */

import db from '../infrastructure/database/models/index.js';

const { Category, News } = db;

export class CategoryRepository {
  /**
   * Create new category
   * 
   * @param {Object} data - Category data
   * @returns {Promise<Object>} Created category object
   */
  async create(data) {
    return await Category.create(data);
  }

  /**
   * Find category by primary key
   * 
   * @param {number} id - Category ID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Category object or null
   */
  async findById(id, options = {}) {
    return await Category.findByPk(id, options);
  }

  /**
   * Find category by slug
   * 
   * @param {string} slug - Category slug
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Category object or null
   */
  async findBySlug(slug, options = {}) {
    return await Category.findOne({
      where: { slug },
      ...options
    });
  }

  /**
   * Find category by name
   * 
   * @param {string} name - Category name
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Category object or null
   */
  async findByName(name, options = {}) {
    return await Category.findOne({
      where: { name },
      ...options
    });
  }

  /**
   * Find and count all categories
   * 
   * @param {Object} options - Query options
   * @returns {Promise<Object>} { count, rows }
   */
  async findAndCountAll(options = {}) {
    return await Category.findAndCountAll(options);
  }

  /**
   * Find all categories
   * 
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of category objects
   */
  async findAll(options = {}) {
    return await Category.findAll(options);
  }

  /**
   * Update category by ID
   * 
   * @param {number} id - Category ID
   * @param {Object} data - Update data
   * @returns {Promise<Array>} [affectedRows, updatedRows]
   */
  async update(id, data) {
    return await Category.update(data, {
      where: { categoryId: id },
      returning: true
    });
  }

  /**
   * Delete category by ID
   * 
   * @param {number} id - Category ID
   * @returns {Promise<number>} Number of deleted rows
   */
  async delete(id) {
    return await Category.destroy({
      where: { categoryId: id }
    });
  }

  /**
   * Check if category has news
   * 
   * @param {number} id - Category ID
   * @returns {Promise<boolean>} True if category has news
   */
  async hasNews(id) {
    const count = await News.count({
      where: { categoryId: id }
    });
    return count > 0;
  }

  /**
   * Get category with news count
   * 
   * @param {number} id - Category ID
   * @returns {Promise<Object|null>} Category with news count
   */
  async findByIdWithNewsCount(id) {
    const category = await Category.findByPk(id);
    if (!category) return null;

    const newsCount = await News.count({
      where: { categoryId: id }
    });

    return {
      ...category.toJSON(),
      newsCount
    };
  }
}

