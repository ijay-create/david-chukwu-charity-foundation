import React, { useState } from "react";
import {
  Handshake,
  Mail,
  Lock,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/GetInvolved.css";

const API_URL = "http://localhost:5000/api/contact";

const GetInvolved = ({ onDonateClick }) => {
  const [involvedForm, setInvolvedForm] = useState({
    name: "",
    email: "",
    phone: "",
    involvement: "",
    message: ""
  });

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [involvedLoading, setInvolvedLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  const [involvedMessage, setInvolvedMessage] = useState({
    type: "",
    text: ""
  });

  const [contactMessage, setContactMessage] = useState({
    type: "",
    text: ""
  });

  /* ========================================
     GET INVOLVED FORM CHANGE
  ======================================== */

  const handleInvolvedChange = (event) => {
    const { name, value } = event.target;

    setInvolvedForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setInvolvedMessage({
      type: "",
      text: ""
    });
  };

  /* ========================================
     CONTACT FORM CHANGE
  ======================================== */

  const handleContactChange = (event) => {
    const { name, value } = event.target;

    setContactForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setContactMessage({
      type: "",
      text: ""
    });
  };

  /* ========================================
     GET INVOLVED SUBMIT
  ======================================== */

  const handleInvolvedSubmit = async (event) => {
    event.preventDefault();

    setInvolvedLoading(true);

    setInvolvedMessage({
      type: "",
      text: ""
    });

    try {
      const response = await axios.post(
        `${API_URL}/involved`,
        {
          name: involvedForm.name,
          email: involvedForm.email,
          phone: involvedForm.phone,
          interestArea: involvedForm.involvement,
          message: involvedForm.message
        }
      );

      setInvolvedMessage({
        type: "success",
        text:
          response.data?.message ||
          "Your application has been submitted successfully."
      });

      setInvolvedForm({
        name: "",
        email: "",
        phone: "",
        involvement: "",
        message: ""
      });
    } catch (error) {
      console.error(
        "GET INVOLVED SUBMIT ERROR:",
        error
      );

      setInvolvedMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to submit your application. Please try again."
      });
    } finally {
      setInvolvedLoading(false);
    }
  };

  /* ========================================
     CONTACT SUBMIT
  ======================================== */

  const handleContactSubmit = async (event) => {
    event.preventDefault();

    setContactLoading(true);

    setContactMessage({
      type: "",
      text: ""
    });

    try {
      const response = await axios.post(
        `${API_URL}/`,
        {
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          subject: contactForm.subject,
          message: contactForm.message
        }
      );

      setContactMessage({
        type: "success",
        text:
          response.data?.message ||
          "Your message has been sent successfully."
      });

      setContactForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error(
        "CONTACT SUBMIT ERROR:",
        error
      );

      setContactMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to send your message. Please try again."
      });
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <main className="get-involved-page">

      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <section className="get-involved-header">
        <div className="container">

          <span className="get-involved-label">
            CONNECT WITH US
          </span>

          <h1>
            GET INVOLVED OR CONTACT US
          </h1>

          <span className="get-involved-underline"></span>

          <p>
            Whether you want to volunteer, partner with us, donate or simply
            reach out, we would love to hear from you.
          </p>

        </div>
      </section>

      {/* ========================================
          FORMS
      ======================================== */}

      <section className="forms-section">

        <div className="forms-grid">

          {/* ======================================
              GET INVOLVED FORM
          ====================================== */}

          <div className="involved-card">

            <div className="form-heading">

              <div className="form-icon gold-icon">
                <Handshake />
              </div>

              <h2>
                GET INVOLVED
              </h2>

            </div>

            <span className="form-heading-line"></span>

            <p className="form-description">
              There are many ways you can be part of the change. Choose how
              you'd like to get involved and let us know.
            </p>

            <form onSubmit={handleInvolvedSubmit}>

              {/* Full Name */}

              <div className="form-group">

                <label htmlFor="involved-name">
                  Full Name
                </label>

                <input
                  id="involved-name"
                  type="text"
                  name="name"
                  value={involvedForm.name}
                  onChange={handleInvolvedChange}
                  placeholder="Enter your full name"
                  required
                />

              </div>

              {/* Email */}

              <div className="form-group">

                <label htmlFor="involved-email">
                  Email Address
                </label>

                <input
                  id="involved-email"
                  type="email"
                  name="email"
                  value={involvedForm.email}
                  onChange={handleInvolvedChange}
                  placeholder="Enter your email address"
                  required
                />

              </div>

              {/* Phone */}

              <div className="form-group">

                <label htmlFor="involved-phone">
                  Phone Number
                </label>

                <input
                  id="involved-phone"
                  type="tel"
                  name="phone"
                  value={involvedForm.phone}
                  onChange={handleInvolvedChange}
                  placeholder="Enter your phone number"
                />

              </div>

              {/* Involvement */}

              <div className="form-group">

                <label htmlFor="involvement">
                  How would you like to get involved?
                </label>

                <select
                  id="involvement"
                  name="involvement"
                  value={involvedForm.involvement}
                  onChange={handleInvolvedChange}
                  required
                >

                  <option value="">
                    Select an option
                  </option>

                  <option value="Volunteer">
                    Volunteer
                  </option>

                  <option value="Partner With Us">
                    Partner With Us
                  </option>

                  <option value="Sponsor a Project">
                    Sponsor a Project
                  </option>

                  <option value="Donate">
                    Donate
                  </option>

                </select>

              </div>

              {/* Message */}

              <div className="form-group">

                <label htmlFor="involved-message">
                  Message
                </label>

                <textarea
                  id="involved-message"
                  name="message"
                  rows="4"
                  value={involvedForm.message}
                  onChange={handleInvolvedChange}
                  placeholder="Tell us more about how you'd like to help..."
                  required
                />

              </div>

              {/* Feedback */}

              {involvedMessage.text && (
                <div
                  className={`form-message ${involvedMessage.type}`}
                  role="alert"
                >
                  {involvedMessage.text}
                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                className="form-submit gold-submit"
                disabled={involvedLoading}
              >

                {involvedLoading ? (
                  "SUBMITTING..."
                ) : (
                  <>
                    SUBMIT INTEREST
                    <ArrowRight />
                  </>
                )}

              </button>

              {/* Privacy */}

              <div className="privacy-note">

                <Lock />

                <span>
                  Your information is safe with us and will only be used to
                  respond to your inquiry.
                </span>

              </div>

            </form>

          </div>

          {/* ======================================
              CONTACT FORM
          ====================================== */}

          <div className="contact-card">

            <div className="form-heading">

              <div className="form-icon navy-icon">
                <Mail />
              </div>

              <h2>
                CONTACT US
              </h2>

            </div>

            <span className="form-heading-line navy-line"></span>

            <p className="form-description">
              Have a question or need more information? Send us a message and
              we'll get back to you as soon as possible.
            </p>

            <form onSubmit={handleContactSubmit}>

              {/* Full Name */}

              <div className="form-group">

                <label htmlFor="contact-name">
                  Full Name
                </label>

                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  placeholder="Enter your full name"
                  required
                />

              </div>

              {/* Email */}

              <div className="form-group">

                <label htmlFor="contact-email">
                  Email Address
                </label>

                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  placeholder="Enter your email address"
                  required
                />

              </div>

              {/* Phone */}

              <div className="form-group">

                <label htmlFor="contact-phone">
                  Phone Number
                </label>

                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleContactChange}
                  placeholder="Enter your phone number"
                />

              </div>

              {/* Subject */}

              <div className="form-group">

                <label htmlFor="subject">
                  Subject
                </label>

                <select
                  id="subject"
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleContactChange}
                  required
                >

                  <option value="">
                    Select an option
                  </option>

                  <option value="General Inquiry">
                    General Inquiry
                  </option>

                  <option value="Partnership">
                    Partnership
                  </option>

                  <option value="Donation Question">
                    Donation Question
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              {/* Message */}

              <div className="form-group">

                <label htmlFor="contact-message">
                  Message
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  rows="4"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  placeholder="Write your message..."
                  required
                />

              </div>

              {/* Feedback */}

              {contactMessage.text && (
                <div
                  className={`form-message ${contactMessage.type}`}
                  role="alert"
                >
                  {contactMessage.text}
                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                className="form-submit navy-submit"
                disabled={contactLoading}
              >

                {contactLoading ? (
                  "SENDING..."
                ) : (
                  <>
                    SEND MESSAGE
                    <ArrowRight />
                  </>
                )}

              </button>

              {/* Privacy */}

              <div className="privacy-note">

                <Lock />

                <span>
                  Your information is safe with us and will only be used to
                  respond to your inquiry.
                </span>

              </div>

            </form>

          </div>

        </div>

      </section>

      {/* ========================================
          CTA
      ======================================== */}

      <section className="get-involved-cta">

        <div className="container">

          <span className="cta-label">
            MAKE A DIFFERENCE
          </span>

          <h2>
            Be Part of the Change
          </h2>

          <p>
            Your support can help us reach those who need it most.
          </p>

          <div className="get-involved-cta-buttons">

            <button
              type="button"
              className="cta-donate-btn"
              onClick={onDonateClick}
            >
              DONATE NOW
              <ArrowRight />
            </button>

            <Link
              to="/get-involved"
              className="gallery-involved-btn"
              onClick={() => {
                document.body.style.overflow = "";
              }}
            >
              GET INVOLVED →
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
};

export default GetInvolved;