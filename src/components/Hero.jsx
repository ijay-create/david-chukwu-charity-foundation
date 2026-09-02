import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import "../styles/Hero.css";

import heroImg from "../assets/hero-bg.jpg";

/*
|--------------------------------------------------------------------------
| ARROW ICON
|--------------------------------------------------------------------------
*/

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/*
|--------------------------------------------------------------------------
| GET PUBLIC IMAGE URL
|--------------------------------------------------------------------------
|
| Cloudinary URLs are already complete HTTPS URLs.
|
| Legacy /uploads images are converted to the API server.
|
|--------------------------------------------------------------------------
*/

const getImageUrl = (image) => {
  if (
    typeof image !== "string" ||
    !image.trim()
  ) {
    return heroImg;
  }

  const cleanImage = image.trim();

  /*
  |----------------------------------------------------------------------
  | CLOUDINARY / EXTERNAL URL
  |----------------------------------------------------------------------
  */

  if (
    cleanImage.startsWith("https://") ||
    cleanImage.startsWith("http://") ||
    cleanImage.startsWith("blob:")
  ) {
    return cleanImage;
  }

  /*
  |----------------------------------------------------------------------
  | LEGACY LOCAL UPLOAD
  |----------------------------------------------------------------------
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
| HERO
|--------------------------------------------------------------------------
*/

const Hero = ({
  settings = {},
  onDonateClick,
}) => {
  /*
  |--------------------------------------------------------------------------
  | HERO CONTENT
  |--------------------------------------------------------------------------
  */

  const eyebrow =
    settings.eyebrow ||
    "Bringing Hope,";

  const title =
    settings.title ||
    "Support and Change";

  const description =
    settings.description ||
    "At David Chukwu Charity Foundation, we are committed to touching lives, restoring dignity, and creating opportunities for vulnerable individuals within our communities.";

  const primaryButtonText =
    settings.primaryButtonText ||
    "DONATE NOW";

  const secondaryButtonText =
    settings.secondaryButtonText ||
    "LEARN MORE";

  /*
  |--------------------------------------------------------------------------
  | HERO IMAGE
  |--------------------------------------------------------------------------
  */

  const backgroundImage =
    getImageUrl(settings.image);

  /*
  |--------------------------------------------------------------------------
  | DEBUG
  |--------------------------------------------------------------------------
  */

  console.log(
    "PUBLIC HERO IMAGE:",
    settings.image
  );

  console.log(
    "FINAL HERO IMAGE:",
    backgroundImage
  );

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <section
      className="hero"
      id="home"
      style={{
        backgroundImage: `url("${backgroundImage}")`,
      }}
    >
      <div className="hero-overlay"></div>

      <div className="container hero-container">

        <motion.div
          className="hero-content"
          initial={{
            opacity: 0,
            x: -45,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: false,
            amount: 0.25,
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >

          {/* EYEBROW */}

          <motion.span
            className="hero-script"
            initial={{
              opacity: 0,
              y: 18,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: false,
              amount: 0.25,
            }}
            transition={{
              delay: 0.12,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {eyebrow}
          </motion.span>

          {/* TITLE */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 22,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: false,
              amount: 0.25,
            }}
            transition={{
              delay: 0.22,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {title}
          </motion.h1>

          {/* DESCRIPTION */}

          <motion.p
            initial={{
              opacity: 0,
              y: 22,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: false,
              amount: 0.25,
            }}
            transition={{
              delay: 0.32,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {description}
          </motion.p>

          {/* BUTTONS */}

          <motion.div
            className="hero-buttons"
            initial={{
              opacity: 0,
              y: 22,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: false,
              amount: 0.25,
            }}
            transition={{
              delay: 0.42,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            {/* DONATE */}

            <button
              type="button"
              className="donate-btn"
              onClick={onDonateClick}
            >
              {primaryButtonText}
            </button>

            {/* ABOUT */}

            <Link
              to="/about"
              className="outline-btn"
            >
              {secondaryButtonText}

              <ArrowIcon />
            </Link>

          </motion.div>

        </motion.div>

      </div>
    </section>
  );
};

export default Hero;