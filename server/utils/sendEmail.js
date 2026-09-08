const nodemailer = require("nodemailer");

// ============================================================
// SMTP TRANSPORTER
// ============================================================

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,

  port:
    Number(process.env.SMTP_PORT) || 587,

  secure:
    Number(process.env.SMTP_PORT) === 465,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ============================================================
// SEND EMAIL
// ============================================================

const sendEmail = async ({
  to,
  subject,
  html,
}) => {
  try {
    if (!process.env.SMTP_HOST) {
      throw new Error(
        "SMTP_HOST is not configured."
      );
    }

    if (!process.env.SMTP_USER) {
      throw new Error(
        "SMTP_USER is not configured."
      );
    }

    if (!process.env.SMTP_PASS) {
      throw new Error(
        "SMTP_PASS is not configured."
      );
    }

    if (!process.env.MAIL_FROM) {
      throw new Error(
        "MAIL_FROM is not configured."
      );
    }

    if (!to) {
      throw new Error(
        "Email recipient is required."
      );
    }

    const info =
      await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html,
      });

    console.log(
      "EMAIL SENT SUCCESSFULLY:",
      info.messageId
    );

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    console.error(
      "SEND EMAIL ERROR:",
      error
    );

    throw error;
  }
};

module.exports = sendEmail;