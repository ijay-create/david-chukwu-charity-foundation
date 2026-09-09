const axios = require("axios");

/*
|--------------------------------------------------------------------------
| BREVO CONTACTS API CONFIGURATION
|--------------------------------------------------------------------------
*/

const BREVO_API_URL =
  "https://api.brevo.com/v3/contacts";

/*
|--------------------------------------------------------------------------
| BREVO HEADERS
|--------------------------------------------------------------------------
*/

const getHeaders = () => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error(
      "BREVO_API_KEY is not configured."
    );
  }

  return {
    "api-key": process.env.BREVO_API_KEY,
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
  const listId = process.env.BREVO_NEWSLETTER_LIST_ID;

  if (!listId) {
    throw new Error(
      "BREVO_NEWSLETTER_LIST_ID is not configured."
    );
  }

  try {
    /*
    |--------------------------------------------------------------------------
    | CREATE / UPDATE BREVO CONTACT
    |--------------------------------------------------------------------------
    */

    const response = await axios.post(
      BREVO_API_URL,
      {
        email,

        listIds: [
          Number(listId),
        ],

        updateEnabled: true,
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
    const status =
      error.response?.status;

    const errorData =
      error.response?.data;

    console.error(
      "BREVO NEWSLETTER SUBSCRIPTION ERROR:",
      errorData || error.message
    );

    /*
    |--------------------------------------------------------------------------
    | ALREADY SUBSCRIBED
    |--------------------------------------------------------------------------
    |
    | Brevo may return a conflict when the contact already exists.
    | Because updateEnabled is true, existing contacts can be updated
    | and associated with the newsletter list.
    |--------------------------------------------------------------------------
    */

    if (status === 409) {
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