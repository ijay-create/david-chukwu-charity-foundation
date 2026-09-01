import { useEffect, useState } from "react";

import API from "../api/axios";

import "../styles/Causes.css";

import Reveal from "./Reveal";

const Causes = () => {
  const [causes, setCauses] = useState([]);

  const [causesContent, setCausesContent] = useState({
    eyebrow: "Our Causes",
    title: "Where Your Support Makes a Difference",
    description:
      "Your support helps us provide meaningful assistance to communities and individuals who need it most."
  });

  const [loading, setLoading] = useState(true);

  /* 
  |-------------------------------------------------------------------------- 
  | GET IMAGE URL
  |-------------------------------------------------------------------------- 
  */

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("blob:")
    ) {
      return image;
    }

    const baseURL =
      API.defaults?.baseURL ||
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api";

    const serverURL = baseURL.replace(/\/api\/?$/, "");

    if (image.startsWith("/")) {
      return `${serverURL}${image}`;
    }

    return `${serverURL}/${image}`;
  };

  /*
  |--------------------------------------------------------------------------
  | FETCH CAUSES
  |--------------------------------------------------------------------------
  */

  const fetchCauses = async () => {
    try {
      setLoading(true);

      const response = await API.get("/settings");

      if (response.data?.success) {
        const homepage = response.data.settings?.homepage;

        const causesSettings = homepage?.causes;

        /*
        |--------------------------------------------------------------------------
        | LOAD CAUSES HEADER CONTENT
        |--------------------------------------------------------------------------
        */

        setCausesContent({
          eyebrow:
            causesSettings?.eyebrow ||
            "Our Causes",

          title:
            causesSettings?.title ||
            "Where Your Support Makes a Difference",

          description:
            causesSettings?.description ||
            "Your support helps us provide meaningful assistance to communities and individuals who need it most."
        });

        /*
        |--------------------------------------------------------------------------
        | LOAD CAUSE ITEMS
        |--------------------------------------------------------------------------
        */

        const loadedCauses =
          causesSettings?.items || [];

        setCauses(
          loadedCauses.map((cause) => ({
            ...cause,
            image: getImageUrl(cause.image)
          }))
        );
      }
    } catch (error) {
      console.error(
        "FETCH CAUSES ERROR:",
        error
      );

      setCauses([]);

      setCausesContent({
        eyebrow: "Our Causes",
        title: "Where Your Support Makes a Difference",
        description:
          "Your support helps us provide meaningful assistance to communities and individuals who need it most."
      });
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOAD DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchCauses();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | LOADING STATE
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <section
        className="causes section"
        id="causes"
      >
        <div className="container">

          <div className="causes-header">

            <span className="section-label">
              OUR CAUSES
            </span>

            <h2>
              Where Your Support Makes a Difference
            </h2>

            <p>
              Your support helps us provide
              meaningful assistance to communities
              and individuals who need it most.
            </p>

          </div>

        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <section
      className="causes section"
      id="causes"
    >
      <div className="container">

        {/* 
        |--------------------------------------------------------------------------
        | CAUSES HEADER
        |--------------------------------------------------------------------------
        */}

        <Reveal className="causes-header">

          <span className="section-label">
            {causesContent.eyebrow}
          </span>

          <h2>
            {causesContent.title}
          </h2>

          <p>
            {causesContent.description}
          </p>

        </Reveal>

        {/* 
        |--------------------------------------------------------------------------
        | CAUSES GRID
        |--------------------------------------------------------------------------
        */}

        <div className="causes-grid">

          {causes.map((cause, index) => (

            <Reveal
              key={
                cause._id ||
                cause.id ||
                cause.title ||
                index
              }
            >

              <article
                className="cause-card"
                style={{
                  transitionDelay: `${index * 0.1}s`
                }}
              >

                {cause.image && (
                  <img
                    src={cause.image}
                    alt={
                      cause.title ||
                      "Cause"
                    }
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />
                )}

                <div className="cause-card-content">

                  <h3>
                    {cause.title}
                  </h3>

                  <p>
                    {cause.text}
                  </p>

                </div>

              </article>

            </Reveal>

          ))}

        </div>

      </div>
    </section>
  );
};

export default Causes;