/**
 * Dashboard Service
 * 
 * Service layer untuk Dashboard business logic.
 * Menangani statistik dan data untuk dashboard.
 * 
 * Mengikuti Clean Code dan SOLID principles:
 * - Single Responsibility: Setiap method hanya melakukan satu tugas
 * - DRY: Menggunakan helper utilities untuk operasi yang berulang
 * 
 * @module services/DashboardService
 */

import { NewsRepository } from '../repositories/NewsRepository.js';
import { CommentRepository } from '../repositories/CommentRepository.js';
import { CategoryRepository } from '../repositories/CategoryRepository.js';
import db from '../infrastructure/database/models/index.js';
import { Op } from 'sequelize';
import {
  normalizePaginationParams,
  buildDashboardPaginatedResponse,
} from '../utils/paginationHelpers.js';
import { getCache, setCache, clearCacheByPattern } from '../utils/cache.js';

const { News, Comment, Category } = db;

// Cache keys
const CACHE_KEYS = {
  DASHBOARD_STATS: 'dashboard:stats',
  POPULAR_NEWS: 'news:popular',
  CATEGORIES: 'categories:all'
};

// Cache TTL (Time To Live)
const CACHE_TTL = {
  DASHBOARD_STATS: 5 * 60 * 1000, // 5 menit
  POPULAR_NEWS: 10 * 60 * 1000, // 10 menit
  CATEGORIES: 30 * 60 * 1000 // 30 menit
};

export class DashboardService {
  constructor() {
    this.newsRepository = new NewsRepository();
    this.commentRepository = new CommentRepository();
    this.categoryRepository = new CategoryRepository();
  }

  /**
   * Get dashboard statistics
   * Dengan caching untuk meningkatkan performa
   * 
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getDashboardStats() {
    // Check cache first
    const cached = await getCache(CACHE_KEYS.DASHBOARD_STATS);
    if (cached) {
      return cached;
    }

    // Fetch from database
    const [totalNews, totalComments, totalViews] = await Promise.all([
      News.count(),
      Comment.count(),
      News.sum('views') || 0,
    ]);

    const stats = {
      totalNews,
      totalComments,
      totalViews
    };

    // Cache the result
    await setCache(CACHE_KEYS.DASHBOARD_STATS, stats, CACHE_TTL.DASHBOARD_STATS);

    return stats;
  }

  /**
   * Get recent articles with comments count
   * 
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Recent articles with pagination
   */
  async getRecentArticles(filters = {}) {
    const { page, limit, offset } = normalizePaginationParams(filters, 5);

    const { rows: articles, count } = await News.findAndCountAll({
      attributes: ['newsId', 'title', 'content', 'views', 'publishedAt'],
      include: [{ model: Category, attributes: ['name'], as: 'Category' }],
      order: [['publishedAt', 'DESC']],
      limit,
      offset,
    });

    const articlesWithComments = await this._enrichArticlesWithComments(articles);

    return buildDashboardPaginatedResponse(articlesWithComments, 'articles', count, page, limit);
  }

  /**
   * Get recent comments
   * 
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Recent comments with pagination
   */
  async getRecentComments(filters = {}) {
    const { page, limit, offset } = normalizePaginationParams(filters, 5);

    const { rows: comments, count } = await Comment.findAndCountAll({
      include: [{ model: News, attributes: ['title'], as: 'news' }],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return buildDashboardPaginatedResponse(comments, 'comments', count, page, limit);
  }

  /**
   * Get all articles with pagination
   * 
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Articles with pagination
   */
  async getAllArticlesPaginated(filters = {}) {
    const { page, limit, offset } = normalizePaginationParams(filters, 10);

    const { count, rows } = await News.findAndCountAll({
      attributes: ['newsId', 'title', 'content', 'views', 'publishedAt'],
      include: [{ model: Category, attributes: ['name'], as: 'Category' }],
      order: [['publishedAt', 'DESC']],
      limit,
      offset
    });

    const articlesWithComments = await this._enrichArticlesWithComments(rows);

    return buildDashboardPaginatedResponse(articlesWithComments, 'articles', count, page, limit);
  }

  /**
   * Get all comments with pagination
   * 
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Comments with pagination
   */
  async getAllCommentsPaginated(filters = {}) {
    const { page, limit, offset } = normalizePaginationParams(filters, 10);

    const { count, rows } = await Comment.findAndCountAll({
      include: [{ model: News, attributes: ['title'], as: 'news' }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    return buildDashboardPaginatedResponse(rows, 'comments', count, page, limit);
  }

  // ========== Private Helper Methods ==========

  /**
   * Enrich articles with comments count
   * Optimized: Menggunakan single query dengan GROUP BY untuk menghindari N+1 problem
   * 
   * @param {Array} articles - Array of article objects
   * @returns {Promise<Array>} Articles with comments count
   * @private
   */
  async _enrichArticlesWithComments(articles) {
    if (articles.length === 0) {
      return [];
    }

    // Extract news IDs
    const newsIds = articles.map(article => article.newsId);

    // Single query untuk mendapatkan semua comment counts sekaligus
    // Menggunakan GROUP BY untuk menghindari N+1 problem
    const { Sequelize } = db;
    const commentCounts = await Comment.findAll({
      attributes: [
        'newsId',
        [Sequelize.fn('COUNT', Sequelize.col('Comment.commentId')), 'count']
      ],
      where: {
        newsId: { [Op.in]: newsIds }
      },
      group: ['newsId'],
      raw: true
    });

    // Convert to Map untuk O(1) lookup
    const countMap = new Map(
      commentCounts.map(item => [item.newsId, parseInt(item.count)])
    );

    // Map articles dengan comment counts
    return articles.map(article => ({
      ...article.get(),
      commentsCount: countMap.get(article.newsId) || 0,
      categoryName: article.Category?.name || 'Uncategorized',
    }));
  }
}
