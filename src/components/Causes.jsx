import "../styles/Causes.css";

import Reveal from "./Reveal";

/*
|--------------------------------------------------------------------------
| DEFAULT CAUSES SETTINGS
|--------------------------------------------------------------------------
*/

const defaultCauses = {
  eyebrow: "Our Causes",

  title: "Where Your Support Makes a Difference",

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
| Legacy /uploads images are still supported.
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
| CAUSES
|--------------------------------------------------------------------------
*/

const Causes = ({ settings }) => {
  const causesSettings = {
    ...defaultCauses,
    ...(settings || {}),
  };

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
              getImageUrl(cause.image);

            return (
              <Reveal
                key={
                  cause._id ||
                  cause.id ||
                  `${cause.title}-${index}`
                }
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