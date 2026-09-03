import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

import "../../styles/Admin.settings.css";

const AdminSettings = () => {
  // ============================================================================
  // SETTINGS STATE
  // ============================================================================

  const [settings, setSettings] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ============================================================================
  // IMAGE FILE STATE
  // ============================================================================

  const [heroImageFile, setHeroImageFile] = useState(null);
  const [aboutImageFile, setAboutImageFile] = useState(null);
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [ctaImageFile, setCtaImageFile] = useState(null);

  const [causeImageFiles, setCauseImageFiles] = useState({});

  // ============================================================================
  // IMAGE PREVIEW STATE
  // ============================================================================

  const [heroPreview, setHeroPreview] = useState("");
  const [aboutPreview, setAboutPreview] = useState("");
  const [featuredPreview, setFeaturedPreview] = useState("");
  const [ctaPreview, setCtaPreview] = useState("");

  const [causePreviews, setCausePreviews] = useState({});

  // ============================================================================
  // IMAGE HELPERS
  // ============================================================================

  const isCloudinaryImageUrl = useCallback(
    (image) => {
      return (
        typeof image === "string" &&
        image.includes("res.cloudinary.com/")
      );
    },
    []
  );

  const isValidImageUrl = useCallback(
    (image) => {
      if (
        typeof image !== "string" ||
        !image.trim()
      ) {
        return false;
      }

      const cleanImage = image.trim();

      return (
        cleanImage.startsWith("https://") ||
        cleanImage.startsWith("http://") ||
        cleanImage.startsWith("blob:")
      );
    },
    []
  );

  const getImageUrl = useCallback((image) => {
    if (!image) {
      return "";
    }

    if (
      typeof image === "string" &&
      image.startsWith("blob:")
    ) {
      return image;
    }

    if (
      typeof image === "string" &&
      image.startsWith("http://")
    ) {
      return image;
    }

    if (
      typeof image === "string" &&
      image.startsWith("https://")
    ) {
      return image;
    }

    /*
    |--------------------------------------------------------------------------
    | LEGACY LOCAL PATH SUPPORT
    |--------------------------------------------------------------------------
    */

    if (
      typeof image === "string" &&
      image.startsWith("/uploads/")
    ) {
      const apiBaseUrl =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api";

      const serverBaseUrl =
        apiBaseUrl.replace(/\/api\/?$/, "");

      return `${serverBaseUrl}${image}`;
    }

    return image;
  }, []);

  // ============================================================================
  // LOAD SETTINGS
  // ============================================================================

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/settings");

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

      setSettings(loadedSettings);

      updatePreviews(loadedSettings);
    } catch (err) {
      console.error(
        "LOAD SETTINGS ERROR:",
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
  }, []);

  // ============================================================================
  // UPDATE IMAGE PREVIEWS
  // ============================================================================

  const updatePreviews = useCallback(
    (currentSettings) => {
      if (!currentSettings) {
        return;
      }

      const homepage =
        currentSettings.homepage || {};

      // ------------------------------------------------------------------------
      // HERO
      // ------------------------------------------------------------------------

      const heroImage =
        homepage.hero?.image || "";

      setHeroPreview(
        heroImage
          ? getImageUrl(heroImage)
          : ""
      );

      // ------------------------------------------------------------------------
      // ABOUT
      // ------------------------------------------------------------------------

      const aboutImage =
        homepage.about?.image || "";

      setAboutPreview(
        aboutImage
          ? getImageUrl(aboutImage)
          : ""
      );

      // ------------------------------------------------------------------------
      // FEATURED
      // ------------------------------------------------------------------------

      const featuredImage =
        homepage.featured?.image || "";

      setFeaturedPreview(
        featuredImage
          ? getImageUrl(featuredImage)
          : ""
      );

      // ------------------------------------------------------------------------
      // CTA
      // ------------------------------------------------------------------------

      const ctaImage =
        homepage.cta?.image || "";

      setCtaPreview(
        ctaImage
          ? getImageUrl(ctaImage)
          : ""
      );

      // ------------------------------------------------------------------------
      // CAUSES
      // ------------------------------------------------------------------------

      const causes =
        homepage.causes?.items || [];

      const previews = {};

      causes.forEach((cause, index) => {
        if (cause?.image) {
          previews[index] =
            getImageUrl(cause.image);
        }
      });

      setCausePreviews(previews);
    },
    [getImageUrl]
  );

  // ============================================================================
  // INITIAL LOAD
  // ============================================================================

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // ============================================================================
  // FORM VALUE HANDLER
  // ============================================================================

  const handleChange = (
    event,
    section = null,
    nestedSection = null,
    index = null
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    const finalValue =
      type === "checkbox"
        ? checked
        : value;

    setSettings((previous) => {
      if (!previous) {
        return previous;
      }

      // ------------------------------------------------------------------------
      // ROOT SETTING
      // ------------------------------------------------------------------------

      if (!section) {
        return {
          ...previous,
          [name]: finalValue,
        };
      }

      // ------------------------------------------------------------------------
      // FOOTER / OTHER OBJECT
      // ------------------------------------------------------------------------

      if (section !== "homepage") {
        return {
          ...previous,
          [section]: {
            ...(previous[section] || {}),
            [name]: finalValue,
          },
        };
      }

      // ------------------------------------------------------------------------
      // HOMEPAGE CAUSES
      // ------------------------------------------------------------------------

      if (
        nestedSection === "causes" &&
        index !== null
      ) {
        const currentCauses =
          previous.homepage?.causes?.items ||
          [];

        const updatedCauses = [
          ...currentCauses,
        ];

        updatedCauses[index] = {
          ...(updatedCauses[index] || {}),
          [name]: finalValue,
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
      }

      // ------------------------------------------------------------------------
      // HOMEPAGE NESTED SECTION
      // ------------------------------------------------------------------------

      if (nestedSection) {
        return {
          ...previous,
          homepage: {
            ...(previous.homepage || {}),
            [nestedSection]: {
              ...(previous.homepage?.[
                nestedSection
              ] || {}),
              [name]: finalValue,
            },
          },
        };
      }

      // ------------------------------------------------------------------------
      // HOMEPAGE ROOT
      // ------------------------------------------------------------------------

      return {
        ...previous,
        homepage: {
          ...(previous.homepage || {}),
          [name]: finalValue,
        },
      };
    });
  };

  // ============================================================================
  // CAUSE CHANGE HANDLER
  // ============================================================================

  const handleCauseChange = (
    index,
    field,
    value
  ) => {
    setSettings((previous) => {
      if (!previous) {
        return previous;
      }

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
            ...(previous.homepage?.causes || {}),
            items: updatedCauses,
          },
        },
      };
    });
  };

  // ============================================================================
  // IMAGE FILE HANDLERS
  // ============================================================================

  const handleHeroImageSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setHeroImageFile(file);

    setHeroPreview(
      URL.createObjectURL(file)
    );
  };

  const handleAboutImageSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setAboutImageFile(file);

    setAboutPreview(
      URL.createObjectURL(file)
    );
  };

  const handleFeaturedImageSelect = (
    event
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFeaturedImageFile(file);

    setFeaturedPreview(
      URL.createObjectURL(file)
    );
  };

  const handleCtaImageSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setCtaImageFile(file);

    setCtaPreview(
      URL.createObjectURL(file)
    );
  };

  const handleCauseImageSelect = (
    index,
    event
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setCauseImageFiles((previous) => ({
      ...previous,
      [index]: file,
    }));

    setCausePreviews((previous) => ({
      ...previous,
      [index]: URL.createObjectURL(file),
    }));
  };

  // ============================================================================
  // PROCESS UPLOAD RESPONSE
  // ============================================================================

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

    const uploadedImage =
      response.data?.image;

    if (
      typeof uploadedImage !== "string" ||
      !uploadedImage.trim()
    ) {
      throw new Error(
        "Upload succeeded, but the server did not return an image URL."
      );
    }

    return uploadedImage.trim();
  };

  // ============================================================================
  // APPLY UPLOADED IMAGE
  // ============================================================================

  const applyUploadedImage = useCallback(
    (
      section,
      uploadedImage,
      causeIndex = null
    ) => {
      setSettings((previous) => {
        if (!previous) {
          return previous;
        }

        // ----------------------------------------------------------------------
        // CAUSE IMAGE
        // ----------------------------------------------------------------------

        if (causeIndex !== null) {
          const currentCauses =
            previous.homepage?.causes?.items ||
            [];

          const updatedCauses = [
            ...currentCauses,
          ];

          updatedCauses[causeIndex] = {
            ...(updatedCauses[causeIndex] || {}),
            image: uploadedImage,
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
        }

        // ----------------------------------------------------------------------
        // STANDARD HOMEPAGE IMAGE
        // ----------------------------------------------------------------------

        return {
          ...previous,
          homepage: {
            ...(previous.homepage || {}),
            [section]: {
              ...(previous.homepage?.[
                section
              ] || {}),
              image: uploadedImage,
            },
          },
        };
      });

      // ------------------------------------------------------------------------
      // UPDATE PREVIEW
      // ------------------------------------------------------------------------

      if (causeIndex !== null) {
        setCausePreviews((previous) => ({
          ...previous,
          [causeIndex]:
            getImageUrl(uploadedImage),
        }));

        return;
      }

      const preview =
        getImageUrl(uploadedImage);

      if (section === "hero") {
        setHeroPreview(preview);
      }

      if (section === "about") {
        setAboutPreview(preview);
      }

      if (section === "featured") {
        setFeaturedPreview(preview);
      }

      if (section === "cta") {
        setCtaPreview(preview);
      }
    },
    [getImageUrl]
  );

  // ============================================================================
  // HERO IMAGE UPLOAD
  // ============================================================================

  const handleHeroUpload = async () => {
    if (!heroImageFile) {
      setError(
        "Please select a hero image first."
      );
      return;
    }

    try {
      setIsBusy(true);
      setError("");
      setMessage("");

      const formData = new FormData();

      formData.append(
        "heroImage",
        heroImageFile
      );

      const response = await API.post(
        "/settings/hero-image",
        formData
      );

      const uploadedImage =
        processUploadResponse(
          response,
          "Failed to upload hero image."
        );

      applyUploadedImage(
        "hero",
        uploadedImage
      );

      setHeroImageFile(null);

      setMessage(
        "Hero image uploaded successfully."
      );
    } catch (err) {
      console.error(
        "HERO IMAGE UPLOAD ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to upload hero image."
      );
    } finally {
      setIsBusy(false);
    }
  };

  // ============================================================================
  // ABOUT IMAGE UPLOAD
  // ============================================================================

  const handleAboutUpload = async () => {
    if (!aboutImageFile) {
      setError(
        "Please select an About image first."
      );
      return;
    }

    try {
      setIsBusy(true);
      setError("");
      setMessage("");

      const formData = new FormData();

      formData.append(
        "aboutImage",
        aboutImageFile
      );

      const response = await API.post(
        "/settings/about-image",
        formData
      );

      const uploadedImage =
        processUploadResponse(
          response,
          "Failed to upload about image."
        );

      applyUploadedImage(
        "about",
        uploadedImage
      );

      setAboutImageFile(null);

      setMessage(
        "Homepage About image uploaded successfully."
      );
    } catch (err) {
      console.error(
        "ABOUT IMAGE UPLOAD ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to upload about image."
      );
    } finally {
      setIsBusy(false);
    }
  };

  // ============================================================================
  // FEATURED IMAGE UPLOAD
  // ============================================================================

  const handleFeaturedUpload =
    async () => {
      if (!featuredImageFile) {
        setError(
          "Please select a featured image first."
        );
        return;
      }

      try {
        setIsBusy(true);
        setError("");
        setMessage("");

        const formData = new FormData();

        formData.append(
          "featuredImage",
          featuredImageFile
        );

        const response = await API.post(
          "/settings/featured-image",
          formData
        );

        const uploadedImage =
          processUploadResponse(
            response,
            "Failed to upload featured image."
          );

        applyUploadedImage(
          "featured",
          uploadedImage
        );

        setFeaturedImageFile(null);

        setMessage(
          "Featured image uploaded successfully."
        );
      } catch (err) {
        console.error(
          "FEATURED IMAGE UPLOAD ERROR:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to upload featured image."
        );
      } finally {
        setIsBusy(false);
      }
    };

  // ============================================================================
  // CTA IMAGE UPLOAD
  // ============================================================================

  const handleCtaUpload = async () => {
    if (!ctaImageFile) {
      setError(
        "Please select a CTA image first."
      );
      return;
    }

    try {
      setIsBusy(true);
      setError("");
      setMessage("");

      const formData = new FormData();

      formData.append(
        "ctaImage",
        ctaImageFile
      );

      const response = await API.post(
        "/settings/cta-image",
        formData
      );

      const uploadedImage =
        processUploadResponse(
          response,
          "Failed to upload CTA image."
        );

      applyUploadedImage(
        "cta",
        uploadedImage
      );

      setCtaImageFile(null);

      setMessage(
        "CTA image uploaded successfully."
      );
    } catch (err) {
      console.error(
        "CTA IMAGE UPLOAD ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to upload CTA image."
      );
    } finally {
      setIsBusy(false);
    }
  };

  // ============================================================================
  // CAUSE IMAGE UPLOAD
  // ============================================================================

  const handleCauseUpload = async (
    index
  ) => {
    const file =
      causeImageFiles[index];

    if (!file) {
      setError(
        `Please select an image for Cause ${
          index + 1
        } first.`
      );
      return;
    }

    try {
      setIsBusy(true);
      setError("");
      setMessage("");

      const formData = new FormData();

      formData.append(
        "causeImage",
        file
      );

      formData.append(
        "causeIndex",
        String(index)
      );

      const response = await API.post(
        "/settings/causes-image",
        formData
      );

      const uploadedImage =
        processUploadResponse(
          response,
          "Failed to upload cause image."
        );

      applyUploadedImage(
        "causes",
        uploadedImage,
        index
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
        "CAUSE IMAGE UPLOAD ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to upload cause image."
      );
    } finally {
      setIsBusy(false);
    }
  };

  // ============================================================================
  // CREATE SAVE PAYLOAD
  // ============================================================================
  //
  // IMPORTANT:
  //
  // Existing image URLs MUST be preserved.
  //
  // Save Settings must never replace a Cloudinary URL with:
  //
  //     ""
  //     undefined
  //     null
  //     "/uploads/..."
  //
  // Image uploads are still handled through their dedicated upload endpoints.
  //
  // ============================================================================

  const createSavePayload = useCallback(
    (currentSettings) => {
      if (!currentSettings) {
        return {};
      }

      const homepage =
        currentSettings.homepage || {};

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

      return {
        foundationName:
          currentSettings.foundationName ||
          "",

        description:
          currentSettings.description ||
          "",

        email:
          currentSettings.email || "",

        phone:
          currentSettings.phone || "",

        address:
          currentSettings.address || "",

        website:
          currentSettings.website || "",

        facebook:
          currentSettings.facebook || "",

        instagram:
          currentSettings.instagram || "",

        twitter:
          currentSettings.twitter || "",

        linkedin:
          currentSettings.linkedin || "",

        footer: {
          description:
            currentSettings.footer
              ?.description || "",

          copyrightText:
            currentSettings.footer
              ?.copyrightText || "",

          email:
            currentSettings.footer
              ?.email || "",

          phone:
            currentSettings.footer
              ?.phone || "",

          address:
            currentSettings.footer
              ?.address || "",

          facebook:
            currentSettings.footer
              ?.facebook || "",

          instagram:
            currentSettings.footer
              ?.instagram || "",

          twitter:
            currentSettings.footer
              ?.twitter || "",

          linkedin:
            currentSettings.footer
              ?.linkedin || "",
        },

        homepage: {
          // --------------------------------------------------------------------
          // HERO
          // --------------------------------------------------------------------

          hero: {
            eyebrow:
              hero.eyebrow || "",

            title:
              hero.title || "",

            description:
              hero.description || "",

            primaryButtonText:
              hero.primaryButtonText ||
              "",

            secondaryButtonText:
              hero.secondaryButtonText ||
              "",

            image:
              isValidImageUrl(hero.image)
                ? hero.image
                : "",
          },

          // --------------------------------------------------------------------
          // ABOUT
          // --------------------------------------------------------------------

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
              isValidImageUrl(about.image)
                ? about.image
                : "",
          },

          // --------------------------------------------------------------------
          // CAUSES
          // --------------------------------------------------------------------

          causes: {
            eyebrow:
              causes.eyebrow || "",

            title:
              causes.title || "",

            description:
              causes.description || "",

            items: (
              causes.items || []
            ).map((item) => ({
              title:
                item?.title || "",

              text:
                item?.text || "",

              /*
              |--------------------------------------------------------------------------
              | CRITICAL FIX
              |--------------------------------------------------------------------------
              |
              | Preserve the existing Cloudinary image URL.
              |
              */

              image:
                isValidImageUrl(
                  item?.image
                )
                  ? item.image
                  : "",
            })),
          },

          // --------------------------------------------------------------------
          // FEATURED
          // --------------------------------------------------------------------

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
              isValidImageUrl(
                featured.image
              )
                ? featured.image
                : "",
          },

          // --------------------------------------------------------------------
          // CTA
          // --------------------------------------------------------------------

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
              isValidImageUrl(cta.image)
                ? cta.image
                : "",
          },
        },

        donationEnabled:
          Boolean(
            currentSettings.donationEnabled
          ),

        donationCurrency:
          currentSettings.donationCurrency ||
          "GBP",

        minimumDonation:
          currentSettings.minimumDonation ??
          0,

        maximumDonation:
          currentSettings.maximumDonation ??
          null,

        donationMessage:
          currentSettings.donationMessage ||
          "",

        emailNotifications:
          Boolean(
            currentSettings.emailNotifications
          ),

        newDonationNotifications:
          Boolean(
            currentSettings.newDonationNotifications
          ),

        newContactNotifications:
          Boolean(
            currentSettings.newContactNotifications
          ),

        newVolunteerNotifications:
          Boolean(
            currentSettings.newVolunteerNotifications
          ),

        adminNotifications:
          Boolean(
            currentSettings.adminNotifications
          ),

        darkMode:
          Boolean(
            currentSettings.darkMode
          ),

        compactSidebar:
          Boolean(
            currentSettings.compactSidebar
          ),
      };
    },
    [isValidImageUrl]
  );

  // ============================================================================
  // CLEAN RETURNED SETTINGS
  // ============================================================================

  const cleanSettings = useCallback(
    (returnedSettings) => {
      if (!returnedSettings) {
        return returnedSettings;
      }

      return {
        ...returnedSettings,
      };
    },
    []
  );

  // ============================================================================
  // MERGE SAVED SETTINGS WITH CURRENT IMAGES
  // ============================================================================
  //
  // SECOND LAYER OF PROTECTION.
  //
  // If the backend returns an empty image while React currently has a valid
  // Cloudinary URL, preserve the Cloudinary URL.
  //
  // ============================================================================

  const mergeSavedSettingsWithCurrentImages =
    useCallback(
      (
        previousSettings,
        returnedSettings
      ) => {
        if (!returnedSettings) {
          return previousSettings;
        }

        if (!previousSettings) {
          return returnedSettings;
        }

        const previousHomepage =
          previousSettings.homepage || {};

        const returnedHomepage =
          returnedSettings.homepage || {};

        // ----------------------------------------------------------------------
        // IMAGE CHOOSER
        // ----------------------------------------------------------------------

        const chooseImage = (
          previousImage,
          returnedImage
        ) => {
          /*
          |--------------------------------------------------------------------------
          | Prefer a newly returned valid image.
          |--------------------------------------------------------------------------
          */

          if (
            isValidImageUrl(
              returnedImage
            )
          ) {
            return returnedImage;
          }

          /*
          |--------------------------------------------------------------------------
          | Otherwise preserve the current valid image.
          |--------------------------------------------------------------------------
          */

          if (
            isValidImageUrl(
              previousImage
            )
          ) {
            return previousImage;
          }

          return "";
        };

        // ----------------------------------------------------------------------
        // MERGE STANDARD HOMEPAGE SECTION
        // ----------------------------------------------------------------------

        const mergeSection = (
          section
        ) => {
          const previousSection =
            previousHomepage[section] ||
            {};

          const returnedSection =
            returnedHomepage[section] ||
            {};

          return {
            ...previousSection,
            ...returnedSection,

            image: chooseImage(
              previousSection.image,
              returnedSection.image
            ),
          };
        };

        // ----------------------------------------------------------------------
        // MERGE CAUSES
        // ----------------------------------------------------------------------

        const previousCauses =
          previousHomepage.causes?.items ||
          [];

        const returnedCauses =
          returnedHomepage.causes?.items ||
          [];

        const causeCount = Math.max(
          previousCauses.length,
          returnedCauses.length
        );

        const mergedCauses =
          Array.from(
            {
              length: causeCount,
            },
            (_, index) => {
              const previousCause =
                previousCauses[index] ||
                {};

              const returnedCause =
                returnedCauses[index] ||
                {};

              return {
                ...previousCause,
                ...returnedCause,

                image: chooseImage(
                  previousCause.image,
                  returnedCause.image
                ),
              };
            }
          );

        // ----------------------------------------------------------------------
        // FINAL MERGED SETTINGS
        // ----------------------------------------------------------------------

        return {
          ...previousSettings,
          ...returnedSettings,

          homepage: {
            ...previousHomepage,
            ...returnedHomepage,

            hero:
              mergeSection("hero"),

            about:
              mergeSection("about"),

            featured:
              mergeSection("featured"),

            cta:
              mergeSection("cta"),

            causes: {
              ...(previousHomepage.causes ||
                {}),

              ...(returnedHomepage.causes ||
                {}),

              items: mergedCauses,
            },
          },
        };
      },
      [isValidImageUrl]
    );

  // ============================================================================
  // SAVE SETTINGS
  // ============================================================================

  const handleSave = async (event) => {
    event.preventDefault();

    if (!settings) {
      return;
    }

    try {
      setIsBusy(true);
      setError("");
      setMessage("");

      // ------------------------------------------------------------------------
      // CREATE PAYLOAD
      // ------------------------------------------------------------------------

      const payload =
        createSavePayload(settings);

      console.log(
        "SAVE SETTINGS PAYLOAD:",
        payload
      );

      const response = await API.put(
        "/settings",
        payload
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to update settings."
        );
      }

      // ------------------------------------------------------------------------
      // SERVER RETURNED SETTINGS
      // ------------------------------------------------------------------------

      const returnedSettings =
        response.data?.settings;

      if (returnedSettings) {
        const cleanedReturnedSettings =
          cleanSettings(
            returnedSettings
          );

        const mergedSettings =
          mergeSavedSettingsWithCurrentImages(
            settings,
            cleanedReturnedSettings
          );

        setSettings(mergedSettings);

        updatePreviews(
          mergedSettings
        );
      }

      setMessage(
        "Settings updated successfully."
      );
    } catch (err) {
      console.error(
        "SAVE SETTINGS ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update settings."
      );
    } finally {
      setIsBusy(false);
    }
  };

  // ============================================================================
  // RESET SETTINGS
  // ============================================================================

  const handleReset = async () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to reset all settings? This action cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    try {
      setIsBusy(true);
      setError("");
      setMessage("");

      const response = await API.delete(
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

      if (resetSettings) {
        setSettings(resetSettings);

        updatePreviews(
          resetSettings
        );
      } else {
        await loadSettings();
      }

      // ------------------------------------------------------------------------
      // CLEAR SELECTED FILES
      // ------------------------------------------------------------------------

      setHeroImageFile(null);
      setAboutImageFile(null);
      setFeaturedImageFile(null);
      setCtaImageFile(null);
      setCauseImageFiles({});

      setMessage(
        "Settings reset successfully."
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
      setIsBusy(false);
    }
  };

  // ============================================================================
  // LOADING
  // ============================================================================

  if (loading) {
    return (
      <div className="admin-settings">
        <div className="settings-loading">
          Loading settings...
        </div>
      </div>
    );
  }

  // ============================================================================
  // ERROR STATE
  // ============================================================================

  if (!settings) {
    return (
      <div className="admin-settings">
        <div className="settings-error">
          {error ||
            "Unable to load settings."}
        </div>
      </div>
    );
  }

  // ============================================================================
  // DATA REFERENCES
  // ============================================================================

  const homepage =
    settings.homepage || {};

  const hero =
    homepage.hero || {};

  const about =
    homepage.about || {};

  const causes =
    homepage.causes || {};

  const causeItems =
    causes.items || [];

  const featured =
    homepage.featured || {};

  const cta =
    homepage.cta || {};

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="admin-settings">

      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}

      <div className="settings-header">

        <div>
          <h1>Settings</h1>

          <p>
            Manage your foundation,
            homepage content, donations,
            notifications and appearance.
          </p>
        </div>

        <button
          type="button"
          className="settings-reset-button"
          onClick={handleReset}
          disabled={isBusy}
        >
          Reset Settings
        </button>

      </div>

      {/* ================================================================== */}
      {/* SUCCESS MESSAGE */}
      {/* ================================================================== */}

      {message && (
        <div className="settings-success">
          {message}
        </div>
      )}

      {/* ================================================================== */}
      {/* ERROR MESSAGE */}
      {/* ================================================================== */}

      {error && (
        <div className="settings-error">
          {error}
        </div>
      )}

      {/* ================================================================== */}
      {/* FORM */}
      {/* ================================================================== */}

      <form
        className="settings-form"
        onSubmit={handleSave}
      >

        {/* ================================================================ */}
        {/* FOUNDATION INFORMATION */}
        {/* ================================================================ */}

        <section className="settings-section">

          <div className="settings-section-header">
            <div>
              <h2>
                Foundation Information
              </h2>

              <p>
                Basic information about
                your foundation.
              </p>
            </div>
          </div>

          <div className="settings-grid">

            <div className="settings-field">
              <label>
                Foundation Name
              </label>

              <input
                type="text"
                value={
                  settings.foundationName ||
                  ""
                }
                onChange={(event) =>
                  handleChange(
                    {
                      ...event,
                      target: {
                        ...event.target,
                        name: "foundationName",
                      },
                    }
                  )
                }
              />
            </div>

            <div className="settings-field">
              <label>
                Email
              </label>

              <input
                type="email"
                value={
                  settings.email || ""
                }
                onChange={(event) =>
                  handleChange(
                    {
                      ...event,
                      target: {
                        ...event.target,
                        name: "email",
                      },
                    }
                  )
                }
              />
            </div>

            <div className="settings-field">
              <label>
                Phone
              </label>

              <input
                type="text"
                value={
                  settings.phone || ""
                }
                onChange={(event) =>
                  handleChange(
                    {
                      ...event,
                      target: {
                        ...event.target,
                        name: "phone",
                      },
                    }
                  )
                }
              />
            </div>

            <div className="settings-field">
              <label>
                Website
              </label>

              <input
                type="url"
                value={
                  settings.website || ""
                }
                onChange={(event) =>
                  handleChange(
                    {
                      ...event,
                      target: {
                        ...event.target,
                        name: "website",
                      },
                    }
                  )
                }
              />
            </div>

            <div className="settings-field-full">
              <label>
                Address
              </label>

              <input
                type="text"
                value={
                  settings.address || ""
                }
                onChange={(event) =>
                  handleChange(
                    {
                      ...event,
                      target: {
                        ...event.target,
                        name: "address",
                      },
                    }
                  )
                }
              />
            </div>

            <div className="settings-field-full">
              <label>
                Foundation Description
              </label>

              <textarea
                rows="4"
                value={
                  settings.description ||
                  ""
                }
                onChange={(event) =>
                  handleChange(
                    {
                      ...event,
                      target: {
                        ...event.target,
                        name: "description",
                      },
                    }
                  )
                }
              />
            </div>

          </div>

        </section>

        {/* ================================================================ */}
        {/* SOCIAL MEDIA */}
        {/* ================================================================ */}

        <section className="settings-section">

          <div className="settings-section-header">
            <div>
              <h2>Social Media</h2>

              <p>
                Manage your foundation's
                social media links.
              </p>
            </div>
          </div>

          <div className="settings-grid">

            {[
              ["Facebook", "facebook"],
              ["Instagram", "instagram"],
              ["Twitter", "twitter"],
              ["LinkedIn", "linkedin"],
            ].map(
              ([label, field]) => (
                <div
                  className="settings-field"
                  key={field}
                >
                  <label>{label}</label>

                  <input
                    type="url"
                    value={
                      settings[field] || ""
                    }
                    onChange={(event) =>
                      handleChange(
                        {
                          ...event,
                          target: {
                            ...event.target,
                            name: field,
                          },
                        }
                      )
                    }
                  />
                </div>
              )
            )}

          </div>

        </section>

        {/* ================================================================ */}
        {/* FOOTER SETTINGS */}
        {/* ================================================================ */}

        <section className="settings-section">

          <div className="settings-section-header">
            <div>
              <h2>Footer Settings</h2>

              <p>
                Configure the information
                displayed in the website footer.
              </p>
            </div>
          </div>

          <div className="settings-grid">

            <div className="settings-field-full">
              <label>
                Footer Description
              </label>

              <textarea
                rows="4"
                value={
                  settings.footer
                    ?.description || ""
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "footer"
                  )
                }
                name="description"
              />
            </div>

            {[
              [
                "Copyright Text",
                "copyrightText",
                "text",
              ],
              [
                "Footer Email",
                "email",
                "email",
              ],
              [
                "Footer Phone",
                "phone",
                "text",
              ],
              [
                "Footer Address",
                "address",
                "text",
              ],
              [
                "Footer Facebook",
                "facebook",
                "url",
              ],
              [
                "Footer Instagram",
                "instagram",
                "url",
              ],
              [
                "Footer Twitter",
                "twitter",
                "url",
              ],
              [
                "Footer LinkedIn",
                "linkedin",
                "url",
              ],
            ].map(
              ([label, field, type]) => (
                <div
                  className="settings-field"
                  key={field}
                >
                  <label>{label}</label>

                  <input
                    type={type}
                    value={
                      settings.footer?.[
                        field
                      ] || ""
                    }
                    onChange={(event) =>
                      handleChange(
                        event,
                        "footer"
                      )
                    }
                    name={field}
                  />
                </div>
              )
            )}

          </div>

        </section>

        {/* ================================================================ */}
        {/* HOMEPAGE HERO */}
        {/* ================================================================ */}

        <section className="settings-section">

          <div className="settings-section-header">
            <div>
              <h2>Homepage Hero</h2>

              <p>
                Manage the main hero section
                of your homepage.
              </p>
            </div>
          </div>

          <div className="settings-grid">

            <div className="settings-field">
              <label>Eyebrow</label>

              <input
                type="text"
                value={
                  hero.eyebrow || ""
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "homepage",
                    "hero"
                  )
                }
                name="eyebrow"
              />
            </div>

            <div className="settings-field">
              <label>Title</label>

              <input
                type="text"
                value={
                  hero.title || ""
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "homepage",
                    "hero"
                  )
                }
                name="title"
              />
            </div>

            <div className="settings-field-full">
              <label>Description</label>

              <textarea
                rows="5"
                value={
                  hero.description || ""
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "homepage",
                    "hero"
                  )
                }
                name="description"
              />
            </div>

            <div className="settings-field">
              <label>
                Primary Button Text
              </label>

              <input
                type="text"
                value={
                  hero.primaryButtonText ||
                  ""
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "homepage",
                    "hero"
                  )
                }
                name="primaryButtonText"
              />
            </div>

            <div className="settings-field">
              <label>
                Secondary Button Text
              </label>

              <input
                type="text"
                value={
                  hero.secondaryButtonText ||
                  ""
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "homepage",
                    "hero"
                  )
                }
                name="secondaryButtonText"
              />
            </div>

          </div>

          <div className="hero-image-settings">

            <div className="hero-image-preview">

              {heroPreview ? (
                <img
                  src={heroPreview}
                  alt="Homepage hero preview"
                />
              ) : (
                <span>
                  No hero image
                </span>
              )}

            </div>

            <div>
              <label>
                Hero Image
              </label>

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={
                  handleHeroImageSelect
                }
              />

              <button
                type="button"
                className="settings-upload-button"
                onClick={
                  handleHeroUpload
                }
                disabled={
                  isBusy ||
                  !heroImageFile
                }
              >
                Upload Hero Image
              </button>
            </div>

          </div>

        </section>

        {/* ================================================================ */}
        {/* HOMEPAGE ABOUT */}
        {/* ================================================================ */}

        <section className="settings-section">

          <div className="settings-section-header">
            <div>
              <h2>Homepage About</h2>

              <p>
                Manage the About section
                displayed on the homepage.
              </p>
            </div>
          </div>

          <div className="settings-grid">

            <div className="settings-field">
              <label>Eyebrow</label>

              <input
                type="text"
                value={
                  about.eyebrow || ""
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "homepage",
                    "about"
                  )
                }
                name="eyebrow"
              />
            </div>

            <div className="settings-field">
              <label>Title</label>

              <input
                type="text"
                value={
                  about.title || ""
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "homepage",
                    "about"
                  )
                }
                name="title"
              />
            </div>

            <div className="settings-field-full">
              <label>Description</label>

              <textarea
                rows="5"
                value={
                  about.description || ""
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "homepage",
                    "about"
                  )
                }
                name="description"
              />
            </div>

            <div className="settings-field">
              <label>
                Button Text
              </label>

              <input
                type="text"
                value={
                  about.buttonText || ""
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "homepage",
                    "about"
                  )
                }
                name="buttonText"
              />
            </div>

          </div>

          <div className="hero-image-settings">

            <div className="hero-image-preview">

              {aboutPreview ? (
                <img
                  src={aboutPreview}
                  alt="Homepage About preview"
                />
              ) : (
                <span>
                  No About image
                </span>
              )}

            </div>

            <div>
              <label>
                About Image
              </label>

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={
                  handleAboutImageSelect
                }
              />

              <button
                type="button"
                className="settings-upload-button"
                onClick={
                  handleAboutUpload
                }
                disabled={
                  isBusy ||
                  !aboutImageFile
                }
              >
                Upload About Image
              </button>
            </div>

          </div>

        </section>

        {/* ================================================================ */}
        {/* HOMEPAGE CAUSES */}
        {/* ================================================================ */}

        <section className="settings-section">

          <div className="settings-section-header">
            <div>
              <h2>Homepage Causes</h2>

              <p>
                Manage your four featured
                causes.
              </p>
            </div>
          </div>

          <div className="settings-grid">

            <div className="settings-field">
              <label>Eyebrow</label>

              <input
                type="text"
                value={
                  causes.eyebrow || ""
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "homepage",
                    "causes"
                  )
                }
                name="eyebrow"
              />
            </div>

            <div className="settings-field">
              <label>Title</label>

              <input
                type="text"
                value={
                  causes.title || ""
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "homepage",
                    "causes"
                  )
                }
                name="title"
              />
            </div>

            <div className="settings-field-full">
              <label>Description</label>

              <textarea
                rows="4"
                value={
                  causes.description || ""
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "homepage",
                    "causes"
                  )
                }
                name="description"
              />
            </div>

          </div>

          <div className="causes-admin-grid">

            {causeItems
              .slice(0, 4)
              .map((cause, index) => (
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
                    <label>
                      Title
                    </label>

                    <input
                      type="text"
                      value={
                        cause?.title || ""
                      }
                      onChange={(event) =>
                        handleCauseChange(
                          index,
                          "title",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="settings-field">
                    <label>
                      Description
                    </label>

                    <textarea
                      rows="4"
                      value={
                        cause?.text || ""
                      }
                      onChange={(event) =>
                        handleCauseChange(
                          index,
                          "text",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="cause-image-preview">

                    {causePreviews[index] ? (
                      <img
                        src={
                          causePreviews[index]
                        }
                        alt={`Cause ${
                          index + 1
                        } preview`}
                      />
                    ) : (
                      <span>
                        No cause image
                      </span>
                    )}

                  </div>

                  <div className="settings-field">

                    <label>
                      Cause Image
                    </label>

                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(event) =>
                        handleCauseImageSelect(
                          index,
                          event
                        )
                      }
                    />

                    <button
                      type="button"
                      className="settings-upload-button"
                      onClick={() =>
                        handleCauseUpload(
                          index
                        )
                      }
                      disabled={
                        isBusy ||
                        !causeImageFiles[
                          index
                        ]
                      }
                    >
                      Upload Cause Image
                    </button>

                  </div>

                </div>
              ))}

          </div>

        </section>

        {/* ================================================================ */}
        {/* HOMEPAGE FEATURED */}
        {/* ================================================================ */}

        <section className="settings-section">

          <div className="settings-section-header">
            <div>
              <h2>Homepage Featured</h2>

              <p>
                Manage the featured
                initiative section.
              </p>
            </div>
          </div>

          <div className="settings-grid">

            <div className="settings-field">
              <label>Eyebrow</label>

              <input
                type="text"
                value={
                  featured.eyebrow || ""
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "homepage",
                    "featured"
                  )
                }
                name="eyebrow"
              />
            </div>

            <div className="settings-field">
              <label>Title</label>

              <input
                type="text"
                value={
                  featured.title || ""
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "homepage",
                    "featured"
                  )
                }
                name="title"
              />
            </div>

            <div className="settings-field-full">
              <label>Description</label>

              <textarea
                rows="5"
                value={
                  featured.description ||
                  ""
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "homepage",
                    "featured"
                  )
                }
                name="description"
              />
            </div>

            <div className="settings-field">
              <label>
                Button Text
              </label>

              <input
                type="text"
                value={
                  featured.buttonText ||
                  ""
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "homepage",
                    "featured"
                  )
                }
                name="buttonText"
              />
            </div>

          </div>

          <div className="hero-image-settings">

            <div className="hero-image-preview">

              {featuredPreview ? (
                <img
                  src={featuredPreview}
                  alt="Featured preview"
                />
              ) : (
                <span>
                  No featured image
                </span>
              )}

            </div>

            <div>
              <label>
                Featured Image
              </label>

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={
                  handleFeaturedImageSelect
                }
              />

              <button
                type="button"
                className="settings-upload-button"
                onClick={
                  handleFeaturedUpload
                }
                disabled={
                  isBusy ||
                  !featuredImageFile
                }
              >
                Upload Featured Image
              </button>
            </div>

          </div>

        </section>

        {/* ================================================================ */}
        {/* HOMEPAGE CTA */}
        {/* ================================================================ */}

        <section className="settings-section">

          <div className="settings-section-header">
            <div>
              <h2>Homepage CTA</h2>

              <p>
                Manage the final call-to-action
                section.
              </p>
            </div>
          </div>

          <div className="settings-grid">

            <div className="settings-field">
              <label>Eyebrow</label>

              <input
                type="text"
                value={
                  cta.eyebrow || ""
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "homepage",
                    "cta"
                  )
                }
                name="eyebrow"
              />
            </div>

            <div className="settings-field">
              <label>Title</label>

              <input
                type="text"
                value={
                  cta.title || ""
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "homepage",
                    "cta"
                  )
                }
                name="title"
              />
            </div>

            <div className="settings-field-full">
              <label>Description</label>

              <textarea
                rows="5"
                value={
                  cta.description || ""
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "homepage",
                    "cta"
                  )
                }
                name="description"
              />
            </div>

            <div className="settings-field">
              <label>
                Button Text
              </label>

              <input
                type="text"
                value={
                  cta.buttonText || ""
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "homepage",
                    "cta"
                  )
                }
                name="buttonText"
              />
            </div>

          </div>

          <div className="hero-image-settings">

            <div className="hero-image-preview">

              {ctaPreview ? (
                <img
                  src={ctaPreview}
                  alt="CTA preview"
                />
              ) : (
                <span>
                  No CTA image
                </span>
              )}

            </div>

            <div>
              <label>
                CTA Image
              </label>

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={
                  handleCtaImageSelect
                }
              />

              <button
                type="button"
                className="settings-upload-button"
                onClick={
                  handleCtaUpload
                }
                disabled={
                  isBusy ||
                  !ctaImageFile
                }
              >
                Upload CTA Image
              </button>
            </div>

          </div>

        </section>

        {/* ================================================================ */}
        {/* DONATION SETTINGS */}
        {/* ================================================================ */}

        <section className="settings-section">

          <div className="settings-section-header">
            <div>
              <h2>Donation Settings</h2>

              <p>
                Configure donation options.
              </p>
            </div>
          </div>

          <div className="settings-grid">

            <div className="settings-field">

              <label>
                Donations Enabled
              </label>

              <label className="settings-toggle">

                <input
                  type="checkbox"
                  checked={
                    Boolean(
                      settings.donationEnabled
                    )
                  }
                  onChange={(event) =>
                    handleChange(event)
                  }
                  name="donationEnabled"
                />

                <span></span>

              </label>

            </div>

            <div className="settings-field">

              <label>
                Donation Currency
              </label>

              <select
                value={
                  settings.donationCurrency ||
                  "GBP"
                }
                onChange={(event) =>
                  handleChange(event)
                }
                name="donationCurrency"
              >
                <option value="GBP">
                  GBP
                </option>

                <option value="USD">
                  USD
                </option>

                <option value="EUR">
                  EUR
                </option>

                <option value="NGN">
                  NGN
                </option>
              </select>

            </div>

            <div className="settings-field">

              <label>
                Minimum Donation
              </label>

              <input
                type="number"
                min="0"
                value={
                  settings.minimumDonation ??
                  ""
                }
                onChange={(event) =>
                  handleChange(event)
                }
                name="minimumDonation"
              />

            </div>

            <div className="settings-field">

              <label>
                Maximum Donation
              </label>

              <input
                type="number"
                min="0"
                value={
                  settings.maximumDonation ??
                  ""
                }
                onChange={(event) =>
                  handleChange(event)
                }
                name="maximumDonation"
              />

            </div>

            <div className="settings-field-full">

              <label>
                Donation Message
              </label>

              <textarea
                rows="4"
                value={
                  settings.donationMessage ||
                  ""
                }
                onChange={(event) =>
                  handleChange(event)
                }
                name="donationMessage"
              />

            </div>

          </div>

        </section>

        {/* ================================================================ */}
        {/* NOTIFICATIONS */}
        {/* ================================================================ */}

        <section className="settings-section">

          <div className="settings-section-header">
            <div>
              <h2>Notifications</h2>

              <p>
                Configure administrative
                notification preferences.
              </p>
            </div>
          </div>

          <div className="settings-options">

            {[
              [
                "emailNotifications",
                "Email Notifications",
                "Receive administrative email notifications.",
              ],
              [
                "newDonationNotifications",
                "New Donation Notifications",
                "Get notified when a new donation is received.",
              ],
              [
                "newContactNotifications",
                "New Contact Notifications",
                "Get notified when someone submits the contact form.",
              ],
              [
                "newVolunteerNotifications",
                "New Volunteer Notifications",
                "Get notified when someone submits a volunteer request.",
              ],
              [
                "adminNotifications",
                "Admin Notifications",
                "Enable general administrative notifications.",
              ],
            ].map(
              ([field, title, description]) => (
                <label
                  className="settings-toggle"
                  key={field}
                >

                  <input
                    type="checkbox"
                    checked={
                      Boolean(
                        settings[field]
                      )
                    }
                    onChange={(event) =>
                      handleChange(event)
                    }
                    name={field}
                  />

                  <span></span>

                  <div>
                    <strong>
                      {title}
                    </strong>

                    <p>
                      {description}
                    </p>
                  </div>

                </label>
              )
            )}

          </div>

        </section>

        {/* ================================================================ */}
        {/* APPEARANCE */}
        {/* ================================================================ */}

        <section className="settings-section">

          <div className="settings-section-header">
            <div>
              <h2>Appearance</h2>

              <p>
                Configure the admin dashboard
                appearance.
              </p>
            </div>
          </div>

          <div className="settings-options">

            <label className="settings-toggle">

              <input
                type="checkbox"
                checked={
                  Boolean(
                    settings.darkMode
                  )
                }
                onChange={(event) =>
                  handleChange(event)
                }
                name="darkMode"
              />

              <span></span>

              <div>
                <strong>
                  Dark Mode
                </strong>

                <p>
                  Use the dark appearance
                  throughout the admin dashboard.
                </p>
              </div>

            </label>

            <label className="settings-toggle">

              <input
                type="checkbox"
                checked={
                  Boolean(
                    settings.compactSidebar
                  )
                }
                onChange={(event) =>
                  handleChange(event)
                }
                name="compactSidebar"
              />

              <span></span>

              <div>
                <strong>
                  Compact Sidebar
                </strong>

                <p>
                  Use a more compact admin
                  sidebar layout.
                </p>
              </div>

            </label>

          </div>

        </section>

        {/* ================================================================ */}
        {/* FORM ACTIONS */}
        {/* ================================================================ */}

        <div className="settings-form-actions">

          <button
            type="submit"
            className="settings-save-button"
            disabled={isBusy}
          >
            {isBusy
              ? "Saving..."
              : "Save Settings"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default AdminSettings;