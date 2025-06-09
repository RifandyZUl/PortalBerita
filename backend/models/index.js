// models/index.js
import { sequelize } from '../config/db.js';
import Author from './author.js';
import Category from './category.js';
import News from './news.js';
import Comment from './comment.js';

const db = {};

db.sequelize = sequelize;
db.Sequelize = sequelize.constructor;


db.Author = Author;
db.Category = Category;
db.News = News;
db.Comment = Comment;

// Relasi
db.Category.hasMany(News, { foreignKey: 'categoryId' });
News.belongsTo(db.Category, { foreignKey: 'categoryId' });

db.Author.hasMany(News, { foreignKey: 'authorId' });
News.belongsTo(db.Author, { foreignKey: 'authorId' });

News.hasMany(Comment, { foreignKey: 'newsId', as: 'comments' });
Comment.belongsTo(News, { foreignKey: 'newsId', as: 'news' });

export default db;
