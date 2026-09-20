import multer from 'multer';
import path from 'path';

// Memory storage keeps file buffer in RAM without disk I/O or directory permission issues
const storage = multer.memoryStorage();

// File Type Validation
function checkFileTypes(file, cb) {
  const allowedExts = /\.(jpg|jpeg|png|webp|gif|avif|bmp|svg)$/i;
  const isImageMime = file.mimetype && file.mimetype.startsWith('image/');
  const isAllowedExt = allowedExts.test(path.extname(file.originalname || '').toLowerCase());

  if (isImageMime || isAllowedExt) {
    return cb(null, true);
  } else {
    cb(new Error('Images only (jpg, jpeg, png, webp, avif, svg)!'));
  }
}

const multerInstance = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    checkFileTypes(file, cb);
  },
});

/**
 * Safe Single Image Upload Middleware
 * Intercepts Multer errors so they return HTTP 400 instead of unhandled 500
 */
export const uploadSingleImage = (req, res, next) => {
  multerInstance.single('image')(req, res, (err) => {
    if (err) {
      console.warn('Multer upload error caught safely:', err.message);
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'Image size must be less than 10MB' });
        }
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ message: err.message || 'Invalid image file' });
    }
    next();
  });
};

const upload = {
  single: (fieldName = 'image') => (req, res, next) => {
    multerInstance.single(fieldName)(req, res, (err) => {
      if (err) {
        console.warn(`Multer ${fieldName} upload error caught:`, err.message);
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'Image size must be less than 10MB' });
          }
          return res.status(400).json({ message: `Upload error: ${err.message}` });
        }
        return res.status(400).json({ message: err.message || 'Invalid image file' });
      }
      next();
    });
  }
};

export default upload;