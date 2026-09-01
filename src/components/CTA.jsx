import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/axios";

import "../styles/CTA.css";
import ctaImg from "../assets/cta-bg.jpg";

const CTA = ({ onDonateClick }) => {
  const [cta, setCta] = useState({
    eyebrow: "Make a Difference",
    title: "Your Support Can Change a Life",
    description:
      "Whether through giving, volunteering or partnership, you can help us extend hope and support to more people.",
    buttonText: "DONATE NOW",
  });

  const [loading, setLoading] = useState(true);

  /* ============================================================
     FETCH CTA SETTINGS
  ============================================================ */

  const fetchCTA = async () => {
    try {
      setLoading(true);

      const response = await API.get("/settings");

      if (response.data?.success) {
        const ctaSettings =
          response.data.settings?.homepage?.cta;

        if (ctaSettings) {
          setCta({
            eyebrow:
              ctaSettings.eyebrow ||
              "Make a Difference",

            title:
              ctaSettings.title ||
              "Your Support Can Change a Life",

            description:
              ctaSettings.description ||
              "Whether through giving, volunteering or partnership, you can help us extend hope and support to more people.",

            buttonText:
              ctaSettings.buttonText ||
              "DONATE NOW",
          });
        }
      }
    } catch (error) {
      console.error(
        "FETCH CTA SETTINGS ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     LOAD SETTINGS
  ============================================================ */

  useEffect(() => {
    fetchCTA();
  }, []);

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <section
      className="cta"
      id="involved"
      style={{
        backgroundImage: `url(${ctaImg})`,
      }}
    >
      <div className="cta-overlay"></div>

      <div className="container cta-container">
        <div className="cta-content">

          {/* EYEBROW */}
          <span className="cta-eyebrow">
            {loading
              ? "Make a Difference"
              : cta.eyebrow}
          </span>

          {/* TITLE */}
          <h2>
            {loading
              ? "Your Support Can Change a Life"
              : cta.title}
          </h2>

          {/* DESCRIPTION */}
          <p>
            {loading
              ? "Whether through giving, volunteering or partnership, you can help us extend hope and support to more people."
              : cta.description}
          </p>

          {/* BUTTONS */}
          <div className="cta-buttons">

            {/* DONATE */}
            <button
              type="button"
              className="donate-btn"
              onClick={onDonateClick}
            >
              {cta.buttonText || "DONATE NOW"}
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