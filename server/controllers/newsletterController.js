const {
  subscribeToNewsletter,
} = require("../services/mailerliteService");

/*
|--------------------------------------------------------------------------
| SUBSCRIBE NEWSLETTER
|--------------------------------------------------------------------------
*/

const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body || {};

    /*
    |--------------------------------------------------------------------------
    | REQUIRED EMAIL
    |--------------------------------------------------------------------------
    */

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | NORMALIZE EMAIL
    |--------------------------------------------------------------------------
    */

    const normalizedEmail = String(email)
      .trim()
      .toLowerCase();

    /*
    |--------------------------------------------------------------------------
    | EMAIL VALIDATION
    |--------------------------------------------------------------------------
    */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | MAILERLITE SUBSCRIPTION
    |--------------------------------------------------------------------------
    */

    const result =
      await subscribeToNewsletter(
        normalizedEmail
      );

    return res.status(200).json(result);

  } catch (error) {
    console.error(
      "Newsletter subscription error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to subscribe at the moment. Please try again.",
    });
  }
};

module.exports = {
  subscribeNewsletter,
};