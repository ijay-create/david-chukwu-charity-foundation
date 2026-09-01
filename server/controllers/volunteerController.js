const Volunteer = require("../models/Volunteer");


/*
|--------------------------------------------------------------------------
| GET ALL VOLUNTEERS
|--------------------------------------------------------------------------
*/

const getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find()
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      data: volunteers,
    });
  } catch (error) {
    console.error(
      "GET VOLUNTEERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve volunteers.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET SINGLE VOLUNTEER
|--------------------------------------------------------------------------
*/

const getVolunteer = async (req, res) => {
  try {
    const volunteer =
      await Volunteer.findById(
        req.params.id
      );

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message:
          "Volunteer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: volunteer,
    });
  } catch (error) {
    console.error(
      "GET VOLUNTEER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve volunteer.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| CREATE VOLUNTEER
|--------------------------------------------------------------------------
*/

const createVolunteer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      location,
      interests,
      availability,
      message,
    } = req.body;


    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone
    ) {
      return res.status(400).json({
        success: false,
        message:
          "First name, last name, email and phone are required.",
      });
    }


    const existingVolunteer =
      await Volunteer.findOne({
        email:
          email.trim().toLowerCase(),
      });


    if (existingVolunteer) {
      return res.status(409).json({
        success: false,
        message:
          "A volunteer application with this email already exists.",
      });
    }


    const volunteer =
      await Volunteer.create({
        firstName:
          firstName.trim(),

        lastName:
          lastName.trim(),

        email:
          email.trim().toLowerCase(),

        phone:
          phone.trim(),

        location:
          location?.trim() || "",

        interests:
          Array.isArray(interests)
            ? interests
            : [],

        availability:
          availability?.trim() || "",

        message:
          message?.trim() || "",

        status: "pending",
      });


    return res.status(201).json({
      success: true,
      message:
        "Volunteer application submitted successfully.",
      data: volunteer,
    });
  } catch (error) {
    console.error(
      "CREATE VOLUNTEER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to submit volunteer application.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE VOLUNTEER
|--------------------------------------------------------------------------
*/

const updateVolunteer = async (req, res) => {
  try {
    const volunteer =
      await Volunteer.findById(
        req.params.id
      );

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message:
          "Volunteer not found.",
      });
    }


    const {
      firstName,
      lastName,
      email,
      phone,
      location,
      interests,
      availability,
      message,
      status,
      notes,
    } = req.body;


    if (firstName !== undefined) {
      volunteer.firstName =
        firstName.trim();
    }

    if (lastName !== undefined) {
      volunteer.lastName =
        lastName.trim();
    }

    if (email !== undefined) {
      volunteer.email =
        email.trim().toLowerCase();
    }

    if (phone !== undefined) {
      volunteer.phone =
        phone.trim();
    }

    if (location !== undefined) {
      volunteer.location =
        location.trim();
    }

    if (interests !== undefined) {
      volunteer.interests =
        Array.isArray(interests)
          ? interests
          : [];
    }

    if (availability !== undefined) {
      volunteer.availability =
        availability.trim();
    }

    if (message !== undefined) {
      volunteer.message =
        message.trim();
    }

    if (status !== undefined) {
      volunteer.status =
        status;
    }

    if (notes !== undefined) {
      volunteer.notes =
        notes.trim();
    }


    await volunteer.save();


    return res.status(200).json({
      success: true,
      message:
        "Volunteer updated successfully.",
      data: volunteer,
    });
  } catch (error) {
    console.error(
      "UPDATE VOLUNTEER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update volunteer.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| DELETE VOLUNTEER
|--------------------------------------------------------------------------
*/

const deleteVolunteer = async (req, res) => {
  try {
    const volunteer =
      await Volunteer.findByIdAndDelete(
        req.params.id
      );

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message:
          "Volunteer not found.",
      });
    }


    return res.status(200).json({
      success: true,
      message:
        "Volunteer deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE VOLUNTEER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete volunteer.",
    });
  }
};


module.exports = {
  getVolunteers,
  getVolunteer,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
};