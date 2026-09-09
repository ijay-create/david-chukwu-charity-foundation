const express = require("express");

const {
  createContact,
  getContacts,
  getVolunteers,
  updateContactStatus,
  deleteContact,
} = require("../controllers/contactController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================================================
// PUBLIC
// ============================================================================

// POST /api/contact
router.post(
  "/",
  createContact
);

// ============================================================================
// ADMIN
// ============================================================================

// GET /api/contact
router.get(
  "/",
  authMiddleware,
  getContacts
);

// GET /api/contact/volunteers
router.get(
  "/volunteers",
  authMiddleware,
  getVolunteers
);

// PUT /api/contact/:id/status
router.put(
  "/:id/status",
  authMiddleware,
  updateContactStatus
);

// DELETE /api/contact/:id
router.delete(
  "/:id",
  authMiddleware,
  deleteContact
);

module.exports = router;