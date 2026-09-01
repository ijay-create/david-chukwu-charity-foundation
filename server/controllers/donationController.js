const crypto = require("crypto");

const Donation = require("../models/Donation");


// ========================================
// CREATE DONATION
// ========================================

const createDonation = async (req, res) => {
  try {
    const {
      donorName,
      email,
      amount,
      currency,
      paymentMethod,
      reference,
      status,
      notes
    } = req.body;

    if (
      !donorName ||
      !email ||
      !amount
    ) {
      return res.status(400).json({
        message:
          "Donor name, email and amount are required"
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        message:
          "Donation amount must be greater than zero"
      });
    }

    const donationReference =
      reference ||
      `DON-${Date.now()}-${crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase()}`;

    const donation =
      await Donation.create({
        donorName,
        email,
        amount: Number(amount),
        currency:
          currency || "GBP",
        paymentMethod:
          paymentMethod ||
          "Bank Transfer",
        reference:
          donationReference,
        status:
          status || "Pending",
        notes:
          notes || ""
      });

    return res.status(201).json({
      message:
        "Donation recorded successfully",
      donation
    });

  } catch (error) {

    console.error(
      "CREATE DONATION ERROR:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "Donation reference already exists"
      });
    }

    return res.status(500).json({
      message:
        "Failed to record donation"
    });
  }
};


// ========================================
// GET DONATIONS
// ========================================

const getDonations = async (req, res) => {
  try {

    const donations =
      await Donation.find()
        .sort({
          date: -1
        });

    return res.status(200).json(
      donations
    );

  } catch (error) {

    console.error(
      "GET DONATIONS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch donations"
    });
  }
};


// ========================================
// UPDATE DONATION
// ========================================

const updateDonation = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      status,
      notes
    } = req.body;

    const updateData = {};

    if (status !== undefined) {
      updateData.status = status;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const donation =
      await Donation.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );

    if (!donation) {
      return res.status(404).json({
        message:
          "Donation not found"
      });
    }

    return res.status(200).json({
      message:
        "Donation updated successfully",
      donation
    });

  } catch (error) {

    console.error(
      "UPDATE DONATION ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update donation"
    });
  }
};


module.exports = {
  createDonation,
  getDonations,
  updateDonation
};