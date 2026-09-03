import { Link } from "react-router-dom";

import Reveal from "./Reveal";

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
|
| Cloudinary URLs are already complete URLs and must be used directly.
|
| Temporary blob URLs are also supported for browser previews.
|
| Local /uploads paths are intentionally NOT converted because the
| foundation now uses Cloudinary for public images.
|
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
  | CLOUDINARY / EXTERNAL URL
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
  | IGNORE LEGACY LOCAL PATHS
  |--------------------------------------------------------------------------
  |
  | The public homepage should no longer construct image URLs from
  | /uploads or local server paths.
  |
  |--------------------------------------------------------------------------
  */

  return "";
};

/*
|--------------------------------------------------------------------------
| ABOUT
|--------------------------------------------------------------------------
*/

const About = ({ settings }) => {
  /*
  |--------------------------------------------------------------------------
  | MERGE DEFAULT SETTINGS
  |--------------------------------------------------------------------------
  */

  const about = {
    ...defaultAbout,
    ...(settings || {}),
  };

  /*
  |--------------------------------------------------------------------------
  | IMAGE URL
  |--------------------------------------------------------------------------
  */

  const imageUrl = getImageUrl(
    about.image
  );

  /*
  |--------------------------------------------------------------------------
  | DEBUG
  |--------------------------------------------------------------------------
  */

  console.log(
    "PUBLIC ABOUT SETTINGS:",
    about
  );

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