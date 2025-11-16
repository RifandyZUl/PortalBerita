import dotenv from 'dotenv';
import fs from 'fs';
// Import sequelize instance dari config/db.js untuk konsistensi
import { sequelize } from '../config/db.js';

// ⬇️ Load env file HANYA di development/test (di production, Railway sudah set env vars)
const env = process.env.NODE_ENV || 'development';
if (env !== 'production') {
  const envFilePath = `.env.${env}`;
  if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath });
  } else {
    dotenv.config(); // fallback ke .env biasa
  }
}

// Log database name untuk debugging
const dbName = process.env.DATABASE_URL 
  ? (() => {
      try {
        const url = new URL(process.env.DATABASE_URL);
        return url.pathname.slice(1) || 'from DATABASE_URL';
      } catch (e) {
        return 'from DATABASE_URL (parse error)';
      }
    })()
  : process.env.DB_NAME || 'undefined';
console.log('[ENV]', env, '| DB:', dbName);
console.log('[DEBUG] DATABASE_URL exists:', !!process.env.DATABASE_URL);

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
