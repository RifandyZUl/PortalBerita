/**
 * Dashboard Controller
 * 
 * Controller layer untuk Dashboard endpoints.
 * Thin controller yang hanya menangani HTTP request/response.
 * Business logic ada di DashboardService.
 * 
 * @module controllers/DashboardController
 */

import { DashboardService } from '../services/DashboardService.js';
import { successResponse } from '../utils/responseHandler.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../utils/errorHandler.js';

export class DashboardController {
  constructor() {
    this.dashboardService = new DashboardService();
  }

  /**
   * Get dashboard statistics
   * GET /api/dashboard/stats
   */
  getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await this.dashboardService.getDashboardStats();
    
    return successResponse(res, MESSAGES.DASHBOARD.STATS_RETRIEVED, stats);
  });

  /**
   * Get recent articles
   * GET /api/dashboard/articles/recent
   */
  getRecentArticles = asyncHandler(async (req, res) => {
    const result = await this.dashboardService.getRecentArticles(req.query);
    
    return successResponse(res, 'Sukses ambil artikel', result);
  });

  /**
   * Get recent comments
   * GET /api/dashboard/comments/recent
   */
  getRecentComments = asyncHandler(async (req, res) => {
    const result = await this.dashboardService.getRecentComments(req.query);
    
    return successResponse(res, 'Sukses ambil komentar', result);
  });

  /**
   * Get all articles with pagination
   * GET /api/dashboard/articles/all
   */
  getAllArticlesPaginated = asyncHandler(async (req, res) => {
    const result = await this.dashboardService.getAllArticlesPaginated(req.query);
    
    return successResponse(res, 'Sukses ambil artikel dengan pagination', result);
  });

  /**
   * Get all comments with pagination
   * GET /api/dashboard/comments/all
   */
  getAllCommentsPaginated = asyncHandler(async (req, res) => {
    const result = await this.dashboardService.getAllCommentsPaginated(req.query);
    
    return successResponse(res, 'Sukses ambil komentar dengan pagination', result);
  });
}

// Export instance methods as functions for backward compatibility
const dashboardController = new DashboardController();

export const getDashboardStats = dashboardController.getDashboardStats;
export const getRecentArticles = dashboardController.getRecentArticles;
export const getRecentComments = dashboardController.getRecentComments;
export const getAllArticlesPaginated = dashboardController.getAllArticlesPaginated;
export const getAllCommentsPaginated = dashboardController.getAllCommentsPaginated;

