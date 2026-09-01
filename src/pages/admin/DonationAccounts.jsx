import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  Pencil,
  Landmark,
  CreditCard,
  User,
  Check,
  X,
  Save,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import API from "../../api/axios";

import "../../styles/Admin.donationAccounts.css";


/*
|--------------------------------------------------------------------------
| DONATION ACCOUNT CONFIGURATION
|--------------------------------------------------------------------------
*/

const MAX_DONATION_ACCOUNTS = 2;

const DEFAULT_ACCOUNT_NAME =
  "David Chukwu Charity Foundation";


/*
|--------------------------------------------------------------------------
| INITIAL FORM
|--------------------------------------------------------------------------
*/

const initialForm = {
  bank: "",
  name: DEFAULT_ACCOUNT_NAME,
  number: "",
  active: true,
  order: 1,
};


/*
|--------------------------------------------------------------------------
| DONATION ACCOUNTS
|--------------------------------------------------------------------------
*/

const DonationAccounts = () => {

  const [accounts, setAccounts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(
    initialForm
  );


  /*
  |--------------------------------------------------------------------------
  | FETCH ACCOUNTS
  |--------------------------------------------------------------------------
  */

  const fetchAccounts = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await API.get(
        "/donation-accounts/all"
      );

      const data =
        response.data?.data;


      /*
      |--------------------------------------------------------------------------
      | SORT ACCOUNTS
      |--------------------------------------------------------------------------
      |
      | Always keep Account 1 first and Account 2 second.
      |
      */

      const sortedAccounts =
        Array.isArray(data)
          ? [...data]
              .sort(
                (a, b) =>
                  Number(a.order || 0) -
                  Number(b.order || 0)
              )
              .slice(
                0,
                MAX_DONATION_ACCOUNTS
              )
          : [];


      setAccounts(
        sortedAccounts
      );

    } catch (error) {

      console.error(
        "FETCH DONATION ACCOUNTS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load donation accounts."
      );

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

    fetchAccounts();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | FORM INPUT
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {

    const {
      name,
      value,
      type,
      checked,
    } = event.target;


    setForm((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

  };


  /*
  |--------------------------------------------------------------------------
  | ADD ACCOUNT
  |--------------------------------------------------------------------------
  */

  const handleAdd = () => {

    /*
    |--------------------------------------------------------------------------
    | NEVER ALLOW A THIRD ACCOUNT
    |--------------------------------------------------------------------------
    */

    if (
      accounts.length >=
      MAX_DONATION_ACCOUNTS
    ) {

      setError(
        "Only two donation accounts are allowed. Please edit Account 1 or Account 2."
      );

      return;

    }


    /*
    |--------------------------------------------------------------------------
    | DETERMINE AVAILABLE ACCOUNT SLOT
    |--------------------------------------------------------------------------
    */

    const existingOrders =
      accounts.map(
        (account) =>
          Number(account.order)
      );


    const accountOrder =
      !existingOrders.includes(1)
        ? 1
        : 2;


    setEditingId(null);


    setForm({
      ...initialForm,
      order: accountOrder,
    });


    setError("");
    setSuccess("");
    setShowForm(true);

  };


  /*
  |--------------------------------------------------------------------------
  | EDIT ACCOUNT
  |--------------------------------------------------------------------------
  */

  const handleEdit = (account) => {

    const accountId =
      account._id ||
      account.id;


    setEditingId(
      accountId
    );


    setForm({
      bank:
        account.bank ||
        "",

      name:
        account.name ||
        DEFAULT_ACCOUNT_NAME,

      number:
        account.number ||
        "",

      active:
        account.active !== false,

      order:
        Number(account.order) === 2
          ? 2
          : 1,
    });


    setError("");
    setSuccess("");
    setShowForm(true);

  };


  /*
  |--------------------------------------------------------------------------
  | CANCEL FORM
  |--------------------------------------------------------------------------
  */

  const handleCancel = () => {

    if (saving) {
      return;
    }


    setShowForm(false);

    setEditingId(null);

    setForm(initialForm);

    setError("");

  };


  /*
  |--------------------------------------------------------------------------
  | SAVE ACCOUNT
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    const bank =
      form.bank.trim();

    const name =
      form.name.trim();

    const number =
      form.number.trim();


    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    if (!bank) {

      setError(
        "Please enter the bank name."
      );

      return;

    }


    if (!name) {

      setError(
        "Please enter the account name."
      );

      return;

    }


    if (!number) {

      setError(
        "Please enter the account number."
      );

      return;

    }


    if (!/^\d+$/.test(number)) {

      setError(
        "Account number must contain numbers only."
      );

      return;

    }


    if (number.length !== 10) {

      setError(
        "Nigerian bank account numbers must contain exactly 10 digits."
      );

      return;

    }


    /*
    |--------------------------------------------------------------------------
    | ONLY ORDER 1 OR 2
    |--------------------------------------------------------------------------
    */

    const accountOrder =
      Number(form.order) === 2
        ? 2
        : 1;


    /*
    |--------------------------------------------------------------------------
    | PREVENT THIRD ACCOUNT
    |--------------------------------------------------------------------------
    */

    if (
      !editingId &&
      accounts.length >=
        MAX_DONATION_ACCOUNTS
    ) {

      setError(
        "You already have two donation accounts. Edit an existing account instead."
      );

      return;

    }


    /*
    |--------------------------------------------------------------------------
    | PREVENT DUPLICATE ORDER
    |--------------------------------------------------------------------------
    */

    if (!editingId) {

      const orderAlreadyExists =
        accounts.some(
          (account) =>
            Number(account.order) ===
            accountOrder
        );


      if (orderAlreadyExists) {

        setError(
          `Account ${accountOrder} already exists. Please edit it instead.`
        );

        return;

      }

    }


    try {

      setSaving(true);


      const payload = {
        bank,
        name,
        number,
        active: Boolean(
          form.active
        ),
        order: accountOrder,
      };


      /*
      |--------------------------------------------------------------------------
      | UPDATE EXISTING ACCOUNT
      |--------------------------------------------------------------------------
      */

      if (editingId) {

        const response =
          await API.put(
            `/donation-accounts/${editingId}`,
            payload
          );


        setSuccess(
          response.data?.message ||
            `Account ${accountOrder} updated successfully.`
        );

      }


      /*
      |--------------------------------------------------------------------------
      | CREATE ACCOUNT
      |--------------------------------------------------------------------------
      */

      else {

        const response =
          await API.post(
            "/donation-accounts",
            payload
          );


        setSuccess(
          response.data?.message ||
            `Account ${accountOrder} created successfully.`
        );

      }


      /*
      |--------------------------------------------------------------------------
      | REFRESH
      |--------------------------------------------------------------------------
      */

      await fetchAccounts();


      setShowForm(false);

      setEditingId(null);

      setForm(initialForm);

    } catch (error) {

      console.error(
        "SAVE DONATION ACCOUNT ERROR:",
        error
      );


      setError(
        error.response?.data?.message ||
          "Unable to save donation account."
      );

    } finally {

      setSaving(false);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | TOGGLE ACTIVE STATUS
  |--------------------------------------------------------------------------
  */

  const handleToggleActive = async (
    account
  ) => {

    const accountId =
      account._id ||
      account.id;


    try {

      setError("");
      setSuccess("");


      const response =
        await API.put(
          `/donation-accounts/${accountId}`,
          {
            active:
              !account.active,
          }
        );


      setSuccess(
        response.data?.message ||
          `Account ${
            account.order
          } status updated successfully.`
      );


      await fetchAccounts();

    } catch (error) {

      console.error(
        "TOGGLE DONATION ACCOUNT ERROR:",
        error
      );


      setError(
        error.response?.data?.message ||
          "Unable to update account status."
      );

    }

  };


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <section className="admin-donation-accounts">


      {/* ================================================================
          HEADER
      ================================================================ */}

      <div className="admin-donation-header">

        <div>

          <span className="admin-donation-eyebrow">
            DONATIONS
          </span>

          <h2>
            Donation Accounts
          </h2>

          <p>
            Manage the two bank accounts
            displayed on the public
            donation modal.
          </p>

        </div>


        <div className="admin-donation-actions">

          <button
            type="button"
            className="admin-donation-refresh"
            onClick={fetchAccounts}
            disabled={
              loading ||
              saving
            }
          >

            <RefreshCw
              size={18}
              className={
                loading
                  ? "admin-spin"
                  : ""
              }
            />

            Refresh

          </button>


          {accounts.length <
            MAX_DONATION_ACCOUNTS && (

            <button
              type="button"
              className="admin-donation-add"
              onClick={handleAdd}
              disabled={saving}
            >

              <Plus size={19} />

              Add Account

            </button>

          )}

        </div>

      </div>


      {/* ================================================================
          ACCOUNT CONFIGURATION
      ================================================================ */}

      <div className="admin-donation-limit">

        <div className="admin-donation-limit-icon">

          <Landmark size={19} />

        </div>


        <div>

          <strong>
            Foundation Donation Accounts
          </strong>

          <span>
            {accounts.length} of 2 accounts configured
          </span>

        </div>


        <div className="admin-donation-limit-status">

          {accounts.length === 2 ? (

            <>
              <Check size={16} />

              Two accounts configured
            </>

          ) : (

            <>
              <AlertCircle size={16} />

              {2 - accounts.length} account remaining
            </>

          )}

        </div>

      </div>


      {/* ================================================================
          ALERTS
      ================================================================ */}

      {error && (

        <div className="admin-donation-alert error">

          <AlertCircle size={18} />

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

            <X size={16} />

          </button>

        </div>

      )}


      {success && (

        <div className="admin-donation-alert success">

          <Check size={18} />

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

            <X size={16} />

          </button>

        </div>

      )}


      {/* ================================================================
          FORM
      ================================================================ */}

      {showForm && (

        <div className="admin-donation-form-card">

          <div className="admin-donation-form-header">

            <div>

              <span className="admin-form-eyebrow">

                {editingId
                  ? `ACCOUNT ${
                      form.order
                    }`
                  : `ACCOUNT ${
                      form.order
                    }`}

              </span>


              <h3>

                {editingId
                  ? "Edit Donation Account"
                  : "Add Donation Account"}

              </h3>


              <p>
                Enter the banking information
                for this donation account.
              </p>

            </div>


            <button
              type="button"
              className="admin-donation-form-close"
              onClick={handleCancel}
              disabled={saving}
              aria-label="Close form"
            >

              <X size={20} />

            </button>

          </div>


          <form
            className="admin-donation-form"
            onSubmit={handleSubmit}
          >


            {/* ==========================================================
                BANK
            ========================================================== */}

            <div className="admin-form-group">

              <label htmlFor="bank">
                Bank Name
              </label>

              <div className="admin-input-wrapper">

                <Landmark size={18} />

                <input
                  id="bank"
                  name="bank"
                  type="text"
                  value={form.bank}
                  onChange={handleChange}
                  placeholder="e.g. United Bank for Africa"
                  disabled={saving}
                  autoComplete="organization"
                />

              </div>

            </div>


            {/* ==========================================================
                ACCOUNT NAME
            ========================================================== */}

            <div className="admin-form-group">

              <label htmlFor="name">
                Account Name
              </label>

              <div className="admin-input-wrapper">

                <User size={18} />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={DEFAULT_ACCOUNT_NAME}
                  disabled={saving}
                  autoComplete="name"
                />

              </div>

            </div>


            {/* ==========================================================
                ACCOUNT NUMBER
            ========================================================== */}

            <div className="admin-form-group">

              <label htmlFor="number">
                Account Number
              </label>

              <div className="admin-input-wrapper">

                <CreditCard size={18} />

                <input
                  id="number"
                  name="number"
                  type="text"
                  inputMode="numeric"
                  value={form.number}
                  onChange={handleChange}
                  placeholder="Enter 10-digit account number"
                  autoComplete="off"
                  maxLength={10}
                  disabled={saving}
                />

              </div>

              <small>
                Enter exactly 10 digits.
                This number will be visible
                to donors.
              </small>

            </div>


            {/* ==========================================================
                ACCOUNT SLOT
            ========================================================== */}

            <div className="admin-form-group">

              <label htmlFor="order">
                Account Slot
              </label>

              <select
                id="order"
                name="order"
                value={form.order}
                onChange={handleChange}
                disabled={
                  saving ||
                  Boolean(editingId)
                }
              >

                <option value="1">
                  Account 1
                </option>

                <option value="2">
                  Account 2
                </option>

              </select>

              <small>
                The foundation has exactly
                two donation account slots.
              </small>

            </div>


            {/* ==========================================================
                ACTIVE
            ========================================================== */}

            <div className="admin-donation-active-control">

              <label>

                <input
                  type="checkbox"
                  name="active"
                  checked={
                    form.active
                  }
                  onChange={
                    handleChange
                  }
                  disabled={saving}
                />

                <span>
                  Active Account
                </span>

              </label>


              <small>
                Active accounts are visible
                on the public donation modal.
              </small>

            </div>


            {/* ==========================================================
                FORM ACTIONS
            ========================================================== */}

            <div className="admin-donation-form-actions">

              <button
                type="button"
                className="admin-donation-cancel"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>


              <button
                type="submit"
                className="admin-donation-save"
                disabled={saving}
              >

                {saving ? (

                  <>
                    <RefreshCw
                      size={18}
                      className="admin-spin"
                    />

                    Saving...

                  </>

                ) : (

                  <>
                    <Save size={18} />

                    {editingId
                      ? "Update Account"
                      : "Save Account"}

                  </>

                )}

              </button>

            </div>

          </form>

        </div>

      )}


      {/* ================================================================
          ACCOUNT LIST
      ================================================================ */}

      <div className="admin-donation-list">

        <div className="admin-donation-list-header">

          <div>

            <span className="admin-form-eyebrow">
              BANKING INFORMATION
            </span>

            <h3>
              The Two Donation Accounts
            </h3>

            <p>
              These are the two accounts
              donors will see when they
              click Donate.
            </p>

          </div>


          <div className="admin-donation-count">

            {accounts.length}

            <span>
              / 2
            </span>

          </div>

        </div>


        {/* ================================================================
            LOADING
        ================================================================ */}

        {loading && (

          <div className="admin-donation-empty">

            <RefreshCw
              size={28}
              className="admin-spin"
            />

            <h4>
              Loading donation accounts...
            </h4>

            <p>
              Please wait while we retrieve
              the two account details.
            </p>

          </div>

        )}


        {/* ================================================================
            EMPTY
        ================================================================ */}

        {!loading &&
          accounts.length === 0 && (

          <div className="admin-donation-empty">

            <div className="admin-empty-icon">

              <Landmark size={34} />

            </div>

            <h4>
              Donation accounts not configured
            </h4>

            <p>
              Add Account 1 and Account 2
              so donors can make direct
              transfers to the foundation.
            </p>

            <button
              type="button"
              onClick={handleAdd}
              className="admin-donation-add"
            >

              <Plus size={18} />

              Add Account 1

            </button>

          </div>

        )}


        {/* ================================================================
            ACCOUNT CARDS
        ================================================================ */}

        {!loading &&
          accounts.length > 0 && (

          <div className="admin-donation-grid">

            {accounts.map(
              (account, index) => {

                const accountNumber =
                  Number(account.order) === 2
                    ? 2
                    : 1;

                const accountId =
                  account._id ||
                  account.id ||
                  index;


                return (

                  <article
                    className={
                      `admin-account-card ${
                        account.active
                          ? "is-active"
                          : "is-inactive"
                      }`
                    }
                    key={accountId}
                  >

                    {/* ==================================================
                        CARD HEADER
                    ================================================== */}

                    <div className="admin-account-card-top">

                      <span className="admin-account-number">

                        ACCOUNT{" "}
                        {accountNumber}

                      </span>


                      <span
                        className={
                          `admin-account-status ${
                            account.active
                              ? "active"
                              : "inactive"
                          }`
                        }
                      >

                        {account.active ? (

                          <>
                            <Check size={13} />
                            Active
                          </>

                        ) : (

                          <>
                            <X size={13} />
                            Inactive
                          </>

                        )}

                      </span>

                    </div>


                    {/* ==================================================
                        BANK
                    ================================================== */}

                    <div className="admin-account-bank">

                      <div className="admin-account-icon">

                        <Landmark size={21} />

                      </div>


                      <div>

                        <span>
                          Bank
                        </span>

                        <strong>
                          {account.bank}
                        </strong>

                      </div>

                    </div>


                    {/* ==================================================
                        ACCOUNT NAME
                    ================================================== */}

                    <div className="admin-account-detail">

                      <span>
                        Account Name
                      </span>

                      <strong>
                        {account.name}
                      </strong>

                    </div>


                    {/* ==================================================
                        ACCOUNT NUMBER
                    ================================================== */}

                    <div className="admin-account-detail">

                      <span>
                        Account Number
                      </span>

                      <strong className="account-number-value">
                        {account.number}
                      </strong>

                    </div>


                    {/* ==================================================
                        ACCOUNT SLOT
                    ================================================== */}

                    <div className="admin-account-detail">

                      <span>
                        Account Slot
                      </span>

                      <strong>
                        Account {accountNumber}
                      </strong>

                    </div>


                    {/* ==================================================
                        PUBLIC STATUS
                    ================================================== */}

                    <div className="admin-account-public-status">

                      <span
                        className={
                          account.active
                            ? "status-dot active"
                            : "status-dot inactive"
                        }
                      />

                      <span>

                        {account.active
                          ? "Visible on public donation modal"
                          : "Hidden from public donation modal"}

                      </span>

                    </div>


                    {/* ==================================================
                        ACTIONS
                    ================================================== */}

                    <div className="admin-account-actions">


                      {/* =================================================
                          ACTIVATE / DEACTIVATE
                      ================================================= */}

                      <button
                        type="button"
                        className={
                          account.active
                            ? "deactivate"
                            : "activate"
                        }
                        onClick={() =>
                          handleToggleActive(
                            account
                          )
                        }
                      >

                        {account.active ? (

                          <>
                            <X size={16} />

                            Deactivate
                          </>

                        ) : (

                          <>
                            <Check size={16} />

                            Activate
                          </>

                        )}

                      </button>


                      {/* =================================================
                          EDIT
                      ================================================= */}

                      <button
                        type="button"
                        className="edit"
                        onClick={() =>
                          handleEdit(
                            account
                          )
                        }
                      >

                        <Pencil size={16} />

                        Edit

                      </button>

                    </div>

                  </article>

                );

              }
            )}

          </div>

        )}

      </div>


      {/* ================================================================
          SECOND ACCOUNT REMINDER
      ================================================================ */}

      {!loading &&
        accounts.length === 1 && (

        <div className="admin-donation-missing">

          <div className="admin-donation-missing-icon">

            <AlertCircle size={20} />

          </div>


          <div>

            <strong>
              Account 2 is not configured
            </strong>

            <p>
              The foundation requires exactly
              two donation accounts. Please
              configure Account 2.
            </p>

          </div>


          <button
            type="button"
            onClick={handleAdd}
          >

            <Plus size={17} />

            Add Account 2

          </button>

        </div>

      )}


    </section>

  );

};


export default DonationAccounts;