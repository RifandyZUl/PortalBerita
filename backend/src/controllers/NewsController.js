/**
 * News Controller
 * 
 * Controller layer untuk News endpoints.
 * Thin controller yang hanya menangani HTTP request/response.
 * Business logic ada di NewsService.
 * 
 * @module controllers/NewsController
 */

import { NewsService } from '../services/NewsService.js';
import { successResponse } from '../utils/responseHandler.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../utils/errorHandler.js';

export class NewsController {
  constructor() {
    this.newsService = new NewsService();
  }

  /**
   * Create news
   * POST /api/news
   */
  createNews = asyncHandler(async (req, res) => {
    // Hanya ambil field yang diperlukan dari req.body
    // Jangan include slug, newsId, atau field lain yang tidak boleh dikirim user
    const { 
      title, 
      content, 
      categoryId, 
      authorId, 
      status, 
      imageUrl: bodyImageUrl,
      publishedAt 
    } = req.body;
    
    const newsData = {
      title,
      content,
      categoryId,
      authorId,
      status,
      imageUrl: req.file?.path || bodyImageUrl, // Support both file upload and URL
      publishedAt
    };
    
    const news = await this.newsService.createNews(
      newsData,
      req.admin?.adminId
    );
    
    return successResponse(
      res,
      MESSAGES.NEWS.CREATED,
      news,
      HTTP_STATUS.CREATED
    );
  });

  /**
   * Get all news
   * GET /api/news
   */
  getAllNews = asyncHandler(async (req, res) => {
    const isAdmin = !!req.admin;
    const result = await this.newsService.getAllNews(req.query, isAdmin);
    
    return successResponse(res, MESSAGES.NEWS.RETRIEVED, result);
  });

  /**
   * Get published news (public)
   * GET /api/news/public/list
   */
  getPublishedNews = asyncHandler(async (req, res) => {
    // Support multiple parameter names: keyword, search, q, query
    const keyword = req.query.keyword || req.query.search || req.query.q || req.query.query;
    
    console.log('🔍 [NewsController.getPublishedNews] Query params:', req.query);
    console.log('🔍 [NewsController.getPublishedNews] Extracted keyword:', keyword);
    
    const filters = {
      ...req.query,
      keyword // Ensure keyword is set
    };
    
    const news = await this.newsService.getPublishedNews(filters);
    
    return successResponse(res, MESSAGES.NEWS.PUBLISHED_RETRIEVED, news);
  });

  /**
   * Get news by slug (public)
   * GET /api/news/public/detail/:slug
   */
  getPublicNewsBySlug = asyncHandler(async (req, res) => {
    const news = await this.newsService.getNewsBySlug(req.params.slug);
    
    return successResponse(res, 'Berhasil mengambil detail berita.', news);
  });

  /**
   * Get news by ID
   * GET /api/news/:id
   */
  getNewsById = asyncHandler(async (req, res) => {
    const isAdmin = !!req.admin;
    const news = await this.newsService.getNewsById(
      parseInt(req.params.id),
      isAdmin
    );
    
    return successResponse(res, 'Berhasil mengambil detail berita.', news);
  });

  /**
   * Update news
   * PUT /api/news/:id
   */
  updateNews = asyncHandler(async (req, res) => {
    const updateData = {
      ...req.body,
      imageUrl: req.file?.path || req.body.imageUrl
    };

    const news = await this.newsService.updateNews(
      parseInt(req.params.id),
      updateData
    );
    
    return successResponse(res, MESSAGES.NEWS.UPDATED, news);
  });

  /**
   * Delete news
   * DELETE /api/news/:id
   */
  deleteNews = asyncHandler(async (req, res) => {
    await this.newsService.deleteNews(parseInt(req.params.id));
    
    return successResponse(res, MESSAGES.NEWS.DELETED);
  });

  /**
   * Search news by keyword
   * GET /api/news/search
   */
  searchNewsByKeyword = asyncHandler(async (req, res) => {
    // Support multiple parameter names: keyword, search, q, query
    const keyword = req.query.keyword || req.query.search || req.query.q || req.query.query;
    
    console.log('🔍 [NewsController.searchNewsByKeyword] Query params:', req.query);
    console.log('🔍 [NewsController.searchNewsByKeyword] Extracted keyword:', keyword);
    
    if (!keyword) {
      return successResponse(res, MESSAGES.NEWS.SEARCH_SUCCESS, []);
    }
    
    const news = await this.newsService.searchNews(keyword, req.query);
    
    console.log('🔍 [NewsController.searchNewsByKeyword] Results count:', news?.length || 0);
    
    return successResponse(res, MESSAGES.NEWS.SEARCH_SUCCESS, news);
  });

  /**
   * Get popular news
   * GET /api/news/popular
   */
  getPopularNews = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;
    const news = await this.newsService.getPopularNews(limit);
    
    return successResponse(res, MESSAGES.NEWS.POPULAR_RETRIEVED, news);
  });

  /**
   * Increment views
   * PATCH /api/news/:id/views
   */
  incrementViews = asyncHandler(async (req, res) => {
    await this.newsService.incrementViews(req.params.id);
    
    return successResponse(res, MESSAGES.NEWS.VIEWS_INCREMENTED);
  });
}

// Export instance methods as functions for backward compatibility
const newsController = new NewsController();

export const createNews = newsController.createNews;
export const getAllNews = newsController.getAllNews;
export const getPublishedNews = newsController.getPublishedNews;
export const getPublicNewsBySlug = newsController.getPublicNewsBySlug;
export const getNewsById = newsController.getNewsById;
export const updateNews = newsController.updateNews;
export const deleteNews = newsController.deleteNews;
export const searchNewsByKeyword = newsController.searchNewsByKeyword;
export const getPopularNews = newsController.getPopularNews;
export const incrementViews = newsController.incrementViews;

