const express = require("express");

const {
  getHomepageContent,
  updateHomepageContent
} = require("../controllers/homepageController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  getHomepageContent
);

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

router.put(
  "/",
  authMiddleware,
  updateHomepageContent
);

module.exports = router;