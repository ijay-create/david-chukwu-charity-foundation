const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
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
      trim: true
    },

    subject: {
      type: String,
      trim: true
    },

    interestArea: {
      type: String,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: ["contact", "get-involved"],
      required: true
    },

    status: {
      type: String,
      enum: [
        "Unread",
        "Read",
        "Replied",
        "Archived"
      ],
      default: "Unread"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "ContactMessage",
  contactMessageSchema
);