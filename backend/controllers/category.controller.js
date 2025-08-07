import db from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

const { Category } = db;

// ✅ Fungsi pembantu: Icon otomatis berdasarkan nama kategori
const getAutoIcon = (name = '') => {
  const lowerName = name.toLowerCase();

  if (lowerName.includes('politik')) return 'bank';
  if (lowerName.includes('ekonomi')) return 'bar-chart-2';
  if (lowerName.includes('olahraga')) return 'heart';
  if (lowerName.includes('teknologi')) return 'settings';
  if (lowerName.includes('otomotif')) return 'settings';
  if (lowerName.includes('hiburan')) return 'grid';
  if (lowerName.includes('kesehatan')) return 'plus';
  if (lowerName.includes('international') || lowerName.includes('international')) return 'globe';

  return 'grid'; // default icon
};

// ✅ GET all categories with pagination
export const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const offset = (page - 1) * limit;

    const { count, rows } = await Category.findAndCountAll({
      attributes: ['categoryId', 'name', 'slug', 'description', 'parentId', 'icon'],
      order: [['name', 'ASC']],
      limit,
      offset
    });

    return successResponse(res, 'Berhasil mengambil semua kategori.', {
      data: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        perPage: limit
      }
    });
  } catch (err) {
    console.error('❌ Error fetching categories:', err.message);
    return errorResponse(res, 'Gagal mengambil kategori.', err.message, 500);
  }
};

// ✅ POST create category with unique slug validation
export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, parentId, icon } = req.body;

    const existingSlug = await Category.findOne({ where: { slug } });
    if (existingSlug) {
      return errorResponse(res, 'Slug kategori sudah digunakan.', null, 400);
    }

    const category = await Category.create({
      name,
      slug,
      description: description || null,
      parentId: parentId || null,
      icon: icon || getAutoIcon(name),
    });

    return successResponse(res, 'Kategori berhasil dibuat.', category, 201);
  } catch (err) {
    console.error('❌ Error creating category:', err.message);
    return errorResponse(res, 'Gagal membuat kategori.', err.message);
  }
};

// ✅ PUT update category with unique slug check
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, parentId, icon } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return errorResponse(res, 'Kategori tidak ditemukan.', null, 404);
    }

    // Validasi slug jika berubah
    if (slug && slug !== category.slug) {
      const existing = await Category.findOne({ where: { slug } });
      if (existing) {
        return errorResponse(res, 'Slug kategori sudah digunakan.', null, 400);
      }
    }

    await category.update({
      name,
      slug,
      description: description || null,
      parentId: parentId || null,
      icon: icon || getAutoIcon(name),
    });

    return successResponse(res, 'Kategori berhasil diperbarui.', category);
  } catch (err) {
    console.error('❌ Error updating category:', err.message);
    return errorResponse(res, 'Gagal memperbarui kategori.', err.message);
  }
};

// ✅ DELETE category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return errorResponse(res, 'Kategori tidak ditemukan.', null, 404);
    }

    await category.destroy();
    return successResponse(res, 'Kategori berhasil dihapus.');
  } catch (err) {
    console.error('❌ Error deleting category:', err.message);
    return errorResponse(res, 'Gagal menghapus kategori.', err.message, 500);
  }
};
