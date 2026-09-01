const mongoose = require("mongoose");

const galleryItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: ["image", "video"],
      required: true
    },

    fileUrl: {
      type: String,
      required: true
    },

    thumbnailUrl: {
      type: String
    },

    description: {
      type: String,
      trim: true
    },

    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "GalleryItem",
  galleryItemSchema
);