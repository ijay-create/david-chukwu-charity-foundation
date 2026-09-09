const express = require("express");

const {
  createGetInvolved,
  getAllGetInvolved,
  updateGetInvolvedStatus,
  deleteGetInvolved,
} = require("../controllers/getInvolvedController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================================================
// PUBLIC
// ============================================================================

// POST /api/get-involved
router.post(
  "/",
  createGetInvolved
);

// ============================================================================
// ADMIN
// ============================================================================

// GET /api/get-involved
router.get(
  "/",
  authMiddleware,
  getAllGetInvolved
);

// PUT /api/get-involved/:id/status
router.put(
  "/:id/status",
  authMiddleware,
  updateGetInvolvedStatus
);

// DELETE /api/get-involved/:id
router.delete(
  "/:id",
  authMiddleware,
  deleteGetInvolved
);

module.exports = router;