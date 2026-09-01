const express = require("express");

const {
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery
} = require("../controllers/galleryController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public
router.get("/", getGallery);

// Protected admin routes
router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  createGallery
);

router.put(
  "/:id",
  authMiddleware,
  upload.single("file"),
  updateGallery
);

router.delete(
  "/:id",
  authMiddleware,
  deleteGallery
);

module.exports = router;