import React, { useEffect, useState } from "react";

import {
  Mail,
  Phone,
  User,
  Calendar,
  MessageSquare,
  Trash2,
  CheckCircle,
  Clock,
  Archive,
  RefreshCw,
  Handshake
} from "lucide-react";

import API from "../../api/axios";

import "../../styles/AdminGetInvolved.css";


/*
|--------------------------------------------------------------------------
| ADMIN GET INVOLVED
|--------------------------------------------------------------------------
*/

const AdminGetInvolved = () => {

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  const [deletingId, setDeletingId] = useState(null);


  /*
  |--------------------------------------------------------------------------
  | FETCH APPLICATIONS
  |--------------------------------------------------------------------------
  */

  const fetchApplications = async () => {

    try {

      setLoading(true);

      setError("");

      const response = await API.get(
        "/contact/volunteers"
      );


      /*
      |--------------------------------------------------------------------------
      | IMPORTANT
      |--------------------------------------------------------------------------
      |
      | Backend returns:
      |
      | {
      |   success: true,
      |   count: 5,
      |   volunteers: [...]
      | }
      |
      | Therefore we must read:
      |
      | response.data.volunteers
      |
      |--------------------------------------------------------------------------
      */

      const volunteers =
        response.data?.volunteers;

      setApplications(
        Array.isArray(volunteers)
          ? volunteers
          : []
      );


    } catch (error) {

      console.error(
        "FETCH GET INVOLVED APPLICATIONS ERROR:",
        error
      );


      /*
      |--------------------------------------------------------------------------
      | AUTH ERROR
      |--------------------------------------------------------------------------
      */

      if (error.response?.status === 401) {

        setError(
          "Your admin session has expired. Please log in again."
        );

      } else {

        setError(
          error.response?.data?.message ||
          "Failed to load get involved applications."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    fetchApplications();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | UPDATE STATUS
  |--------------------------------------------------------------------------
  */

  const handleStatusChange = async (
    id,
    status
  ) => {

    try {

      setUpdatingId(id);


      const response = await API.put(
        `/contact/${id}/status`,
        {
          status
        }
      );


      const updatedContact =
        response.data?.contact;


      if (!updatedContact) {

        throw new Error(
          "Updated application was not returned by the server."
        );

      }


      setApplications(
        (previousApplications) =>
          previousApplications.map(
            (application) =>
              application._id === id
                ? updatedContact
                : application
          )
      );


    } catch (error) {

      console.error(
        "UPDATE APPLICATION STATUS ERROR:",
        error
      );


      alert(
        error.response?.data?.message ||
        "Failed to update application status."
      );


    } finally {

      setUpdatingId(null);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | DELETE APPLICATION
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this application? This action cannot be undone."
      );


    if (!confirmed) {

      return;

    }


    try {

      setDeletingId(id);


      await API.delete(
        `/contact/${id}`
      );


      setApplications(
        (previousApplications) =>
          previousApplications.filter(
            (application) =>
              application._id !== id
          )
      );


    } catch (error) {

      console.error(
        "DELETE GET INVOLVED APPLICATION ERROR:",
        error
      );


      alert(
        error.response?.data?.message ||
        "Failed to delete application."
      );


    } finally {

      setDeletingId(null);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | FORMAT DATE
  |--------------------------------------------------------------------------
  */

  const formatDate = (date) => {

    if (!date) {

      return "—";

    }


    const formattedDate =
      new Date(date);


    if (
      Number.isNaN(
        formattedDate.getTime()
      )
    ) {

      return "—";

    }


    return formattedDate.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric"
      }
    );

  };


  /*
  |--------------------------------------------------------------------------
  | STATUS CLASS
  |--------------------------------------------------------------------------
  */

  const getStatusClass = (status) => {

    switch (status) {

      case "Read":
        return "status-read";

      case "Replied":
        return "status-replied";

      case "Archived":
        return "status-archived";

      case "Unread":
      default:
        return "status-unread";

    }

  };


  /*
  |--------------------------------------------------------------------------
  | STATUS ICON
  |--------------------------------------------------------------------------
  */

  const getStatusIcon = (status) => {

    switch (status) {

      case "Read":

        return (
          <CheckCircle size={14} />
        );


      case "Replied":

        return (
          <MessageSquare size={14} />
        );


      case "Archived":

        return (
          <Archive size={14} />
        );


      case "Unread":

      default:

        return (
          <Clock size={14} />
        );

    }

  };


  /*
  |--------------------------------------------------------------------------
  | LOADING STATE
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (

      <div className="admin-get-involved">

        <div className="admin-get-involved-loading">

          <RefreshCw
            size={24}
            className="loading-spinner"
          />

          <p>
            Loading applications...
          </p>

        </div>

      </div>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | COUNTS
  |--------------------------------------------------------------------------
  */

  const totalApplications =
    applications.length;


  const unreadApplications =
    applications.filter(
      (application) =>
        application.status === "Unread"
    ).length;


  const repliedApplications =
    applications.filter(
      (application) =>
        application.status === "Replied"
    ).length;


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <div className="admin-get-involved">


      {/* ================================================================
          HEADER
      ================================================================= */}

      <div className="admin-get-involved-header">

        <div>

          <div className="admin-get-involved-title">

            <div className="admin-get-involved-icon">

              <Handshake size={22} />

            </div>


            <div>

              <span>
                FOUNDATION
              </span>

              <h2>
                Get Involved
              </h2>

            </div>

          </div>


          <p>
            Manage volunteer, partnership, sponsorship
            and other participation requests submitted
            through the foundation website.
          </p>

        </div>


        <button
          type="button"
          className="admin-refresh-button"
          onClick={fetchApplications}
          disabled={loading}
        >

          <RefreshCw size={16} />

          Refresh

        </button>

      </div>


      {/* ================================================================
          ERROR
      ================================================================= */}

      {error && (

        <div className="admin-get-involved-error">

          <span>
            {error}
          </span>


          <button
            type="button"
            onClick={fetchApplications}
          >

            Try Again

          </button>

        </div>

      )}


      {/* ================================================================
          SUMMARY
      ================================================================= */}

      {!error && (

        <div className="admin-get-involved-summary">


          {/* TOTAL */}

          <div className="summary-card">

            <div className="summary-card-icon">

              <User size={18} />

            </div>


            <div>

              <span>
                TOTAL APPLICATIONS
              </span>

              <strong>
                {totalApplications}
              </strong>

            </div>

          </div>


          {/* UNREAD */}

          <div className="summary-card">

            <div className="summary-card-icon">

              <Clock size={18} />

            </div>


            <div>

              <span>
                UNREAD
              </span>

              <strong>
                {unreadApplications}
              </strong>

            </div>

          </div>


          {/* REPLIED */}

          <div className="summary-card">

            <div className="summary-card-icon">

              <MessageSquare size={18} />

            </div>


            <div>

              <span>
                REPLIED
              </span>

              <strong>
                {repliedApplications}
              </strong>

            </div>

          </div>

        </div>

      )}


      {/* ================================================================
          EMPTY STATE
      ================================================================= */}

      {!error &&
        applications.length === 0 && (

          <div className="admin-get-involved-empty">

            <div className="empty-icon">

              <Handshake size={42} />

            </div>


            <h3>
              No Applications Yet
            </h3>


            <p>
              Get involved applications submitted
              from the website will appear here.
            </p>


            <button
              type="button"
              onClick={fetchApplications}
            >

              <RefreshCw size={16} />

              Refresh Applications

            </button>

          </div>

        )}


      {/* ================================================================
          APPLICATIONS
      ================================================================= */}

      {!error &&
        applications.length > 0 && (

          <div className="applications-container">

            {applications.map(
              (application) => (

                <article
                  className="application-card"
                  key={application._id}
                >


                  {/* ==================================================
                      CARD HEADER
                  ================================================== */}

                  <div className="application-card-header">


                    <div className="applicant-info">

                      <div className="applicant-avatar">

                        <User size={20} />

                      </div>


                      <div>

                        <h3>
                          {application.name}
                        </h3>


                        <span>
                          {application.interestArea ||
                            "General Interest"}
                        </span>

                      </div>

                    </div>


                    <div
                      className={`application-status ${getStatusClass(
                        application.status
                      )}`}
                    >

                      {getStatusIcon(
                        application.status
                      )}

                      <span>
                        {application.status ||
                          "Unread"}
                      </span>

                    </div>

                  </div>


                  {/* ==================================================
                      CONTACT DETAILS
                  ================================================== */}

                  <div className="application-details">


                    {/* EMAIL */}

                    <a
                      href={`mailto:${application.email}`}
                      className="application-detail"
                    >

                      <Mail size={16} />

                      <span>
                        {application.email}
                      </span>

                    </a>


                    {/* PHONE */}

                    {application.phone && (

                      <a
                        href={`tel:${application.phone}`}
                        className="application-detail"
                      >

                        <Phone size={16} />

                        <span>
                          {application.phone}
                        </span>

                      </a>

                    )}


                    {/* DATE */}

                    <div className="application-detail">

                      <Calendar size={16} />

                      <span>
                        {formatDate(
                          application.createdAt
                        )}
                      </span>

                    </div>

                  </div>


                  {/* ==================================================
                      MESSAGE
                  ================================================== */}

                  <div className="application-message">

                    <div className="message-heading">

                      <MessageSquare size={16} />

                      <span>
                        MESSAGE
                      </span>

                    </div>


                    <p>
                      {application.message}
                    </p>

                  </div>


                  {/* ==================================================
                      ACTIONS
                  ================================================== */}

                  <div className="application-actions">


                    <div className="status-actions">

                      <span>
                        Update status:
                      </span>


                      <select
                        value={
                          application.status ||
                          "Unread"
                        }
                        onChange={(event) =>
                          handleStatusChange(
                            application._id,
                            event.target.value
                          )
                        }
                        disabled={
                          updatingId ===
                          application._id
                        }
                      >

                        <option value="Unread">
                          Unread
                        </option>

                        <option value="Read">
                          Read
                        </option>

                        <option value="Replied">
                          Replied
                        </option>

                        <option value="Archived">
                          Archived
                        </option>

                      </select>


                      {updatingId ===
                        application._id && (

                        <span className="updating-text">
                          Updating...
                        </span>

                      )}

                    </div>


                    <button
                      type="button"
                      className="delete-application-button"
                      onClick={() =>
                        handleDelete(
                          application._id
                        )
                      }
                      disabled={
                        deletingId ===
                        application._id
                      }
                    >

                      <Trash2 size={16} />

                      {deletingId ===
                      application._id
                        ? "Deleting..."
                        : "Delete"}

                    </button>

                  </div>

                </article>

              )
            )}

          </div>

        )}

    </div>

  );

};


export default AdminGetInvolved;