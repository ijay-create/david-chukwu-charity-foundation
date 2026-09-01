import { Link } from "react-router-dom";

import "../styles/CTA.css";
import ctaImg from "../assets/cta-bg.jpg";

const CTA = ({ onDonateClick }) => {
  return (
    <section
      className="cta"
      id="involved"
      style={{ backgroundImage: `url(${ctaImg})` }}
    >
      <div className="cta-overlay"></div>

      <div className="container cta-container">
        <div className="cta-content">

          <h2>Your Support Can Change a Life</h2>

          <p>
            Whether through giving, volunteering or partnership, you can help
            us extend hope and support to more people.
          </p>

          <div className="cta-buttons">

            {/* DONATE */}
            <button
              type="button"
              className="donate-btn"
              onClick={onDonateClick}
            >
              DONATE NOW
            </button>

            {/* GET INVOLVED */}
            <Link
              to="/get-involved"
              className="outline-btn"
            >
              GET INVOLVED
              <span aria-hidden="true">→</span>
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
};

export default CTA;