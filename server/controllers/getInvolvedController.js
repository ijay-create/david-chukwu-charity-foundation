const GetInvolved = require("../models/GetInvolved");
const sendEmail = require("../utils/sendEmail");

/*
|--------------------------------------------------------------------------
| ESCAPE HTML
|--------------------------------------------------------------------------
*/

const escapeHtml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/*
|--------------------------------------------------------------------------
| CREATE GET INVOLVED SUBMISSION
|--------------------------------------------------------------------------
*/

const createGetInvolved = async (
  req,
  res
) => {
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
    | CLEAN INPUT
    |--------------------------------------------------------------------------
    */

    const cleanName = name.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanPhone =
      phone?.trim() || "";

    const cleanInvolvement =
      involvement.trim();

    const cleanMessage =
      message.trim();

    if (
      !cleanName ||
      !cleanEmail ||
      !cleanInvolvement ||
      !cleanMessage
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
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        involvement: cleanInvolvement,
        message: cleanMessage,
      });

    /*
    |--------------------------------------------------------------------------
    | SEND EMAIL NOTIFICATION
    |--------------------------------------------------------------------------
    */

    let emailSent = false;

    try {
      const emailResult =
        await sendEmail({
          to: process.env.MAIL_TO,

          replyTo: cleanEmail,

          subject:
            `New Get Involved Submission - ${cleanInvolvement}`,

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
                    box-shadow:
                      0 2px 10px
                      rgba(0,0,0,0.08);
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
                        <strong>Name:</strong>
                        ${escapeHtml(cleanName)}
                      </p>

                      <p
                        style="
                          margin: 0 0 12px;
                        "
                      >
                        <strong>Email:</strong>
                        ${escapeHtml(cleanEmail)}
                      </p>

                      <p
                        style="
                          margin: 0 0 12px;
                        "
                      >
                        <strong>Phone:</strong>
                        ${
                          escapeHtml(
                            cleanPhone ||
                            "Not provided"
                          )
                        }
                      </p>

                      <p
                        style="
                          margin: 0 0 12px;
                        "
                      >
                        <strong>Involvement:</strong>
                        ${escapeHtml(
                          cleanInvolvement
                        )}
                      </p>

                      <p
                        style="
                          margin: 0 0 8px;
                        "
                      >
                        <strong>Message:</strong>
                      </p>

                      <p
                        style="
                          margin: 0;
                          line-height: 1.6;
                          white-space: pre-line;
                        "
                      >
                        ${escapeHtml(
                          cleanMessage
                        )}
                      </p>

                    </div>

                    <p
                      style="
                        margin: 25px 0 0;
                        color: #666666;
                        font-size: 14px;
                        line-height: 1.6;
                      "
                    >
                      This submission has also been
                      successfully saved to the foundation
                      database.
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
                      davidchukwucharityfoundation.org
                    </p>

                  </div>

                </div>

              </body>
            </html>
          `,
        });

      emailSent =
        emailResult?.success === true;

      console.log(
        "GET INVOLVED EMAIL SENT:",
        emailSent
      );
    } catch (emailError) {
      console.error(
        "GET INVOLVED EMAIL ERROR:",
        emailError.message
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

const getAllGetInvolved = async (
  req,
  res
) => {
  try {
    const submissions =
      await GetInvolved.find()
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
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
| UPDATE GET INVOLVED STATUS
|--------------------------------------------------------------------------
*/

const updateGetInvolvedStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "New",
      "Contacted",
      "Resolved",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed values are New, Contacted and Resolved.",
      });
    }

    const submission =
      await GetInvolved.findByIdAndUpdate(
        id,
        {
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message:
          "Get Involved submission not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Get Involved submission status updated successfully.",

      data: submission,
    });
  } catch (error) {
    console.error(
      "UPDATE GET INVOLVED STATUS ERROR:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message:
          "Invalid Get Involved submission ID.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to update submission status.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE GET INVOLVED SUBMISSION
|--------------------------------------------------------------------------
*/

const deleteGetInvolved = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const submission =
      await GetInvolved.findByIdAndDelete(
        id
      );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message:
          "Get Involved submission not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Get Involved submission deleted successfully.",

      data: submission,
    });
  } catch (error) {
    console.error(
      "DELETE GET INVOLVED ERROR:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message:
          "Invalid Get Involved submission ID.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete submission.",
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
  updateGetInvolvedStatus,
  deleteGetInvolved,
};