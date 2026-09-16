/**
 * Author Service
 * 
 * Service layer untuk Author business logic.
 * Menangani semua business logic untuk Author.
 * 
 * @module services/AuthorService
 */

import { AuthorRepository } from '../repositories/AuthorRepository.js';
import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import { sanitizeName, sanitizeText } from '../utils/securityHelpers.js';

export class AuthorService {
  constructor() {
    this.authorRepository = new AuthorRepository();
  }

  /**
   * Get all authors
   * 
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of author objects
   */
  async getAllAuthors(options = {}) {
    return await this.authorRepository.findAll({
      attributes: ['authorId', 'name', 'bio'],
      ...options
    });
  }

  /**
   * Get author by ID
   * 
   * @param {number} id - Author ID
   * @returns {Promise<Object>} Author object
   * @throws {AppError} If author not found
   */
  async getAuthorById(id) {
    const author = await this.authorRepository.findById(id);
    
    if (!author) {
      throw new AppError(MESSAGES.AUTHOR.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return author;
  }

  /**
   * Create new author
   * 
   * @param {Object} authorData - Author data
   * @returns {Promise<Object>} Created author object
   */
  async createAuthor(authorData) {
    const { name, bio } = authorData;

    // Sanitize inputs
    const sanitizedName = sanitizeName(name);
    const sanitizedBio = bio ? sanitizeText(bio) : null;

    // Check if author name already exists
    const existing = await this.authorRepository.findByName(sanitizedName);
    if (existing) {
      throw new AppError('Author dengan nama ini sudah ada.', HTTP_STATUS.CONFLICT);
    }

    const author = await this.authorRepository.create({
      name: sanitizedName,
      bio: sanitizedBio
    });

    return author;
  }

  /**
   * Update author
   * 
   * @param {number} id - Author ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated author object
   * @throws {AppError} If author not found
   */
  async updateAuthor(id, updateData) {
    const author = await this.authorRepository.findById(id);
    
    if (!author) {
      throw new AppError(MESSAGES.AUTHOR.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Sanitize inputs
    const sanitizedName = updateData.name ? sanitizeName(updateData.name) : author.name;
    const sanitizedBio = updateData.bio ? sanitizeText(updateData.bio) : author.bio;

    await this.authorRepository.update(id, {
      ...updateData,
      name: sanitizedName,
      bio: sanitizedBio
    });

    return await this.authorRepository.findById(id);
  }

  /**
   * Delete author
   * 
   * @param {number} id - Author ID
   * @returns {Promise<void>}
   * @throws {AppError} If author not found or has news
   */
  async deleteAuthor(id) {
    const author = await this.authorRepository.findById(id);
    
    if (!author) {
      throw new AppError(MESSAGES.AUTHOR.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Check if author has news
    const hasNews = await this.authorRepository.hasNews(id);
    if (hasNews) {
      throw new AppError('Author tidak dapat dihapus karena masih memiliki berita.', HTTP_STATUS.BAD_REQUEST);
    }

    await this.authorRepository.delete(id);
  }
}

