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
  ArrowDown,
  BarChart3,
  Images,
  MessageSquareQuote
} from "lucide-react";

import "../../styles/Admin.impact.css";


// ========================================
// API
// ========================================

const API_URL =
  "http://localhost:5000/api/impact";

const SERVER_URL =
  "http://localhost:5000";


// ========================================
// DEFAULT DATA
// ========================================

const defaultImpact = {

  hero: {
    title: "Our Impact",
    description:
      "Real change, Stronger communities. A better tomorrow.",
    imageUrl: ""
  },


  projects: [

    {
      title:
        "Widows Support Outreach",

      text:
        "We provided food items, cash grants and skills support to widows to help them strengthen their livelihoods.",

      imageUrl: "",

      order: 1
    },

    {
      title:
        "Children Support Program",

      text:
        "We supported children in underserved communities with school supplies, learning material and care.",

      imageUrl: "",

      order: 2
    },

    {
      title:
        "Elderly Care Outreach",

      text:
        "We provided essential items, medical support and companionship to improve the well-being of elderly individuals.",

      imageUrl: "",

      order: 3
    }

  ],


  gallery: [

    {
      imageUrl: "",
      alt: "Children holding books",
      order: 1
    },

    {
      imageUrl: "",
      alt: "People receiving support packages",
      order: 2
    },

    {
      imageUrl: "",
      alt: "Children smiling",
      order: 3
    },

    {
      imageUrl: "",
      alt: "Men receiving support packages",
      order: 4
    },

    {
      imageUrl: "",
      alt: "Widows receiving support",
      order: 5
    }

  ],


  stats: [

    {
      icon: "Users",
      number: "412+",
      label: "Lives Supported",
      order: 1
    },

    {
      icon: "Network",
      number: "13+",
      label: "Communities Reached",
      order: 2
    },

    {
      icon: "Handshake",
      number: "7+",
      label: "Outreach Programs",
      order: 3
    },

    {
      icon: "UsersRound",
      number: "38+",
      label: "Volunteers",
      order: 4
    }

  ],


  testimonials: [

    {
      quote:
        "The support I received gave me hope and strength.",

      name:
        "Mrs. Ngozi, Widow",

      imageUrl: "",

      order: 1
    },

    {
      quote:
        "I am so grateful for the books and school items. They help me learn better.",

      name:
        "Joshua, Student",

      imageUrl: "",

      order: 2
    }

  ]

};


// ========================================
// ADMIN IMPACT
// ========================================

const AdminImpact = () => {


  // ======================================
  // STATE
  // ======================================

  const [impact, setImpact] =
    useState(defaultImpact);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ======================================
  // HERO FILE
  // ======================================

  const [heroFile, setHeroFile] =
    useState(null);

  const [heroPreview, setHeroPreview] =
    useState("");


  // ======================================
  // PROJECT FILES
  // ======================================

  const [projectFiles, setProjectFiles] =
    useState({});

  const [projectPreviews, setProjectPreviews] =
    useState({});


  // ======================================
  // GALLERY FILES
  // ======================================

  const [galleryFiles, setGalleryFiles] =
    useState({});

  const [galleryPreviews, setGalleryPreviews] =
    useState({});


  // ======================================
  // TESTIMONIAL FILES
  // ======================================

  const [testimonialFiles, setTestimonialFiles] =
    useState({});

  const [testimonialPreviews, setTestimonialPreviews] =
    useState({});


  // ======================================
  // INPUT REFS
  // ======================================

  const heroInputRef =
    useRef(null);

  const projectInputRefs =
    useRef({});

  const galleryInputRefs =
    useRef({});

  const testimonialInputRefs =
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

  const normalizeImpact = (data) => {

    const normalizedProjects =
      Array.isArray(data?.projects)
        ? [...data.projects]
            .sort(
              (a, b) =>
                (a.order || 0) -
                (b.order || 0)
            )
            .map((item, index) => ({
              ...item,

              title:
                item.title || "",

              text:
                item.text || "",

              imageUrl:
                item.imageUrl || "",

              order:
                index + 1
            }))
        : defaultImpact.projects;


    const normalizedGallery =
      Array.isArray(data?.gallery)
        ? [...data.gallery]
            .sort(
              (a, b) =>
                (a.order || 0) -
                (b.order || 0)
            )
            .map((item, index) => ({
              ...item,

              imageUrl:
                item.imageUrl || "",

              alt:
                item.alt ||
                `Impact gallery image ${index + 1}`,

              order:
                index + 1
            }))
        : defaultImpact.gallery;


    const normalizedStats =
      Array.isArray(data?.stats)
        ? [...data.stats]
            .sort(
              (a, b) =>
                (a.order || 0) -
                (b.order || 0)
            )
            .map((item, index) => ({
              ...item,

              icon:
                item.icon || "Users",

              number:
                item.number || "",

              label:
                item.label || "",

              order:
                index + 1
            }))
        : defaultImpact.stats;


    const normalizedTestimonials =
      Array.isArray(data?.testimonials)
        ? [...data.testimonials]
            .sort(
              (a, b) =>
                (a.order || 0) -
                (b.order || 0)
            )
            .map((item, index) => ({
              ...item,

              quote:
                item.quote || "",

              name:
                item.name || "",

              imageUrl:
                item.imageUrl || "",

              order:
                index + 1
            }))
        : defaultImpact.testimonials;


    return {

      hero: {
        ...defaultImpact.hero,
        ...(data?.hero || {})
      },

      projects:
        normalizedProjects,

      gallery:
        normalizedGallery,

      stats:
        normalizedStats,

      testimonials:
        normalizedTestimonials

    };

  };


  // ========================================
  // LOAD IMPACT
  // ========================================

  const loadImpact = async () => {

    try {

      setLoading(true);

      setError("");

      const response =
        await fetch(API_URL);

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          "Unable to fetch impact content."
        );

      }


      const normalized =
        normalizeImpact(
          data.impact
        );


      setImpact(normalized);


      // ------------------------------------
      // HERO PREVIEW
      // ------------------------------------

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


      // ------------------------------------
      // PROJECT PREVIEWS
      // ------------------------------------

      const projectPreviewData = {};

      normalized.projects.forEach(
        (project, index) => {

          if (project.imageUrl) {

            projectPreviewData[index] =
              getMediaUrl(
                project.imageUrl
              );

          }

        }
      );

      setProjectPreviews(
        projectPreviewData
      );


      // ------------------------------------
      // GALLERY PREVIEWS
      // ------------------------------------

      const galleryPreviewData = {};

      normalized.gallery.forEach(
        (item, index) => {

          if (item.imageUrl) {

            galleryPreviewData[index] =
              getMediaUrl(
                item.imageUrl
              );

          }

        }
      );

      setGalleryPreviews(
        galleryPreviewData
      );


      // ------------------------------------
      // TESTIMONIAL PREVIEWS
      // ------------------------------------

      const testimonialPreviewData = {};

      normalized.testimonials.forEach(
        (item, index) => {

          if (item.imageUrl) {

            testimonialPreviewData[index] =
              getMediaUrl(
                item.imageUrl
              );

          }

        }
      );

      setTestimonialPreviews(
        testimonialPreviewData
      );


      // ------------------------------------
      // CLEAR PENDING FILES
      // ------------------------------------

      setHeroFile(null);

      setProjectFiles({});

      setGalleryFiles({});

      setTestimonialFiles({});

    } catch (loadError) {

      console.error(
        "LOAD IMPACT ERROR:",
        loadError
      );

      setError(
        loadError.message ||
        "Unable to load Impact content."
      );

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {

    loadImpact();

  }, []);


  // ========================================
  // UPDATE SECTION
  // ========================================

  const updateSection = (
    section,
    field,
    value
  ) => {

    setImpact(
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
        "Please select a valid hero image."
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
  // PROJECT IMAGE
  // ========================================

  const handleProjectImageChange = (
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
        "Please select a valid project image."
      );

      event.target.value = "";

      return;

    }


    const preview =
      URL.createObjectURL(file);


    setProjectFiles(
      previous => ({

        ...previous,

        [index]: file

      })
    );


    setProjectPreviews(
      previous => ({

        ...previous,

        [index]: preview

      })
    );


    setError("");

    setSuccess("");

  };


  // ========================================
  // GALLERY IMAGE
  // ========================================

  const handleGalleryImageChange = (
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
        "Please select a valid gallery image."
      );

      event.target.value = "";

      return;

    }


    const preview =
      URL.createObjectURL(file);


    setGalleryFiles(
      previous => ({

        ...previous,

        [index]: file

      })
    );


    setGalleryPreviews(
      previous => ({

        ...previous,

        [index]: preview

      })

    );


    setError("");

    setSuccess("");

  };


  // ========================================
  // TESTIMONIAL IMAGE
  // ========================================

  const handleTestimonialImageChange = (
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
        "Please select a valid testimonial image."
      );

      event.target.value = "";

      return;

    }


    const preview =
      URL.createObjectURL(file);


    setTestimonialFiles(
      previous => ({

        ...previous,

        [index]: file

      })
    );


    setTestimonialPreviews(
      previous => ({

        ...previous,

        [index]: preview

      })

    );


    setError("");

    setSuccess("");

  };


  // ========================================
  // UPDATE PROJECT
  // ========================================

  const updateProject = (
    index,
    field,
    value
  ) => {

    setImpact(
      previous => {

        const updated =
          [...previous.projects];

        updated[index] = {

          ...updated[index],

          [field]: value

        };


        return {

          ...previous,

          projects: updated

        };

      }
    );

    setError("");

    setSuccess("");

  };


  // ========================================
  // ADD PROJECT
  // ========================================

  const addProject = () => {

    setImpact(
      previous => {

        const nextOrder =
          previous.projects.length + 1;


        return {

          ...previous,

          projects: [

            ...previous.projects,

            {

              title: "",

              text: "",

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
  // REMOVE PROJECT
  // ========================================

  const removeProject = (
    index
  ) => {

    if (
      impact.projects.length <= 1
    ) {

      setError(
        "You must have at least one outreach project."
      );

      return;

    }


    setImpact(
      previous => {

        const updated =
          previous.projects

            .filter(
              (_, itemIndex) =>
                itemIndex !== index
            )

            .map(
              (item, itemIndex) => ({

                ...item,

                order:
                  itemIndex + 1

              })
            );


        return {

          ...previous,

          projects: updated

        };

      }
    );


    setProjectFiles(
      previous =>
        shiftIndexedObject(
          previous,
          index
        )
    );


    setProjectPreviews(
      previous =>
        shiftIndexedObject(
          previous,
          index
        )
    );


    setError("");

    setSuccess("");

  };


  // ========================================
  // UPDATE GALLERY
  // ========================================

  const updateGallery = (
    index,
    field,
    value
  ) => {

    setImpact(
      previous => {

        const updated =
          [...previous.gallery];

        updated[index] = {

          ...updated[index],

          [field]: value

        };


        return {

          ...previous,

          gallery: updated

        };

      }
    );

    setError("");

    setSuccess("");

  };


  // ========================================
  // ADD GALLERY
  // ========================================

  const addGalleryImage = () => {

    setImpact(
      previous => {

        const nextOrder =
          previous.gallery.length + 1;


        return {

          ...previous,

          gallery: [

            ...previous.gallery,

            {

              imageUrl: "",

              alt:
                `Impact gallery image ${nextOrder}`,

              order:
                nextOrder

            }

          ]

        };

      }
    );


    setError("");

    setSuccess("");

  };


  // ========================================
  // REMOVE GALLERY
  // ========================================

  const removeGalleryImage = (
    index
  ) => {

    if (
      impact.gallery.length <= 1
    ) {

      setError(
        "You must have at least one gallery image."
      );

      return;

    }


    setImpact(
      previous => {

        const updated =
          previous.gallery

            .filter(
              (_, itemIndex) =>
                itemIndex !== index
            )

            .map(
              (item, itemIndex) => ({

                ...item,

                order:
                  itemIndex + 1

              })
            );


        return {

          ...previous,

          gallery: updated

        };

      }
    );


    setGalleryFiles(
      previous =>
        shiftIndexedObject(
          previous,
          index
        )
    );


    setGalleryPreviews(
      previous =>
        shiftIndexedObject(
          previous,
          index
        )
    );


    setError("");

    setSuccess("");

  };


  // ========================================
  // UPDATE STAT
  // ========================================

  const updateStat = (
    index,
    field,
    value
  ) => {

    setImpact(
      previous => {

        const updated =
          [...previous.stats];

        updated[index] = {

          ...updated[index],

          [field]: value

        };


        return {

          ...previous,

          stats: updated

        };

      }
    );


    setError("");

    setSuccess("");

  };


  // ========================================
  // ADD STAT
  // ========================================

  const addStat = () => {

    setImpact(
      previous => {

        const nextOrder =
          previous.stats.length + 1;


        return {

          ...previous,

          stats: [

            ...previous.stats,

            {

              icon: "Users",

              number: "",

              label: "",

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
  // REMOVE STAT
  // ========================================

  const removeStat = (
    index
  ) => {

    if (
      impact.stats.length <= 1
    ) {

      setError(
        "You must have at least one impact statistic."
      );

      return;

    }


    setImpact(
      previous => {

        const updated =
          previous.stats

            .filter(
              (_, itemIndex) =>
                itemIndex !== index
            )

            .map(
              (item, itemIndex) => ({

                ...item,

                order:
                  itemIndex + 1

              })
            );


        return {

          ...previous,

          stats: updated

        };

      }
    );


    setError("");

    setSuccess("");

  };


  // ========================================
  // UPDATE TESTIMONIAL
  // ========================================

  const updateTestimonial = (
    index,
    field,
    value
  ) => {

    setImpact(
      previous => {

        const updated =
          [...previous.testimonials];

        updated[index] = {

          ...updated[index],

          [field]: value

        };


        return {

          ...previous,

          testimonials: updated

        };

      }
    );


    setError("");

    setSuccess("");

  };


  // ========================================
  // ADD TESTIMONIAL
  // ========================================

  const addTestimonial = () => {

    setImpact(
      previous => {

        const nextOrder =
          previous.testimonials.length + 1;


        return {

          ...previous,

          testimonials: [

            ...previous.testimonials,

            {

              quote: "",

              name: "",

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
  // REMOVE TESTIMONIAL
  // ========================================

  const removeTestimonial = (
    index
  ) => {

    if (
      impact.testimonials.length <= 1
    ) {

      setError(
        "You must have at least one testimonial."
      );

      return;

    }


    setImpact(
      previous => {

        const updated =
          previous.testimonials

            .filter(
              (_, itemIndex) =>
                itemIndex !== index
            )

            .map(
              (item, itemIndex) => ({

                ...item,

                order:
                  itemIndex + 1

              })
            );


        return {

          ...previous,

          testimonials: updated

        };

      }
    );


    setTestimonialFiles(
      previous =>
        shiftIndexedObject(
          previous,
          index
        )
    );


    setTestimonialPreviews(
      previous =>
        shiftIndexedObject(
          previous,
          index
        )
    );


    setError("");

    setSuccess("");

  };


  // ========================================
  // MOVE ARRAY ITEM
  // ========================================

  const moveArrayItem = (
    section,
    index,
    direction,
    setFiles,
    setPreviews
  ) => {

    const items =
      impact[section];


    const newIndex =
      direction === "up"
        ? index - 1
        : index + 1;


    if (
      newIndex < 0 ||
      newIndex >= items.length
    ) {

      return;

    }


    setImpact(
      previous => {

        const updated =
          [...previous[section]];


        [
          updated[index],
          updated[newIndex]
        ] = [
          updated[newIndex],
          updated[index]
        ];


        const reordered =
          updated.map(
            (item, itemIndex) => ({

              ...item,

              order:
                itemIndex + 1

            })
          );


        return {

          ...previous,

          [section]:
            reordered

        };

      }
    );


    setFiles(
      previous =>
        swapIndexedObject(
          previous,
          index,
          newIndex
        )
    );


    setPreviews(
      previous =>
        swapIndexedObject(
          previous,
          index,
          newIndex
        )
    );


    setError("");

    setSuccess("");

  };


  // ========================================
  // MOVE STAT
  // ========================================

  const moveStat = (
    index,
    direction
  ) => {

    const items =
      impact.stats;


    const newIndex =
      direction === "up"
        ? index - 1
        : index + 1;


    if (
      newIndex < 0 ||
      newIndex >= items.length
    ) {

      return;

    }


    setImpact(
      previous => {

        const updated =
          [...previous.stats];


        [
          updated[index],
          updated[newIndex]
        ] = [
          updated[newIndex],
          updated[index]
        ];


        const reordered =
          updated.map(
            (item, itemIndex) => ({

              ...item,

              order:
                itemIndex + 1

            })
          );


        return {

          ...previous,

          stats:
            reordered

        };

      }
    );


    setError("");

    setSuccess("");

  };


  // ========================================
  // VALIDATION
  // ========================================

  const validateForm = () => {


    // HERO

    if (
      !impact.hero.title?.trim()
    ) {

      setError(
        "Please enter the Impact hero title."
      );

      return false;

    }


    if (
      !impact.hero.description?.trim()
    ) {

      setError(
        "Please enter the Impact hero description."
      );

      return false;

    }


    // PROJECTS

    if (
      !impact.projects.length
    ) {

      setError(
        "Please add at least one outreach project."
      );

      return false;

    }


    for (
      const project of impact.projects
    ) {

      if (
        !project.title?.trim()
      ) {

        setError(
          "Every outreach project must have a title."
        );

        return false;

      }


      if (
        !project.text?.trim()
      ) {

        setError(
          "Every outreach project must have a description."
        );

        return false;

      }

    }


    // STATS

    if (
      !impact.stats.length
    ) {

      setError(
        "Please add at least one impact statistic."
      );

      return false;

    }


    for (
      const stat of impact.stats
    ) {

      if (
        !stat.number?.trim()
      ) {

        setError(
          "Every statistic must have a number."
        );

        return false;

      }


      if (
        !stat.label?.trim()
      ) {

        setError(
          "Every statistic must have a label."
        );

        return false;

      }

    }


    // GALLERY

    if (
      !impact.gallery.length
    ) {

      setError(
        "Please add at least one gallery image."
      );

      return false;

    }


    for (
      const gallery of impact.gallery
    ) {

      if (
        !gallery.alt?.trim()
      ) {

        setError(
          "Every gallery image must have alt text."
        );

        return false;

      }

    }


    // TESTIMONIALS

    if (
      !impact.testimonials.length
    ) {

      setError(
        "Please add at least one testimonial."
      );

      return false;

    }


    for (
      const testimonial of impact.testimonials
    ) {

      if (
        !testimonial.quote?.trim()
      ) {

        setError(
          "Every testimonial must have a quote."
        );

        return false;

      }


      if (
        !testimonial.name?.trim()
      ) {

        setError(
          "Every testimonial must have a name."
        );

        return false;

      }

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


    if (
      !validateForm()
    ) {

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
          impact.hero
        )
      );


      formData.append(
        "projects",
        JSON.stringify(
          impact.projects
        )
      );


      formData.append(
        "gallery",
        JSON.stringify(
          impact.gallery
        )
      );


      formData.append(
        "stats",
        JSON.stringify(
          impact.stats
        )
      );


      formData.append(
        "testimonials",
        JSON.stringify(
          impact.testimonials
        )
      );


      // ------------------------------------
      // HERO IMAGE
      // ------------------------------------

      if (
        heroFile
      ) {

        formData.append(
          "heroImage",
          heroFile
        );

      }


      // ------------------------------------
      // PROJECT IMAGES
      // ------------------------------------

      Object.entries(
        projectFiles
      ).forEach(
        ([index, file]) => {

          formData.append(
            `projectImage_${index}`,
            file
          );

        }
      );


      // ------------------------------------
      // GALLERY IMAGES
      // ------------------------------------

      Object.entries(
        galleryFiles
      ).forEach(
        ([index, file]) => {

          formData.append(
            `galleryImage_${index}`,
            file
          );

        }
      );


      // ------------------------------------
      // TESTIMONIAL IMAGES
      // ------------------------------------

      Object.entries(
        testimonialFiles
      ).forEach(
        ([index, file]) => {

          formData.append(
            `testimonialImage_${index}`,
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
          "Unable to save Impact content."
        );

      }


      // ------------------------------------
      // NORMALIZE RESPONSE
      // ------------------------------------

      const normalized =
        normalizeImpact(
          data.impact
        );


      setImpact(
        normalized
      );


      // ------------------------------------
      // HERO PREVIEW
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


      // ------------------------------------
      // PROJECT PREVIEWS
      // ------------------------------------

      const projectPreviewData = {};

      normalized.projects.forEach(
        (project, index) => {

          if (project.imageUrl) {

            projectPreviewData[index] =
              getMediaUrl(
                project.imageUrl
              );

          }

        }
      );


      setProjectPreviews(
        projectPreviewData
      );


      // ------------------------------------
      // GALLERY PREVIEWS
      // ------------------------------------

      const galleryPreviewData = {};

      normalized.gallery.forEach(
        (item, index) => {

          if (item.imageUrl) {

            galleryPreviewData[index] =
              getMediaUrl(
                item.imageUrl
              );

          }

        }
      );


      setGalleryPreviews(
        galleryPreviewData
      );


      // ------------------------------------
      // TESTIMONIAL PREVIEWS
      // ------------------------------------

      const testimonialPreviewData = {};

      normalized.testimonials.forEach(
        (item, index) => {

          if (item.imageUrl) {

            testimonialPreviewData[index] =
              getMediaUrl(
                item.imageUrl
              );

          }

        }
      );


      setTestimonialPreviews(
        testimonialPreviewData
      );


      // ------------------------------------
      // CLEAR FILE STATE
      // ------------------------------------

      setHeroFile(null);

      setProjectFiles({});

      setGalleryFiles({});

      setTestimonialFiles({});


      // ------------------------------------
      // SUCCESS
      // ------------------------------------

      setSuccess(
        "Impact content saved successfully."
      );


      setTimeout(() => {

        setSuccess("");

      }, 4000);

    } catch (saveError) {

      console.error(
        "SAVE IMPACT ERROR:",
        saveError
      );

      setError(
        saveError.message ||
        "Unable to save Impact content."
      );

    } finally {

      setSaving(false);

    }

  };


  // ========================================
  // RESET
  // ========================================

  const handleReset = () => {

    const confirmed =
      window.confirm(
        "Reset the Impact form to the default content? This will not change the database until you save."
      );


    if (!confirmed) {
      return;
    }


    setImpact(
      JSON.parse(
        JSON.stringify(
          defaultImpact
        )
      )
    );


    setHeroFile(null);

    setProjectFiles({});

    setGalleryFiles({});

    setTestimonialFiles({});

    setHeroPreview("");

    setProjectPreviews({});

    setGalleryPreviews({});

    setTestimonialPreviews({});

    setError("");

    setSuccess(
      "Impact form reset to default content."
    );

  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <div className="admin-page admin-impact-page">

        <div className="admin-page-header">

          <div>

            <span className="admin-section-eyebrow">
              CONTENT MANAGEMENT
            </span>

            <h1>
              Our Impact
            </h1>

            <p>
              Manage the impact content
              displayed on your public website.
            </p>

          </div>

        </div>


        <div className="admin-empty-state">

          <RefreshCw
            size={42}
            className="admin-loading-icon"
          />

          <h3>
            Loading Impact...
          </h3>

          <p>
            Connecting to the Impact database.
          </p>

        </div>

      </div>

    );

  }


  // ========================================
  // RENDER
  // ========================================

  return (

    <div className="admin-page admin-impact-page">


      {/* ====================================
          HEADER
      ==================================== */}

      <div className="admin-page-header">

        <div>

          <span className="admin-section-eyebrow">
            CONTENT MANAGEMENT
          </span>

          <h1>
            Our Impact
          </h1>

          <p>
            Manage projects, impact statistics,
            gallery images and testimonials
            displayed on the public Impact page.
          </p>

        </div>


        <div className="admin-impact-header-actions">

          <button
            type="button"
            className="btn-secondary"
            onClick={loadImpact}
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
            form="impact-management-form"
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
        id="impact-management-form"
        className="admin-impact-form"
        onSubmit={handleSubmit}
      >


        {/* ==================================
            HERO
        ================================== */}

        <section className="admin-impact-section">

          <div className="admin-impact-section-header">

            <div className="admin-impact-section-heading">

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
                  the Impact page.
                </p>

              </div>

            </div>

          </div>


          <div className="admin-impact-image-editor">

            <div className="admin-impact-large-image-preview">

              {heroPreview ? (

                <img
                  src={heroPreview}
                  alt="Impact hero"
                />

              ) : (

                <div className="admin-impact-image-empty">

                  <ImageIcon size={44} />

                  <span>
                    No hero image uploaded
                  </span>

                </div>

              )}

            </div>


            <div className="admin-impact-image-info">

              <span className="admin-section-eyebrow">
                HERO IMAGE
              </span>

              <h3>
                Main Impact Banner
              </h3>

              <p>
                This image appears behind
                the Our Impact hero section.
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
                Hero Title
              </label>

              <input
                type="text"
                className="form-input"
                value={
                  impact.hero.title
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


            <div className="form-group">

              <label className="form-label">
                Hero Description
              </label>

              <input
                type="text"
                className="form-input"
                value={
                  impact.hero.description
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

          </div>

        </section>


        {/* ==================================
            PROJECTS
        ================================== */}

        <section className="admin-impact-section">

          <div className="admin-impact-section-header">

            <div className="admin-impact-section-heading">

              <span>
                02
              </span>

              <div>

                <h2>
                  Outreach &amp; Projects
                </h2>

                <p>
                  Manage the latest outreach
                  projects displayed on the
                  Impact page.
                </p>

              </div>

            </div>


            <button
              type="button"
              className="btn-secondary"
              onClick={addProject}
            >

              <Plus size={17} />

              Add Project

            </button>

          </div>


          <div className="admin-impact-list">

            {impact.projects.map(
              (project, index) => {

                const preview =
                  projectPreviews[index] ||
                  getMediaUrl(
                    project.imageUrl
                  );


                return (

                  <article
                    className="admin-impact-card"
                    key={
                      project._id ||
                      `project-${index}`
                    }
                  >

                    <div className="admin-impact-card-header">

                      <div className="admin-impact-card-drag">

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
                          Project {index + 1}
                        </strong>

                        <span>
                          Outreach project
                        </span>

                      </div>


                      <div className="admin-impact-card-actions">

                        <button
                          type="button"
                          className="admin-icon-button"
                          title="Move up"
                          disabled={
                            index === 0
                          }
                          onClick={() =>
                            moveArrayItem(
                              "projects",
                              index,
                              "up",
                              setProjectFiles,
                              setProjectPreviews
                            )
                          }
                        >

                          <ArrowUp size={17} />

                        </button>


                        <button
                          type="button"
                          className="admin-icon-button"
                          title="Move down"
                          disabled={
                            index ===
                            impact.projects.length - 1
                          }
                          onClick={() =>
                            moveArrayItem(
                              "projects",
                              index,
                              "down",
                              setProjectFiles,
                              setProjectPreviews
                            )
                          }
                        >

                          <ArrowDown size={17} />

                        </button>


                        <button
                          type="button"
                          className="admin-icon-button admin-icon-danger"
                          title="Remove project"
                          onClick={() =>
                            removeProject(
                              index
                            )
                          }
                        >

                          <Trash2 size={17} />

                        </button>

                      </div>

                    </div>


                    <div className="admin-impact-card-body">

                      <div className="admin-impact-image-column">

                        <div className="admin-impact-image-preview">

                          {preview ? (

                            <img
                              src={preview}
                              alt={
                                project.title ||
                                `Project ${index + 1}`
                              }
                            />

                          ) : (

                            <div className="admin-impact-image-empty">

                              <ImageIcon size={38} />

                              <span>
                                No image
                              </span>

                            </div>

                          )}

                        </div>


                        <button
                          type="button"
                          className="btn-secondary admin-impact-upload-button"
                          onClick={() =>
                            projectInputRefs.current[
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

                            projectInputRefs.current[
                              index
                            ] = element;

                          }}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          hidden
                          onChange={event =>
                            handleProjectImageChange(
                              index,
                              event
                            )
                          }
                        />

                      </div>


                      <div className="admin-impact-fields">

                        <div className="form-group">

                          <label className="form-label">
                            Project Title
                          </label>

                          <input
                            type="text"
                            className="form-input"
                            value={
                              project.title
                            }
                            onChange={event =>
                              updateProject(
                                index,
                                "title",
                                event.target.value
                              )
                            }
                            placeholder="Enter project title"
                          />

                        </div>


                        <div className="form-group">

                          <label className="form-label">
                            Project Description
                          </label>

                          <textarea
                            className="form-input"
                            rows="6"
                            value={
                              project.text
                            }
                            onChange={event =>
                              updateProject(
                                index,
                                "text",
                                event.target.value
                              )
                            }
                            placeholder="Enter project description"
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
            STATS
        ================================== */}

        <section className="admin-impact-section">

          <div className="admin-impact-section-header">

            <div className="admin-impact-section-heading">

              <span>
                03
              </span>

              <div>

                <h2>
                  Impact in Numbers
                </h2>

                <p>
                  Manage the statistics showing
                  the Foundation's measurable impact.
                </p>

              </div>

            </div>


            <button
              type="button"
              className="btn-secondary"
              onClick={addStat}
            >

              <Plus size={17} />

              Add Statistic

            </button>

          </div>


          <div className="admin-impact-stats-list">

            {impact.stats.map(
              (stat, index) => (

                <article
                  className="admin-impact-stat-card"
                  key={
                    stat._id ||
                    `stat-${index}`
                  }
                >

                  <div className="admin-impact-stat-header">

                    <div className="admin-impact-stat-number">

                      <BarChart3 size={19} />

                      <span>
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                    </div>


                    <div className="admin-impact-stat-actions">

                      <button
                        type="button"
                        className="admin-icon-button"
                        title="Move up"
                        disabled={
                          index === 0
                        }
                        onClick={() =>
                          moveStat(
                            index,
                            "up"
                          )
                        }
                      >

                        <ArrowUp size={17} />

                      </button>


                      <button
                        type="button"
                        className="admin-icon-button"
                        title="Move down"
                        disabled={
                          index ===
                          impact.stats.length - 1
                        }
                        onClick={() =>
                          moveStat(
                            index,
                            "down"
                          )
                        }
                      >

                        <ArrowDown size={17} />

                      </button>


                      <button
                        type="button"
                        className="admin-icon-button admin-icon-danger"
                        title="Remove statistic"
                        onClick={() =>
                          removeStat(
                            index
                          )
                        }
                      >

                        <Trash2 size={17} />

                      </button>

                    </div>

                  </div>


                  <div className="admin-impact-stat-body">

                    <div className="form-group">

                      <label className="form-label">
                        Icon
                      </label>

                      <select
                        className="form-input"
                        value={
                          stat.icon
                        }
                        onChange={event =>
                          updateStat(
                            index,
                            "icon",
                            event.target.value
                          )
                        }
                      >

                        <option value="Users">
                          Users
                        </option>

                        <option value="Network">
                          Network
                        </option>

                        <option value="Handshake">
                          Handshake
                        </option>

                        <option value="UsersRound">
                          Users Round
                        </option>

                      </select>

                    </div>


                    <div className="form-group">

                      <label className="form-label">
                        Number
                      </label>

                      <input
                        type="text"
                        className="form-input"
                        value={
                          stat.number
                        }
                        onChange={event =>
                          updateStat(
                            index,
                            "number",
                            event.target.value
                          )
                        }
                        placeholder="e.g. 412+"
                      />

                    </div>


                    <div className="form-group">

                      <label className="form-label">
                        Label
                      </label>

                      <input
                        type="text"
                        className="form-input"
                        value={
                          stat.label
                        }
                        onChange={event =>
                          updateStat(
                            index,
                            "label",
                            event.target.value
                          )
                        }
                        placeholder="e.g. Lives Supported"
                      />

                    </div>

                  </div>

                </article>

              )
            )}

          </div>

        </section>


        {/* ==================================
            GALLERY
        ================================== */}

        <section className="admin-impact-section">

          <div className="admin-impact-section-header">

            <div className="admin-impact-section-heading">

              <span>
                04
              </span>

              <div>

                <h2>
                  Moments of Impact
                </h2>

                <p>
                  Manage the images displayed
                  in the Impact gallery preview.
                </p>

              </div>

            </div>


            <button
              type="button"
              className="btn-secondary"
              onClick={addGalleryImage}
            >

              <Plus size={17} />

              Add Image

            </button>

          </div>


          <div className="admin-impact-gallery-grid">

            {impact.gallery.map(
              (item, index) => {

                const preview =
                  galleryPreviews[index] ||
                  getMediaUrl(
                    item.imageUrl
                  );


                return (

                  <article
                    className="admin-impact-gallery-card"
                    key={
                      item._id ||
                      `gallery-${index}`
                    }
                  >

                    <div className="admin-impact-gallery-header">

                      <div className="admin-impact-gallery-position">

                        <GripVertical
                          size={18}
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


                      <div className="admin-impact-card-actions">

                        <button
                          type="button"
                          className="admin-icon-button"
                          title="Move up"
                          disabled={
                            index === 0
                          }
                          onClick={() =>
                            moveArrayItem(
                              "gallery",
                              index,
                              "up",
                              setGalleryFiles,
                              setGalleryPreviews
                            )
                          }
                        >

                          <ArrowUp size={16} />

                        </button>


                        <button
                          type="button"
                          className="admin-icon-button"
                          title="Move down"
                          disabled={
                            index ===
                            impact.gallery.length - 1
                          }
                          onClick={() =>
                            moveArrayItem(
                              "gallery",
                              index,
                              "down",
                              setGalleryFiles,
                              setGalleryPreviews
                            )
                          }
                        >

                          <ArrowDown size={16} />

                        </button>


                        <button
                          type="button"
                          className="admin-icon-button admin-icon-danger"
                          title="Remove image"
                          onClick={() =>
                            removeGalleryImage(
                              index
                            )
                          }
                        >

                          <Trash2 size={16} />

                        </button>

                      </div>

                    </div>


                    <div className="admin-impact-gallery-preview">

                      {preview ? (

                        <img
                          src={preview}
                          alt={
                            item.alt ||
                            `Gallery image ${index + 1}`
                          }
                        />

                      ) : (

                        <div className="admin-impact-image-empty">

                          <Images size={36} />

                          <span>
                            No image
                          </span>

                        </div>

                      )}

                    </div>


                    <button
                      type="button"
                      className="btn-secondary admin-impact-gallery-upload"
                      onClick={() =>
                        galleryInputRefs.current[
                          index
                        ]?.click()
                      }
                    >

                      <Upload size={15} />

                      {preview
                        ? "Replace Image"
                        : "Upload Image"}

                    </button>


                    <input
                      ref={element => {

                        galleryInputRefs.current[
                          index
                        ] = element;

                      }}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      hidden
                      onChange={event =>
                        handleGalleryImageChange(
                          index,
                          event
                        )
                      }
                    />


                    <div className="form-group">

                      <label className="form-label">
                        Alt Text
                      </label>

                      <input
                        type="text"
                        className="form-input"
                        value={
                          item.alt
                        }
                        onChange={event =>
                          updateGallery(
                            index,
                            "alt",
                            event.target.value
                          )
                        }
                        placeholder="Describe the image"
                      />

                    </div>

                  </article>

                );

              }
            )}

          </div>

        </section>


        {/* ==================================
            TESTIMONIALS
        ================================== */}

        <section className="admin-impact-section">

          <div className="admin-impact-section-header">

            <div className="admin-impact-section-heading">

              <span>
                05
              </span>

              <div>

                <h2>
                  Stories That Inspire
                </h2>

                <p>
                  Manage testimonials and stories
                  from people impacted by the Foundation.
                </p>

              </div>

            </div>


            <button
              type="button"
              className="btn-secondary"
              onClick={addTestimonial}
            >

              <Plus size={17} />

              Add Testimonial

            </button>

          </div>


          <div className="admin-impact-testimonials-list">

            {impact.testimonials.map(
              (testimonial, index) => {

                const preview =
                  testimonialPreviews[index] ||
                  getMediaUrl(
                    testimonial.imageUrl
                  );


                return (

                  <article
                    className="admin-impact-testimonial-card"
                    key={
                      testimonial._id ||
                      `testimonial-${index}`
                    }
                  >

                    <div className="admin-impact-card-header">

                      <div className="admin-impact-card-drag">

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
                          Testimonial {index + 1}
                        </strong>

                        <span>
                          Impact story
                        </span>

                      </div>


                      <div className="admin-impact-card-actions">

                        <button
                          type="button"
                          className="admin-icon-button"
                          title="Move up"
                          disabled={
                            index === 0
                          }
                          onClick={() =>
                            moveArrayItem(
                              "testimonials",
                              index,
                              "up",
                              setTestimonialFiles,
                              setTestimonialPreviews
                            )
                          }
                        >

                          <ArrowUp size={17} />

                        </button>


                        <button
                          type="button"
                          className="admin-icon-button"
                          title="Move down"
                          disabled={
                            index ===
                            impact.testimonials.length - 1
                          }
                          onClick={() =>
                            moveArrayItem(
                              "testimonials",
                              index,
                              "down",
                              setTestimonialFiles,
                              setTestimonialPreviews
                            )
                          }
                        >

                          <ArrowDown size={17} />

                        </button>


                        <button
                          type="button"
                          className="admin-icon-button admin-icon-danger"
                          title="Remove testimonial"
                          onClick={() =>
                            removeTestimonial(
                              index
                            )
                          }
                        >

                          <Trash2 size={17} />

                        </button>

                      </div>

                    </div>


                    <div className="admin-impact-testimonial-body">

                      <div className="admin-impact-testimonial-image-column">

                        <div className="admin-impact-testimonial-preview">

                          {preview ? (

                            <img
                              src={preview}
                              alt={
                                testimonial.name ||
                                `Testimonial ${index + 1}`
                              }
                            />

                          ) : (

                            <div className="admin-impact-image-empty">

                              <MessageSquareQuote
                                size={36}
                              />

                              <span>
                                No image
                              </span>

                            </div>

                          )}

                        </div>


                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() =>
                            testimonialInputRefs.current[
                              index
                            ]?.click()
                          }
                        >

                          <Upload size={15} />

                          {preview
                            ? "Replace Image"
                            : "Upload Image"}

                        </button>


                        <input
                          ref={element => {

                            testimonialInputRefs.current[
                              index
                            ] = element;

                          }}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          hidden
                          onChange={event =>
                            handleTestimonialImageChange(
                              index,
                              event
                            )
                          }
                        />

                      </div>


                      <div className="admin-impact-testimonial-fields">

                        <div className="form-group">

                          <label className="form-label">
                            Quote
                          </label>

                          <textarea
                            className="form-input"
                            rows="6"
                            value={
                              testimonial.quote
                            }
                            onChange={event =>
                              updateTestimonial(
                                index,
                                "quote",
                                event.target.value
                              )
                            }
                            placeholder="Enter testimonial quote"
                          />

                        </div>


                        <div className="form-group">

                          <label className="form-label">
                            Person / Attribution
                          </label>

                          <input
                            type="text"
                            className="form-input"
                            value={
                              testimonial.name
                            }
                            onChange={event =>
                              updateTestimonial(
                                index,
                                "name",
                                event.target.value
                              )
                            }
                            placeholder="e.g. Mrs. Ngozi, Widow"
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
            SAVE BAR
        ================================== */}

        <div className="admin-impact-save-bar">

          <div>

            <strong>
              Our Impact Content
            </strong>

            <span>
              Changes are saved to the
              Foundation database when
              you click Save Impact.
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
              : "Save Impact"}

          </button>

        </div>

      </form>

    </div>

  );

};


// ========================================
// INDEX HELPERS
// ========================================

const shiftIndexedObject = (
  source,
  removedIndex
) => {

  const updated = {};

  Object.keys(source).forEach(
    key => {

      const index =
        Number(key);


      if (
        index < removedIndex
      ) {

        updated[index] =
          source[key];

      } else if (
        index > removedIndex
      ) {

        updated[index - 1] =
          source[key];

      }

    }
  );


  return updated;

};


const swapIndexedObject = (
  source,
  firstIndex,
  secondIndex
) => {

  const updated = {
    ...source
  };


  const first =
    updated[firstIndex];

  const second =
    updated[secondIndex];


  if (
    first === undefined
  ) {

    delete updated[secondIndex];

  } else {

    updated[secondIndex] =
      first;

  }


  if (
    second === undefined
  ) {

    delete updated[firstIndex];

  } else {

    updated[firstIndex] =
      second;

  }


  return updated;

};


export default AdminImpact;