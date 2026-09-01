const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    currency: {
      type: String,
      default: "GBP",
      uppercase: true,
      trim: true
    },

    paymentMethod: {
      type: String,
      default: "Bank Transfer",
      trim: true
    },

    reference: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Completed",
        "Failed"
      ],
      default: "Pending"
    },

    notes: {
      type: String,
      trim: true,
      default: ""
    },

    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Donation",
  donationSchema
);