/**
 * News Repository
 * 
 * Repository layer untuk News model.
 * Menangani semua operasi data access untuk News.
 * Mengimplementasikan Repository Pattern untuk separation of concerns.
 * 
 * @module repositories/NewsRepository
 */

import db from '../infrastructure/database/models/index.js';
import { Op } from 'sequelize';
import { buildIncludes } from '../utils/repositoryHelpers.js';

const { News } = db;

export class NewsRepository {
  /**
   * Create new news article
   * 
   * @param {Object} data - News data
   * @returns {Promise<Object>} Created news object
   */
  async create(data) {
    return await News.create(data);
  }

  /**
   * Find news by primary key (newsId)
   * 
   * @param {number} id - News ID
   * @param {Object} options - Query options (include, attributes, etc.)
   * @returns {Promise<Object|null>} News object or null
   */
  async findById(id, options = {}) {
    const include = buildIncludes(options.include || []);
    
    return await News.findByPk(id, {
      include,
      ...options
    });
  }

  /**
   * Find news by slug
   * 
   * @param {string} slug - News slug
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} News object or null
   */
  async findBySlug(slug, options = {}) {
    const include = buildIncludes(options.include || []);
    
    return await News.findOne({
      where: { slug },
      include,
      ...options
    });
  }

  /**
   * Find news by slug with status check
   * 
   * @param {string} slug - News slug
   * @param {string} status - News status (default: 'published')
   * @returns {Promise<Object|null>} News object or null
   */
  async findBySlugWithStatus(slug, status = 'published') {
    return await News.findOne({
      where: { slug, status },
      include: buildIncludes(['Category', 'Author'])
    });
  }

  /**
   * Find and count all news with filters
   * 
   * @param {Object} options - Query options (where, include, order, limit, offset)
   * @returns {Promise<Object>} { count, rows }
   */
  async findAndCountAll(options = {}) {
    const include = buildIncludes(options.include || []);
    
    return await News.findAndCountAll({
      ...options,
      include
    });
  }

  /**
   * Find all news with filters
   * 
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of news objects
   */
  async findAll(options = {}) {
    const include = buildIncludes(options.include || []);
    
    return await News.findAll({
      ...options,
      include
    });
  }

  /**
   * Update news by ID
   * 
   * @param {number} id - News ID
   * @param {Object} data - Update data
   * @returns {Promise<Array>} [affectedRows, updatedRows]
   */
  async update(id, data) {
    return await News.update(data, {
      where: { newsId: id },
      returning: true
    });
  }

  /**
   * Delete news by ID
   * 
   * @param {number} id - News ID
   * @returns {Promise<number>} Number of deleted rows
   */
  async delete(id) {
    return await News.destroy({
      where: { newsId: id }
    });
  }

  /**
   * Increment views count
   * 
   * @param {number} id - News ID
   * @returns {Promise<void>}
   */
  async incrementViews(id) {
    await News.increment('views', {
      where: { newsId: id }
    });
  }

  /**
   * Find news by category
   * 
   * @param {number} categoryId - Category ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of news objects
   */
  async findByCategory(categoryId, options = {}) {
    return await News.findAll({
      where: {
        categoryId,
        ...options.where
      },
      include: buildIncludes(options.include || ['Category']),
      ...options
    });
  }

  /**
   * Search news by keyword
   * Optimized: Menggunakan full-text search jika keyword cukup panjang
   * 
   * @param {string} keyword - Search keyword
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of news objects
   */
  async search(keyword, options = {}) {
    const trimmedKeyword = keyword.trim();
    
    if (!trimmedKeyword) {
      console.log('🔍 [NewsRepository.search] Empty keyword, returning empty array');
      return [];
    }
    
    // Gunakan full wildcard search untuk mencari keyword di mana saja dalam title dan content
    // Menggunakan iLike untuk case-insensitive search
    const searchPattern = `%${trimmedKeyword}%`;
    
    console.log('🔍 [NewsRepository.search] Searching for keyword:', trimmedKeyword);
    console.log('🔍 [NewsRepository.search] Search pattern:', searchPattern);
    console.log('🔍 [NewsRepository.search] Options where:', options.where);

    // Build where clause dengan benar: gabungkan kondisi existing dengan kondisi search
    const searchCondition = {
      [Op.or]: [
        { title: { [Op.iLike]: searchPattern } },
        { content: { [Op.iLike]: searchPattern } },
        { summary: { [Op.iLike]: searchPattern } } // Juga cari di summary jika ada
      ]
    };

    // Jika ada kondisi where yang sudah ada, gabungkan dengan [Op.and]
    const whereClause = options.where 
      ? {
          [Op.and]: [
            options.where,
            searchCondition
          ]
        }
      : searchCondition;
    
    console.log('🔍 [NewsRepository.search] Final where clause:', JSON.stringify(whereClause, null, 2));

    // Hapus where dari options karena sudah kita set di whereClause
    const { where, ...restOptions } = options;

    const results = await News.findAll({
      where: whereClause,
      include: buildIncludes(restOptions.include || ['Category', 'Author']),
      ...restOptions
    });
    
    console.log('🔍 [NewsRepository.search] Results found:', results.length);
    if (results.length > 0) {
      console.log('🔍 [NewsRepository.search] First result title:', results[0].title);
      console.log('🔍 [NewsRepository.search] First result contains keyword?', 
        results[0].title?.toLowerCase().includes(trimmedKeyword.toLowerCase()) || 
        results[0].content?.toLowerCase().includes(trimmedKeyword.toLowerCase())
      );
    }
    
    return results;
  }

  /**
   * Get popular news (by views)
   * 
   * @param {number} limit - Number of results
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of news objects
   */
  async getPopular(limit = 5, options = {}) {
    return await News.findAll({
      where: {
        status: 'published',
        ...options.where
      },
      order: [['views', 'DESC']],
      limit,
      include: buildIncludes(options.include || ['Category', 'Author']),
      ...options
    });
  }
}

