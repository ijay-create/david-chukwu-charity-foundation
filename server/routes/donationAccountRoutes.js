const express = require("express");

const {
  getDonationAccounts,
  getAllDonationAccounts,
  createDonationAccount,
  updateDonationAccount,
  deleteDonationAccount,
} = require("../controllers/donationAccountController");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
|
| GET /api/donation-accounts
|
| Returns active Account 1 and Account 2.
|
*/

router.get(
  "/",
  getDonationAccounts
);

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
|
| GET /api/donation-accounts/all
|
*/

router.get(
  "/all",
  getAllDonationAccounts
);

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
|
| POST /api/donation-accounts
|
*/

router.post(
  "/",
  createDonationAccount
);

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
|
| PUT /api/donation-accounts/:id
|
*/

router.put(
  "/:id",
  updateDonationAccount
);

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
|
| DELETE /api/donation-accounts/:id
|
*/

router.delete(
  "/:id",
  deleteDonationAccount
);

module.exports = router;