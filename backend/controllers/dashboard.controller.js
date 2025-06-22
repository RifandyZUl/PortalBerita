import db from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { Op } from 'sequelize';

const { News, Comment, Category, Sequelize } = db;
const { fn } = Sequelize;

export const getDashboardStats = async (req, res) => {
  try {
    const totalNews = await News.count();
    const totalComments = await Comment.count();
    const totalViews = await News.sum('views') || 0;
    return successResponse(res, 'Sukses', { totalNews, totalComments, totalViews });
  } catch (err) {
    return errorResponse(res, 'Gagal ambil stats', err.message);
  }
};

export const getRecentArticles = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const { rows: articles, count } = await News.findAndCountAll({
      attributes: ['newsId', 'title', 'content', 'views', 'publishedAt'],
      include: [{ model: Category, attributes: ['name'] }],
      order: [['publishedAt', 'DESC']],
      limit,
      offset,
    });

    const articlesWithComments = await Promise.all(
      articles.map(async (article) => {
        const commentsCount = await Comment.count({ where: { newsId: article.newsId } });

        return {
          ...article.get(),
          commentsCount,
          categoryName: article.Category?.name || 'Uncategorized',
        };
      })
    );

    return successResponse(res, 'Sukses ambil artikel', {
      articles: articlesWithComments,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    return errorResponse(res, 'Gagal ambil artikel', err.message, 400);
  }
};

export const getRecentComments = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const { rows: comments, count } = await Comment.findAndCountAll({
      include: [{ model: News, attributes: ['title'], as: 'news' }],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return successResponse(res, 'Sukses ambil komentar', {
      comments,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    return errorResponse(res, 'Gagal ambil komentar', err.message);
  }
};


// GET /dashboard/articles/all?page=1&limit=10
export const getAllArticlesPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await News.findAndCountAll({
      attributes: ['newsId', 'title', 'content', 'views', 'publishedAt'],
      include: [{ model: Category, attributes: ['name'] }],
      order: [['publishedAt', 'DESC']],
      limit,
      offset
    });

    const articlesWithComments = await Promise.all(
      rows.map(async (article) => {
        const commentsCount = await Comment.count({ where: { newsId: article.newsId } });
        return {
          ...article.get(),
          commentsCount,
          categoryName: article.Category?.name || 'Uncategorized',
        };
      })
    );

    return successResponse(res, 'Sukses ambil artikel dengan pagination', {
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      articles: articlesWithComments
    });
  } catch (err) {
    return errorResponse(res, 'Gagal ambil semua artikel', err.message);
  }
};

// GET /dashboard/comments/all?page=1&limit=10
export const getAllCommentsPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Comment.findAndCountAll({
      include: [{ model: News, attributes: ['title'], as: 'news' }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    return successResponse(res, 'Sukses ambil komentar dengan pagination', {
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      comments: rows
    });
  } catch (err) {
    return errorResponse(res, 'Gagal ambil semua komentar', err.message);
  }
};

