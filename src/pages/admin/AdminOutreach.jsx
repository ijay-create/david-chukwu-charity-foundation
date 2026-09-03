import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import {
  Plus,
  Edit,
  Trash2,
  X,
  Search,
  Eye,
  Upload,
  Image as ImageIcon
} from "lucide-react";

import API from "../../api/axios";

import "../../styles/Admin.outreach.css";

// ============================================================
// IMAGE URL HELPER
// ============================================================

const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return "";
  }

  // Cloudinary / external URLs
  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("blob:")
  ) {
    return imageUrl;
  }

  // Legacy relative image paths
  const apiUrl =
    import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    console.warn(
      "VITE_API_URL is not configured."
    );

    return imageUrl;
  }

  const apiOrigin =
    apiUrl.replace(
      /\/api\/?$/,
      ""
    );

  return `${apiOrigin}${imageUrl}`;
};

// ============================================================
// CATEGORIES
// ============================================================

const categories = [
  "Widows Support",
  "Children Program",
  "Elderly Care",
  "Special Needs",
  "Community Outreach",
  "Humanitarian"
];

// ============================================================
// EMPTY FORM
// ============================================================

const emptyForm = {
  title: "",
  category: "Widows Support",
  description: "",
  date: "",
  location: "",
  peopleHelped: "",
  status: "Active",
  image: null,
  preview: ""
};

// ============================================================
// COMPONENT
// ============================================================

const AdminOutreach = () => {
  const [programs, setPrograms] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [viewProgram, setViewProgram] =
    useState(null);

  const [editingProgram, setEditingProgram] =
    useState(null);

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

  // ==========================================================
  // FETCH OUTREACH PROGRAMS
  // ==========================================================

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await API.get("/outreach");

      const data =
        Array.isArray(response.data)
          ? response.data
          : response.data?.programs ||
            response.data?.data ||
            [];

      const normalizedPrograms =
        data.map((program) => ({
          ...program,

          id:
            program._id ||
            program.id,

          image:
            getImageUrl(
              program.imageUrl
            ),

          peopleHelped:
            program.peopleHelped ?? 0,

          status:
            program.status ||
            "Active"
        }));

      setPrograms(
        normalizedPrograms
      );
    } catch (requestError) {
      console.error(
        "GET OUTREACH ERROR:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to load outreach programs."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchPrograms();
  }, []);

  // ==========================================================
  // SEARCH / FILTER
  // ==========================================================

  const filteredPrograms =
    useMemo(() => {
      const searchValue =
        search
          .toLowerCase()
          .trim();

      if (!searchValue) {
        return programs;
      }

      return programs.filter(
        (program) =>
          program.title
            ?.toLowerCase()
            .includes(searchValue) ||
          program.category
            ?.toLowerCase()
            .includes(searchValue) ||
          program.location
            ?.toLowerCase()
            .includes(searchValue) ||
          program.description
            ?.toLowerCase()
            .includes(searchValue)
      );
    }, [
      programs,
      search
    ]);

  // ==========================================================
  // OPEN ADD MODAL
  // ==========================================================

  const openAddModal = () => {
    setEditingProgram(null);

    setFormData({
      ...emptyForm
    });

    setError("");

    setShowModal(true);
  };

  // ==========================================================
  // OPEN EDIT MODAL
  // ==========================================================

  const openEditModal = (
    program
  ) => {
    setEditingProgram(program);

    const formattedDate =
      program.date
        ? new Date(
            program.date
          )
            .toISOString()
            .split("T")[0]
        : "";

    setFormData({
      title:
        program.title || "",

      category:
        program.category ||
        "Widows Support",

      description:
        program.description ||
        "",

      date:
        formattedDate,

      location:
        program.location ||
        "",

      peopleHelped:
        program.peopleHelped ??
        0,

      status:
        program.status ||
        "Active",

      image: null,

      preview:
        program.image ||
        getImageUrl(
          program.imageUrl
        )
    });

    setError("");

    setShowModal(true);
  };

  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);

    setEditingProgram(null);

    setFormData({
      ...emptyForm
    });

    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  };

  // ==========================================================
  // HANDLE INPUT CHANGE
  // ==========================================================

  const handleChange = (
    event
  ) => {
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

  // ==========================================================
  // HANDLE IMAGE CHANGE
  // ==========================================================

  const handleImageChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png"
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        "Only JPG, JPEG and PNG images are allowed."
      );

      event.target.value = "";

      return;
    }

    const maxSize =
      50 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Image size cannot exceed 50MB."
      );

      event.target.value = "";

      return;
    }

    const previewUrl =
      URL.createObjectURL(file);

    setFormData(
      (previous) => ({
        ...previous,
        image: file,
        preview: previewUrl
      })
    );

    setError("");
  };

  // ==========================================================
  // VALIDATE FORM
  // ==========================================================

  const validateForm = () => {
    if (
      !formData.title.trim()
    ) {
      setError(
        "Please enter a program title."
      );

      return false;
    }

    if (
      !formData.category
    ) {
      setError(
        "Please select a category."
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
      !formData.location.trim()
    ) {
      setError(
        "Please enter a location."
      );

      return false;
    }

    if (
      !editingProgram &&
      !formData.image
    ) {
      setError(
        "Please select an outreach image."
      );

      return false;
    }

    return true;
  };

  // ==========================================================
  // CREATE PROGRAM
  // ==========================================================

  const createProgram = async () => {
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
      "description",
      formData.description.trim()
    );

    data.append(
      "date",
      formData.date
    );

    data.append(
      "location",
      formData.location.trim()
    );

    data.append(
      "peopleHelped",
      String(
        Number(
          formData.peopleHelped
        ) || 0
      )
    );

    data.append(
      "status",
      formData.status
    );

    data.append(
      "image",
      formData.image
    );

    await API.post(
      "/outreach",
      data
    );
  };

  // ==========================================================
  // UPDATE PROGRAM
  // ==========================================================

  const updateProgram = async () => {
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
      "description",
      formData.description.trim()
    );

    data.append(
      "date",
      formData.date
    );

    data.append(
      "location",
      formData.location.trim()
    );

    data.append(
      "peopleHelped",
      String(
        Number(
          formData.peopleHelped
        ) || 0
      )
    );

    data.append(
      "status",
      formData.status
    );

    if (formData.image) {
      data.append(
        "image",
        formData.image
      );
    }

    await API.put(
      `/outreach/${editingProgram.id}`,
      data
    );
  };

  // ==========================================================
  // HANDLE FORM SUBMIT
  // ==========================================================

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

      if (editingProgram) {
        await updateProgram();
      } else {
        await createProgram();
      }

      await fetchPrograms();

      closeModal();
    } catch (requestError) {
      console.error(
        "SAVE OUTREACH ERROR:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to save outreach program."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // DELETE PROGRAM
  // ==========================================================

  const handleDelete = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this outreach program?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await API.delete(
        `/outreach/${id}`
      );

      setPrograms(
        (previous) =>
          previous.filter(
            (program) =>
              program.id !== id
          )
      );

      if (
        viewProgram?.id === id
      ) {
        setViewProgram(null);
      }
    } catch (requestError) {
      console.error(
        "DELETE OUTREACH ERROR:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to delete outreach program."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================================
  // TOGGLE STATUS
  // ==========================================================

  const toggleStatus = async (
    program
  ) => {
    const newStatus =
      program.status === "Active"
        ? "Inactive"
        : "Active";

    try {
      setError("");

      const data =
        new FormData();

      data.append(
        "title",
        program.title
      );

      data.append(
        "category",
        program.category
      );

      data.append(
        "description",
        program.description
      );

      data.append(
        "date",
        program.date
          ? new Date(
              program.date
            )
              .toISOString()
              .split("T")[0]
          : ""
      );

      data.append(
        "location",
        program.location
      );

      data.append(
        "peopleHelped",
        String(
          program.peopleHelped || 0
        )
      );

      data.append(
        "status",
        newStatus
      );

      await API.put(
        `/outreach/${program.id}`,
        data
      );

      setPrograms(
        (previous) =>
          previous.map(
            (item) =>
              item.id === program.id
                ? {
                    ...item,
                    status:
                      newStatus
                  }
                : item
          )
      );
    } catch (requestError) {
      console.error(
        "TOGGLE OUTREACH STATUS ERROR:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to update program status."
      );
    }
  };

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <div className="admin-page">

        <div className="admin-page-header">

          <div>
            <h1>
              Outreach Programs
            </h1>

            <p>
              Manage your charity foundation's
              outreach programs and projects.
            </p>
          </div>

        </div>

        <div className="admin-empty-state">

          <ImageIcon size={45} />

          <h3>
            Loading outreach programs...
          </h3>

          <p>
            Fetching programs from the server.
          </p>

        </div>

      </div>
    );
  }

  // ==========================================================
  // MAIN RENDER
  // ==========================================================

  return (
    <div className="admin-page">

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="admin-page-header">

        <div>
          <h1>
            Outreach Programs
          </h1>

          <p>
            Manage your charity foundation's
            outreach programs and projects.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={openAddModal}
        >
          <Plus size={18} />

          Add New Program
        </button>

      </div>

      {/* ======================================================
          ERROR MESSAGE
      ====================================================== */}

      {error && (
        <div className="admin-alert admin-alert-error">
          {error}
        </div>
      )}

      {/* ======================================================
          TOOLBAR
      ====================================================== */}

      <div className="admin-toolbar">

        <div className="admin-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search programs..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>

        <div className="admin-toolbar-count">

          {filteredPrograms.length}

          {" "}

          program
          {filteredPrograms.length !== 1
            ? "s"
            : ""}

        </div>

      </div>

      {/* ======================================================
          PROGRAM TABLE
      ====================================================== */}

      <div className="admin-table-wrapper">

        <table className="admin-table">

          <thead>

            <tr>
              <th>Program</th>
              <th>Category</th>
              <th>Date</th>
              <th>Location</th>
              <th>People Helped</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {filteredPrograms.length > 0 ? (
              filteredPrograms.map(
                (program) => (
                  <tr
                    key={program.id}
                  >

                    {/* PROGRAM */}

                    <td>

                      <div className="outreach-program-name">

                        <div className="outreach-table-image">

                          {program.image ? (
                            <img
                              src={
                                program.image
                              }
                              alt={
                                program.title
                              }
                            />
                          ) : (
                            <ImageIcon
                              size={22}
                            />
                          )}

                        </div>

                        <div>

                          <strong>
                            {program.title}
                          </strong>

                          <span>
                            {program.description?.length >
                            70
                              ? `${program.description.substring(
                                  0,
                                  70
                                )}...`
                              : program.description}
                          </span>

                        </div>

                      </div>

                    </td>

                    {/* CATEGORY */}

                    <td>

                      <span className="admin-category-badge">
                        {program.category}
                      </span>

                    </td>

                    {/* DATE */}

                    <td>
                      {program.date
                        ? new Date(
                            program.date
                          ).toLocaleDateString()
                        : "Not provided"}
                    </td>

                    {/* LOCATION */}

                    <td>
                      {program.location ||
                        "Not provided"}
                    </td>

                    {/* PEOPLE HELPED */}

                    <td>
                      {program.peopleHelped}
                    </td>

                    {/* STATUS */}

                    <td>

                      <button
                        type="button"
                        className={`admin-status-badge ${
                          program.status ===
                          "Active"
                            ? "active"
                            : "inactive"
                        }`}
                        onClick={() =>
                          toggleStatus(
                            program
                          )
                        }
                      >
                        {program.status}
                      </button>

                    </td>

                    {/* ACTIONS */}

                    <td>

                      <div className="admin-action-buttons">

                        <button
                          type="button"
                          className="admin-icon-btn view"
                          title="View"
                          onClick={() =>
                            setViewProgram(
                              program
                            )
                          }
                        >
                          <Eye
                            size={17}
                          />
                        </button>

                        <button
                          type="button"
                          className="admin-icon-btn edit"
                          title="Edit"
                          onClick={() =>
                            openEditModal(
                              program
                            )
                          }
                        >
                          <Edit
                            size={17}
                          />
                        </button>

                        <button
                          type="button"
                          className="admin-icon-btn delete"
                          title="Delete"
                          onClick={() =>
                            handleDelete(
                              program.id
                            )
                          }
                          disabled={
                            deleting
                          }
                        >
                          <Trash2
                            size={17}
                          />
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )
            ) : (
              <tr>

                <td
                  colSpan="7"
                  className="admin-empty-state"
                >
                  No outreach programs found.
                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>

      {/* ======================================================
          ADD / EDIT MODAL
      ====================================================== */}

      {showModal && (
        <div
          className="modal-overlay"
          onClick={closeModal}
        >

          <div
            className="modal-content admin-form-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="admin-modal-header">

              <div>

                <h2>
                  {editingProgram
                    ? "Edit Outreach Program"
                    : "Add New Outreach Program"}
                </h2>

                <p>
                  {editingProgram
                    ? "Update the details of this outreach program."
                    : "Add a new outreach program to your foundation."}
                </p>

              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={22} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
            >

              {/* TITLE */}

              <div className="form-group">

                <label className="form-label">
                  Program Title
                </label>

                <input
                  type="text"
                  name="title"
                  className="form-input"
                  placeholder="Enter program title"
                  value={
                    formData.title
                  }
                  onChange={
                    handleChange
                  }
                  disabled={saving}
                  required
                />

              </div>

              {/* CATEGORY */}

              <div className="form-group">

                <label className="form-label">
                  Category
                </label>

                <select
                  name="category"
                  className="form-input"
                  value={
                    formData.category
                  }
                  onChange={
                    handleChange
                  }
                  disabled={saving}
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

              </div>

              {/* DESCRIPTION */}

              <div className="form-group">

                <label className="form-label">
                  Description
                </label>

                <textarea
                  name="description"
                  className="form-input"
                  rows="5"
                  placeholder="Describe the outreach program..."
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  disabled={saving}
                  required
                />

              </div>

              {/* DATE + LOCATION */}

              <div className="admin-form-row">

                <div className="form-group">

                  <label className="form-label">
                    Date
                  </label>

                  <input
                    type="date"
                    name="date"
                    className="form-input"
                    value={
                      formData.date
                    }
                    onChange={
                      handleChange
                    }
                    disabled={saving}
                  />

                </div>

                <div className="form-group">

                  <label className="form-label">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    className="form-input"
                    placeholder="Lagos, Nigeria"
                    value={
                      formData.location
                    }
                    onChange={
                      handleChange
                    }
                    disabled={saving}
                    required
                  />

                </div>

              </div>

              {/* PEOPLE HELPED + STATUS */}

              <div className="admin-form-row">

                <div className="form-group">

                  <label className="form-label">
                    People Helped
                  </label>

                  <input
                    type="number"
                    name="peopleHelped"
                    className="form-input"
                    min="0"
                    placeholder="0"
                    value={
                      formData.peopleHelped
                    }
                    onChange={
                      handleChange
                    }
                    disabled={saving}
                  />

                </div>

                <div className="form-group">

                  <label className="form-label">
                    Status
                  </label>

                  <select
                    name="status"
                    className="form-input"
                    value={
                      formData.status
                    }
                    onChange={
                      handleChange
                    }
                    disabled={saving}
                  >

                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                  </select>

                </div>

              </div>

              {/* IMAGE UPLOAD */}

              <div className="form-group">

                <label className="form-label">
                  Outreach Image
                </label>

                <div
                  className="admin-upload-box"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {

                    if (
                      event.key ===
                        "Enter" ||
                      event.key === " "
                    ) {
                      fileInputRef.current?.click();
                    }

                  }}
                >

                  <Upload size={30} />

                  <strong>
                    {editingProgram
                      ? "Click to replace image"
                      : "Click to upload image"}
                  </strong>

                  <span>
                    JPG, JPEG or PNG
                  </span>

                </div>

                <input
                  ref={
                    fileInputRef
                  }
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  hidden
                  onChange={
                    handleImageChange
                  }
                />

              </div>

              {/* IMAGE PREVIEW */}

              {formData.preview && (
                <div className="admin-upload-preview">

                  <span>
                    Image Preview
                  </span>

                  <img
                    src={
                      formData.preview
                    }
                    alt="Outreach preview"
                  />

                </div>
              )}

              {/* FORM ACTIONS */}

              <div className="admin-form-actions">

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingProgram
                    ? "Update Program"
                    : "Create Program"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ======================================================
          VIEW PROGRAM MODAL
      ====================================================== */}

      {viewProgram && (
        <div
          className="modal-overlay"
          onClick={() =>
            setViewProgram(null)
          }
        >

          <div
            className="modal-content outreach-view-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="admin-modal-header">

              <div>

                <span className="admin-category-badge">
                  {viewProgram.category}
                </span>

                <h2>
                  {viewProgram.title}
                </h2>

              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() =>
                  setViewProgram(null)
                }
              >
                <X size={22} />
              </button>

            </div>

            {/* IMAGE */}

            {viewProgram.image && (
              <div className="outreach-view-image">

                <img
                  src={
                    viewProgram.image
                  }
                  alt={
                    viewProgram.title
                  }
                />

              </div>
            )}

            {/* DETAILS */}

            <div className="outreach-details">

              <div className="outreach-detail-item">

                <span>
                  Date
                </span>

                <strong>
                  {viewProgram.date
                    ? new Date(
                        viewProgram.date
                      ).toLocaleDateString()
                    : "Not provided"}
                </strong>

              </div>

              <div className="outreach-detail-item">

                <span>
                  Location
                </span>

                <strong>
                  {viewProgram.location ||
                    "Not provided"}
                </strong>

              </div>

              <div className="outreach-detail-item">

                <span>
                  People Helped
                </span>

                <strong>
                  {viewProgram.peopleHelped}
                </strong>

              </div>

              <div className="outreach-detail-item">

                <span>
                  Status
                </span>

                <strong>
                  {viewProgram.status}
                </strong>

              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="outreach-description">

              <h3>
                Program Description
              </h3>

              <p>
                {viewProgram.description}
              </p>

            </div>

            {/* ACTIONS */}

            <div className="admin-form-actions">

              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  setViewProgram(null)
                }
              >
                Close
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setViewProgram(null);

                  openEditModal(
                    viewProgram
                  );
                }}
              >
                <Edit size={17} />

                Edit Program
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminOutreach;