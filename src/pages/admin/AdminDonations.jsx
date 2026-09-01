import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Search,
  Eye,
  X,
  Download,
  DollarSign
} from "lucide-react";

import API from "../../api/axios";

import "../../styles/Admin.donations.css";


// ========================================
// ADMIN DONATIONS
// ========================================

const AdminDonations = () => {

  // ======================================
  // STATE
  // ======================================

  const [donations, setDonations] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedDonation, setSelectedDonation] =
    useState(null);

  const [sortOrder, setSortOrder] =
    useState("newest");

  const [notes, setNotes] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  // ======================================
  // FETCH DONATIONS
  // ======================================

  const fetchDonations = async () => {
    try {

      setLoading(true);
      setError("");

      const response =
        await API.get("/donations");

      const data =
        Array.isArray(response.data)
          ? response.data
          : response.data?.donations ||
            response.data?.data ||
            [];

      setDonations(data);

    } catch (requestError) {

      console.error(
        "GET DONATIONS ERROR:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
        "Unable to load donations."
      );

    } finally {

      setLoading(false);

    }
  };


  // ======================================
  // LOAD DONATIONS
  // ======================================

  useEffect(() => {

    fetchDonations();

  }, []);


  // ======================================
  // FILTER + SORT
  // ======================================

  const filteredDonations =
    useMemo(() => {

      const searchValue =
        search
          .toLowerCase()
          .trim();

      const filtered =
        donations.filter(
          (donation) => {

            const donorName =
              donation.donorName ||
              "";

            const email =
              donation.email ||
              "";

            const reference =
              donation.reference ||
              "";

            const donationId =
              donation._id ||
              donation.id ||
              "";

            const matchesSearch =
              !searchValue ||
              donorName
                .toLowerCase()
                .includes(searchValue) ||
              email
                .toLowerCase()
                .includes(searchValue) ||
              reference
                .toLowerCase()
                .includes(searchValue) ||
              donationId
                .toLowerCase()
                .includes(searchValue);

            const matchesStatus =
              statusFilter === "All" ||
              donation.status ===
                statusFilter;

            return (
              matchesSearch &&
              matchesStatus
            );
          }
        );

      return [...filtered].sort(
        (a, b) => {

          if (
            sortOrder ===
            "amount-high"
          ) {

            return (
              Number(b.amount || 0) -
              Number(a.amount || 0)
            );
          }

          if (
            sortOrder ===
            "amount-low"
          ) {

            return (
              Number(a.amount || 0) -
              Number(b.amount || 0)
            );
          }

          if (
            sortOrder ===
            "oldest"
          ) {

            return (
              new Date(a.date) -
              new Date(b.date)
            );
          }

          return (
            new Date(b.date) -
            new Date(a.date)
          );
        }
      );

    }, [
      donations,
      search,
      statusFilter,
      sortOrder
    ]);


  // ======================================
  // SUMMARY
  // ======================================

  const totalDonations =
    donations.reduce(
      (total, donation) => {

        if (
          donation.status !==
          "Completed"
        ) {
          return total;
        }

        return (
          total +
          Number(
            donation.amount || 0
          )
        );

      },
      0
    );


  const completedCount =
    donations.filter(
      (donation) =>
        donation.status ===
        "Completed"
    ).length;


  const pendingCount =
    donations.filter(
      (donation) =>
        donation.status ===
        "Pending"
    ).length;


  // ======================================
  // FORMAT CURRENCY
  // ======================================

  const formatAmount = (
    amount,
    currency
  ) => {

    const numericAmount =
      Number(amount || 0);

    if (currency === "GBP") {

      return `£${numericAmount.toLocaleString()}`;

    }

    if (currency === "USD") {

      return `$${numericAmount.toLocaleString()}`;

    }

    if (currency === "EUR") {

      return `€${numericAmount.toLocaleString()}`;

    }

    return `${currency || ""} ${numericAmount.toLocaleString()}`;
  };


  // ======================================
  // FORMAT DATE
  // ======================================

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "—";
    }

    return parsedDate
      .toISOString()
      .split("T")[0];
  };


  // ======================================
  // OPEN DONATION
  // ======================================

  const openDonation = (
    donation
  ) => {

    setSelectedDonation(
      donation
    );

    setNotes(
      donation.notes || ""
    );

    setError("");
  };


  // ======================================
  // CLOSE DONATION
  // ======================================

  const closeDonation = () => {

    if (saving) {
      return;
    }

    setSelectedDonation(null);
    setNotes("");
    setError("");
  };


  // ======================================
  // UPDATE DONATION
  // ======================================

  const updateDonation = async (
    updates
  ) => {

    if (!selectedDonation) {
      return;
    }

    try {

      setSaving(true);
      setError("");

      const donationId =
        selectedDonation._id ||
        selectedDonation.id;

      const response =
        await API.put(
          `/donations/${donationId}`,
          updates
        );

      const updatedDonation =
        response.data?.donation;

      if (updatedDonation) {

        setDonations(
          (previous) =>
            previous.map(
              (donation) =>
                (
                  donation._id ||
                  donation.id
                ) ===
                (
                  updatedDonation._id ||
                  updatedDonation.id
                )
                  ? updatedDonation
                  : donation
            )
        );

        setSelectedDonation(
          updatedDonation
        );

        setNotes(
          updatedDonation.notes ||
          ""
        );

      } else {

        await fetchDonations();

      }

    } catch (requestError) {

      console.error(
        "UPDATE DONATION ERROR:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
        "Unable to update donation."
      );

    } finally {

      setSaving(false);

    }
  };


  // ======================================
  // SAVE NOTES
  // ======================================

  const saveNotes = async () => {

    await updateDonation({
      notes
    });

  };


  // ======================================
  // CHANGE STATUS
  // ======================================

  const changeDonationStatus = async (
    status
  ) => {

    await updateDonation({
      status
    });

  };


  // ======================================
  // EXPORT CSV
  // ======================================

  const exportCSV = () => {

    const headers = [
      "ID",
      "Donor Name",
      "Email",
      "Amount",
      "Currency",
      "Date",
      "Payment Method",
      "Status",
      "Reference",
      "Notes"
    ];

    const rows =
      filteredDonations.map(
        (donation) => [

          donation._id ||
            donation.id ||
            "",

          donation.donorName ||
            "",

          donation.email ||
            "",

          donation.amount ||
            0,

          donation.currency ||
            "",

          formatDate(
            donation.date
          ),

          donation.paymentMethod ||
            "",

          donation.status ||
            "",

          donation.reference ||
            "",

          donation.notes ||
            ""
        ]
      );

    const csvContent =
      [
        headers,
        ...rows
      ]
        .map(
          (row) =>
            row
              .map(
                (value) =>
                  `"${String(
                    value
                  ).replaceAll(
                    '"',
                    '""'
                  )}"`
              )
              .join(",")
        )
        .join("\n");

    const blob =
      new Blob(
        [csvContent],
        {
          type:
            "text/csv;charset=utf-8;"
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      "charity-donations.csv";

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(
      url
    );
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
              Donations
            </h1>

            <p>
              View and manage all
              donation transactions.
            </p>

          </div>

        </div>

        <div className="admin-empty-state">

          <DollarSign size={45} />

          <h3>
            Loading donations...
          </h3>

          <p>
            Fetching donation
            transactions.
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
            Donations
          </h1>

          <p>
            View and manage all
            donation transactions.
          </p>

        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={exportCSV}
          disabled={
            filteredDonations.length === 0
          }
        >
          <Download size={18} />

          Export CSV
        </button>

      </div>


      {/* ==================================
          ERROR
      ================================== */}

      {error && (

        <div
          className="admin-alert admin-alert-error"
          role="alert"
        >
          {error}
        </div>

      )}


      {/* ==================================
          SUMMARY
      ================================== */}

      <div className="admin-donation-summary">

        <div className="admin-summary-card">

          <div className="admin-summary-icon">
            <DollarSign size={21} />
          </div>

          <div>

            <span>
              Total Donations
            </span>

            <strong>
              £
              {totalDonations.toLocaleString()}
            </strong>

          </div>

        </div>


        <div className="admin-summary-card">

          <div className="admin-summary-icon">
            <DollarSign size={21} />
          </div>

          <div>

            <span>
              Completed
            </span>

            <strong>
              {completedCount}
            </strong>

          </div>

        </div>


        <div className="admin-summary-card">

          <div className="admin-summary-icon">
            <DollarSign size={21} />
          </div>

          <div>

            <span>
              Pending
            </span>

            <strong>
              {pendingCount}
            </strong>

          </div>

        </div>


        <div className="admin-summary-card">

          <div className="admin-summary-icon">
            <DollarSign size={21} />
          </div>

          <div>

            <span>
              Transactions
            </span>

            <strong>
              {donations.length}
            </strong>

          </div>

        </div>

      </div>


      {/* ==================================
          FILTERS
      ================================== */}

      <div className="admin-toolbar">

        <div className="admin-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search donor, email or reference..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>


        <div className="admin-filters">

          <select
            className="admin-filter-select"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >

            <option value="All">
              All Statuses
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Failed">
              Failed
            </option>

          </select>


          <select
            className="admin-filter-select"
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(
                event.target.value
              )
            }
          >

            <option value="newest">
              Newest First
            </option>

            <option value="oldest">
              Oldest First
            </option>

            <option value="amount-high">
              Highest Amount
            </option>

            <option value="amount-low">
              Lowest Amount
            </option>

          </select>

        </div>

      </div>


      {/* ==================================
          TABLE
      ================================== */}

      <div className="admin-table-wrapper">

        <table className="admin-table">

          <thead>

            <tr>

              <th>
                ID
              </th>

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
                Payment Method
              </th>

              <th>
                Status
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {filteredDonations.length >
            0 ? (

              filteredDonations.map(
                (donation) => {

                  const donationId =
                    donation._id ||
                    donation.id;

                  return (
                    <tr
                      key={
                        donationId
                      }
                    >

                      <td>

                        <strong>
                          {donationId}
                        </strong>

                      </td>


                      <td>

                        <div className="donor-info">

                          <strong>
                            {
                              donation.donorName
                            }
                          </strong>

                          <span>
                            {
                              donation.email
                            }
                          </span>

                        </div>

                      </td>


                      <td>

                        <strong>

                          {formatAmount(
                            donation.amount,
                            donation.currency
                          )}

                        </strong>

                      </td>


                      <td>
                        {formatDate(
                          donation.date
                        )}
                      </td>


                      <td>
                        {
                          donation.paymentMethod ||
                          "—"
                        }
                      </td>


                      <td>

                        <span
                          className={`admin-status-badge ${
                            (
                              donation.status ||
                              "Pending"
                            ).toLowerCase()
                          }`}
                        >
                          {
                            donation.status ||
                            "Pending"
                          }
                        </span>

                      </td>


                      <td>

                        <button
                          type="button"
                          className="admin-icon-btn view"
                          title="View donation"
                          onClick={() =>
                            openDonation(
                              donation
                            )
                          }
                        >
                          <Eye size={17} />
                        </button>

                      </td>

                    </tr>
                  );
                }
              )

            ) : (

              <tr>

                <td
                  colSpan="7"
                  className="admin-empty-state"
                >
                  No donations found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>


      {/* ==================================
          DETAILS MODAL
      ================================== */}

      {selectedDonation && (

        <div
          className="modal-overlay"
          onClick={
            closeDonation
          }
        >

          <div
            className="modal-content donation-details-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <span className="admin-category-badge">

                  {
                    selectedDonation.status
                  }

                </span>

                <h2>
                  Donation Details
                </h2>

              </div>


              <button
                type="button"
                className="admin-modal-close"
                onClick={
                  closeDonation
                }
                disabled={saving}
              >
                <X size={22} />
              </button>

            </div>


            {/* DONOR */}

            <div className="donation-detail-section">

              <h3>
                Donor Information
              </h3>


              <div className="donation-detail-grid">

                <div>

                  <span>
                    Name
                  </span>

                  <strong>
                    {
                      selectedDonation.donorName
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Email
                  </span>

                  <strong>
                    {
                      selectedDonation.email
                    }
                  </strong>

                </div>

              </div>

            </div>


            {/* PAYMENT */}

            <div className="donation-detail-section">

              <h3>
                Payment Information
              </h3>


              <div className="donation-detail-grid">

                <div>

                  <span>
                    Donation ID
                  </span>

                  <strong>
                    {
                      selectedDonation._id ||
                      selectedDonation.id
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Reference
                  </span>

                  <strong>
                    {
                      selectedDonation.reference ||
                      "—"
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Amount
                  </span>

                  <strong>
                    {formatAmount(
                      selectedDonation.amount,
                      selectedDonation.currency
                    )}
                  </strong>

                </div>


                <div>

                  <span>
                    Payment Method
                  </span>

                  <strong>
                    {
                      selectedDonation.paymentMethod ||
                      "—"
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Date
                  </span>

                  <strong>
                    {formatDate(
                      selectedDonation.date
                    )}
                  </strong>

                </div>

              </div>

            </div>


            {/* STATUS */}

            <div className="donation-detail-section">

              <h3>
                Update Status
              </h3>


              <div className="donation-status-buttons">

                <button
                  type="button"
                  className={
                    selectedDonation.status ===
                    "Completed"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    changeDonationStatus(
                      "Completed"
                    )
                  }
                  disabled={saving}
                >
                  Completed
                </button>


                <button
                  type="button"
                  className={
                    selectedDonation.status ===
                    "Pending"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    changeDonationStatus(
                      "Pending"
                    )
                  }
                  disabled={saving}
                >
                  Pending
                </button>


                <button
                  type="button"
                  className={
                    selectedDonation.status ===
                    "Failed"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    changeDonationStatus(
                      "Failed"
                    )
                  }
                  disabled={saving}
                >
                  Failed
                </button>

              </div>

            </div>


            {/* NOTES */}

            <div className="donation-detail-section">

              <h3>
                Admin Notes
              </h3>


              <textarea
                className="form-input"
                rows="4"
                placeholder="Add internal notes..."
                value={notes}
                onChange={(event) =>
                  setNotes(
                    event.target.value
                  )
                }
                disabled={saving}
              />


              <button
                type="button"
                className="btn-primary admin-save-notes"
                onClick={
                  saveNotes
                }
                disabled={saving}
              >

                {saving
                  ? "Saving..."
                  : "Save Notes"}

              </button>

            </div>


            {/* FOOTER */}

            <div className="admin-form-actions">

              <button
                type="button"
                className="btn-secondary"
                onClick={
                  closeDonation
                }
                disabled={saving}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};


export default AdminDonations;