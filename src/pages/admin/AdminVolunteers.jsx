import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Users,
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  MessageSquare,
  FileText,
  Check,
  X,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  AlertCircle,
  Clock,
  UserCheck,
  UserX,
  HeartHandshake,
  XCircle,
  Save,
} from "lucide-react";

import API from "../../api/axios";

import "../../styles/Admin.volunteers.css";


/*
|--------------------------------------------------------------------------
| CONSTANTS
|--------------------------------------------------------------------------
*/

const STATUS_OPTIONS = [
  "all",
  "pending",
  "approved",
  "rejected",
];


const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  interests: "",
  availability: "",
  message: "",
  status: "pending",
  notes: "",
};


/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const formatDate = (date) => {

  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString(
    "en-NG",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


const formatDateTime = (date) => {

  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleString(
    "en-NG",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};


const getVolunteerName = (volunteer) => {

  return [
    volunteer?.firstName,
    volunteer?.lastName,
  ]
    .filter(Boolean)
    .join(" ");
};


const normalizeInterests = (interests) => {

  if (!Array.isArray(interests)) {
    return [];
  }

  return interests.filter(Boolean);
};


/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const AdminVolunteers = () => {

  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [volunteers, setVolunteers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selectedVolunteer, setSelectedVolunteer] =
    useState(null);

  const [editingVolunteer, setEditingVolunteer] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState(EMPTY_FORM);


  /*
  |--------------------------------------------------------------------------
  | FETCH VOLUNTEERS
  |--------------------------------------------------------------------------
  */

  const fetchVolunteers = async (
    showRefreshState = false
  ) => {

    try {

      if (showRefreshState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await API.get(
          "/volunteers"
        );

      const data =
        response.data?.data;


      if (Array.isArray(data)) {

        setVolunteers(data);

      } else {

        setVolunteers([]);

      }

    } catch (error) {

      console.error(
        "FETCH VOLUNTEERS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to load volunteer applications."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    fetchVolunteers();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | FILTER VOLUNTEERS
  |--------------------------------------------------------------------------
  */

  const filteredVolunteers =
    useMemo(() => {

      const search =
        searchTerm
          .trim()
          .toLowerCase();


      return volunteers.filter(
        (volunteer) => {

          const fullName =
            getVolunteerName(
              volunteer
            ).toLowerCase();

          const email =
            volunteer.email
              ?.toLowerCase() || "";

          const phone =
            volunteer.phone
              ?.toLowerCase() || "";

          const location =
            volunteer.location
              ?.toLowerCase() || "";

          const interests =
            normalizeInterests(
              volunteer.interests
            )
              .join(" ")
              .toLowerCase();


          const matchesSearch =
            !search ||
            fullName.includes(search) ||
            email.includes(search) ||
            phone.includes(search) ||
            location.includes(search) ||
            interests.includes(search);


          const matchesStatus =
            statusFilter === "all" ||
            volunteer.status ===
              statusFilter;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      volunteers,
      searchTerm,
      statusFilter,
    ]);


  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const statistics =
    useMemo(() => {

      return {
        total:
          volunteers.length,

        pending:
          volunteers.filter(
            (volunteer) =>
              volunteer.status ===
              "pending"
          ).length,

        approved:
          volunteers.filter(
            (volunteer) =>
              volunteer.status ===
              "approved"
          ).length,

        rejected:
          volunteers.filter(
            (volunteer) =>
              volunteer.status ===
              "rejected"
          ).length,
      };

    }, [volunteers]);


  /*
  |--------------------------------------------------------------------------
  | OPEN VIEW
  |--------------------------------------------------------------------------
  */

  const handleView = (
    volunteer
  ) => {

    setSelectedVolunteer(
      volunteer
    );

    setEditingVolunteer(
      null
    );

  };


  /*
  |--------------------------------------------------------------------------
  | CLOSE VIEW
  |--------------------------------------------------------------------------
  */

  const handleCloseView = () => {

    setSelectedVolunteer(
      null
    );

  };


  /*
  |--------------------------------------------------------------------------
  | OPEN EDIT
  |--------------------------------------------------------------------------
  */

  const handleEdit = (
    volunteer
  ) => {

    setEditingVolunteer(
      volunteer
    );

    setSelectedVolunteer(
      null
    );


    setForm({
      firstName:
        volunteer.firstName ||
        "",

      lastName:
        volunteer.lastName ||
        "",

      email:
        volunteer.email ||
        "",

      phone:
        volunteer.phone ||
        "",

      location:
        volunteer.location ||
        "",

      interests:
        normalizeInterests(
          volunteer.interests
        ).join(", "),

      availability:
        volunteer.availability ||
        "",

      message:
        volunteer.message ||
        "",

      status:
        volunteer.status ||
        "pending",

      notes:
        volunteer.notes ||
        "",
    });

  };


  /*
  |--------------------------------------------------------------------------
  | CLOSE EDIT
  |--------------------------------------------------------------------------
  */

  const handleCloseEdit = () => {

    if (saving) {
      return;
    }

    setEditingVolunteer(
      null
    );

    setForm(
      EMPTY_FORM
    );

  };


  /*
  |--------------------------------------------------------------------------
  | FORM CHANGE
  |--------------------------------------------------------------------------
  */

  const handleFormChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

  };


  /*
  |--------------------------------------------------------------------------
  | UPDATE VOLUNTEER
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    if (!editingVolunteer) {
      return;
    }


    setError("");
    setSuccess("");


    const volunteerId =
      editingVolunteer._id ||
      editingVolunteer.id;


    if (!volunteerId) {

      setError(
        "Unable to identify this volunteer."
      );

      return;

    }


    try {

      setSaving(true);


      const interests =
        form.interests
          .split(",")
          .map(
            (interest) =>
              interest.trim()
          )
          .filter(Boolean);


      const payload = {
        firstName:
          form.firstName.trim(),

        lastName:
          form.lastName.trim(),

        email:
          form.email
            .trim()
            .toLowerCase(),

        phone:
          form.phone.trim(),

        location:
          form.location.trim(),

        interests,

        availability:
          form.availability.trim(),

        message:
          form.message.trim(),

        status:
          form.status,

        notes:
          form.notes.trim(),
      };


      const response =
        await API.put(
          `/volunteers/${volunteerId}`,
          payload
        );


      setSuccess(
        response.data?.message ||
        "Volunteer updated successfully."
      );


      await fetchVolunteers(
        true
      );


      setEditingVolunteer(
        null
      );

      setForm(
        EMPTY_FORM
      );

    } catch (error) {

      console.error(
        "UPDATE VOLUNTEER ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to update volunteer."
      );

    } finally {

      setSaving(false);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | QUICK STATUS UPDATE
  |--------------------------------------------------------------------------
  */

  const handleStatusChange = async (
    volunteer,
    status
  ) => {

    const volunteerId =
      volunteer._id ||
      volunteer.id;


    if (!volunteerId) {
      return;
    }


    setError("");
    setSuccess("");


    try {

      const response =
        await API.put(
          `/volunteers/${volunteerId}`,
          {
            status,
          }
        );


      setSuccess(
        response.data?.message ||
        `Volunteer marked as ${status}.`
      );


      await fetchVolunteers(
        true
      );


      if (
        selectedVolunteer &&
        (
          selectedVolunteer._id ||
          selectedVolunteer.id
        ) === volunteerId
      ) {

        setSelectedVolunteer(
          response.data?.data ||
          null
        );

      }

    } catch (error) {

      console.error(
        "UPDATE VOLUNTEER STATUS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to update volunteer status."
      );

    }

  };


  /*
  |--------------------------------------------------------------------------
  | DELETE VOLUNTEER
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (
    volunteer
  ) => {

    const volunteerId =
      volunteer._id ||
      volunteer.id;


    if (!volunteerId) {
      return;
    }


    const volunteerName =
      getVolunteerName(
        volunteer
      );


    const confirmed =
      window.confirm(
        `Are you sure you want to permanently delete the volunteer application from ${volunteerName || "this volunteer"}?`
      );


    if (!confirmed) {
      return;
    }


    try {

      setDeletingId(
        volunteerId
      );

      setError("");
      setSuccess("");


      const response =
        await API.delete(
          `/volunteers/${volunteerId}`
        );


      setSuccess(
        response.data?.message ||
        "Volunteer deleted successfully."
      );


      setVolunteers(
        (previous) =>
          previous.filter(
            (item) =>
              (
                item._id ||
                item.id
              ) !== volunteerId
          )
      );


      if (
        selectedVolunteer &&
        (
          selectedVolunteer._id ||
          selectedVolunteer.id
        ) === volunteerId
      ) {

        setSelectedVolunteer(
          null
        );

      }

    } catch (error) {

      console.error(
        "DELETE VOLUNTEER ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to delete volunteer."
      );

    } finally {

      setDeletingId(
        null
      );

    }

  };


  /*
  |--------------------------------------------------------------------------
  | STATUS LABEL
  |--------------------------------------------------------------------------
  */

  const getStatusLabel = (
    status
  ) => {

    if (status === "approved") {
      return "Approved";
    }

    if (status === "rejected") {
      return "Rejected";
    }

    return "Pending";

  };


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <section className="admin-volunteers">


      {/* ================================================================
          PAGE HEADER
      ================================================================ */}

      <header className="admin-volunteers-header">

        <div className="admin-volunteers-heading">

          <span className="admin-volunteers-eyebrow">
            VOLUNTEERS
          </span>

          <h1>
            Volunteer Applications
          </h1>

          <p>
            Review, manage and respond to
            people who have offered to support
            the foundation as volunteers.
          </p>

        </div>


        <button
          type="button"
          className="admin-volunteers-refresh"
          onClick={() =>
            fetchVolunteers(true)
          }
          disabled={
            loading ||
            refreshing ||
            saving
          }
        >

          <RefreshCw
            size={18}
            className={
              loading ||
              refreshing
                ? "admin-volunteer-spin"
                : ""
            }
          />

          Refresh

        </button>

      </header>


      {/* ================================================================
          ALERTS
      ================================================================ */}

      {error && (

        <div className="admin-volunteer-alert error">

          <AlertCircle size={19} />

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            aria-label="Dismiss error"
          >

            <X size={17} />

          </button>

        </div>

      )}


      {success && (

        <div className="admin-volunteer-alert success">

          <Check size={19} />

          <span>
            {success}
          </span>

          <button
            type="button"
            onClick={() =>
              setSuccess("")
            }
            aria-label="Dismiss success message"
          >

            <X size={17} />

          </button>

        </div>

      )}


      {/* ================================================================
          STATISTICS
      ================================================================ */}

      <div className="admin-volunteer-stats">


        <div className="admin-volunteer-stat-card">

          <div className="admin-volunteer-stat-icon total">

            <Users size={22} />

          </div>

          <div>

            <span>
              Total Volunteers
            </span>

            <strong>
              {statistics.total}
            </strong>

          </div>

        </div>


        <div className="admin-volunteer-stat-card">

          <div className="admin-volunteer-stat-icon pending">

            <Clock size={22} />

          </div>

          <div>

            <span>
              Pending
            </span>

            <strong>
              {statistics.pending}
            </strong>

          </div>

        </div>


        <div className="admin-volunteer-stat-card">

          <div className="admin-volunteer-stat-icon approved">

            <UserCheck size={22} />

          </div>

          <div>

            <span>
              Approved
            </span>

            <strong>
              {statistics.approved}
            </strong>

          </div>

        </div>


        <div className="admin-volunteer-stat-card">

          <div className="admin-volunteer-stat-icon rejected">

            <UserX size={22} />

          </div>

          <div>

            <span>
              Rejected
            </span>

            <strong>
              {statistics.rejected}
            </strong>

          </div>

        </div>

      </div>


      {/* ================================================================
          MAIN LIST
      ================================================================ */}

      <div className="admin-volunteer-panel">


        {/* ==============================================================
            PANEL HEADER
        ============================================================== */}

        <div className="admin-volunteer-panel-header">

          <div>

            <span className="admin-volunteer-section-label">
              APPLICATIONS
            </span>

            <h2>
              Volunteer Applications
            </h2>

            <p>
              Review submitted volunteer
              applications and manage their
              status.
            </p>

          </div>


          <div className="admin-volunteer-total">

            <strong>
              {filteredVolunteers.length}
            </strong>

            <span>
              Showing
            </span>

          </div>

        </div>


        {/* ==============================================================
            FILTER BAR
        ============================================================== */}

        <div className="admin-volunteer-toolbar">


          <div className="admin-volunteer-search">

            <Search size={18} />

            <input
              type="search"
              placeholder="Search volunteers..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

            {searchTerm && (

              <button
                type="button"
                onClick={() =>
                  setSearchTerm("")
                }
                aria-label="Clear search"
              >

                <X size={16} />

              </button>

            )}

          </div>


          <div className="admin-volunteer-filter">

            <Filter size={17} />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >

              <option value="all">
                All Statuses
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="rejected">
                Rejected
              </option>

            </select>

            <ChevronDown size={16} />

          </div>

        </div>


        {/* ==============================================================
            LOADING
        ============================================================== */}

        {loading && (

          <div className="admin-volunteer-state">

            <RefreshCw
              size={30}
              className="admin-volunteer-spin"
            />

            <h3>
              Loading volunteer applications...
            </h3>

            <p>
              Please wait while we retrieve
              the applications.
            </p>

          </div>

        )}


        {/* ==============================================================
            EMPTY
        ============================================================== */}

        {!loading &&
          filteredVolunteers.length === 0 && (

          <div className="admin-volunteer-state">

            <div className="admin-volunteer-empty-icon">

              <HeartHandshake size={34} />

            </div>

            <h3>
              {volunteers.length === 0
                ? "No volunteer applications yet"
                : "No matching volunteers"}
            </h3>

            <p>

              {volunteers.length === 0
                ? "Volunteer applications will appear here when people submit the volunteer form."
                : "Try changing your search term or status filter."}

            </p>

          </div>

        )}


        {/* ==============================================================
            DESKTOP TABLE
        ============================================================== */}

        {!loading &&
          filteredVolunteers.length > 0 && (

          <div className="admin-volunteer-table-wrapper">

            <table className="admin-volunteer-table">

              <thead>

                <tr>

                  <th>
                    Volunteer
                  </th>

                  <th>
                    Contact
                  </th>

                  <th>
                    Location
                  </th>

                  <th>
                    Interests
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Applied
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredVolunteers.map(
                  (volunteer) => {

                    const volunteerId =
                      volunteer._id ||
                      volunteer.id;


                    const interests =
                      normalizeInterests(
                        volunteer.interests
                      );


                    return (

                      <tr
                        key={
                          volunteerId
                        }
                      >


                        {/* =================================================
                            VOLUNTEER
                        ================================================= */}

                        <td>

                          <div className="admin-volunteer-person">

                            <div className="admin-volunteer-avatar">

                              <User size={19} />

                            </div>

                            <div>

                              <strong>
                                {getVolunteerName(
                                  volunteer
                                ) ||
                                  "Unnamed Volunteer"}
                              </strong>

                              <span>
                                Volunteer
                              </span>

                            </div>

                          </div>

                        </td>


                        {/* =================================================
                            CONTACT
                        ================================================= */}

                        <td>

                          <div className="admin-volunteer-contact">

                            <span>

                              <Mail size={14} />

                              {volunteer.email ||
                                "—"}

                            </span>

                            <span>

                              <Phone size={14} />

                              {volunteer.phone ||
                                "—"}

                            </span>

                          </div>

                        </td>


                        {/* =================================================
                            LOCATION
                        ================================================= */}

                        <td>

                          <div className="admin-volunteer-location">

                            <MapPin size={15} />

                            <span>
                              {volunteer.location ||
                                "Not provided"}
                            </span>

                          </div>

                        </td>


                        {/* =================================================
                            INTERESTS
                        ================================================= */}

                        <td>

                          <div className="admin-volunteer-interests">

                            {interests.length > 0 ? (

                              interests
                                .slice(
                                  0,
                                  2
                                )
                                .map(
                                  (
                                    interest,
                                    index
                                  ) => (

                                    <span
                                      key={`${interest}-${index}`}
                                    >
                                      {interest}
                                    </span>

                                  )
                                )

                            ) : (

                              <span className="no-data">
                                Not specified
                              </span>

                            )}

                            {interests.length >
                              2 && (

                              <small>
                                +{interests.length - 2}
                              </small>

                            )}

                          </div>

                        </td>


                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <td>

                          <span
                            className={
                              `admin-volunteer-status ${volunteer.status || "pending"}`
                            }
                          >

                            {volunteer.status ===
                              "approved" && (
                              <Check size={13} />
                            )}

                            {volunteer.status ===
                              "rejected" && (
                              <X size={13} />
                            )}

                            {(!volunteer.status ||
                              volunteer.status ===
                                "pending") && (
                              <Clock size={13} />
                            )}

                            {getStatusLabel(
                              volunteer.status
                            )}

                          </span>

                        </td>


                        {/* =================================================
                            DATE
                        ================================================= */}

                        <td>

                          <span className="admin-volunteer-date">

                            {formatDate(
                              volunteer.createdAt
                            )}

                          </span>

                        </td>


                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <td>

                          <div className="admin-volunteer-actions">

                            <button
                              type="button"
                              className="view"
                              onClick={() =>
                                handleView(
                                  volunteer
                                )
                              }
                              title="View volunteer"
                              aria-label="View volunteer"
                            >

                              <Eye size={16} />

                            </button>


                            <button
                              type="button"
                              className="edit"
                              onClick={() =>
                                handleEdit(
                                  volunteer
                                )
                              }
                              title="Edit volunteer"
                              aria-label="Edit volunteer"
                            >

                              <Pencil size={16} />

                            </button>


                            <button
                              type="button"
                              className="delete"
                              onClick={() =>
                                handleDelete(
                                  volunteer
                                )
                              }
                              disabled={
                                deletingId ===
                                volunteerId
                              }
                              title="Delete volunteer"
                              aria-label="Delete volunteer"
                            >

                              {deletingId ===
                              volunteerId ? (

                                <RefreshCw
                                  size={16}
                                  className="admin-volunteer-spin"
                                />

                              ) : (

                                <Trash2
                                  size={16}
                                />

                              )}

                            </button>

                          </div>

                        </td>

                      </tr>

                    );

                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ================================================================
          VIEW MODAL
      ================================================================ */}

      {selectedVolunteer && (

        <div
          className="admin-volunteer-modal-overlay"
          onMouseDown={(
            event
          ) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              handleCloseView();

            }

          }}
        >

          <div className="admin-volunteer-modal">


            <button
              type="button"
              className="admin-volunteer-modal-close"
              onClick={
                handleCloseView
              }
              aria-label="Close volunteer details"
            >

              <X size={20} />

            </button>


            <div className="admin-volunteer-modal-header">

              <div className="admin-volunteer-modal-avatar">

                <User size={30} />

              </div>

              <div>

                <span>
                  VOLUNTEER APPLICATION
                </span>

                <h2>
                  {getVolunteerName(
                    selectedVolunteer
                  ) ||
                    "Unnamed Volunteer"}
                </h2>

                <p>
                  Submitted{" "}
                  {formatDateTime(
                    selectedVolunteer.createdAt
                  )}
                </p>

              </div>

            </div>


            <div className="admin-volunteer-modal-status-row">

              <span
                className={
                  `admin-volunteer-status ${selectedVolunteer.status || "pending"}`
                }
              >

                {selectedVolunteer.status ===
                  "approved" && (
                  <Check size={14} />
                )}

                {selectedVolunteer.status ===
                  "rejected" && (
                  <X size={14} />
                )}

                {(!selectedVolunteer.status ||
                  selectedVolunteer.status ===
                    "pending") && (
                  <Clock size={14} />
                )}

                {getStatusLabel(
                  selectedVolunteer.status
                )}

              </span>

            </div>


            <div className="admin-volunteer-detail-grid">


              <div className="admin-volunteer-detail-box">

                <Mail size={18} />

                <div>

                  <span>
                    Email
                  </span>

                  <strong>
                    {selectedVolunteer.email ||
                      "Not provided"}
                  </strong>

                </div>

              </div>


              <div className="admin-volunteer-detail-box">

                <Phone size={18} />

                <div>

                  <span>
                    Phone
                  </span>

                  <strong>
                    {selectedVolunteer.phone ||
                      "Not provided"}
                  </strong>

                </div>

              </div>


              <div className="admin-volunteer-detail-box">

                <MapPin size={18} />

                <div>

                  <span>
                    Location
                  </span>

                  <strong>
                    {selectedVolunteer.location ||
                      "Not provided"}
                  </strong>

                </div>

              </div>


              <div className="admin-volunteer-detail-box">

                <CalendarDays size={18} />

                <div>

                  <span>
                    Availability
                  </span>

                  <strong>
                    {selectedVolunteer.availability ||
                      "Not provided"}
                  </strong>

                </div>

              </div>

            </div>


            <div className="admin-volunteer-detail-section">

              <div className="admin-volunteer-detail-heading">

                <HeartHandshake size={18} />

                <h3>
                  Areas of Interest
                </h3>

              </div>


              {normalizeInterests(
                selectedVolunteer.interests
              ).length > 0 ? (

                <div className="admin-volunteer-detail-tags">

                  {normalizeInterests(
                    selectedVolunteer.interests
                  ).map(
                    (
                      interest,
                      index
                    ) => (

                      <span
                        key={`${interest}-${index}`}
                      >
                        {interest}
                      </span>

                    )
                  )}

                </div>

              ) : (

                <p className="admin-volunteer-muted">
                  No interests were specified.
                </p>

              )}

            </div>


            <div className="admin-volunteer-detail-section">

              <div className="admin-volunteer-detail-heading">

                <MessageSquare size={18} />

                <h3>
                  Volunteer Message
                </h3>

              </div>


              <div className="admin-volunteer-message">

                {selectedVolunteer.message ? (

                  <p>
                    {selectedVolunteer.message}
                  </p>

                ) : (

                  <p className="admin-volunteer-muted">
                    No message was provided.
                  </p>

                )}

              </div>

            </div>


            <div className="admin-volunteer-detail-section">

              <div className="admin-volunteer-detail-heading">

                <FileText size={18} />

                <h3>
                  Admin Notes
                </h3>

              </div>


              <div className="admin-volunteer-message">

                {selectedVolunteer.notes ? (

                  <p>
                    {selectedVolunteer.notes}
                  </p>

                ) : (

                  <p className="admin-volunteer-muted">
                    No administrative notes have
                    been added.
                  </p>

                )}

              </div>

            </div>


            <div className="admin-volunteer-modal-actions">

              {selectedVolunteer.status !==
                "approved" && (

                <button
                  type="button"
                  className="approve"
                  onClick={() =>
                    handleStatusChange(
                      selectedVolunteer,
                      "approved"
                    )
                  }
                >

                  <Check size={17} />

                  Approve

                </button>

              )}


              {selectedVolunteer.status !==
                "rejected" && (

                <button
                  type="button"
                  className="reject"
                  onClick={() =>
                    handleStatusChange(
                      selectedVolunteer,
                      "rejected"
                    )
                  }
                >

                  <XCircle size={17} />

                  Reject

                </button>

              )}


              {selectedVolunteer.status !==
                "pending" && (

                <button
                  type="button"
                  className="pending"
                  onClick={() =>
                    handleStatusChange(
                      selectedVolunteer,
                      "pending"
                    )
                  }
                >

                  <Clock size={17} />

                  Mark Pending

                </button>

              )}


              <button
                type="button"
                className="modal-edit"
                onClick={() =>
                  handleEdit(
                    selectedVolunteer
                  )
                }
              >

                <Pencil size={17} />

                Edit

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ================================================================
          EDIT MODAL
      ================================================================ */}

      {editingVolunteer && (

        <div
          className="admin-volunteer-modal-overlay"
          onMouseDown={(
            event
          ) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              handleCloseEdit();

            }

          }}
        >

          <div className="admin-volunteer-modal edit-modal">


            <button
              type="button"
              className="admin-volunteer-modal-close"
              onClick={
                handleCloseEdit
              }
              disabled={saving}
              aria-label="Close edit form"
            >

              <X size={20} />

            </button>


            <div className="admin-volunteer-modal-header">

              <div className="admin-volunteer-modal-avatar">

                <Pencil size={28} />

              </div>

              <div>

                <span>
                  VOLUNTEER MANAGEMENT
                </span>

                <h2>
                  Edit Volunteer
                </h2>

                <p>
                  Update application information
                  and administrative notes.
                </p>

              </div>

            </div>


            <form
              className="admin-volunteer-edit-form"
              onSubmit={handleSubmit}
            >


              {/* ==========================================================
                  NAME
              ========================================================== */}

              <div className="admin-volunteer-form-grid">

                <div className="admin-volunteer-form-group">

                  <label htmlFor="firstName">
                    First Name
                  </label>

                  <div className="admin-volunteer-input">

                    <User size={17} />

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={
                        form.firstName
                      }
                      onChange={
                        handleFormChange
                      }
                      disabled={saving}
                    />

                  </div>

                </div>


                <div className="admin-volunteer-form-group">

                  <label htmlFor="lastName">
                    Last Name
                  </label>

                  <div className="admin-volunteer-input">

                    <User size={17} />

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={
                        form.lastName
                      }
                      onChange={
                        handleFormChange
                      }
                      disabled={saving}
                    />

                  </div>

                </div>

              </div>


              {/* ==========================================================
                  CONTACT
              ========================================================== */}

              <div className="admin-volunteer-form-grid">

                <div className="admin-volunteer-form-group">

                  <label htmlFor="email">
                    Email Address
                  </label>

                  <div className="admin-volunteer-input">

                    <Mail size={17} />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={
                        form.email
                      }
                      onChange={
                        handleFormChange
                      }
                      disabled={saving}
                    />

                  </div>

                </div>


                <div className="admin-volunteer-form-group">

                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <div className="admin-volunteer-input">

                    <Phone size={17} />

                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      value={
                        form.phone
                      }
                      onChange={
                        handleFormChange
                      }
                      disabled={saving}
                    />

                  </div>

                </div>

              </div>


              {/* ==========================================================
                  LOCATION / AVAILABILITY
              ========================================================== */}

              <div className="admin-volunteer-form-grid">

                <div className="admin-volunteer-form-group">

                  <label htmlFor="location">
                    Location
                  </label>

                  <div className="admin-volunteer-input">

                    <MapPin size={17} />

                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={
                        form.location
                      }
                      onChange={
                        handleFormChange
                      }
                      disabled={saving}
                    />

                  </div>

                </div>


                <div className="admin-volunteer-form-group">

                  <label htmlFor="availability">
                    Availability
                  </label>

                  <div className="admin-volunteer-input">

                    <CalendarDays size={17} />

                    <input
                      id="availability"
                      name="availability"
                      type="text"
                      value={
                        form.availability
                      }
                      onChange={
                        handleFormChange
                      }
                      disabled={saving}
                    />

                  </div>

                </div>

              </div>


              {/* ==========================================================
                  INTERESTS
              ========================================================== */}

              <div className="admin-volunteer-form-group">

                <label htmlFor="interests">
                  Areas of Interest
                </label>

                <div className="admin-volunteer-input">

                  <HeartHandshake size={17} />

                  <input
                    id="interests"
                    name="interests"
                    type="text"
                    value={
                      form.interests
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="Education, Outreach, Fundraising"
                    disabled={saving}
                  />

                </div>

                <small>
                  Separate multiple interests
                  with commas.
                </small>

              </div>


              {/* ==========================================================
                  STATUS
              ========================================================== */}

              <div className="admin-volunteer-form-group">

                <label htmlFor="status">
                  Application Status
                </label>

                <div className="admin-volunteer-select">

                  <select
                    id="status"
                    name="status"
                    value={
                      form.status
                    }
                    onChange={
                      handleFormChange
                    }
                    disabled={saving}
                  >

                    <option value="pending">
                      Pending
                    </option>

                    <option value="approved">
                      Approved
                    </option>

                    <option value="rejected">
                      Rejected
                    </option>

                  </select>

                  <ChevronDown size={17} />

                </div>

              </div>


              {/* ==========================================================
                  MESSAGE
              ========================================================== */}

              <div className="admin-volunteer-form-group">

                <label htmlFor="message">
                  Volunteer Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={
                    form.message
                  }
                  onChange={
                    handleFormChange
                  }
                  disabled={saving}
                />

              </div>


              {/* ==========================================================
                  NOTES
              ========================================================== */}

              <div className="admin-volunteer-form-group">

                <label htmlFor="notes">
                  Administrative Notes
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  rows="4"
                  value={
                    form.notes
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="Add internal notes about this volunteer..."
                  disabled={saving}
                />

                <small>
                  These notes are for administrators
                  and are stored with the volunteer
                  record.
                </small>

              </div>


              {/* ==========================================================
                  ACTIONS
              ========================================================== */}

              <div className="admin-volunteer-edit-actions">

                <button
                  type="button"
                  className="cancel"
                  onClick={
                    handleCloseEdit
                  }
                  disabled={saving}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="save"
                  disabled={saving}
                >

                  {saving ? (

                    <>
                      <RefreshCw
                        size={17}
                        className="admin-volunteer-spin"
                      />

                      Saving...

                    </>

                  ) : (

                    <>
                      <Save size={17} />

                      Save Changes

                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </section>

  );

};


export default AdminVolunteers;