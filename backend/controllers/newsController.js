// controllers/newsController.js
import { validationResult } from 'express-validator';
import News from '../models/news.js';

export const getAllNews = async (req, res) => {
  try {
    const news = await News.findAll({ order: [['newsId', 'DESC']] });
    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch news.' });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found.' });
    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch news.' });
  }
};

export const createNews = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, imageUrl, authorId, categoryId, status, publishedAt } = req.body;
  try {
    const newNews = await News.create({
      title,
      content,
      imageUrl,
      authorId,
      categoryId,
      status,
      publishedAt: publishedAt || new Date(), // ⏱ fallback waktu saat ini
    });
    res.status(201).json(newNews);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to create news.' });
  }
};

export const updateNews = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found.' });

    const { title, content, imageUrl, authorId, categoryId, status, publishedAt } = req.body;

    await news.update({
      title,
      content,
      imageUrl,
      authorId,
      categoryId,
      status,
      publishedAt,
    });

    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to update news.' });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found.' });

    await news.destroy();
    res.json({ message: 'News deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete news.' });
  }
};
