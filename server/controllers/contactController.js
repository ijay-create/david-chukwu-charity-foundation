const ContactMessage = require("../models/ContactMessage");
const sendEmail = require("../utils/sendEmail");

/*
|--------------------------------------------------------------------------
| ESCAPE HTML
|--------------------------------------------------------------------------
| Prevent user-submitted values from being interpreted as HTML
| inside notification emails.
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
| CREATE CONTACT MESSAGE
|--------------------------------------------------------------------------
*/

const createContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and message are required.",
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

    const cleanSubject =
      subject?.trim() || "";

    const cleanMessage =
      message.trim();

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and message are required.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | SAVE CONTACT MESSAGE
    |--------------------------------------------------------------------------
    */

    const contact =
      await ContactMessage.create({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        subject: cleanSubject,
        message: cleanMessage,
        type: "contact",
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
            `New Contact Message - ${
              cleanSubject || "General Inquiry"
            }`,

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
                  New Contact Message
                </title>
              </head>

              <body
                style="
                  margin: 0;
                  padding: 0;
                  background: #f4f1ea;
                  font-family: Arial, Helvetica, sans-serif;
                  color: #333333;
                "
              >

                <div
                  style="
                    max-width: 650px;
                    margin: 30px auto;
                    background: #ffffff;
                  "
                >

                  <!-- HEADER -->

                  <div
                    style="
                      background: #132b46;
                      padding: 30px;
                      text-align: center;
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
                        font-size: 14px;
                      "
                    >
                      New Contact Message
                    </p>

                  </div>

                  <!-- CONTENT -->

                  <div
                    style="
                      padding: 30px;
                    "
                  >

                    <h2
                      style="
                        margin-top: 0;
                        color: #132b46;
                      "
                    >
                      New Contact Message
                    </h2>

                    <p
                      style="
                        line-height: 1.6;
                      "
                    >
                      A visitor has submitted a new
                      contact message through the
                      foundation website.
                    </p>

                    <hr
                      style="
                        border: none;
                        border-top: 1px solid #eeeeee;
                        margin: 25px 0;
                      "
                    />

                    <p>
                      <strong>Name:</strong>
                      ${escapeHtml(cleanName)}
                    </p>

                    <p>
                      <strong>Email:</strong>
                      ${escapeHtml(cleanEmail)}
                    </p>

                    <p>
                      <strong>Phone:</strong>
                      ${
                        escapeHtml(
                          cleanPhone || "Not provided"
                        )
                      }
                    </p>

                    <p>
                      <strong>Subject:</strong>
                      ${
                        escapeHtml(
                          cleanSubject || "General Inquiry"
                        )
                      }
                    </p>

                    <div
                      style="
                        margin-top: 25px;
                        padding: 20px;
                        background: #f8f8f8;
                        border-left: 4px solid #dca336;
                      "
                    >

                      <p
                        style="
                          margin-top: 0;
                          font-weight: bold;
                          color: #132b46;
                        "
                      >
                        Message
                      </p>

                      <p
                        style="
                          margin-bottom: 0;
                          line-height: 1.7;
                          white-space: pre-line;
                        "
                      >
                        ${escapeHtml(cleanMessage)}
                      </p>

                    </div>

                    <p
                      style="
                        margin-top: 30px;
                        color: #777777;
                        font-size: 13px;
                        line-height: 1.6;
                      "
                    >
                      This message was submitted through
                      the David Chukwu Charity Foundation
                      website.
                    </p>

                  </div>

                  <!-- FOOTER -->

                  <div
                    style="
                      padding: 20px 30px;
                      background: #132b46;
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
        "CONTACT EMAIL SENT:",
        emailSent
      );
    } catch (emailError) {
      console.error(
        "CONTACT EMAIL NOTIFICATION ERROR:",
        emailError.message
      );
    }

    /*
    |--------------------------------------------------------------------------
    | RESPONSE
    |--------------------------------------------------------------------------
    */

    return res.status(201).json({
      success: true,

      message:
        "Your message has been submitted successfully.",

      emailSent,

      contact,
    });
  } catch (error) {
    console.error(
      "CREATE CONTACT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to submit contact message.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET CONTACT MESSAGES
|--------------------------------------------------------------------------
*/

const getContacts = async (req, res) => {
  try {
    const messages =
      await ContactMessage.find({
        type: "contact",
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error(
      "GET CONTACTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch contact messages.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET VOLUNTEERS
|--------------------------------------------------------------------------
*/

const getVolunteers = async (req, res) => {
  try {
    const volunteers =
      await ContactMessage.find({
        type: "get-involved",
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: volunteers.length,
      volunteers,
    });
  } catch (error) {
    console.error(
      "GET VOLUNTEERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch volunteers.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE CONTACT STATUS
|--------------------------------------------------------------------------
*/

const updateContactStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Unread",
      "Read",
      "Replied",
      "Archived",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid message status.",
      });
    }

    const message =
      await ContactMessage.findByIdAndUpdate(
        id,
        {
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!message) {
      return res.status(404).json({
        success: false,
        message:
          "Message not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Message status updated successfully.",

      contact: message,
    });
  } catch (error) {
    console.error(
      "UPDATE CONTACT STATUS ERROR:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message:
          "Invalid contact message ID.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to update message status.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE CONTACT
|--------------------------------------------------------------------------
*/

const deleteContact = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const message =
      await ContactMessage.findByIdAndDelete(
        id
      );

    if (!message) {
      return res.status(404).json({
        success: false,
        message:
          "Message not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Message deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE CONTACT ERROR:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message:
          "Invalid contact message ID.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete message.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  createContact,
  getContacts,
  getVolunteers,
  updateContactStatus,
  deleteContact,
};