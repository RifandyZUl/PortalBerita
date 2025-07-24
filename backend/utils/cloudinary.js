import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portal-berita',
    allowed_formats: ['jpg', 'png'],
    transformation: [
      { width: 800, height: 450, crop: 'fill', gravity: 'auto' }, // Landscape 16:9
    ],
  },
});

export { cloudinary, storage };
