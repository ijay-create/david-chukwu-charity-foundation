const express = require("express");

const {
  getAbout,
  updateAbout
} = require("../controllers/aboutController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();


// ========================================
// PUBLIC
// ========================================

router.get(
  "/",
  getAbout
);


// ========================================
// ADMIN
// ========================================

router.put(
  "/",
  authMiddleware,
  upload.fields([
    {
      name: "heroImage",
      maxCount: 1
    },
    {
      name: "founderImage",
      maxCount: 1
    },
    {
      name: "davidChukwuLogo",
      maxCount: 1
    },
    {
      name: "nicholasMarkLogo",
      maxCount: 1
    }
  ]),
  updateAbout
);


module.exports = router;