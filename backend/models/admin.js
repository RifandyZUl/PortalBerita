import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Admin = sequelize.define('Admin', {
  adminId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'admin_id'
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'admins',
  timestamps: false
});

export default Admin;
