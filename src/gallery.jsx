import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Heart
} from "lucide-react";

import "../styles/Gallery.css";

import galleryHero from "../assets/gallery/gallery-hero.jpg";

import outreach1 from "../assets/gallery/images/outreach-1.jpg";
import outreach2 from "../assets/gallery/images/outreach-2.jpg";
import outreach3 from "../assets/gallery/images/outreach-3.jpg";
import outreach4 from "../assets/gallery/images/outreach-4.jpg";
import outreach5 from "../assets/gallery/images/outreach-5.jpg";
import outreach6 from "../assets/gallery/images/outreach-6.jpg";

import impactVideo from "../assets/gallery/videos/impact-video-1.mp4";
import outreachVideo from "../assets/gallery/videos/outreach-video.mp4";

const galleryItems = [
  {
    id: 1,
    type: "image",
    category: "Outreach",
    title: "Widows Support Program",
    src: outreach1,
    description:
      "Distributing essential food items and practical support to widows in the community."
  },
  {
    id: 2,
    type: "image",
    category: "Outreach",
    title: "Community Support",
    src: outreach2,
    description:
      "Supporting vulnerable individuals through meaningful community outreach."
  },
  {
    id: 3,
    type: "video",
    category: "Impact",
    title: "Children Education Support",
    src: impactVideo,
    description:
      "See how we support children with educational resources and opportunities."
  },
  {
    id: 4,
    type: "image",
    category: "Events",
    title: "Community Outreach",
    src: outreach3,
    description:
      "Our team reaching out to families and individuals in need."
  },
  {
    id: 5,
    type: "image",
    category: "Success Stories",
    title: "Creating Hope",
    src: outreach4,
    description:
      "Moments that demonstrate the difference compassionate support can make."
  },
  {
    id: 6,
    type: "video",
    category: "Outreach",
    title: "Outreach Program",
    src: outreachVideo,
    description:
      "A look into one of our community outreach programs."
  },
  {
    id: 7,
    type: "image",
    category: "Events",
    title: "Making A Difference",
    src: outreach5,
    description:
      "Working together to create stronger and more compassionate communities."
  },
  {
    id: 8,
    type: "image",
    category: "Impact",
    title: "Moments of Impact",
    src: outreach6,
    description:
      "Every act of kindness helps us bring hope to those who need it most."
  }
];

const filters = [
  "All",
  "Outreach",
  "Events",
  "Videos",
  "Success Stories"
];

const Gallery = ({ onDonateClick }) => {
  const [filter, setFilter] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredItems =
    filter === "All"
      ? galleryItems
      : filter === "Videos"
        ? galleryItems.filter(
            (item) => item.type === "video"
          )
        : galleryItems.filter(
            (item) => item.category === filter
          );

  const openLightbox = (item) => {
    const index = galleryItems.findIndex(
      (galleryItem) => galleryItem.id === item.id
    );

    setCurrentIndex(index);
    setLightboxOpen(true);

    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const nextItem = () => {
    setCurrentIndex(
      (previous) =>
        (previous + 1) % galleryItems.length
    );
  };

  const previousItem = () => {
    setCurrentIndex(
      (previous) =>
        (previous - 1 + galleryItems.length) %
        galleryItems.length
    );
  };

  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }

    const handleKeyboard = (event) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowRight") {
        nextItem();
      }

      if (event.key === "ArrowLeft") {
        previousItem();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, [lightboxOpen]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const currentItem = galleryItems[currentIndex];

  return (
    <main className="gallery-page">

      {/* ========================================
          HERO
      ======================================== */}

      <section
        className="gallery-hero"
        style={{
          backgroundImage: `url(${galleryHero})`
        }}
      >
        <div className="gallery-hero-overlay"></div>

        <div className="container gallery-hero-container">
          <div className="gallery-hero-content">

            <h1>Gallery</h1>

            <span className="gallery-underline"></span>

            <p>
              Capturing Moments of Hope and Impact
            </p>

          </div>
        </div>
      </section>

      {/* ========================================
          FILTERS
      ======================================== */}

      <section className="gallery-filter-section">
        <div className="gallery-filters">

          {filters.map((filterName) => (
            <button
              key={filterName}
              type="button"
              className={
                filter === filterName
                  ? "gallery-filter active"
                  : "gallery-filter"
              }
              onClick={() => setFilter(filterName)}
            >
              {filterName}
            </button>
          ))}

        </div>
      </section>

      {/* ========================================
          GALLERY GRID
      ======================================== */}

      <section className="gallery-section">

        <div className="gallery-grid">

          {filteredItems.map((item) => (
            <article
              className="gallery-item"
              key={item.id}
              onClick={() => openLightbox(item)}
            >

              {item.type === "video" ? (
                <>
                  <video
                    src={item.src}
                    muted
                    preload="metadata"
                    aria-label={item.title}
                  />

                  <div className="video-overlay">
                    <Play fill="white" />
                  </div>
                </>
              ) : (
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                />
              )}

              <div className="item-overlay">

                <span className="gallery-category">
                  {item.category}
                </span>

                <h3>{item.title}</h3>

              </div>

            </article>
          ))}

        </div>

        {filteredItems.length === 0 && (
          <p className="gallery-empty">
            No media available for this category yet.
          </p>
        )}

      </section>

      {/* ========================================
          CTA
      ======================================== */}

      <section className="gallery-cta">

        <div className="container gallery-cta-content">

          <h2>Be Part of the Change</h2>

          <p>
            Your support can help us reach those who
            need it most.
          </p>

          <div className="gallery-cta-buttons">

            {/* DONATE */}

            <button
              className="gallery-donate-btn"
              type="button"
              onClick={onDonateClick}
            >
              <Heart />
              DONATE NOW
            </button>

            {/* GET INVOLVED */}

            <Link
              to="/get-involved"
              className="gallery-involved-btn"
            >
              GET INVOLVED →
            </Link>

          </div>

        </div>

      </section>

      {/* ========================================
          LIGHTBOX
      ======================================== */}

      {lightboxOpen && currentItem && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >

          {/* CLOSE */}

          <button
            className="lightbox-close"
            type="button"
            onClick={closeLightbox}
            aria-label="Close gallery"
          >
            <X />
          </button>

          {/* PREVIOUS */}

          <button
            className="lightbox-nav lightbox-prev"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              previousItem();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft />
          </button>

          {/* CONTENT */}

          <div
            className="lightbox-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {currentItem.type === "video" ? (
              <video
                controls
                autoPlay
                src={currentItem.src}
              />
            ) : (
              <img
                src={currentItem.src}
                alt={currentItem.title}
              />
            )}

            <div className="lightbox-info">

              <span className="category">
                {currentItem.category}
              </span>

              <h2 className="title">
                {currentItem.title}
              </h2>

              <p className="description">
                {currentItem.description}
              </p>

            </div>

          </div>

          {/* NEXT */}

          <button
            className="lightbox-nav lightbox-next"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              nextItem();
            }}
            aria-label="Next image"
          >
            <ChevronRight />
          </button>

        </div>
      )}

    </main>
  );
};

export default Gallery;