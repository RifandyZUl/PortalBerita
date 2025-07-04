import { sequelize } from '../config/db.js';

import Admin from './admin.js';
import Author from './author.js';
import Category from './category.js';
import Comment from './comment.js';
import News from './News.js';

// Relasi
// Relasi News ⇄ Category
News.belongsTo(Category, { foreignKey: 'categoryId', as: 'Category' });
Category.hasMany(News, { foreignKey: 'categoryId', as: 'NewsList' });

// Relasi News ⇄ Author
News.belongsTo(Author, { foreignKey: 'authorId', as: 'Author' });
Author.hasMany(News, { foreignKey: 'authorId', as: 'NewsList' });

// Relasi News ⇄ Admin (kalau dipakai di frontend juga)
News.belongsTo(Admin, { foreignKey: 'adminId', as: 'Admin' });
Admin.hasMany(News, { foreignKey: 'adminId', as: 'NewsList' });


// Kategori dan subkategori (self relation)
Category.hasMany(Category, {
  as: 'subcategories',
  foreignKey: 'parentId'
});
Category.belongsTo(Category, {
  as: 'parent',
  foreignKey: 'parentId'
});

// ✅ Relasi News ⇄ Comment (gunakan alias & mapping field DB)
Comment.belongsTo(News, {
  foreignKey: { name: 'newsId', field: 'news_id' },
  as: 'news',
});

News.hasMany(Comment, {
  foreignKey: { name: 'newsId', field: 'news_id' },
  as: 'comments',
});

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
