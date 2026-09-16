/**
 * Admin Repository
 * 
 * Repository layer untuk Admin model.
 * Menangani semua operasi data access untuk Admin.
 * 
 * @module repositories/AdminRepository
 */

import db from '../infrastructure/database/models/index.js';

const { Admin, Sequelize } = db;

export class AdminRepository {
  /**
   * Find admin by primary key
   * 
   * @param {number} id - Admin ID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Admin object or null
   */
  async findById(id, options = {}) {
    return await Admin.findByPk(id, options);
  }

  /**
   * Find admin by email
   * 
   * @param {string} email - Admin email
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Admin object or null
   */
  async findByEmail(email, options = {}) {
    return await Admin.findOne({
      where: { email },
      ...options
    });
  }

  /**
   * Find admin by username
   * 
   * @param {string} username - Admin username
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Admin object or null
   */
  async findByUsername(username, options = {}) {
    return await Admin.findOne({
      where: { username },
      ...options
    });
  }

  /**
   * Find admin by email or username
   * 
   * @param {string} emailOrUsername - Email or username
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Admin object or null
   */
  async findByEmailOrUsername(emailOrUsername, options = {}) {
    return await Admin.findOne({
      where: {
        [Sequelize.Op.or]: [
          { email: emailOrUsername },
          { username: emailOrUsername }
        ]
      },
      ...options
    });
  }

  /**
   * Update admin by ID
   * 
   * @param {number} id - Admin ID
   * @param {Object} data - Update data
   * @returns {Promise<Array>} [affectedRows, updatedRows]
   */
  async update(id, data) {
    return await Admin.update(data, {
      where: { adminId: id },
      returning: true
    });
  }
}

