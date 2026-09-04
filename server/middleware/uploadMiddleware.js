import multer from 'multer';
import path from 'path';

// Use memory storage for Cloudinary upload stream
const storage = multer.memoryStorage();

// Allowed MIME types
const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// File filter validation
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];

  if (allowedMimeTypes.includes(file.mimetype) && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG and WEBP images are supported. Files like SVG, GIF, PDF, EXE, and videos are rejected.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per file limit
    files: 5 // Max 5 files limit
  },
  fileFilter
});

// Middleware wrapper for multi-file upload error handling
export const uploadProblemImages = (req, res, next) => {
  const uploadHandler = upload.array('images', 5);

  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'Each image must be smaller than 5 MB.' });
      }
      if (err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ success: false, message: 'You can upload a maximum of 5 photos.' });
      }
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};
