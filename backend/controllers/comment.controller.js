import { Op } from 'sequelize';
import Comment from '../models/comment.js';
import News from '../models/news.js';

// Helper: format pagination result
const formatPagination = (count, limit) => ({
  totalPages: Math.ceil(count / limit),
  totalItems: count,
});

export const getAllComments = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (search) where.comment = { [Op.iLike]: `%${search}%` };

    console.log('📥 [GET] Query Params:', { status, search, page, limit });

    const { count, rows } = await Comment.findAndCountAll({
      where,
      include: {
        model: News,
        as: 'news',
        attributes: ['title'],
      },
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
    });

    console.log(`✅ Ditemukan ${count} komentar`);

    res.json({
      success: true,
      message: 'Komentar berhasil diambil.',
      data: {
        comments: rows,
        pagination: formatPagination(count, limit),
      },
    });
  } catch (error) {
    console.error('❌ Gagal mengambil komentar:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengambil komentar.' });
  }
};

export const createComment = async (req, res) => {
  const { newsId } = req.params;
  const { name, email, comment } = req.body;

  console.log('📥 [POST] Data Komentar:', { newsId, name, email, comment });

  if (!name || !email || !comment) {
    return res.status(400).json({ success: false, message: 'Nama, email, dan komentar wajib diisi.' });
  }

  try {
    const news = await News.findByPk(newsId);
    if (!news) {
      console.log('⚠️ Berita tidak ditemukan dengan ID:', newsId);
      return res.status(404).json({ success: false, message: 'Berita tidak ditemukan.' });
    }

    const newComment = await Comment.create({
      newsId,
      name,
      email,
      comment,
      status: 'Pending',
    });

    console.log('✅ Komentar berhasil disimpan:', newComment.toJSON());

    res.status(201).json({
      success: true,
      message: 'Komentar berhasil dikirim dan menunggu persetujuan.',
      data: newComment,
    });
  } catch (error) {
    console.error('❌ Gagal menyimpan komentar:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menyimpan komentar.' });
  }
};

export const updateCommentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log('📥 [PUT] Update Status Komentar:', { id, status });

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status wajib diisi.' });
  }

  const validStatuses = ['Pending', 'Approved', 'Spam'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Status tidak valid. Harus Pending, Approved, atau Spam.' });
  }

  try {
    const comment = await Comment.findByPk(id);
    if (!comment) {
      console.log('⚠️ Komentar tidak ditemukan dengan ID:', id);
      return res.status(404).json({ success: false, message: 'Komentar tidak ditemukan.' });
    }

    comment.status = status;
    await comment.save();

    console.log('✅ Status komentar diperbarui:', comment.toJSON());

    res.json({
      success: true,
      message: 'Status komentar berhasil diperbarui.',
      data: comment,
    });
  } catch (error) {
    console.error('❌ Gagal memperbarui status komentar:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memperbarui status komentar.' });
  }
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;

  console.log('📥 [DELETE] Hapus Komentar ID:', id);

  try {
    const comment = await Comment.findByPk(id);
    if (!comment) {
      console.log('⚠️ Komentar tidak ditemukan dengan ID:', id);
      return res.status(404).json({ success: false, message: 'Komentar tidak ditemukan.' });
    }

    await comment.destroy();

    console.log('✅ Komentar berhasil dihapus.');

    res.json({
      success: true,
      message: 'Komentar berhasil dihapus.',
    });
  } catch (error) {
    console.error('❌ Gagal menghapus komentar:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menghapus komentar.' });
  }
};

export const getCommentsByNewsSlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const news = await News.findOne({ where: { slug } });

    if (!news) {
      return res.status(404).json({ message: 'Berita tidak ditemukan.' });
    }

    const comments = await Comment.findAll({
      where: {
        newsId: news.newsId,
        status: 'Approved', // tampilkan hanya komentar yang disetujui
      },
      order: [['createdAt', 'DESC']],
    });

    res.json(comments);
  } catch (error) {
    console.error('❌ Gagal mengambil komentar:', error);
    res.status(500).json({ message: 'Gagal mengambil komentar.' });
  }
};
