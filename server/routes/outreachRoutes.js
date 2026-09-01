const express = require("express");

const {
  getOutreach,
  createOutreach,
  updateOutreach,
  deleteOutreach
} = require("../controllers/outreachController");

const authMiddleware = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();


// ========================================
// PUBLIC
// ========================================

router.get(
  "/",
  getOutreach
);


// ========================================
// ADMIN
// ========================================

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createOutreach
);


router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  updateOutreach
);


router.delete(
  "/:id",
  authMiddleware,
  deleteOutreach
);


module.exports = router;