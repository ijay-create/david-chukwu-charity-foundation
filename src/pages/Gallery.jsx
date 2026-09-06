import {
  useEffect,
  useState
} from "react";

import { Link } from "react-router-dom";

import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Heart
} from "lucide-react";

import API from "../api/axios";

import "../styles/Gallery.css";

import galleryHero from "../assets/gallery/gallery-hero.jpg";

const filters = [
  "All",
  "Outreach",
  "Events",
  "Videos",
  "Success Stories"
];

const Gallery = ({
  onDonateClick
}) => {
  const [galleryItems, setGalleryItems] =
    useState([]);

  const [filter, setFilter] =
    useState("All");

  const [lightboxOpen, setLightboxOpen] =
    useState(false);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * Stores the exact page scroll position
   * before opening the lightbox.
   */
  const [savedScrollPosition, setSavedScrollPosition] =
    useState(0);

  /* ========================================
     GET MEDIA URL
  ======================================== */

  const getMediaUrl = (url) => {
    if (!url) {
      return "";
    }

    /*
     * Cloudinary / external URLs are already
     * complete and must be returned unchanged.
     */
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("blob:")
    ) {
      return url;
    }

    /*
     * Support old relative URLs without
     * hard-coding localhost.
     */
    const apiUrl =
      import.meta.env.VITE_API_URL;

    if (!apiUrl) {
      console.warn(
        "VITE_API_URL is not configured."
      );

      return url;
    }

    const apiOrigin =
      apiUrl.replace(
        /\/api\/?$/,
        ""
      );

    return `${apiOrigin}${url}`;
  };

  /* ========================================
     FETCH GALLERY
  ======================================== */

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await API.get("/gallery");

      const items =
        Array.isArray(response.data)
          ? response.data
          : response.data?.gallery ||
            response.data?.items ||
            response.data?.data ||
            [];

      const normalizedItems =
        items
          .map((item) => ({
            ...item,

            id:
              item._id ||
              item.id,

            src:
              getMediaUrl(
                item.fileUrl ||
                item.src ||
                item.url
              ),

            type:
              item.type ||
              "image",

            category:
              item.category ||
              "Outreach",

            title:
              item.title ||
              "Untitled",

            description:
              item.description ||
              "",

            order:
              item.order ?? 0
          }))
          .sort(
            (a, b) =>
              Number(a.order || 0) -
              Number(b.order || 0)
          );

      setGalleryItems(
        normalizedItems
      );

    } catch (requestError) {
      console.error(
        "Failed to fetch public gallery:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to load gallery."
      );

    } finally {
      setLoading(false);
    }
  };

  /* ========================================
     LOAD GALLERY
  ======================================== */

  useEffect(() => {
    fetchGallery();
  }, []);

  /* ========================================
     FILTER GALLERY
  ======================================== */

  const filteredItems =
    filter === "All"
      ? galleryItems
      : filter === "Videos"
        ? galleryItems.filter(
            (item) =>
              item.type === "video"
          )
        : galleryItems.filter(
            (item) =>
              item.category === filter
          );

  /* ========================================
     OPEN LIGHTBOX
  ======================================== */

  const openLightbox = (item) => {
    const index =
      galleryItems.findIndex(
        (galleryItem) =>
          galleryItem.id === item.id
      );

    if (index === -1) {
      return;
    }

    /*
     * IMPORTANT:
     * Save the exact position where the user
     * clicked the image/video.
     */
    const currentScrollPosition =
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      0;

    setSavedScrollPosition(
      currentScrollPosition
    );

    setCurrentIndex(index);
    setLightboxOpen(true);

    /*
     * Prevent the background page from
     * scrolling while the lightbox is open.
     */
    document.body.style.overflow =
      "hidden";
  };

  /* ========================================
     CLOSE LIGHTBOX
  ======================================== */

  const closeLightbox = () => {
    setLightboxOpen(false);

    document.body.style.overflow =
      "";

    /*
     * Restore the exact position where
     * the user opened the media.
     */
    requestAnimationFrame(() => {
      window.scrollTo({
        top: savedScrollPosition,
        left: 0,
        behavior: "auto"
      });
    });
  };

  /* ========================================
     NEXT ITEM
  ======================================== */

  const nextItem = () => {
    if (galleryItems.length === 0) {
      return;
    }

    setCurrentIndex(
      (previous) =>
        (previous + 1) %
        galleryItems.length
    );
  };

  /* ========================================
     PREVIOUS ITEM
  ======================================== */

  const previousItem = () => {
    if (galleryItems.length === 0) {
      return;
    }

    setCurrentIndex(
      (previous) =>
        (previous -
          1 +
          galleryItems.length) %
        galleryItems.length
    );
  };

  /* ========================================
     KEYBOARD CONTROLS
  ======================================== */

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
  }, [
    lightboxOpen,
    galleryItems.length,
    savedScrollPosition
  ]);

  /* ========================================
     CLEAN BODY SCROLL
  ======================================== */

  useEffect(() => {
    return () => {
      document.body.style.overflow =
        "";
    };
  }, []);

  /* ========================================
     CURRENT LIGHTBOX ITEM
  ======================================== */

  const currentItem =
    galleryItems[currentIndex];

  /* ========================================
     RENDER
  ======================================== */

  return (
    <main className="gallery-page">

      {/* ====================================
          HERO
      ==================================== */}

      <section
        className="gallery-hero"
        style={{
          backgroundImage:
            `url(${galleryHero})`
        }}
      >

        <div className="gallery-hero-overlay"></div>

        <div className="container gallery-hero-container">

          <div className="gallery-hero-content">

            <h1>
              Gallery
            </h1>

            <span className="gallery-underline"></span>

            <p>
              Capturing Moments of Hope and Impact
            </p>

          </div>

        </div>

      </section>

      {/* ====================================
          FILTERS
      ==================================== */}

      <section className="gallery-filter-section">

        <div className="gallery-filters">

          {filters.map(
            (filterName) => (
              <button
                key={filterName}
                type="button"
                className={
                  filter === filterName
                    ? "gallery-filter active"
                    : "gallery-filter"
                }
                onClick={() =>
                  setFilter(
                    filterName
                  )
                }
              >
                {filterName}
              </button>
            )
          )}

        </div>

      </section>

      {/* ====================================
          GALLERY
      ==================================== */}

      <section className="gallery-section">

        {/* LOADING */}

        {loading && (
          <div className="gallery-empty">
            <p>
              Loading gallery...
            </p>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="gallery-empty">

            <p>
              {error}
            </p>

            <button
              type="button"
              className="gallery-filter"
              onClick={fetchGallery}
            >
              Try Again
            </button>

          </div>
        )}

        {/* GRID */}

        {!loading &&
          !error &&
          filteredItems.length > 0 && (
            <div className="gallery-grid">

              {filteredItems.map(
                (item) => (
                  <article
                    className="gallery-item"
                    key={item.id}
                    onClick={(event) => {
                      /*
                       * Prevent the click from bubbling
                       * to any parent/global click handlers.
                       */
                      event.stopPropagation();

                      openLightbox(item);
                    }}
                  >

                    {/* IMAGE / VIDEO */}

                    {item.type ===
                    "video" ? (
                      <>
                        <video
                          src={item.src}
                          muted
                          preload="metadata"
                          playsInline
                          aria-label={
                            item.title
                          }
                        />

                        <div className="video-overlay">

                          <Play
                            fill="white"
                          />

                        </div>
                      </>
                    ) : (
                      <img
                        src={item.src}
                        alt={item.title}
                        loading="lazy"
                        draggable="false"
                      />
                    )}

                    {/* OVERLAY */}

                    <div className="item-overlay">

                      <span className="gallery-category">
                        {item.category}
                      </span>

                      <h3>
                        {item.title}
                      </h3>

                    </div>

                  </article>
                )
              )}

            </div>
          )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          filteredItems.length ===
            0 && (
            <div className="gallery-empty">

              <p>
                No media available
                for this category
                yet.
              </p>

            </div>
          )}

      </section>

      {/* ====================================
          CTA
      ==================================== */}

      <section className="gallery-cta">

        <div className="container gallery-cta-content">

          <h2>
            Be Part of the Change
          </h2>

          <p>
            Your support can help us
            reach those who need it
            most.
          </p>

          <div className="gallery-cta-buttons">

            {/* DONATE */}

            <button
              className="gallery-donate-btn"
              type="button"
              onClick={
                onDonateClick
              }
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

      {/* ====================================
          LIGHTBOX
      ==================================== */}

      {lightboxOpen &&
        currentItem && (
          <div
            className="lightbox-overlay"
            onClick={
              closeLightbox
            }
            role="dialog"
            aria-modal="true"
          >

            {/* CLOSE */}

            <button
              className="lightbox-close"
              type="button"
              onClick={(
                event
              ) => {
                event.stopPropagation();

                closeLightbox();
              }}
              aria-label="Close gallery"
            >
              <X />
            </button>

            {/* PREVIOUS */}

            <button
              className="lightbox-nav lightbox-prev"
              type="button"
              onClick={(
                event
              ) => {
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
              onClick={(
                event
              ) =>
                event.stopPropagation()
              }
            >

              {currentItem.type ===
              "video" ? (
                <video
                  controls
                  autoPlay
                  playsInline
                  src={
                    currentItem.src
                  }
                  onClick={(
                    event
                  ) =>
                    event.stopPropagation()
                  }
                />
              ) : (
                <img
                  src={
                    currentItem.src
                  }
                  alt={
                    currentItem.title
                  }
                  draggable="false"
                  onClick={(
                    event
                  ) =>
                    event.stopPropagation()
                  }
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
                  {
                    currentItem.description
                  }
                </p>

              </div>

            </div>

            {/* NEXT */}

            <button
              className="lightbox-nav lightbox-next"
              type="button"
              onClick={(
                event
              ) => {
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