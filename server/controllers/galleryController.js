const GalleryItem = require("../models/GalleryItem");

const getGallery = async (req, res) => {
  try {
    const gallery = await GalleryItem.find()
      .sort({ order: 1, createdAt: -1 });

    return res.status(200).json(gallery);
  } catch (error) {
    console.error("GET GALLERY ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch gallery items"
    });
  }
};

const createGallery = async (req, res) => {
  try {
    const {
      title,
      category,
      type,
      description,
      order
    } = req.body;

    if (!title || !category || !type) {
      return res.status(400).json({
        message: "Title, category and type are required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Gallery file is required"
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const galleryItem = await GalleryItem.create({
      title,
      category,
      type,
      fileUrl,
      description,
      order: order || 0
    });

    return res.status(201).json({
      message: "Gallery item created successfully",
      galleryItem
    });
  } catch (error) {
    console.error("CREATE GALLERY ERROR:", error);

    return res.status(500).json({
      message: "Failed to create gallery item"
    });
  }
};

const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      ...req.body
    };

    if (req.file) {
      updateData.fileUrl = `/uploads/${req.file.filename}`;
    }

    const galleryItem =
      await GalleryItem.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );

    if (!galleryItem) {
      return res.status(404).json({
        message: "Gallery item not found"
      });
    }

    return res.status(200).json({
      message: "Gallery item updated successfully",
      galleryItem
    });
  } catch (error) {
    console.error("UPDATE GALLERY ERROR:", error);

    return res.status(500).json({
      message: "Failed to update gallery item"
    });
  }
};

const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;

    const galleryItem =
      await GalleryItem.findByIdAndDelete(id);

    if (!galleryItem) {
      return res.status(404).json({
        message: "Gallery item not found"
      });
    }

    return res.status(200).json({
      message: "Gallery item deleted successfully"
    });
  } catch (error) {
    console.error("DELETE GALLERY ERROR:", error);

    return res.status(500).json({
      message: "Failed to delete gallery item"
    });
  }
};

module.exports = {
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery
};