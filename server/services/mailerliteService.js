const axios = require("axios");

/*
|--------------------------------------------------------------------------
| MAILERLITE CONFIGURATION
|--------------------------------------------------------------------------
*/

const MAILERLITE_API_URL =
  "https://connect.mailerlite.com/api";

const getHeaders = () => {
  if (!process.env.MAILERLITE_API_TOKEN) {
    throw new Error(
      "MAILERLITE_API_TOKEN is not configured."
    );
  }

  return {
    Authorization: `Bearer ${process.env.MAILERLITE_API_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
};

/*
|--------------------------------------------------------------------------
| SUBSCRIBE TO NEWSLETTER
|--------------------------------------------------------------------------
*/

const subscribeToNewsletter = async (email) => {
  const groupId = process.env.MAILERLITE_GROUP_ID;

  if (!groupId) {
    throw new Error(
      "MAILERLITE_GROUP_ID is not configured."
    );
  }

  try {
    /*
    |--------------------------------------------------------------------------
    | CREATE SUBSCRIBER
    |--------------------------------------------------------------------------
    */

    const response = await axios.post(
      `${MAILERLITE_API_URL}/subscribers`,
      {
        email,
        groups: [String(groupId)],
      },
      {
        headers: getHeaders(),
      }
    );

    return {
      success: true,
      message:
        "You have successfully subscribed to our newsletter!",
      data: response.data,
    };
  } catch (error) {
    const status = error.response?.status;

    const errorData =
      error.response?.data;

    console.error(
      "MAILERLITE SUBSCRIPTION ERROR:",
      errorData || error.message
    );

    /*
    |--------------------------------------------------------------------------
    | ALREADY SUBSCRIBED
    |--------------------------------------------------------------------------
    */

    if (
      status === 422 ||
      errorData?.message
        ?.toLowerCase()
        ?.includes("already")
    ) {
      return {
        success: true,
        message:
          "You're already subscribed to our newsletter.",
      };
    }

    throw error;
  }
};

module.exports = {
  subscribeToNewsletter,
};