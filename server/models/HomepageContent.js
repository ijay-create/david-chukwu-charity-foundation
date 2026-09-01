const mongoose = require("mongoose");

const homepageContentSchema = new mongoose.Schema(
  {
    hero: {
      script: {
        type: String,
        trim: true,
        default: "Bringing Hope,"
      },

      title: {
        type: String,
        trim: true,
        default: "Support and Change"
      },

      description: {
        type: String,
        trim: true,
        default:
          "At David Chukwu Charity Foundation, we are committed to touching lives, restoring dignity, and creating opportunities for vulnerable individuals within our communities."
      },

      image: {
        type: String,
        trim: true,
        default: ""
      },

      donateButtonText: {
        type: String,
        trim: true,
        default: "DONATE NOW"
      },

      learnMoreButtonText: {
        type: String,
        trim: true,
        default: "LEARN MORE"
      }
    },

    about: {
      eyebrow: {
        type: String,
        trim: true,
        default: "WHO WE ARE"
      },

      title: {
        type: String,
        trim: true,
        default: "Making a Difference Together"
      },

      description: {
        type: String,
        trim: true,
        default: ""
      },

      image: {
        type: String,
        trim: true,
        default: ""
      }
    },

    causes: {
      eyebrow: {
        type: String,
        trim: true,
        default: "OUR CAUSES"
      },

      title: {
        type: String,
        trim: true,
        default: "Where Your Support Makes a Difference"
      },

      description: {
        type: String,
        trim: true,
        default: ""
      }
    },

    featured: {
      eyebrow: {
        type: String,
        trim: true,
        default: "OUR WORK"
      },

      title: {
        type: String,
        trim: true,
        default: "Featured Stories"
      },

      description: {
        type: String,
        trim: true,
        default: ""
      }
    },

    cta: {
      title: {
        type: String,
        trim: true,
        default: "Together, We Can Make a Difference"
      },

      description: {
        type: String,
        trim: true,
        default:
          "Your support can help us reach more people and create lasting change."
      },

      buttonText: {
        type: String,
        trim: true,
        default: "DONATE NOW"
      },

      image: {
        type: String,
        trim: true,
        default: ""
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "HomepageContent",
  homepageContentSchema
);