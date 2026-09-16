/**
 * Admin Controller
 * 
 * Controller layer untuk Admin endpoints.
 * Thin controller yang hanya menangani HTTP request/response.
 * Business logic ada di AdminService.
 * 
 * @module controllers/AdminController
 */

import { AdminService } from '../services/AdminService.js';
import { successResponse } from '../utils/responseHandler.js';
import { asyncHandler } from '../utils/errorHandler.js';

export class AdminController {
  constructor() {
    this.adminService = new AdminService();
  }

  /**
   * Get admin profile
   * GET /api/admin/profile
   */
  getProfile = asyncHandler(async (req, res) => {
    const admin = await this.adminService.getAdminProfile(req.admin.adminId);
    
    return successResponse(res, 'Data admin saat ini', { admin });
  });

  /**
   * Update admin profile
   * PUT /api/admin/profile
   */
  updateProfile = asyncHandler(async (req, res) => {
    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      bio: req.body.bio,
      photo: req.file?.path // Cloudinary URL from upload middleware
    };

    const admin = await this.adminService.updateAdminProfile(
      req.admin.adminId,
      updateData
    );
    
    return successResponse(res, 'Profil berhasil diperbarui', { admin });
  });
}

// Export instance methods as functions for backward compatibility
const adminController = new AdminController();

export const getProfile = adminController.getProfile;
export const updateProfile = adminController.updateProfile;

