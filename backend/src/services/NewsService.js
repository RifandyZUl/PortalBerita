/**
 * News Service
 * 
 * Service layer untuk News business logic.
 * Menangani semua business logic untuk News, termasuk validasi,
 * sanitization, dan operasi kompleks.
 * 
 * Mengikuti Clean Code dan SOLID principles:
 * - Single Responsibility: Setiap method hanya melakukan satu tugas
 * - DRY: Menggunakan helper utilities untuk operasi yang berulang
 * - Dependency Injection: Menggunakan repositories
 * 
 * @module services/NewsService
 */

import { NewsRepository } from '../repositories/NewsRepository.js';
import { CategoryRepository } from '../repositories/CategoryRepository.js';
import { AuthorRepository } from '../repositories/AuthorRepository.js';
import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import {
  generateSlug,
  sanitizeContent,
  generateSummary,
  mapNewsToPublicFormat,
  mapNewsListToPublicFormat,
  buildNewsWhereClause,
  validateRequiredNewsFields,
} from '../utils/newsHelpers.js';
import { validateNewsId, validateSearchKeyword } from '../utils/validationHelpers.js';
import { calculateOffset } from '../utils/paginationHelpers.js';
import { getCache, setCache, clearCacheByPattern } from '../utils/cache.js';

// Cache keys
const CACHE_KEYS = {
  POPULAR_NEWS: 'news:popular',
  CATEGORY_NEWS: 'news:category:'
};

// Cache TTL
const CACHE_TTL = {
  POPULAR_NEWS: 10 * 60 * 1000, // 10 menit
  CATEGORY_NEWS: 5 * 60 * 1000 // 5 menit
};

export class NewsService {
  constructor() {
    this.newsRepository = new NewsRepository();
    this.categoryRepository = new CategoryRepository();
    this.authorRepository = new AuthorRepository();
  }

  /**
   * Create new news article
   * 
   * @param {Object} newsData - News data
   * @param {number} adminId - Admin ID
   * @returns {Promise<Object>} Created news object
   * @throws {AppError} If validation fails
   */
  async createNews(newsData, adminId) {
    this._validateCreateNewsData(newsData);
    
    await this._validateCategoryAndAuthor(newsData.categoryId, newsData.authorId);
    
    // Generate slug dari title (jangan gunakan slug dari newsData jika ada)
    const slug = await this._generateUniqueSlug(newsData.title);
    const sanitizedContent = sanitizeContent(newsData.content);
    const summary = generateSummary(sanitizedContent);
    
    // Pastikan hanya field yang diperlukan yang dikirim ke repository
    // Explicitly build the data object to avoid any unwanted fields
    // Convert all values to proper types to prevent Sequelize validation errors
    const createData = {
      title: String(newsData.title).trim(),
      slug: String(slug), // Pastikan slug adalah string, bukan array atau object
      content: String(sanitizedContent),
      summary: String(summary),
      imageUrl: newsData.imageUrl ? String(newsData.imageUrl) : null,
      authorId: parseInt(newsData.authorId),
      categoryId: parseInt(newsData.categoryId),
      adminId: parseInt(adminId),
      status: String(newsData.status || 'draft'),
      publishedAt: this._determinePublishedAt(newsData.status, newsData.publishedAt),
      views: 0
    };
    
    const news = await this.newsRepository.create(createData);

    // Clear related caches
    await clearCacheByPattern('news:*');
    await clearCacheByPattern('dashboard:*');

    return news;
  }

  /**
   * Get all news with pagination and filters
   * 
   * @param {Object} filters - Filter options
   * @param {boolean} isAdmin - Is admin request
   * @returns {Promise<Object>} News list with pagination
   */
  async getAllNews(filters = {}, isAdmin = false) {
    const { page = 1, limit = 10, sort = 'publishedAt', order = 'DESC' } = filters;
    const offset = calculateOffset(page, limit);
    const where = buildNewsWhereClause(filters, isAdmin);

    const { count, rows } = await this.newsRepository.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      order: [[sort, order.toUpperCase()]],
      include: ['Category', 'Author', 'Admin']
    });

    const mappedArticles = this._mapNewsWithRelations(rows);

    return {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      articles: mappedArticles
    };
  }

  /**
   * Get published news for public
   * 
   * @param {Object} filters - Filter options (category, keyword, limit, page)
   * @returns {Promise<Array>} Array of published news
   */
  async getPublishedNews(filters = {}) {
    const { category, keyword, limit, page } = filters;
    const where = { status: 'published' };
    
    // Debug logging
    console.log('🔍 [getPublishedNews] Filters received:', { category, keyword, limit, page });
    
    if (category) {
      const categoryObj = await this.categoryRepository.findByName(category);
      if (!categoryObj) {
        return [];
      }
      where.categoryId = categoryObj.categoryId;
    }

    let news;
    
    // Jika ada keyword, gunakan search method
    if (keyword && keyword.trim()) {
      const trimmedKeyword = keyword.trim();
      console.log('🔍 [getPublishedNews] Using search with keyword:', trimmedKeyword);
      news = await this.newsRepository.search(trimmedKeyword, {
        where,
        order: [['publishedAt', 'DESC']],
        limit: limit && !isNaN(limit) ? parseInt(limit) : undefined,
        include: ['Category', 'Author']
      });
      console.log('🔍 [getPublishedNews] Search results count:', news?.length || 0);
    } else {
      // Jika tidak ada keyword, gunakan findAll biasa
      console.log('🔍 [getPublishedNews] No keyword, using findAll');
      news = await this.newsRepository.findAll({
        where,
        order: [['publishedAt', 'DESC']],
        limit: limit && !isNaN(limit) ? parseInt(limit) : undefined,
        include: ['Category', 'Author']
      });
    }

    return mapNewsListToPublicFormat(news);
  }

  /**
   * Get news by slug (public)
   * 
   * @param {string} slug - News slug
   * @returns {Promise<Object>} News object
   * @throws {AppError} If news not found
   */
  async getNewsBySlug(slug) {
    const news = await this.newsRepository.findBySlugWithStatus(slug, 'published');

    if (!news) {
      throw new AppError(MESSAGES.NEWS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return mapNewsToPublicFormat(news);
  }

  /**
   * Get news by ID
   * 
   * @param {number} id - News ID
   * @param {boolean} isAdmin - Is admin request
   * @returns {Promise<Object>} News object
   * @throws {AppError} If news not found
   */
  async getNewsById(id, isAdmin = false) {
    const news = await this.newsRepository.findById(id, {
      include: ['Category', 'Author', 'Admin']
    });

    if (!news) {
      throw new AppError(MESSAGES.NEWS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (!isAdmin && news.status !== 'published') {
      throw new AppError(MESSAGES.NEWS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return news;
  }

  /**
   * Update news
   * 
   * @param {number} id - News ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated news object
   * @throws {AppError} If news not found or validation fails
   */
  async updateNews(id, updateData) {
    const existingNews = await this._findNewsOrThrow(id);
    
    if (updateData.title && updateData.title !== existingNews.title) {
      updateData.slug = await this._generateUniqueSlugForUpdate(updateData.title, id);
    }

    if (updateData.content) {
      updateData.content = sanitizeContent(updateData.content);
      updateData.summary = generateSummary(updateData.content);
    }

    if (updateData.status === 'published' && existingNews.status !== 'published') {
      updateData.publishedAt = updateData.publishedAt || new Date();
    }

    await this.newsRepository.update(id, updateData);
    
    // Clear related caches
    await clearCacheByPattern('news:*');
    await clearCacheByPattern('dashboard:*');
    
    return await this.newsRepository.findById(id, {
      include: ['Category', 'Author', 'Admin']
    });
  }

  /**
   * Delete news
   * 
   * @param {number} id - News ID
   * @returns {Promise<void>}
   * @throws {AppError} If news not found
   */
  async deleteNews(id) {
    await this._findNewsOrThrow(id);
    await this.newsRepository.delete(id);
    
    // Clear related caches
    await clearCacheByPattern('news:*');
    await clearCacheByPattern('dashboard:*');
  }

  /**
   * Search news by keyword
   * 
   * @param {string} keyword - Search keyword
   * @param {Object} options - Search options
   * @returns {Promise<Array>} Array of news objects
   * @throws {AppError} If keyword is too short
   */
  async searchNews(keyword, options = {}) {
    validateSearchKeyword(keyword);

    const { sort = 'createdAt', order = 'DESC', limit } = options;

    return await this.newsRepository.search(keyword.trim(), {
      where: { status: 'published' },
      order: [[sort, order.toUpperCase()]],
      limit: limit && !isNaN(limit) ? parseInt(limit) : undefined,
      include: ['Category', 'Author']
    });
  }

  /**
   * Get popular news (by views)
   * Dengan caching untuk meningkatkan performa
   * 
   * @param {number} limit - Number of results
   * @returns {Promise<Array>} Array of news objects
   */
  async getPopularNews(limit = 5) {
    const cacheKey = `${CACHE_KEYS.POPULAR_NEWS}:${limit}`;
    
    // Check cache first
    const cached = await getCache(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from database
    const news = await this.newsRepository.getPopular(limit, {
      include: ['Category', 'Author']
    });

    const result = mapNewsListToPublicFormat(news);

    // Cache the result
    await setCache(cacheKey, result, CACHE_TTL.POPULAR_NEWS);

    return result;
  }

  /**
   * Increment views count
   * 
   * @param {number|string} id - News ID
   * @returns {Promise<void>}
   * @throws {AppError} If news not found
   */
  async incrementViews(id) {
    const newsId = validateNewsId(id);
    await this._findNewsOrThrow(newsId);
    await this.newsRepository.incrementViews(newsId);
    
    // Clear popular news cache karena views berubah
    await clearCacheByPattern('news:popular:*');
  }

  // ========== Private Helper Methods ==========

  /**
   * Validate create news data
   * 
   * @param {Object} newsData - News data
   * @throws {AppError} If validation fails
   * @private
   */
  _validateCreateNewsData(newsData) {
    if (!validateRequiredNewsFields(newsData)) {
      throw new AppError(MESSAGES.VALIDATION.REQUIRED, HTTP_STATUS.BAD_REQUEST);
    }

    if (!newsData.imageUrl) {
      throw new AppError(MESSAGES.VALIDATION.IMAGE_REQUIRED, HTTP_STATUS.BAD_REQUEST);
    }
  }

  /**
   * Validate category and author exist
   * 
   * @param {number} categoryId - Category ID
   * @param {number} authorId - Author ID
   * @throws {AppError} If category or author not found
   * @private
   */
  async _validateCategoryAndAuthor(categoryId, authorId) {
    const [category, author] = await Promise.all([
      this.categoryRepository.findById(categoryId),
      this.authorRepository.findById(authorId)
    ]);

    if (!category) {
      throw new AppError(MESSAGES.CATEGORY.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (!author) {
      throw new AppError(MESSAGES.AUTHOR.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
  }

  /**
   * Generate unique slug from title
   * 
   * @param {string} title - News title
   * @returns {Promise<string>} Unique slug
   * @throws {AppError} If slug already exists
   * @private
   */
  async _generateUniqueSlug(title) {
    const slug = generateSlug(title);
    const existingNews = await this.newsRepository.findBySlug(slug);
    
    if (existingNews) {
      throw new AppError(MESSAGES.NEWS.ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
    }
    
    return slug;
  }

  /**
   * Generate unique slug for update (checking if different news has same slug)
   * 
   * @param {string} title - News title
   * @param {number} currentNewsId - Current news ID
   * @returns {Promise<string>} Unique slug
   * @throws {AppError} If slug already exists for different news
   * @private
   */
  async _generateUniqueSlugForUpdate(title, currentNewsId) {
    const slug = generateSlug(title);
    const existingNews = await this.newsRepository.findBySlug(slug);
    
    if (existingNews && existingNews.newsId !== currentNewsId) {
      throw new AppError(MESSAGES.NEWS.ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
    }
    
    return slug;
  }

  /**
   * Determine publishedAt date based on status
   * 
   * @param {string} status - News status
   * @param {Date|string} publishedAt - Provided publishedAt date
   * @returns {Date|null} Published date or null
   * @private
   */
  _determinePublishedAt(status, publishedAt) {
    if (status === 'published') {
      return publishedAt || new Date();
    }
    return publishedAt || null;
  }

  /**
   * Find news by ID or throw error
   * 
   * @param {number} id - News ID
   * @returns {Promise<Object>} News object
   * @throws {AppError} If news not found
   * @private
   */
  async _findNewsOrThrow(id) {
    const news = await this.newsRepository.findById(id);
    
    if (!news) {
      throw new AppError(MESSAGES.NEWS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    
    return news;
  }

  /**
   * Map news with relations to include category and author names
   * 
   * @param {Array} newsList - Array of news objects
   * @returns {Array} Mapped news array
   * @private
   */
  _mapNewsWithRelations(newsList) {
    return newsList.map(news => ({
      ...news.toJSON(),
      categoryName: news.Category?.name || 'Uncategorized',
      authorName: news.Author?.name || 'Unknown',
    }));
  }
}
