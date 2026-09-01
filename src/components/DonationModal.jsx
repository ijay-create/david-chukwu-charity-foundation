import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  HandHeart,
  X,
  Landmark,
  User,
  CreditCard,
  Copy,
  ShieldCheck,
  Heart,
  Check,
} from "lucide-react";

import API from "../api/axios";

import "../styles/DonationModal.css";


/*
|--------------------------------------------------------------------------
| DONATION MODAL
|--------------------------------------------------------------------------
|
| Public donation accounts come directly from MongoDB.
|
| PUBLIC API:
|
| GET /api/donation-accounts
|
| The backend returns only ACTIVE donation accounts.
|
| Account position is determined by:
|
| order: 1 = Account 1
| order: 2 = Account 2
|
|--------------------------------------------------------------------------
*/

const MAX_DONATION_ACCOUNTS = 2;


const DonationModal = ({ onClose }) => {

  const modalRef = useRef(null);

  const closeButtonRef = useRef(null);


  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [accounts, setAccounts] = useState([]);

  const [copiedAccount, setCopiedAccount] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /*
  |--------------------------------------------------------------------------
  | FETCH PUBLIC DONATION ACCOUNTS
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  |
  | We use:
  |
  | GET /donation-accounts
  |
  | NOT:
  |
  | GET /donation-accounts/all
  |
  | because the public endpoint already returns only active accounts.
  |
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    let isMounted = true;


    const fetchDonationAccounts = async () => {

      try {

        setLoading(true);

        setError("");


        /*
        |--------------------------------------------------------------------------
        | GET ACCOUNTS FROM BACKEND
        |--------------------------------------------------------------------------
        */

        const response =
          await API.get(
            "/donation-accounts"
          );


        if (!isMounted) {
          return;
        }


        /*
        |--------------------------------------------------------------------------
        | READ RESPONSE
        |--------------------------------------------------------------------------
        |
        | Backend response:
        |
        | {
        |   success: true,
        |   data: [...]
        | }
        |
        |--------------------------------------------------------------------------
        */

        const responseData =
          response.data;


        const accountsData =
          Array.isArray(
            responseData?.data
          )
            ? responseData.data
            : [];


        /*
        |--------------------------------------------------------------------------
        | SORT USING DATABASE ORDER
        |--------------------------------------------------------------------------
        |
        | This is very important.
        |
        | We DO NOT use array index to determine whether an
        | account is Account 1 or Account 2.
        |
        | MongoDB:
        |
        | order: 1
        |
        | means Account 1.
        |
        | order: 2
        |
        | means Account 2.
        |--------------------------------------------------------------------------
        */

        const sortedAccounts =
          [...accountsData]
            .filter(
              (account) =>
                account &&
                account.active !== false
            )
            .sort(
              (a, b) =>
                Number(a.order || 0) -
                Number(b.order || 0)
            )
            .slice(
              0,
              MAX_DONATION_ACCOUNTS
            );


        /*
        |--------------------------------------------------------------------------
        | SAVE ACCOUNTS
        |--------------------------------------------------------------------------
        */

        setAccounts(
          sortedAccounts
        );


        /*
        |--------------------------------------------------------------------------
        | DEBUG
        |--------------------------------------------------------------------------
        */

        console.log(
          "PUBLIC DONATION ACCOUNTS:",
          sortedAccounts
        );


        console.log(
          "ACCOUNT 1:",
          sortedAccounts.find(
            (account) =>
              Number(account.order) === 1
          )
        );


        console.log(
          "ACCOUNT 2:",
          sortedAccounts.find(
            (account) =>
              Number(account.order) === 2
          )
        );

      } catch (error) {

        console.error(
          "FETCH PUBLIC DONATION ACCOUNTS ERROR:",
          error
        );


        if (!isMounted) {
          return;
        }


        setError(
          error.response?.data?.message ||
          "Unable to load donation account details."
        );

      } finally {

        if (isMounted) {

          setLoading(false);

        }

      }

    };


    fetchDonationAccounts();


    return () => {

      isMounted = false;

    };

  }, []);


  /*
  |--------------------------------------------------------------------------
  | MODAL ACCESSIBILITY
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const previousOverflow =
      document.body.style.overflow;


    document.body.style.overflow =
      "hidden";


    /*
    |--------------------------------------------------------------------------
    | FOCUS CLOSE BUTTON
    |--------------------------------------------------------------------------
    */

    const focusTimer =
      setTimeout(() => {

        closeButtonRef.current?.focus();

      }, 0);


    /*
    |--------------------------------------------------------------------------
    | KEYBOARD CONTROLS
    |--------------------------------------------------------------------------
    */

    const handleKeyDown = (event) => {

      /*
      |--------------------------------------------------------------------------
      | ESCAPE
      |--------------------------------------------------------------------------
      */

      if (
        event.key === "Escape"
      ) {

        onClose();

        return;

      }


      /*
      |--------------------------------------------------------------------------
      | FOCUS TRAP
      |--------------------------------------------------------------------------
      */

      if (
        event.key !== "Tab"
      ) {

        return;

      }


      const focusableElements =
        modalRef.current?.querySelectorAll(
          'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );


      if (
        !focusableElements?.length
      ) {

        return;

      }


      const firstElement =
        focusableElements[0];


      const lastElement =
        focusableElements[
          focusableElements.length - 1
        ];


      /*
      |--------------------------------------------------------------------------
      | SHIFT + TAB
      |--------------------------------------------------------------------------
      */

      if (
        event.shiftKey &&
        document.activeElement ===
          firstElement
      ) {

        event.preventDefault();

        lastElement.focus();

      }


      /*
      |--------------------------------------------------------------------------
      | TAB
      |--------------------------------------------------------------------------
      */

      if (
        !event.shiftKey &&
        document.activeElement ===
          lastElement
      ) {

        event.preventDefault();

        firstElement.focus();

      }

    };


    document.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {

      clearTimeout(
        focusTimer
      );


      document.body.style.overflow =
        previousOverflow;


      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [onClose]);


  /*
  |--------------------------------------------------------------------------
  | CLOSE WHEN CLICKING OUTSIDE
  |--------------------------------------------------------------------------
  */

  const handleOverlayClick = (
    event
  ) => {

    if (
      event.target ===
      event.currentTarget
    ) {

      onClose();

    }

  };


  /*
  |--------------------------------------------------------------------------
  | COPY ACCOUNT NUMBER
  |--------------------------------------------------------------------------
  */

  const handleCopy = async (
    accountNumber,
    accountId
  ) => {

    try {

      if (!accountNumber) {
        return;
      }


      await navigator.clipboard.writeText(
        String(accountNumber)
      );


      setCopiedAccount(
        accountId
      );


      setTimeout(() => {

        setCopiedAccount(null);

      }, 2000);

    } catch (error) {

      console.error(
        "UNABLE TO COPY ACCOUNT NUMBER:",
        error
      );

    }

  };


  /*
  |--------------------------------------------------------------------------
  | GET ACCOUNT SLOT
  |--------------------------------------------------------------------------
  |
  | Database order is the source of truth.
  |
  |--------------------------------------------------------------------------
  */

  const getAccountSlot = (
    account
  ) => {

    const order =
      Number(account?.order);


    if (
      order === 2
    ) {

      return 2;

    }


    return 1;

  };


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <div
      className="modal-overlay"
      onMouseDown={
        handleOverlayClick
      }
      role="presentation"
    >

      <div
        className="donation-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="donation-modal-title"
        aria-describedby="donation-modal-description"
      >


        {/* ================================================================
            CLOSE BUTTON
        ================================================================ */}

        <button
          ref={closeButtonRef}
          className="modal-close"
          onClick={onClose}
          aria-label="Close donation modal"
          type="button"
        >

          <X />

        </button>


        {/* ================================================================
            HEADER
        ================================================================ */}

        <div className="donation-header">

          <div className="donation-main-icon">

            <HandHeart />

          </div>


          <span className="donation-label">

            MAKE A DIFFERENCE

          </span>


          <h2 id="donation-modal-title">

            Support Our Mission

          </h2>


          <p id="donation-modal-description">

            Your contribution helps us extend
            care and support to those who need
            it the most.

          </p>

        </div>


        {/* ================================================================
            BANK TRANSFER
        ================================================================ */}

        <div className="transfer-section">

          <div className="transfer-heading">

            <span className="transfer-line" />


            <div className="transfer-title">

              <span className="transfer-icon">

                <Landmark />

              </span>


              <span>

                BANK TRANSFER

              </span>

            </div>


            <span className="transfer-line" />

          </div>


          <p className="transfer-description">

            You can support our work by making
            a direct transfer to either of the
            accounts below.

          </p>

        </div>


        {/* ================================================================
            DONATION ACCOUNTS
        ================================================================ */}

        <div className="accounts-grid">


          {/* ==============================================================
              LOADING
          ============================================================== */}

          {loading && (

            <div className="donation-status">

              <div className="donation-loading-icon">

                <Landmark />

              </div>


              <p>

                Loading donation accounts...

              </p>

            </div>

          )}


          {/* ==============================================================
              ERROR
          ============================================================== */}

          {!loading &&
            error && (

            <div className="donation-status donation-status-error">

              <div className="donation-error-icon">

                <X />

              </div>


              <p>

                {error}

              </p>

            </div>

          )}


          {/* ==============================================================
              NO ACCOUNTS
          ============================================================== */}

          {!loading &&
            !error &&
            accounts.length === 0 && (

            <div className="donation-status">

              <div className="donation-loading-icon">

                <Landmark />

              </div>


              <p>

                Donation account details are
                currently unavailable.

              </p>

            </div>

          )}


          {/* ==============================================================
              ACCOUNT CARDS
          ============================================================== */}

          {!loading &&
            !error &&
            accounts.length > 0 && (

            <>

              {accounts.map(
                (account, index) => {

                  /*
                  |--------------------------------------------------------------------------
                  | DATABASE ID
                  |--------------------------------------------------------------------------
                  */

                  const accountId =
                    account._id ||
                    account.id ||
                    `account-${index}`;


                  /*
                  |--------------------------------------------------------------------------
                  | DATABASE ACCOUNT SLOT
                  |--------------------------------------------------------------------------
                  |
                  | IMPORTANT:
                  |
                  | We use account.order.
                  |
                  | NOT index + 1.
                  |--------------------------------------------------------------------------
                  */

                  const accountSlot =
                    getAccountSlot(
                      account
                    );


                  return (

                    <article
                      className={`account-card account-card-${accountSlot}`}
                      key={accountId}
                    >


                      {/* =================================================
                          ACCOUNT BADGE
                      ================================================= */}

                      <span className="account-badge">

                        ACCOUNT {accountSlot}

                      </span>


                      {/* =================================================
                          ACCOUNT DETAILS
                      ================================================= */}

                      <div className="account-details">


                        {/* ===============================================
                            BANK NAME
                        =============================================== */}

                        <div className="account-row">

                          <span className="account-icon">

                            <Landmark />

                          </span>


                          <div>

                            <span className="account-label">

                              Bank Name

                            </span>


                            <span className="account-value">

                              {account.bank ||
                                "Bank information unavailable"}

                            </span>

                          </div>

                        </div>


                        {/* ===============================================
                            ACCOUNT NAME
                        =============================================== */}

                        <div className="account-row">

                          <span className="account-icon">

                            <User />

                          </span>


                          <div>

                            <span className="account-label">

                              Account Name

                            </span>


                            <span className="account-value">

                              {account.name ||
                                "Account name unavailable"}

                            </span>

                          </div>

                        </div>


                        {/* ===============================================
                            ACCOUNT NUMBER
                        =============================================== */}

                        <div className="account-row">

                          <span className="account-icon">

                            <CreditCard />

                          </span>


                          <div>

                            <span className="account-label">

                              Account Number

                            </span>


                            <span className="account-number">

                              {account.number ||
                                "Account number unavailable"}

                            </span>

                          </div>

                        </div>


                        {/* ===============================================
                            ACCOUNT SLOT
                        =============================================== */}

                        <div className="account-row">

                          <span className="account-icon">

                            <Check />

                          </span>


                          <div>

                            <span className="account-label">

                              Donation Account

                            </span>


                            <span className="account-value">

                              Account {accountSlot}

                            </span>

                          </div>

                        </div>


                      </div>


                      {/* =================================================
                          COPY BUTTON
                      ================================================= */}

                      <button
                        className={`copy-account-btn ${
                          copiedAccount ===
                          accountId
                            ? "copied"
                            : ""
                        }`}
                        type="button"
                        onClick={() =>
                          handleCopy(
                            account.number,
                            accountId
                          )
                        }
                        disabled={
                          !account.number
                        }
                        aria-label={`Copy account number for ${
                          account.bank ||
                          "donation account"
                        }`}
                      >

                        {copiedAccount ===
                        accountId ? (

                          <>

                            <Check />

                            Copied!

                          </>

                        ) : (

                          <>

                            <Copy />

                            Copy

                          </>

                        )}

                      </button>

                    </article>

                  );

                }
              )}

            </>

          )}

        </div>


        {/* ================================================================
            ACCOUNT COUNT MESSAGE
        ================================================================ */}

        {!loading &&
          !error &&
          accounts.length === 1 && (

          <div className="donation-status donation-one-account">

            <p>

              Only one active donation account
              is currently available.

            </p>

          </div>

        )}


        {/* ================================================================
            DONATION NOTICE
        ================================================================ */}

        <div className="donation-notice">

          <ShieldCheck
            className="notice-icon"
          />


          <p>

            Please use either of the active
            accounts above to support our
            mission. Kindly send proof of
            payment to{" "}


            <strong>

              info@davidchukwu.org.ng

            </strong>

          </p>

        </div>


        {/* ================================================================
            FOOTER
        ================================================================ */}

        <div className="donation-footer">

          <div className="footer-divider">

            <span />

            <Heart />

            <span />

          </div>


          <p>

            Thank you for your support.

          </p>

        </div>

      </div>

    </div>

  );

};


export default DonationModal;