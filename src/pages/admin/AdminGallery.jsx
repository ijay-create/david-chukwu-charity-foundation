import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  X,
  Upload,
  Video,
  Image as ImageIcon
} from "lucide-react";

import API from "../../api/axios";

import "../../styles/Admin.gallery.css";


// ========================================
// CONSTANTS
// ========================================

const API_BASE_URL = "http://localhost:5000";

const categories = [
  "All",
  "Outreach",
  "Events",
  "Impact",
  "Success Stories"
];

const formCategories = [
  "Outreach",
  "Events",
  "Impact",
  "Success Stories"
];

const emptyForm = {
  title: "",
  category: "Outreach",
  type: "image",
  description: "",
  file: null,
  preview: "",
  order: ""
};


// ========================================
// ADMIN GALLERY
// ========================================

const AdminGallery = () => {

  // ======================================
  // STATE
  // ======================================

  const [galleryItems, setGalleryItems] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [previewItem, setPreviewItem] =
    useState(null);

  const [editingItem, setEditingItem] =
    useState(null);

  const [selectedItems, setSelectedItems] =
    useState([]);

  const [formData, setFormData] =
    useState({
      ...emptyForm
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  const fileInputRef =
    useRef(null);


  // ======================================
  // MEDIA URL
  // ======================================

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


  // ======================================
  // FETCH GALLERY
  // ======================================

  const fetchGallery = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await API.get("/gallery");

      /*
       * Your backend controller currently
       * returns the gallery array directly:
       *
       * return res.status(200).json(gallery);
       */

      const items =
        Array.isArray(response.data)
          ? response.data
          : response.data?.gallery ||
            response.data?.items ||
            response.data?.data ||
            [];

      const normalizedItems =
        items.map((item) => {

          const mediaUrl =
            item.fileUrl ||
            item.src ||
            item.url ||
            "";

          return {
            ...item,

            id:
              item._id ||
              item.id,

            src:
              getMediaUrl(mediaUrl),

            date:
              item.createdAt
                ? new Date(
                    item.createdAt
                  )
                    .toISOString()
                    .split("T")[0]
                : "",

            order:
              item.order ?? 0
          };

        });

      setGalleryItems(
        normalizedItems
      );

    } catch (requestError) {

      console.error(
        "GET GALLERY ERROR:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
        "Unable to load gallery items."
      );

    } finally {

      setLoading(false);

    }
  };


  // ======================================
  // LOAD GALLERY
  // ======================================

  useEffect(() => {

    fetchGallery();

  }, []);


  // ======================================
  // FILTER GALLERY
  // ======================================

  const filteredItems =
    useMemo(() => {

      const search =
        searchTerm
          .toLowerCase()
          .trim();

      return galleryItems.filter(
        (item) => {

          const title =
            item.title ||
            "";

          const description =
            item.description ||
            "";

          const matchesSearch =
            !search ||
            title
              .toLowerCase()
              .includes(search) ||
            description
              .toLowerCase()
              .includes(search);

          const matchesCategory =
            categoryFilter === "All" ||
            item.category ===
              categoryFilter;

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );

    }, [
      galleryItems,
      searchTerm,
      categoryFilter
    ]);


  // ======================================
  // OPEN ADD MODAL
  // ======================================

  const openAddModal = () => {

    setEditingItem(null);

    setFormData({
      ...emptyForm
    });

    setError("");

    setModalOpen(true);
  };


  // ======================================
  // OPEN EDIT MODAL
  // ======================================

  const openEditModal = (item) => {

    setEditingItem(item);

    setFormData({

      title:
        item.title || "",

      category:
        item.category ||
        "Outreach",

      type:
        item.type ||
        "image",

      description:
        item.description ||
        "",

      file: null,

      preview:
        item.src ||
        getMediaUrl(
          item.fileUrl
        ),

      order:
        item.order ?? ""

    });

    setError("");

    setModalOpen(true);
  };


  // ======================================
  // CLOSE MODAL
  // ======================================

  const closeModal = () => {

    if (saving) {
      return;
    }

    setModalOpen(false);

    setEditingItem(null);

    setFormData({
      ...emptyForm
    });

    setError("");

    if (fileInputRef.current) {

      fileInputRef.current.value =
        "";

    }
  };


  // ======================================
  // FORM CHANGE
  // ======================================

  const handleChange = (event) => {

    const {
      name,
      value
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value
      })
    );

    setError("");
  };


  // ======================================
  // FILE CHANGE
  // ======================================

  const handleFileChange = (event) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "video/mp4"
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {

      setError(
        "Only JPG, JPEG, PNG and MP4 files are allowed."
      );

      event.target.value = "";

      return;
    }

    // Validate size
    const maxSize =
      50 * 1024 * 1024;

    if (file.size > maxSize) {

      setError(
        "File size cannot exceed 50MB."
      );

      event.target.value = "";

      return;
    }

    const detectedType =
      file.type.startsWith(
        "video/"
      )
        ? "video"
        : "image";

    const previewUrl =
      URL.createObjectURL(file);

    setFormData(
      (previous) => ({

        ...previous,

        file,

        type:
          detectedType,

        preview:
          previewUrl

      })
    );

    setError("");
  };


  // ======================================
  // VALIDATE FORM
  // ======================================

  const validateForm = () => {

    if (
      !formData.title.trim()
    ) {

      setError(
        "Please enter a title."
      );

      return false;
    }

    if (
      !formData.description.trim()
    ) {

      setError(
        "Please enter a description."
      );

      return false;
    }

    if (
      !editingItem &&
      !formData.file
    ) {

      setError(
        "Please select an image or video."
      );

      return false;
    }

    return true;
  };


  // ======================================
  // CREATE GALLERY ITEM
  // ======================================

  const createGalleryItem = async () => {

    const data =
      new FormData();

    data.append(
      "title",
      formData.title.trim()
    );

    data.append(
      "category",
      formData.category
    );

    data.append(
      "type",
      formData.type
    );

    data.append(
      "description",
      formData.description.trim()
    );

    data.append(
      "order",
      String(
        Number(formData.order) ||
        galleryItems.length + 1
      )
    );

    data.append(
      "file",
      formData.file
    );

    /*
     * IMPORTANT:
     *
     * Do NOT manually set:
     *
     * Content-Type: multipart/form-data
     *
     * Axios/browser will automatically
     * create the correct multipart boundary.
     */

    await API.post(
      "/gallery",
      data
    );
  };


  // ======================================
  // UPDATE GALLERY ITEM
  // ======================================

  const updateGalleryItem = async () => {

    const data =
      new FormData();

    data.append(
      "title",
      formData.title.trim()
    );

    data.append(
      "category",
      formData.category
    );

    data.append(
      "type",
      formData.type
    );

    data.append(
      "description",
      formData.description.trim()
    );

    data.append(
      "order",
      String(
        Number(formData.order) ||
        editingItem?.order ||
        1
      )
    );

    if (formData.file) {

      data.append(
        "file",
        formData.file
      );
    }

    await API.put(
      `/gallery/${editingItem.id}`,
      data
    );
  };


  // ======================================
  // SUBMIT FORM
  // ======================================

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

      if (editingItem) {

        await updateGalleryItem();

      } else {

        await createGalleryItem();

      }

      await fetchGallery();

      closeModal();

    } catch (requestError) {

      console.error(
        "SAVE GALLERY ERROR:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
        "Unable to save gallery item."
      );

    } finally {

      setSaving(false);

    }
  };


  // ======================================
  // DELETE ITEM
  // ======================================

  const handleDelete = async (
    id
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this gallery item?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setDeleting(true);
      setError("");

      await API.delete(
        `/gallery/${id}`
      );

      setGalleryItems(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== id
          )
      );

      setSelectedItems(
        (previous) =>
          previous.filter(
            (itemId) =>
              itemId !== id
          )
      );

    } catch (requestError) {

      console.error(
        "DELETE GALLERY ERROR:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
        "Unable to delete gallery item."
      );

    } finally {

      setDeleting(false);

    }
  };


  // ======================================
  // SELECT ITEM
  // ======================================

  const toggleSelectItem = (
    id
  ) => {

    setSelectedItems(
      (previous) => {

        if (
          previous.includes(id)
        ) {

          return previous.filter(
            (itemId) =>
              itemId !== id
          );
        }

        return [
          ...previous,
          id
        ];
      }
    );
  };


  // ======================================
  // SELECT ALL
  // ======================================

  const toggleSelectAll = () => {

    if (
      selectedItems.length ===
      filteredItems.length
    ) {

      setSelectedItems([]);

      return;
    }

    setSelectedItems(
      filteredItems.map(
        (item) =>
          item.id
      )
    );
  };


  // ======================================
  // DELETE SELECTED
  // ======================================

  const deleteSelected =
    async () => {

      if (
        selectedItems.length ===
        0
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          `Delete ${selectedItems.length} selected item(s)?`
        );

      if (!confirmed) {
        return;
      }

      try {

        setDeleting(true);
        setError("");

        await Promise.all(
          selectedItems.map(
            (id) =>
              API.delete(
                `/gallery/${id}`
              )
          )
        );

        setGalleryItems(
          (previous) =>
            previous.filter(
              (item) =>
                !selectedItems.includes(
                  item.id
                )
            )
        );

        setSelectedItems([]);

      } catch (requestError) {

        console.error(
          "DELETE SELECTED ERROR:",
          requestError
        );

        setError(
          requestError.response?.data?.message ||
          "Unable to delete selected items."
        );

      } finally {

        setDeleting(false);

      }
    };


  // ======================================
  // LOADING
  // ======================================

  if (loading) {

    return (
      <div className="admin-page">

        <div className="admin-page-header">

          <div>

            <h1>
              Gallery Management
            </h1>

            <p>
              Manage images, videos and
              media displayed on your
              website.
            </p>

          </div>

        </div>

        <div className="admin-empty-state">

          <ImageIcon size={45} />

          <h3>
            Loading gallery...
          </h3>

          <p>
            Fetching your media
            from the server.
          </p>

        </div>

      </div>
    );
  }


  // ======================================
  // RENDER
  // ======================================

  return (
    <div className="admin-page">

      {/* ==================================
          HEADER
      ================================== */}

      <div className="admin-page-header">

        <div>

          <h1>
            Gallery Management
          </h1>

          <p>
            Manage images, videos and
            media displayed on your
            website.
          </p>

        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={
            openAddModal
          }
        >
          <Plus size={18} />

          Add New Media
        </button>

      </div>


      {/* ==================================
          ERROR
      ================================== */}

      {error && (

        <div className="admin-alert admin-alert-error">

          {error}

        </div>

      )}


      {/* ==================================
          TOOLBAR
      ================================== */}

      <div className="admin-toolbar">

        <div className="admin-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search gallery..."
            value={
              searchTerm
            }
            onChange={
              (event) =>
                setSearchTerm(
                  event.target.value
                )
            }
          />

        </div>


        <select
          className="admin-filter"
          value={
            categoryFilter
          }
          onChange={
            (event) =>
              setCategoryFilter(
                event.target.value
              )
          }
        >

          {categories.map(
            (category) => (

              <option
                key={category}
                value={category}
              >
                {category}
              </option>

            )
          )}

        </select>


        {selectedItems.length >
          0 && (

          <button
            type="button"
            className="btn-danger"
            onClick={
              deleteSelected
            }
            disabled={
              deleting
            }
          >

            <Trash2 size={16} />

            {deleting
              ? "Deleting..."
              : `Delete Selected (${selectedItems.length})`}

          </button>

        )}

      </div>


      {/* ==================================
          SELECT ALL
      ================================== */}

      {filteredItems.length >
        0 && (

        <div className="gallery-select-all">

          <label>

            <input
              type="checkbox"
              checked={
                selectedItems.length ===
                  filteredItems.length
              }
              onChange={
                toggleSelectAll
              }
            />

            Select All

          </label>

          <span>

            {filteredItems.length}{" "}

            {filteredItems.length ===
            1
              ? "item"
              : "items"}

          </span>

        </div>

      )}


      {/* ==================================
          GALLERY
      ================================== */}

      {filteredItems.length >
      0 ? (

        <div className="admin-gallery-grid">

          {filteredItems.map(
            (item) => (

              <article
                className="admin-gallery-card"
                key={item.id}
              >

                {/* MEDIA */}

                <div className="admin-gallery-media">

                  {item.type ===
                  "video" ? (

                    <video
                      src={item.src}
                      muted
                      preload="metadata"
                    />

                  ) : (

                    <img
                      src={item.src}
                      alt={
                        item.title
                      }
                      loading="lazy"
                      onError={() =>
                        console.error(
                          "IMAGE FAILED TO LOAD:",
                          item.src
                        )
                      }
                    />

                  )}


                  <div className="admin-gallery-type">

                    {item.type ===
                    "video" ? (
                      <Video
                        size={14}
                      />
                    ) : (
                      <ImageIcon
                        size={14}
                      />
                    )}

                    {item.type}

                  </div>


                  <label className="gallery-checkbox">

                    <input
                      type="checkbox"
                      checked={selectedItems.includes(
                        item.id
                      )}
                      onChange={() =>
                        toggleSelectItem(
                          item.id
                        )
                      }
                    />

                  </label>

                </div>


                {/* CONTENT */}

                <div className="admin-gallery-content">

                  <span className="admin-category-badge">

                    {item.category}

                  </span>


                  <h3>
                    {item.title}
                  </h3>


                  <p>
                    {item.description}
                  </p>


                  <div className="admin-gallery-meta">

                    <span>

                      Added:{" "}

                      {item.date ||
                        "—"}

                    </span>

                    <span>

                      Order:{" "}

                      {item.order ??
                        "—"}

                    </span>

                  </div>


                  {/* ACTIONS */}

                  <div className="admin-gallery-actions">

                    <button
                      type="button"
                      className="admin-action-view"
                      onClick={() =>
                        setPreviewItem(
                          item
                        )
                      }
                      title="View"
                    >
                      <Eye
                        size={17}
                      />
                    </button>


                    <button
                      type="button"
                      className="admin-action-edit"
                      onClick={() =>
                        openEditModal(
                          item
                        )
                      }
                      title="Edit"
                    >
                      <Edit
                        size={17}
                      />
                    </button>


                    <button
                      type="button"
                      className="admin-action-delete"
                      onClick={() =>
                        handleDelete(
                          item.id
                        )
                      }
                      title="Delete"
                      disabled={
                        deleting
                      }
                    >
                      <Trash2
                        size={17}
                      />
                    </button>

                  </div>

                </div>

              </article>

            )
          )}

        </div>

      ) : (

        <div className="admin-empty-state">

          <ImageIcon size={45} />

          <h3>
            No gallery items found
          </h3>

          <p>

            {galleryItems.length ===
            0
              ? "Your gallery is currently empty. Add your first media item."
              : "Try changing your search or category filter."}

          </p>

          <button
            type="button"
            className="btn-primary"
            onClick={
              openAddModal
            }
          >

            <Plus size={17} />

            Add New Media

          </button>

        </div>

      )}


      {/* ==================================
          ADD / EDIT MODAL
      ================================== */}

      {modalOpen && (

        <div
          className="modal-overlay"
          onClick={closeModal}
        >

          <div
            className="modal-content admin-gallery-modal"
            onClick={
              (event) =>
                event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <h2>

                  {editingItem
                    ? "Edit Gallery Item"
                    : "Add New Media"}

                </h2>

                <p>

                  {editingItem
                    ? "Update this gallery item."
                    : "Add new media to your gallery."}

                </p>

              </div>


              <button
                type="button"
                className="modal-close"
                onClick={
                  closeModal
                }
                disabled={
                  saving
                }
                aria-label="Close modal"
              >
                <X size={22} />
              </button>

            </div>


            {/* FORM */}

            <form
              className="admin-form"
              onSubmit={
                handleSubmit
              }
            >

              {/* TITLE */}

              <div className="form-group">

                <label
                  className="form-label"
                  htmlFor="gallery-title"
                >
                  Title
                </label>

                <input
                  id="gallery-title"
                  type="text"
                  name="title"
                  className="form-input"
                  placeholder="Enter media title"
                  value={
                    formData.title
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              {/* CATEGORY */}

              <div className="form-group">

                <label
                  className="form-label"
                  htmlFor="gallery-category"
                >
                  Category
                </label>

                <select
                  id="gallery-category"
                  name="category"
                  className="form-input"
                  value={
                    formData.category
                  }
                  onChange={
                    handleChange
                  }
                >

                  {formCategories.map(
                    (category) => (

                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* MEDIA TYPE */}

              <div className="form-group">

                <label className="form-label">
                  Media Type
                </label>

                <div className="admin-radio-group">

                  <label>

                    <input
                      type="radio"
                      name="type"
                      value="image"
                      checked={
                        formData.type ===
                        "image"
                      }
                      onChange={
                        handleChange
                      }
                    />

                    Image

                  </label>


                  <label>

                    <input
                      type="radio"
                      name="type"
                      value="video"
                      checked={
                        formData.type ===
                        "video"
                      }
                      onChange={
                        handleChange
                      }
                    />

                    Video

                  </label>

                </div>

              </div>


              {/* DESCRIPTION */}

              <div className="form-group">

                <label
                  className="form-label"
                  htmlFor="gallery-description"
                >
                  Description
                </label>

                <textarea
                  id="gallery-description"
                  name="description"
                  className="form-input"
                  rows="5"
                  placeholder="Describe this media..."
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              {/* FILE */}

              <div className="form-group">

                <label className="form-label">

                  Media File

                </label>


                <div
                  className="admin-upload-box"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={
                    (event) => {

                      if (
                        event.key ===
                          "Enter" ||
                        event.key ===
                          " "
                      ) {

                        fileInputRef.current?.click();

                      }

                    }
                  }
                >

                  <Upload size={30} />

                  <strong>

                    {editingItem
                      ? "Click to replace file"
                      : "Click to upload"}

                  </strong>

                  <span>

                    JPG, JPEG, PNG or MP4

                  </span>

                </div>


                <input
                  ref={
                    fileInputRef
                  }
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,video/mp4"
                  hidden
                  onChange={
                    handleFileChange
                  }
                />

              </div>


              {/* PREVIEW */}

              {formData.preview && (

                <div className="admin-upload-preview">

                  <span>
                    Preview
                  </span>


                  {formData.type ===
                  "video" ? (

                    <video
                      src={
                        formData.preview
                      }
                      controls
                    />

                  ) : (

                    <img
                      src={
                        formData.preview
                      }
                      alt="Upload preview"
                    />

                  )}

                </div>

              )}


              {/* ORDER */}

              <div className="form-group">

                <label
                  className="form-label"
                  htmlFor="gallery-order"
                >
                  Display Order
                </label>

                <input
                  id="gallery-order"
                  type="number"
                  name="order"
                  min="1"
                  className="form-input"
                  placeholder="1"
                  value={
                    formData.order
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              {/* BUTTONS */}

              <div className="admin-form-actions">

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={
                    closeModal
                  }
                  disabled={
                    saving
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="btn-primary"
                  disabled={
                    saving
                  }
                >

                  {saving
                    ? "Saving..."
                    : editingItem
                    ? "Update Media"
                    : "Save Media"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ==================================
          PREVIEW MODAL
      ================================== */}

      {previewItem && (

        <div
          className="modal-overlay"
          onClick={() =>
            setPreviewItem(null)
          }
        >

          <div
            className="modal-content gallery-preview-modal"
            onClick={
              (event) =>
                event.stopPropagation()
            }
          >

            <button
              type="button"
              className="modal-close"
              onClick={() =>
                setPreviewItem(null)
              }
              aria-label="Close preview"
            >
              <X size={22} />
            </button>


            <div className="gallery-preview-media">

              {previewItem.type ===
              "video" ? (

                <video
                  src={
                    previewItem.src
                  }
                  controls
                  autoPlay
                />

              ) : (

                <img
                  src={
                    previewItem.src
                  }
                  alt={
                    previewItem.title
                  }
                />

              )}

            </div>


            <div className="gallery-preview-info">

              <span className="admin-category-badge">

                {previewItem.category}

              </span>


              <h2>
                {previewItem.title}
              </h2>


              <p>
                {
                  previewItem.description
                }
              </p>


              <div className="admin-gallery-meta">

                <span>

                  Date:{" "}

                  {previewItem.date ||
                    "—"}

                </span>

                <span>

                  Order:{" "}

                  {previewItem.order ??
                    "—"}

                </span>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};


// ========================================
// EXPORT
// ========================================

export default AdminGallery;