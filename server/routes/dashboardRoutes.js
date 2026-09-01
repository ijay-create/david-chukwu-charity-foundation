const express = require("express");

const {
  getDashboardStats
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET DASHBOARD STATS
|--------------------------------------------------------------------------
| GET /api/dashboard/stats
| Protected admin route
|--------------------------------------------------------------------------
*/

router.get(
  "/stats",
  authMiddleware,
  getDashboardStats
);

module.exports = router;