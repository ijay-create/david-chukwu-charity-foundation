const express = require("express");

const {
  createGetInvolved,
  getAllGetInvolved,
} = require("../controllers/getInvolvedController");

const router = express.Router();

// ============================================================
// CREATE GET INVOLVED SUBMISSION
// POST /api/get-involved
// ============================================================

router.post(
  "/",
  createGetInvolved
);

// ============================================================
// GET ALL GET INVOLVED SUBMISSIONS
// GET /api/get-involved
// ============================================================

router.get(
  "/",
  getAllGetInvolved
);

// ============================================================
// EXPORT ROUTER
// ============================================================

module.exports = router;