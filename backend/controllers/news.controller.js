import { validationResult } from 'express-validator';
import db from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

const { News, Author, Category, Admin } = db;

// GET /api/news
export const getAllNews = async (req, res) => {
  try {
    const news = await db.News.findAll({
      attributes: ['newsId', 'title', 'status', 'publishedAt'],
      include: [
        {
          model: db.Author,
          attributes: ['name'], // ambil hanya nama author
        },
        {
          model: db.Category,
          attributes: ['name'], // ambil hanya nama kategori
        },
      ],
      order: [['newsId', 'DESC']],
    });

    // Format data agar sesuai frontend
    const formattedNews = news.map(item => ({
      newsId: item.newsId,
      title: item.title,
      status: item.status,
      publishedAt: item.publishedAt,
      authorName: item.Author?.name || '-',     // akses relasi Author
      categoryName: item.Category?.name || '-', // akses relasi Category
    }));

    return res.status(200).json({
      status: 'success',
      data: formattedNews,
    });

  } catch (error) {
    console.error('❌ Error saat mengambil data news:', error);
    return res.status(500).json({
      status: 'fail',
      message: 'Terjadi kesalahan saat mengambil data artikel',
    });
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
  console.log('❌ Validation Errors:', errors.array());
  return errorResponse(res, 'Validasi gagal.', errors.array(), 400);
}


  try {
    console.log('📥 req.body:', req.body);
    console.log('📁 req.file:', req.file);

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
      authorId,
      categoryId,
      status,
      publishedAt,
    } = req.body;

    const adminId = req.admin?.adminId;

    const imageUrl = req.file?.path || news.imageUrl; // gunakan yang baru jika ada

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
