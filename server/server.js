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
  // Local development
  "http://localhost:5173",
  "http://localhost:5174",

  // Production frontend - Vercel
  "https://david-chukwu-charity-foundation.vercel.app",

  // Existing production frontend, if configured
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as Postman, server-to-server requests, etc.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

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

// Authentication
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

// About Us
app.use(
  "/api/about",
  require("./routes/aboutRoutes")
);

// Causes
app.use(
  "/api/causes",
  require("./routes/causesRoutes")
);

// Impact
app.use(
  "/api/impact",
  require("./routes/impactRoutes")
);

// Gallery
app.use(
  "/api/gallery",
  require("./routes/galleryRoutes")
);

// Donations
app.use(
  "/api/donations",
  require("./routes/donationRoutes")
);

// Contact
app.use(
  "/api/contact",
  require("./routes/contactRoutes")
);

// Settings
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

    // Handle CORS errors
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

    // Handle Multer errors
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