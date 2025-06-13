import { sequelize } from '../config/db.js';

import Admin from './admin.js';
import Author from './author.js';
import Category from './category.js';
import Comment from './comment.js';
import News from './news.js';

// Relasi
News.belongsTo(Admin, { foreignKey: 'adminId' });
Admin.hasMany(News, { foreignKey: 'adminId' });

News.belongsTo(Author, { foreignKey: 'authorId' });
Author.hasMany(News, { foreignKey: 'authorId' });

News.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(News, { foreignKey: 'categoryId' });

Comment.belongsTo(News, { foreignKey: 'newsId' });
News.hasMany(Comment, { foreignKey: 'newsId' });

const db = {
  sequelize,
  Sequelize: sequelize.constructor,
  Admin,
  Author,
  Category,
  Comment,
  News
};

export default db;
