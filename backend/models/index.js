import dotenv from 'dotenv';
import fs from 'fs';
import { Sequelize } from 'sequelize';

// ⬇️ Load env file sesuai NODE_ENV, default ke .env
const env = process.env.NODE_ENV || 'development';
const envFilePath = `.env.${env}`;
if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
} else {
  dotenv.config(); // fallback ke .env biasa
}

console.log('[ENV]', env, '| DB:', process.env.DB_NAME);

// Inisialisasi Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
  }
);

// Import semua model
import Admin from './admin.js';
import Author from './author.js';
import Category from './category.js';
import Comment from './comment.js';
import News from './news.js';

// Relasi News ⇄ Category
News.belongsTo(Category, { foreignKey: 'categoryId', as: 'Category' });
Category.hasMany(News, { foreignKey: 'categoryId', as: 'NewsList' });

// Relasi News ⇄ Author
News.belongsTo(Author, { foreignKey: 'authorId', as: 'Author' });
Author.hasMany(News, { foreignKey: 'authorId', as: 'NewsList' });

// Relasi News ⇄ Admin
News.belongsTo(Admin, { foreignKey: 'adminId', as: 'Admin' });
Admin.hasMany(News, { foreignKey: 'adminId', as: 'NewsList' });

// Relasi Category ⇄ Subcategory (self-referencing)
Category.hasMany(Category, {
  as: 'subcategories',
  foreignKey: 'parentId',
});
Category.belongsTo(Category, {
  as: 'parent',
  foreignKey: 'parentId',
});

// Relasi News ⇄ Comment
Comment.belongsTo(News, {
  foreignKey: { name: 'newsId', field: 'news_id' },
  as: 'news',
});
News.hasMany(Comment, {
  foreignKey: { name: 'newsId', field: 'news_id' },
  as: 'comments',
});

// Export db object
const db = {
  sequelize,
  Sequelize: sequelize.constructor,
  Admin,
  Author,
  Category,
  Comment,
  News,
};

export default db;
