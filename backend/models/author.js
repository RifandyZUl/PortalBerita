// models/author.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Author = sequelize.define('Author', {
  authorId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
 
  },
  bio: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'authors',
  timestamps: false
});

export default Author;
