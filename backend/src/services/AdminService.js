/**
 * Admin Service
 * 
 * Service layer untuk Admin business logic.
 * Menangani semua business logic untuk Admin.
 * 
 * @module services/AdminService
 */

import { AdminRepository } from '../repositories/AdminRepository.js';
import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

export class AdminService {
  constructor() {
    this.adminRepository = new AdminRepository();
  }

  /**
   * Get admin profile by ID
   * 
   * @param {number} adminId - Admin ID
   * @returns {Promise<Object>} Admin object
   * @throws {AppError} If admin not found
   */
  async getAdminProfile(adminId) {
    const admin = await this.adminRepository.findById(adminId);
    
    if (!admin) {
      throw new AppError('Admin tidak ditemukan', HTTP_STATUS.NOT_FOUND);
    }

    return admin;
  }

  /**
   * Update admin profile
   * 
   * @param {number} adminId - Admin ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated admin object
   * @throws {AppError} If admin not found
   */
  async updateAdminProfile(adminId, updateData) {
    const admin = await this.adminRepository.findById(adminId);
    
    if (!admin) {
      throw new AppError('Admin tidak ditemukan', HTTP_STATUS.NOT_FOUND);
    }

    const { firstName, lastName, bio, photo } = updateData;

    // Update fields
    if (firstName !== undefined) admin.firstName = firstName;
    if (lastName !== undefined) admin.lastName = lastName;
    if (bio !== undefined) admin.bio = bio;
    if (photo) admin.photo = photo; // Cloudinary URL

    await admin.save();

    return admin;
  }
}

