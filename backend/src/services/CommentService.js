/**
 * Comment Service
 * 
 * Service layer untuk Comment business logic.
 * Menangani semua business logic untuk Comment.
 * 
 * Mengikuti Clean Code dan SOLID principles:
 * - Single Responsibility: Setiap method hanya melakukan satu tugas
 * - DRY: Menggunakan helper utilities untuk operasi yang berulang
 * 
 * @module services/CommentService
 */

import { CommentRepository } from '../repositories/CommentRepository.js';
import { NewsRepository } from '../repositories/NewsRepository.js';
import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import { normalizePaginationParams } from '../utils/paginationHelpers.js';
import { buildCommentWhereClause } from '../utils/filterHelpers.js';
import { validateCommentStatus } from '../utils/validationHelpers.js';
import { sanitizeComment } from '../utils/securityHelpers.js';

const COMMENT_DEFAULT_STATUS = 'Pending';
const COMMENT_APPROVED_STATUS = 'Approved';

export class CommentService {
  constructor() {
    this.commentRepository = new CommentRepository();
    this.newsRepository = new NewsRepository();
  }

  /**
   * Get all comments with filters and pagination
   * 
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Comments with pagination
   */
  async getAllComments(filters = {}) {
    const { page, limit, offset } = normalizePaginationParams(filters, 10);
    const where = buildCommentWhereClause(filters);

    const { count, rows } = await this.commentRepository.findAndCountAll({
      where,
      offset,
      limit,
      order: [['createdAt', 'DESC']]
    });

    return {
      comments: rows,
      pagination: {
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        currentPage: page,
        perPage: limit
      }
    };
  }

  /**
   * Get comment by ID
   * 
   * @param {number} id - Comment ID
   * @returns {Promise<Object>} Comment object
   * @throws {AppError} If comment not found
   */
  async getCommentById(id) {
    const comment = await this.commentRepository.findById(id);
    
    if (!comment) {
      throw new AppError(MESSAGES.COMMENT.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return comment;
  }

  /**
   * Create new comment
   * 
   * @param {Object} commentData - Comment data
   * @returns {Promise<Object>} Created comment object
   * @throws {AppError} If news not found
   */
  async createComment(commentData) {
    const { newsId, comment, name, email } = commentData;

    await this._validateNewsExists(newsId);

    // Sanitize all user inputs to prevent XSS
    const sanitizedComment = sanitizeComment(comment);
    const sanitizedName = sanitizeComment(name);

    // Email sudah dinormalize oleh validator (.normalizeEmail())
    // Tapi kita tetap trim untuk safety jika ada whitespace yang terlewat
    const normalizedEmail = email.trim().toLowerCase();

    const newComment = await this.commentRepository.create({
      newsId,
      comment: sanitizedComment,
      name: sanitizedName,
      email: normalizedEmail,
      status: COMMENT_DEFAULT_STATUS
    });

    return newComment;
  }

  /**
   * Update comment
   * 
   * @param {number} id - Comment ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated comment object
   * @throws {AppError} If comment not found
   */
  async updateComment(id, updateData) {
    await this._findCommentOrThrow(id);
    await this.commentRepository.update(id, updateData);
    return await this.commentRepository.findById(id);
  }

  /**
   * Delete comment
   * 
   * @param {number} id - Comment ID
   * @returns {Promise<void>}
   * @throws {AppError} If comment not found
   */
  async deleteComment(id) {
    await this._findCommentOrThrow(id);
    await this.commentRepository.delete(id);
  }

  /**
   * Get comments by news ID
   * 
   * @param {number} newsId - News ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of comment objects
   */
  async getCommentsByNewsId(newsId, options = {}) {
    return await this.commentRepository.findByNewsId(newsId, {
      order: [['createdAt', 'DESC']],
      ...options
    });
  }

  /**
   * Update comment status
   * 
   * @param {number} id - Comment ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated comment object
   * @throws {AppError} If comment not found or status invalid
   */
  async updateCommentStatus(id, status) {
    validateCommentStatus(status);
    await this._findCommentOrThrow(id);
    await this.commentRepository.update(id, { status });
    return await this.commentRepository.findById(id);
  }

  /**
   * Get comments by news slug (public)
   * 
   * @param {string} slug - News slug
   * @returns {Promise<Array>} Array of approved comment objects
   * @throws {AppError} If news not found
   */
  async getCommentsByNewsSlug(slug) {
    const news = await this.newsRepository.findBySlug(slug);
    
    if (!news) {
      throw new AppError(MESSAGES.NEWS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return await this.commentRepository.findByNewsId(news.newsId, {
      where: {
        status: COMMENT_APPROVED_STATUS
      },
      order: [['createdAt', 'DESC']]
    });
  }

  // ========== Private Helper Methods ==========

  /**
   * Validate news exists
   * 
   * @param {number} newsId - News ID
   * @throws {AppError} If news not found
   * @private
   */
  async _validateNewsExists(newsId) {
    const news = await this.newsRepository.findById(newsId);
    if (!news) {
      throw new AppError(MESSAGES.NEWS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
  }

  /**
   * Find comment by ID or throw error
   * 
   * @param {number} id - Comment ID
   * @returns {Promise<Object>} Comment object
   * @throws {AppError} If comment not found
   * @private
   */
  async _findCommentOrThrow(id) {
    const comment = await this.commentRepository.findById(id);
    
    if (!comment) {
      throw new AppError(MESSAGES.COMMENT.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    
    return comment;
  }
}
