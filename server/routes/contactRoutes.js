const express = require("express");

const {
  createContact,
  createGetInvolved,
  getContacts,
  getVolunteers,
  updateContactStatus,
  deleteContact
} = require("../controllers/contactController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  createContact
);

router.post(
  "/involved",
  createGetInvolved
);

router.get(
  "/",
  authMiddleware,
  getContacts
);

router.get(
  "/volunteers",
  authMiddleware,
  getVolunteers
);

router.put(
  "/:id/status",
  authMiddleware,
  updateContactStatus
);

router.delete(
  "/:id",
  authMiddleware,
  deleteContact
);

module.exports = router;