import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Trash2,
  User,
  Users,
} from "lucide-react";

import API from "../../api/axios";

import "../../styles/AdminGetInvolved.css";


const AdminGetInvolved = () => {
  // ==========================================================================
  // STATE
  // ==========================================================================

  const [submissions, setSubmissions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [updatingId, setUpdatingId] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState(null);


  // ==========================================================================
  // FETCH SUBMISSIONS
  // ==========================================================================

  const fetchSubmissions = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response =
          await API.get(
            "/get-involved"
          );

        if (
          response.data?.success
        ) {
          setSubmissions(
            response.data.data || []
          );
        } else {
          setSubmissions([]);
        }

      } catch (error) {
        console.error(
          "FETCH GET INVOLVED ERROR:",
          error
        );

        alert(
          error.response?.data?.message ||
            "Unable to load Get Involved submissions."
        );

      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );


  // ==========================================================================
  // INITIAL LOAD
  // ==========================================================================

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);


  // ==========================================================================
  // UPDATE STATUS
  // ==========================================================================

  const handleStatusChange = async (
    id,
    status
  ) => {
    try {
      setUpdatingId(id);

      const response =
        await API.put(
          `/get-involved/${id}/status`,
          {
            status,
          }
        );

      if (
        response.data?.success
      ) {
        const updatedSubmission =
          response.data.data;

        setSubmissions(
          (currentSubmissions) =>
            currentSubmissions.map(
              (submission) =>
                submission._id === id
                  ? updatedSubmission
                  : submission
            )
        );
      }

    } catch (error) {
      console.error(
        "UPDATE GET INVOLVED STATUS ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update submission status."
      );

    } finally {
      setUpdatingId(null);
    }
  };


  // ==========================================================================
  // DELETE SUBMISSION
  // ==========================================================================

  const handleDelete = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this Get Involved submission? This action cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const response =
        await API.delete(
          `/get-involved/${id}`
        );

      if (
        response.data?.success
      ) {
        setSubmissions(
          (currentSubmissions) =>
            currentSubmissions.filter(
              (submission) =>
                submission._id !== id
            )
        );
      }

    } catch (error) {
      console.error(
        "DELETE GET INVOLVED ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to delete submission."
      );

    } finally {
      setDeletingId(null);
    }
  };


  // ==========================================================================
  // STATUS HELPERS
  // ==========================================================================

  const getStatusIcon = (
    status
  ) => {
    if (status === "Resolved") {
      return <CheckCircle size={16} />;
    }

    if (status === "Contacted") {
      return <MessageSquare size={16} />;
    }

    return <Clock size={16} />;
  };


  const getStatusClass = (
    status
  ) => {
    switch (status) {
      case "Resolved":
        return "status-resolved";

      case "Contacted":
        return "status-contacted";

      case "New":
      default:
        return "status-new";
    }
  };


  // ==========================================================================
  // COUNTS
  // ==========================================================================

  const totalCount =
    submissions.length;

  const newCount =
    submissions.filter(
      (item) =>
        item.status === "New"
    ).length;

  const contactedCount =
    submissions.filter(
      (item) =>
        item.status === "Contacted"
    ).length;

  const resolvedCount =
    submissions.filter(
      (item) =>
        item.status === "Resolved"
    ).length;


  // ==========================================================================
  // LOADING STATE
  // ==========================================================================

  if (loading) {
    return (
      <div className="admin-get-involved-page">

        <div className="admin-get-involved-loading">

          <RefreshCw
            size={30}
            className="loading-spinner"
          />

          <p>
            Loading Get Involved submissions...
          </p>

        </div>

      </div>
    );
  }


  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className="admin-get-involved-page">

      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}

      <div className="admin-get-involved-header">

        <div>

          <h1>
            Get Involved
          </h1>

          <p>
            Manage people who have expressed
            interest in supporting the foundation.
          </p>

        </div>


        <button
          type="button"
          className="refresh-button"
          onClick={() =>
            fetchSubmissions(true)
          }
          disabled={refreshing}
        >

          <RefreshCw
            size={17}
            className={
              refreshing
                ? "loading-spinner"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </div>


      {/* ================================================================== */}
      {/* SUMMARY */}
      {/* ================================================================== */}

      <div className="get-involved-summary">

        <div className="summary-card">

          <div className="summary-icon">
            <Users size={21} />
          </div>

          <div>

            <span>
              Total
            </span>

            <strong>
              {totalCount}
            </strong>

          </div>

        </div>


        <div className="summary-card">

          <div className="summary-icon">
            <Clock size={21} />
          </div>

          <div>

            <span>
              New
            </span>

            <strong>
              {newCount}
            </strong>

          </div>

        </div>


        <div className="summary-card">

          <div className="summary-icon">
            <MessageSquare size={21} />
          </div>

          <div>

            <span>
              Contacted
            </span>

            <strong>
              {contactedCount}
            </strong>

          </div>

        </div>


        <div className="summary-card">

          <div className="summary-icon">
            <CheckCircle size={21} />
          </div>

          <div>

            <span>
              Resolved
            </span>

            <strong>
              {resolvedCount}
            </strong>

          </div>

        </div>

      </div>


      {/* ================================================================== */}
      {/* SUBMISSIONS */}
      {/* ================================================================== */}

      <div className="get-involved-content">

        {submissions.length === 0 ? (

          <div className="empty-state">

            <Users size={42} />

            <h2>
              No submissions yet
            </h2>

            <p>
              Get Involved submissions will
              appear here when people submit
              the form.
            </p>

          </div>

        ) : (

          <div className="get-involved-list">

            {submissions.map(
              (submission) => (

                <div
                  className="get-involved-card"
                  key={submission._id}
                >

                  {/* ====================================================== */}
                  {/* CARD HEADER */}
                  {/* ====================================================== */}

                  <div className="submission-header">

                    <div className="submission-person">

                      <div className="person-icon">
                        <User size={20} />
                      </div>

                      <div>

                        <h2>
                          {submission.name}
                        </h2>

                        <p>
                          {submission.involvement}
                        </p>

                      </div>

                    </div>


                    <div
                      className={`submission-status ${getStatusClass(
                        submission.status
                      )}`}
                    >

                      {getStatusIcon(
                        submission.status
                      )}

                      <span>
                        {submission.status}
                      </span>

                    </div>

                  </div>


                  {/* ====================================================== */}
                  {/* CONTACT DETAILS */}
                  {/* ====================================================== */}

                  <div className="submission-details">

                    <a
                      href={`mailto:${submission.email}`}
                      className="submission-detail"
                    >

                      <Mail size={16} />

                      <span>
                        {submission.email}
                      </span>

                    </a>


                    {submission.phone && (
                      <a
                        href={`tel:${submission.phone}`}
                        className="submission-detail"
                      >

                        <Phone size={16} />

                        <span>
                          {submission.phone}
                        </span>

                      </a>
                    )}

                  </div>


                  {/* ====================================================== */}
                  {/* MESSAGE */}
                  {/* ====================================================== */}

                  <div className="submission-message">

                    <div className="message-heading">

                      <MessageSquare
                        size={16}
                      />

                      <span>
                        Message
                      </span>

                    </div>

                    <p>
                      {submission.message}
                    </p>

                  </div>


                  {/* ====================================================== */}
                  {/* DATE */}
                  {/* ====================================================== */}

                  <div className="submission-date">

                    Submitted{" "}

                    {submission.createdAt
                      ? new Date(
                          submission.createdAt
                        ).toLocaleString()
                      : "—"}

                  </div>


                  {/* ====================================================== */}
                  {/* ACTIONS */}
                  {/* ====================================================== */}

                  <div className="submission-actions">

                    <div className="status-control">

                      <label
                        htmlFor={`status-${submission._id}`}
                      >
                        Status
                      </label>

                      <select
                        id={`status-${submission._id}`}
                        value={
                          submission.status ||
                          "New"
                        }
                        onChange={(event) =>
                          handleStatusChange(
                            submission._id,
                            event.target.value
                          )
                        }
                        disabled={
                          updatingId ===
                          submission._id
                        }
                      >

                        <option value="New">
                          New
                        </option>

                        <option value="Contacted">
                          Contacted
                        </option>

                        <option value="Resolved">
                          Resolved
                        </option>

                      </select>

                      {updatingId ===
                        submission._id && (
                        <span className="action-loading">
                          Updating...
                        </span>
                      )}

                    </div>


                    <button
                      type="button"
                      className="delete-submission-button"
                      onClick={() =>
                        handleDelete(
                          submission._id
                        )
                      }
                      disabled={
                        deletingId ===
                        submission._id
                      }
                    >

                      <Trash2 size={16} />

                      {deletingId ===
                      submission._id
                        ? "Deleting..."
                        : "Delete"}

                    </button>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
};


export default AdminGetInvolved;