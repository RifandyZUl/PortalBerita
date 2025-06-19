import { Op } from 'sequelize';

import Comment from '../models/comment.js';

import  News  from '../models/news.js';

export const getAllComments = async (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const where = {};
  if (status) where.status = status;
  if (search) where.content = { [Op.iLike]: `%${search}%` };

 const { count, rows } = await Comment.findAndCountAll({
  where,
  include: {
    model: News,
    as: 'news', // <- UBAH dari 'article' ke 'news'
    attributes: ['title'],
  },
  offset: parseInt(offset),
  limit: parseInt(limit),
  order: [['createdAt', 'DESC']],
});


  res.json({
    success: true,
    message: 'Berhasil mengambil komentar.',
    data: {
      comments: rows,
      totalPages: Math.ceil(count / limit),
    },
  });
};

export const updateCommentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const comment = await Comment.findByPk(id);
  if (!comment) return res.status(404).json({ success: false, message: 'Komentar tidak ditemukan.' });

  comment.status = status;
  await comment.save();

  res.json({ success: true, message: 'Status komentar diperbarui.', data: comment });
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findByPk(id);
  if (!comment) return res.status(404).json({ success: false, message: 'Komentar tidak ditemukan.' });

  await comment.destroy();
  res.json({ success: true, message: 'Komentar berhasil dihapus.' });
};
