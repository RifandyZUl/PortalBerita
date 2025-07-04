import { validationResult } from 'express-validator';
import db from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

const { News, Author, Category, Admin } = db;

// Fungsi untuk membersihkan HTML
const stripHtml = (html) => {
  return html?.replace(/<[^>]*>/g, '') || '';
};

// ✅ GET all news (admin & user)
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

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    const isAdmin = !!req.admin;
    if (isAdmin) {
      if (status) where.status = status;
    } else {
      where.status = 'published';
    }

    if (categoryId) where.categoryId = categoryId;

    const { count, rows } = await News.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      order: [[sort, order.toUpperCase()]],
      include: [
        { model: Category, attributes: ['name'], as: 'Category' },
        { model: Author, attributes: ['name'], as: 'Author' },
        { model: Admin, attributes: ['username'], as: 'Admin' },
      ],
    });

    return successResponse(res, 'Berhasil mengambil data berita.', {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      articles: rows,
    });
  } catch (err) {
    console.error('❌ Error saat mengambil data news:', err);
    return errorResponse(res, 'Gagal mengambil berita.', err.message, 500);
  }
};

// ✅ GET news by ID
export const getNewsById = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id, {
      include: [
        { model: Author, attributes: ['authorId', 'name'], as: 'Author' },
        { model: Category, attributes: ['categoryId', 'name'], as: 'Category' },
        { model: Admin, attributes: ['adminId', 'username'], as: 'Admin' },
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

// ✅ POST create news
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

    const summary = stripHtml(content).substring(0, 200);

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

// ✅ PUT update news
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

    const summary = stripHtml(content).substring(0, 200);

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

// ✅ DELETE news
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

// ✅ GET Published News (User only)
export const getPublishedNews = async (req, res) => {
  try {
    const { category } = req.query;

    const where = { status: 'published' };
    if (category) where['$Category.name$'] = category;

    const news = await News.findAll({
      where,
      order: [['publishedAt', 'DESC']],
      include: [
        { model: Category, attributes: ['name'], as: 'Category' },
      ],
      limit: 10,
    });

    const formatted = news.map((n) => ({
      id: n.newsId,
      title: n.title,
      summary: n.summary,
      image_url: n.imageUrl,
      category: n.Category?.name || '-',
      createdAt: n.publishedAt,
      slug: n.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, ''),
    }));

    return successResponse(res, 'Berhasil mengambil berita untuk user.', formatted);
  } catch (err) {
    console.error('❌ Error berita user:', err);
    return errorResponse(res, 'Gagal mengambil berita.', err.message, 500);
  }
};
