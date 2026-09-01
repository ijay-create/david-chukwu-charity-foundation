import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

import "../../styles/Admin.settings.css";

const AdminSettings = () => {
  // ==========================================================================
  // SETTINGS STATE
  // ==========================================================================

  const [settings, setSettings] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  // ==========================================================================
  // UPLOAD STATES
  // ==========================================================================

  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingAbout, setUploadingAbout] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] =
    useState(false);
  const [uploadingCta, setUploadingCta] = useState(false);
  const [uploadingCause, setUploadingCause] =
    useState(null);

  // ==========================================================================
  // SELECTED FILES
  // ==========================================================================

  const [heroImageFile, setHeroImageFile] =
    useState(null);

  const [aboutImageFile, setAboutImageFile] =
    useState(null);

  const [featuredImageFile, setFeaturedImageFile] =
    useState(null);

  const [ctaImageFile, setCtaImageFile] =
    useState(null);

  const [causeImageFiles, setCauseImageFiles] =
    useState({
      0: null,
      1: null,
      2: null,
      3: null,
    });

  // ==========================================================================
  // IMAGE PREVIEWS
  // ==========================================================================

  const [heroPreview, setHeroPreview] =
    useState("");

  const [aboutPreview, setAboutPreview] =
    useState("");

  const [featuredPreview, setFeaturedPreview] =
    useState("");

  const [ctaPreview, setCtaPreview] =
    useState("");

  const [causePreviews, setCausePreviews] =
    useState({
      0: "",
      1: "",
      2: "",
      3: "",
    });

  // ==========================================================================
  // MESSAGES
  // ==========================================================================

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================================================
  // IMAGE URL HELPER
  // ==========================================================================

  const getImageUrl = useCallback((image) => {
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

    const serverURL = baseURL.replace(
      /\/api\/?$/,
      ""
    );

    if (image.startsWith("/")) {
      return `${serverURL}${image}`;
    }

    return `${serverURL}/${image}`;
  }, []);

  // ==========================================================================
  // REMOVE ABOUT PAGE FROM SETTINGS
  // ==========================================================================

  const cleanSettings = useCallback(
    (loadedSettings) => {
      if (!loadedSettings) {
        return loadedSettings;
      }

      const {
        aboutPage,
        ...settingsWithoutAboutPage
      } = loadedSettings;

      return settingsWithoutAboutPage;
    },
    []
  );

  // ==========================================================================
  // UPDATE IMAGE PREVIEWS
  // ==========================================================================

  const updatePreviews = useCallback(
    (loadedSettings) => {
      const homepage =
        loadedSettings?.homepage || {};

      const hero =
        homepage.hero || {};

      const about =
        homepage.about || {};

      const featured =
        homepage.featured || {};

      const cta =
        homepage.cta || {};

      const causes =
        homepage.causes?.items || [];

      setHeroPreview(
        getImageUrl(hero.image || "")
      );

      setAboutPreview(
        getImageUrl(about.image || "")
      );

      setFeaturedPreview(
        getImageUrl(featured.image || "")
      );

      setCtaPreview(
        getImageUrl(cta.image || "")
      );

      setCausePreviews({
        0: getImageUrl(
          causes[0]?.image || ""
        ),
        1: getImageUrl(
          causes[1]?.image || ""
        ),
        2: getImageUrl(
          causes[2]?.image || ""
        ),
        3: getImageUrl(
          causes[3]?.image || ""
        ),
      });
    },
    [getImageUrl]
  );

  // ==========================================================================
  // FETCH SETTINGS
  // ==========================================================================

  const fetchSettings = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await API.get("/settings");

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Failed to load settings."
          );
        }

        const loadedSettings =
          response.data?.settings;

        if (!loadedSettings) {
          throw new Error(
            "No settings were returned by the server."
          );
        }

        const cleanedSettings =
          cleanSettings(
            loadedSettings
          );

        setSettings(cleanedSettings);

        updatePreviews(
          cleanedSettings
        );
      } catch (err) {
        console.error(
          "FETCH SETTINGS ERROR:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load settings."
        );
      } finally {
        setLoading(false);
      }
    },
    [
      cleanSettings,
      updatePreviews,
    ]
  );

  // ==========================================================================
  // INITIAL LOAD
  // ==========================================================================

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // ==========================================================================
  // CLEANUP BLOB URLS
  // ==========================================================================

  useEffect(() => {
    return () => {
      const previews = [
        heroPreview,
        aboutPreview,
        featuredPreview,
        ctaPreview,
        ...Object.values(causePreviews),
      ];

      previews.forEach((preview) => {
        if (
          preview &&
          preview.startsWith("blob:")
        ) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [
    heroPreview,
    aboutPreview,
    featuredPreview,
    ctaPreview,
    causePreviews,
  ]);

  // ==========================================================================
  // MESSAGE HELPERS
  // ==========================================================================

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  // ==========================================================================
  // TOP LEVEL FIELD CHANGE
  // ==========================================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    clearMessages();

    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================================================
  // BOOLEAN FIELD CHANGE
  // ==========================================================================

  const handleBooleanChange = (event) => {
    const {
      name,
      checked,
    } = event.target;

    clearMessages();

    setSettings((previous) => ({
      ...previous,
      [name]: checked,
    }));
  };

  // ==========================================================================
  // NUMBER FIELD CHANGE
  // ==========================================================================

  const handleNumberChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    clearMessages();

    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================================================
  // HOMEPAGE FIELD CHANGE
  // ==========================================================================

  const handleHomepageChange = (
    section,
    field,
    value
  ) => {
    clearMessages();

    setSettings((previous) => ({
      ...previous,

      homepage: {
        ...(previous.homepage || {}),

        [section]: {
          ...(previous.homepage?.[section] ||
            {}),

          [field]: value,
        },
      },
    }));
  };

  // ==========================================================================
  // CAUSE FIELD CHANGE
  // ==========================================================================

  const handleCauseChange = (
    index,
    field,
    value
  ) => {
    clearMessages();

    setSettings((previous) => {
      const currentCauses =
        previous.homepage?.causes?.items ||
        [];

      const updatedCauses = [
        ...currentCauses,
      ];

      updatedCauses[index] = {
        ...(updatedCauses[index] || {}),
        [field]: value,
      };

      return {
        ...previous,

        homepage: {
          ...(previous.homepage || {}),

          causes: {
            ...(previous.homepage?.causes ||
              {}),

            items: updatedCauses,
          },
        },
      };
    });
  };

  // ==========================================================================
  // IMAGE VALIDATION
  // ==========================================================================

  const validateImage = (
    file,
    imageName
  ) => {
    if (!file) {
      setError(
        `Please select a ${imageName.toLowerCase()}.`
      );

      return false;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(file.type)
    ) {
      setError(
        `${imageName} must be JPG, JPEG, PNG or WEBP.`
      );

      return false;
    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        `${imageName} must not exceed 5MB.`
      );

      return false;
    }

    return true;
  };

  // ==========================================================================
  // CREATE PREVIEW
  // ==========================================================================

  const createPreview = (file) => {
    return URL.createObjectURL(file);
  };

  // ==========================================================================
  // HERO IMAGE SELECT
  // ==========================================================================

  const handleHeroImageSelect = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !validateImage(
        file,
        "Hero image"
      )
    ) {
      event.target.value = "";
      return;
    }

    clearMessages();

    if (
      heroPreview?.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        heroPreview
      );
    }

    const preview =
      createPreview(file);

    setHeroImageFile(file);
    setHeroPreview(preview);
  };

  // ==========================================================================
  // ABOUT IMAGE SELECT
  // ==========================================================================

  const handleAboutImageSelect = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !validateImage(
        file,
        "About image"
      )
    ) {
      event.target.value = "";
      return;
    }

    clearMessages();

    if (
      aboutPreview?.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        aboutPreview
      );
    }

    const preview =
      createPreview(file);

    setAboutImageFile(file);
    setAboutPreview(preview);
  };

  // ==========================================================================
  // FEATURED IMAGE SELECT
  // ==========================================================================

  const handleFeaturedImageSelect = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !validateImage(
        file,
        "Featured image"
      )
    ) {
      event.target.value = "";
      return;
    }

    clearMessages();

    if (
      featuredPreview?.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        featuredPreview
      );
    }

    const preview =
      createPreview(file);

    setFeaturedImageFile(file);
    setFeaturedPreview(preview);
  };

  // ==========================================================================
  // CTA IMAGE SELECT
  // ==========================================================================

  const handleCtaImageSelect = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !validateImage(
        file,
        "CTA image"
      )
    ) {
      event.target.value = "";
      return;
    }

    clearMessages();

    if (
      ctaPreview?.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        ctaPreview
      );
    }

    const preview =
      createPreview(file);

    setCtaImageFile(file);
    setCtaPreview(preview);
  };

  // ==========================================================================
  // CAUSE IMAGE SELECT
  // ==========================================================================

  const handleCauseImageSelect = (
    event,
    index
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !validateImage(
        file,
        `Cause ${index + 1} image`
      )
    ) {
      event.target.value = "";
      return;
    }

    clearMessages();

    const oldPreview =
      causePreviews[index];

    if (
      oldPreview?.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        oldPreview
      );
    }

    const preview =
      createPreview(file);

    setCauseImageFiles(
      (previous) => ({
        ...previous,
        [index]: file,
      })
    );

    setCausePreviews(
      (previous) => ({
        ...previous,
        [index]: preview,
      })
    );
  };

  // ==========================================================================
  // PROCESS UPLOAD RESPONSE
  // ==========================================================================

  const processUploadResponse = (
    response,
    fallbackMessage
  ) => {
    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          fallbackMessage
      );
    }

    const updatedSettings =
      response.data?.settings;

    if (updatedSettings) {
      const cleanedSettings =
        cleanSettings(
          updatedSettings
        );

      setSettings(
        cleanedSettings
      );

      updatePreviews(
        cleanedSettings
      );
    }

    return updatedSettings;
  };

  // ==========================================================================
  // UPLOAD HERO IMAGE
  // ==========================================================================

  const handleHeroUpload = async () => {
    if (!heroImageFile) {
      setError(
        "Please select a hero image first."
      );

      return;
    }

    try {
      setUploadingHero(true);
      clearMessages();

      const formData =
        new FormData();

      formData.append(
        "heroImage",
        heroImageFile
      );

      const response =
        await API.post(
          "/settings/hero-image",
          formData,
          {
            headers: {
              "Content-Type": undefined,
            },
          }
        );

      processUploadResponse(
        response,
        "Failed to upload hero image."
      );

      setHeroImageFile(null);

      setMessage(
        "Hero image uploaded successfully."
      );
    } catch (err) {
      console.error(
        "UPLOAD HERO IMAGE ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to upload hero image."
      );
    } finally {
      setUploadingHero(false);
    }
  };

  // ==========================================================================
  // UPLOAD ABOUT IMAGE
  // ==========================================================================

  const handleAboutUpload = async () => {
    if (!aboutImageFile) {
      setError(
        "Please select an about image first."
      );

      return;
    }

    try {
      setUploadingAbout(true);
      clearMessages();

      const formData =
        new FormData();

      formData.append(
        "aboutImage",
        aboutImageFile
      );

      const response =
        await API.post(
          "/settings/about-image",
          formData,
          {
            headers: {
              "Content-Type": undefined,
            },
          }
        );

      processUploadResponse(
        response,
        "Failed to upload about image."
      );

      setAboutImageFile(null);

      setMessage(
        "About image uploaded successfully."
      );
    } catch (err) {
      console.error(
        "UPLOAD ABOUT IMAGE ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to upload about image."
      );
    } finally {
      setUploadingAbout(false);
    }
  };

  // ==========================================================================
  // UPLOAD FEATURED IMAGE
  // ==========================================================================

  const handleFeaturedUpload = async () => {
    if (!featuredImageFile) {
      setError(
        "Please select a featured image first."
      );

      return;
    }

    try {
      setUploadingFeatured(true);
      clearMessages();

      const formData =
        new FormData();

      formData.append(
        "featuredImage",
        featuredImageFile
      );

      const response =
        await API.post(
          "/settings/featured-image",
          formData,
          {
            headers: {
              "Content-Type": undefined,
            },
          }
        );

      processUploadResponse(
        response,
        "Failed to upload featured image."
      );

      setFeaturedImageFile(null);

      setMessage(
        "Featured image uploaded successfully."
      );
    } catch (err) {
      console.error(
        "UPLOAD FEATURED IMAGE ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to upload featured image."
      );
    } finally {
      setUploadingFeatured(false);
    }
  };

  // ==========================================================================
  // UPLOAD CTA IMAGE
  // ==========================================================================

  const handleCtaUpload = async () => {
    if (!ctaImageFile) {
      setError(
        "Please select a CTA image first."
      );

      return;
    }

    try {
      setUploadingCta(true);
      clearMessages();

      const formData =
        new FormData();

      formData.append(
        "ctaImage",
        ctaImageFile
      );

      const response =
        await API.post(
          "/settings/cta-image",
          formData,
          {
            headers: {
              "Content-Type": undefined,
            },
          }
        );

      processUploadResponse(
        response,
        "Failed to upload CTA image."
      );

      setCtaImageFile(null);

      setMessage(
        "CTA image uploaded successfully."
      );
    } catch (err) {
      console.error(
        "UPLOAD CTA IMAGE ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to upload CTA image."
      );
    } finally {
      setUploadingCta(false);
    }
  };

  // ==========================================================================
  // UPLOAD CAUSE IMAGE
  // ==========================================================================

  const handleCauseUpload = async (
    index
  ) => {
    const file =
      causeImageFiles[index];

    if (!file) {
      setError(
        `Please select a Cause ${
          index + 1
        } image first.`
      );

      return;
    }

    try {
      setUploadingCause(index);
      clearMessages();

      const formData =
        new FormData();

      formData.append(
        "causeImage",
        file
      );

      formData.append(
        "causeIndex",
        String(index)
      );

      const response =
        await API.post(
          "/settings/causes-image",
          formData,
          {
            headers: {
              "Content-Type": undefined,
            },
          }
        );

      processUploadResponse(
        response,
        "Failed to upload cause image."
      );

      setCauseImageFiles(
        (previous) => ({
          ...previous,
          [index]: null,
        })
      );

      setMessage(
        `Cause ${
          index + 1
        } image uploaded successfully.`
      );
    } catch (err) {
      console.error(
        "UPLOAD CAUSE IMAGE ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to upload cause image."
      );
    } finally {
      setUploadingCause(null);
    }
  };

  // ==========================================================================
  // CREATE SAVE PAYLOAD
  // ==========================================================================

  const createSavePayload = () => {
    const homepage =
      settings.homepage || {};

    const hero =
      homepage.hero || {};

    const about =
      homepage.about || {};

    const causes =
      homepage.causes || {};

    const featured =
      homepage.featured || {};

    const cta =
      homepage.cta || {};

    const footer =
      settings.footer || {};

    const causesItems =
      causes.items || [];

    return {
      // ========================================================================
      // FOUNDATION INFORMATION
      // ========================================================================

      foundationName:
        settings.foundationName || "",

      description:
        settings.description || "",

      email:
        settings.email || "",

      phone:
        settings.phone || "",

      address:
        settings.address || "",

      website:
        settings.website || "",

      // ========================================================================
      // SOCIAL MEDIA
      // ========================================================================

      facebook:
        settings.facebook || "",

      instagram:
        settings.instagram || "",

      twitter:
        settings.twitter || "",

      linkedin:
        settings.linkedin || "",

      // ========================================================================
      // FOOTER
      // ========================================================================

      footer: {
        description:
          footer.description || "",

        copyrightText:
          footer.copyrightText || "",

        email:
          footer.email || "",

        phone:
          footer.phone || "",

        address:
          footer.address || "",

        facebook:
          footer.facebook || "",

        instagram:
          footer.instagram || "",

        twitter:
          footer.twitter || "",

        linkedin:
          footer.linkedin || "",
      },

      // ========================================================================
      // HOMEPAGE
      // ========================================================================

      homepage: {
        hero: {
          eyebrow:
            hero.eyebrow || "",

          title:
            hero.title || "",

          description:
            hero.description || "",

          primaryButtonText:
            hero.primaryButtonText || "",

          secondaryButtonText:
            hero.secondaryButtonText || "",

          image:
            hero.image || "",
        },

        about: {
          eyebrow:
            about.eyebrow || "",

          title:
            about.title || "",

          description:
            about.description || "",

          buttonText:
            about.buttonText || "",

          image:
            about.image || "",
        },

        causes: {
          eyebrow:
            causes.eyebrow || "",

          title:
            causes.title || "",

          description:
            causes.description || "",

          items: causesItems.map(
            (cause) => ({
              title:
                cause?.title || "",

              text:
                cause?.text || "",

              image:
                cause?.image || "",
            })
          ),
        },

        featured: {
          eyebrow:
            featured.eyebrow || "",

          title:
            featured.title || "",

          description:
            featured.description || "",

          buttonText:
            featured.buttonText || "",

          image:
            featured.image || "",
        },

        cta: {
          eyebrow:
            cta.eyebrow || "",

          title:
            cta.title || "",

          description:
            cta.description || "",

          buttonText:
            cta.buttonText || "",

          image:
            cta.image || "",
        },
      },

      // ========================================================================
      // DONATION SETTINGS
      // ========================================================================

      donationEnabled:
        Boolean(
          settings.donationEnabled
        ),

      donationCurrency:
        settings.donationCurrency ||
        "GBP",

      minimumDonation:
        settings.minimumDonation ===
          "" ||
        settings.minimumDonation ===
          null ||
        settings.minimumDonation ===
          undefined
          ? 0
          : Number(
              settings.minimumDonation
            ),

      maximumDonation:
        settings.maximumDonation ===
          "" ||
        settings.maximumDonation ===
          null ||
        settings.maximumDonation ===
          undefined
          ? null
          : Number(
              settings.maximumDonation
            ),

      donationMessage:
        settings.donationMessage ||
        "",

      // ========================================================================
      // NOTIFICATIONS
      // ========================================================================

      emailNotifications:
        Boolean(
          settings.emailNotifications
        ),

      newDonationNotifications:
        Boolean(
          settings.newDonationNotifications
        ),

      newContactNotifications:
        Boolean(
          settings.newContactNotifications
        ),

      newVolunteerNotifications:
        Boolean(
          settings.newVolunteerNotifications
        ),

      adminNotifications:
        Boolean(
          settings.adminNotifications
        ),

      // ========================================================================
      // APPEARANCE
      // ========================================================================

      darkMode:
        Boolean(settings.darkMode),

      compactSidebar:
        Boolean(
          settings.compactSidebar
        ),
    };
  };

  // ==========================================================================
  // SAVE SETTINGS
  // ==========================================================================

  const handleSave = async (event) => {
    event.preventDefault();

    if (!settings) {
      return;
    }

    try {
      setSaving(true);
      clearMessages();

      const payload =
        createSavePayload();

      const response =
        await API.put(
          "/settings",
          payload
        );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to update settings."
        );
      }

      const updatedSettings =
        response.data?.settings;

      if (updatedSettings) {
        const cleanedSettings =
          cleanSettings(
            updatedSettings
          );

        setSettings(
          cleanedSettings
        );

        updatePreviews(
          cleanedSettings
        );
      }

      setMessage(
        "Settings updated successfully."
      );
    } catch (err) {
      console.error(
        "UPDATE SETTINGS ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================================
  // RESET SETTINGS
  // ==========================================================================

  const handleReset = async () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to reset all settings to their default values?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setResetting(true);
      clearMessages();

      const response =
        await API.delete(
          "/settings"
        );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to reset settings."
        );
      }

      const resetSettings =
        response.data?.settings;

      if (!resetSettings) {
        throw new Error(
          "The server did not return the reset settings."
        );
      }

      const cleanedResetSettings =
        cleanSettings(
          resetSettings
        );

      setSettings(
        cleanedResetSettings
      );

      setHeroImageFile(null);
      setAboutImageFile(null);
      setFeaturedImageFile(null);
      setCtaImageFile(null);

      setCauseImageFiles({
        0: null,
        1: null,
        2: null,
        3: null,
      });

      updatePreviews(
        cleanedResetSettings
      );

      setMessage(
        "Settings have been reset successfully."
      );
    } catch (err) {
      console.error(
        "RESET SETTINGS ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to reset settings."
      );
    } finally {
      setResetting(false);
    }
  };

  // ==========================================================================
  // BUSY STATE
  // ==========================================================================

  const isBusy =
    saving ||
    resetting ||
    uploadingHero ||
    uploadingAbout ||
    uploadingFeatured ||
    uploadingCta ||
    uploadingCause !== null;

  // ==========================================================================
  // LOADING STATE
  // ==========================================================================

  if (loading) {
    return (
      <div className="admin-settings">
        <div className="settings-loading">
          Loading settings...
        </div>
      </div>
    );
  }

  // ==========================================================================
  // FAILED LOAD STATE
  // ==========================================================================

  if (!settings) {
    return (
      <div className="admin-settings">
        <div className="settings-error">
          <p>
            {error ||
              "Settings could not be loaded."}
          </p>

          <button
            type="button"
            onClick={fetchSettings}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className="admin-settings">

      {/* ====================================================================
          HEADER
      ==================================================================== */}

      <div className="settings-header">

        <div>
          <h1>Settings</h1>

          <p>
            Manage your foundation
            information, homepage
            content, footer, donations,
            notifications and
            appearance.
          </p>
        </div>

        <button
          type="button"
          className="settings-reset-button"
          onClick={handleReset}
          disabled={isBusy}
        >
          {resetting
            ? "Resetting..."
            : "Reset Settings"}
        </button>

      </div>

      {/* ====================================================================
          SUCCESS MESSAGE
      ==================================================================== */}

      {message && (
        <div
          className="settings-success"
          role="alert"
        >
          {message}
        </div>
      )}

      {/* ====================================================================
          ERROR MESSAGE
      ==================================================================== */}

      {error && (
        <div
          className="settings-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* ====================================================================
          SETTINGS FORM
      ==================================================================== */}

      <form
        className="settings-form"
        onSubmit={handleSave}
      >

        {/* ==================================================================
            FOUNDATION INFORMATION
        ================================================================== */}

        <section className="settings-section">

          <div className="settings-section-header">

            <h2>
              Foundation Information
            </h2>

            <p>
              Basic information about
              your foundation.
            </p>

          </div>

          <div className="settings-grid">

            <div className="settings-field settings-field-full">

              <label htmlFor="foundationName">
                Foundation Name
              </label>

              <input
                id="foundationName"
                name="foundationName"
                type="text"
                value={
                  settings.foundationName ||
                  ""
                }
                onChange={handleChange}
              />

            </div>

            <div className="settings-field settings-field-full">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="5"
                value={
                  settings.description ||
                  ""
                }
                onChange={handleChange}
              />

            </div>

            <div className="settings-field">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={
                  settings.email || ""
                }
                onChange={handleChange}
              />

            </div>

            <div className="settings-field">

              <label htmlFor="phone">
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                type="text"
                value={
                  settings.phone || ""
                }
                onChange={handleChange}
              />

            </div>

            <div className="settings-field settings-field-full">

              <label htmlFor="address">
                Address
              </label>

              <input
                id="address"
                name="address"
                type="text"
                value={
                  settings.address || ""
                }
                onChange={handleChange}
              />

            </div>

            <div className="settings-field settings-field-full">

              <label htmlFor="website">
                Website
              </label>

              <input
                id="website"
                name="website"
                type="url"
                placeholder="https://example.org"
                value={
                  settings.website || ""
                }
                onChange={handleChange}
              />

            </div>

          </div>

        </section>

        {/* ==================================================================
            SOCIAL MEDIA
        ================================================================== */}

        <section className="settings-section">

          <div className="settings-section-header">

            <h2>
              Social Media
            </h2>

            <p>
              Add your foundation's
              social media profile
              links.
            </p>

          </div>

          <div className="settings-grid">

            {[
              [
                "facebook",
                "Facebook",
              ],
              [
                "instagram",
                "Instagram",
              ],
              [
                "twitter",
                "Twitter / X",
              ],
              [
                "linkedin",
                "LinkedIn",
              ],
            ].map(
              ([name, label]) => (
                <div
                  className="settings-field"
                  key={name}
                >

                  <label htmlFor={name}>
                    {label}
                  </label>

                  <input
                    id={name}
                    name={name}
                    type="url"
                    placeholder={`https://${name}.com/...`}
                    value={
                      settings[name] ||
                      ""
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>
              )
            )}

          </div>

        </section>

        {/* ==================================================================
            FOOTER SETTINGS
        ================================================================== */}

        <section className="settings-section">

          <div className="settings-section-header">

            <h2>
              Footer Settings
            </h2>

            <p>
              Manage the information
              displayed in the website
              footer.
            </p>

          </div>

          <div className="settings-grid">

            <div className="settings-field settings-field-full">

              <label htmlFor="footer-description">
                Footer Description
              </label>

              <textarea
                id="footer-description"
                rows="5"
                value={
                  settings.footer
                    ?.description || ""
                }
                onChange={(event) =>
                  setSettings(
                    (previous) => ({
                      ...previous,

                      footer: {
                        ...(previous.footer ||
                          {}),
                        description:
                          event.target
                            .value,
                      },
                    })
                  )
                }
                placeholder="Enter the description that will appear in the website footer."
              />

            </div>

            <div className="settings-field settings-field-full">

              <label htmlFor="footer-copyrightText">
                Copyright Text
              </label>

              <input
                id="footer-copyrightText"
                type="text"
                value={
                  settings.footer
                    ?.copyrightText ||
                  ""
                }
                onChange={(event) =>
                  setSettings(
                    (previous) => ({
                      ...previous,

                      footer: {
                        ...(previous.footer ||
                          {}),
                        copyrightText:
                          event.target
                            .value,
                      },
                    })
                  )
                }
                placeholder="© 2026 David Chukwu Charity Foundation. All rights reserved."
              />

            </div>

            <div className="settings-field">

              <label htmlFor="footer-email">
                Email
              </label>

              <input
                id="footer-email"
                type="email"
                value={
                  settings.footer
                    ?.email || ""
                }
                onChange={(event) =>
                  setSettings(
                    (previous) => ({
                      ...previous,

                      footer: {
                        ...(previous.footer ||
                          {}),
                        email:
                          event.target
                            .value,
                      },
                    })
                  )
                }
                placeholder="info@example.org"
              />

            </div>

            <div className="settings-field">

              <label htmlFor="footer-phone">
                Phone
              </label>

              <input
                id="footer-phone"
                type="text"
                value={
                  settings.footer
                    ?.phone || ""
                }
                onChange={(event) =>
                  setSettings(
                    (previous) => ({
                      ...previous,

                      footer: {
                        ...(previous.footer ||
                          {}),
                        phone:
                          event.target
                            .value,
                      },
                    })
                  )
                }
                placeholder="+234 800 000 0000"
              />

            </div>

            <div className="settings-field settings-field-full">

              <label htmlFor="footer-address">
                Address
              </label>

              <input
                id="footer-address"
                type="text"
                value={
                  settings.footer
                    ?.address || ""
                }
                onChange={(event) =>
                  setSettings(
                    (previous) => ({
                      ...previous,

                      footer: {
                        ...(previous.footer ||
                          {}),
                        address:
                          event.target
                            .value,
                      },
                    })
                  )
                }
                placeholder="Enter foundation address"
              />

            </div>

            <div className="settings-field">

              <label htmlFor="footer-facebook">
                Facebook URL
              </label>

              <input
                id="footer-facebook"
                type="url"
                placeholder="https://facebook.com/..."
                value={
                  settings.footer
                    ?.facebook || ""
                }
                onChange={(event) =>
                  setSettings(
                    (previous) => ({
                      ...previous,

                      footer: {
                        ...(previous.footer ||
                          {}),
                        facebook:
                          event.target
                            .value,
                      },
                    })
                  )
                }
              />

            </div>

            <div className="settings-field">

              <label htmlFor="footer-instagram">
                Instagram URL
              </label>

              <input
                id="footer-instagram"
                type="url"
                placeholder="https://instagram.com/..."
                value={
                  settings.footer
                    ?.instagram || ""
                }
                onChange={(event) =>
                  setSettings(
                    (previous) => ({
                      ...previous,

                      footer: {
                        ...(previous.footer ||
                          {}),
                        instagram:
                          event.target
                            .value,
                      },
                    })
                  )
                }
              />

            </div>

            <div className="settings-field">

              <label htmlFor="footer-twitter">
                Twitter / X URL
              </label>

              <input
                id="footer-twitter"
                type="url"
                placeholder="https://x.com/..."
                value={
                  settings.footer
                    ?.twitter || ""
                }
                onChange={(event) =>
                  setSettings(
                    (previous) => ({
                      ...previous,

                      footer: {
                        ...(previous.footer ||
                          {}),
                        twitter:
                          event.target
                            .value,
                      },
                    })
                  )
                }
              />

            </div>

            <div className="settings-field">

              <label htmlFor="footer-linkedin">
                LinkedIn URL
              </label>

              <input
                id="footer-linkedin"
                type="url"
                placeholder="https://linkedin.com/company/..."
                value={
                  settings.footer
                    ?.linkedin || ""
                }
                onChange={(event) =>
                  setSettings(
                    (previous) => ({
                      ...previous,

                      footer: {
                        ...(previous.footer ||
                          {}),
                        linkedin:
                          event.target
                            .value,
                      },
                    })
                  )
                }
              />

            </div>

          </div>

        </section>

        {/* ==================================================================
            HOMEPAGE HERO
        ================================================================== */}

        <section className="settings-section">

          <div className="settings-section-header">

            <h2>
              Homepage — Hero
            </h2>

            <p>
              Configure the main hero
              section of your
              homepage.
            </p>

          </div>

          <div className="settings-grid">

            <div className="settings-field settings-field-full">

              <label htmlFor="hero-eyebrow">
                Eyebrow
              </label>

              <input
                id="hero-eyebrow"
                type="text"
                value={
                  settings.homepage?.hero
                    ?.eyebrow || ""
                }
                onChange={(event) =>
                  handleHomepageChange(
                    "hero",
                    "eyebrow",
                    event.target.value
                  )
                }
              />

            </div>

            <div className="settings-field settings-field-full">

              <label htmlFor="hero-title">
                Title
              </label>

              <input
                id="hero-title"
                type="text"
                value={
                  settings.homepage?.hero
                    ?.title || ""
                }
                onChange={(event) =>
                  handleHomepageChange(
                    "hero",
                    "title",
                    event.target.value
                  )
                }
              />

            </div>

            <div className="settings-field settings-field-full">

              <label htmlFor="hero-description">
                Description
              </label>

              <textarea
                id="hero-description"
                rows="5"
                value={
                  settings.homepage?.hero
                    ?.description || ""
                }
                onChange={(event) =>
                  handleHomepageChange(
                    "hero",
                    "description",
                    event.target.value
                  )
                }
              />

            </div>

            <div className="settings-field">

              <label htmlFor="hero-primary-button">
                Primary Button Text
              </label>

              <input
                id="hero-primary-button"
                type="text"
                value={
                  settings.homepage?.hero
                    ?.primaryButtonText ||
                  ""
                }
                onChange={(event) =>
                  handleHomepageChange(
                    "hero",
                    "primaryButtonText",
                    event.target.value
                  )
                }
              />

            </div>

            <div className="settings-field">

              <label htmlFor="hero-secondary-button">
                Secondary Button Text
              </label>

              <input
                id="hero-secondary-button"
                type="text"
                value={
                  settings.homepage?.hero
                    ?.secondaryButtonText ||
                  ""
                }
                onChange={(event) =>
                  handleHomepageChange(
                    "hero",
                    "secondaryButtonText",
                    event.target.value
                  )
                }
              />

            </div>

          </div>

          <div className="hero-image-settings">

            <div className="settings-field">

              <label htmlFor="heroImage">
                Hero Image
              </label>

              <input
                id="heroImage"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={
                  handleHeroImageSelect
                }
              />

              <small>
                JPG, JPEG, PNG or WEBP.
                Maximum size: 5MB.
              </small>

            </div>

            {heroPreview && (
              <div className="hero-image-preview">

                <img
                  src={heroPreview}
                  alt="Hero preview"
                  onError={() =>
                    setHeroPreview("")
                  }
                />

              </div>
            )}

            {heroImageFile && (
              <button
                type="button"
                className="settings-upload-button"
                onClick={
                  handleHeroUpload
                }
                disabled={
                  uploadingHero
                }
              >
                {uploadingHero
                  ? "Uploading..."
                  : "Upload Hero Image"}
              </button>
            )}

          </div>

        </section>

        {/* ==================================================================
            HOMEPAGE ABOUT
        ================================================================== */}

        <section className="settings-section">

          <div className="settings-section-header">

            <h2>
              Homepage — About
            </h2>

            <p>
              Configure the About
              section displayed on the
              homepage.
            </p>

          </div>

          <div className="settings-grid">

            <div className="settings-field settings-field-full">

              <label htmlFor="about-eyebrow">
                Eyebrow
              </label>

              <input
                id="about-eyebrow"
                type="text"
                value={
                  settings.homepage?.about
                    ?.eyebrow || ""
                }
                onChange={(event) =>
                  handleHomepageChange(
                    "about",
                    "eyebrow",
                    event.target.value
                  )
                }
              />

            </div>

            <div className="settings-field settings-field-full">

              <label htmlFor="about-title">
                Title
              </label>

              <input
                id="about-title"
                type="text"
                value={
                  settings.homepage?.about
                    ?.title || ""
                }
                onChange={(event) =>
                  handleHomepageChange(
                    "about",
                    "title",
                    event.target.value
                  )
                }
              />

            </div>

            <div className="settings-field settings-field-full">

              <label htmlFor="about-description">
                Description
              </label>

              <textarea
                id="about-description"
                rows="5"
                value={
                  settings.homepage?.about
                    ?.description || ""
                }
                onChange={(event) =>
                  handleHomepageChange(
                    "about",
                    "description",
                    event.target.value
                  )
                }
              />

            </div>

            <div className="settings-field settings-field-full">

              <label htmlFor="about-button">
                Button Text
              </label>

              <input
                id="about-button"
                type="text"
                value={
                  settings.homepage?.about
                    ?.buttonText || ""
                }
                onChange={(event) =>
                  handleHomepageChange(
                    "about",
                    "buttonText",
                    event.target.value
                  )
                }
              />

            </div>

          </div>

          <div className="hero-image-settings">

            <div className="settings-field">

              <label htmlFor="aboutImage">
                About Image
              </label>

              <input
                id="aboutImage"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={
                  handleAboutImageSelect
                }
              />

              <small>
                JPG, JPEG, PNG or WEBP.
                Maximum size: 5MB.
              </small>

            </div>

            {aboutPreview && (
              <div className="hero-image-preview">

                <img
                  src={aboutPreview}
                  alt="About section preview"
                  onError={() =>
                    setAboutPreview("")
                  }
                />

              </div>
            )}

            {aboutImageFile && (
              <button
                type="button"
                className="settings-upload-button"
                onClick={
                  handleAboutUpload
                }
                disabled={
                  uploadingAbout
                }
              >
                {uploadingAbout
                  ? "Uploading..."
                  : "Upload About Image"}
              </button>
            )}

          </div>

        </section>

        {/* ==================================================================
            HOMEPAGE CAUSES
        ================================================================== */}

        <section className="settings-section">

          <div className="settings-section-header">

            <h2>
              Homepage — Causes
            </h2>

            <p>
              Configure the Causes
              section and the people
              your foundation supports.
            </p>

          </div>

          <div className="settings-grid">

            <div className="settings-field settings-field-full">

              <label htmlFor="causes-eyebrow">
                Eyebrow
              </label>

              <input
                id="causes-eyebrow"
                type="text"
                value={
                  settings.homepage?.causes
                    ?.eyebrow || ""
                }
                onChange={(event) =>
                  handleHomepageChange(
                    "causes",
                    "eyebrow",
                    event.target.value
                  )
                }
              />

            </div>

            <div className="settings-field settings-field-full">

              <label htmlFor="causes-title">
                Title
              </label>

              <input
                id="causes-title"
                type="text"
                value={
                  settings.homepage?.causes
                    ?.title || ""
                }
                onChange={(event) =>
                  handleHomepageChange(
                    "causes",
                    "title",
                    event.target.value
                  )
                }
              />

            </div>

            <div className="settings-field settings-field-full">

              <label htmlFor="causes-description">
                Description
              </label>

              <textarea
                id="causes-description"
                rows="5"
                value={
                  settings.homepage?.causes
                    ?.description || ""
                }
                onChange={(event) =>
                  handleHomepageChange(
                    "causes",
                    "description",
                    event.target.value
                  )
                }
              />

            </div>

          </div>

          <div className="causes-admin-grid">

            {[0, 1, 2, 3].map(
              (index) => {
                const cause =
                  settings.homepage?.causes
                    ?.items?.[index] ||
                  {};

                return (
                  <div
                    className="cause-admin-card"
                    key={index}
                  >

                    <div className="cause-admin-card-header">

                      <h3>
                        Cause {index + 1}
                      </h3>

                    </div>

                    <div className="settings-field">

                      <label
                        htmlFor={`cause-title-${index}`}
                      >
                        Cause Title
                      </label>

                      <input
                        id={`cause-title-${index}`}
                        type="text"
                        value={
                          cause.title || ""
                        }
                        onChange={(event) =>
                          handleCauseChange(
                            index,
                            "title",
                            event.target.value
                          )
                        }
                        placeholder="e.g. Widows"
                      />

                    </div>

                    <div className="settings-field">

                      <label
                        htmlFor={`cause-text-${index}`}
                      >
                        Description
                      </label>

                      <input
                        id={`cause-text-${index}`}
                        type="text"
                        value={
                          cause.text || ""
                        }
                        onChange={(event) =>
                          handleCauseChange(
                            index,
                            "text",
                            event.target.value
                          )
                        }
                        placeholder="e.g. Support & Empowerment"
                      />

                    </div>

                    <div className="settings-field">

                      <label
                        htmlFor={`cause-image-${index}`}
                      >
                        Cause Image
                      </label>

                      <input
                        id={`cause-image-${index}`}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        onChange={(event) =>
                          handleCauseImageSelect(
                            event,
                            index
                          )
                        }
                      />

                      <small>
                        JPG, JPEG, PNG or WEBP.
                        Maximum size: 5MB.
                      </small>

                    </div>

                    {causePreviews[index] && (
                      <div className="cause-image-preview">

                        <img
                          src={
                            causePreviews[
                              index
                            ]
                          }
                          alt={
                            cause.title ||
                            `Cause ${
                              index + 1
                            } preview`
                          }
                          onError={() =>
                            setCausePreviews(
                              (previous) => ({
                                ...previous,
                                [index]: "",
                              })
                            )
                          }
                        />

                      </div>
                    )}

                    {causeImageFiles[index] && (
                      <button
                        type="button"
                        className="settings-upload-button"
                        onClick={() =>
                          handleCauseUpload(
                            index
                          )
                        }
                        disabled={
                          uploadingCause ===
                          index
                        }
                      >
                        {uploadingCause ===
                        index
                          ? "Uploading..."
                          : `Upload Cause ${
                              index + 1
                            } Image`}
                      </button>
                    )}

                  </div>
                );
              }
            )}

          </div>

        </section>

        {/* ==================================================================
            HOMEPAGE FEATURED
        ================================================================== */}

        <section className="settings-section">

          <div className="settings-section-header">

            <h2>
              Homepage — Featured
            </h2>

            <p>
              Configure the Featured
              section displayed on the
              homepage.
            </p>

          </div>

          <div className="settings-grid">

            <div className="settings-field settings-field-full">

              <label htmlFor="featured-eyebrow">
                Eyebrow
              </label>

              <input
                id="featured-eyebrow"
                type="text"
                value={
                  settings.homepage?.featured
                    ?.eyebrow || ""
                }
                onChange={(event) =>
                  handleHomepageChange(
                    "featured",
                    "eyebrow",
                    event.target.value
                  )
                }
              />

            </div>

            <div className="settings-field settings-field-full">

              <label htmlFor="featured-title">
                Title
              </label>

              <input
                id="featured-title"
                type="text"
                value={
                  settings.homepage?.featured
                    ?.title || ""
                }
                onChange={(event) =>
                  handleHomepageChange(
                    "featured",
                    "title",
                    event.target.value
                  )
                }
              />

            </div>

            <div className="settings-field settings-field-full">

              <label htmlFor="featured-description">
                Description
              </label>

              <textarea
                id="featured-description"
                rows="5"
                value={
                  settings.homepage?.featured
                    ?.description || ""
                }
                onChange={(event) =>
                  handleHomepageChange(
                    "featured",
                    "description",
                    event.target.value
                  )
                }
              />

            </div>

            <div className="settings-field">

              <label htmlFor="featured-button">
                Button Text
              </label>

              <input
                id="featured-button"
                type="text"
                value={
                  settings.homepage?.featured
                    ?.buttonText || ""
                }
                onChange={(event) =>
                  handleHomepageChange(
                    "featured",
                    "buttonText",
                    event.target.value
                  )
                }
              />

            </div>

          </div>

          <div className="hero-image-settings">

            <div className="settings-field">

              <label htmlFor="featuredImage">
                Featured Image
              </label>

              <input
                id="featuredImage"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={
                  handleFeaturedImageSelect
                }
              />

              <small>
                JPG, JPEG, PNG or WEBP.
                Maximum size: 5MB.
              </small>

            </div>

            {featuredPreview && (
              <div className="hero-image-preview">

                <img
                  src={featuredPreview}
                  alt="Featured section preview"
                  onError={() =>
                    setFeaturedPreview("")
                  }
                />

              </div>
            )}

            {featuredImageFile && (
              <button
                type="button"
                className="settings-upload-button"
                onClick={
                  handleFeaturedUpload
                }
                disabled={
                  uploadingFeatured
                }
              >
                {uploadingFeatured
                  ? "Uploading..."
                  : "Upload Featured Image"}
              </button>
            )}

          </div>

        </section>

        {/* ==================================================================
            HOMEPAGE CTA
        ================================================================== */}

        <section className="settings-section">

          <div className="settings-section-header">

            <h2>
              Homepage — Call To Action
            </h2>

            <p>
              Configure the final
              call-to-action section.
            </p>

          </div>

          <div className="settings-grid">

            <div className="settings-field settings-field-full">

              <label htmlFor="cta-eyebrow">
                Eyebrow
              </label>

              <input
                id="cta-eyebrow"
                type="text"
                value={
                  settings.homepage?.cta
                    ?.eyebrow || ""
                }
                onChange={(event) =>
                  handleHomepageChange(
                    "cta",
                    "eyebrow",
                    event.target.value
                  )
                }
              />

            </div>

            <div className="settings-field settings-field-full">

              <label htmlFor="cta-title">
                Title
              </label>

              <input
                id="cta-title"
                type="text"
                value={
                  settings.homepage?.cta
                    ?.title || ""
                }
                onChange={(event) =>
                  handleHomepageChange(
                    "cta",
                    "title",
                    event.target.value
                  )
                }
              />

            </div>

            <div className="settings-field settings-field-full">

              <label htmlFor="cta-description">
                Description
              </label>

              <textarea
                id="cta-description"
                rows="5"
                value={
                  settings.homepage?.cta
                    ?.description || ""
                }
                onChange={(event) =>
                  handleHomepageChange(
                    "cta",
                    "description",
                    event.target.value
                  )
                }
              />

            </div>

            <div className="settings-field">

              <label htmlFor="cta-button">
                Button Text
              </label>

              <input
                id="cta-button"
                type="text"
                value={
                  settings.homepage?.cta
                    ?.buttonText || ""
                }
                onChange={(event) =>
                  handleHomepageChange(
                    "cta",
                    "buttonText",
                    event.target.value
                  )
                }
              />

            </div>

          </div>

          <div className="hero-image-settings">

            <div className="settings-field">

              <label htmlFor="ctaImage">
                CTA Image
              </label>

              <input
                id="ctaImage"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={
                  handleCtaImageSelect
                }
              />

              <small>
                JPG, JPEG, PNG or WEBP.
                Maximum size: 5MB.
              </small>

            </div>

            {ctaPreview && (
              <div className="hero-image-preview">

                <img
                  src={ctaPreview}
                  alt="CTA section preview"
                  onError={() =>
                    setCtaPreview("")
                  }
                />

              </div>
            )}

            {ctaImageFile && (
              <button
                type="button"
                className="settings-upload-button"
                onClick={
                  handleCtaUpload
                }
                disabled={
                  uploadingCta
                }
              >
                {uploadingCta
                  ? "Uploading..."
                  : "Upload CTA Image"}
              </button>
            )}

          </div>

        </section>

        {/* ==================================================================
            DONATION SETTINGS
        ================================================================== */}

        <section className="settings-section">

          <div className="settings-section-header">

            <h2>
              Donation Settings
            </h2>

            <p>
              Control how donations
              are configured on the
              foundation website.
            </p>

          </div>

          <div className="settings-toggle">

            <label>

              <input
                type="checkbox"
                name="donationEnabled"
                checked={Boolean(
                  settings.donationEnabled
                )}
                onChange={
                  handleBooleanChange
                }
              />

              <span>
                Enable Donations
              </span>

            </label>

          </div>

          <div className="settings-grid">

            <div className="settings-field">

              <label htmlFor="donationCurrency">
                Donation Currency
              </label>

              <input
                id="donationCurrency"
                name="donationCurrency"
                type="text"
                maxLength="3"
                value={
                  settings.donationCurrency ||
                  ""
                }
                onChange={handleChange}
              />

            </div>

            <div className="settings-field">

              <label htmlFor="minimumDonation">
                Minimum Donation
              </label>

              <input
                id="minimumDonation"
                name="minimumDonation"
                type="number"
                min="0"
                step="0.01"
                value={
                  settings.minimumDonation ??
                  ""
                }
                onChange={
                  handleNumberChange
                }
              />

            </div>

            <div className="settings-field">

              <label htmlFor="maximumDonation">
                Maximum Donation
              </label>

              <input
                id="maximumDonation"
                name="maximumDonation"
                type="number"
                min="0"
                step="0.01"
                placeholder="No maximum"
                value={
                  settings.maximumDonation ??
                  ""
                }
                onChange={
                  handleNumberChange
                }
              />

            </div>

            <div className="settings-field settings-field-full">

              <label htmlFor="donationMessage">
                Donation Message
              </label>

              <textarea
                id="donationMessage"
                name="donationMessage"
                rows="4"
                value={
                  settings.donationMessage ||
                  ""
                }
                onChange={handleChange}
              />

            </div>

          </div>

        </section>

        {/* ==================================================================
            NOTIFICATIONS
        ================================================================== */}

        <section className="settings-section">

          <div className="settings-section-header">

            <h2>
              Notifications
            </h2>

            <p>
              Control administrator
              notification preferences.
            </p>

          </div>

          <div className="settings-options">

            {[
              [
                "emailNotifications",
                "Email Notifications",
              ],
              [
                "newDonationNotifications",
                "New Donation Notifications",
              ],
              [
                "newContactNotifications",
                "New Contact Notifications",
              ],
              [
                "newVolunteerNotifications",
                "New Volunteer Notifications",
              ],
              [
                "adminNotifications",
                "Admin Notifications",
              ],
            ].map(
              ([name, label]) => (
                <label
                  className="settings-toggle"
                  key={name}
                >

                  <input
                    type="checkbox"
                    name={name}
                    checked={Boolean(
                      settings[name]
                    )}
                    onChange={
                      handleBooleanChange
                    }
                  />

                  <span>
                    {label}
                  </span>

                </label>
              )
            )}

          </div>

        </section>

        {/* ==================================================================
            APPEARANCE
        ================================================================== */}

        <section className="settings-section">

          <div className="settings-section-header">

            <h2>
              Appearance
            </h2>

            <p>
              Configure administrator
              dashboard appearance.
            </p>

          </div>

          <div className="settings-options">

            <label className="settings-toggle">

              <input
                type="checkbox"
                name="darkMode"
                checked={Boolean(
                  settings.darkMode
                )}
                onChange={
                  handleBooleanChange
                }
              />

              <span>
                Dark Mode
              </span>

            </label>

            <label className="settings-toggle">

              <input
                type="checkbox"
                name="compactSidebar"
                checked={Boolean(
                  settings.compactSidebar
                )}
                onChange={
                  handleBooleanChange
                }
              />

              <span>
                Compact Sidebar
              </span>

            </label>

          </div>

        </section>

        {/* ==================================================================
            SAVE BUTTON
        ================================================================== */}

        <div className="settings-form-actions">

          <button
            type="submit"
            className="settings-save-button"
            disabled={isBusy}
          >
            {saving
              ? "Saving..."
              : "Save Settings"}
          </button>

        </div>

      </form>
    </div>
  );
};

export default AdminSettings;