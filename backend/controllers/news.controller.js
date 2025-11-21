import { validationResult } from 'express-validator';
import db from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import sanitizeHtml from 'sanitize-html';
import slugify from 'slugify';
import { Op } from 'sequelize';

const { News, Author, Category, Admin } = db;

// Utility to strip HTML
const stripHtml = (html) => html?.replace(/<[^>]*>/g, '') || '';

// ✅ GET all news (Admin + User with Role Check)
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
    if (isAdmin && status) {
      where.status = status;
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
        { model: Admin, attributes: ['username'], as: 'Admin' },
        { model: Author, attributes: ['name'], as: 'Author' },
      ],
    });

    const mappedArticles = rows.map(news => ({
      ...news.toJSON(),
      categoryName: news.Category?.name || 'Uncategorized',
      authorName: news.Author?.name || 'Unknown',
    }));

    return successResponse(res, 'Berhasil mengambil data berita.', {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      articles: mappedArticles,
    });
  } catch (err) {
    console.error('❌ Error getAllNews:', err);
    return errorResponse(res, 'Gagal mengambil berita.', err.message, 500);
  }
};

// ✅ GET published news for public

export const getPublishedNews = async (req, res) => {
  try {
    const { category, limit } = req.query;

    const where = { status: 'published' };
    
    // If category filter exists, filter by category name
    if (category) {
      // First, find the category to validate it exists
      try {
        const categoryObj = await Category.findOne({ where: { name: category } });
        if (!categoryObj) {
          // Return empty array if category doesn't exist
          return successResponse(res, 'Berita untuk kategori ini tidak ditemukan.', []);
        }
        where.categoryId = categoryObj.categoryId;
      } catch (catErr) {
        console.error('❌ Error finding category:', catErr);
        // If category lookup fails, return empty array
        return successResponse(res, 'Kategori tidak ditemukan.', []);
      }
    }

    const includeOptions = [
      {
        model: Category,
        as: 'Category',
        attributes: ['name'],
        required: false, // Use LEFT JOIN to avoid errors
      },
    ];

    const news = await News.findAll({
      where,
      order: [['publishedAt', 'DESC']],
      include: includeOptions,
      ...(limit && !isNaN(limit) ? { limit: parseInt(limit) } : {}),
    });

    const formatted = news.map((n) => ({
      id: n.newsId,
      title: n.title,
      summary: n.summary,
      content: n.content,
      image_url: n.imageUrl,
      category: n.Category?.name || '-',
      createdAt: n.publishedAt,
      slug: n.slug,
    }));

    return successResponse(res, 'Berhasil mengambil berita untuk user.', formatted);
  } catch (err) {
    console.error('❌ Error getPublishedNews:', err);
    console.error('❌ Error stack:', err.stack);
    return errorResponse(res, 'Gagal mengambil berita.', err.message, 500);
  }
};


// ✅ GET public detail by slug
export const getPublicNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const news = await News.findOne({
      where: { status: 'published', slug },
      include: [
        { model: Category, attributes: ['name'], as: 'Category' },
        { model: Author, attributes: ['name'], as: 'Author' },
      ],
    });

    if (!news) {
      return errorResponse(res, 'Berita tidak ditemukan.', null, 404);
    }

    return successResponse(res, 'Berhasil mengambil berita detail.', {
      id: news.newsId,
      title: news.title,
      content: news.content,
      summary: news.summary,
      image_url: news.imageUrl,
      category: news.Category?.name || '-',
      createdAt: news.publishedAt,
      slug: news.slug,
      views: news.views || 0,
    });
  } catch (err) {
    console.error('❌ Error getPublicNewsBySlug:', err);
    return errorResponse(res, 'Gagal mengambil detail berita.', err.message, 500);
  }
};

// ✅ GET news by ID (admin use)
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
    console.error('❌ Error getNewsById:', err);
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

    const sanitizedContent = sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
      allowedAttributes: {
        '*': ['style', 'class'],
        a: ['href', 'target'],
        img: ['src', 'alt', 'width', 'height'],
      },
    });

    const summary = stripHtml(sanitizedContent).substring(0, 200);
    const slug = slugify(title, { lower: true, strict: true });

    const existing = await News.findOne({ where: { slug } });
    if (existing) {
      return errorResponse(res, 'Slug sudah digunakan, ubah judul.', null, 400);
    }

    const newNews = await News.create({
      title,
      slug,
      content: sanitizedContent,
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
    console.error('❌ Error createNews:', err);
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
    if (!news) return errorResponse(res, 'Berita tidak ditemukan.', null, 404);

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

    const sanitizedContent = sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
      allowedAttributes: {
        '*': ['style', 'class'],
        a: ['href', 'target'],
        img: ['src', 'alt', 'width', 'height'],
      },
    });

    const summary = stripHtml(sanitizedContent).substring(0, 200);
    const slug = slugify(title, { lower: true, strict: true });

    await news.update({
      title,
      slug,
      content: sanitizedContent,
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
    console.error('❌ Error updateNews:', err);
    return errorResponse(res, 'Gagal memperbarui berita.', err.message, 500);
  }
};

// ✅ DELETE news
export const deleteNews = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return errorResponse(res, 'Berita tidak ditemukan.', null, 404);

    await news.destroy();
    return successResponse(res, 'Berita berhasil dihapus.');
  } catch (err) {
    console.error('❌ Error deleteNews:', err);
    return errorResponse(res, 'Gagal menghapus berita.', err.message, 500);
  }
};

// ✅ Search news by keyword
export const searchNewsByKeyword = async (req, res) => {
  const { keyword, sort = 'createdAt', order = 'DESC', limit } = req.query;

  if (!keyword || keyword.trim().length < 2) {
    return errorResponse(res, 'Masukkan kata kunci minimal 2 huruf.', null, 400);
  }

  try {
    const news = await News.findAll({
      where: {
        status: 'published',
        [Op.or]: [
          { title: { [Op.iLike]: `%${keyword}%` } },
          { content: { [Op.iLike]: `%${keyword}%` } },
        ],
      },
      order: [[sort, order.toUpperCase()]],
      ...(limit && !isNaN(limit) ? { limit: parseInt(limit) } : {}),
      include: [
        { model: Category, attributes: ['name'], as: 'Category' },
        { model: Author, attributes: ['name'], as: 'Author' },
      ],
    });

    return successResponse(res, 'Hasil pencarian ditemukan.', news);
  } catch (error) {
    console.error('❌ Error searchNewsByKeyword:', error);
    return errorResponse(res, 'Gagal mencari berita.', error.message, 500);
  }
};


// ✅ GET popular news (by most views)
export const getPopularNews = async (req, res) => {
  try {
    const news = await News.findAll({
      where: { status: 'published' },
      order: [['views', 'DESC']],
      limit: 5,
      include: [
        { model: Author, attributes: ['name'], as: 'Author' },
        { model: Category, attributes: ['name'], as: 'Category' },
      ],
    });

    const formatted = news.map((n) => ({
      id: n.newsId,
      title: n.title,
      summary: n.summary,
      image_url: n.imageUrl,
      category: n.Category?.name || '-',
      createdAt: n.publishedAt,
      slug: n.slug,
      views: n.views,
      authorName: n.Author?.name || 'Unknown',
    }));

    return successResponse(res, 'Berhasil mengambil berita populer.', formatted);
  } catch (error) {
    console.error('❌ Error getPopularNews:', error);
    return errorResponse(res, 'Gagal mengambil berita populer.', error.message, 500);
  }
};

// ✅ PATCH - Tambah views
export const incrementViews = async (req, res) => {
  try {
    const { id } = req.params;
    // Pastikan id adalah integer (findByPk menggunakan primary key newsId)
    const newsId = parseInt(id, 10);
    
    if (isNaN(newsId)) {
      return errorResponse(res, 'ID berita tidak valid.', null, 400);
    }

    const news = await News.findByPk(newsId);

    if (!news) {
      return errorResponse(res, 'Berita tidak ditemukan.', null, 404);
    }

    // Pastikan views adalah number
    news.views = (news.views || 0) + 1;
    await news.save();

    return successResponse(res, 'Jumlah views berhasil ditambahkan.', { 
      views: news.views 
    });
  } catch (error) {
    console.error('❌ Gagal menambahkan views:', error);
    return errorResponse(res, 'Gagal menambahkan views.', error.message, 500);
  }
};