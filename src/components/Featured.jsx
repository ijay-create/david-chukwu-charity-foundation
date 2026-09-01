import { Link } from "react-router-dom";

import "../styles/Featured.css";

import handsImg from "../assets/hands-stack.jpg";

import Reveal from "./Reveal";

import API from "../api/axios";

/*
|--------------------------------------------------------------------------
| FEATURED COMPONENT
|--------------------------------------------------------------------------
*/

const Featured = ({ settings }) => {
  const featured = settings || {};

  /*
  |--------------------------------------------------------------------------
  | IMAGE URL HELPER
  |--------------------------------------------------------------------------
  */

  const getImageUrl = (image) => {
    if (!image) {
      return handsImg;
    }

    /*
    |--------------------------------------------------------------------------
    | ALREADY A COMPLETE URL
    |--------------------------------------------------------------------------
    */

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("blob:")
    ) {
      return image;
    }

    /*
    |--------------------------------------------------------------------------
    | GET API BASE URL
    |--------------------------------------------------------------------------
    */

    const baseURL =
      API.defaults?.baseURL ||
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api";

    /*
    |--------------------------------------------------------------------------
    | REMOVE /api FROM API URL
    |--------------------------------------------------------------------------
    */

    const serverURL = baseURL.replace(
      /\/api\/?$/,
      ""
    );

    /*
    |--------------------------------------------------------------------------
    | BUILD IMAGE URL
    |--------------------------------------------------------------------------
    */

    if (image.startsWith("/")) {
      return `${serverURL}${image}`;
    }

    return `${serverURL}/${image}`;
  };

  /*
  |--------------------------------------------------------------------------
  | IMAGE URL
  |--------------------------------------------------------------------------
  */

  const imageUrl = getImageUrl(
    featured.image
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
          />

        </Reveal>

        {/* ================================================================
            FEATURED CONTENT
        ================================================================ */}

        <Reveal className="featured-content">

          <span className="section-label">
            {featured.eyebrow ||
              "FEATURED INITIATIVE"}
          </span>

          <h2>
            {featured.title ||
              "Supporting Those Who Need Us Most"}
          </h2>

          <p>
            {featured.description ||
              "We run various programs that directly impact lives - from providing essential items and education support to empowerment and community development."}
          </p>

          {/* ============================================================
              OUR IMPACT BUTTON
          ============================================================ */}

          <Link
            to="/impact"
            className="donate-btn"
            aria-label="View our impact"
          >
            {featured.buttonText ||
              "VIEW OUR IMPACT →"}
          </Link>

        </Reveal>

      </div>
    </section>
  );
};

export default Featured;