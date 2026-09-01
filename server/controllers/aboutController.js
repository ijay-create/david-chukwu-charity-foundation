const About = require("../models/About");

const API_BASE_URL =
  process.env.API_BASE_URL ||
  "http://localhost:5000";


// ========================================
// GET ABOUT
// ========================================

const getAbout = async (req, res) => {
  try {
    let about = await About.findOne();

    if (!about) {
      about = await About.create({});
    }

    return res.status(200).json({
      success: true,
      about
    });

  } catch (error) {
    console.error(
      "GET ABOUT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch About Us content"
    });
  }
};


// ========================================
// UPDATE ABOUT
// ========================================

const updateAbout = async (req, res) => {
  try {

    let about = await About.findOne();

    if (!about) {
      about = await About.create({});
    }


    // ====================================
    // PARSE JSON SECTIONS
    // ====================================

    let story = {};
    let mission = {};
    let vision = {};
    let founder = {};
    let coreValues = [];
    let collaboration = {};


    if (req.body.story) {
      story = JSON.parse(req.body.story);
    }

    if (req.body.mission) {
      mission = JSON.parse(req.body.mission);
    }

    if (req.body.vision) {
      vision = JSON.parse(req.body.vision);
    }

    if (req.body.founder) {
      founder = JSON.parse(req.body.founder);
    }

    if (req.body.coreValues) {
      coreValues = JSON.parse(
        req.body.coreValues
      );
    }

    if (req.body.collaboration) {
      collaboration = JSON.parse(
        req.body.collaboration
      );
    }


    // ====================================
    // UPDATE TEXT CONTENT
    // ====================================

    about.story = {
      ...about.story.toObject(),
      ...story
    };

    about.mission = {
      ...about.mission.toObject(),
      ...mission
    };

    about.vision = {
      ...about.vision.toObject(),
      ...vision
    };

    about.founder = {
      ...about.founder.toObject(),
      ...founder
    };

    about.coreValues =
      Array.isArray(coreValues)
        ? coreValues
        : about.coreValues;

    about.collaboration = {
      ...about.collaboration.toObject(),
      ...collaboration
    };


    // ====================================
    // HERO IMAGE
    // ====================================

    if (
      req.files?.heroImage?.[0]
    ) {

      about.hero.imageUrl =
        `/uploads/${req.files.heroImage[0].filename}`;

    }


    // ====================================
    // FOUNDER IMAGE
    // ====================================

    if (
      req.files?.founderImage?.[0]
    ) {

      about.founder.imageUrl =
        `/uploads/${req.files.founderImage[0].filename}`;

    }


    // ====================================
    // DAVID CHUKWU LOGO
    // ====================================

    if (
      req.files?.davidChukwuLogo?.[0]
    ) {

      about.collaboration.davidChukwuLogo =
        `/uploads/${req.files.davidChukwuLogo[0].filename}`;

    }


    // ====================================
    // NICHOLAS MARK LOGO
    // ====================================

    if (
      req.files?.nicholasMarkLogo?.[0]
    ) {

      about.collaboration.nicholasMarkLogo =
        `/uploads/${req.files.nicholasMarkLogo[0].filename}`;

    }


    // ====================================
    // SAVE
    // ====================================

    await about.save();


    return res.status(200).json({
      success: true,
      message:
        "About Us content updated successfully",
      about
    });

  } catch (error) {

    console.error(
      "UPDATE ABOUT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update About Us content"
    });
  }
};


module.exports = {
  getAbout,
  updateAbout
};