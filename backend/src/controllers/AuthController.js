/**
 * Auth Controller
 * 
 * Controller layer untuk Authentication endpoints.
 * Thin controller yang hanya menangani HTTP request/response.
 * Business logic ada di AuthService.
 * 
 * @module controllers/AuthController
 */

import { AuthService } from '../services/AuthService.js';
import { successResponse } from '../utils/responseHandler.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../utils/errorHandler.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Login admin
   * POST /api/auth/login
   */
  login = asyncHandler(async (req, res) => {
    const { emailOrUsername, password } = req.body;
    
    const result = await this.authService.login(emailOrUsername, password);
    
    return successResponse(res, MESSAGES.AUTH.LOGIN_SUCCESS, {
      token: result.token
    });
  });
}

// Export instance methods as functions for backward compatibility
const authController = new AuthController();

export const login = authController.login;

