const mongoose = require("mongoose");

const galleryItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    thumbnailUrl: {
      type: String,
      default: "",
    },

    // ============================================================
    // CLOUDINARY
    // ============================================================

    cloudinaryPublicId: {
      type: String,
      default: "",
    },

    cloudinaryResourceType: {
      type: String,
      enum: ["image", "video", ""],
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "GalleryItem",
  galleryItemSchema
);