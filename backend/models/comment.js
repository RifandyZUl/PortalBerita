// models/comment.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import News from './news.js';

const Comment = sequelize.define('Comment', {
  commentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  newsId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'news_id'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Spam'),
    defaultValue: 'Pending'
  },
}, {
  tableName: 'comments',
  timestamps: true, // untuk createdAt & updatedAt otomatis
  updatedAt: false, // karena kita tidak butuh updatedAt
});

export default Comment;
