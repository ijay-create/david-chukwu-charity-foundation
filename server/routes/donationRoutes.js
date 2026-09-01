const express = require("express");

const {
  createDonation,
  getDonations,
  updateDonation
} = require("../controllers/donationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// PUBLIC
// ========================================

router.post(
  "/",
  createDonation
);


// ========================================
// ADMIN - GET
// ========================================

router.get(
  "/",
  authMiddleware,
  getDonations
);


// ========================================
// ADMIN - UPDATE
// ========================================

router.put(
  "/:id",
  authMiddleware,
  updateDonation
);


module.exports = router;