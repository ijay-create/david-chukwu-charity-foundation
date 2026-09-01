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
  Target,
  Eye,
  HandHeart,
  User,
  Users,
  Shield,
  UsersRound,
  RefreshCw
} from "lucide-react";

import API from "../../api/axios";

import "../../styles/Admin.about.css";


// ========================================
// CONSTANTS
// ========================================

const API_BASE_URL = "http://localhost:5000";


// ========================================
// ICON OPTIONS
// ========================================

const iconOptions = [
  {
    value: "HandHeart",
    label: "Compassion",
    icon: HandHeart
  },
  {
    value: "User",
    label: "Dignity",
    icon: User
  },
  {
    value: "Users",
    label: "Inclusion",
    icon: Users
  },
  {
    value: "Shield",
    label: "Integrity",
    icon: Shield
  },
  {
    value: "UsersRound",
    label: "Community",
    icon: UsersRound
  }
];


// ========================================
// DEFAULT DATA
// ========================================

const defaultAbout = {
  hero: {
    imageUrl: ""
  },

  story: {
    eyebrow: "OUR STORY",
    title: "Who We Are",
    paragraphOne: "",
    paragraphTwo: ""
  },

  mission: {
    eyebrow: "OUR MISSION",
    text: ""
  },

  vision: {
    eyebrow: "OUR VISION",
    text: ""
  },

  founder: {
    eyebrow: "FOUNDER",
    name: "",
    paragraphOne: "",
    paragraphTwo: "",
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
    description: "",
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


// ========================================
// ADMIN ABOUT
// ========================================

const AdminAbout = () => {

  // ======================================
  // STATE
  // ======================================

  const [about, setAbout] =
    useState(defaultAbout);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ======================================
  // FILE STATE
  // ======================================

  const [heroFile, setHeroFile] =
    useState(null);

  const [heroPreview, setHeroPreview] =
    useState("");

  const [founderFile, setFounderFile] =
    useState(null);

  const [founderPreview, setFounderPreview] =
    useState("");

  const [
    davidChukwuLogoFile,
    setDavidChukwuLogoFile
  ] = useState(null);

  const [
    davidChukwuLogoPreview,
    setDavidChukwuLogoPreview
  ] = useState("");

  const [
    nicholasMarkLogoFile,
    setNicholasMarkLogoFile
  ] = useState(null);

  const [
    nicholasMarkLogoPreview,
    setNicholasMarkLogoPreview
  ] = useState("");

  // ======================================
  // FILE INPUT REFS
  // ======================================

  const heroInputRef =
    useRef(null);

  const founderInputRef =
    useRef(null);

  const davidLogoInputRef =
    useRef(null);

  const nicholasLogoInputRef =
    useRef(null);


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

    return `${API_BASE_URL}${fileUrl}`;
  };


  // ========================================
  // FETCH ABOUT
  // ========================================

  const fetchAbout = async () => {

    try {

      setLoading(true);
      setError("");
      setSuccess("");

      const response =
        await API.get("/about");

      const serverAbout =
        response.data?.about;

      if (!serverAbout) {

        throw new Error(
          "About Us data was not returned by the server."
        );

      }

      setAbout({
        ...defaultAbout,
        ...serverAbout,

        hero: {
          ...defaultAbout.hero,
          ...serverAbout.hero
        },

        story: {
          ...defaultAbout.story,
          ...serverAbout.story
        },

        mission: {
          ...defaultAbout.mission,
          ...serverAbout.mission
        },

        vision: {
          ...defaultAbout.vision,
          ...serverAbout.vision
        },

        founder: {
          ...defaultAbout.founder,
          ...serverAbout.founder
        },

        coreValues:
          Array.isArray(
            serverAbout.coreValues
          )
            ? serverAbout.coreValues
            : defaultAbout.coreValues,

        collaboration: {
          ...defaultAbout.collaboration,
          ...serverAbout.collaboration
        }
      });

      setHeroPreview(
        getMediaUrl(
          serverAbout.hero?.imageUrl
        )
      );

      setFounderPreview(
        getMediaUrl(
          serverAbout.founder?.imageUrl
        )
      );

      setDavidChukwuLogoPreview(
        getMediaUrl(
          serverAbout.collaboration
            ?.davidChukwuLogo
        )
      );

      setNicholasMarkLogoPreview(
        getMediaUrl(
          serverAbout.collaboration
            ?.nicholasMarkLogo
        )
      );

    } catch (requestError) {

      console.error(
        "GET ABOUT ERROR:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
        requestError.message ||
        "Unable to load About Us content."
      );

    } finally {

      setLoading(false);

    }
  };


  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {

    fetchAbout();

  }, []);


  // ========================================
  // UPDATE NESTED FIELD
  // ========================================

  const updateSection = (
    section,
    field,
    value
  ) => {

    setAbout(
      (previous) => ({
        ...previous,

        [section]: {
          ...previous[section],
          [field]: value
        }
      })
    );

    setSuccess("");
    setError("");
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
        "Please select a valid image file for the hero section."
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
  // FOUNDER IMAGE
  // ========================================

  const handleFounderChange = (
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
        "Please select a valid image file for the founder."
      );

      event.target.value = "";

      return;
    }

    const preview =
      URL.createObjectURL(file);

    setFounderFile(file);
    setFounderPreview(preview);

    setError("");
    setSuccess("");
  };


  // ========================================
  // DAVID CHUKWU LOGO
  // ========================================

  const handleDavidLogoChange = (
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
        "Please select a valid image file for the David Chukwu logo."
      );

      event.target.value = "";

      return;
    }

    const preview =
      URL.createObjectURL(file);

    setDavidChukwuLogoFile(file);

    setDavidChukwuLogoPreview(
      preview
    );

    setError("");
    setSuccess("");
  };


  // ========================================
  // NICHOLAS MARK LOGO
  // ========================================

  const handleNicholasLogoChange = (
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
        "Please select a valid image file for the Nicholas Mark logo."
      );

      event.target.value = "";

      return;
    }

    const preview =
      URL.createObjectURL(file);

    setNicholasMarkLogoFile(file);

    setNicholasMarkLogoPreview(
      preview
    );

    setError("");
    setSuccess("");
  };


  // ========================================
  // CORE VALUE CHANGE
  // ========================================

  const updateCoreValue = (
    index,
    field,
    value
  ) => {

    setAbout(
      (previous) => {

        const updatedValues =
          [...previous.coreValues];

        updatedValues[index] = {
          ...updatedValues[index],
          [field]: value
        };

        return {
          ...previous,
          coreValues: updatedValues
        };

      }
    );

    setSuccess("");
    setError("");
  };


  // ========================================
  // ADD CORE VALUE
  // ========================================

  const addCoreValue = () => {

    setAbout(
      (previous) => {

        const nextOrder =
          previous.coreValues.length + 1;

        return {
          ...previous,

          coreValues: [
            ...previous.coreValues,

            {
              title: "",
              subtitle: "",
              icon: "HandHeart",
              order: nextOrder
            }
          ]
        };

      }
    );

    setSuccess("");
    setError("");
  };


  // ========================================
  // REMOVE CORE VALUE
  // ========================================

  const removeCoreValue = (
    index
  ) => {

    setAbout(
      (previous) => {

        const updatedValues =
          previous.coreValues
            .filter(
              (_, valueIndex) =>
                valueIndex !== index
            )
            .map(
              (value, valueIndex) => ({
                ...value,
                order:
                  valueIndex + 1
              })
            );

        return {
          ...previous,
          coreValues: updatedValues
        };

      }
    );

    setSuccess("");
    setError("");
  };


  // ========================================
  // VALIDATE
  // ========================================

  const validateForm = () => {

    if (
      !about.story?.title?.trim()
    ) {

      setError(
        "Please enter the About Us story title."
      );

      return false;
    }

    if (
      !about.story?.paragraphOne?.trim()
    ) {

      setError(
        "Please enter the first story paragraph."
      );

      return false;
    }

    if (
      !about.mission?.text?.trim()
    ) {

      setError(
        "Please enter the mission statement."
      );

      return false;
    }

    if (
      !about.vision?.text?.trim()
    ) {

      setError(
        "Please enter the vision statement."
      );

      return false;
    }

    if (
      !about.founder?.name?.trim()
    ) {

      setError(
        "Please enter the founder's name."
      );

      return false;
    }

    for (
      const value of about.coreValues
    ) {

      if (
        !value.title?.trim()
      ) {

        setError(
          "Every core value must have a title."
        );

        return false;
      }

      if (
        !value.subtitle?.trim()
      ) {

        setError(
          "Every core value must have a subtitle."
        );

        return false;
      }

    }

    return true;
  };


  // ========================================
  // SAVE ABOUT
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


      // ====================================
      // TEXT DATA
      // ====================================

      formData.append(
        "story",
        JSON.stringify(
          about.story
        )
      );

      formData.append(
        "mission",
        JSON.stringify(
          about.mission
        )
      );

      formData.append(
        "vision",
        JSON.stringify(
          about.vision
        )
      );

      formData.append(
        "founder",
        JSON.stringify({
          ...about.founder,
          imageUrl:
            about.founder?.imageUrl ||
            ""
        })
      );

      formData.append(
        "coreValues",
        JSON.stringify(
          about.coreValues
        )
      );

      formData.append(
        "collaboration",
        JSON.stringify({
          ...about.collaboration,
          davidChukwuLogo:
            about.collaboration
              ?.davidChukwuLogo ||
            "",
          nicholasMarkLogo:
            about.collaboration
              ?.nicholasMarkLogo ||
            ""
        })
      );


      // ====================================
      // HERO IMAGE
      // ====================================

      if (heroFile) {

        formData.append(
          "heroImage",
          heroFile
        );

      }


      // ====================================
      // FOUNDER IMAGE
      // ====================================

      if (founderFile) {

        formData.append(
          "founderImage",
          founderFile
        );

      }


      // ====================================
      // DAVID CHUKWU LOGO
      // ====================================

      if (
        davidChukwuLogoFile
      ) {

        formData.append(
          "davidChukwuLogo",
          davidChukwuLogoFile
        );

      }


      // ====================================
      // NICHOLAS MARK LOGO
      // ====================================

      if (
        nicholasMarkLogoFile
      ) {

        formData.append(
          "nicholasMarkLogo",
          nicholasMarkLogoFile
        );

      }


      // ====================================
      // SEND TO BACKEND
      // ====================================

      await API.put(
        "/about",
        formData
      );


      // ====================================
      // SUCCESS
      // ====================================

      setSuccess(
        "About Us content updated successfully."
      );

      setHeroFile(null);
      setFounderFile(null);
      setDavidChukwuLogoFile(null);
      setNicholasMarkLogoFile(null);

      await fetchAbout();

    } catch (requestError) {

      console.error(
        "UPDATE ABOUT ERROR:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
        "Unable to update About Us content."
      );

    } finally {

      setSaving(false);

    }
  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <div className="admin-page">

        <div className="admin-page-header">

          <div>

            <h1>
              About Us Management
            </h1>

            <p>
              Manage the public About Us
              page content.
            </p>

          </div>

        </div>

        <div className="admin-empty-state">

          <RefreshCw
            size={42}
            className="admin-loading-icon"
          />

          <h3>
            Loading About Us...
          </h3>

          <p>
            Fetching content from the server.
          </p>

        </div>

      </div>

    );

  }


  // ========================================
  // RENDER
  // ========================================

  return (

    <div className="admin-page admin-about-page">

      {/* ====================================
          PAGE HEADER
      ==================================== */}

      <div className="admin-page-header">

        <div>

          <span className="admin-section-eyebrow">
            CONTENT MANAGEMENT
          </span>

          <h1>
            About Us Management
          </h1>

          <p>
            Manage the content, images,
            founder information and
            collaboration details displayed
            on your public About Us page.
          </p>

        </div>


        <div className="admin-about-header-actions">

          <button
            type="button"
            className="btn-secondary"
            onClick={fetchAbout}
            disabled={saving}
          >

            <RefreshCw size={17} />

            Refresh

          </button>


          <button
            type="submit"
            form="about-management-form"
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
        id="about-management-form"
        onSubmit={handleSubmit}
        className="admin-about-form"
      >

        {/* ==================================
            HERO
        ================================== */}

        <section className="admin-about-section">

          <div className="admin-about-section-header">

            <div>

              <span>
                01
              </span>

              <div>

                <h2>
                  Hero Section
                </h2>

                <p>
                  Update the main image displayed
                  at the top of the About Us page.
                </p>

              </div>

            </div>

          </div>


          <div className="admin-about-image-editor">

            <div className="admin-about-image-preview">

              {heroPreview ? (

                <img
                  src={heroPreview}
                  alt="About hero preview"
                />

              ) : (

                <div className="admin-about-image-empty">

                  <ImageIcon
                    size={42}
                  />

                  <span>
                    No hero image uploaded
                  </span>

                </div>

              )}

            </div>


            <div className="admin-about-image-controls">

              <h3>
                Hero Image
              </h3>

              <p>
                This image appears behind
                the About Us hero banner.
              </p>

              <span className="admin-upload-note">
                JPG, JPEG or PNG
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
                accept="image/jpeg,image/jpg,image/png"
                hidden
                onChange={
                  handleHeroChange
                }
              />

            </div>

          </div>

        </section>


        {/* ==================================
            STORY
        ================================== */}

        <section className="admin-about-section">

          <div className="admin-about-section-header">

            <div>

              <span>
                02
              </span>

              <div>

                <h2>
                  Our Story
                </h2>

                <p>
                  Manage the introductory story
                  displayed on the About Us page.
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
                  about.story.eyebrow
                }
                onChange={(event) =>
                  updateSection(
                    "story",
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
                  about.story.title
                }
                onChange={(event) =>
                  updateSection(
                    "story",
                    "title",
                    event.target.value
                  )
                }
              />

            </div>

          </div>


          <div className="form-group">

            <label className="form-label">
              First Paragraph
            </label>

            <textarea
              className="form-input"
              rows="5"
              value={
                about.story.paragraphOne
              }
              onChange={(event) =>
                updateSection(
                  "story",
                  "paragraphOne",
                  event.target.value
                )
              }
            />

          </div>


          <div className="form-group">

            <label className="form-label">
              Second Paragraph
            </label>

            <textarea
              className="form-input"
              rows="5"
              value={
                about.story.paragraphTwo
              }
              onChange={(event) =>
                updateSection(
                  "story",
                  "paragraphTwo",
                  event.target.value
                )
              }
            />

          </div>

        </section>


        {/* ==================================
            MISSION & VISION
        ================================== */}

        <section className="admin-about-section">

          <div className="admin-about-section-header">

            <div>

              <span>
                03
              </span>

              <div>

                <h2>
                  Mission & Vision
                </h2>

                <p>
                  Manage the Foundation's mission
                  and vision statements.
                </p>

              </div>

            </div>

          </div>


          <div className="admin-about-two-column">

            {/* MISSION */}

            <div className="admin-about-editor-card">

              <div className="admin-about-editor-icon">

                <Target
                  size={22}
                />

              </div>

              <span className="admin-section-eyebrow">
                MISSION
              </span>

              <div className="form-group">

                <label className="form-label">
                  Eyebrow
                </label>

                <input
                  type="text"
                  className="form-input"
                  value={
                    about.mission.eyebrow
                  }
                  onChange={(event) =>
                    updateSection(
                      "mission",
                      "eyebrow",
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="form-group">

                <label className="form-label">
                  Mission Statement
                </label>

                <textarea
                  className="form-input"
                  rows="8"
                  value={
                    about.mission.text
                  }
                  onChange={(event) =>
                    updateSection(
                      "mission",
                      "text",
                      event.target.value
                    )
                  }
                />

              </div>

            </div>


            {/* VISION */}

            <div className="admin-about-editor-card">

              <div className="admin-about-editor-icon">

                <Eye
                  size={22}
                />

              </div>

              <span className="admin-section-eyebrow">
                VISION
              </span>

              <div className="form-group">

                <label className="form-label">
                  Eyebrow
                </label>

                <input
                  type="text"
                  className="form-input"
                  value={
                    about.vision.eyebrow
                  }
                  onChange={(event) =>
                    updateSection(
                      "vision",
                      "eyebrow",
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="form-group">

                <label className="form-label">
                  Vision Statement
                </label>

                <textarea
                  className="form-input"
                  rows="8"
                  value={
                    about.vision.text
                  }
                  onChange={(event) =>
                    updateSection(
                      "vision",
                      "text",
                      event.target.value
                    )
                  }
                />

              </div>

            </div>

          </div>

        </section>


        {/* ==================================
            FOUNDER
        ================================== */}

        <section className="admin-about-section">

          <div className="admin-about-section-header">

            <div>

              <span>
                04
              </span>

              <div>

                <h2>
                  Founder
                </h2>

                <p>
                  Manage the founder's profile,
                  biography and image.
                </p>

              </div>

            </div>

          </div>


          <div className="admin-founder-editor">

            {/* IMAGE */}

            <div className="admin-founder-image-area">

              <div className="admin-founder-image">

                {founderPreview ? (

                  <img
                    src={founderPreview}
                    alt={
                      about.founder.name ||
                      "Founder"
                    }
                  />

                ) : (

                  <div className="admin-about-image-empty">

                    <User
                      size={48}
                    />

                    <span>
                      No founder image
                    </span>

                  </div>

                )}

              </div>


              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  founderInputRef.current?.click()
                }
              >

                <Upload size={17} />

                {founderPreview
                  ? "Replace Founder Image"
                  : "Upload Founder Image"}

              </button>


              <input
                ref={founderInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                hidden
                onChange={
                  handleFounderChange
                }
              />

            </div>


            {/* CONTENT */}

            <div className="admin-founder-content">

              <div className="form-group">

                <label className="form-label">
                  Eyebrow
                </label>

                <input
                  type="text"
                  className="form-input"
                  value={
                    about.founder.eyebrow
                  }
                  onChange={(event) =>
                    updateSection(
                      "founder",
                      "eyebrow",
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="form-group">

                <label className="form-label">
                  Founder Name
                </label>

                <input
                  type="text"
                  className="form-input"
                  value={
                    about.founder.name
                  }
                  onChange={(event) =>
                    updateSection(
                      "founder",
                      "name",
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="form-group">

                <label className="form-label">
                  First Paragraph
                </label>

                <textarea
                  className="form-input"
                  rows="5"
                  value={
                    about.founder.paragraphOne
                  }
                  onChange={(event) =>
                    updateSection(
                      "founder",
                      "paragraphOne",
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="form-group">

                <label className="form-label">
                  Second Paragraph
                </label>

                <textarea
                  className="form-input"
                  rows="5"
                  value={
                    about.founder.paragraphTwo
                  }
                  onChange={(event) =>
                    updateSection(
                      "founder",
                      "paragraphTwo",
                      event.target.value
                    )
                  }
                />

              </div>

            </div>

          </div>

        </section>


        {/* ==================================
            CORE VALUES
        ================================== */}

        <section className="admin-about-section">

          <div className="admin-about-section-header">

            <div>

              <span>
                05
              </span>

              <div>

                <h2>
                  Core Values
                </h2>

                <p>
                  Add, edit, reorder and remove
                  the Foundation's core values.
                </p>

              </div>

            </div>


            <button
              type="button"
              className="btn-secondary"
              onClick={
                addCoreValue
              }
            >

              <Plus size={17} />

              Add Value

            </button>

          </div>


          <div className="admin-core-values">

            {about.coreValues.map(
              (value, index) => {

                const selectedIcon =
                  iconOptions.find(
                    (option) =>
                      option.value ===
                      value.icon
                  );

                const ValueIcon =
                  selectedIcon?.icon ||
                  HandHeart;

                return (

                  <div
                    className="admin-core-value-card"
                    key={
                      `${value.title}-${index}`
                    }
                  >

                    <div className="admin-core-value-drag">

                      <GripVertical
                        size={19}
                      />

                      <span>
                        {index + 1}
                      </span>

                    </div>


                    <div className="admin-core-value-icon">

                      <ValueIcon
                        size={24}
                      />

                    </div>


                    <div className="admin-core-value-fields">

                      <div className="form-group">

                        <label className="form-label">
                          Title
                        </label>

                        <input
                          type="text"
                          className="form-input"
                          value={
                            value.title
                          }
                          onChange={(event) =>
                            updateCoreValue(
                              index,
                              "title",
                              event.target.value
                            )
                          }
                        />

                      </div>


                      <div className="form-group">

                        <label className="form-label">
                          Subtitle
                        </label>

                        <input
                          type="text"
                          className="form-input"
                          value={
                            value.subtitle
                          }
                          onChange={(event) =>
                            updateCoreValue(
                              index,
                              "subtitle",
                              event.target.value
                            )
                          }
                        />

                      </div>


                      <div className="form-group">

                        <label className="form-label">
                          Icon
                        </label>

                        <select
                          className="form-input"
                          value={
                            value.icon
                          }
                          onChange={(event) =>
                            updateCoreValue(
                              index,
                              "icon",
                              event.target.value
                            )
                          }
                        >

                          {iconOptions.map(
                            (option) => (

                              <option
                                key={
                                  option.value
                                }
                                value={
                                  option.value
                                }
                              >
                                {option.label}
                              </option>

                            )
                          )}

                        </select>

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
                            value.order
                          }
                          onChange={(event) =>
                            updateCoreValue(
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


                    <button
                      type="button"
                      className="admin-core-value-delete"
                      onClick={() =>
                        removeCoreValue(
                          index
                        )
                      }
                      title="Remove value"
                    >

                      <Trash2
                        size={18}
                      />

                    </button>

                  </div>

                );

              }
            )}

          </div>

        </section>


        {/* ==================================
            COLLABORATION
        ================================== */}

        <section className="admin-about-section">

          <div className="admin-about-section-header">

            <div>

              <span>
                06
              </span>

              <div>

                <h2>
                  Collaboration
                </h2>

                <p>
                  Manage the collaboration section
                  and partner logos.
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
                  about.collaboration.eyebrow
                }
                onChange={(event) =>
                  updateSection(
                    "collaboration",
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
                  about.collaboration.title
                }
                onChange={(event) =>
                  updateSection(
                    "collaboration",
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
                about.collaboration.description
              }
              onChange={(event) =>
                updateSection(
                  "collaboration",
                  "description",
                  event.target.value
                )
              }
            />

          </div>


          <div className="admin-form-grid">

            <div className="form-group">

              <label className="form-label">
                David Chukwu Foundation Text
              </label>

              <input
                type="text"
                className="form-input"
                value={
                  about.collaboration
                    .davidChukwuText
                }
                onChange={(event) =>
                  updateSection(
                    "collaboration",
                    "davidChukwuText",
                    event.target.value
                  )
                }
              />

            </div>


            <div className="form-group">

              <label className="form-label">
                Nicholas Mark Foundation Text
              </label>

              <input
                type="text"
                className="form-input"
                value={
                  about.collaboration
                    .nicholasMarkText
                }
                onChange={(event) =>
                  updateSection(
                    "collaboration",
                    "nicholasMarkText",
                    event.target.value
                  )
                }
              />

            </div>

          </div>


          <div className="form-group">

            <label className="form-label">
              Registration Number
            </label>

            <input
              type="text"
              className="form-input"
              value={
                about.collaboration
                  .registrationNumber
              }
              onChange={(event) =>
                updateSection(
                  "collaboration",
                  "registrationNumber",
                  event.target.value
                )
              }
            />

          </div>


          {/* LOGOS */}

          <div className="admin-collaboration-logos">

            {/* DAVID LOGO */}

            <div className="admin-logo-editor">

              <div className="admin-logo-preview">

                {davidChukwuLogoPreview ? (

                  <img
                    src={
                      davidChukwuLogoPreview
                    }
                    alt="David Chukwu logo"
                  />

                ) : (

                  <div className="admin-logo-empty">

                    <ImageIcon
                      size={36}
                    />

                    <span>
                      No logo uploaded
                    </span>

                  </div>

                )}

              </div>


              <div className="admin-logo-info">

                <h3>
                  David Chukwu Charity Foundation
                </h3>

                <p>
                  Upload the Foundation logo.
                </p>


                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() =>
                    davidLogoInputRef.current?.click()
                  }
                >

                  <Upload size={17} />

                  {davidChukwuLogoPreview
                    ? "Replace Logo"
                    : "Upload Logo"}

                </button>


                <input
                  ref={
                    davidLogoInputRef
                  }
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  hidden
                  onChange={
                    handleDavidLogoChange
                  }
                />

              </div>

            </div>


            {/* NICHOLAS LOGO */}

            <div className="admin-logo-editor">

              <div className="admin-logo-preview">

                {nicholasMarkLogoPreview ? (

                  <img
                    src={
                      nicholasMarkLogoPreview
                    }
                    alt="Nicholas Mark logo"
                  />

                ) : (

                  <div className="admin-logo-empty">

                    <ImageIcon
                      size={36}
                    />

                    <span>
                      No logo uploaded
                    </span>

                  </div>

                )}

              </div>


              <div className="admin-logo-info">

                <h3>
                  Nicholas Mark Foundation
                </h3>

                <p>
                  Upload the partner foundation logo.
                </p>


                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() =>
                    nicholasLogoInputRef.current?.click()
                  }
                >

                  <Upload size={17} />

                  {nicholasMarkLogoPreview
                    ? "Replace Logo"
                    : "Upload Logo"}

                </button>


                <input
                  ref={
                    nicholasLogoInputRef
                  }
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  hidden
                  onChange={
                    handleNicholasLogoChange
                  }
                />

              </div>

            </div>

          </div>

        </section>


        {/* ==================================
            BOTTOM SAVE
        ================================== */}

        <div className="admin-about-save-bar">

          <div>

            <strong>
              About Us Content
            </strong>

            <span>
              Changes will be reflected on
              the public About Us page.
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
              : "Save About Us"}

          </button>

        </div>

      </form>

    </div>

  );

};


export default AdminAbout;