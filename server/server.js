const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

/*
|--------------------------------------------------------------------------
| CORS CONFIGURATION
|--------------------------------------------------------------------------
|
| Local development:
|   http://localhost:5173
|   http://localhost:5174
|
| Production:
|   Set CLIENT_URL in Render environment variables.
|
| Example:
|   CLIENT_URL=https://your-frontend.onrender.com
|
*/

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      /*
      |--------------------------------------------------------------------------
      | Allow requests with no origin
      |--------------------------------------------------------------------------
      |
      | This includes things like:
      | - Postman
      | - Server-to-server requests
      | - Some development tools
      |
      */

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

    credentials: true
  })
);

/*
|--------------------------------------------------------------------------
| GLOBAL MIDDLEWARE
|--------------------------------------------------------------------------
*/

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

/*
|--------------------------------------------------------------------------
| STATIC UPLOADS
|--------------------------------------------------------------------------
|
| Uploaded images can be accessed through:
|
| http://localhost:5000/uploads/filename.jpg
|
| Production:
|
| https://your-backend.onrender.com/uploads/filename.jpg
|
*/

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

/*
|--------------------------------------------------------------------------
| API ROUTES
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

/*
|--------------------------------------------------------------------------
| GALLERY
|--------------------------------------------------------------------------
*/

app.use(
  "/api/gallery",
  require("./routes/galleryRoutes")
);

/*
|--------------------------------------------------------------------------
| OUTREACH
|--------------------------------------------------------------------------
*/

app.use(
  "/api/outreach",
  require("./routes/outreachRoutes")
);

/*
|--------------------------------------------------------------------------
| CONTACT
|--------------------------------------------------------------------------
*/

app.use(
  "/api/contact",
  require("./routes/contactRoutes")
);

/*
|--------------------------------------------------------------------------
| GET INVOLVED
|--------------------------------------------------------------------------
*/

app.use(
  "/api/get-involved",
  require("./routes/getInvolvedRoutes")
);

/*
|--------------------------------------------------------------------------
| VOLUNTEERS
|--------------------------------------------------------------------------
*/

app.use(
  "/api/volunteers",
  require("./routes/volunteerRoutes")
);

/*
|--------------------------------------------------------------------------
| DONATIONS
|--------------------------------------------------------------------------
*/

app.use(
  "/api/donations",
  require("./routes/donationRoutes")
);

/*
|--------------------------------------------------------------------------
| DONATION ACCOUNTS
|--------------------------------------------------------------------------
*/

app.use(
  "/api/donation-accounts",
  require("./routes/donationAccountRoutes")
);

/*
|--------------------------------------------------------------------------
| DASHBOARD
|--------------------------------------------------------------------------
*/

app.use(
  "/api/dashboard",
  require("./routes/dashboardRoutes")
);

/*
|--------------------------------------------------------------------------
| SETTINGS
|--------------------------------------------------------------------------
*/

app.use(
  "/api/settings",
  require("./routes/settingsRoutes")
);

/*
|--------------------------------------------------------------------------
| ABOUT
|--------------------------------------------------------------------------
*/

app.use(
  "/api/about",
  require("./routes/aboutRoutes")
);

/*
|--------------------------------------------------------------------------
| CAUSES
|--------------------------------------------------------------------------
*/

app.use(
  "/api/causes",
  require("./routes/causesRoutes")
);

/*
|--------------------------------------------------------------------------
| IMPACT
|--------------------------------------------------------------------------
*/

app.use(
  "/api/impact",
  require("./routes/impactRoutes")
);

/*
|--------------------------------------------------------------------------
| HOMEPAGE
|--------------------------------------------------------------------------
*/

app.use(
  "/api/homepage",
  require("./routes/homepageRoutes")
);

/*
|--------------------------------------------------------------------------
| NEWSLETTER - BREVO
|--------------------------------------------------------------------------
*/

app.use(
  "/api/newsletter",
  require("./routes/newsletterRoutes")
);

/*
|--------------------------------------------------------------------------
| ROOT HEALTH CHECK
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message:
      "David Chukwu Charity Foundation API is running."
  });
});

/*
|--------------------------------------------------------------------------
| API HEALTH CHECK
|--------------------------------------------------------------------------
*/

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "API is healthy.",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected"
  });
});

/*
|--------------------------------------------------------------------------
| 404 HANDLER
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message:
      `Route not found: ${req.method} ${req.originalUrl}`
  });
});

/*
|--------------------------------------------------------------------------
| GLOBAL ERROR HANDLER
|--------------------------------------------------------------------------
*/

app.use(
  (error, req, res, next) => {
    console.error(
      "SERVER ERROR:",
      error
    );

    /*
    |--------------------------------------------------------------------------
    | CORS ERROR
    |--------------------------------------------------------------------------
    */

    if (
      error.message ===
      "Not allowed by CORS"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Request blocked by CORS policy."
      });
    }

    /*
    |--------------------------------------------------------------------------
    | GENERAL SERVER ERROR
    |--------------------------------------------------------------------------
    */

    return res.status(500).json({
      success: false,
      message:
        "Internal server error."
    });
  }
);

/*
|--------------------------------------------------------------------------
| DATABASE CONNECTION
|--------------------------------------------------------------------------
*/

const startServer = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected successfully"
    );

    app.listen(
      PORT,
      () => {
        console.log(
          `Server running on port ${PORT}`
        );

        console.log(
          `Environment: ${
            process.env.NODE_ENV ||
            "development"
          }`
        );
      }
    );
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
};

startServer();