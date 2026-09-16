/**
 * Category Service
 * 
 * Service layer untuk Category business logic.
 * Menangani semua business logic untuk Category.
 * 
 * @module services/CategoryService
 */

import { CategoryRepository } from '../repositories/CategoryRepository.js';
import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import { sanitizeName, sanitizeText } from '../utils/securityHelpers.js';
import { getCache, setCache, clearCacheByPattern } from '../utils/cache.js';

const CACHE_KEY_CATEGORIES = 'categories:all';
const CACHE_TTL_CATEGORIES = 30 * 60 * 1000; // 30 menit

export class CategoryService {
  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  /**
   * Get auto icon based on category name
   * 
   * @param {string} name - Category name
   * @returns {string} Icon name
   * @private
   */
  _getAutoIcon(name = '') {
    const lowerName = name.toLowerCase();

    if (lowerName.includes('politik')) return 'bank';
    if (lowerName.includes('ekonomi')) return 'bar-chart-2';
    if (lowerName.includes('olahraga')) return 'heart';
    if (lowerName.includes('teknologi')) return 'settings';
    if (lowerName.includes('otomotif')) return 'settings';
    if (lowerName.includes('hiburan')) return 'grid';
    if (lowerName.includes('kesehatan')) return 'plus';
    if (lowerName.includes('international')) return 'globe';

    return 'grid'; // default icon
  }

  /**
   * Get all categories with pagination
   * Dengan caching untuk halaman pertama (tanpa filter)
   * 
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Categories with pagination
   */
  async getAllCategories(filters = {}) {
    const page = parseInt(filters.page, 10) || 1;
    const limit = parseInt(filters.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // Cache hanya untuk halaman pertama tanpa filter
    const isFirstPageNoFilter = page === 1 && !filters.search && !filters.parentId;
    const cacheKey = isFirstPageNoFilter ? `${CACHE_KEY_CATEGORIES}:${limit}` : null;

    if (cacheKey) {
      const cached = await getCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const { count, rows } = await this.categoryRepository.findAndCountAll({
      attributes: ['categoryId', 'name', 'slug', 'description', 'parentId', 'icon'],
      order: [['name', 'ASC']],
      limit,
      offset
    });

    const result = {
      data: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        perPage: limit
      }
    };

    // Cache the result
    if (cacheKey) {
      await setCache(cacheKey, result, CACHE_TTL_CATEGORIES);
    }

    return result;
  }

  /**
   * Get category by ID
   * 
   * @param {number} id - Category ID
   * @returns {Promise<Object>} Category object
   * @throws {AppError} If category not found
   */
  async getCategoryById(id) {
    const category = await this.categoryRepository.findById(id);
    
    if (!category) {
      throw new AppError(MESSAGES.CATEGORY.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return category;
  }

  /**
   * Create new category
   * 
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} Created category object
   * @throws {AppError} If slug already exists
   */
  async createCategory(categoryData) {
    const { name, slug, description, parentId, icon } = categoryData;

    // Sanitize inputs
    const sanitizedName = sanitizeName(name);
    const sanitizedSlug = slug.trim().toLowerCase();
    const sanitizedDescription = description ? sanitizeText(description) : null;

    // Check if slug already exists
    const existingSlug = await this.categoryRepository.findBySlug(sanitizedSlug);
    if (existingSlug) {
      throw new AppError(MESSAGES.CATEGORY.SLUG_EXISTS, HTTP_STATUS.CONFLICT);
    }

    // Auto-generate icon if not provided
    const categoryIcon = icon || this._getAutoIcon(sanitizedName);

    const category = await this.categoryRepository.create({
      name: sanitizedName,
      slug: sanitizedSlug,
      description: sanitizedDescription,
      parentId: parentId || null,
      icon: categoryIcon,
    });

    // Clear categories cache
    await clearCacheByPattern('categories:*');

    return category;
  }

  /**
   * Update category
   * 
   * @param {number} id - Category ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated category object
   * @throws {AppError} If category not found or slug conflict
   */
  async updateCategory(id, updateData) {
    const category = await this.categoryRepository.findById(id);
    
    if (!category) {
      throw new AppError(MESSAGES.CATEGORY.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Sanitize inputs
    const sanitizedName = updateData.name ? sanitizeName(updateData.name) : category.name;
    const sanitizedSlug = updateData.slug ? updateData.slug.trim().toLowerCase() : category.slug;
    const sanitizedDescription = updateData.description ? sanitizeText(updateData.description) : category.description;

    // Validate slug if changed
    if (sanitizedSlug && sanitizedSlug !== category.slug) {
      const existing = await this.categoryRepository.findBySlug(sanitizedSlug);
      if (existing) {
        throw new AppError(MESSAGES.CATEGORY.SLUG_EXISTS, HTTP_STATUS.CONFLICT);
      }
    }

    // Auto-generate icon if name changed and icon not provided
    const categoryIcon = updateData.icon || (updateData.name ? this._getAutoIcon(sanitizedName) : category.icon);

    await this.categoryRepository.update(id, {
      name: sanitizedName,
      slug: sanitizedSlug,
      description: sanitizedDescription,
      parentId: updateData.parentId || category.parentId,
      icon: categoryIcon
    });

    // Clear categories cache
    await clearCacheByPattern('categories:*');

    return await this.categoryRepository.findById(id);
  }

  /**
   * Delete category
   * 
   * @param {number} id - Category ID
   * @returns {Promise<void>}
   * @throws {AppError} If category not found or has news
   */
  async deleteCategory(id) {
    const category = await this.categoryRepository.findById(id);
    
    if (!category) {
      throw new AppError(MESSAGES.CATEGORY.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Check if category has news
    const hasNews = await this.categoryRepository.hasNews(id);
    if (hasNews) {
      throw new AppError(MESSAGES.CATEGORY.HAS_NEWS, HTTP_STATUS.BAD_REQUEST);
    }

    await this.categoryRepository.delete(id);
    
    // Clear categories cache
    await clearCacheByPattern('categories:*');
  }
}

