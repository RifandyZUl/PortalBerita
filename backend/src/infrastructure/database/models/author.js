/**
 * Author Model
 * 
 * Sequelize model untuk Author table.
 * 
 * @module infrastructure/database/models/author
 */

import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/db.js';

const Author = sequelize.define('Author', {
  authorId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'author_id'
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
  timestamps: false,
  // Indexes dibuat melalui migration untuk menghindari masalah saat sync
  // Unique constraint untuk name sudah membuat index otomatis
});

export default Author;

