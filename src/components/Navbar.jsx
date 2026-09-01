import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";

import "../styles/Navbar.css";
import logo from "../assets/logo.png";

const Navbar = ({ onDonateClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleDonate = () => {
    closeMenu();

    if (onDonateClick) {
      onDonateClick();
    }
  };

  // ========================================
  // ACTIVE ROUTES
  // ========================================

  const isHome = location.pathname === "/";
  const isAbout = location.pathname === "/about";
  const isCauses = location.pathname === "/causes";
  const isImpact = location.pathname === "/impact";
  const isGallery = location.pathname === "/gallery";
  const isGetInvolved = location.pathname === "/get-involved";

  return (
    <header className="navbar">
      <div className="container navbar-container">

        {/* ========================================
            LOGO
        ======================================== */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
          aria-label="David Chukwu Charity Foundation Home"
        >
          <img
            src={logo}
            alt="David Chukwu Charity Foundation"
          />
        </Link>

        {/* ========================================
            NAVIGATION
        ======================================== */}

        <nav
          className={`nav-menu ${menuOpen ? "open" : ""}`}
          aria-label="Main navigation"
        >

          {/* HOME */}

          <Link
            to="/"
            className={isHome ? "active" : ""}
            onClick={closeMenu}
          >
            Home
          </Link>

          {/* ABOUT US */}

          <Link
            to="/about"
            className={isAbout ? "active" : ""}
            onClick={closeMenu}
          >
            About Us
          </Link>

          {/* OUR CAUSES */}

          <Link
            to="/causes"
            className={isCauses ? "active" : ""}
            onClick={closeMenu}
          >
            Our Causes
          </Link>

          {/* OUR IMPACT */}

          <Link
            to="/impact"
            className={isImpact ? "active" : ""}
            onClick={closeMenu}
          >
            Our Impact
          </Link>

          {/* GALLERY */}

          <Link
            to="/gallery"
            className={isGallery ? "active" : ""}
            onClick={closeMenu}
          >
            Gallery
          </Link>

          {/* GET INVOLVED */}

          <Link
            to="/get-involved"
            className={isGetInvolved ? "active" : ""}
            onClick={closeMenu}
          >
            Get Involved
          </Link>

          {/* MOBILE DONATE */}

          <button
            className="mobile-donate"
            onClick={handleDonate}
            type="button"
          >
            DONATE NOW
          </button>

        </nav>

        {/* ========================================
            DESKTOP DONATE BUTTON
        ======================================== */}

        <button
          className="donate-btn navbar-donate"
          onClick={handleDonate}
          type="button"
        >
          <Heart size={18} />
          DONATE NOW
        </button>

        {/* ========================================
            MOBILE MENU BUTTON
        ======================================== */}

        <button
          className="hamburger"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={
            menuOpen
              ? "Close navigation"
              : "Open navigation"
          }
          aria-expanded={menuOpen}
          type="button"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

      </div>
    </header>
  );
};

export default Navbar;