import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  Save,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  GripVertical,
  RefreshCw,
  ArrowUp,
  ArrowDown
} from "lucide-react";

import "../../styles/Admin.causes.css";


// ========================================
// API
// ========================================

const API_URL =
  "http://localhost:5000/api/causes";

const SERVER_URL =
  "http://localhost:5000";


// ========================================
// DEFAULT DATA
// ========================================

const defaultCauses = {
  hero: {
    eyebrow: "OUR CAUSES",
    title: "Our Causes",
    description:
      "Supporting people and communities where care is needed most.",
    imageUrl: ""
  },

  intro: {
    eyebrow: "WHAT WE CARE ABOUT",
    title: "Creating Change Where It Matters",
    description:
      "Our work focuses on providing care, support and opportunities to vulnerable individuals and communities."
  },

  items: [
    {
      number: "01",
      title: "Widows Support & Empowerment",
      description:
        "Helping widows access practical support, resources and opportunities for greater independence.",
      imageUrl: "",
      order: 1
    },

    {
      number: "02",
      title: "Orphanage Support & Child Welfare",
      description:
        "Supporting the well-being, education and development of vulnerable children.",
      imageUrl: "",
      order: 2
    },

    {
      number: "03",
      title: "Special Needs Awareness & Support",
      description:
        "Supporting individuals with special needs through care, awareness and meaningful opportunities.",
      imageUrl: "",
      order: 3
    },

    {
      number: "04",
      title: "Elderly People Care & Community Support",
      description:
        "Providing care and support that promotes dignity and well-being among elderly people.",
      imageUrl: "",
      order: 4
    },

    {
      number: "05",
      title: "Community Outreach & Humanitarian Assistance",
      description:
        "Extending practical assistance to individuals and communities in need.",
      imageUrl: "",
      order: 5
    }
  ],

  approach: {
    eyebrow: "OUR APPROACH",
    title: "Compassion in Action",
    description:
      "We work through care, empowerment, advocacy and community partnerships to create meaningful change.",
    imageUrl: ""
  },

  cta: {
    eyebrow: "MAKE A DIFFERENCE",
    title: "Be Part of the Change",
    description:
      "Your support can help us reach those who need it most.",
    donateText: "DONATE NOW",
    involvedText: "GET INVOLVED"
  }
};


// ========================================
// ADMIN CAUSES
// ========================================

const AdminCauses = () => {

  // ======================================
  // STATE
  // ======================================

  const [causes, setCauses] =
    useState(defaultCauses);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ======================================
  // IMAGE FILE STATE
  // ======================================

  const [heroFile, setHeroFile] =
    useState(null);

  const [heroPreview, setHeroPreview] =
    useState("");

  const [approachFile, setApproachFile] =
    useState(null);

  const [approachPreview, setApproachPreview] =
    useState("");

  const [causeFiles, setCauseFiles] =
    useState({});

  const [causePreviews, setCausePreviews] =
    useState({});


  // ======================================
  // INPUT REFS
  // ======================================

  const heroInputRef =
    useRef(null);

  const approachInputRef =
    useRef(null);

  const causeInputRefs =
    useRef({});


  // ========================================
  // MEDIA URL
  // ========================================

  const getMediaUrl = (fileUrl) => {

    if (!fileUrl) {
      return "";
    }

    if (
      fileUrl.startsWith("http://") ||
      fileUrl.startsWith("https://") ||
      fileUrl.startsWith("blob:")
    ) {
      return fileUrl;
    }

    return `${SERVER_URL}${fileUrl}`;
  };


  // ========================================
  // NORMALIZE BACKEND DATA
  // ========================================

  const normalizeCauses = (data) => {

    return {

      hero: {
        ...defaultCauses.hero,
        ...(data.hero || {})
      },

      intro: {
        ...defaultCauses.intro,
        ...(data.intro || {})
      },

      items:
        Array.isArray(data.causes)
          ? data.causes
              .sort(
                (a, b) =>
                  (a.order || 0) -
                  (b.order || 0)
              )
              .map(
                (item, index) => ({
                  ...item,

                  number:
                    item.number ||
                    String(index + 1)
                      .padStart(2, "0"),

                  order:
                    item.order ||
                    index + 1
                })
              )
          : defaultCauses.items,

      approach: {
        ...defaultCauses.approach,
        ...(data.approach || {})
      },

      cta: {
        ...defaultCauses.cta,
        ...(data.cta || {})
      }

    };

  };


  // ========================================
  // LOAD CAUSES
  // ========================================

  const loadCauses = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await fetch(API_URL);

      const data =
        await response.json();

      if (!response.ok || !data.success) {

        throw new Error(
          data.message ||
          "Unable to fetch causes."
        );

      }

      const normalized =
        normalizeCauses(
          data.causes
        );

      setCauses(normalized);


      // HERO IMAGE

      if (
        normalized.hero.imageUrl
      ) {

        setHeroPreview(
          getMediaUrl(
            normalized.hero.imageUrl
          )
        );

      } else {

        setHeroPreview("");

      }


      // APPROACH IMAGE

      if (
        normalized.approach.imageUrl
      ) {

        setApproachPreview(
          getMediaUrl(
            normalized.approach.imageUrl
          )
        );

      } else {

        setApproachPreview("");

      }


      // CAUSE IMAGES

      const previews = {};

      normalized.items.forEach(
        (item, index) => {

          if (item.imageUrl) {

            previews[index] =
              getMediaUrl(
                item.imageUrl
              );

          }

        }
      );

      setCausePreviews(
        previews
      );

      setCauseFiles({});

    } catch (loadError) {

      console.error(
        "LOAD CAUSES ERROR:",
        loadError
      );

      setError(
        loadError.message ||
        "Unable to load Causes content."
      );

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {

    loadCauses();

  }, []);


  // ========================================
  // UPDATE SECTION
  // ========================================

  const updateSection = (
    section,
    field,
    value
  ) => {

    setCauses(
      previous => ({

        ...previous,

        [section]: {

          ...previous[section],

          [field]: value

        }

      })
    );

    setError("");
    setSuccess("");

  };


  // ========================================
  // HERO IMAGE
  // ========================================

  const handleHeroChange = (
    event
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("image/")
    ) {

      setError(
        "Please select a valid image."
      );

      event.target.value = "";

      return;

    }

    const preview =
      URL.createObjectURL(file);

    setHeroFile(file);

    setHeroPreview(preview);

    setError("");
    setSuccess("");

  };


  // ========================================
  // APPROACH IMAGE
  // ========================================

  const handleApproachChange = (
    event
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("image/")
    ) {

      setError(
        "Please select a valid image."
      );

      event.target.value = "";

      return;

    }

    const preview =
      URL.createObjectURL(file);

    setApproachFile(file);

    setApproachPreview(preview);

    setError("");
    setSuccess("");

  };


  // ========================================
  // CAUSE IMAGE
  // ========================================

  const handleCauseImageChange = (
    index,
    event
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("image/")
    ) {

      setError(
        "Please select a valid image."
      );

      event.target.value = "";

      return;

    }

    const preview =
      URL.createObjectURL(file);


    setCauseFiles(
      previous => ({

        ...previous,

        [index]: file

      })
    );


    setCausePreviews(
      previous => ({

        ...previous,

        [index]: preview

      })
    );


    setError("");
    setSuccess("");

  };


  // ========================================
  // UPDATE CAUSE
  // ========================================

  const updateCause = (
    index,
    field,
    value
  ) => {

    setCauses(
      previous => {

        const updatedItems =
          [...previous.items];

        updatedItems[index] = {

          ...updatedItems[index],

          [field]: value

        };

        return {

          ...previous,

          items: updatedItems

        };

      }
    );

    setError("");
    setSuccess("");

  };


  // ========================================
  // ADD CAUSE
  // ========================================

  const addCause = () => {

    setCauses(
      previous => {

        const nextOrder =
          previous.items.length + 1;

        return {

          ...previous,

          items: [

            ...previous.items,

            {

              number:
                String(nextOrder)
                  .padStart(2, "0"),

              title: "",

              description: "",

              imageUrl: "",

              order: nextOrder

            }

          ]

        };

      }
    );

    setError("");
    setSuccess("");

  };


  // ========================================
  // REMOVE CAUSE
  // ========================================

  const removeCause = (
    index
  ) => {

    if (
      causes.items.length <= 1
    ) {

      setError(
        "You must have at least one cause."
      );

      return;

    }


    setCauses(
      previous => {

        const updatedItems =
          previous.items

            .filter(
              (_, itemIndex) =>
                itemIndex !== index
            )

            .map(
              (item, itemIndex) => ({

                ...item,

                number:
                  String(
                    itemIndex + 1
                  ).padStart(
                    2,
                    "0"
                  ),

                order:
                  itemIndex + 1

              })
            );


        return {

          ...previous,

          items: updatedItems

        };

      }
    );


    setCauseFiles(
      previous => {

        const updated = {};

        Object.keys(previous)
          .forEach(key => {

            const keyIndex =
              Number(key);

            if (
              keyIndex < index
            ) {

              updated[keyIndex] =
                previous[key];

            } else if (
              keyIndex > index
            ) {

              updated[keyIndex - 1] =
                previous[key];

            }

          });

        return updated;

      }
    );


    setCausePreviews(
      previous => {

        const updated = {};

        Object.keys(previous)
          .forEach(key => {

            const keyIndex =
              Number(key);

            if (
              keyIndex < index
            ) {

              updated[keyIndex] =
                previous[key];

            } else if (
              keyIndex > index
            ) {

              updated[keyIndex - 1] =
                previous[key];

            }

          });

        return updated;

      }
    );


    setError("");
    setSuccess("");

  };


  // ========================================
  // MOVE CAUSE
  // ========================================

  const moveCause = (
    index,
    direction
  ) => {

    const newIndex =
      direction === "up"
        ? index - 1
        : index + 1;


    if (
      newIndex < 0 ||
      newIndex >= causes.items.length
    ) {

      return;

    }


    setCauses(
      previous => {

        const updatedItems =
          [...previous.items];


        [
          updatedItems[index],
          updatedItems[newIndex]
        ] = [
          updatedItems[newIndex],
          updatedItems[index]
        ];


        const reordered =
          updatedItems.map(
            (item, itemIndex) => ({

              ...item,

              number:
                String(
                  itemIndex + 1
                ).padStart(
                  2,
                  "0"
                ),

              order:
                itemIndex + 1

            })
          );


        return {

          ...previous,

          items: reordered

        };

      }
    );


    // Move pending files

    setCauseFiles(
      previous => {

        const updated = {
          ...previous
        };

        const current =
          updated[index];

        const target =
          updated[newIndex];


        if (
          current === undefined
        ) {

          delete updated[newIndex];

        } else {

          updated[newIndex] =
            current;

        }


        if (
          target === undefined
        ) {

          delete updated[index];

        } else {

          updated[index] =
            target;

        }


        return updated;

      }
    );


    // Move previews

    setCausePreviews(
      previous => {

        const updated = {
          ...previous
        };

        const current =
          updated[index];

        const target =
          updated[newIndex];


        if (
          current === undefined
        ) {

          delete updated[newIndex];

        } else {

          updated[newIndex] =
            current;

        }


        if (
          target === undefined
        ) {

          delete updated[index];

        } else {

          updated[index] =
            target;

        }


        return updated;

      }
    );


    setError("");
    setSuccess("");

  };


  // ========================================
  // VALIDATION
  // ========================================

  const validateForm = () => {

    if (
      !causes.hero.title?.trim()
    ) {

      setError(
        "Please enter the hero title."
      );

      return false;

    }


    if (
      !causes.hero.description?.trim()
    ) {

      setError(
        "Please enter the hero description."
      );

      return false;

    }


    if (
      !causes.intro.title?.trim()
    ) {

      setError(
        "Please enter the introduction title."
      );

      return false;

    }


    if (
      !causes.intro.description?.trim()
    ) {

      setError(
        "Please enter the introduction description."
      );

      return false;

    }


    for (
      const cause of causes.items
    ) {

      if (
        !cause.title?.trim()
      ) {

        setError(
          "Every cause must have a title."
        );

        return false;

      }


      if (
        !cause.description?.trim()
      ) {

        setError(
          "Every cause must have a description."
        );

        return false;

      }

    }


    if (
      !causes.approach.title?.trim()
    ) {

      setError(
        "Please enter the approach title."
      );

      return false;

    }


    if (
      !causes.approach.description?.trim()
    ) {

      setError(
        "Please enter the approach description."
      );

      return false;

    }


    if (
      !causes.cta.title?.trim()
    ) {

      setError(
        "Please enter the CTA title."
      );

      return false;

    }


    return true;

  };


  // ========================================
  // SAVE TO BACKEND
  // ========================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();


    if (!validateForm()) {
      return;
    }


    try {

      setSaving(true);

      setError("");
      setSuccess("");


      const formData =
        new FormData();


      // ------------------------------------
      // TEXT DATA
      // ------------------------------------

      formData.append(
        "hero",
        JSON.stringify(
          causes.hero
        )
      );


      formData.append(
        "intro",
        JSON.stringify(
          causes.intro
        )
      );


      formData.append(
        "causes",
        JSON.stringify(
          causes.items
        )
      );


      formData.append(
        "approach",
        JSON.stringify(
          causes.approach
        )
      );


      formData.append(
        "cta",
        JSON.stringify(
          causes.cta
        )
      );


      // ------------------------------------
      // HERO IMAGE
      // ------------------------------------

      if (heroFile) {

        formData.append(
          "heroImage",
          heroFile
        );

      }


      // ------------------------------------
      // APPROACH IMAGE
      // ------------------------------------

      if (approachFile) {

        formData.append(
          "approachImage",
          approachFile
        );

      }


      // ------------------------------------
      // CAUSE IMAGES
      // ------------------------------------

      Object.entries(
        causeFiles
      ).forEach(
        ([index, file]) => {

          formData.append(
            `causeImage_${index}`,
            file
          );

        }
      );


      // ------------------------------------
      // API REQUEST
      // ------------------------------------

      const response =
        await fetch(
          API_URL,
          {
            method: "PUT",
            body: formData
          }
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          "Unable to save causes."
        );

      }


      // ------------------------------------
      // NORMALIZE RESPONSE
      // ------------------------------------

      const normalized =
        normalizeCauses(
          data.causes
        );


      setCauses(
        normalized
      );


      // ------------------------------------
      // UPDATE IMAGE PREVIEWS
      // ------------------------------------

      if (
        normalized.hero.imageUrl
      ) {

        setHeroPreview(
          getMediaUrl(
            normalized.hero.imageUrl
          )
        );

      }


      if (
        normalized.approach.imageUrl
      ) {

        setApproachPreview(
          getMediaUrl(
            normalized.approach.imageUrl
          )
        );

      }


      const previews = {};

      normalized.items.forEach(
        (item, index) => {

          if (item.imageUrl) {

            previews[index] =
              getMediaUrl(
                item.imageUrl
              );

          }

        }
      );


      setCausePreviews(
        previews
      );


      // ------------------------------------
      // CLEAR FILE STATE
      // ------------------------------------

      setHeroFile(null);

      setApproachFile(null);

      setCauseFiles({});


      setSuccess(
        "Causes content saved successfully."
      );


      setTimeout(() => {

        setSuccess("");

      }, 4000);

    } catch (saveError) {

      console.error(
        "SAVE CAUSES ERROR:",
        saveError
      );

      setError(
        saveError.message ||
        "Unable to save Causes content."
      );

    } finally {

      setSaving(false);

    }

  };


  // ========================================
  // RESET
  // ========================================

  const handleReset = async () => {

    const confirmed =
      window.confirm(
        "Reset the Causes form to the default content? This will not delete the current database content until you save."
      );


    if (!confirmed) {
      return;
    }


    setCauses(
      defaultCauses
    );

    setHeroFile(null);
    setApproachFile(null);
    setCauseFiles({});

    setHeroPreview("");
    setApproachPreview("");
    setCausePreviews({});

    setError("");

    setSuccess(
      "Form reset to default content."
    );

  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <div className="admin-page">

        <div className="admin-page-header">

          <div>

            <span className="admin-section-eyebrow">
              CONTENT MANAGEMENT
            </span>

            <h1>
              Our Causes
            </h1>

            <p>
              Manage the causes and
              content displayed on
              your public website.
            </p>

          </div>

        </div>


        <div className="admin-empty-state">

          <RefreshCw
            size={42}
            className="admin-loading-icon"
          />

          <h3>
            Loading Causes...
          </h3>

          <p>
            Connecting to the Causes
            database.
          </p>

        </div>

      </div>

    );

  }


  // ========================================
  // RENDER
  // ========================================

  return (

    <div className="admin-page admin-causes-page">


      {/* ====================================
          HEADER
      ==================================== */}

      <div className="admin-page-header">

        <div>

          <span className="admin-section-eyebrow">
            CONTENT MANAGEMENT
          </span>

          <h1>
            Our Causes
          </h1>

          <p>
            Manage the causes, images,
            approach section and
            call-to-action displayed
            on your public Our Causes page.
          </p>

        </div>


        <div className="admin-causes-header-actions">

          <button
            type="button"
            className="btn-secondary"
            onClick={loadCauses}
            disabled={saving}
          >

            <RefreshCw size={17} />

            Refresh

          </button>


          <button
            type="button"
            className="btn-danger-outline"
            onClick={handleReset}
            disabled={saving}
          >

            Reset

          </button>


          <button
            type="submit"
            form="causes-management-form"
            className="btn-primary"
            disabled={saving}
          >

            <Save size={17} />

            {saving
              ? "Saving..."
              : "Save Changes"}

          </button>

        </div>

      </div>


      {/* ====================================
          ALERTS
      ==================================== */}

      {error && (

        <div className="admin-alert admin-alert-error">

          <strong>
            Error
          </strong>

          <span>
            {error}
          </span>

        </div>

      )}


      {success && (

        <div className="admin-alert admin-alert-success">

          <strong>
            Success
          </strong>

          <span>
            {success}
          </span>

        </div>

      )}


      {/* ====================================
          FORM
      ==================================== */}

      <form
        id="causes-management-form"
        className="admin-causes-form"
        onSubmit={handleSubmit}
      >


        {/* ==================================
            HERO
        ================================== */}

        <section className="admin-causes-section">

          <div className="admin-causes-section-header">

            <div className="admin-causes-section-heading">

              <span>
                01
              </span>

              <div>

                <h2>
                  Hero Section
                </h2>

                <p>
                  Manage the main banner
                  displayed at the top of
                  the Our Causes page.
                </p>

              </div>

            </div>

          </div>


          <div className="admin-causes-image-editor">

            <div className="admin-causes-large-image-preview">

              {heroPreview ? (

                <img
                  src={heroPreview}
                  alt="Causes hero"
                />

              ) : (

                <div className="admin-causes-image-empty">

                  <ImageIcon size={44} />

                  <span>
                    No hero image uploaded
                  </span>

                </div>

              )}

            </div>


            <div className="admin-causes-image-info">

              <span className="admin-section-eyebrow">
                HERO IMAGE
              </span>

              <h3>
                Main Causes Banner
              </h3>

              <p>
                This image appears behind
                the Our Causes hero section.
              </p>

              <span className="admin-upload-note">
                JPG, JPEG, PNG or WEBP · Max 5MB
              </span>


              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  heroInputRef.current?.click()
                }
              >

                <Upload size={17} />

                {heroPreview
                  ? "Replace Image"
                  : "Upload Image"}

              </button>


              <input
                ref={heroInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                hidden
                onChange={handleHeroChange}
              />

            </div>

          </div>


          <div className="admin-form-grid">

            <div className="form-group">

              <label className="form-label">
                Eyebrow
              </label>

              <input
                type="text"
                className="form-input"
                value={
                  causes.hero.eyebrow
                }
                onChange={event =>
                  updateSection(
                    "hero",
                    "eyebrow",
                    event.target.value
                  )
                }
              />

            </div>


            <div className="form-group">

              <label className="form-label">
                Hero Title
              </label>

              <input
                type="text"
                className="form-input"
                value={
                  causes.hero.title
                }
                onChange={event =>
                  updateSection(
                    "hero",
                    "title",
                    event.target.value
                  )
                }
              />

            </div>

          </div>


          <div className="form-group">

            <label className="form-label">
              Hero Description
            </label>

            <textarea
              className="form-input"
              rows="4"
              value={
                causes.hero.description
              }
              onChange={event =>
                updateSection(
                  "hero",
                  "description",
                  event.target.value
                )
              }
            />

          </div>

        </section>


        {/* ==================================
            INTRO
        ================================== */}

        <section className="admin-causes-section">

          <div className="admin-causes-section-header">

            <div className="admin-causes-section-heading">

              <span>
                02
              </span>

              <div>

                <h2>
                  Introduction
                </h2>

                <p>
                  Manage the introduction
                  displayed before the causes.
                </p>

              </div>

            </div>

          </div>


          <div className="admin-form-grid">

            <div className="form-group">

              <label className="form-label">
                Eyebrow
              </label>

              <input
                type="text"
                className="form-input"
                value={
                  causes.intro.eyebrow
                }
                onChange={event =>
                  updateSection(
                    "intro",
                    "eyebrow",
                    event.target.value
                  )
                }
              />

            </div>


            <div className="form-group">

              <label className="form-label">
                Section Title
              </label>

              <input
                type="text"
                className="form-input"
                value={
                  causes.intro.title
                }
                onChange={event =>
                  updateSection(
                    "intro",
                    "title",
                    event.target.value
                  )
                }
              />

            </div>

          </div>


          <div className="form-group">

            <label className="form-label">
              Description
            </label>

            <textarea
              className="form-input"
              rows="5"
              value={
                causes.intro.description
              }
              onChange={event =>
                updateSection(
                  "intro",
                  "description",
                  event.target.value
                )
              }
            />

          </div>

        </section>


        {/* ==================================
            CAUSES
        ================================== */}

        <section className="admin-causes-section">

          <div className="admin-causes-section-header">

            <div className="admin-causes-section-heading">

              <span>
                03
              </span>

              <div>

                <h2>
                  Causes
                </h2>

                <p>
                  Manage the individual causes
                  supported by the Foundation.
                </p>

              </div>

            </div>


            <button
              type="button"
              className="btn-secondary"
              onClick={addCause}
            >

              <Plus size={17} />

              Add Cause

            </button>

          </div>


          <div className="admin-causes-list">

            {causes.items.map(
              (cause, index) => {

                const preview =
                  causePreviews[index] ||
                  getMediaUrl(
                    cause.imageUrl
                  );


                return (

                  <article
                    className="admin-cause-card"
                    key={
                      cause._id ||
                      `${cause.number}-${index}`
                    }
                  >

                    <div className="admin-cause-card-header">

                      <div className="admin-cause-drag">

                        <GripVertical
                          size={19}
                        />

                        <span>
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>

                      </div>


                      <div>

                        <strong>
                          Cause {index + 1}
                        </strong>

                        <span>
                          Manage cause information
                        </span>

                      </div>


                      <div className="admin-cause-card-actions">

                        <button
                          type="button"
                          className="admin-icon-button"
                          title="Move up"
                          disabled={
                            index === 0
                          }
                          onClick={() =>
                            moveCause(
                              index,
                              "up"
                            )
                          }
                        >

                          <ArrowUp
                            size={17}
                          />

                        </button>


                        <button
                          type="button"
                          className="admin-icon-button"
                          title="Move down"
                          disabled={
                            index ===
                            causes.items.length - 1
                          }
                          onClick={() =>
                            moveCause(
                              index,
                              "down"
                            )
                          }
                        >

                          <ArrowDown
                            size={17}
                          />

                        </button>


                        <button
                          type="button"
                          className="admin-icon-button admin-icon-danger"
                          title="Remove cause"
                          onClick={() =>
                            removeCause(
                              index
                            )
                          }
                        >

                          <Trash2
                            size={17}
                          />

                        </button>

                      </div>

                    </div>


                    <div className="admin-cause-card-body">


                      <div className="admin-cause-image-column">

                        <div className="admin-cause-image-preview">

                          {preview ? (

                            <img
                              src={preview}
                              alt={
                                cause.title ||
                                `Cause ${index + 1}`
                              }
                            />

                          ) : (

                            <div className="admin-causes-image-empty">

                              <ImageIcon
                                size={38}
                              />

                              <span>
                                No image
                              </span>

                            </div>

                          )}

                        </div>


                        <button
                          type="button"
                          className="btn-secondary admin-cause-upload-button"
                          onClick={() =>
                            causeInputRefs.current[
                              index
                            ]?.click()
                          }
                        >

                          <Upload size={16} />

                          {preview
                            ? "Replace Image"
                            : "Upload Image"}

                        </button>


                        <input
                          ref={element => {

                            causeInputRefs.current[
                              index
                            ] = element;

                          }}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          hidden
                          onChange={event =>
                            handleCauseImageChange(
                              index,
                              event
                            )
                          }
                        />

                      </div>


                      <div className="admin-cause-fields">

                        <div className="admin-form-grid">

                          <div className="form-group">

                            <label className="form-label">
                              Number
                            </label>

                            <input
                              type="text"
                              className="form-input"
                              value={
                                cause.number
                              }
                              onChange={event =>
                                updateCause(
                                  index,
                                  "number",
                                  event.target.value
                                )
                              }
                            />

                          </div>


                          <div className="form-group">

                            <label className="form-label">
                              Display Order
                            </label>

                            <input
                              type="number"
                              min="1"
                              className="form-input"
                              value={
                                cause.order
                              }
                              onChange={event =>
                                updateCause(
                                  index,
                                  "order",
                                  Number(
                                    event.target.value
                                  )
                                )
                              }
                            />

                          </div>

                        </div>


                        <div className="form-group">

                          <label className="form-label">
                            Cause Title
                          </label>

                          <input
                            type="text"
                            className="form-input"
                            value={
                              cause.title
                            }
                            onChange={event =>
                              updateCause(
                                index,
                                "title",
                                event.target.value
                              )
                            }
                            placeholder="Enter cause title"
                          />

                        </div>


                        <div className="form-group">

                          <label className="form-label">
                            Cause Description
                          </label>

                          <textarea
                            className="form-input"
                            rows="5"
                            value={
                              cause.description
                            }
                            onChange={event =>
                              updateCause(
                                index,
                                "description",
                                event.target.value
                              )
                            }
                            placeholder="Enter a description for this cause"
                          />

                        </div>

                      </div>

                    </div>

                  </article>

                );

              }
            )}

          </div>

        </section>


        {/* ==================================
            APPROACH
        ================================== */}

        <section className="admin-causes-section">

          <div className="admin-causes-section-header">

            <div className="admin-causes-section-heading">

              <span>
                04
              </span>

              <div>

                <h2>
                  Our Approach
                </h2>

                <p>
                  Manage the section explaining
                  how the Foundation creates impact.
                </p>

              </div>

            </div>

          </div>


          <div className="admin-causes-image-editor">

            <div className="admin-causes-large-image-preview">

              {approachPreview ? (

                <img
                  src={approachPreview}
                  alt="Approach"
                />

              ) : (

                <div className="admin-causes-image-empty">

                  <ImageIcon size={44} />

                  <span>
                    No approach image uploaded
                  </span>

                </div>

              )}

            </div>


            <div className="admin-causes-image-info">

              <span className="admin-section-eyebrow">
                BACKGROUND IMAGE
              </span>

              <h3>
                Approach Section Image
              </h3>

              <p>
                This image appears behind
                the Our Approach section.
              </p>

              <span className="admin-upload-note">
                JPG, JPEG, PNG or WEBP · Max 5MB
              </span>


              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  approachInputRef.current?.click()
                }
              >

                <Upload size={17} />

                {approachPreview
                  ? "Replace Image"
                  : "Upload Image"}

              </button>


              <input
                ref={approachInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                hidden
                onChange={
                  handleApproachChange
                }
              />

            </div>

          </div>


          <div className="admin-form-grid">

            <div className="form-group">

              <label className="form-label">
                Eyebrow
              </label>

              <input
                type="text"
                className="form-input"
                value={
                  causes.approach.eyebrow
                }
                onChange={event =>
                  updateSection(
                    "approach",
                    "eyebrow",
                    event.target.value
                  )
                }
              />

            </div>


            <div className="form-group">

              <label className="form-label">
                Section Title
              </label>

              <input
                type="text"
                className="form-input"
                value={
                  causes.approach.title
                }
                onChange={event =>
                  updateSection(
                    "approach",
                    "title",
                    event.target.value
                  )
                }
              />

            </div>

          </div>


          <div className="form-group">

            <label className="form-label">
              Description
            </label>

            <textarea
              className="form-input"
              rows="5"
              value={
                causes.approach.description
              }
              onChange={event =>
                updateSection(
                  "approach",
                  "description",
                  event.target.value
                )
              }
            />

          </div>

        </section>


        {/* ==================================
            CTA
        ================================== */}

        <section className="admin-causes-section">

          <div className="admin-causes-section-header">

            <div className="admin-causes-section-heading">

              <span>
                05
              </span>

              <div>

                <h2>
                  Call To Action
                </h2>

                <p>
                  Manage the final donation
                  and involvement section.
                </p>

              </div>

            </div>

          </div>


          <div className="admin-form-grid">

            <div className="form-group">

              <label className="form-label">
                Eyebrow
              </label>

              <input
                type="text"
                className="form-input"
                value={
                  causes.cta.eyebrow
                }
                onChange={event =>
                  updateSection(
                    "cta",
                    "eyebrow",
                    event.target.value
                  )
                }
              />

            </div>


            <div className="form-group">

              <label className="form-label">
                CTA Title
              </label>

              <input
                type="text"
                className="form-input"
                value={
                  causes.cta.title
                }
                onChange={event =>
                  updateSection(
                    "cta",
                    "title",
                    event.target.value
                  )
                }
              />

            </div>

          </div>


          <div className="form-group">

            <label className="form-label">
              Description
            </label>

            <textarea
              className="form-input"
              rows="4"
              value={
                causes.cta.description
              }
              onChange={event =>
                updateSection(
                  "cta",
                  "description",
                  event.target.value
                )
              }
            />

          </div>


          <div className="admin-form-grid">

            <div className="form-group">

              <label className="form-label">
                Donate Button Text
              </label>

              <input
                type="text"
                className="form-input"
                value={
                  causes.cta.donateText
                }
                onChange={event =>
                  updateSection(
                    "cta",
                    "donateText",
                    event.target.value
                  )
                }
              />

            </div>


            <div className="form-group">

              <label className="form-label">
                Get Involved Button Text
              </label>

              <input
                type="text"
                className="form-input"
                value={
                  causes.cta.involvedText
                }
                onChange={event =>
                  updateSection(
                    "cta",
                    "involvedText",
                    event.target.value
                  )
                }
              />

            </div>

          </div>

        </section>


        {/* ==================================
            SAVE BAR
        ================================== */}

        <div className="admin-causes-save-bar">

          <div>

            <strong>
              Our Causes Content
            </strong>

            <span>
              Changes are saved to the
              Foundation database when
              you click Save Causes.
            </span>

          </div>


          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
          >

            <Save size={18} />

            {saving
              ? "Saving Changes..."
              : "Save Causes"}

          </button>

        </div>

      </form>

    </div>

  );

};


export default AdminCauses;