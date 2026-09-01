const Outreach = require("../models/Outreach");


// ========================================
// GET OUTREACH
// ========================================

const getOutreach = async (req, res) => {
  try {

    const programs =
      await Outreach.find()
        .sort({
          date: -1
        });

    return res.status(200).json(
      programs
    );

  } catch (error) {

    console.error(
      "GET OUTREACH ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch outreach programs"
    });
  }
};


// ========================================
// CREATE OUTREACH
// ========================================

const createOutreach = async (req, res) => {
  try {

    const {
      title,
      category,
      description,
      date,
      location,
      peopleHelped,
      status
    } = req.body;


    // ====================================
    // REQUIRED FIELDS
    // ====================================

    if (!title) {
      return res.status(400).json({
        message:
          "Program title is required"
      });
    }


    if (!category) {
      return res.status(400).json({
        message:
          "Category is required"
      });
    }


    if (!description) {
      return res.status(400).json({
        message:
          "Description is required"
      });
    }


    if (!req.file) {
      return res.status(400).json({
        message:
          "Outreach image is required"
      });
    }


    // ====================================
    // IMAGE URL
    // ====================================

    const imageUrl =
      `/uploads/${req.file.filename}`;


    // ====================================
    // CREATE PROGRAM
    // ====================================

    const program =
      await Outreach.create({

        title:
          title.trim(),

        category:
          category.trim(),

        description:
          description.trim(),

        imageUrl,

        date:
          date || Date.now(),

        location:
          location
            ? location.trim()
            : "",

        peopleHelped:
          Number(peopleHelped) || 0,

        status:
          status || "Active"
      });


    return res.status(201).json({

      message:
        "Outreach program created successfully",

      program

    });

  } catch (error) {

    console.error(
      "CREATE OUTREACH ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to create outreach program"
    });
  }
};


// ========================================
// UPDATE OUTREACH
// ========================================

const updateOutreach = async (req, res) => {
  try {

    const {
      id
    } = req.params;


    const updateData = {
      ...req.body
    };


    // ====================================
    // CLEAN TEXT VALUES
    // ====================================

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


    // ====================================
    // PEOPLE HELPED
    // ====================================

    if (
      updateData.peopleHelped !==
      undefined
    ) {

      updateData.peopleHelped =
        Number(
          updateData.peopleHelped
        ) || 0;
    }


    // ====================================
    // NEW IMAGE
    // ====================================

    if (req.file) {

      updateData.imageUrl =
        `/uploads/${req.file.filename}`;
    }


    // ====================================
    // UPDATE
    // ====================================

    const program =
      await Outreach.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );


    if (!program) {

      return res.status(404).json({
        message:
          "Outreach program not found"
      });
    }


    return res.status(200).json({

      message:
        "Outreach program updated successfully",

      program

    });

  } catch (error) {

    console.error(
      "UPDATE OUTREACH ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update outreach program"
    });
  }
};


// ========================================
// DELETE OUTREACH
// ========================================

const deleteOutreach = async (req, res) => {
  try {

    const {
      id
    } = req.params;


    const program =
      await Outreach.findByIdAndDelete(
        id
      );


    if (!program) {

      return res.status(404).json({
        message:
          "Outreach program not found"
      });
    }


    return res.status(200).json({
      message:
        "Outreach program deleted successfully"
    });

  } catch (error) {

    console.error(
      "DELETE OUTREACH ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete outreach program"
    });
  }
};


// ========================================
// EXPORT
// ========================================

module.exports = {
  getOutreach,
  createOutreach,
  updateOutreach,
  deleteOutreach
};