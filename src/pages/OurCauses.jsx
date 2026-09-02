import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

import "../styles/OurCauses.css";

import causesHeroImg from "../assets/causes-hero.jpg";
import approachImg from "../assets/approach-bg.jpg";

// ============================================================
// API CONFIGURATION
// ============================================================

const API_URL =
  `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/causes`;

const SERVER_URL =
  "https://david-chukwu-charity-api.onrender.com";

// ============================================================
// DEFAULT FALLBACK DATA
// ============================================================

const defaultCauses = {
  hero: {
    title: "Our Causes",
    subtitle:
      "Creating lasting change by supporting communities, empowering lives, and restoring hope.",
    imageUrl: "",
  },

  intro: {
    eyebrow: "WHAT WE DO",
    title: "Causes That Matter",
    description:
      "We are committed to addressing the needs of vulnerable individuals and communities through practical, compassionate, and sustainable initiatives.",
  },

  causes: [
    {
      id: 1,
      order: 1,
      title: "Education & Empowerment",
      description:
        "Providing educational opportunities, learning resources, and support that help children and young people build brighter futures.",
      imageUrl: "",
    },

    {
      id: 2,
      order: 2,
      title: "Community Development",
      description:
        "Supporting communities with initiatives designed to improve living conditions, create opportunities, and promote sustainable development.",
      imageUrl: "",
    },

    {
      id: 3,
      order: 3,
      title: "Healthcare Support",
      description:
        "Helping vulnerable individuals and families gain access to essential healthcare, medical assistance, and wellness support.",
      imageUrl: "",
    },

    {
      id: 4,
      order: 4,
      title: "Food & Basic Needs",
      description:
        "Providing food, essential supplies, and immediate assistance to individuals and families facing difficult circumstances.",
      imageUrl: "",
    },

    {
      id: 5,
      order: 5,
      title: "Youth Development",
      description:
        "Creating opportunities for young people through mentorship, skills development, leadership, and empowerment programs.",
      imageUrl: "",
    },
  ],

  approach: {
    eyebrow: "OUR APPROACH",
    title: "Creating Impact That Lasts",
    description:
      "Our work focuses on more than immediate relief. We seek to empower people, strengthen communities, and create sustainable opportunities that continue to make a difference.",
    imageUrl: "",
  },

  cta: {
    title: "Be Part of the Change",
    description:
      "Your support can help us reach more people, strengthen communities, and create meaningful opportunities for those who need them most.",
  },
};

// ============================================================
// OUR CAUSES
// ============================================================

const OurCauses = ({ onDonateClick }) => {
  const [causes, setCauses] =
    useState(defaultCauses);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  // ============================================================
  // MEDIA URL HELPER
  // ============================================================

  const getMediaUrl = (imageUrl) => {
    if (!imageUrl) {
      return "";
    }

    // Cloudinary / external URL
    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://") ||
      imageUrl.startsWith("blob:")
    ) {
      return imageUrl;
    }

    // Local backend uploads
    if (
      imageUrl.startsWith("/uploads")
    ) {
      return `${SERVER_URL}${imageUrl}`;
    }

    return imageUrl;
  };

  // ============================================================
  // FETCH CAUSES
  // ============================================================

  const fetchCauses = async () => {
    try {
      setLoading(true);
      setError(false);

      const response =
        await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          "Failed to fetch causes"
        );
      }

      const data =
        await response.json();

      if (data) {
        setCauses({
          ...defaultCauses,
          ...data,
          hero: {
            ...defaultCauses.hero,
            ...(data.hero || {}),
          },
          intro: {
            ...defaultCauses.intro,
            ...(data.intro || {}),
          },
          causes:
            Array.isArray(data.causes)
              ? data.causes
              : defaultCauses.causes,
          approach: {
            ...defaultCauses.approach,
            ...(data.approach || {}),
          },
          cta: {
            ...defaultCauses.cta,
            ...(data.cta || {}),
          },
        });
      }
    } catch (err) {
      console.error(
        "CAUSES FETCH ERROR:",
        err
      );

      setError(true);

      // Keep fallback data visible
      setCauses(defaultCauses);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchCauses();
  }, []);

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <main className="our-causes-page">
        <section className="causes-loading">
          <RefreshCw
            size={36}
            className="loading-icon"
          />

          <p>
            Loading our causes...
          </p>
        </section>
      </main>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="our-causes-page">

      {/* ======================================================
          HERO SECTION
      ====================================================== */}

      <section
        className="causes-hero"
        style={{
          backgroundImage: `url(${
            getMediaUrl(
              causes.hero?.imageUrl
            ) || causesHeroImg
          })`,
        }}
      >
        <div className="causes-hero-overlay">
          <motion.div
            className="causes-hero-content"
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <span className="causes-hero-eyebrow">
              DAVID CHUKWU CHARITY FOUNDATION
            </span>

            <h1>
              {causes.hero?.title ||
                "Our Causes"}
            </h1>

            <p>
              {causes.hero?.subtitle ||
                "Creating lasting change by supporting communities, empowering lives, and restoring hope."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ======================================================
          INTRO SECTION
      ====================================================== */}

      <section className="causes-intro">
        <div className="container">

          <motion.div
            className="causes-intro-content"
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            <span className="section-eyebrow">
              {causes.intro?.eyebrow ||
                "WHAT WE DO"}
            </span>

            <h2>
              {causes.intro?.title ||
                "Causes That Matter"}
            </h2>

            <p>
              {causes.intro?.description ||
                "We are committed to addressing the needs of vulnerable individuals and communities through practical, compassionate, and sustainable initiatives."}
            </p>
          </motion.div>

        </div>
      </section>

      {/* ======================================================
          CAUSES GRID
      ====================================================== */}

      <section className="causes-list-section">
        <div className="container">

          <div className="causes-grid">

            {causes.causes
              ?.sort(
                (a, b) =>
                  (a.order || 0) -
                  (b.order || 0)
              )
              .map((cause, index) => {

                const image =
                  getMediaUrl(
                    cause.imageUrl
                  );

                return (
                  <motion.article
                    key={
                      cause.id ||
                      cause._id ||
                      index
                    }
                    className="cause-card"
                    initial={{
                      opacity: 0,
                      y: 40,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.15,
                    }}
                    transition={{
                      duration: 0.6,
                      delay:
                        index * 0.08,
                    }}
                  >

                    {/* IMAGE */}

                    {image ? (
                      <div className="cause-card-image">
                        <img
                          src={image}
                          alt={
                            cause.title ||
                            "Charity cause"
                          }
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="cause-card-image cause-card-image-placeholder">
                        <Heart
                          size={42}
                        />
                      </div>
                    )}

                    {/* CONTENT */}

                    <div className="cause-card-content">

                      <span className="cause-number">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <h3>
                        {cause.title}
                      </h3>

                      <p>
                        {cause.description}
                      </p>

                      <Link
                        to="/donate"
                        className="cause-card-link"
                      >
                        Support This Cause

                        <ArrowRight
                          size={18}
                        />
                      </Link>

                    </div>

                  </motion.article>
                );
              })}

          </div>

        </div>
      </section>

      {/* ======================================================
          APPROACH SECTION
      ====================================================== */}

      <section
        className="causes-approach"
        style={{
          backgroundImage: `url(${
            getMediaUrl(
              causes.approach?.imageUrl
            ) || approachImg
          })`,
        }}
      >
        <div className="causes-approach-overlay">

          <div className="container">

            <motion.div
              className="causes-approach-content"
              initial={{
                opacity: 0,
                x: -40,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.8,
              }}
            >

              <span className="section-eyebrow">
                {causes.approach?.eyebrow ||
                  "OUR APPROACH"}
              </span>

              <h2>
                {causes.approach?.title ||
                  "Creating Impact That Lasts"}
              </h2>

              <p>
                {causes.approach?.description ||
                  "Our work focuses on more than immediate relief. We seek to empower people, strengthen communities, and create sustainable opportunities that continue to make a difference."}
              </p>

            </motion.div>

          </div>

        </div>
      </section>

      {/* ======================================================
          CTA SECTION
      ====================================================== */}

      <section className="causes-cta">
        <div className="container">

          <motion.div
            className="causes-cta-content"
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
            }}
          >

            <div className="causes-cta-icon">
              <Heart
                size={32}
              />
            </div>

            <h2>
              {causes.cta?.title ||
                "Be Part of the Change"}
            </h2>

            <p>
              {causes.cta?.description ||
                "Your support can help us reach more people, strengthen communities, and create meaningful opportunities for those who need them most."}
            </p>

            <button
              type="button"
              className="causes-cta-button"
              onClick={onDonateClick}
            >
              Donate Now

              <ArrowRight
                size={19}
              />
            </button>

          </motion.div>

        </div>
      </section>

    </main>
  );
};

export default OurCauses;