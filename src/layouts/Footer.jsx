import { Link, useLocation } from "react-router-dom";

import "../styles/Footer.css";

import defaultLogo from "../assets/logo.png";

/* =========================================================
   SOCIAL ICONS
========================================================= */

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M14 8h3V4h-3c-3.3 0-5 1.7-5 5v3H6v4h3v5h4v-5h3l1-4h-4V9c0-.7.3-1 1-1Z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 8v11M5 5v.1M10 19v-6a4 4 0 0 1 8 0v6M10 8v11" />
  </svg>
);

/* =========================================================
   CONTACT ICONS
========================================================= */

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 4h3l2 5-2 1.5a16 16 0 0 0 5.5 5.5L15 14l5 2v3c0 1-.5 1.5-2 1.5C10 20.5 3.5 14 3.5 6c0-1 .5-2 1.5-2Z" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

/* =========================================================
   ADMIN ICON
========================================================= */

const AdminIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect
      x="3"
      y="11"
      width="18"
      height="10"
      rx="2"
    />

    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

/* =========================================================
   GET SAVED LOGO
========================================================= */

const getSavedLogo = () => {
  try {
    const footerLogo = localStorage.getItem("footerLogo");

    if (footerLogo) {
      return footerLogo;
    }

    const siteLogo = localStorage.getItem("siteLogo");

    if (siteLogo) {
      return siteLogo;
    }

    const logo = localStorage.getItem("logo");

    if (logo) {
      return logo;
    }

    const adminSettings = localStorage.getItem("adminSettings");

    if (adminSettings) {
      const parsedSettings = JSON.parse(adminSettings);

      if (parsedSettings?.logo) {
        return parsedSettings.logo;
      }

      if (parsedSettings?.footerLogo) {
        return parsedSettings.footerLogo;
      }

      if (parsedSettings?.siteLogo) {
        return parsedSettings.siteLogo;
      }
    }
  } catch (error) {
    console.error(
      "Unable to load saved footer logo:",
      error
    );
  }

  return defaultLogo;
};

/* =========================================================
   FOOTER
========================================================= */

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const location = useLocation();

  const logo = getSavedLogo();

  /* =======================================================
     CONTACT NAVIGATION
     
     If already on the homepage, scroll to contact.
     Otherwise navigate to homepage and pass the section
     information through router state.
  ======================================================= */

  const handleContactNavigation = () => {
    if (location.pathname === "/") {
      setTimeout(() => {
        const contactSection = document.getElementById("contact");

        if (contactSection) {
          contactSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  };

  return (
    <footer
      className="footer"
      id="contact"
    >

      <div className="container footer-container">

        {/* =================================================
            MAIN FOOTER
        ================================================= */}

        <div className="footer-grid">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="footer-brand">

            <Link
              to="/"
              className="footer-logo"
              aria-label="David Chukwu Charity Foundation home"
            >
              <img
                src={logo}
                alt="David Chukwu Charity Foundation"
                onError={(event) => {
                  event.currentTarget.src = defaultLogo;
                }}
              />
            </Link>

            <p className="footer-description">
              Bringing hope, support and positive change to
              vulnerable individuals and communities through
              compassion, dignity and meaningful action.
            </p>

            {/* =================================================
                SOCIAL MEDIA
            ================================================= */}

            <div className="social-links">

              {/* FACEBOOK */}

              <a
                href="https://www.facebook.com/share/1QC3CnRVjm/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="David Chukwu Charity Foundation on Facebook"
                title="Facebook"
              >
                <FacebookIcon />
              </a>

              {/* INSTAGRAM */}

              <a
                href="https://www.instagram.com/david.chukwucharityfoundation?igsh=MTk0MmtvaXdoNXVkZg=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="David Chukwu Charity Foundation on Instagram"
                title="Instagram"
              >
                <InstagramIcon />
              </a>

              {/* LINKEDIN */}

              <a
                href="#"
                aria-label="David Chukwu Charity Foundation on LinkedIn"
                title="LinkedIn"
              >
                <LinkedInIcon />
              </a>

            </div>

          </div>

          {/* =================================================
              QUICK LINKS
          ================================================= */}

          <nav
            className="footer-column"
            aria-label="Quick Links"
          >

            <h3>Quick Links</h3>

            <Link to="/">
              Home
            </Link>

            <Link to="/causes">
              Our Causes
            </Link>

            <Link to="/impact">
              Our Impact
            </Link>

            <Link to="/get-involved">
              Get Involved
            </Link>

            <Link to="/about">
              About Us
            </Link>

            <Link
              to="/"
              onClick={handleContactNavigation}
            >
              Contact Us
            </Link>

          </nav>

          {/* =================================================
              OUR CAUSES
          ================================================= */}

          <nav
            className="footer-column"
            aria-label="Our Causes"
          >

            <h3>Our Causes</h3>

            <Link to="/causes">
              Widows Support
            </Link>

            <Link to="/causes">
              Child Welfare
            </Link>

            <Link to="/causes">
              Special Needs
            </Link>

            <Link to="/causes">
              Elderly Care
            </Link>

            <Link to="/causes">
              Community Outreach
            </Link>

          </nav>

          {/* =================================================
              GET INVOLVED
          ================================================= */}

          <nav
            className="footer-column"
            aria-label="Get Involved"
          >

            <h3>Get Involved</h3>

            <Link to="/get-involved">
              Volunteer
            </Link>

            <Link to="/get-involved">
              Partner With Us
            </Link>

            <Link to="/get-involved">
              Sponsor a Project
            </Link>

            <Link to="/get-involved">
              Donate
            </Link>

          </nav>

          {/* =================================================
              CONTACT
          ================================================= */}

          <div className="footer-column footer-contact">

            <h3>Contact Us</h3>

            {/* PHONE */}

            <div className="footer-contact-item">

              <PhoneIcon />

              <a href="tel:+447861093693">
                +44 7861 093693
              </a>

            </div>

            {/* EMAIL */}

            <div className="footer-contact-item">

              <EmailIcon />

              <a href="mailto:info@davidchukwu.org.com">
                info@davidchukwu.org.com
              </a>

            </div>

            {/* LOCATION */}

            <div className="footer-contact-item">

              <LocationIcon />

              <span>
                United Kingdom
              </span>

            </div>

          </div>

        </div>

        {/* =================================================
            FOOTER LOWER AREA
        ================================================= */}

        <div className="footer-lower">

          <div className="footer-lower-content">

            <p>
              © {currentYear} David Chukwu Charity Foundation.
              All rights reserved.
            </p>

            <div className="footer-legal">

              <Link to="/privacy-policy">
                Privacy Policy
              </Link>

              <span aria-hidden="true">
                •
              </span>

              <Link to="/terms-of-use">
                Terms of Use
              </Link>

            </div>

          </div>

        </div>

        {/* =================================================
            DISCREET ADMIN ACCESS
        ================================================= */}

        <div className="admin-access">

          <Link
            to="/admin/login"
            aria-label="Administrator login"
            title="Administrator login"
          >
            <AdminIcon />
          </Link>

        </div>

      </div>

    </footer>
  );
};

export default Footer;