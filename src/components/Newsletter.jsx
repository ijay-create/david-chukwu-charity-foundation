import { useState } from "react";

import API from "../api/axios";

import "../styles/newsletter.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  /*
  |--------------------------------------------------------------------------
  | SUBMIT NEWSLETTER
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    if (!normalizedEmail) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    setStatus("loading");
    setMessage("");

    try {
      /*
      |--------------------------------------------------------------------------
      | SEND TO BACKEND
      |--------------------------------------------------------------------------
      |
      | Axios baseURL:
      |
      | VITE_API_URL=http://localhost:5000/api
      |
      | Therefore this request becomes:
      |
      | POST http://localhost:5000/api/newsletter/subscribe
      |
      */

      const response = await API.post(
        "/newsletter/subscribe",
        {
          email: normalizedEmail,
        }
      );

      const data = response.data;

      /*
      |--------------------------------------------------------------------------
      | SUCCESS
      |--------------------------------------------------------------------------
      */

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Unable to subscribe at the moment."
        );
      }

      setStatus("success");
      setMessage(
        data.message ||
          "You have successfully subscribed to our newsletter!"
      );

      setEmail("");
    } catch (error) {
      console.error(
        "Newsletter error:",
        error
      );

      /*
      |--------------------------------------------------------------------------
      | BACKEND ERROR
      |--------------------------------------------------------------------------
      */

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to subscribe at the moment. Please try again.";

      setStatus("error");
      setMessage(errorMessage);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <section
      className="newsletter-section"
      aria-labelledby="newsletter-heading"
    >
      <div className="newsletter-container">

        <span className="newsletter-label">
          Stay Connected
        </span>

        <h2
          id="newsletter-heading"
          className="newsletter-heading"
        >
          Join Our Newsletter
        </h2>

        <p className="newsletter-description">
          Get updates about our projects, impact
          stories, upcoming events, and ways you
          can support our mission.
        </p>

        <form
          className="newsletter-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="newsletter-input-group">

            <input
              type="email"
              className="newsletter-input"
              placeholder="Enter your email address"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);

                /*
                |----------------------------------------------------------------
                | CLEAR OLD MESSAGE WHEN USER STARTS TYPING AGAIN
                |----------------------------------------------------------------
                */

                if (
                  status === "error" ||
                  status === "success"
                ) {
                  setStatus("idle");
                  setMessage("");
                }
              }}
              disabled={status === "loading"}
              aria-label="Email address"
              autoComplete="email"
            />

            <button
              type="submit"
              className="newsletter-button"
              disabled={status === "loading"}
            >
              {status === "loading"
                ? "Subscribing..."
                : "Subscribe"}
            </button>

          </div>

          {message && (
            <p
              className={`newsletter-message ${
                status === "success"
                  ? "success"
                  : "error"
              }`}
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          )}
        </form>

      </div>
    </section>
  );
};

export default Newsletter;