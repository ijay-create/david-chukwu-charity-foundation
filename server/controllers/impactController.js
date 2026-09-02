const Impact = require("../models/Impact");
const uploadToCloudinary = require("../utils/cloudinaryUpload");

// ========================================
// DEFAULT PROJECTS
// ========================================

const defaultProjects = [
  {
    title: "Widows Support Outreach",
    text:
      "We provided food items, cash grants and skills support to widows to help them strengthen their livelihoods.",
    imageUrl: "",
    order: 1
  },

  {
    title: "Children Support Program",
    text:
      "We supported children in underserved communities with school supplies, learning material and care.",
    imageUrl: "",
    order: 2
  },

  {
    title: "Elderly Care Outreach",
    text:
      "We provided essential items, medical support and companionship to improve the well-being of elderly individuals.",
    imageUrl: "",
    order: 3
  }
];

// ========================================
// DEFAULT GALLERY
// ========================================

const defaultGallery = [
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
];

// ========================================
// DEFAULT STATS
// ========================================

const defaultStats = [
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
];

// ========================================
// DEFAULT TESTIMONIALS
// ========================================

const defaultTestimonials = [
  {
    imageUrl: "",
    quote:
      "The support I received gave me hope and strength.",
    name: "Mrs. Ngozi, Widow",
    order: 1
  },

  {
    imageUrl: "",
    quote:
      "I am so grateful for the books and school items. They help me learn better.",
    name: "Joshua, Student",
    order: 2
  }
];

// ========================================
// DEFAULT IMPACT
// ========================================

const createDefaultImpact = () => ({
  hero: {
    title: "Our Impact",
    tagline: "Real change, Stronger communities",
    lineOne: "Real change, Stronger communities",
    lineTwo: "A better tomorrow",
    imageUrl: ""
  },

  projects: [...defaultProjects],

  gallery: [...defaultGallery],

  stats: [...defaultStats],

  testimonials: [...defaultTestimonials],

  cta: {
    title: "Be Part of the Change",
    description:
      "Your support can help us reach those who need it most.",
    donateText: "DONATE NOW",
    involvedText: "GET INVOLVED"
  }
});

// ========================================
// PARSE JSON SAFELY
// ========================================

const parseJSON = (value, fallback) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  if (typeof value === "object") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(
      "Invalid JSON data received from the client."
    );
  }
};

// ========================================
// UPLOAD IMAGE TO CLOUDINARY
// ========================================

const uploadImpactImage = async (
  file,
  folder,
  publicId
) => {
  if (!file?.buffer) {
    throw new Error(
      "No image buffer was provided for Cloudinary upload."
    );
  }

  const result = await uploadToCloudinary(
    file.buffer,
    {
      folder,
      publicId
    }
  );

  if (!result?.secure_url) {
    throw new Error(
      "Cloudinary did not return a secure image URL."
    );
  }

  return result.secure_url;
};

// ========================================
// GET IMPACT
// ========================================

const getImpact = async (req, res) => {
  try {
    let impact = await Impact.findOne();

    // ------------------------------------
    // CREATE INITIAL DOCUMENT
    // ------------------------------------

    if (!impact) {
      impact = await Impact.create(
        createDefaultImpact()
      );
    }

    // ------------------------------------
    // SORT ARRAYS
    // ------------------------------------

    impact.projects.sort(
      (a, b) =>
        (a.order || 0) -
        (b.order || 0)
    );

    impact.gallery.sort(
      (a, b) =>
        (a.order || 0) -
        (b.order || 0)
    );

    impact.stats.sort(
      (a, b) =>
        (a.order || 0) -
        (b.order || 0)
    );

    impact.testimonials.sort(
      (a, b) =>
        (a.order || 0) -
        (b.order || 0)
    );

    return res.status(200).json({
      success: true,
      impact
    });
  } catch (error) {
    console.error(
      "GET IMPACT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch Impact content."
    });
  }
};

// ========================================
// UPDATE IMPACT
// ========================================

const updateImpact = async (req, res) => {
  try {
    let impact = await Impact.findOne();

    // ------------------------------------
    // CREATE IF NOT EXISTS
    // ------------------------------------

    if (!impact) {
      impact = new Impact(
        createDefaultImpact()
      );
    }

    // ====================================
    // HERO TEXT
    // ====================================

    if (req.body.hero) {
      const heroData = parseJSON(
        req.body.hero,
        {}
      );

      impact.hero = {
        ...(impact.hero?.toObject?.() ||
          impact.hero ||
          {}),
        ...heroData
      };
    }

    // ====================================
    // PROJECTS
    // ====================================

    if (req.body.projects) {
      const projectData = parseJSON(
        req.body.projects,
        []
      );

      if (Array.isArray(projectData)) {
        impact.projects = projectData.map(
          (project, index) => ({
            ...project,
            order:
              Number(project.order) ||
              index + 1
          })
        );
      }
    }

    // ====================================
    // GALLERY
    // ====================================

    if (req.body.gallery) {
      const galleryData = parseJSON(
        req.body.gallery,
        []
      );

      if (Array.isArray(galleryData)) {
        impact.gallery = galleryData.map(
          (item, index) => ({
            ...item,
            order:
              Number(item.order) ||
              index + 1
          })
        );
      }
    }

    // ====================================
    // STATS
    // ====================================

    if (req.body.stats) {
      const statsData = parseJSON(
        req.body.stats,
        []
      );

      if (Array.isArray(statsData)) {
        impact.stats = statsData.map(
          (stat, index) => ({
            ...stat,
            order:
              Number(stat.order) ||
              index + 1
          })
        );
      }
    }

    // ====================================
    // TESTIMONIALS
    // ====================================

    if (req.body.testimonials) {
      const testimonialsData =
        parseJSON(
          req.body.testimonials,
          []
        );

      if (
        Array.isArray(
          testimonialsData
        )
      ) {
        impact.testimonials =
          testimonialsData.map(
            (testimonial, index) => ({
              ...testimonial,
              order:
                Number(
                  testimonial.order
                ) || index + 1
            })
          );
      }
    }

    // ====================================
    // CTA
    // ====================================

    if (req.body.cta) {
      const ctaData = parseJSON(
        req.body.cta,
        {}
      );

      impact.cta = {
        ...(impact.cta?.toObject?.() ||
          impact.cta ||
          {}),
        ...ctaData
      };
    }

    // ====================================
    // HERO IMAGE
    // ====================================

    const heroFile =
      req.files?.heroImage?.[0];

    if (heroFile) {
      const imageUrl =
        await uploadImpactImage(
          heroFile,
          "david-chukwu-charity-foundation/impact/hero",
          "hero"
        );

      impact.hero.imageUrl =
        imageUrl;
    }

    // ====================================
    // PROJECT IMAGES
    // ====================================

    for (
      let index = 0;
      index < 20;
      index++
    ) {
      const fieldName =
        `projectImage_${index}`;

      const file =
        req.files?.[fieldName]?.[0];

      if (!file) {
        continue;
      }

      if (!impact.projects[index]) {
        continue;
      }

      const imageUrl =
        await uploadImpactImage(
          file,
          "david-chukwu-charity-foundation/impact/projects",
          `project-${index + 1}`
        );

      impact.projects[index].imageUrl =
        imageUrl;
    }

    // ====================================
    // GALLERY IMAGES
    // ====================================

    for (
      let index = 0;
      index < 20;
      index++
    ) {
      const fieldName =
        `galleryImage_${index}`;

      const file =
        req.files?.[fieldName]?.[0];

      if (!file) {
        continue;
      }

      if (!impact.gallery[index]) {
        continue;
      }

      const imageUrl =
        await uploadImpactImage(
          file,
          "david-chukwu-charity-foundation/impact/gallery",
          `gallery-${index + 1}`
        );

      impact.gallery[index].imageUrl =
        imageUrl;
    }

    // ====================================
    // TESTIMONIAL IMAGES
    // ====================================

    for (
      let index = 0;
      index < 10;
      index++
    ) {
      const fieldName =
        `testimonialImage_${index}`;

      const file =
        req.files?.[fieldName]?.[0];

      if (!file) {
        continue;
      }

      if (!impact.testimonials[index]) {
        continue;
      }

      const imageUrl =
        await uploadImpactImage(
          file,
          "david-chukwu-charity-foundation/impact/testimonials",
          `testimonial-${index + 1}`
        );

      impact.testimonials[index].imageUrl =
        imageUrl;
    }

    // ====================================
    // NORMALIZE ORDER
    // ====================================

    impact.projects =
      impact.projects.map(
        (project, index) => ({
          ...(project.toObject?.() ||
            project),
          order: index + 1
        })
      );

    impact.gallery =
      impact.gallery.map(
        (item, index) => ({
          ...(item.toObject?.() ||
            item),
          order: index + 1
        })
      );

    impact.stats =
      impact.stats.map(
        (stat, index) => ({
          ...(stat.toObject?.() ||
            stat),
          order: index + 1
        })
      );

    impact.testimonials =
      impact.testimonials.map(
        (testimonial, index) => ({
          ...(testimonial.toObject?.() ||
            testimonial),
          order: index + 1
        })
      );

    // ====================================
    // SAVE
    // ====================================

    await impact.save();

    // ====================================
    // RESPONSE
    // ====================================

    return res.status(200).json({
      success: true,
      message:
        "Impact content updated successfully.",
      impact
    });
  } catch (error) {
    console.error(
      "UPDATE IMPACT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update Impact content."
    });
  }
};

// ========================================
// EXPORT
// ========================================

module.exports = {
  getImpact,
  updateImpact
};