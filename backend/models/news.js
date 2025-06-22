// models/news.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const News = sequelize.define('News', {
  newsId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'news_id'
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'admin_id'
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'author_id'
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'category_id'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT
  },
  imageUrl: {
    type: DataTypes.STRING,
    field: 'image_url'
  },
  publishedAt: {
    type: DataTypes.DATE,
    field: 'publishedat'
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    allowNull: false
  },
  summary: {
  type: DataTypes.TEXT,
  allowNull: true,
}

}, {
  tableName: 'news',
  timestamps: false
});

export default News;
