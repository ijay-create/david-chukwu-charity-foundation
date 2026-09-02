const express = require("express");
const multer = require("multer");

const {
  getSettings,
  updateSettings,
  uploadHeroImage,
  uploadAboutImage,
  uploadFeaturedImage,
  uploadCTAImage,
  uploadCausesImage,
  resetSettings,
} = require("../controllers/settingsController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| MULTER MEMORY STORAGE
|--------------------------------------------------------------------------
| Files are kept in memory temporarily.
|
| They will NOT be saved to:
|
| server/uploads/
|
| The controller will send them to Cloudinary.
|--------------------------------------------------------------------------
*/

const storage = multer.memoryStorage();

/*
|--------------------------------------------------------------------------
| ALLOWED IMAGE TYPES
|--------------------------------------------------------------------------
*/

const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

/*
|--------------------------------------------------------------------------
| MULTER
|--------------------------------------------------------------------------
*/

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Only JPG, JPEG, PNG and WEBP images are allowed."
        )
      );
    }

    cb(null, true);
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

/*
|--------------------------------------------------------------------------
| GET SETTINGS
|--------------------------------------------------------------------------
| GET /api/settings
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  getSettings
);

/*
|--------------------------------------------------------------------------
| UPDATE SETTINGS
|--------------------------------------------------------------------------
| PUT /api/settings
|--------------------------------------------------------------------------
*/

router.put(
  "/",
  authMiddleware,
  updateSettings
);

/*
|--------------------------------------------------------------------------
| HERO IMAGE
|--------------------------------------------------------------------------
| POST /api/settings/hero-image
| FormData: heroImage
|--------------------------------------------------------------------------
*/

router.post(
  "/hero-image",
  authMiddleware,
  upload.single("heroImage"),
  uploadHeroImage
);

/*
|--------------------------------------------------------------------------
| ABOUT IMAGE
|--------------------------------------------------------------------------
| POST /api/settings/about-image
| FormData: aboutImage
|--------------------------------------------------------------------------
*/

router.post(
  "/about-image",
  authMiddleware,
  upload.single("aboutImage"),
  uploadAboutImage
);

/*
|--------------------------------------------------------------------------
| FEATURED IMAGE
|--------------------------------------------------------------------------
| POST /api/settings/featured-image
| FormData: featuredImage
|--------------------------------------------------------------------------
*/

router.post(
  "/featured-image",
  authMiddleware,
  upload.single("featuredImage"),
  uploadFeaturedImage
);

/*
|--------------------------------------------------------------------------
| CTA IMAGE
|--------------------------------------------------------------------------
| POST /api/settings/cta-image
| FormData: ctaImage
|--------------------------------------------------------------------------
*/

router.post(
  "/cta-image",
  authMiddleware,
  upload.single("ctaImage"),
  uploadCTAImage
);

/*
|--------------------------------------------------------------------------
| CAUSE IMAGE
|--------------------------------------------------------------------------
| POST /api/settings/causes-image
|
| Frontend sends:
|
| causeImage
| causeIndex
|--------------------------------------------------------------------------
*/

const causesImageUpload = (
  req,
  res,
  next
) => {
  upload.single("causeImage")(
    req,
    res,
    (error) => {
      if (error) {
        return next(error);
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Please select a cause image.",
        });
      }

      next();
    }
  );
};

router.post(
  "/causes-image",
  authMiddleware,
  causesImageUpload,
  uploadCausesImage
);

/*
|--------------------------------------------------------------------------
| RESET SETTINGS
|--------------------------------------------------------------------------
| DELETE /api/settings
|--------------------------------------------------------------------------
*/

router.delete(
  "/",
  authMiddleware,
  resetSettings
);

/*
|--------------------------------------------------------------------------
| MULTER / ROUTE ERROR HANDLER
|--------------------------------------------------------------------------
*/

router.use(
  (error, req, res, next) => {
    console.error(
      "SETTINGS ROUTE ERROR:",
      error
    );

    /*
    |----------------------------------------------------------------------
    | MULTER ERROR
    |----------------------------------------------------------------------
    */

    if (
      error instanceof multer.MulterError
    ) {
      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Image size cannot exceed 5MB.",
        });
      }

      if (
        error.code ===
        "LIMIT_UNEXPECTED_FILE"
      ) {
        return res.status(400).json({
          success: false,
          message: `Unexpected upload field: ${error.field}`,
        });
      }

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Image upload failed.",
      });
    }

    /*
    |----------------------------------------------------------------------
    | CUSTOM IMAGE ERROR
    |----------------------------------------------------------------------
    */

    return res.status(400).json({
      success: false,
      message:
        error?.message ||
        "Settings request failed.",
    });
  }
);

module.exports = router;