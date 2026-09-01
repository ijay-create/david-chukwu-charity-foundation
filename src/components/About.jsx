import { Link } from "react-router-dom";

import Reveal from "./Reveal";

import API from "../api/axios";

import "../styles/About.css";

/*
|--------------------------------------------------------------------------
| DEFAULT ABOUT SETTINGS
|--------------------------------------------------------------------------
*/

const defaultAbout = {
  eyebrow: "WHO WE ARE",

  title:
    "Building Stronger Communities Together",

  description:
    "We believe every person deserves the opportunity to live a better life.",

  buttonText: "LEARN MORE",

  image: "",
};

/*
|--------------------------------------------------------------------------
| GET IMAGE URL
|--------------------------------------------------------------------------
*/

const getImageUrl = (image) => {
  if (!image) {
    return "";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("blob:")
  ) {
    return image;
  }

  const baseURL =
    API.defaults?.baseURL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  const serverURL = baseURL.replace(
    /\/api\/?$/,
    ""
  );

  if (image.startsWith("/")) {
    return `${serverURL}${image}`;
  }

  return `${serverURL}/${image}`;
};

/*
|--------------------------------------------------------------------------
| ABOUT COMPONENT
|--------------------------------------------------------------------------
*/

const About = ({ settings }) => {
  const about = {
    ...defaultAbout,
    ...(settings || {}),
  };

  const imageUrl = getImageUrl(
    about.image
  );

  return (
    <section
      className="about section"
      id="about"
    >
      <div className="container about-container">

        {/* ================================================================
            ABOUT IMAGE
        ================================================================ */}

        <Reveal className="about-image">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="David Chukwu Charity Foundation"
              loading="lazy"
              onError={(event) => {
                console.error(
                  "HOMEPAGE ABOUT IMAGE FAILED:",
                  imageUrl
                );

                event.currentTarget.style.display =
                  "none";
              }}
            />
          ) : (
            <div className="about-image-placeholder">
              <span>
                David Chukwu Charity Foundation
              </span>
            </div>
          )}
        </Reveal>

        {/* ================================================================
            ABOUT CONTENT
        ================================================================ */}

        <Reveal className="about-content">
          <span className="section-label">
            {about.eyebrow}
          </span>

          <h2>
            {about.title}
          </h2>

          <p>
            {about.description}
          </p>

          <Link
            to="/about"
            className="dark-outline-btn"
            aria-label="Learn more about David Chukwu Charity Foundation"
          >
            <span>
              {about.buttonText}
            </span>

            <span
              className="button-arrow"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default About;