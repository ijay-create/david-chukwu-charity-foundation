import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import "../styles/scroll.top.css";

/* ============================================================
   SCROLL TO TOP / BOTTOM
   David Chukwu Charity Foundation

   Behaviour:
   - Near top       → Down arrow
   - Scrolled down  → Up arrow
   - Route changes  → Automatically scroll to top
============================================================ */

const ScrollToTop = () => {
  const { pathname } = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);

  const [hasScrollableContent, setHasScrollableContent] = useState(false);

  /* ==========================================================
     RESET SCROLL WHEN ROUTE CHANGES
  ========================================================== */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    setIsScrolled(false);
  }, [pathname]);

  /* ==========================================================
     DETECT SCROLL POSITION
  ========================================================== */

  useEffect(() => {
    const checkScroll = () => {
      const scrollTop = window.scrollY;

      const documentHeight =
        document.documentElement.scrollHeight;

      const viewportHeight =
        window.innerHeight;

      const canScroll =
        documentHeight > viewportHeight + 20;

      setHasScrollableContent(canScroll);

      setIsScrolled(scrollTop > 150);
    };

    checkScroll();

    window.addEventListener(
      "scroll",
      checkScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      checkScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        checkScroll
      );

      window.removeEventListener(
        "resize",
        checkScroll
      );
    };
  }, [pathname]);

  /* ==========================================================
     SCROLL ACTION
  ========================================================== */

  const handleScroll = () => {
    if (isScrolled) {
      /* ================================================
         SCROLL TO TOP
      ================================================ */

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

    } else {
      /* ================================================
         SCROLL TO BOTTOM
      ================================================ */

      window.scrollTo({
        top: document.documentElement.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  /* ==========================================================
     DON'T SHOW IF PAGE DOESN'T NEED SCROLLING
  ========================================================== */

  if (!hasScrollableContent) {
    return null;
  }

  /* ==========================================================
     BUTTON
  ========================================================== */

  return (
    <button
      type="button"
      className="scroll-direction-button"
      onClick={handleScroll}
      aria-label={
        isScrolled
          ? "Scroll to top"
          : "Scroll to bottom"
      }
      title={
        isScrolled
          ? "Scroll to top"
          : "Scroll to bottom"
      }
    >
      {isScrolled ? (
        /* ==================================================
           UP ARROW
        ================================================== */

        <svg
          className="scroll-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 19V5" />
          <path d="m6 11 6-6 6 6" />
        </svg>

      ) : (
        /* ==================================================
           DOWN ARROW
        ================================================== */

        <svg
          className="scroll-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v14" />
          <path d="m18 13-6 6-6-6" />
        </svg>
      )}
    </button>
  );
};

export default ScrollToTop;