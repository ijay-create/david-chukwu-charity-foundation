const GalleryItem = require("../models/GalleryItem");
const uploadGalleryToCloudinary = require("../utils/galleryCloudinaryUpload");
const cloudinary = require("../config/cloudinary");

// ============================================================
// GET ALL GALLERY ITEMS
// ============================================================

const getGallery = async (req, res) => {
  try {
    const gallery = await GalleryItem.find()
      .sort({
        order: 1,
        createdAt: -1,
      });

    return res.status(200).json(gallery);
  } catch (error) {
    console.error("GET GALLERY ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch gallery items",
    });
  }
};

// ============================================================
// CREATE GALLERY ITEM
// ============================================================

const createGallery = async (req, res) => {
  try {
    // ==========================================================
    // DEBUG
    // ==========================================================

    console.log(
      "🔥 NEW GALLERY CONTROLLER RUNNING"
    );

    console.log(
      "GALLERY REQUEST BODY:",
      req.body
    );

    console.log(
      "GALLERY REQUEST FILE:",
      req.file
    );

    // ==========================================================
    // REQUEST DATA
    // ==========================================================

    const {
      title,
      category,
      type,
      description,
      order,
    } = req.body;

    // ==========================================================
    // VALIDATION
    // ==========================================================

    if (!title?.trim() || !category || !type) {
      return res.status(400).json({
        message:
          "Title, category and type are required",
      });
    }

    if (!["image", "video"].includes(type)) {
      return res.status(400).json({
        message:
          "Type must be either image or video",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Gallery file is required",
      });
    }

    // ==========================================================
    // MAKE SURE MULTER PROVIDED A BUFFER
    // ==========================================================

    if (!req.file.buffer) {
      console.error(
        "❌ GALLERY FILE BUFFER IS MISSING"
      );

      return res.status(400).json({
        message:
          "Uploaded file buffer is missing.",
      });
    }

    // ==========================================================
    // VALIDATE FILE TYPE
    // ==========================================================

    const isVideo =
      req.file.mimetype === "video/mp4";

    const isImage =
      req.file.mimetype.startsWith("image/");

    if (type === "video" && !isVideo) {
      return res.status(400).json({
        message:
          "A video gallery item must use an MP4 file",
      });
    }

    if (type === "image" && !isImage) {
      return res.status(400).json({
        message:
          "A gallery image must use JPG, JPEG, PNG or WEBP",
      });
    }

    // ==========================================================
    // CLOUDINARY RESOURCE TYPE
    // ==========================================================

    const resourceType =
      type === "video"
        ? "video"
        : "image";

    console.log(
      "☁️ CLOUDINARY RESOURCE TYPE:",
      resourceType
    );

    // ==========================================================
    // UPLOAD TO CLOUDINARY
    // ==========================================================

    console.log(
      "☁️ UPLOADING GALLERY FILE TO CLOUDINARY..."
    );

    const cloudinaryResult =
      await uploadGalleryToCloudinary(
        req.file.buffer,
        resourceType
      );

    // ==========================================================
    // VERIFY CLOUDINARY RESPONSE
    // ==========================================================

    console.log(
      "☁️ CLOUDINARY RESULT:",
      cloudinaryResult
    );

    if (!cloudinaryResult?.secure_url) {
      throw new Error(
        "Cloudinary upload completed without a secure URL."
      );
    }

    if (!cloudinaryResult?.public_id) {
      throw new Error(
        "Cloudinary upload completed without a public ID."
      );
    }

    // ==========================================================
    // CREATE DATABASE RECORD
    // ==========================================================

    const galleryItem =
      await GalleryItem.create({
        title: title.trim(),

        category: category.trim(),

        type,

        fileUrl:
          cloudinaryResult.secure_url,

        thumbnailUrl:
          type === "image"
            ? cloudinaryResult.secure_url
            : "",

        cloudinaryPublicId:
          cloudinaryResult.public_id,

        cloudinaryResourceType:
          cloudinaryResult.resource_type,

        description:
          description?.trim() || "",

        order:
          Number(order) || 0,
      });

    console.log(
      "✅ GALLERY ITEM SAVED:",
      galleryItem
    );

    // ==========================================================
    // RESPONSE
    // ==========================================================

    return res.status(201).json({
      message:
        "Gallery item created successfully",

      galleryItem,
    });
  } catch (error) {
    console.error(
      "❌ CREATE GALLERY ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to create gallery item",
    });
  }
};

// ============================================================
// UPDATE GALLERY ITEM
// ============================================================

const updateGallery = async (req, res) => {
  try {
    console.log(
      "🔥 UPDATE GALLERY CONTROLLER RUNNING"
    );

    console.log(
      "GALLERY UPDATE BODY:",
      req.body
    );

    console.log(
      "GALLERY UPDATE FILE:",
      req.file
    );

    const { id } = req.params;

    // ==========================================================
    // FIND EXISTING ITEM
    // ==========================================================

    const existingItem =
      await GalleryItem.findById(id);

    if (!existingItem) {
      return res.status(404).json({
        message: "Gallery item not found",
      });
    }

    const {
      title,
      category,
      type,
      description,
      order,
    } = req.body;

    // ==========================================================
    // VALIDATION
    // ==========================================================

    if (!title?.trim() || !category || !type) {
      return res.status(400).json({
        message:
          "Title, category and type are required",
      });
    }

    if (!["image", "video"].includes(type)) {
      return res.status(400).json({
        message:
          "Type must be either image or video",
      });
    }

    // ==========================================================
    // PREVENT TYPE CHANGE WITHOUT NEW FILE
    // ==========================================================

    if (
      !req.file &&
      type !== existingItem.type
    ) {
      return res.status(400).json({
        message:
          "Please upload a new file when changing the media type",
      });
    }

    // ==========================================================
    // BASIC UPDATE DATA
    // ==========================================================

    const updateData = {
      title: title.trim(),

      category: category.trim(),

      type,

      description:
        description?.trim() || "",

      order:
        Number(order) || 0,
    };

    // ==========================================================
    // NEW FILE PROVIDED
    // ==========================================================

    if (req.file) {
      if (!req.file.buffer) {
        return res.status(400).json({
          message:
            "Uploaded file buffer is missing.",
        });
      }

      const resourceType =
        type === "video"
          ? "video"
          : "image";

      const isVideo =
        req.file.mimetype === "video/mp4";

      const isImage =
        req.file.mimetype.startsWith("image/");

      if (
        type === "video" &&
        !isVideo
      ) {
        return res.status(400).json({
          message:
            "A video gallery item must use an MP4 file",
        });
      }

      if (
        type === "image" &&
        !isImage
      ) {
        return res.status(400).json({
          message:
            "A gallery image must use JPG, JPEG, PNG or WEBP",
        });
      }

      // ========================================================
      // UPLOAD NEW FILE TO CLOUDINARY
      // ========================================================

      console.log(
        "☁️ UPLOADING UPDATED GALLERY FILE..."
      );

      const cloudinaryResult =
        await uploadGalleryToCloudinary(
          req.file.buffer,
          resourceType
        );

      console.log(
        "☁️ UPDATED CLOUDINARY RESULT:",
        cloudinaryResult
      );

      if (
        !cloudinaryResult?.secure_url
      ) {
        throw new Error(
          "Cloudinary upload completed without a secure URL."
        );
      }

      if (
        !cloudinaryResult?.public_id
      ) {
        throw new Error(
          "Cloudinary upload completed without a public ID."
        );
      }

      // ========================================================
      // UPDATE CLOUDINARY DATA
      // ========================================================

      updateData.fileUrl =
        cloudinaryResult.secure_url;

      updateData.thumbnailUrl =
        type === "image"
          ? cloudinaryResult.secure_url
          : "";

      updateData.cloudinaryPublicId =
        cloudinaryResult.public_id;

      updateData.cloudinaryResourceType =
        cloudinaryResult.resource_type;

      // ========================================================
      // DELETE OLD CLOUDINARY FILE
      // ========================================================

      if (
        existingItem.cloudinaryPublicId
      ) {
        try {
          await cloudinary.uploader.destroy(
            existingItem.cloudinaryPublicId,
            {
              resource_type:
                existingItem.cloudinaryResourceType ||
                "image",
            }
          );

          console.log(
            "✅ OLD CLOUDINARY FILE DELETED"
          );
        } catch (deleteError) {
          console.error(
            "OLD CLOUDINARY FILE DELETE ERROR:",
            deleteError
          );
        }
      }
    }

    // ==========================================================
    // UPDATE DATABASE
    // ==========================================================

    const galleryItem =
      await GalleryItem.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    console.log(
      "✅ GALLERY ITEM UPDATED:",
      galleryItem
    );

    return res.status(200).json({
      message:
        "Gallery item updated successfully",

      galleryItem,
    });
  } catch (error) {
    console.error(
      "❌ UPDATE GALLERY ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to update gallery item",
    });
  }
};

// ============================================================
// DELETE GALLERY ITEM
// ============================================================

const deleteGallery = async (req, res) => {
  try {
    console.log(
      "🔥 DELETE GALLERY CONTROLLER RUNNING"
    );

    const { id } = req.params;

    // ==========================================================
    // FIND ITEM
    // ==========================================================

    const galleryItem =
      await GalleryItem.findById(id);

    if (!galleryItem) {
      return res.status(404).json({
        message: "Gallery item not found",
      });
    }

    // ==========================================================
    // DELETE FROM CLOUDINARY
    // ==========================================================

    if (galleryItem.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(
          galleryItem.cloudinaryPublicId,
          {
            resource_type:
              galleryItem.cloudinaryResourceType ||
              "image",
          }
        );

        console.log(
          "✅ CLOUDINARY FILE DELETED"
        );
      } catch (cloudinaryError) {
        console.error(
          "CLOUDINARY DELETE ERROR:",
          cloudinaryError
        );
      }
    }

    // ==========================================================
    // DELETE DATABASE RECORD
    // ==========================================================

    await GalleryItem.findByIdAndDelete(id);

    console.log(
      "✅ GALLERY DATABASE RECORD DELETED"
    );

    return res.status(200).json({
      message:
        "Gallery item deleted successfully",
    });
  } catch (error) {
    console.error(
      "❌ DELETE GALLERY ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete gallery item",
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery,
};