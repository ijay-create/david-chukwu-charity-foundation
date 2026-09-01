const fs = require("fs");
const path = require("path");

const Settings = require("../models/Settings");

/*
|--------------------------------------------------------------------------
| UPLOAD DIRECTORY
|--------------------------------------------------------------------------
*/

const uploadDirectory = path.join(
  process.cwd(),
  "uploads"
);

/*
|--------------------------------------------------------------------------
| ENSURE UPLOAD DIRECTORY
|--------------------------------------------------------------------------
*/

const ensureUploadDirectory = () => {
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
      recursive: true,
    });
  }
};

/*
|--------------------------------------------------------------------------
| CHECK OBJECT
|--------------------------------------------------------------------------
*/

const isObject = (value) => {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
};

/*
|--------------------------------------------------------------------------
| CHECK PROPERTY
|--------------------------------------------------------------------------
*/

const hasProperty = (object, property) => {
  return Object.prototype.hasOwnProperty.call(
    object,
    property
  );
};

/*
|--------------------------------------------------------------------------
| DELETE LOCAL FILE SAFELY
|--------------------------------------------------------------------------
*/

const deleteFile = (filePath) => {
  try {
    if (!filePath) {
      return;
    }

    /*
    |----------------------------------------------------------------------
    | NEVER DELETE EXTERNAL URLS
    |----------------------------------------------------------------------
    */

    if (
      filePath.startsWith("http://") ||
      filePath.startsWith("https://") ||
      filePath.startsWith("blob:")
    ) {
      return;
    }

    const filename = path.basename(filePath);

    if (!filename) {
      return;
    }

    const uploadRoot = path.resolve(
      uploadDirectory
    );

    const targetFile = path.resolve(
      uploadDirectory,
      filename
    );

    /*
    |----------------------------------------------------------------------
    | PATH TRAVERSAL PROTECTION
    |----------------------------------------------------------------------
    */

    if (
      targetFile !== uploadRoot &&
      !targetFile.startsWith(
        `${uploadRoot}${path.sep}`
      )
    ) {
      return;
    }

    if (fs.existsSync(targetFile)) {
      fs.unlinkSync(targetFile);
    }
  } catch (error) {
    console.error(
      "DELETE FILE ERROR:",
      error
    );
  }
};

/*
|--------------------------------------------------------------------------
| GET OR CREATE SETTINGS
|--------------------------------------------------------------------------
*/

const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({});
  }

  /*
  |----------------------------------------------------------------------
  | ENSURE HOMEPAGE STRUCTURE
  |----------------------------------------------------------------------
  */

  if (!settings.homepage) {
    settings.homepage = {};
  }

  if (!settings.homepage.about) {
    settings.homepage.about = {};
  }

  return settings;
};

/*
|--------------------------------------------------------------------------
| UPDATE SIMPLE FIELD
|--------------------------------------------------------------------------
*/

const updateField = (
  settings,
  body,
  field
) => {
  if (hasProperty(body, field)) {
    settings[field] = body[field];
  }
};

/*
|--------------------------------------------------------------------------
| GET SETTINGS
|--------------------------------------------------------------------------
| GET /api/settings
|--------------------------------------------------------------------------
*/

const getSettings = async (
  req,
  res
) => {
  try {
    const settings =
      await getOrCreateSettings();

    return res.status(200).json({
      success: true,
      message:
        "Settings fetched successfully.",
      settings,
    });
  } catch (error) {
    console.error(
      "GET SETTINGS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch settings.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE SETTINGS
|--------------------------------------------------------------------------
| PUT /api/settings
|--------------------------------------------------------------------------
*/

const updateSettings = async (
  req,
  res
) => {
  try {
    const body = req.body || {};

    const settings =
      await getOrCreateSettings();

    /*
    |--------------------------------------------------------------------------
    | FOUNDATION INFORMATION
    |--------------------------------------------------------------------------
    */

    const foundationFields = [
      "foundationName",
      "description",
      "email",
      "phone",
      "address",
      "website",
    ];

    foundationFields.forEach(
      (field) => {
        updateField(
          settings,
          body,
          field
        );
      }
    );

    /*
    |--------------------------------------------------------------------------
    | SOCIAL MEDIA
    |--------------------------------------------------------------------------
    */

    const socialFields = [
      "facebook",
      "instagram",
      "twitter",
      "linkedin",
    ];

    socialFields.forEach(
      (field) => {
        updateField(
          settings,
          body,
          field
        );
      }
    );

    /*
    |--------------------------------------------------------------------------
    | HOMEPAGE
    |--------------------------------------------------------------------------
    */

    if (isObject(body.homepage)) {
      const homepage =
        body.homepage;

      /*
      |----------------------------------------------------------------------
      | ENSURE HOMEPAGE
      |----------------------------------------------------------------------
      */

      if (!settings.homepage) {
        settings.homepage = {};
      }

      /*
      |----------------------------------------------------------------------
      | HERO
      |----------------------------------------------------------------------
      */

      if (
        isObject(homepage.hero)
      ) {
        if (!settings.homepage.hero) {
          settings.homepage.hero = {};
        }

        const fields = [
          "eyebrow",
          "title",
          "description",
          "primaryButtonText",
          "secondaryButtonText",
          "image",
        ];

        fields.forEach((field) => {
          if (
            hasProperty(
              homepage.hero,
              field
            )
          ) {
            settings.homepage.hero[
              field
            ] =
              homepage.hero[field];
          }
        });
      }

      /*
      |----------------------------------------------------------------------
      | HOMEPAGE ABOUT
      |----------------------------------------------------------------------
      | IMPORTANT:
      | This is ONLY the About section on the homepage.
      |----------------------------------------------------------------------
      */

      if (
        isObject(homepage.about)
      ) {
        if (!settings.homepage.about) {
          settings.homepage.about = {};
        }

        const fields = [
          "eyebrow",
          "title",
          "description",
          "buttonText",
          "image",
        ];

        fields.forEach((field) => {
          if (
            hasProperty(
              homepage.about,
              field
            )
          ) {
            settings.homepage.about[
              field
            ] =
              homepage.about[field];
          }
        });
      }

      /*
      |----------------------------------------------------------------------
      | CAUSES
      |----------------------------------------------------------------------
      */

      if (
        isObject(homepage.causes)
      ) {
        if (
          !settings.homepage.causes
        ) {
          settings.homepage.causes =
            {};
        }

        const causeFields = [
          "eyebrow",
          "title",
          "description",
        ];

        causeFields.forEach(
          (field) => {
            if (
              hasProperty(
                homepage.causes,
                field
              )
            ) {
              settings.homepage.causes[
                field
              ] =
                homepage.causes[field];
            }
          }
        );

        if (
          Array.isArray(
            homepage.causes.items
          )
        ) {
          settings.homepage.causes.items =
            homepage.causes.items;
        }
      }

      /*
      |----------------------------------------------------------------------
      | FEATURED
      |----------------------------------------------------------------------
      */

      if (
        isObject(homepage.featured)
      ) {
        if (
          !settings.homepage.featured
        ) {
          settings.homepage.featured =
            {};
        }

        const fields = [
          "eyebrow",
          "title",
          "description",
          "buttonText",
          "image",
        ];

        fields.forEach((field) => {
          if (
            hasProperty(
              homepage.featured,
              field
            )
          ) {
            settings.homepage.featured[
              field
            ] =
              homepage.featured[field];
          }
        });
      }

      /*
      |----------------------------------------------------------------------
      | CTA
      |----------------------------------------------------------------------
      */

      if (
        isObject(homepage.cta)
      ) {
        if (!settings.homepage.cta) {
          settings.homepage.cta = {};
        }

        const fields = [
          "eyebrow",
          "title",
          "description",
          "buttonText",
          "image",
        ];

        fields.forEach((field) => {
          if (
            hasProperty(
              homepage.cta,
              field
            )
          ) {
            settings.homepage.cta[
              field
            ] =
              homepage.cta[field];
          }
        });
      }

      settings.markModified(
        "homepage"
      );
    }

    /*
    |--------------------------------------------------------------------------
    | DONATION SETTINGS
    |--------------------------------------------------------------------------
    */

    if (
      hasProperty(
        body,
        "donationEnabled"
      )
    ) {
      settings.donationEnabled =
        body.donationEnabled === true ||
        body.donationEnabled === "true";
    }

    if (
      hasProperty(
        body,
        "donationCurrency"
      )
    ) {
      settings.donationCurrency =
        String(
          body.donationCurrency || ""
        ).toUpperCase();
    }

    if (
      hasProperty(
        body,
        "minimumDonation"
      )
    ) {
      const minimum = Number(
        body.minimumDonation
      );

      if (
        Number.isNaN(minimum) ||
        minimum < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Minimum donation must be a valid number greater than or equal to 0.",
        });
      }

      settings.minimumDonation =
        minimum;
    }

    if (
      hasProperty(
        body,
        "maximumDonation"
      )
    ) {
      if (
        body.maximumDonation === null ||
        body.maximumDonation === ""
      ) {
        settings.maximumDonation =
          null;
      } else {
        const maximum = Number(
          body.maximumDonation
        );

        if (
          Number.isNaN(maximum) ||
          maximum < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Maximum donation must be a valid number greater than or equal to 0.",
          });
        }

        settings.maximumDonation =
          maximum;
      }
    }

    const minimum =
      Number(
        settings.minimumDonation || 0
      );

    const maximum =
      settings.maximumDonation;

    if (
      maximum !== null &&
      maximum !== undefined &&
      Number(maximum) < minimum
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Maximum donation cannot be less than minimum donation.",
      });
    }

    if (
      hasProperty(
        body,
        "donationMessage"
      )
    ) {
      settings.donationMessage =
        body.donationMessage;
    }

    /*
    |--------------------------------------------------------------------------
    | NOTIFICATIONS
    |--------------------------------------------------------------------------
    */

    const notificationFields = [
      "emailNotifications",
      "newDonationNotifications",
      "newContactNotifications",
      "newVolunteerNotifications",
      "adminNotifications",
    ];

    notificationFields.forEach(
      (field) => {
        if (
          hasProperty(
            body,
            field
          )
        ) {
          settings[field] =
            body[field] === true ||
            body[field] === "true";
        }
      }
    );

    /*
    |--------------------------------------------------------------------------
    | FOOTER
    |--------------------------------------------------------------------------
    */

    if (
      isObject(body.footer)
    ) {
      const footerFields = [
        "description",
        "copyrightText",
        "email",
        "phone",
        "address",
        "facebook",
        "instagram",
        "twitter",
        "linkedin",
      ];

      footerFields.forEach(
        (field) => {
          if (
            hasProperty(
              body.footer,
              field
            )
          ) {
            settings.footer[field] =
              body.footer[field];
          }
        }
      );

      settings.markModified(
        "footer"
      );
    }

    /*
    |--------------------------------------------------------------------------
    | APPEARANCE
    |--------------------------------------------------------------------------
    */

    const appearanceFields = [
      "darkMode",
      "compactSidebar",
    ];

    appearanceFields.forEach(
      (field) => {
        if (
          hasProperty(
            body,
            field
          )
        ) {
          settings[field] =
            body[field] === true ||
            body[field] === "true";
        }
      }
    );

    /*
    |--------------------------------------------------------------------------
    | SAVE
    |--------------------------------------------------------------------------
    */

    await settings.save();

    return res.status(200).json({
      success: true,
      message:
        "Settings updated successfully.",
      settings,
    });
  } catch (error) {
    console.error(
      "UPDATE SETTINGS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update settings.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/*
|--------------------------------------------------------------------------
| HOMEPAGE IMAGE UPLOAD
|--------------------------------------------------------------------------
| This handles:
|
| /hero-image
| /about-image
| /featured-image
| /cta-image
|--------------------------------------------------------------------------
*/

const uploadHomepageImage = async ({
  req,
  res,
  section,
  successMessage,
  errorMessage,
}) => {
  let newFilename = null;

  try {
    /*
    |--------------------------------------------------------------------------
    | CHECK FILE
    |--------------------------------------------------------------------------
    */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: `Please select a ${section} image.`,
      });
    }

    newFilename =
      req.file.filename;

    ensureUploadDirectory();

    /*
    |--------------------------------------------------------------------------
    | GET SETTINGS
    |--------------------------------------------------------------------------
    */

    const settings =
      await getOrCreateSettings();

    /*
    |--------------------------------------------------------------------------
    | ENSURE HOMEPAGE
    |--------------------------------------------------------------------------
    */

    if (!settings.homepage) {
      settings.homepage = {};
    }

    /*
    |--------------------------------------------------------------------------
    | ENSURE SECTION
    |--------------------------------------------------------------------------
    */

    if (
      !settings.homepage[section]
    ) {
      settings.homepage[section] =
        {};
    }

    /*
    |--------------------------------------------------------------------------
    | OLD IMAGE
    |--------------------------------------------------------------------------
    */

    const previousImage =
      settings.homepage[section]
        .image || "";

    /*
    |--------------------------------------------------------------------------
    | NEW IMAGE PATH
    |--------------------------------------------------------------------------
    */

    const imagePath =
      `/uploads/${req.file.filename}`;

    /*
    |--------------------------------------------------------------------------
    | SAVE IMAGE PATH
    |--------------------------------------------------------------------------
    */

    settings.homepage[section].image =
      imagePath;

    settings.markModified(
      `homepage.${section}`
    );

    await settings.save();

    /*
    |--------------------------------------------------------------------------
    | DATABASE SAVE SUCCEEDED
    |--------------------------------------------------------------------------
    */

    newFilename = null;

    /*
    |--------------------------------------------------------------------------
    | DELETE OLD LOCAL IMAGE
    |--------------------------------------------------------------------------
    */

    if (
      previousImage &&
      previousImage !== imagePath
    ) {
      deleteFile(previousImage);
    }

    return res.status(200).json({
      success: true,
      message: successMessage,
      image: imagePath,
      settings,
    });
  } catch (error) {
    /*
    |--------------------------------------------------------------------------
    | DELETE NEW FILE IF DATABASE SAVE FAILED
    |--------------------------------------------------------------------------
    */

    if (newFilename) {
      deleteFile(newFilename);
    }

    console.error(
      `${section.toUpperCase()} IMAGE UPLOAD ERROR:`,
      error
    );

    return res.status(500).json({
      success: false,
      message: errorMessage,
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/*
|--------------------------------------------------------------------------
| HOMEPAGE HERO IMAGE
|--------------------------------------------------------------------------
*/

const uploadHeroImage = (
  req,
  res
) => {
  return uploadHomepageImage({
    req,
    res,
    section: "hero",
    successMessage:
      "Hero image uploaded successfully.",
    errorMessage:
      "Failed to upload hero image.",
  });
};

/*
|--------------------------------------------------------------------------
| HOMEPAGE ABOUT IMAGE
|--------------------------------------------------------------------------
| THIS IS THE IMPORTANT ONE.
|
| It saves to:
|
| settings.homepage.about.image
|
| It does NOT touch About Us.
|--------------------------------------------------------------------------
*/

const uploadAboutImage = (
  req,
  res
) => {
  return uploadHomepageImage({
    req,
    res,

    section: "about",

    successMessage:
      "Homepage About image uploaded successfully.",

    errorMessage:
      "Failed to upload homepage About image.",
  });
};

/*
|--------------------------------------------------------------------------
| HOMEPAGE FEATURED IMAGE
|--------------------------------------------------------------------------
*/

const uploadFeaturedImage = (
  req,
  res
) => {
  return uploadHomepageImage({
    req,
    res,
    section: "featured",
    successMessage:
      "Featured image uploaded successfully.",
    errorMessage:
      "Failed to upload featured image.",
  });
};

/*
|--------------------------------------------------------------------------
| HOMEPAGE CTA IMAGE
|--------------------------------------------------------------------------
*/

const uploadCTAImage = (
  req,
  res
) => {
  return uploadHomepageImage({
    req,
    res,
    section: "cta",
    successMessage:
      "CTA image uploaded successfully.",
    errorMessage:
      "Failed to upload CTA image.",
  });
};

/*
|--------------------------------------------------------------------------
| HOMEPAGE CAUSE IMAGE
|--------------------------------------------------------------------------
*/

const uploadCausesImage = async (
  req,
  res
) => {
  let newFilename = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please select a cause image.",
      });
    }

    newFilename =
      req.file.filename;

    const causeIndex = Number(
      req.body?.causeIndex
    );

    if (
      !Number.isInteger(causeIndex) ||
      causeIndex < 0 ||
      causeIndex > 3
    ) {
      deleteFile(
        req.file.filename
      );

      newFilename = null;

      return res.status(400).json({
        success: false,
        message:
          "Cause index must be between 0 and 3.",
      });
    }

    ensureUploadDirectory();

    const settings =
      await getOrCreateSettings();

    if (!settings.homepage.causes) {
      settings.homepage.causes =
        {};
    }

    if (
      !Array.isArray(
        settings.homepage.causes.items
      )
    ) {
      settings.homepage.causes.items =
        [];
    }

    while (
      settings.homepage.causes.items
        .length <= causeIndex
    ) {
      settings.homepage.causes.items.push({
        title: "",
        text: "",
        image: "",
      });
    }

    const previousImage =
      settings.homepage.causes
        .items[causeIndex]
        ?.image || "";

    const imagePath =
      `/uploads/${req.file.filename}`;

    settings.homepage.causes.items[
      causeIndex
    ].image = imagePath;

    settings.markModified(
      "homepage.causes"
    );

    await settings.save();

    newFilename = null;

    if (
      previousImage &&
      previousImage !== imagePath
    ) {
      deleteFile(previousImage);
    }

    return res.status(200).json({
      success: true,
      message: `Cause ${
        causeIndex + 1
      } image uploaded successfully.`,
      image: imagePath,
      causeIndex,
      settings,
    });
  } catch (error) {
    if (newFilename) {
      deleteFile(newFilename);
    }

    console.error(
      "UPLOAD CAUSE IMAGE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to upload cause image.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/*
|--------------------------------------------------------------------------
| RESET SETTINGS
|--------------------------------------------------------------------------
*/

const resetSettings = async (
  req,
  res
) => {
  try {
    const settings =
      await Settings.findOne();

    if (!settings) {
      const newSettings =
        await Settings.create({});

      return res.status(200).json({
        success: true,
        message:
          "Settings have been reset successfully.",
        settings: newSettings,
      });
    }

    const images = [];

    /*
    |--------------------------------------------------------------------------
    | HOMEPAGE IMAGES ONLY
    |--------------------------------------------------------------------------
    */

    const homepageImages = [
      settings.homepage?.hero?.image,
      settings.homepage?.about?.image,
      settings.homepage?.featured?.image,
      settings.homepage?.cta?.image,
    ];

    homepageImages.forEach((image) => {
      if (image) {
        images.push(image);
      }
    });

    const causes =
      settings.homepage?.causes?.items ||
      [];

    causes.forEach((cause) => {
      if (cause?.image) {
        images.push(cause.image);
      }
    });

    const uniqueImages = [
      ...new Set(images),
    ];

    await Settings.deleteOne({
      _id: settings._id,
    });

    const newSettings =
      await Settings.create({});

    uniqueImages.forEach(
      (image) => {
        deleteFile(image);
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Settings have been reset successfully.",
      settings: newSettings,
    });
  } catch (error) {
    console.error(
      "RESET SETTINGS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to reset settings.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

module.exports = {
  getSettings,
  updateSettings,
  resetSettings,

  uploadHeroImage,
  uploadAboutImage,
  uploadFeaturedImage,
  uploadCTAImage,
  uploadCausesImage,
};