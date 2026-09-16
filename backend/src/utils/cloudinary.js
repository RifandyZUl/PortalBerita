/**
 * Cloudinary Storage Utility
 * 
 * Utility untuk konfigurasi Cloudinary storage untuk Multer.
 * 
 * @module utils/cloudinary
 */

import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Cloudinary storage configuration for Multer
 */
export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'portal-berita',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [
        { width: 1200, height: 630, crop: 'limit' },
        { quality: 'auto' }
      ],
    };
  },
});

export default cloudinary;

