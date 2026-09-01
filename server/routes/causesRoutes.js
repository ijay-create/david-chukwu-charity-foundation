const express = require("express");

const router =
  express.Router();

const {
  getCauses,
  updateCauses
} =
  require("../controllers/causesController");

const causesUpload =
  require("../middleware/causesUpload");


// ========================================
// GET CAUSES
// ========================================

router.get(
  "/",
  getCauses
);


// ========================================
// UPDATE CAUSES
// ========================================

router.put(
  "/",
  causesUpload.fields([

    {
      name: "heroImage",
      maxCount: 1
    },

    {
      name: "approachImage",
      maxCount: 1
    },

    {
      name: "causeImage_0",
      maxCount: 1
    },

    {
      name: "causeImage_1",
      maxCount: 1
    },

    {
      name: "causeImage_2",
      maxCount: 1
    },

    {
      name: "causeImage_3",
      maxCount: 1
    },

    {
      name: "causeImage_4",
      maxCount: 1
    },

    {
      name: "causeImage_5",
      maxCount: 1
    },

    {
      name: "causeImage_6",
      maxCount: 1
    },

    {
      name: "causeImage_7",
      maxCount: 1
    },

    {
      name: "causeImage_8",
      maxCount: 1
    },

    {
      name: "causeImage_9",
      maxCount: 1
    }

  ]),
  updateCauses
);


module.exports = router;