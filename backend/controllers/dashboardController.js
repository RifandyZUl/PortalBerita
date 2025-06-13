import db from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

const { News, Comment } = db;

export const getDashboardStats = async (req, res) => {
  try {
    const totalNews = await News.count();
    const totalComments = await Comment.count();
    const totalViews = await News.sum('views') || 0;

    return successResponse(res, 'Statistik dashboard berhasil diambil', {
      totalNews,
      totalComments,
      totalViews,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('❌ Error fetching dashboard stats:', err.message);
    }
    return errorResponse(res, 'Gagal mengambil data statistik dashboard', err.message);
  }
};
