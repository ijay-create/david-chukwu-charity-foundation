const mongoose = require("mongoose");


// ========================================
// OUTREACH PROJECT SCHEMA
// ========================================

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    text: {
      type: String,
      required: true,
      trim: true
    },

    imageUrl: {
      type: String,
      default: ""
    },

    order: {
      type: Number,
      default: 1
    }
  },
  {
    _id: true
  }
);


// ========================================
// GALLERY SCHEMA
// ========================================

const gallerySchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      default: ""
    },

    alt: {
      type: String,
      default: "Moment of Impact",
      trim: true
    },

    order: {
      type: Number,
      default: 1
    }
  },
  {
    _id: true
  }
);


// ========================================
// STATISTICS SCHEMA
// ========================================

const statSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      default: "Users",
      trim: true
    },

    number: {
      type: String,
      required: true,
      trim: true
    },

    label: {
      type: String,
      required: true,
      trim: true
    },

    order: {
      type: Number,
      default: 1
    }
  },
  {
    _id: true
  }
);


// ========================================
// TESTIMONIAL SCHEMA
// ========================================

const testimonialSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      default: ""
    },

    quote: {
      type: String,
      required: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    order: {
      type: Number,
      default: 1
    }
  },
  {
    _id: true
  }
);


// ========================================
// IMPACT SCHEMA
// ========================================

const impactSchema = new mongoose.Schema(
  {
    // ====================================
    // HERO
    // ====================================

    hero: {
      title: {
        type: String,
        default: "Our Impact",
        trim: true
      },

      tagline: {
        type: String,
        default:
          "Real change, Stronger communities",
        trim: true
      },

      lineOne: {
        type: String,
        default:
          "Real change, Stronger communities",
        trim: true
      },

      lineTwo: {
        type: String,
        default:
          "A better tomorrow",
        trim: true
      },

      imageUrl: {
        type: String,
        default: ""
      }
    },


    // ====================================
    // PROJECTS
    // ====================================

    projects: {
      type: [projectSchema],

      default: [
        {
          title:
            "Widows Support Outreach",

          text:
            "We provided food items, cash grants and skills support to widows to help them strengthen their livelihoods.",

          imageUrl: "",

          order: 1
        },

        {
          title:
            "Children Support Program",

          text:
            "We supported children in underserved communities with school supplies, learning material and care.",

          imageUrl: "",

          order: 2
        },

        {
          title:
            "Elderly Care Outreach",

          text:
            "We provided essential items, medical support and companionship to improve the well-being of elderly individuals.",

          imageUrl: "",

          order: 3
        }
      ]
    },


    // ====================================
    // GALLERY
    // ====================================

    gallery: {
      type: [gallerySchema],

      default: [
        {
          imageUrl: "",
          alt: "Children holding books",
          order: 1
        },

        {
          imageUrl: "",
          alt: "People receiving support packages",
          order: 2
        },

        {
          imageUrl: "",
          alt: "Children smiling",
          order: 3
        },

        {
          imageUrl: "",
          alt: "Men receiving support packages",
          order: 4
        },

        {
          imageUrl: "",
          alt: "Widows receiving support",
          order: 5
        }
      ]
    },


    // ====================================
    // IMPACT STATS
    // ====================================

    stats: {
      type: [statSchema],

      default: [
        {
          icon: "Users",
          number: "412+",
          label: "Lives Supported",
          order: 1
        },

        {
          icon: "Network",
          number: "13+",
          label: "Communities Reached",
          order: 2
        },

        {
          icon: "Handshake",
          number: "7+",
          label: "Outreach Programs",
          order: 3
        },

        {
          icon: "UsersRound",
          number: "38+",
          label: "Volunteers",
          order: 4
        }
      ]
    },


    // ====================================
    // TESTIMONIALS
    // ====================================

    testimonials: {
      type: [testimonialSchema],

      default: [
        {
          imageUrl: "",

          quote:
            "The support I received gave me hope and strength.",

          name:
            "Mrs. Ngozi, Widow",

          order: 1
        },

        {
          imageUrl: "",

          quote:
            "I am so grateful for the books and school items. They help me learn better.",

          name:
            "Joshua, Student",

          order: 2
        }
      ]
    },


    // ====================================
    // CTA
    // ====================================

    cta: {
      title: {
        type: String,
        default:
          "Be Part of the Change",
        trim: true
      },

      description: {
        type: String,
        default:
          "Your support can help us reach those who need it most.",
        trim: true
      },

      donateText: {
        type: String,
        default: "DONATE NOW",
        trim: true
      },

      involvedText: {
        type: String,
        default: "GET INVOLVED",
        trim: true
      }
    }
  },

  {
    timestamps: true
  }
);


// ========================================
// MODEL
// ========================================

module.exports = mongoose.model(
  "Impact",
  impactSchema
);