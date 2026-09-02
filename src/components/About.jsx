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
| GET PUBLIC IMAGE URL
|--------------------------------------------------------------------------
*/

const getImageUrl = (image) => {
  if (
    typeof image !== "string" ||
    !image.trim()
  ) {
    return "";
  }

  const cleanImage = image.trim();

  /*
  |--------------------------------------------------------------------------
  | CLOUDINARY / EXTERNAL IMAGE
  |--------------------------------------------------------------------------
  */

  if (
    cleanImage.startsWith("https://") ||
    cleanImage.startsWith("http://") ||
    cleanImage.startsWith("blob:")
  ) {
    return cleanImage;
  }

  /*
  |--------------------------------------------------------------------------
  | LEGACY LOCAL IMAGE
  |--------------------------------------------------------------------------
  */

  const apiUrl =
    API.defaults?.baseURL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  const serverUrl = apiUrl.replace(
    /\/api\/?$/,
    ""
  );

  if (cleanImage.startsWith("/")) {
    return `${serverUrl}${cleanImage}`;
  }

  return `${serverUrl}/${cleanImage}`;
};

/*
|--------------------------------------------------------------------------
| ABOUT
|--------------------------------------------------------------------------
*/

const About = ({ settings }) => {
  const about = {
    ...defaultAbout,
    ...(settings || {}),
  };

  const imageUrl =
    getImageUrl(about.image);

  /*
  |--------------------------------------------------------------------------
  | DEBUG
  |--------------------------------------------------------------------------
  */

  console.log(
    "PUBLIC ABOUT IMAGE:",
    about.image
  );

  console.log(
    "FINAL ABOUT IMAGE:",
    imageUrl
  );

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

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