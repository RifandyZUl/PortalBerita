/**
 * Category Controller
 * 
 * Controller layer untuk Category endpoints.
 * Thin controller yang hanya menangani HTTP request/response.
 * Business logic ada di CategoryService.
 * 
 * @module controllers/CategoryController
 */

import { CategoryService } from '../services/CategoryService.js';
import { successResponse } from '../utils/responseHandler.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../utils/errorHandler.js';

export class CategoryController {
  constructor() {
    this.categoryService = new CategoryService();
  }

  /**
   * Get all categories
   * GET /api/categories
   */
  getAllCategories = asyncHandler(async (req, res) => {
    const result = await this.categoryService.getAllCategories(req.query);
    
    return successResponse(res, MESSAGES.CATEGORY.RETRIEVED, result);
  });

  /**
   * Get category by ID
   * GET /api/categories/:id
   */
  getCategoryById = asyncHandler(async (req, res) => {
    const category = await this.categoryService.getCategoryById(
      parseInt(req.params.id)
    );
    
    return successResponse(res, 'Berhasil mengambil kategori.', category);
  });

  /**
   * Create category
   * POST /api/categories
   */
  createCategory = asyncHandler(async (req, res) => {
    const category = await this.categoryService.createCategory(req.body);
    
    return successResponse(
      res,
      MESSAGES.CATEGORY.CREATED,
      category,
      HTTP_STATUS.CREATED
    );
  });

  /**
   * Update category
   * PUT /api/categories/:id
   */
  updateCategory = asyncHandler(async (req, res) => {
    const category = await this.categoryService.updateCategory(
      parseInt(req.params.id),
      req.body
    );
    
    return successResponse(res, MESSAGES.CATEGORY.UPDATED, category);
  });

  /**
   * Delete category
   * DELETE /api/categories/:id
   */
  deleteCategory = asyncHandler(async (req, res) => {
    await this.categoryService.deleteCategory(parseInt(req.params.id));
    
    return successResponse(res, MESSAGES.CATEGORY.DELETED);
  });
}

// Export instance methods as functions for backward compatibility
const categoryController = new CategoryController();

export const getAllCategories = categoryController.getAllCategories;
export const getCategoryById = categoryController.getCategoryById;
export const createCategory = categoryController.createCategory;
export const updateCategory = categoryController.updateCategory;
export const deleteCategory = categoryController.deleteCategory;

