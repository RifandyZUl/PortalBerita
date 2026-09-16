/**
 * Auth Service
 * 
 * Service layer untuk Authentication business logic.
 * Menangani login, token generation, dan authentication logic.
 * 
 * @module services/AuthService
 */

import { AdminRepository } from '../repositories/AdminRepository.js';
import { generateToken } from '../utils/token.js';
import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import bcrypt from 'bcryptjs';

export class AuthService {
  constructor() {
    this.adminRepository = new AdminRepository();
  }

  /**
   * Login admin
   * 
   * @param {string} emailOrUsername - Email or username
   * @param {string} password - Password
   * @returns {Promise<Object>} { token, admin }
   * @throws {AppError} If credentials are invalid
   */
  async login(emailOrUsername, password) {
    // Validate input
    if (!emailOrUsername || !password || typeof emailOrUsername !== 'string') {
      throw new AppError(MESSAGES.AUTH.CREDENTIALS_REQUIRED, HTTP_STATUS.BAD_REQUEST);
    }

    // Find admin by email or username
    const admin = await this.adminRepository.findByEmailOrUsername(emailOrUsername);

    if (!admin) {
      throw new AppError(MESSAGES.AUTH.LOGIN_FAILED, HTTP_STATUS.UNAUTHORIZED);
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new AppError(MESSAGES.AUTH.PASSWORD_WRONG, HTTP_STATUS.UNAUTHORIZED);
    }

    // Generate token
    const token = generateToken(admin.adminId);

    return {
      token,
      admin: {
        adminId: admin.adminId,
        username: admin.username,
        email: admin.email
      }
    };
  }

  /**
   * Verify admin by ID
   * 
   * @param {number} adminId - Admin ID
   * @returns {Promise<Object>} Admin object
   * @throws {AppError} If admin not found
   */
  async verifyAdmin(adminId) {
    const admin = await this.adminRepository.findById(adminId);
    
    if (!admin) {
      throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    return admin;
  }
}

