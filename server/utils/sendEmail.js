/**
 * ============================================================================
 * BREVO EMAIL SERVICE
 * ============================================================================
 *
 * Sends transactional emails through the Brevo HTTP API.
 *
 * This replaces Nodemailer/SMTP because Render Free blocks outbound
 * SMTP connections on ports 25, 465 and 587.
 * ============================================================================
 */

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const sendEmail = async ({ to, subject, html, replyTo }) => {
  try {
    // ========================================================================
    // ENVIRONMENT VALIDATION
    // ========================================================================

    if (!process.env.BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is not configured.");
    }

    if (!process.env.MAIL_FROM) {
      throw new Error("MAIL_FROM is not configured.");
    }

    if (!process.env.MAIL_TO) {
      throw new Error("MAIL_TO is not configured.");
    }

    if (!to) {
      throw new Error("Email recipient is required.");
    }

    // ========================================================================
    // PARSE MAIL_FROM
    // Example:
    // David Chukwu Charity Foundation <info@davidchukwucharityfoundation.org>
    // ========================================================================

    const fromMatch = process.env.MAIL_FROM.match(
      /^(.*?)\s*<([^>]+)>$/
    );

    const senderName = fromMatch
      ? fromMatch[1].trim()
      : "David Chukwu Charity Foundation";

    const senderEmail = fromMatch
      ? fromMatch[2].trim()
      : process.env.MAIL_FROM.trim();

    // ========================================================================
    // BREVO REQUEST BODY
    // ========================================================================

    const emailPayload = {
      sender: {
        name: senderName,
        email: senderEmail,
      },

      to: [
        {
          email: to,
        },
      ],

      subject,

      htmlContent: html,
    };

    // ========================================================================
    // REPLY-TO
    // ========================================================================

    if (replyTo) {
      emailPayload.replyTo = {
        email: replyTo,
      };
    }

    // ========================================================================
    // SEND THROUGH BREVO HTTP API
    // ========================================================================

    const response = await fetch(BREVO_API_URL, {
      method: "POST",

      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },

      body: JSON.stringify(emailPayload),
    });

    // ========================================================================
    // READ RESPONSE
    // ========================================================================

    const responseText = await response.text();

    let responseData = {};

    try {
      responseData = responseText
        ? JSON.parse(responseText)
        : {};
    } catch {
      responseData = {
        message: responseText,
      };
    }

    // ========================================================================
    // HANDLE BREVO ERRORS
    // ========================================================================

    if (!response.ok) {
      console.error(
        "BREVO API ERROR:",
        response.status,
        responseData
      );

      throw new Error(
        responseData?.message ||
          `Brevo API request failed with status ${response.status}.`
      );
    }

    // ========================================================================
    // SUCCESS
    // ========================================================================

    console.log(
      "EMAIL SENT SUCCESSFULLY THROUGH BREVO:",
      responseData?.messageId
    );

    return {
      success: true,
      messageId: responseData?.messageId || null,
      response: responseData,
    };
  } catch (error) {
    console.error(
      "SEND EMAIL ERROR:",
      error.message
    );

    throw error;
  }
};

module.exports = sendEmail;