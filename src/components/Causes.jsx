import "../styles/Causes.css";

import Reveal from "./Reveal";

/*
|--------------------------------------------------------------------------
| DEFAULT CAUSES SETTINGS
|--------------------------------------------------------------------------
*/

const defaultCauses = {
  eyebrow: "Our Causes",

  title:
    "Where Your Support Makes a Difference",

  description:
    "Your support helps us provide meaningful assistance to communities and individuals who need it most.",

  items: [],
};

/*
|--------------------------------------------------------------------------
| GET PUBLIC IMAGE URL
|--------------------------------------------------------------------------
|
| Cloudinary URLs are already complete URLs and must be used directly.
|
| Temporary blob URLs are supported for browser previews.
|
| Legacy local /uploads paths are intentionally ignored because the
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
  */

  return "";
};

/*
|--------------------------------------------------------------------------
| CAUSES
|--------------------------------------------------------------------------
*/

const Causes = ({ settings }) => {
  /*
  |--------------------------------------------------------------------------
  | MERGE DEFAULT SETTINGS
  |--------------------------------------------------------------------------
  */

  const causesSettings = {
    ...defaultCauses,
    ...(settings || {}),
  };

  /*
  |--------------------------------------------------------------------------
  | CAUSES ITEMS
  |--------------------------------------------------------------------------
  */

  const causes = Array.isArray(
    causesSettings.items
  )
    ? causesSettings.items
    : [];

  /*
  |--------------------------------------------------------------------------
  | DEBUG
  |--------------------------------------------------------------------------
  */

  console.log(
    "PUBLIC CAUSES SETTINGS:",
    causesSettings
  );

  console.log(
    "PUBLIC CAUSES ITEMS:",
    causes
  );

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <section
      className="causes section"
      id="causes"
    >
      <div className="container">

        {/* ================================================================
            CAUSES HEADER
        ================================================================ */}

        <Reveal className="causes-header">

          <span className="section-label">
            {causesSettings.eyebrow}
          </span>

          <h2>
            {causesSettings.title}
          </h2>

          <p>
            {causesSettings.description}
          </p>

        </Reveal>

        {/* ================================================================
            CAUSES GRID
        ================================================================ */}

        <div className="causes-grid">

          {causes.map((cause, index) => {
            const imageUrl =
              getImageUrl(
                cause.image
              );

            const causeKey =
              cause._id ||
              cause.id ||
              `${cause.title || "cause"}-${index}`;

            return (
              <Reveal
                key={causeKey}
              >
                <article
                  className="cause-card"
                  style={{
                    transitionDelay: `${
                      index * 0.1
                    }s`,
                  }}
                >

                  {/* ====================================================
                      IMAGE
                  ==================================================== */}

                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={
                        cause.title ||
                        "Cause"
                      }
                      loading="lazy"
                      onError={(event) => {
                        console.error(
                          "CAUSE IMAGE FAILED:",
                          imageUrl
                        );

                        event.currentTarget.style.display =
                          "none";
                      }}
                    />
                  )}

                  {/* ====================================================
                      CONTENT
                  ==================================================== */}

                  <div className="cause-card-content">

                    <h3>
                      {cause.title}
                    </h3>

                    <p>
                      {cause.text}
                    </p>

                  </div>

                </article>
              </Reveal>
            );
          })}

        </div>

      </div>
    </section>
  );
};

export default Causes;