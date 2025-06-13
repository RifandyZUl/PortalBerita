import { validationResult } from 'express-validator';
import db from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

const { News, Author, Category, Admin } = db;

// GET /api/news
export const getAllNews = async (req, res) => {
  try {
    const news = await News.findAll({
      order: [['newsId', 'DESC']],
      include: [
        { model: Author, attributes: ['authorId', 'name'] },
        { model: Category, attributes: ['categoryId', 'name'] },
        { model: Admin, attributes: ['adminId', 'username'] },
      ],
    });

    return successResponse(res, 'Berhasil mengambil semua berita.', news);
  } catch (err) {
    console.error('❌ Error fetching all news:', err.message);
    return errorResponse(res, 'Gagal mengambil berita.', err.message, 500);
  }
};

// GET /api/news/:id
export const getNewsById = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id, {
      include: [
        { model: Author, attributes: ['authorId', 'name'] },
        { model: Category, attributes: ['categoryId', 'name'] },
        { model: Admin, attributes: ['adminId', 'username'] },
      ],
    });

    if (!news) {
      return errorResponse(res, 'Berita tidak ditemukan.', null, 404);
    }

    return successResponse(res, 'Berhasil mengambil detail berita.', news);
  } catch (err) {
    console.error('❌ Error fetching news by ID:', err.message);
    return errorResponse(res, 'Gagal mengambil berita.', err.message, 500);
  }
};

// POST /api/news
export const createNews = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validasi gagal.', errors.array(), 400);
  }

  const {
    title,
    content,
    imageUrl,
    authorId,
    categoryId,
    status,
    publishedAt,
  } = req.body;

  const adminId = req.admin?.adminId;

  try {
    const newNews = await News.create({
      title,
      content,
      imageUrl,
      authorId,
      categoryId,
      adminId,
      status,
      publishedAt: publishedAt || new Date(),
    });

    return successResponse(res, 'Berita berhasil dibuat.', newNews, 201);
  } catch (err) {
    console.error('❌ Error creating news:', err.message);
    return errorResponse(res, 'Gagal membuat berita.', err.message, 500);
  }
};

// PUT /api/news/:id
export const updateNews = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validasi gagal.', errors.array(), 400);
  }

  try {
    const news = await News.findByPk(req.params.id);
    if (!news) {
      return errorResponse(res, 'Berita tidak ditemukan.', null, 404);
    }

    const {
      title,
      content,
      imageUrl,
      authorId,
      categoryId,
      status,
      publishedAt,
    } = req.body;

    const adminId = req.admin?.adminId;

    await news.update({
      title,
      content,
      imageUrl,
      authorId,
      categoryId,
      adminId,
      status,
      publishedAt: publishedAt || new Date(),
    });

    return successResponse(res, 'Berita berhasil diperbarui.', news);
  } catch (err) {
    console.error('❌ Error updating news:', err.message);
    return errorResponse(res, 'Gagal memperbarui berita.', err.message, 500);
  }
};

// DELETE /api/news/:id
export const deleteNews = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) {
      return errorResponse(res, 'Berita tidak ditemukan.', null, 404);
    }

    await news.destroy();
    return successResponse(res, 'Berita berhasil dihapus.');
  } catch (err) {
    console.error('❌ Error deleting news:', err.message);
    return errorResponse(res, 'Gagal menghapus berita.', err.message, 500);
  }
};
