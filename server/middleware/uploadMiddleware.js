const multer = require("multer");

// ============================================================
// MULTER MEMORY STORAGE
// ============================================================
// Files are kept in memory as req.file.buffer.
// This allows us to send them directly to Cloudinary.
// No files are permanently stored on Render's local filesystem.
// ============================================================

const storage = multer.memoryStorage();

// ============================================================
// FILE FILTER
// ============================================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "video/mp4",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP and MP4 files are allowed"
      )
    );
  }
};

// ============================================================
// MULTER CONFIGURATION
// ============================================================

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

module.exports = upload;