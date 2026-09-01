const Settings = require("../models/Settings");

/*
|--------------------------------------------------------------------------
| GET HOMEPAGE CONTENT
|--------------------------------------------------------------------------
*/

const getHomepageContent = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    return res.status(200).json({
      success: true,
      homepage: settings.homepage
    });

  } catch (error) {
    console.error(
      "GET HOMEPAGE CONTENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch homepage content"
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE HOMEPAGE CONTENT
|--------------------------------------------------------------------------
*/

const updateHomepageContent = async (req, res) => {
  try {
    const homepageData = req.body || {};

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    settings.homepage = {
      ...settings.homepage?.toObject?.() || settings.homepage || {},
      ...homepageData
    };

    settings.markModified("homepage");

    await settings.save();

    return res.status(200).json({
      success: true,
      message:
        "Homepage content updated successfully",
      homepage: settings.homepage
    });

  } catch (error) {
    console.error(
      "UPDATE HOMEPAGE CONTENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update homepage content",
      error: error.message
    });
  }
};

module.exports = {
  getHomepageContent,
  updateHomepageContent
};