const mongoose = require("mongoose");

const causeSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      trim: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
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


const causesSchema = new mongoose.Schema(
  {
    hero: {
      title: {
        type: String,
        default: "Our Causes"
      },

      description: {
        type: String,
        default:
          "Supporting people and communities where care is needed most."
      },

      imageUrl: {
        type: String,
        default: ""
      }
    },

    intro: {
      eyebrow: {
        type: String,
        default: "WHAT WE CARE ABOUT"
      },

      title: {
        type: String,
        default:
          "Creating Change Where It Matters"
      },

      description: {
        type: String,
        default:
          "Our work focuses on providing care, support and opportunities to vulnerable individuals and communities."
      }
    },

    causes: {
      type: [causeSchema],
      default: []
    },

    approach: {
      eyebrow: {
        type: String,
        default: "OUR APPROACH"
      },

      title: {
        type: String,
        default: "Compassion in Action"
      },

      description: {
        type: String,
        default:
          "We work through care, empowerment, advocacy and community partnerships to create meaningful change."
      },

      imageUrl: {
        type: String,
        default: ""
      }
    },

    cta: {
      eyebrow: {
        type: String,
        default: "MAKE A DIFFERENCE"
      },

      title: {
        type: String,
        default: "Be Part of the Change"
      },

      description: {
        type: String,
        default:
          "Your support can help us reach those who need it most."
      },

      donateText: {
        type: String,
        default: "DONATE NOW"
      },

      involvedText: {
        type: String,
        default: "GET INVOLVED"
      }
    }
  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model(
  "Causes",
  causesSchema
);