const mongoose = require("mongoose");

const donationAccountSchema = new mongoose.Schema(
  {
    bank: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    number: {
      type: String,
      required: true,
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    /*
    |--------------------------------------------------------------------------
    | ACCOUNT SLOT
    |--------------------------------------------------------------------------
    |
    | 1 = Account 1
    | 2 = Account 2
    |
    */

    order: {
      type: Number,
      required: true,
      enum: [1, 2],
    },
  },
  {
    timestamps: true,
  }
);

/*
|--------------------------------------------------------------------------
| ONLY ONE ACCOUNT PER SLOT
|--------------------------------------------------------------------------
*/

donationAccountSchema.index(
  { order: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "DonationAccount",
  donationAccountSchema
);