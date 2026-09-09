const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// ============================================================
// ENVIRONMENT VARIABLES
// ============================================================

dotenv.config();

// ============================================================
// APP INITIALIZATION
// ============================================================

const app = express();

const PORT = process.env.PORT || 5000;

// ============================================================
// CORS CONFIGURATION
// ============================================================

const allowedOrigins = [
  // ============================================================
  // LOCAL DEVELOPMENT
  // ============================================================

  "http://localhost:5173",
  "http://localhost:5174",

  // ============================================================
  // VERCEL PRODUCTION DOMAIN
  // ============================================================

  "https://david-chukwu-charity-foundation.vercel.app",

  // ============================================================
  // NEW CUSTOM PRODUCTION DOMAIN
  // ============================================================

  "https://davidchukwucharityfoundation.org",
  "https://www.davidchukwucharityfoundation.org",

  // ============================================================
  // OLD CUSTOM DOMAIN
  // Kept temporarily for compatibility
  // ============================================================

  "https://davidchukwu.org",
  "https://www.davidchukwu.org",

  // ============================================================
  // ENVIRONMENT VARIABLE
  // ============================================================

  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // ========================================================
      // REQUESTS WITHOUT ORIGIN
      // Examples:
      // Postman
      // Server-to-server requests
      // Health checks
      // ========================================================

      if (!origin) {
        return callback(null, true);
      }

      // ========================================================
      // ALLOWED ORIGIN
      // ========================================================

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // ========================================================
      // BLOCK UNAUTHORIZED ORIGIN
      // ========================================================

      console.warn(
        `CORS blocked origin: ${origin}`
      );

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,
  })
);

// ============================================================
// BODY PARSERS
// ============================================================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ============================================================
// STATIC UPLOADS
// ============================================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// ============================================================
// API ROUTES
// ============================================================

// ------------------------------------------------------------
// Authentication
// ------------------------------------------------------------

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

// ------------------------------------------------------------
// Dashboard
// ------------------------------------------------------------

app.use(
  "/api/dashboard",
  require("./routes/dashboardRoutes")
);

// ------------------------------------------------------------
// About Us
// ------------------------------------------------------------

app.use(
  "/api/about",
  require("./routes/aboutRoutes")
);

// ------------------------------------------------------------
// Causes
// ------------------------------------------------------------

app.use(
  "/api/causes",
  require("./routes/causesRoutes")
);

// ------------------------------------------------------------
// Impact
// ------------------------------------------------------------

app.use(
  "/api/impact",
  require("./routes/impactRoutes")
);

// ------------------------------------------------------------
// Outreach
// ------------------------------------------------------------

app.use(
  "/api/outreach",
  require("./routes/outreachRoutes")
);

// ------------------------------------------------------------
// Volunteers
// ------------------------------------------------------------

app.use(
  "/api/volunteers",
  require("./routes/volunteerRoutes")
);

// ------------------------------------------------------------
// Gallery
// ------------------------------------------------------------

app.use(
  "/api/gallery",
  require("./routes/galleryRoutes")
);

// ------------------------------------------------------------
// Donations
// ------------------------------------------------------------

app.use(
  "/api/donations",
  require("./routes/donationRoutes")
);

// ------------------------------------------------------------
// Donation Accounts
// ------------------------------------------------------------

app.use(
  "/api/donation-accounts",
  require("./routes/donationAccountRoutes")
);

// ------------------------------------------------------------
// Contact
// ------------------------------------------------------------

app.use(
  "/api/contact",
  require("./routes/contactRoutes")
);

// ------------------------------------------------------------
// Get Involved
// ------------------------------------------------------------

app.use(
  "/api/get-involved",
  require("./routes/getInvolvedRoutes")
);

// ------------------------------------------------------------
// Newsletter
// ------------------------------------------------------------

app.use(
  "/api/newsletter",
  require("./routes/newsletterRoutes")
);

// ------------------------------------------------------------
// Settings
// ------------------------------------------------------------

app.use(
  "/api/settings",
  require("./routes/settingsRoutes")
);

// ============================================================
// ROOT HEALTH CHECK
// ============================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "David Chukwu Charity Foundation API is running",
  });
});

// ============================================================
// API 404 HANDLER
// ============================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================

app.use(
  (error, req, res, next) => {
    console.error(
      "GLOBAL ERROR:",
      error
    );

    // --------------------------------------------------------
    // CORS ERRORS
    // --------------------------------------------------------

    if (
      error.message ===
      "Not allowed by CORS"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Request blocked by CORS policy.",
      });
    }

    // --------------------------------------------------------
    // MULTER ERRORS
    // --------------------------------------------------------

    if (
      error.name === "MulterError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "File upload error.",
      });
    }

    // --------------------------------------------------------
    // GENERAL ERRORS
    // --------------------------------------------------------

    return res.status(
      error.status || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Internal server error.",
    });
  }
);

// ============================================================
// DATABASE CONNECTION
// ============================================================

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected successfully"
    );

    // ========================================================
    // START SERVER
    // ========================================================

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
};

// ============================================================
// START APPLICATION
// ============================================================

connectDB();