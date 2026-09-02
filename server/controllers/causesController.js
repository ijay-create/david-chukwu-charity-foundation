const Causes = require("../models/Causes");
const uploadToCloudinary = require("../utils/cloudinaryUpload");

// ========================================
// DEFAULT CAUSES
// ========================================

const defaultCauses = [
  {
    number: "01",
    title: "Widows Support & Empowerment",
    description:
      "Helping widows access practical support, resources and opportunities for greater independence.",
    imageUrl: "",
    order: 1,
  },

  {
    number: "02",
    title: "Orphanage Support & Child Welfare",
    description:
      "Supporting the well-being, education and development of vulnerable children.",
    imageUrl: "",
    order: 2,
  },

  {
    number: "03",
    title: "Special Needs Awareness & Support",
    description:
      "Supporting individuals with special needs through care, awareness and meaningful opportunities.",
    imageUrl: "",
    order: 3,
  },

  {
    number: "04",
    title: "Elderly People Care & Community Support",
    description:
      "Providing care and support that promotes dignity and well-being among elderly people.",
    imageUrl: "",
    order: 4,
  },

  {
    number: "05",
    title: "Community Outreach & Humanitarian Assistance",
    description:
      "Extending practical assistance to individuals and communities in need.",
    imageUrl: "",
    order: 5,
  },
];

// ========================================
// GET CAUSES
// ========================================

const getCauses = async (req, res) => {
  try {
    let causes = await Causes.findOne();

    // ------------------------------------
    // CREATE INITIAL DOCUMENT
    // ------------------------------------

    if (!causes) {
      causes = await Causes.create({
        hero: {
          title: "Our Causes",
          description:
            "Supporting people and communities where care is needed most.",
          imageUrl: "",
        },

        intro: {
          eyebrow: "WHAT WE CARE ABOUT",
          title: "Creating Change Where It Matters",
          description:
            "Our work focuses on providing care, support and opportunities to vulnerable individuals and communities.",
        },

        causes: defaultCauses,

        approach: {
          eyebrow: "OUR APPROACH",
          title: "Compassion in Action",
          description:
            "We work through care, empowerment, advocacy and community partnerships to create meaningful change.",
          imageUrl: "",
        },

        cta: {
          eyebrow: "MAKE A DIFFERENCE",
          title: "Be Part of the Change",
          description:
            "Your support can help us reach those who need it most.",
          donateText: "DONATE NOW",
          involvedText: "GET INVOLVED",
        },
      });
    }

    // ------------------------------------
    // RETURN DATA
    // ------------------------------------

    return res.status(200).json({
      success: true,
      causes,
    });
  } catch (error) {
    console.error(
      "GET CAUSES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch causes.",
    });
  }
};

// ========================================
// UPDATE CAUSES
// ========================================

const updateCauses = async (req, res) => {
  try {
    // ------------------------------------
    // FIND EXISTING DOCUMENT
    // ------------------------------------

    let causes = await Causes.findOne();

    // ------------------------------------
    // CREATE IF NOT EXISTS
    // ------------------------------------

    if (!causes) {
      causes = new Causes();
    }

    // ====================================
    // TEXT DATA
    // ====================================

    if (req.body.hero) {
      causes.hero = JSON.parse(
        req.body.hero
      );
    }

    if (req.body.intro) {
      causes.intro = JSON.parse(
        req.body.intro
      );
    }

    if (req.body.causes) {
      causes.causes = JSON.parse(
        req.body.causes
      );
    }

    if (req.body.approach) {
      causes.approach = JSON.parse(
        req.body.approach
      );
    }

    if (req.body.cta) {
      causes.cta = JSON.parse(
        req.body.cta
      );
    }

    // ====================================
    // HERO IMAGE
    // ====================================

    if (req.files?.heroImage?.[0]) {
      const heroFile =
        req.files.heroImage[0];

      const cloudinaryResult =
        await uploadToCloudinary(
          heroFile.buffer,
          {
            folder:
              "david-chukwu-charity-foundation/causes/hero",
          }
        );

      if (
        !cloudinaryResult?.secure_url
      ) {
        throw new Error(
          "Cloudinary did not return a Causes Hero image URL."
        );
      }

      causes.hero.imageUrl =
        cloudinaryResult.secure_url;
    }

    // ====================================
    // APPROACH IMAGE
    // ====================================

    console.log(
      "APPROACH FILE:",
      req.files?.approachImage?.[0]
    );

    if (req.files?.approachImage?.[0]) {
      const approachFile =
        req.files.approachImage[0];

      const cloudinaryResult =
        await uploadToCloudinary(
          approachFile.buffer,
          {
            folder:
              "david-chukwu-charity-foundation/causes/approach",
          }
        );

      if (
        !cloudinaryResult?.secure_url
      ) {
        throw new Error(
          "Cloudinary did not return a Causes Approach image URL."
        );
      }

      causes.approach.imageUrl =
        cloudinaryResult.secure_url;
    }

    // ====================================
    // CAUSE IMAGES
    // ====================================

    if (req.files) {
      const causeImageFields =
        Object.keys(req.files).filter(
          (fieldName) =>
            fieldName.startsWith(
              "causeImage_"
            )
        );

      for (
        const fieldName of causeImageFields
      ) {
        // --------------------------------
        // EXTRACT INDEX
        // --------------------------------

        const index = Number(
          fieldName.replace(
            "causeImage_",
            ""
          )
        );

        // --------------------------------
        // VALIDATE INDEX
        // --------------------------------

        if (
          Number.isNaN(index)
        ) {
          continue;
        }

        // --------------------------------
        // GET UPLOADED FILE
        // --------------------------------

        const file =
          req.files[fieldName]?.[0];

        if (!file) {
          continue;
        }

        // --------------------------------
        // MAKE SURE CAUSE EXISTS
        // --------------------------------

        if (
          !causes.causes ||
          !causes.causes[index]
        ) {
          continue;
        }

        // --------------------------------
        // UPLOAD TO CLOUDINARY
        // --------------------------------

        const cloudinaryResult =
          await uploadToCloudinary(
            file.buffer,
            {
              folder:
                "david-chukwu-charity-foundation/causes/items",

              publicId:
                `cause-${index + 1}`,
            }
          );

        if (
          !cloudinaryResult?.secure_url
        ) {
          throw new Error(
            `Cloudinary did not return a URL for cause image ${index + 1}.`
          );
        }

        // --------------------------------
        // SAVE CLOUDINARY URL
        // --------------------------------

        causes.causes[index].imageUrl =
          cloudinaryResult.secure_url;
      }
    }

    // ====================================
    // NORMALIZE CAUSE ORDER
    // ====================================

    if (
      Array.isArray(causes.causes)
    ) {
      causes.causes =
        causes.causes.map(
          (cause, index) => ({
            ...cause,

            number:
              cause.number ||
              String(index + 1).padStart(
                2,
                "0"
              ),

            order:
              cause.order ||
              index + 1,
          })
        );
    }

    // ====================================
    // SAVE DATABASE
    // ====================================

    await causes.save();

    // ====================================
    // RETURN UPDATED DATA
    // ====================================

    return res.status(200).json({
      success: true,
      message:
        "Causes updated successfully.",
      causes,
    });
  } catch (error) {
    console.error(
      "UPDATE CAUSES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update causes.",
    });
  }
};

// ========================================
// EXPORT
// ========================================

module.exports = {
  getCauses,
  updateCauses,
};