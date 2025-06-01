import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const News = sequelize.define('News', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
  author: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'news',
  timestamps: true,
});

export default News;
