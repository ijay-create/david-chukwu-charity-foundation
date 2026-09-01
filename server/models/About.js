const mongoose = require("mongoose");

const coreValueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    subtitle: {
      type: String,
      required: true,
      trim: true
    },

    icon: {
      type: String,
      required: true,
      trim: true
    },

    order: {
      type: Number,
      default: 0
    }
  },
  {
    _id: false
  }
);


const aboutSchema = new mongoose.Schema(
  {
    hero: {
      imageUrl: {
        type: String,
        default: ""
      }
    },

    story: {
      eyebrow: {
        type: String,
        default: "OUR STORY",
        trim: true
      },

      title: {
        type: String,
        default: "Who We Are",
        trim: true
      },

      paragraphOne: {
        type: String,
        default: "",
        trim: true
      },

      paragraphTwo: {
        type: String,
        default: "",
        trim: true
      }
    },

    mission: {
      eyebrow: {
        type: String,
        default: "OUR MISSION",
        trim: true
      },

      text: {
        type: String,
        default: "",
        trim: true
      }
    },

    vision: {
      eyebrow: {
        type: String,
        default: "OUR VISION",
        trim: true
      },

      text: {
        type: String,
        default: "",
        trim: true
      }
    },

    founder: {
      eyebrow: {
        type: String,
        default: "FOUNDER",
        trim: true
      },

      name: {
        type: String,
        default: "",
        trim: true
      },

      paragraphOne: {
        type: String,
        default: "",
        trim: true
      },

      paragraphTwo: {
        type: String,
        default: "",
        trim: true
      },

      imageUrl: {
        type: String,
        default: ""
      }
    },

    coreValues: {
      type: [coreValueSchema],
      default: []
    },

    collaboration: {
      eyebrow: {
        type: String,
        default: "IN COLLABORATION",
        trim: true
      },

      title: {
        type: String,
        default: "Stronger Together",
        trim: true
      },

      description: {
        type: String,
        default: "",
        trim: true
      },

      davidChukwuText: {
        type: String,
        default: "",
        trim: true
      },

      nicholasMarkText: {
        type: String,
        default: "",
        trim: true
      },

      registrationNumber: {
        type: String,
        default: "",
        trim: true
      },

      davidChukwuLogo: {
        type: String,
        default: ""
      },

      nicholasMarkLogo: {
        type: String,
        default: ""
      }
    }
  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model(
  "About",
  aboutSchema
);