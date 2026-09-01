const express = require("express");

const router =
  express.Router();


const {
  getImpact,
  updateImpact
} =
  require("../controllers/impactController");


const impactUpload =
  require("../middleware/impactUpload");


// ========================================
// GET IMPACT
// ========================================

router.get(
  "/",
  getImpact
);


// ========================================
// UPDATE IMPACT
// ========================================

router.put(
  "/",

  impactUpload.fields([

    // ------------------------------------
    // HERO
    // ------------------------------------

    {
      name: "heroImage",
      maxCount: 1
    },


    // ------------------------------------
    // PROJECT IMAGES
    // ------------------------------------

    {
      name: "projectImage_0",
      maxCount: 1
    },

    {
      name: "projectImage_1",
      maxCount: 1
    },

    {
      name: "projectImage_2",
      maxCount: 1
    },

    {
      name: "projectImage_3",
      maxCount: 1
    },

    {
      name: "projectImage_4",
      maxCount: 1
    },

    {
      name: "projectImage_5",
      maxCount: 1
    },

    {
      name: "projectImage_6",
      maxCount: 1
    },

    {
      name: "projectImage_7",
      maxCount: 1
    },

    {
      name: "projectImage_8",
      maxCount: 1
    },

    {
      name: "projectImage_9",
      maxCount: 1
    },


    // ------------------------------------
    // GALLERY IMAGES
    // ------------------------------------

    {
      name: "galleryImage_0",
      maxCount: 1
    },

    {
      name: "galleryImage_1",
      maxCount: 1
    },

    {
      name: "galleryImage_2",
      maxCount: 1
    },

    {
      name: "galleryImage_3",
      maxCount: 1
    },

    {
      name: "galleryImage_4",
      maxCount: 1
    },

    {
      name: "galleryImage_5",
      maxCount: 1
    },

    {
      name: "galleryImage_6",
      maxCount: 1
    },

    {
      name: "galleryImage_7",
      maxCount: 1
    },

    {
      name: "galleryImage_8",
      maxCount: 1
    },

    {
      name: "galleryImage_9",
      maxCount: 1
    },

    {
      name: "galleryImage_10",
      maxCount: 1
    },

    {
      name: "galleryImage_11",
      maxCount: 1
    },

    {
      name: "galleryImage_12",
      maxCount: 1
    },

    {
      name: "galleryImage_13",
      maxCount: 1
    },

    {
      name: "galleryImage_14",
      maxCount: 1
    },

    {
      name: "galleryImage_15",
      maxCount: 1
    },

    {
      name: "galleryImage_16",
      maxCount: 1
    },

    {
      name: "galleryImage_17",
      maxCount: 1
    },

    {
      name: "galleryImage_18",
      maxCount: 1
    },

    {
      name: "galleryImage_19",
      maxCount: 1
    },


    // ------------------------------------
    // TESTIMONIAL IMAGES
    // ------------------------------------

    {
      name: "testimonialImage_0",
      maxCount: 1
    },

    {
      name: "testimonialImage_1",
      maxCount: 1
    },

    {
      name: "testimonialImage_2",
      maxCount: 1
    },

    {
      name: "testimonialImage_3",
      maxCount: 1
    },

    {
      name: "testimonialImage_4",
      maxCount: 1
    },

    {
      name: "testimonialImage_5",
      maxCount: 1
    },

    {
      name: "testimonialImage_6",
      maxCount: 1
    },

    {
      name: "testimonialImage_7",
      maxCount: 1
    },

    {
      name: "testimonialImage_8",
      maxCount: 1
    },

    {
      name: "testimonialImage_9",
      maxCount: 1
    }

  ]),

  updateImpact

);


module.exports = router;