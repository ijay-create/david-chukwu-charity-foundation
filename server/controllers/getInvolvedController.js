const GetInvolved = require("../models/GetInvolved");

/*
|--------------------------------------------------------------------------
| CREATE GET INVOLVED SUBMISSION
|--------------------------------------------------------------------------
*/

const createGetInvolved = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      involvement,
      message
    } = req.body;

    if (
      !name ||
      !email ||
      !involvement ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, involvement type and message are required."
      });
    }

    const submission = await GetInvolved.create({
      name,
      email,
      phone,
      involvement,
      message
    });

    return res.status(201).json({
      success: true,
      message:
        "Thank you for your interest. We will get back to you soon.",
      data: submission
    });

  } catch (error) {
    console.error(
      "CREATE GET INVOLVED ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to submit your request. Please try again."
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET ALL GET INVOLVED SUBMISSIONS
|--------------------------------------------------------------------------
*/

const getAllGetInvolved = async (req, res) => {
  try {
    const submissions =
      await GetInvolved.find()
        .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });

  } catch (error) {
    console.error(
      "GET GET INVOLVED ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve submissions."
    });
  }
};


module.exports = {
  createGetInvolved,
  getAllGetInvolved
};