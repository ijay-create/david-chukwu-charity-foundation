import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import {
  Target,
  Eye,
  HandHeart,
  User,
  Users,
  Shield,
  UsersRound
} from "lucide-react";

import API from "../api/axios";

import "../styles/AboutUs.css";


// ======================================================
// API BASE URL
// ======================================================

const API_BASE_URL = "http://localhost:5000";


// ======================================================
// DEFAULT ABOUT DATA
// ======================================================

const defaultAbout = {
  hero: {
    imageUrl: ""
  },

  story: {
    eyebrow: "OUR STORY",
    title: "Who We Are",
    paragraphOne:
      "David Chukwu Charity Foundation is a non-profit organization committed to supporting widows, children, people with special needs, and the elderly.",
    paragraphTwo:
      "We provide essential resources, care and opportunities to help them live with dignity and hope."
  },

  mission: {
    eyebrow: "OUR MISSION",
    text:
      "To provide hope, support, and sustainable assistance to widows, orphaned children, people with special needs, and the elderly through charitable programs, advocacy, empowerment initiatives, and community partnerships."
  },

  vision: {
    eyebrow: "OUR VISION",
    text:
      "To create a compassionate society where vulnerable individuals are empowered, supported, and given equal opportunities to live with dignity, purpose, and hope."
  },

  founder: {
    eyebrow: "FOUNDER",
    name: "David Ejike Chukwu",
    paragraphOne:
      "Inspired by a passion to serve, David Chukwu founded the Foundation to be a source of hope and practical support for those who need it most.",
    paragraphTwo:
      "He believes compassion and opportunity can transform lives and build stronger communities.",
    imageUrl: ""
  },

  coreValues: [
    {
      title: "Compassion",
      subtitle: "We care deeply",
      icon: "HandHeart",
      order: 1
    },
    {
      title: "Dignity",
      subtitle: "We respect everyone",
      icon: "User",
      order: 2
    },
    {
      title: "Inclusion",
      subtitle: "We embrace diversity",
      icon: "Users",
      order: 3
    },
    {
      title: "Integrity",
      subtitle: "We act with honesty",
      icon: "Shield",
      order: 4
    },
    {
      title: "Community",
      subtitle: "We create impact together",
      icon: "UsersRound",
      order: 5
    }
  ],

  collaboration: {
    eyebrow: "IN COLLABORATION",
    title: "Stronger Together",
    description:
      "We are proud to collaborate with the Nicholas Mark Foundation to reach more people and create greater impact.",
    davidChukwuText:
      "Bringing hope, support and change",
    nicholasMarkText:
      "Bringing Hope, Restoring Lives",
    registrationNumber:
      "C.R. 07415712146",
    davidChukwuLogo: "",
    nicholasMarkLogo: ""
  }
};


// ======================================================
// VALUE ICONS
// ======================================================

const valueIcons = {
  HandHeart,
  User,
  Users,
  Shield,
  UsersRound
};


// ======================================================
// REVEAL ANIMATION
// ======================================================

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
        y: 40
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


// ======================================================
// ABOUT US
// ======================================================

const AboutUs = () => {

  const [about, setAbout] =
    useState(defaultAbout);

  const [loading, setLoading] =
    useState(true);


  // ====================================================
  // IMAGE URL
  // ====================================================

  const getImageUrl = (image) => {

    if (!image) {
      return "";
    }

    // Already a complete URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("blob:")
    ) {
      return image;
    }

    // Normalize image path
    const normalizedImage =
      image.startsWith("/")
        ? image
        : `/${image}`;

    return `${API_BASE_URL}${normalizedImage}`;
  };


  // ====================================================
  // FETCH ABOUT DATA
  // ====================================================

  const fetchAbout = async () => {

    try {

      setLoading(true);

      const response =
        await API.get("/about");

      console.log(
        "ABOUT API RESPONSE:",
        response.data
      );

      const serverAbout =
        response.data?.about;

      if (!serverAbout) {

        console.warn(
          "No About Us data returned from server."
        );

        return;
      }


      // ==================================================
      // MERGE SERVER DATA WITH DEFAULT DATA
      // ==================================================

      setAbout({

        hero: {
          ...defaultAbout.hero,
          ...(serverAbout.hero || {})
        },

        story: {
          ...defaultAbout.story,
          ...(serverAbout.story || {})
        },

        mission: {
          ...defaultAbout.mission,
          ...(serverAbout.mission || {})
        },

        vision: {
          ...defaultAbout.vision,
          ...(serverAbout.vision || {})
        },

        founder: {
          ...defaultAbout.founder,
          ...(serverAbout.founder || {})
        },

        coreValues:
          Array.isArray(
            serverAbout.coreValues
          )
            ? [...serverAbout.coreValues]
            : defaultAbout.coreValues,

        collaboration: {
          ...defaultAbout.collaboration,
          ...(serverAbout.collaboration || {})
        }

      });

    } catch (error) {

      console.error(
        "FETCH ABOUT ERROR:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  // ====================================================
  // LOAD DATA
  // ====================================================

  useEffect(() => {

    fetchAbout();

  }, []);


  // ====================================================
  // IMAGE URLS
  // ====================================================

  const heroImage =
    getImageUrl(
      about.hero?.imageUrl
    );

  const founderImage =
    getImageUrl(
      about.founder?.imageUrl
    );

  const davidLogo =
    getImageUrl(
      about.collaboration
        ?.davidChukwuLogo
    );

  const nicholasLogo =
    getImageUrl(
      about.collaboration
        ?.nicholasMarkLogo
    );


  // ====================================================
  // LOADING STATE
  // ====================================================

  if (loading) {

    return (
      <main className="about-page about-loading">

        <div className="about-loading-content">

          <div className="about-loading-spinner"></div>

          <p>
            Loading About Us...
          </p>

        </div>

      </main>
    );
  }


  // ====================================================
  // SORT CORE VALUES
  // ====================================================

  const sortedCoreValues =
    [...(about.coreValues || [])].sort(
      (a, b) =>
        (a.order || 0) -
        (b.order || 0)
    );


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <main className="about-page">


      {/* ==================================================
          HERO
      ================================================== */}

      <section
        className="about-hero"
        style={
          heroImage
            ? {
                backgroundImage:
                  `url("${heroImage}")`
              }
            : undefined
        }
      >

        <div className="about-hero-overlay"></div>

        <div className="container about-hero-container">

          <motion.div
            className="about-hero-content"

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

            <span className="about-label">
              ABOUT US
            </span>

            <h1>
              About Us
            </h1>

            <span className="about-underline"></span>

            <p>
              We bring hope and create
              lasting change in the lives
              of vulnerable individuals
              and communities.
            </p>

          </motion.div>

        </div>

      </section>


      {/* ==================================================
          OUR STORY
      ================================================== */}

      <section className="about-story">

        <Reveal
          className="about-story-content"
        >

          <span className="about-label">
            {about.story.eyebrow}
          </span>

          <h2>
            {about.story.title}
          </h2>

          <span className="section-underline"></span>

          <p>
            {about.story.paragraphOne}
          </p>

          {about.story.paragraphTwo && (
            <p>
              {about.story.paragraphTwo}
            </p>
          )}

        </Reveal>

      </section>


      {/* ==================================================
          MISSION & VISION
      ================================================== */}

      <section className="mission-vision">

        <div className="container mission-grid">


          {/* MISSION */}

          <Reveal
            className="mission-card"
          >

            <div className="mission-icon">

              <Target />

            </div>

            <div>

              <span className="about-label">
                {about.mission.eyebrow}
              </span>

              <p>
                {about.mission.text}
              </p>

            </div>

          </Reveal>


          {/* VISION */}

          <Reveal
            className="mission-card"
            delay={0.1}
          >

            <div className="mission-icon">

              <Eye />

            </div>

            <div>

              <span className="about-label">
                {about.vision.eyebrow}
              </span>

              <p>
                {about.vision.text}
              </p>

            </div>

          </Reveal>

        </div>

      </section>


      {/* ==================================================
          FOUNDER
      ================================================== */}

      <section className="founder-section">

        <div className="container founder-grid">


          {/* FOUNDER IMAGE */}

          <Reveal
            className="founder-image"
          >

            {founderImage ? (

              <img
                src={founderImage}
                alt={
                  about.founder.name ||
                  "Founder"
                }

                onError={(event) => {

                  console.error(
                    "FOUNDER IMAGE FAILED:",
                    founderImage
                  );

                  event.currentTarget.style.display =
                    "none";

                }}
              />

            ) : (

              <div className="image-placeholder">

                Founder Image

              </div>

            )}

          </Reveal>


          {/* FOUNDER CONTENT */}

          <Reveal
            className="founder-content"
            delay={0.1}
          >

            <span className="about-label">
              {about.founder.eyebrow}
            </span>

            <h2>
              {about.founder.name}
            </h2>

            <span className="section-underline left"></span>

            <p>
              {about.founder.paragraphOne}
            </p>

            {about.founder.paragraphTwo && (
              <p>
                {about.founder.paragraphTwo}
              </p>
            )}

          </Reveal>

        </div>

      </section>


      {/* ==================================================
          CORE VALUES
      ================================================== */}

      <section className="values-section">

        <div className="container">


          <Reveal
            className="values-header"
          >

            <span className="about-label">
              OUR CORE VALUES
            </span>

          </Reveal>


          <div className="values-grid">

            {sortedCoreValues.map(
              (value, index) => {

                const Icon =
                  valueIcons[
                    value.icon
                  ] ||
                  HandHeart;

                return (

                  <Reveal
                    className="value-card"
                    delay={index * 0.08}
                    key={
                      value._id ||
                      `${value.title}-${index}`
                    }
                  >

                    <div className="value-icon">

                      <Icon />

                    </div>

                    <h3>
                      {value.title}
                    </h3>

                    <p>
                      {value.subtitle}
                    </p>

                  </Reveal>

                );

              }
            )}

          </div>

        </div>

      </section>


      {/* ==================================================
          COLLABORATION
      ================================================== */}

      <section className="collaboration-section">

        <div className="container collaboration-grid">


          {/* CONTENT */}

          <Reveal
            className="collaboration-content"
          >

            <span className="about-label">
              {about.collaboration.eyebrow}
            </span>

            <h2>
              {about.collaboration.title}
            </h2>

            <span className="section-underline left"></span>

            <p>
              {about.collaboration.description}
            </p>

          </Reveal>


          {/* PARTNERS */}

          <Reveal
            className="partners-container"
            delay={0.15}
          >


            {/* DAVID CHUKWU */}

            <div className="partner">

              {davidLogo ? (

                <img
                  src={davidLogo}
                  alt="David Chukwu Charity Foundation"

                  onError={(event) => {

                    console.error(
                      "DAVID LOGO FAILED:",
                      davidLogo
                    );

                    event.currentTarget.style.display =
                      "none";

                  }}
                />

              ) : (

                <div className="partner-logo-placeholder">
                  Logo
                </div>

              )}

              <p>

                DAVID CHUKWU CHARITY FOUNDATION

                <span>
                  {
                    about.collaboration
                      .davidChukwuText
                  }
                </span>

              </p>

            </div>


            {/* DIVIDER */}

            <div className="partner-divider"></div>


            {/* NICHOLAS MARK */}

            <div className="partner">

              {nicholasLogo ? (

                <img
                  src={nicholasLogo}
                  alt="Nicholas Mark Foundation"

                  onError={(event) => {

                    console.error(
                      "NICHOLAS LOGO FAILED:",
                      nicholasLogo
                    );

                    event.currentTarget.style.display =
                      "none";

                  }}
                />

              ) : (

                <div className="partner-logo-placeholder">
                  Logo
                </div>

              )}

              <p>

                NICHOLAS MARK FOUNDATION

                <span>
                  {
                    about.collaboration
                      .nicholasMarkText
                  }
                </span>

                <span>
                  {
                    about.collaboration
                      .registrationNumber
                  }
                </span>

              </p>

            </div>


          </Reveal>

        </div>

      </section>


    </main>

  );
};


export default AboutUs;