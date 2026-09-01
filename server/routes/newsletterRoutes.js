const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  subscribeNewsletter,
} = require("../controllers/newsletterController");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| NEWSLETTER RATE LIMITER
|--------------------------------------------------------------------------
*/

const newsletterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 5,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many subscription attempts. Please try again later.",
  },
});

/*
|--------------------------------------------------------------------------
| SUBSCRIBE
|--------------------------------------------------------------------------
*/

router.post(
  "/subscribe",
  newsletterLimiter,
  subscribeNewsletter
);

module.exports = router;