const mongoose = require("mongoose");

const getInvolvedSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      trim: true,
      default: ""
    },

    involvement: {
      type: String,
      required: true,
      enum: [
        "Volunteer",
        "Partner With Us",
        "Sponsor a Project",
        "Donate"
      ]
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Resolved"
      ],
      default: "New"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "GetInvolved",
  getInvolvedSchema
);