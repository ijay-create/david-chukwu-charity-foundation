const mongoose = require("mongoose");

/*
|--------------------------------------------------------------------------
| HOMEPAGE HERO SCHEMA
|--------------------------------------------------------------------------
*/

const heroSchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      default: "DAVID CHUKWU CHARITY FOUNDATION",
      trim: true,
    },

    title: {
      type: String,
      default: "Making a Difference Together",
      trim: true,
    },

    description: {
      type: String,
      default:
        "Together, we can create opportunities, support vulnerable communities, and build a better future.",
      trim: true,
    },

    primaryButtonText: {
      type: String,
      default: "DONATE NOW",
      trim: true,
    },

    secondaryButtonText: {
      type: String,
      default: "LEARN MORE",
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

/*
|--------------------------------------------------------------------------
| HOMEPAGE ABOUT SCHEMA
|--------------------------------------------------------------------------
| THIS IS THE HOMEPAGE ABOUT IMAGE.
| It is NOT the About Us page image.
|--------------------------------------------------------------------------
*/

const homepageAboutSchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      default: "WHO WE ARE",
      trim: true,
    },

    title: {
      type: String,
      default: "Building Stronger Communities Together",
      trim: true,
    },

    description: {
      type: String,
      default:
        "We believe every person deserves the opportunity to live a better life.",
      trim: true,
    },

    buttonText: {
      type: String,
      default: "LEARN MORE",
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

/*
|--------------------------------------------------------------------------
| HOMEPAGE CAUSE ITEM
|--------------------------------------------------------------------------
*/

const causeItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
    },

    text: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

/*
|--------------------------------------------------------------------------
| HOMEPAGE CAUSES
|--------------------------------------------------------------------------
*/

const causesSchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      default: "OUR CAUSES",
      trim: true,
    },

    title: {
      type: String,
      default: "Causes That Matter",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    items: {
      type: [causeItemSchema],
      default: [],
    },
  },
  {
    _id: false,
  }
);

/*
|--------------------------------------------------------------------------
| HOMEPAGE FEATURED
|--------------------------------------------------------------------------
*/

const featuredSchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      default: "FEATURED",
      trim: true,
    },

    title: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    buttonText: {
      type: String,
      default: "LEARN MORE",
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

/*
|--------------------------------------------------------------------------
| HOMEPAGE CTA
|--------------------------------------------------------------------------
*/

const ctaSchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      default: "GET INVOLVED",
      trim: true,
    },

    title: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    buttonText: {
      type: String,
      default: "GET INVOLVED",
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

/*
|--------------------------------------------------------------------------
| HOMEPAGE SCHEMA
|--------------------------------------------------------------------------
*/

const homepageSchema = new mongoose.Schema(
  {
    hero: {
      type: heroSchema,
      default: () => ({}),
    },

    /*
    |----------------------------------------------------------------------
    | IMPORTANT
    |----------------------------------------------------------------------
    | This is the About section displayed on the HOMEPAGE.
    |----------------------------------------------------------------------
    */

    about: {
      type: homepageAboutSchema,
      default: () => ({}),
    },

    causes: {
      type: causesSchema,
      default: () => ({}),
    },

    featured: {
      type: featuredSchema,
      default: () => ({}),
    },

    cta: {
      type: ctaSchema,
      default: () => ({}),
    },
  },
  {
    _id: false,
  }
);

/*
|--------------------------------------------------------------------------
| SETTINGS SCHEMA
|--------------------------------------------------------------------------
*/

const settingsSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | FOUNDATION INFORMATION
    |--------------------------------------------------------------------------
    */

    foundationName: {
      type: String,
      default: "David Chukwu Charity Foundation",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | SOCIAL MEDIA
    |--------------------------------------------------------------------------
    */

    facebook: {
      type: String,
      default: "",
      trim: true,
    },

    instagram: {
      type: String,
      default: "",
      trim: true,
    },

    twitter: {
      type: String,
      default: "",
      trim: true,
    },

    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | HOMEPAGE
    |--------------------------------------------------------------------------
    */

    homepage: {
      type: homepageSchema,
      default: () => ({}),
    },

    /*
    |--------------------------------------------------------------------------
    | DONATIONS
    |--------------------------------------------------------------------------
    */

    donationEnabled: {
      type: Boolean,
      default: true,
    },

    donationCurrency: {
      type: String,
      default: "NGN",
      trim: true,
    },

    minimumDonation: {
      type: Number,
      default: 1000,
      min: 0,
    },

    maximumDonation: {
      type: Number,
      default: null,
    },

    donationMessage: {
      type: String,
      default: "",
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | NOTIFICATIONS
    |--------------------------------------------------------------------------
    */

    emailNotifications: {
      type: Boolean,
      default: true,
    },

    newDonationNotifications: {
      type: Boolean,
      default: true,
    },

    newContactNotifications: {
      type: Boolean,
      default: true,
    },

    newVolunteerNotifications: {
      type: Boolean,
      default: true,
    },

    adminNotifications: {
      type: Boolean,
      default: true,
    },

    /*
    |--------------------------------------------------------------------------
    | FOOTER
    |--------------------------------------------------------------------------
    */

    footer: {
      description: {
        type: String,
        default: "",
        trim: true,
      },

      copyrightText: {
        type: String,
        default: "",
        trim: true,
      },

      email: {
        type: String,
        default: "",
        trim: true,
      },

      phone: {
        type: String,
        default: "",
        trim: true,
      },

      address: {
        type: String,
        default: "",
        trim: true,
      },

      facebook: {
        type: String,
        default: "",
        trim: true,
      },

      instagram: {
        type: String,
        default: "",
        trim: true,
      },

      twitter: {
        type: String,
        default: "",
        trim: true,
      },

      linkedin: {
        type: String,
        default: "",
        trim: true,
      },
    },

    /*
    |--------------------------------------------------------------------------
    | APPEARANCE
    |--------------------------------------------------------------------------
    */

    darkMode: {
      type: Boolean,
      default: false,
    },

    compactSidebar: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
    minimize: false,
  }
);

/*
|--------------------------------------------------------------------------
| SETTINGS MODEL
|--------------------------------------------------------------------------
*/

const Settings =
  mongoose.models.Settings ||
  mongoose.model("Settings", settingsSchema);

module.exports = Settings;