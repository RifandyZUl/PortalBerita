import  News  from '../models/news.js';
import  Comment  from '../models/comment.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalNews = await News.count();
    const totalComments = await Comment.count();
    const totalViewsResult = await News.sum('views');

    res.status(200).json({
      totalNews,
      totalComments,
      totalViews: totalViewsResult || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
