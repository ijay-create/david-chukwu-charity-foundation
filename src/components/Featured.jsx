import { Link } from "react-router-dom";

import "../styles/Featured.css";

import handsImg from "../assets/hands-stack.jpg";

import Reveal from "./Reveal";

/*
|--------------------------------------------------------------------------
| DEFAULT FEATURED SETTINGS
|--------------------------------------------------------------------------
*/

const defaultFeatured = {
  eyebrow: "FEATURED INITIATIVE",

  title:
    "Supporting Those Who Need Us Most",

  description:
    "We run various programs that directly impact lives - from providing essential items and education support to empowerment and community development.",

  buttonText:
    "VIEW OUR IMPACT →",

  image: "",
};

/*
|--------------------------------------------------------------------------
| GET PUBLIC IMAGE URL
|--------------------------------------------------------------------------
*/

const getImageUrl = (image) => {
  /*
  |--------------------------------------------------------------------------
  | NO IMAGE
  |--------------------------------------------------------------------------
  */

  if (
    typeof image !== "string" ||
    !image.trim()
  ) {
    return handsImg;
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
  | LEGACY LOCAL UPLOAD
  |--------------------------------------------------------------------------
  */

  const apiUrl =
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
| FEATURED
|--------------------------------------------------------------------------
*/

const Featured = ({ settings }) => {
  const featured = {
    ...defaultFeatured,
    ...(settings || {}),
  };

  const imageUrl =
    getImageUrl(featured.image);

  /*
  |--------------------------------------------------------------------------
  | DEBUG
  |--------------------------------------------------------------------------
  */

  console.log(
    "PUBLIC FEATURED IMAGE:",
    featured.image
  );

  console.log(
    "FINAL FEATURED IMAGE:",
    imageUrl
  );

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <section className="featured section">

      <div className="container featured-container">

        {/* ================================================================
            FEATURED IMAGE
        ================================================================ */}

        <Reveal className="featured-image">

          <img
            src={imageUrl}
            alt="Featured initiative"
            loading="lazy"
            onError={(event) => {
              console.error(
                "FEATURED IMAGE FAILED:",
                imageUrl
              );

              /*
              |--------------------------------------------------------------
              | Fall back to the bundled image if Cloudinary fails.
              |--------------------------------------------------------------
              */

              if (
                event.currentTarget.src !==
                handsImg
              ) {
                event.currentTarget.src =
                  handsImg;
              }
            }}
          />

        </Reveal>

        {/* ================================================================
            FEATURED CONTENT
        ================================================================ */}

        <Reveal className="featured-content">

          <span className="section-label">
            {featured.eyebrow}
          </span>

          <h2>
            {featured.title}
          </h2>

          <p>
            {featured.description}
          </p>

          {/* ============================================================
              OUR IMPACT BUTTON
          ============================================================ */}

          <Link
            to="/impact"
            className="donate-btn"
            aria-label="View our impact"
          >
            {featured.buttonText}
          </Link>

        </Reveal>

      </div>

    </section>
  );
};

export default Featured;