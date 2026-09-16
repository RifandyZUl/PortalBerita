/**
 * Author Controller
 * 
 * Controller layer untuk Author endpoints.
 * Thin controller yang hanya menangani HTTP request/response.
 * Business logic ada di AuthorService.
 * 
 * @module controllers/AuthorController
 */

import { AuthorService } from '../services/AuthorService.js';
import { successResponse } from '../utils/responseHandler.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../utils/errorHandler.js';

export class AuthorController {
  constructor() {
    this.authorService = new AuthorService();
  }

  /**
   * Get all authors
   * GET /api/authors
   */
  getAllAuthors = asyncHandler(async (req, res) => {
    const authors = await this.authorService.getAllAuthors();
    
    return successResponse(res, MESSAGES.AUTHOR.RETRIEVED, authors);
  });

  /**
   * Get author by ID
   * GET /api/authors/:id
   */
  getAuthorById = asyncHandler(async (req, res) => {
    const author = await this.authorService.getAuthorById(
      parseInt(req.params.id)
    );
    
    return successResponse(res, 'Berhasil mengambil author.', author);
  });

  /**
   * Create author
   * POST /api/authors
   */
  createAuthor = asyncHandler(async (req, res) => {
    const author = await this.authorService.createAuthor(req.body);
    
    return successResponse(
      res,
      MESSAGES.AUTHOR.CREATED,
      author,
      HTTP_STATUS.CREATED
    );
  });

  /**
   * Update author
   * PUT /api/authors/:id
   */
  updateAuthor = asyncHandler(async (req, res) => {
    const author = await this.authorService.updateAuthor(
      parseInt(req.params.id),
      req.body
    );
    
    return successResponse(res, MESSAGES.AUTHOR.UPDATED, author);
  });

  /**
   * Delete author
   * DELETE /api/authors/:id
   */
  deleteAuthor = asyncHandler(async (req, res) => {
    await this.authorService.deleteAuthor(parseInt(req.params.id));
    
    return successResponse(res, MESSAGES.AUTHOR.DELETED);
  });
}

// Export instance methods as functions for backward compatibility
const authorController = new AuthorController();

export const getAllAuthors = authorController.getAllAuthors;
export const getAuthorById = authorController.getAuthorById;
export const createAuthor = authorController.createAuthor;
export const updateAuthor = authorController.updateAuthor;
export const deleteAuthor = authorController.deleteAuthor;

