import News from '../models/news.js'; // pastikan nama file sesuai

export const getAllNews = async (req, res) => {
  try {
    const news = await News.findAll({ order: [['createdAt', 'DESC']] });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch news.' });
  }
};

export const createNews = async (req, res) => {
  const { title, content, imageUrl, author } = req.body;
  try {
    const newNews = await News.create({ title, content, imageUrl, author });
    res.status(201).json(newNews);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create news.' });
  }
};
