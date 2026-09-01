const express = require("express");

const {
  login
} = require("../controllers/authController");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| ADMIN LOGIN
|--------------------------------------------------------------------------
*/

router.post(
  "/login",
  login
);

module.exports = router;