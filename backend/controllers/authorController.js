// controllers/authorController.js
import db from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

const { Author } = db;

export const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.findAll({
      attributes: ['authorId', 'name'],
    });

    return successResponse(res, 'Berhasil mengambil data author', authors);
  } catch (err) {
    console.error('❌ Error fetching authors:', err.message);
    return errorResponse(res, 'Gagal mengambil data author', err.message);
  }
};
