const GetInvolved = require("../models/GetInvolved");
const sendEmail = require("../utils/sendEmail");

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
      message,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    if (
      !name ||
      !email ||
      !involvement ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, involvement type and message are required.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | SAVE SUBMISSION TO MONGODB
    |--------------------------------------------------------------------------
    */

    const submission =
      await GetInvolved.create({
        name,
        email,
        phone,
        involvement,
        message,
      });

    /*
    |--------------------------------------------------------------------------
    | SEND EMAIL NOTIFICATION
    |--------------------------------------------------------------------------
    |
    | The MongoDB submission is already saved before
    | attempting to send the email.
    |
    | Therefore, if email sending fails, the user's
    | submission is NOT lost.
    |
    |--------------------------------------------------------------------------
    */

    let emailSent = false;

    try {
      const emailResult =
        await sendEmail({
          to: process.env.MAIL_TO,

          subject:
            `New Get Involved Submission - ${involvement}`,

          html: `
            <!DOCTYPE html>

            <html>
              <head>
                <meta charset="UTF-8" />

                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1.0"
                />

                <title>
                  New Get Involved Submission
                </title>
              </head>

              <body
                style="
                  margin: 0;
                  padding: 0;
                  background-color: #f4f1ea;
                  font-family: Arial, Helvetica, sans-serif;
                  color: #333333;
                "
              >

                <div
                  style="
                    max-width: 700px;
                    margin: 30px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                  "
                >

                  <!-- HEADER -->

                  <div
                    style="
                      background-color: #132b46;
                      padding: 25px 30px;
                    "
                  >

                    <h1
                      style="
                        margin: 0;
                        color: #ffffff;
                        font-size: 24px;
                      "
                    >
                      David Chukwu Charity Foundation
                    </h1>

                    <p
                      style="
                        margin: 8px 0 0;
                        color: #dca336;
                        font-size: 15px;
                      "
                    >
                      New Get Involved Submission
                    </p>

                  </div>


                  <!-- CONTENT -->

                  <div
                    style="
                      padding: 30px;
                    "
                  >

                    <p
                      style="
                        margin-top: 0;
                        font-size: 16px;
                        line-height: 1.6;
                      "
                    >
                      A new Get Involved form has been
                      submitted through the foundation
                      website.
                    </p>


                    <!-- SUBMISSION DETAILS -->

                    <div
                      style="
                        margin-top: 25px;
                        padding: 20px;
                        background-color: #f4f1ea;
                        border-left: 4px solid #dca336;
                      "
                    >

                      <p
                        style="
                          margin: 0 0 12px;
                        "
                      >
                        <strong>
                          Name:
                        </strong>

                        ${name}
                      </p>


                      <p
                        style="
                          margin: 0 0 12px;
                        "
                      >
                        <strong>
                          Email:
                        </strong>

                        ${email}
                      </p>


                      <p
                        style="
                          margin: 0 0 12px;
                        "
                      >
                        <strong>
                          Phone:
                        </strong>

                        ${
                          phone ||
                          "Not provided"
                        }
                      </p>


                      <p
                        style="
                          margin: 0 0 12px;
                        "
                      >
                        <strong>
                          Involvement:
                        </strong>

                        ${involvement}
                      </p>


                      <p
                        style="
                          margin: 0 0 8px;
                        "
                      >
                        <strong>
                          Message:
                        </strong>
                      </p>


                      <p
                        style="
                          margin: 0;
                          line-height: 1.6;
                          white-space: pre-line;
                        "
                      >
                        ${message}
                      </p>

                    </div>


                    <!-- FOOTER MESSAGE -->

                    <p
                      style="
                        margin: 25px 0 0;
                        color: #666666;
                        font-size: 14px;
                        line-height: 1.6;
                      "
                    >
                      This submission has also been
                      successfully saved to the
                      foundation database.
                    </p>

                  </div>


                  <!-- FOOTER -->

                  <div
                    style="
                      padding: 20px 30px;
                      background-color: #132b46;
                      text-align: center;
                    "
                  >

                    <p
                      style="
                        margin: 0;
                        color: #ffffff;
                        font-size: 13px;
                      "
                    >
                      David Chukwu Charity Foundation
                    </p>

                    <p
                      style="
                        margin: 6px 0 0;
                        color: #dca336;
                        font-size: 12px;
                      "
                    >
                      https://davidchukwu.org
                    </p>

                  </div>

                </div>

              </body>
            </html>
          `,
        });

      /*
      |--------------------------------------------------------------------------
      | CONFIRM EMAIL WAS SENT
      |--------------------------------------------------------------------------
      */

      emailSent =
        emailResult?.success === true;

    } catch (emailError) {
      /*
      |--------------------------------------------------------------------------
      | EMAIL ERROR
      |--------------------------------------------------------------------------
      |
      | Do NOT return a 500 error here because the
      | MongoDB submission was already successfully
      | created.
      |
      |--------------------------------------------------------------------------
      */

      console.error(
        "GET INVOLVED EMAIL ERROR:",
        emailError
      );
    }

    /*
    |--------------------------------------------------------------------------
    | SUCCESS RESPONSE
    |--------------------------------------------------------------------------
    */

    return res.status(201).json({
      success: true,

      message:
        "Thank you for your interest. We will get back to you soon.",

      emailSent,

      data: submission,
    });

  } catch (error) {
    /*
    |--------------------------------------------------------------------------
    | DATABASE / SERVER ERROR
    |--------------------------------------------------------------------------
    */

    console.error(
      "CREATE GET INVOLVED ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to submit your request. Please try again.",
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
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,

      count:
        submissions.length,

      data:
        submissions,
    });

  } catch (error) {
    console.error(
      "GET GET INVOLVED ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to retrieve submissions.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| EXPORT CONTROLLERS
|--------------------------------------------------------------------------
*/

module.exports = {
  createGetInvolved,
  getAllGetInvolved,
};