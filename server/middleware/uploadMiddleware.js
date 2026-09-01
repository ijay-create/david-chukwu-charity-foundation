const multer = require("multer");
const path = require("path");
const fs = require("fs");

/*
|--------------------------------------------------------------------------
| UPLOAD DIRECTORY
|--------------------------------------------------------------------------
*/

const uploadDirectory = path.join(
  __dirname,
  "../uploads"
);

/*
|--------------------------------------------------------------------------
| ENSURE UPLOAD DIRECTORY EXISTS
|--------------------------------------------------------------------------
*/

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true
  });
}

/*
|--------------------------------------------------------------------------
| MULTER STORAGE
|--------------------------------------------------------------------------
*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const filename = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extension}`;

    cb(null, filename);
  }
});

/*
|--------------------------------------------------------------------------
| FILE FILTER
|--------------------------------------------------------------------------
*/

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "video/mp4"
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and MP4 files are allowed"
      )
    );
  }
};

/*
|--------------------------------------------------------------------------
| MULTER CONFIGURATION
|--------------------------------------------------------------------------
*/

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 50 * 1024 * 1024
  }
});

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

module.exports = upload;