import { Link } from "react-router-dom";

import "../styles/CTA.css";

import ctaImg from "../assets/cta-bg.jpg";

/*
|--------------------------------------------------------------------------
| DEFAULT CTA SETTINGS
|--------------------------------------------------------------------------
*/

const defaultCTA = {
  eyebrow: "Make a Difference",

  title:
    "Your Support Can Change a Life",

  description:
    "Whether through giving, volunteering or partnership, you can help us extend hope and support to more people.",

  buttonText: "DONATE NOW",

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
    return ctaImg;
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
| CTA
|--------------------------------------------------------------------------
*/

const CTA = ({
  settings,
  onDonateClick,
}) => {
  const cta = {
    ...defaultCTA,
    ...(settings || {}),
  };

  const backgroundImage =
    getImageUrl(cta.image);

  /*
  |--------------------------------------------------------------------------
  | DEBUG
  |--------------------------------------------------------------------------
  */

  console.log(
    "PUBLIC CTA IMAGE:",
    cta.image
  );

  console.log(
    "FINAL CTA IMAGE:",
    backgroundImage
  );

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <section
      className="cta"
      id="involved"
      style={{
        backgroundImage: `url("${backgroundImage}")`,
      }}
    >
      <div className="cta-overlay"></div>

      <div className="container cta-container">

        <div className="cta-content">

          {/* ==============================================================
              EYEBROW
          ============================================================== */}

          <span className="cta-eyebrow">
            {cta.eyebrow}
          </span>

          {/* ==============================================================
              TITLE
          ============================================================== */}

          <h2>
            {cta.title}
          </h2>

          {/* ==============================================================
              DESCRIPTION
          ============================================================== */}

          <p>
            {cta.description}
          </p>

          {/* ==============================================================
              BUTTONS
          ============================================================== */}

          <div className="cta-buttons">

            {/* DONATE */}

            <button
              type="button"
              className="donate-btn"
              onClick={onDonateClick}
            >
              {cta.buttonText}
            </button>

            {/* GET INVOLVED */}

            <Link
              to="/get-involved"
              className="outline-btn"
            >
              GET INVOLVED

              <span aria-hidden="true">
                →
              </span>
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CTA;