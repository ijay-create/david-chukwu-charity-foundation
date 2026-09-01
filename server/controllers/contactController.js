const ContactMessage = require("../models/ContactMessage");
const sendEmail = require("../utils/sendEmail");

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
      message
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required"
      });
    }

    /*
    |--------------------------------------------------------------------------
    | SAVE CONTACT MESSAGE TO MONGODB
    |--------------------------------------------------------------------------
    */

    const contact = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      subject: subject?.trim() || "",
      message: message.trim(),
      type: "contact"
    });

    /*
    |--------------------------------------------------------------------------
    | SEND EMAIL NOTIFICATION
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    | If email fails, the MongoDB record is NOT lost.
    |
    */

    let emailSent = false;

    try {
      const emailResult = await sendEmail({
        to: process.env.MAIL_TO,

        subject: `New Contact Message - ${
          subject || "General Inquiry"
        }`,

        html: `
          <!DOCTYPE html>

          <html>
            <body style="
              margin: 0;
              padding: 0;
              background: #f4f1ea;
              font-family: Arial, Helvetica, sans-serif;
              color: #333333;
            ">

              <div style="
                max-width: 650px;
                margin: 30px auto;
                background: #ffffff;
              ">

                <!-- HEADER -->

                <div style="
                  background: #132b46;
                  padding: 30px;
                  text-align: center;
                ">

                  <h1 style="
                    margin: 0;
                    color: #ffffff;
                    font-size: 24px;
                  ">
                    David Chukwu Charity Foundation
                  </h1>

                  <p style="
                    margin: 8px 0 0;
                    color: #dca336;
                    font-size: 14px;
                  ">
                    New Contact Message
                  </p>

                </div>

                <!-- CONTENT -->

                <div style="
                  padding: 30px;
                ">

                  <h2 style="
                    margin-top: 0;
                    color: #132b46;
                  ">
                    New Contact Message
                  </h2>

                  <p>
                    A visitor has submitted a new contact
                    message through the foundation website.
                  </p>

                  <hr style="
                    border: none;
                    border-top: 1px solid #eeeeee;
                    margin: 25px 0;
                  " />

                  <p>
                    <strong>Name:</strong>
                    ${name}
                  </p>

                  <p>
                    <strong>Email:</strong>
                    ${email}
                  </p>

                  <p>
                    <strong>Phone:</strong>
                    ${phone || "Not provided"}
                  </p>

                  <p>
                    <strong>Subject:</strong>
                    ${subject || "General Inquiry"}
                  </p>

                  <div style="
                    margin-top: 25px;
                    padding: 20px;
                    background: #f8f8f8;
                    border-left: 4px solid #dca336;
                  ">

                    <p style="
                      margin-top: 0;
                      font-weight: bold;
                      color: #132b46;
                    ">
                      Message
                    </p>

                    <p style="
                      margin-bottom: 0;
                      line-height: 1.7;
                    ">
                      ${message}
                    </p>

                  </div>

                  <p style="
                    margin-top: 30px;
                    color: #777777;
                    font-size: 13px;
                  ">
                    This message was submitted through the
                    David Chukwu Charity Foundation website.
                  </p>

                </div>

              </div>

            </body>
          </html>
        `
      });

      emailSent = emailResult?.success === true;

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
        "Your message has been submitted successfully",

      emailSent,

      contact
    });

  } catch (error) {
    console.error(
      "CREATE CONTACT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to submit contact message"
    });
  }
};


/*
|--------------------------------------------------------------------------
| CREATE GET INVOLVED APPLICATION
|--------------------------------------------------------------------------
*/

const createGetInvolved = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      interestArea,
      message
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    if (
      !name ||
      !email ||
      !interestArea ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, interest area and message are required"
      });
    }

    /*
    |--------------------------------------------------------------------------
    | SAVE GET INVOLVED APPLICATION TO MONGODB
    |--------------------------------------------------------------------------
    */

    const contact = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      interestArea: interestArea.trim(),
      message: message.trim(),
      type: "get-involved"
    });

    /*
    |--------------------------------------------------------------------------
    | SEND EMAIL NOTIFICATION
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    | The application has already been saved to MongoDB.
    |
    | If email fails, we still return success because
    | the visitor's application has not been lost.
    |
    */

    let emailSent = false;

    try {
      const emailResult = await sendEmail({
        to: process.env.MAIL_TO,

        subject:
          `New Get Involved Application - ${interestArea}`,

        html: `
          <!DOCTYPE html>

          <html>
            <body style="
              margin: 0;
              padding: 0;
              background: #f4f1ea;
              font-family: Arial, Helvetica, sans-serif;
              color: #333333;
            ">

              <div style="
                max-width: 650px;
                margin: 30px auto;
                background: #ffffff;
              ">

                <!-- HEADER -->

                <div style="
                  background: #132b46;
                  padding: 30px;
                  text-align: center;
                ">

                  <h1 style="
                    margin: 0;
                    color: #ffffff;
                    font-size: 24px;
                  ">
                    David Chukwu Charity Foundation
                  </h1>

                  <p style="
                    margin: 8px 0 0;
                    color: #dca336;
                    font-size: 14px;
                  ">
                    New Get Involved Application
                  </p>

                </div>

                <!-- CONTENT -->

                <div style="
                  padding: 30px;
                ">

                  <h2 style="
                    margin-top: 0;
                    color: #132b46;
                  ">
                    New Get Involved Application
                  </h2>

                  <p>
                    A visitor has submitted a new request
                    to get involved with the foundation.
                  </p>

                  <hr style="
                    border: none;
                    border-top: 1px solid #eeeeee;
                    margin: 25px 0;
                  " />

                  <p>
                    <strong>Name:</strong>
                    ${name}
                  </p>

                  <p>
                    <strong>Email:</strong>
                    ${email}
                  </p>

                  <p>
                    <strong>Phone:</strong>
                    ${phone || "Not provided"}
                  </p>

                  <p>
                    <strong>Interest Area:</strong>
                    ${interestArea}
                  </p>

                  <div style="
                    margin-top: 25px;
                    padding: 20px;
                    background: #f8f8f8;
                    border-left: 4px solid #dca336;
                  ">

                    <p style="
                      margin-top: 0;
                      font-weight: bold;
                      color: #132b46;
                    ">
                      Message
                    </p>

                    <p style="
                      margin-bottom: 0;
                      line-height: 1.7;
                    ">
                      ${message}
                    </p>

                  </div>

                  <p style="
                    margin-top: 30px;
                    color: #777777;
                    font-size: 13px;
                  ">
                    This application was submitted through
                    the David Chukwu Charity Foundation website.
                  </p>

                </div>

              </div>

            </body>
          </html>
        `
      });

      emailSent = emailResult?.success === true;

    } catch (emailError) {
      console.error(
        "GET INVOLVED EMAIL NOTIFICATION ERROR:",
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
        "Your application has been submitted successfully",

      emailSent,

      contact
    });

  } catch (error) {
    console.error(
      "CREATE GET INVOLVED ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to submit get involved application"
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
    const messages = await ContactMessage.find({
      type: "contact"
    }).sort({
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });

  } catch (error) {
    console.error(
      "GET CONTACTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch contact messages"
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET GET-INVOLVED APPLICATIONS
|--------------------------------------------------------------------------
*/

const getVolunteers = async (req, res) => {
  try {
    const volunteers = await ContactMessage.find({
      type: "get-involved"
    }).sort({
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      count: volunteers.length,
      volunteers
    });

  } catch (error) {
    console.error(
      "GET VOLUNTEERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch volunteer applications"
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE CONTACT STATUS
|--------------------------------------------------------------------------
*/

const updateContactStatus = async (req, res) => {
  try {
    const {
      id
    } = req.params;

    const {
      status
    } = req.body;

    const allowedStatuses = [
      "Unread",
      "Read",
      "Replied",
      "Archived"
    ];

    /*
    |--------------------------------------------------------------------------
    | VALIDATE STATUS
    |--------------------------------------------------------------------------
    */

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid message status"
      });
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE MESSAGE
    |--------------------------------------------------------------------------
    */

    const message =
      await ContactMessage.findByIdAndUpdate(
        id,
        {
          status
        },
        {
          new: true,
          runValidators: true
        }
      );

    /*
    |--------------------------------------------------------------------------
    | CHECK MESSAGE
    |--------------------------------------------------------------------------
    */

    if (!message) {
      return res.status(404).json({
        success: false,
        message:
          "Message not found"
      });
    }

    /*
    |--------------------------------------------------------------------------
    | RESPONSE
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      message:
        "Message status updated successfully",

      contact: message
    });

  } catch (error) {
    console.error(
      "UPDATE CONTACT STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update message status"
    });
  }
};


/*
|--------------------------------------------------------------------------
| DELETE CONTACT
|--------------------------------------------------------------------------
*/

const deleteContact = async (req, res) => {
  try {
    const {
      id
    } = req.params;

    /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */

    const message =
      await ContactMessage.findByIdAndDelete(id);

    /*
    |--------------------------------------------------------------------------
    | CHECK MESSAGE
    |--------------------------------------------------------------------------
    */

    if (!message) {
      return res.status(404).json({
        success: false,
        message:
          "Message not found"
      });
    }

    /*
    |--------------------------------------------------------------------------
    | RESPONSE
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      message:
        "Message deleted successfully"
    });

  } catch (error) {
    console.error(
      "DELETE CONTACT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete message"
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
  createGetInvolved,
  getContacts,
  getVolunteers,
  updateContactStatus,
  deleteContact
};