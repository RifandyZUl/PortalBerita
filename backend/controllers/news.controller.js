import { validationResult } from 'express-validator';
import db from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

const { News, Author, Category, Admin } = db;

// Fungsi untuk membersihkan HTML
const stripHtml = (html) => {
  return html?.replace(/<[^>]*>/g, '') || '';
};

// GET all news
export const getAllNews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'publishedAt',
      order = 'DESC',
      status,
      categoryId,
    } = req.query;

    const validSortFields = ['title', 'publishedAt', 'status'];
    const validOrderValues = ['ASC', 'DESC'];

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Validasi nilai sort dan order
    const sortField = validSortFields.includes(sort) ? sort : 'publishedAt';
    const sortOrder = validOrderValues.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';

    // Bangun kondisi WHERE
    const where = {};
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;

    const { count, rows } = await News.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      order: [[sortField, sortOrder]],
      include: [
        { model: Author, attributes: ['name'] },
        { model: Category, attributes: ['name'] },
      ],
    });

    const formattedNews = rows.map(item => ({
      newsId: item.newsId,
      title: item.title,
      status: item.status,
      publishedAt: item.publishedAt,
      authorName: item.Author?.name || '-',
      categoryName: item.Category?.name || '-',
    }));

    return successResponse(res, 'Berhasil mengambil semua berita.', {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      articles: formattedNews,
    });
  } catch (err) {
    console.error('❌ Error saat mengambil data news:', err);
    return errorResponse(
      res,
      'Terjadi kesalahan saat mengambil data artikel',
      err.message,
      500
    );
  }
};


// GET news by ID
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

// POST create news
export const createNews = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validasi gagal.', errors.array(), 400);
  }

  try {
    const {
      title,
      content,
      authorId,
      categoryId,
      status,
      publishedAt,
    } = req.body;

    const adminId = req.admin?.adminId;
    const imageUrl = req.file?.path || req.body.imageUrl;

    if (!imageUrl) {
      return errorResponse(res, 'Gambar tidak boleh kosong.', null, 400);
    }

    const summary = stripHtml(content).substring(0, 200); // Buat summary dari content

    const newNews = await News.create({
      title,
      content,
      summary,
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

// PUT update news
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
      authorId,
      categoryId,
      status,
      publishedAt,
    } = req.body;

    const adminId = req.admin?.adminId;
    const imageUrl = req.file?.path || news.imageUrl;

    const summary = stripHtml(content).substring(0, 200); // Update summary juga

    await news.update({
      title,
      content,
      summary,
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

// DELETE news
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
