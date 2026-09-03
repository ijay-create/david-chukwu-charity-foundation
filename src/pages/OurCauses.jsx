import {
  useEffect,
  useState
} from "react";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  ArrowRight,
  RefreshCw
} from "lucide-react";

import "../styles/OurCauses.css";


// ========================================
// API URL
// ========================================

const API_URL =
  `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/causes`;


// ========================================
// REVEAL ANIMATION
// ========================================

const Reveal = ({
  children,
  className = "",
  delay = 0
}) => {

  return (
    <motion.div
      className={className}

      initial={{
        opacity: 0,
        y: 35
      }}

      whileInView={{
        opacity: 1,
        y: 0
      }}

      viewport={{
        once: true,
        amount: 0.15
      }}

      transition={{
        duration: 0.7,
        delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );

};


// ========================================
// DEFAULT CONTENT
// ========================================

const defaultCauses = {

  hero: {
    eyebrow: "OUR CAUSES",

    title: "Our Causes",

    description:
      "Supporting people and communities where care is needed most.",

    imageUrl: ""
  },


  intro: {
    eyebrow:
      "WHAT WE CARE ABOUT",

    title:
      "Creating Change Where It Matters",

    description:
      "Our work focuses on providing care, support and opportunities to vulnerable individuals and communities."
  },


  causes: [],


  approach: {
    eyebrow:
      "OUR APPROACH",

    title:
      "Compassion in Action",

    description:
      "We work through care, empowerment, advocacy and community partnerships to create meaningful change.",

    imageUrl: ""
  },


  cta: {
    eyebrow:
      "MAKE A DIFFERENCE",

    title:
      "Be Part of the Change",

    description:
      "Your support can help us reach those who need it most.",

    donateText:
      "DONATE NOW",

    involvedText:
      "GET INVOLVED"
  }

};


// ========================================
// OUR CAUSES PAGE
// ========================================

const OurCauses = ({
  onDonateClick
}) => {

  // ======================================
  // STATE
  // ======================================

  const [causes, setCauses] =
    useState(defaultCauses);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ======================================
  // MEDIA URL
  // ======================================

  /*
    Images are now expected to come directly
    from Cloudinary through the Render API.

    We intentionally do NOT convert:

    /uploads/...
    localhost image paths
    local assets

    Cloudinary returns full HTTPS URLs,
    so they are used exactly as received.
  */

  const getMediaUrl = (
    imageUrl
  ) => {

    if (!imageUrl) {
      return "";
    }

    return imageUrl;
  };


  // ======================================
  // FETCH CAUSES
  // ======================================

  const fetchCauses = async () => {

    try {

      setLoading(true);

      setError("");


      console.log(
        "FETCHING CAUSES FROM:",
        API_URL
      );


      const response =
        await fetch(API_URL);


      if (!response.ok) {

        throw new Error(
          `Request failed with status ${response.status}`
        );

      }


      const data =
        await response.json();


      console.log(
        "CAUSES API RESPONSE:",
        data
      );


      if (
        !data ||
        data.success === false
      ) {

        throw new Error(
          data?.message ||
          "Unable to load causes."
        );

      }


      /*
        Render backend returns:

        {
          success: true,
          causes: {...}
        }

        We extract the causes object.
      */

      const backendCauses =
        data.causes || data;


      if (!backendCauses) {

        throw new Error(
          "Causes data was not returned by the server."
        );

      }


      setCauses({

        ...defaultCauses,

        ...backendCauses,


        hero: {
          ...defaultCauses.hero,
          ...(backendCauses.hero || {})
        },


        intro: {
          ...defaultCauses.intro,
          ...(backendCauses.intro || {})
        },


        causes:
          Array.isArray(
            backendCauses.causes
          )
            ? backendCauses.causes.map(
                (cause, index) => ({

                  ...cause,

                  number:
                    cause.number ||
                    String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    ),

                  order:
                    cause.order ||
                    index + 1,

                  imageUrl:
                    cause.imageUrl ||
                    ""

                })
              )
            : [],


        approach: {
          ...defaultCauses.approach,
          ...(backendCauses.approach || {})
        },


        cta: {
          ...defaultCauses.cta,
          ...(backendCauses.cta || {})
        }

      });

    } catch (fetchError) {

      console.error(
        "FETCH CAUSES ERROR:",
        fetchError
      );


      setError(
        "Unable to load Causes content. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  // ======================================
  // INITIAL LOAD
  // ======================================

  useEffect(() => {

    fetchCauses();

  }, []);


  // ======================================
  // LOADING STATE
  // ======================================

  if (loading) {

    return (

      <main className="causes-page">

        <section className="causes-loading">

          <RefreshCw
            size={42}
            className="causes-loading-icon"
          />

          <h2>
            Loading Our Causes...
          </h2>

          <p>
            Please wait while we load
            our latest causes.
          </p>

        </section>

      </main>

    );

  }


  // ======================================
  // ERROR STATE
  // ======================================

  if (error) {

    return (

      <main className="causes-page">

        <section className="causes-error">

          <div className="causes-error-content">

            <span className="causes-label">
              SOMETHING WENT WRONG
            </span>

            <h2>
              Unable to Load Our Causes
            </h2>

            <p>
              {error}
            </p>


            <button
              type="button"
              className="donate-btn"
              onClick={fetchCauses}
            >

              <RefreshCw
                size={18}
              />

              TRY AGAIN

            </button>

          </div>

        </section>

      </main>

    );

  }


  // ======================================
  // HERO IMAGE
  // ======================================

  const heroBackground =
    getMediaUrl(
      causes.hero?.imageUrl
    );


  // ======================================
  // APPROACH IMAGE
  // ======================================

  const approachBackground =
    getMediaUrl(
      causes.approach?.imageUrl
    );


  // ======================================
  // RENDER
  // ======================================

  return (

    <main className="causes-page">


      {/* ==================================
          HERO
      ================================== */}

      <section
        className="causes-hero"

        style={
          heroBackground
            ? {
                backgroundImage:
                  `url(${heroBackground})`
              }
            : undefined
        }
      >

        <div className="causes-hero-overlay"></div>


        <div className="container causes-hero-container">

          <motion.div
            className="causes-hero-content"

            initial={{
              opacity: 0,
              x: -50
            }}

            animate={{
              opacity: 1,
              x: 0
            }}

            transition={{
              duration: 0.8,
              ease: "easeOut"
            }}
          >

            <span className="causes-label">

              {causes.hero?.eyebrow ||
                "OUR CAUSES"}

            </span>


            <h1>

              {causes.hero?.title ||
                "Our Causes"}

            </h1>


            <span className="causes-underline"></span>


            <p>

              {causes.hero?.description ||
                "Supporting people and communities where care is needed most."}

            </p>

          </motion.div>

        </div>

      </section>


      {/* ==================================
          INTRO
      ================================== */}

      <section className="causes-intro">

        <div className="container causes-intro-container">

          <Reveal>

            <span className="causes-label">

              {causes.intro?.eyebrow ||
                "WHAT WE CARE ABOUT"}

            </span>


            <h2>

              {causes.intro?.title ||
                "Creating Change Where It Matters"}

            </h2>


            <span className="section-line"></span>


            <p>

              {causes.intro?.description ||
                "Our work focuses on providing care, support and opportunities to vulnerable individuals and communities."}

            </p>

          </Reveal>

        </div>

      </section>


      {/* ==================================
          CAUSES
      ================================== */}

      <section className="causes-list">

        <div className="container causes-grid">

          {[...(causes.causes || [])]
            .sort(
              (a, b) =>
                Number(a.order || 0) -
                Number(b.order || 0)
            )
            .map(
              (cause, index) => {

                const image =
                  getMediaUrl(
                    cause.imageUrl
                  );


                return (

                  <Reveal
                    className="cause-card"
                    key={
                      cause._id ||
                      cause.id ||
                      `${cause.number}-${index}`
                    }
                    delay={
                      index * 0.08
                    }
                  >

                    {/* IMAGE */}

                    <div className="cause-image">

                      {image ? (

                        <img
                          src={image}
                          alt={
                            cause.title ||
                            "Charity cause"
                          }
                          loading="lazy"
                        />

                      ) : (

                        <div className="cause-image-placeholder">

                          <span>
                            {cause.number ||
                              String(
                                index + 1
                              ).padStart(
                                2,
                                "0"
                              )}
                          </span>

                        </div>

                      )}

                    </div>


                    {/* CONTENT */}

                    <div className="cause-content">

                      <span className="cause-number">

                        {cause.number ||
                          String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}

                      </span>


                      <div className="cause-text">

                        <h3>

                          {cause.title}

                        </h3>


                        <p>

                          {cause.description}

                        </p>

                      </div>

                    </div>

                  </Reveal>

                );

              }
            )}

        </div>

      </section>


      {/* ==================================
          APPROACH
      ================================== */}

      <section
        className="approach-section"

        style={
          approachBackground
            ? {
                backgroundImage:
                  `url(${approachBackground})`
              }
            : undefined
        }
      >

        <div className="approach-overlay"></div>


        <div className="container approach-container">

          <Reveal className="approach-content">

            <span className="causes-label">

              {causes.approach?.eyebrow ||
                "OUR APPROACH"}

            </span>


            <h2>

              {causes.approach?.title ||
                "Compassion in Action"}

            </h2>


            <span className="section-line left"></span>


            <p>

              {causes.approach?.description ||
                "We work through care, empowerment, advocacy and community partnerships to create meaningful change."}

            </p>

          </Reveal>

        </div>

      </section>


      {/* ==================================
          CTA
      ================================== */}

      <section className="causes-cta">

        <Reveal className="causes-cta-content">

          <span className="causes-label">

            {causes.cta?.eyebrow ||
              "MAKE A DIFFERENCE"}

          </span>


          <h2>

            {causes.cta?.title ||
              "Be Part of the Change"}

          </h2>


          <p>

            {causes.cta?.description ||
              "Your support can help us reach those who need it most."}

          </p>


          <div className="causes-cta-buttons">


            {/* DONATE */}

            <button
              type="button"
              className="donate-btn"

              onClick={
                onDonateClick
              }
            >

              <Heart
                size={18}
              />

              {causes.cta?.donateText ||
                "DONATE NOW"}

            </button>


            {/* GET INVOLVED */}

            <Link
              to="/get-involved"
              className="outline-btn"
            >

              {causes.cta?.involvedText ||
                "GET INVOLVED"}

              <ArrowRight
                size={18}
              />

            </Link>

          </div>

        </Reveal>

      </section>

    </main>

  );

};


export default OurCauses;