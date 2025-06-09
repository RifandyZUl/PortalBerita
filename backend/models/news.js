// models/news.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const News = sequelize.define('News', {
  newsId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT
  },
  imageUrl: {
    type: DataTypes.STRING
  },
  publishedAt: {
    type: DataTypes.DATE
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    allowNull: false
  }
}, {
  tableName: 'news',
  timestamps: false
});

export default News;
