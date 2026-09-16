/**
 * Upload Middleware
 * 
 * Multer middleware untuk handle file uploads ke Cloudinary.
 * Dilengkapi dengan validasi file type, size, dan MIME type untuk keamanan.
 * 
 * @module middlewares/uploadMiddleware
 */

import multer from 'multer';
import { storage } from '../utils/cloudinary.js';
import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// File size limit: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp'
];

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

/**
 * File filter untuk validasi file type dan MIME type
 * 
 * @param {Object} req - Express request object
 * @param {Object} file - Multer file object
 * @param {Function} cb - Callback function
 */
const fileFilter = (req, file, cb) => {
  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new AppError(
      `File type tidak diizinkan. Hanya file gambar (${ALLOWED_EXTENSIONS.join(', ')}) yang diizinkan.`,
      HTTP_STATUS.BAD_REQUEST
    ));
  }

  // Check file extension
  const fileExtension = file.originalname.toLowerCase().substring(
    file.originalname.lastIndexOf('.')
  );
  
  if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
    return cb(new AppError(
      `Ekstensi file tidak diizinkan. Hanya ${ALLOWED_EXTENSIONS.join(', ')} yang diizinkan.`,
      HTTP_STATUS.BAD_REQUEST
    ));
  }

  cb(null, true);
};

// Configure multer with file size limit and filter
const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

/**
 * Optional upload middleware - tidak error jika tidak ada file
 * Berguna untuk test atau ketika imageUrl dikirim sebagai URL
 * 
 * Middleware ini akan:
 * - Skip multer jika content-type adalah application/json (untuk test)
 * - Process file upload jika content-type adalah multipart/form-data
 * - Tidak mengubah req.body jika tidak ada file
 */
export const optionalUpload = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  
  // Jika content-type adalah JSON, skip multer sepenuhnya
  // Body parser JSON sudah memproses req.body sebelumnya
  // Pastikan kita tidak memproses dengan multer yang akan mengubah req.body
  if (contentType.includes('application/json')) {
    // Skip multer dan lanjutkan dengan body yang sudah diproses oleh JSON parser
    return next();
  }
  
  // Jika multipart/form-data, gunakan multer
  // Gunakan .none() untuk kasus ketika tidak ada file, ini tidak akan mengubah req.body
  // Tapi kita tetap perlu .single() untuk kasus ketika ada file
  // Jadi kita coba .single() dulu, jika error karena tidak ada file, gunakan .none()
  const singleUpload = upload.single('image');
  
  singleUpload(req, res, (err) => {
    // Jika error adalah "no file" atau tidak ada file sama sekali
    if (err instanceof multer.MulterError) {
      // LIMIT_UNEXPECTED_FILE terjadi ketika field name tidak sesuai
      // Tapi jika tidak ada file sama sekali, multer tidak akan error
      // Jadi kita hanya handle error yang benar-benar error
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        // Field name tidak sesuai, tapi kita biarkan lewat untuk fleksibilitas
        return next();
      }
      // Error lain (seperti LIMIT_FILE_SIZE) tetap di-handle
      return next(err);
    }
    
    // Jika tidak ada error, lanjutkan
    next(err);
  });
};

/**
 * Error handler middleware untuk file upload errors
 * Harus digunakan setelah upload.single('image')
 * 
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: `File terlalu besar. Maksimal ukuran file adalah ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Field name untuk file upload harus "image".',
      });
    }
  }
  
  // If it's an AppError from fileFilter, pass it through
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  
  next(err);
};

export default upload;

