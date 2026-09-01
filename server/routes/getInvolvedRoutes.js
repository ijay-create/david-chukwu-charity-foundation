const express = require("express");

const {
  createGetInvolved,
  getAllGetInvolved
} = require("../controllers/getInvolvedController");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  createGetInvolved
);


/*
|--------------------------------------------------------------------------
| GET ALL SUBMISSIONS
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  getAllGetInvolved
);


module.exports = router;