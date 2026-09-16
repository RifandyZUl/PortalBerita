/**
 * Comment Controller
 * 
 * Controller layer untuk Comment endpoints.
 * Thin controller yang hanya menangani HTTP request/response.
 * Business logic ada di CommentService.
 * 
 * @module controllers/CommentController
 */

import { CommentService } from '../services/CommentService.js';
import { successResponse } from '../utils/responseHandler.js';
import { MESSAGES } from '../constants/messages.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/errorHandler.js';

export class CommentController {
  constructor() {
    this.commentService = new CommentService();
  }

  /**
   * Get all comments
   * GET /api/comments
   */
  getAllComments = asyncHandler(async (req, res) => {
    const result = await this.commentService.getAllComments(req.query);
    
    return successResponse(res, MESSAGES.COMMENT.RETRIEVED, result);
  });

  /**
   * Get comment by ID
   * GET /api/comments/:id
   */
  getCommentById = asyncHandler(async (req, res) => {
    const comment = await this.commentService.getCommentById(
      parseInt(req.params.id)
    );
    
    return successResponse(res, 'Berhasil mengambil komentar.', comment);
  });

  /**
   * Create comment
   * POST /api/comments
   */
  createComment = asyncHandler(async (req, res) => {
    const comment = await this.commentService.createComment(req.body);
    
    return successResponse(res, MESSAGES.COMMENT.CREATED, comment);
  });

  /**
   * Update comment
   * PUT /api/comments/:id
   */
  updateComment = asyncHandler(async (req, res) => {
    const comment = await this.commentService.updateComment(
      parseInt(req.params.id),
      req.body
    );
    
    return successResponse(res, MESSAGES.COMMENT.UPDATED, comment);
  });

  /**
   * Delete comment
   * DELETE /api/comments/:id
   */
  deleteComment = asyncHandler(async (req, res) => {
    await this.commentService.deleteComment(parseInt(req.params.id));
    
    return successResponse(res, MESSAGES.COMMENT.DELETED);
  });

  /**
   * Update comment status
   * PATCH /api/comments/:id/status
   */
  updateCommentStatus = asyncHandler(async (req, res) => {
    const comment = await this.commentService.updateCommentStatus(
      parseInt(req.params.id),
      req.body.status
    );
    
    return successResponse(res, 'Status komentar berhasil diperbarui.', comment);
  });

  /**
   * Get comments by news slug (public)
   * GET /api/comments/public/:slug
   */
  getCommentsByNewsSlug = asyncHandler(async (req, res) => {
    const comments = await this.commentService.getCommentsByNewsSlug(req.params.slug);
    
    return res.json(comments);
  });

  /**
   * Create comment by news ID
   * POST /api/comments/:newsId
   * 
   * Note: Validation sudah dilakukan di route level dengan validateCreateComment
   */
  createCommentByNewsId = asyncHandler(async (req, res) => {
    const { newsId } = req.params;
    const { name, email, comment } = req.body;

    // Validasi sudah dilakukan di route level, langsung panggil service
    const newComment = await this.commentService.createComment({
      newsId: parseInt(newsId),
      name,
      email,
      comment
    });
    
    return successResponse(
      res,
      'Komentar berhasil dikirim dan menunggu persetujuan.',
      newComment,
      HTTP_STATUS.CREATED
    );
  });
}

// Export instance methods as functions for backward compatibility
const commentController = new CommentController();

export const getAllComments = commentController.getAllComments;
export const getCommentById = commentController.getCommentById;
export const createComment = commentController.createCommentByNewsId;
export const updateComment = commentController.updateComment;
export const deleteComment = commentController.deleteComment;
export const updateCommentStatus = commentController.updateCommentStatus;
export const getCommentsByNewsSlug = commentController.getCommentsByNewsSlug;

