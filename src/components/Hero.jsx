import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import API from "../api/axios";

import "../styles/Hero.css";

import heroImg from "../assets/hero-bg.jpg";

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Hero = ({
  settings = {},
  onDonateClick
}) => {
  /*
  |--------------------------------------------------------------------------
  | API BASE URL
  |--------------------------------------------------------------------------
  */

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  /*
  |--------------------------------------------------------------------------
  | BUILD IMAGE URL
  |--------------------------------------------------------------------------
  */

  const getImageUrl = (image) => {
    if (!image) {
      return heroImg;
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    const serverUrl = API_URL.replace(
      /\/api\/?$/,
      ""
    );

    const imagePath = image.startsWith("/")
      ? image
      : `/${image}`;

    return `${serverUrl}${imagePath}`;
  };

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

  const backgroundImage = getImageUrl(
    settings.image
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
        backgroundImage: `url("${backgroundImage}")`
      }}
    >
      <div className="hero-overlay"></div>

      <div className="container hero-container">

        <motion.div
          className="hero-content"

          initial={{
            opacity: 0,
            x: -45
          }}

          whileInView={{
            opacity: 1,
            x: 0
          }}

          viewport={{
            once: false,
            amount: 0.25
          }}

          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
          }}
        >

          {/* EYEBROW */}

          <motion.span
            className="hero-script"

            initial={{
              opacity: 0,
              y: 18
            }}

            whileInView={{
              opacity: 1,
              y: 0
            }}

            viewport={{
              once: false,
              amount: 0.25
            }}

            transition={{
              delay: 0.12,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            {eyebrow}
          </motion.span>

          {/* TITLE */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 22
            }}

            whileInView={{
              opacity: 1,
              y: 0
            }}

            viewport={{
              once: false,
              amount: 0.25
            }}

            transition={{
              delay: 0.22,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            {title}
          </motion.h1>

          {/* DESCRIPTION */}

          <motion.p
            initial={{
              opacity: 0,
              y: 22
            }}

            whileInView={{
              opacity: 1,
              y: 0
            }}

            viewport={{
              once: false,
              amount: 0.25
            }}

            transition={{
              delay: 0.32,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            {description}
          </motion.p>

          {/* BUTTONS */}

          <motion.div
            className="hero-buttons"

            initial={{
              opacity: 0,
              y: 22
            }}

            whileInView={{
              opacity: 1,
              y: 0
            }}

            viewport={{
              once: false,
              amount: 0.25
            }}

            transition={{
              delay: 0.42,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1]
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