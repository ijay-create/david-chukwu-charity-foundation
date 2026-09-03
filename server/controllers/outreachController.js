const Outreach = require("../models/Outreach");

const uploadToCloudinary =
  require("../utils/cloudinaryUpload");

const cloudinary =
  require("../config/cloudinary");


// ============================================================
// GET OUTREACH
// ============================================================

const getOutreach = async (req, res) => {
  try {
    const programs =
      await Outreach.find().sort({
        date: -1,
      });

    return res.status(200).json(programs);
  } catch (error) {
    console.error(
      "GET OUTREACH ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch outreach programs",
    });
  }
};


// ============================================================
// CREATE OUTREACH
// ============================================================

const createOutreach = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      date,
      location,
      peopleHelped,
      status,
    } = req.body;


    // ========================================================
    // REQUIRED FIELDS
    // ========================================================

    if (!title?.trim()) {
      return res.status(400).json({
        message:
          "Program title is required",
      });
    }

    if (!category?.trim()) {
      return res.status(400).json({
        message:
          "Category is required",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        message:
          "Description is required",
      });
    }

    if (!location?.trim()) {
      return res.status(400).json({
        message:
          "Location is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message:
          "Outreach image is required",
      });
    }


    // ========================================================
    // VERIFY FILE BUFFER
    // ========================================================

    if (!req.file.buffer) {
      console.error(
        "❌ OUTREACH FILE BUFFER IS MISSING"
      );

      return res.status(400).json({
        message:
          "Uploaded file buffer is missing.",
      });
    }


    // ========================================================
    // CLOUDINARY UPLOAD
    // ========================================================

    console.log(
      "☁️ UPLOADING OUTREACH IMAGE TO CLOUDINARY..."
    );

    const cloudinaryResult =
      await uploadToCloudinary(
        req.file.buffer,
        {
          folder:
            "david-chukwu-charity-foundation/outreach",
        }
      );


    console.log(
      "☁️ OUTREACH CLOUDINARY RESULT:",
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


    // ========================================================
    // CREATE PROGRAM
    // ========================================================

    const program =
      await Outreach.create({
        title:
          title.trim(),

        category:
          category.trim(),

        description:
          description.trim(),

        imageUrl:
          cloudinaryResult.secure_url,

        cloudinaryPublicId:
          cloudinaryResult.public_id,

        cloudinaryResourceType:
          cloudinaryResult.resource_type ||
          "image",

        date:
          date || Date.now(),

        location:
          location.trim(),

        peopleHelped:
          Number(peopleHelped) || 0,

        status:
          status || "Active",
      });


    console.log(
      "✅ OUTREACH PROGRAM SAVED:",
      program
    );


    return res.status(201).json({
      message:
        "Outreach program created successfully",

      program,
    });
  } catch (error) {
    console.error(
      "❌ CREATE OUTREACH ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to create outreach program",
    });
  }
};


// ============================================================
// UPDATE OUTREACH
// ============================================================

const updateOutreach = async (req, res) => {
  try {
    const {
      id,
    } = req.params;


    const existingProgram =
      await Outreach.findById(id);


    if (!existingProgram) {
      return res.status(404).json({
        message:
          "Outreach program not found",
      });
    }


    // ========================================================
    // UPDATE DATA
    // ========================================================

    const updateData = {
      ...req.body,
    };


    // ========================================================
    // CLEAN TEXT VALUES
    // ========================================================

    if (updateData.title) {
      updateData.title =
        updateData.title.trim();
    }

    if (updateData.category) {
      updateData.category =
        updateData.category.trim();
    }

    if (updateData.description) {
      updateData.description =
        updateData.description.trim();
    }

    if (updateData.location) {
      updateData.location =
        updateData.location.trim();
    }


    // ========================================================
    // PEOPLE HELPED
    // ========================================================

    if (
      updateData.peopleHelped !==
      undefined
    ) {
      updateData.peopleHelped =
        Number(
          updateData.peopleHelped
        ) || 0;
    }


    // ========================================================
    // NEW IMAGE
    // ========================================================

    if (req.file) {
      if (!req.file.buffer) {
        return res.status(400).json({
          message:
            "Uploaded file buffer is missing.",
        });
      }


      console.log(
        "☁️ UPLOADING UPDATED OUTREACH IMAGE..."
      );


      const cloudinaryResult =
        await uploadToCloudinary(
          req.file.buffer,
          {
            folder:
              "david-chukwu-charity-foundation/outreach",
          }
        );


      console.log(
        "☁️ UPDATED OUTREACH CLOUDINARY RESULT:",
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


      updateData.imageUrl =
        cloudinaryResult.secure_url;

      updateData.cloudinaryPublicId =
        cloudinaryResult.public_id;

      updateData.cloudinaryResourceType =
        cloudinaryResult.resource_type ||
        "image";


      // ======================================================
      // DELETE OLD CLOUDINARY IMAGE
      // ======================================================

      if (
        existingProgram.cloudinaryPublicId
      ) {
        try {
          await cloudinary.uploader.destroy(
            existingProgram.cloudinaryPublicId,
            {
              resource_type:
                existingProgram.cloudinaryResourceType ||
                "image",
            }
          );

          console.log(
            "✅ OLD OUTREACH CLOUDINARY IMAGE DELETED"
          );
        } catch (deleteError) {
          console.error(
            "OLD OUTREACH CLOUDINARY DELETE ERROR:",
            deleteError
          );
        }
      }
    }


    // ========================================================
    // UPDATE DATABASE
    // ========================================================

    const program =
      await Outreach.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );


    return res.status(200).json({
      message:
        "Outreach program updated successfully",

      program,
    });
  } catch (error) {
    console.error(
      "❌ UPDATE OUTREACH ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to update outreach program",
    });
  }
};


// ============================================================
// DELETE OUTREACH
// ============================================================

const deleteOutreach = async (req, res) => {
  try {
    const {
      id,
    } = req.params;


    const program =
      await Outreach.findById(id);


    if (!program) {
      return res.status(404).json({
        message:
          "Outreach program not found",
      });
    }


    // ========================================================
    // DELETE CLOUDINARY IMAGE
    // ========================================================

    if (
      program.cloudinaryPublicId
    ) {
      try {
        await cloudinary.uploader.destroy(
          program.cloudinaryPublicId,
          {
            resource_type:
              program.cloudinaryResourceType ||
              "image",
          }
        );

        console.log(
          "✅ OUTREACH CLOUDINARY IMAGE DELETED"
        );
      } catch (cloudinaryError) {
        console.error(
          "OUTREACH CLOUDINARY DELETE ERROR:",
          cloudinaryError
        );
      }
    }


    // ========================================================
    // DELETE DATABASE RECORD
    // ========================================================

    await Outreach.findByIdAndDelete(id);


    console.log(
      "✅ OUTREACH DATABASE RECORD DELETED"
    );


    return res.status(200).json({
      message:
        "Outreach program deleted successfully",
    });
  } catch (error) {
    console.error(
      "❌ DELETE OUTREACH ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete outreach program",
    });
  }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  getOutreach,
  createOutreach,
  updateOutreach,
  deleteOutreach,
};