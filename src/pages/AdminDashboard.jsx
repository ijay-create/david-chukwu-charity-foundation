import { useEffect, useState } from "react";

import {
  DollarSign,
  Users,
  HandHeart,
  Mail,
  ArrowUpRight,
  Images,
  Eye,
  Plus
} from "lucide-react";

import { Link } from "react-router-dom";

import API from "../api/axios";

import "../styles/Admin.css";

/*
|--------------------------------------------------------------------------
| DEFAULT STATS
|--------------------------------------------------------------------------
*/

const defaultStats = {
  totalDonations: 0,
  donationCount: 0,
  completedDonations: 0,
  pendingDonations: 0,
  failedDonations: 0,
  unreadMessages: 0,
  galleryItems: 0,
  activePrograms: 0,
  activeVolunteers: 0
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

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

/*
|--------------------------------------------------------------------------
| FORMAT CURRENCY
|--------------------------------------------------------------------------
*/

const formatCurrency = (amount, currency = "GBP") => {
  const numericAmount = Number(amount || 0);

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericAmount);
};

/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD
|--------------------------------------------------------------------------
*/

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] =
    useState(defaultStats);

  const [recentDonations, setRecentDonations] =
    useState([]);

  const [recentMessages, setRecentMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | FETCH DASHBOARD DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(
          "/dashboard/stats"
        );

        if (!response.data?.success) {
          setError(
            "Unable to load dashboard data."
          );

          return;
        }

        setDashboardStats({
          ...defaultStats,
          ...(response.data.stats || {})
        });

        setRecentDonations(
          Array.isArray(
            response.data.recentDonations
          )
            ? response.data.recentDonations
            : []
        );

        setRecentMessages(
          Array.isArray(
            response.data.recentMessages
          )
            ? response.data.recentMessages
            : []
        );
      } catch (requestError) {
        console.error(
          "Dashboard data error:",
          requestError
        );

        setError(
          requestError.response?.data?.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | DASHBOARD STAT CARDS
  |--------------------------------------------------------------------------
  */

  const stats = [
    {
      title: "Total Donations",

      value: formatCurrency(
        dashboardStats.totalDonations,
        "GBP"
      ),

      label: `${dashboardStats.donationCount} donations`,

      icon: DollarSign,

      trend: "",

      trendType: "up"
    },

    {
      title: "Active Volunteers",

      value:
        dashboardStats.activeVolunteers || 0,

      label: "Registered",

      icon: Users,

      trend: "",

      trendType: "up"
    },

    {
      title: "Outreach Programs",

      value:
        dashboardStats.activePrograms || 0,

      label: "Active Programs",

      icon: HandHeart,

      trend: "",

      trendType: "up"
    },

    {
      title: "Contact Messages",

      value:
        dashboardStats.unreadMessages || 0,

      label: "Unread Messages",

      icon: Mail,

      trend: "",

      trendType: "up"
    }
  ];

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="admin-dashboard">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="admin-page-heading">

        <div>

          <h2>
            Dashboard Overview
          </h2>

          <p>
            Welcome back. Here's what's happening
            with your foundation.
          </p>

        </div>

      </div>

      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (
        <div
          className="admin-alert admin-alert-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <div className="stats-grid">

        {stats.map(
          ({
            title,
            value,
            label,
            icon: Icon,
            trend,
            trendType
          }) => (
            <div
              className="stat-card"
              key={title}
            >

              <div className="stat-card-top">

                <div className="stat-icon">

                  <Icon size={22} />

                </div>

                {trend && (
                  <span
                    className={`stat-trend ${trendType}`}
                  >

                    <ArrowUpRight size={14} />

                    {trend}

                  </span>
                )}

              </div>

              <strong className="stat-number">

                {loading
                  ? "..."
                  : value}

              </strong>

              <span className="stat-title">

                {title}

              </span>

              <span className="stat-label">

                {label}

              </span>

            </div>
          )
        )}

      </div>

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <section className="admin-section">

        <div className="admin-section-heading">

          <div>

            <h2>
              Quick Actions
            </h2>

            <p>
              Frequently used administration tools.
            </p>

          </div>

        </div>

        <div className="quick-actions">

          <Link
            to="/admin/gallery"
            className="quick-action primary"
          >

            <Images size={20} />

            <span>
              Add New Gallery Item
            </span>

            <Plus size={18} />

          </Link>

          <Link
            to="/admin/outreach"
            className="quick-action secondary"
          >

            <HandHeart size={20} />

            <span>
              Create Outreach Program
            </span>

            <Plus size={18} />

          </Link>

          <Link
            to="/admin/donations"
            className="quick-action secondary"
          >

            <DollarSign size={20} />

            <span>
              View All Donations
            </span>

            <Eye size={18} />

          </Link>

        </div>

      </section>

      {/* =====================================================
          RECENT ACTIVITY
      ===================================================== */}

      <div className="admin-dashboard-grid">

        {/* ===================================================
            RECENT DONATIONS
        =================================================== */}

        <section className="admin-card">

          <div className="admin-card-header">

            <div>

              <h3>
                Recent Donations
              </h3>

              <span>
                Latest donation activity
              </span>

            </div>

            <Link to="/admin/donations">
              View All
            </Link>

          </div>

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>
                    Donor
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (
                  <tr>

                    <td
                      colSpan="4"
                      className="admin-table-empty"
                    >
                      Loading donations...
                    </td>

                  </tr>
                ) : recentDonations.length === 0 ? (
                  <tr>

                    <td
                      colSpan="4"
                      className="admin-table-empty"
                    >
                      No donations yet.
                    </td>

                  </tr>
                ) : (
                  recentDonations.map(
                    (donation) => {

                      const donorName =
                        donation.donorName ||
                        "Anonymous";

                      const status =
                        donation.status ||
                        "Pending";

                      return (
                        <tr
                          key={
                            donation.id ||
                            donation.reference
                          }
                        >

                          <td>

                            <div className="table-person">

                              <span className="table-avatar">

                                {donorName
                                  .charAt(0)
                                  .toUpperCase()}

                              </span>

                              <div>

                                <strong>
                                  {donorName}
                                </strong>

                                <small>
                                  {donation.reference ||
                                    "No reference"}
                                </small>

                              </div>

                            </div>

                          </td>

                          <td>

                            <strong>

                              {formatCurrency(
                                donation.amount,
                                donation.currency ||
                                  "GBP"
                              )}

                            </strong>

                          </td>

                          <td>

                            {formatDate(
                              donation.date
                            )}

                          </td>

                          <td>

                            <span
                              className={`status-badge ${status.toLowerCase()}`}
                            >
                              {status}
                            </span>

                          </td>

                        </tr>
                      );
                    }
                  )
                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* ===================================================
            RECENT MESSAGES
        =================================================== */}

        <section className="admin-card">

          <div className="admin-card-header">

            <div>

              <h3>
                Recent Messages
              </h3>

              <span>
                Latest contact submissions
              </span>

            </div>

            <Link to="/admin/contacts">
              View All
            </Link>

          </div>

          <div className="message-list">

            {loading ? (
              <div className="message-empty">
                Loading messages...
              </div>
            ) : recentMessages.length === 0 ? (
              <div className="message-empty">
                No contact messages yet.
              </div>
            ) : (
              recentMessages.map(
                (message) => {

                  const name =
                    message.name ||
                    "Unknown";

                  const subject =
                    message.subject ||
                    "No subject";

                  const messageText =
                    message.message ||
                    "";

                  return (
                    <div
                      className="message-item"
                      key={
                        message._id ||
                        `${name}-${subject}-${message.createdAt}`
                      }
                    >

                      <div className="message-avatar">

                        {name
                          .charAt(0)
                          .toUpperCase()}

                      </div>

                      <div className="message-body">

                        <div className="message-top">

                          <strong>
                            {name}
                          </strong>

                          <span>

                            {formatDate(
                              message.createdAt
                            )}

                          </span>

                        </div>

                        <h4>
                          {subject}
                        </h4>

                        <p>
                          {messageText.length >
                          100
                            ? `${messageText.substring(
                                0,
                                100
                              )}...`
                            : messageText}
                        </p>

                      </div>

                    </div>
                  );
                }
              )
            )}

          </div>

        </section>

      </div>

    </div>
  );
};

export default AdminDashboard;