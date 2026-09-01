import {
  useEffect,
  useState
} from "react";

import {
  motion
} from "framer-motion";

import {
  Link
} from "react-router-dom";

import {
  Users,
  Network,
  Handshake,
  UsersRound,
  ArrowRight,
  Heart,
  Image as ImageIcon,
  RefreshCw
} from "lucide-react";

import "../styles/OurImpact.css";


// ========================================
// API
// ========================================

const API_URL =
  "http://localhost:5000/api/impact";

const SERVER_URL =
  "http://localhost:5000";


// ========================================
// DEFAULT IMPACT DATA
// ========================================

const defaultImpact = {

  hero: {
    eyebrow: "OUR IMPACT",
    title: "Our Impact",
    tagline:
      "Real change, Stronger communities",
    lineOne:
      "Real change, Stronger communities",
    lineTwo:
      "A better tomorrow",
    imageUrl: ""
  },

  projects: [
    {
      title:
        "Widows Support Outreach",

      text:
        "We provided food items, cash grants and skills support to widows to help them strengthen their livelihoods.",

      imageUrl: "",

      order: 1
    },

    {
      title:
        "Children Support Program",

      text:
        "We supported children in underserved communities with school supplies, learning material and care.",

      imageUrl: "",

      order: 2
    },

    {
      title:
        "Elderly Care Outreach",

      text:
        "We provided essential items, medical support and companionship to improve the well-being of elderly individuals.",

      imageUrl: "",

      order: 3
    }
  ],

  gallery: [
    {
      imageUrl: "",
      alt: "Children holding books",
      order: 1
    },

    {
      imageUrl: "",
      alt:
        "People receiving support packages",
      order: 2
    },

    {
      imageUrl: "",
      alt: "Children smiling",
      order: 3
    },

    {
      imageUrl: "",
      alt:
        "Men receiving support packages",
      order: 4
    },

    {
      imageUrl: "",
      alt: "Widows receiving support",
      order: 5
    }
  ],

  stats: [
    {
      icon: "Users",
      number: "412+",
      label: "Lives Supported",
      order: 1
    },

    {
      icon: "Network",
      number: "13+",
      label: "Communities Reached",
      order: 2
    },

    {
      icon: "Handshake",
      number: "7+",
      label: "Outreach Programs",
      order: 3
    },

    {
      icon: "UsersRound",
      number: "38+",
      label: "Volunteers",
      order: 4
    }
  ],

  testimonials: [
    {
      imageUrl: "",

      quote:
        "The support I received gave me hope and strength.",

      name:
        "Mrs. Ngozi, Widow",

      order: 1
    },

    {
      imageUrl: "",

      quote:
        "I am so grateful for the books and school items. They help me learn better.",

      name:
        "Joshua, Student",

      order: 2
    }
  ],

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
// STAT ICON MAP
// ========================================

const statIconMap = {

  Users,

  Network,

  Handshake,

  UsersRound

};


// ========================================
// MEDIA URL
// ========================================

const getMediaUrl = (
  fileUrl
) => {

  if (!fileUrl) {
    return "";
  }


  if (
    fileUrl.startsWith(
      "http://"
    ) ||
    fileUrl.startsWith(
      "https://"
    ) ||
    fileUrl.startsWith(
      "blob:"
    )
  ) {

    return fileUrl;

  }


  return `${SERVER_URL}${fileUrl}`;

};


// ========================================
// SORT ITEMS
// ========================================

const sortByOrder = (
  items
) => {

  if (
    !Array.isArray(items)
  ) {

    return [];

  }


  return [...items].sort(
    (a, b) =>
      Number(a?.order || 0) -
      Number(b?.order || 0)
  );

};


// ========================================
// NORMALIZE BACKEND DATA
// ========================================

const normalizeImpact = (
  data
) => {

  return {

    hero: {

      ...defaultImpact.hero,

      ...(data?.hero || {})

    },


    projects:
      Array.isArray(
        data?.projects
      )
        ? sortByOrder(
            data.projects
          )
        : defaultImpact.projects,


    gallery:
      Array.isArray(
        data?.gallery
      )
        ? sortByOrder(
            data.gallery
          )
        : defaultImpact.gallery,


    stats:
      Array.isArray(
        data?.stats
      )
        ? sortByOrder(
            data.stats
          )
        : defaultImpact.stats,


    testimonials:
      Array.isArray(
        data?.testimonials
      )
        ? sortByOrder(
            data.testimonials
          )
        : defaultImpact.testimonials,


    cta: {

      ...defaultImpact.cta,

      ...(data?.cta || {})

    }

  };

};


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

      className={
        className
      }

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
// OUR IMPACT
// ========================================

const OurImpact = ({
  onDonateClick
}) => {

  const [
    impact,
    setImpact
  ] = useState(
    defaultImpact
  );


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  // ======================================
  // LOAD IMPACT
  // ======================================

  const loadImpact = async () => {

    try {

      setLoading(true);

      setError("");


      const response =
        await fetch(
          API_URL
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          "Unable to load impact content."
        );

      }


      const normalized =
        normalizeImpact(
          data.impact
        );


      setImpact(
        normalized
      );

    } catch (
      loadError
    ) {

      console.error(
        "LOAD IMPACT ERROR:",
        loadError
      );


      setError(
        loadError.message ||
        "Unable to load our impact."
      );

    } finally {

      setLoading(false);

    }

  };


  // ======================================
  // INITIAL LOAD
  // ======================================

  useEffect(() => {

    loadImpact();

  }, []);


  // ======================================
  // LOADING STATE
  // ======================================

  if (loading) {

    return (

      <main className="impact-page">

        <section className="impact-loading">

          <RefreshCw
            size={42}
            className="impact-loading-icon"
          />

          <h2>
            Loading Our Impact...
          </h2>

          <p>
            Connecting to the Foundation's
            impact database.
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

      <main className="impact-page">

        <section className="impact-error">

          <div className="impact-error-icon">

            <ImageIcon
              size={38}
            />

          </div>


          <h2>
            Unable to Load Our Impact
          </h2>


          <p>
            {error}
          </p>


          <button
            type="button"
            className="impact-retry-button"
            onClick={
              loadImpact
            }
          >

            <RefreshCw
              size={17}
            />

            Try Again

          </button>

        </section>

      </main>

    );

  }


  return (

    <main className="impact-page">


      {/* ========================================
          HERO
      ======================================== */}

      <section

        className="impact-hero"

        style={{
          backgroundImage:
            impact.hero.imageUrl
              ? `url(${getMediaUrl(
                  impact.hero.imageUrl
                )})`
              : "none"
        }}

      >

        <div
          className=
            "impact-hero-overlay"
        />


        <div className="container impact-hero-container">

          <motion.div

            className=
              "impact-hero-content"

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

            {impact.hero.eyebrow && (

              <span className="impact-label">

                {
                  impact.hero
                    .eyebrow
                }

              </span>

            )}


            <h1>

              {
                impact.hero
                  .title
              }

            </h1>


            <span
              className=
                "impact-underline"
            />


            {impact.hero.lineOne && (

              <p>

                {
                  impact.hero
                    .lineOne
                }

              </p>

            )}


            {impact.hero.lineTwo && (

              <p>

                {
                  impact.hero
                    .lineTwo
                }

              </p>

            )}

          </motion.div>

        </div>

      </section>


      {/* ========================================
          OUTREACH & PROJECTS
      ======================================== */}

      <section className="impact-projects">

        <div className="container">


          <Reveal
            className=
              "impact-section-header"
          >

            <span className="impact-label">

              MAKING A DIFFERENCE,
              ONE COMMUNITY AT A TIME

            </span>


            <h2>

              Latest Outreach &amp;
              Projects

            </h2>


            <span
              className=
                "impact-section-underline"
            />

          </Reveal>


          <div className="impact-project-grid">

            {impact.projects.map(
              (
                project,
                index
              ) => {

                const image =
                  getMediaUrl(
                    project.imageUrl
                  );


                return (

                  <Reveal

                    className=
                      "impact-project-card"

                    delay={
                      index * 0.1
                    }

                    key={
                      project._id ||
                      `${project.title}-${index}`
                    }

                  >

                    {/* IMAGE */}

                    <div className="impact-project-image">

                      {image ? (

                        <img
                          src={image}
                          alt={
                            project.title ||
                            `Impact project ${
                              index + 1
                            }`
                          }
                          loading="lazy"
                        />

                      ) : (

                        <div className="impact-image-placeholder">

                          <ImageIcon
                            size={40}
                          />

                          <span>
                            No image
                          </span>

                        </div>

                      )}

                    </div>


                    {/* CONTENT */}

                    <div className="impact-project-content">

                      <span className="project-number">

                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}

                      </span>


                      <div>

                        <h3>
                          {
                            project.title
                          }
                        </h3>


                        <p>
                          {
                            project.text
                          }
                        </p>

                      </div>

                    </div>

                  </Reveal>

                );

              }
            )}

          </div>

        </div>

      </section>


      {/* ========================================
          MOMENTS OF IMPACT
      ======================================== */}

      <section className="impact-gallery">

        <div className="container">


          <Reveal
            className=
              "impact-section-header"
          >

            <h2>
              Moments of Impact
            </h2>


            <span
              className=
                "impact-section-underline"
            />

          </Reveal>


          <div className="impact-gallery-grid">

            {impact.gallery.map(
              (
                item,
                index
              ) => {

                const image =
                  getMediaUrl(
                    item.imageUrl
                  );


                return (

                  <Reveal

                    className={`impact-gallery-item gallery-item-${
                      index + 1
                    }`}

                    delay={
                      index * 0.06
                    }

                    key={
                      item._id ||
                      `${item.alt}-${index}`
                    }

                  >

                    {image ? (

                      <img

                        src={image}

                        alt={
                          item.alt ||
                          `Impact gallery image ${
                            index + 1
                          }`
                        }

                        loading="lazy"

                      />

                    ) : (

                      <div className="impact-gallery-placeholder">

                        <ImageIcon
                          size={35}
                        />

                        <span>
                          No image
                        </span>

                      </div>

                    )}

                  </Reveal>

                );

              }
            )}

          </div>


          <Link

            to="/gallery"

            className=
              "impact-gallery-button"

          >

            View Full Gallery

            <ArrowRight
              size={17}
            />

          </Link>

        </div>

      </section>


      {/* ========================================
          IMPACT IN NUMBERS
      ======================================== */}

      <section className="impact-numbers">

        <div className="container impact-numbers-container">


          <Reveal
            className=
              "impact-section-header"
          >

            <h2>
              Our Impact in Numbers
            </h2>

          </Reveal>


          <div className="impact-stats-grid">

            {impact.stats.map(
              (
                stat,
                index
              ) => {

                const Icon =
                  statIconMap[
                    stat.icon
                  ] || Users;


                return (

                  <Reveal

                    className=
                      "impact-stat"

                    delay={
                      index * 0.08
                    }

                    key={
                      stat._id ||
                      `${stat.label}-${index}`
                    }

                  >

                    <Icon
                      className=
                        "impact-stat-icon"
                    />


                    <strong>
                      {
                        stat.number
                      }
                    </strong>


                    <span>
                      {
                        stat.label
                      }
                    </span>

                  </Reveal>

                );

              }
            )}

          </div>

        </div>

      </section>


      {/* ========================================
          STORIES THAT INSPIRE
      ======================================== */}

      <section className="impact-stories">

        <div className="container">


          <Reveal
            className=
              "impact-section-header"
          >

            <h2>
              Stories That Inspire
            </h2>


            <span
              className=
                "impact-section-underline"
            />

          </Reveal>


          <div className="testimonial-grid">

            {impact.testimonials.map(
              (
                testimonial,
                index
              ) => {

                const image =
                  getMediaUrl(
                    testimonial.imageUrl
                  );


                return (

                  <Reveal

                    className=
                      "testimonial-card"

                    delay={
                      index * 0.1
                    }

                    key={
                      testimonial._id ||
                      `${testimonial.name}-${index}`
                    }

                  >

                    {/* TESTIMONIAL IMAGE */}

                    {image ? (

                      <img

                        src={image}

                        alt={
                          testimonial.name ||
                          "Impact testimonial"
                        }

                        loading="lazy"

                      />

                    ) : (

                      <div className="testimonial-image-placeholder">

                        <Users
                          size={38}
                        />

                      </div>

                    )}


                    {/* TESTIMONIAL CONTENT */}

                    <div className="testimonial-content">

                      <p>

                        "{testimonial.quote}"

                      </p>


                      <span>

                        {
                          testimonial.name
                        }

                      </span>

                    </div>

                  </Reveal>

                );

              }
            )}

          </div>

        </div>

      </section>


      {/* ========================================
          CTA
      ======================================== */}

      <section className="impact-cta">

        <div className="container impact-cta-container">


          <Reveal>


            {impact.cta.eyebrow && (

              <span className="impact-label">

                {
                  impact.cta
                    .eyebrow
                }

              </span>

            )}


            <h2>

              {
                impact.cta
                  .title
              }

            </h2>


            <p>

              {
                impact.cta
                  .description
              }

            </p>


            <div className="impact-cta-buttons">


              {/* DONATE */}

              <button

                type="button"

                className=
                  "impact-donate-button"

                onClick={
                  onDonateClick
                }

              >

                <Heart
                  size={17}
                />

                {
                  impact.cta
                    .donateText ||
                  "DONATE NOW"
                }

              </button>


              {/* GET INVOLVED */}

              <Link

                to="/get-involved"

                className=
                  "impact-involved-button"

              >

                {
                  impact.cta
                    .involvedText ||
                  "GET INVOLVED"
                }


                <ArrowRight
                  size={17}
                />

              </Link>

            </div>

          </Reveal>

        </div>

      </section>

    </main>

  );

};


export default OurImpact;