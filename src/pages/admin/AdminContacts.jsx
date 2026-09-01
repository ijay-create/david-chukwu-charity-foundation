import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Mail,
  Eye,
  Check,
  Trash2,
  Search,
  X
} from "lucide-react";

import API from "../../api/axios";

import "../../styles/Admin.contacts.css";


/*
========================================
ADMIN CONTACTS
========================================
*/

const AdminContacts = () => {

  const [messages, setMessages] = useState([]);

  const [activeTab, setActiveTab] =
    useState("All");

  const [search, setSearch] =
    useState("");

  const [selectedMessage, setSelectedMessage] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState(false);


  /*
  ========================================
  FETCH CONTACT MESSAGES
  ========================================
  */

  const fetchMessages = async () => {

    try {

      setLoading(true);

      setError("");

      const response = await API.get(
        "/contact"
      );

      const responseData =
        response.data;


      /*
      --------------------------------------
      SUPPORT BACKEND RESPONSE FORMATS
      --------------------------------------
      */

      if (Array.isArray(responseData)) {

        setMessages(responseData);

        return;
      }


      if (
        Array.isArray(
          responseData?.contacts
        )
      ) {

        setMessages(
          responseData.contacts
        );

        return;
      }


      if (
        Array.isArray(
          responseData?.messages
        )
      ) {

        setMessages(
          responseData.messages
        );

        return;
      }


      /*
      --------------------------------------
      NO DATA
      --------------------------------------
      */

      setMessages([]);

    } catch (requestError) {

      console.error(
        "FETCH CONTACTS ERROR:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
        "Failed to load contact messages."
      );

      setMessages([]);

    } finally {

      setLoading(false);

    }
  };


  /*
  ========================================
  INITIAL LOAD
  ========================================
  */

  useEffect(() => {

    fetchMessages();

  }, []);


  /*
  ========================================
  FILTER MESSAGES
  ========================================
  */

  const filteredMessages = useMemo(() => {

    const searchValue =
      search
        .toLowerCase()
        .trim();


    return messages.filter(
      (message) => {

        const matchesTab =
          activeTab === "All" ||
          (
            activeTab === "Unread" &&
            message.status === "Unread"
          ) ||
          (
            activeTab === "Replied" &&
            message.status === "Replied"
          );


        const matchesSearch =
          message.name
            ?.toLowerCase()
            .includes(searchValue) ||

          message.email
            ?.toLowerCase()
            .includes(searchValue) ||

          message.subject
            ?.toLowerCase()
            .includes(searchValue) ||

          message.message
            ?.toLowerCase()
            .includes(searchValue) ||

          message.interestArea
            ?.toLowerCase()
            .includes(searchValue);


        return (
          matchesTab &&
          matchesSearch
        );

      }
    );

  }, [
    messages,
    activeTab,
    search
  ]);


  /*
  ========================================
  UPDATE MESSAGE STATUS
  ========================================
  */

  const updateStatus = async (
    id,
    status
  ) => {

    try {

      setActionLoading(true);

      const response =
        await API.put(
          `/contact/${id}/status`,
          {
            status
          }
        );


      /*
      --------------------------------------
      GET UPDATED MESSAGE
      --------------------------------------
      */

      const updatedMessage =
        response.data?.contact;


      /*
      --------------------------------------
      IF BACKEND RETURNS UPDATED MESSAGE
      --------------------------------------
      */

      if (updatedMessage) {

        setMessages(
          (previousMessages) =>
            previousMessages.map(
              (message) =>
                message._id === id
                  ? updatedMessage
                  : message
            )
        );


        setSelectedMessage(
          (previousMessage) =>
            previousMessage?._id === id
              ? updatedMessage
              : previousMessage
        );

      } else {

        /*
        ------------------------------------
        IF BACKEND DOES NOT RETURN MESSAGE
        RELOAD CONTACTS
        ------------------------------------
        */

        await fetchMessages();

      }

    } catch (requestError) {

      console.error(
        "UPDATE CONTACT STATUS ERROR:",
        requestError
      );

      alert(
        requestError.response?.data?.message ||
        "Failed to update message status."
      );

    } finally {

      setActionLoading(false);

    }
  };


  /*
  ========================================
  MARK AS READ
  ========================================
  */

  const markAsRead = async (id) => {

    await updateStatus(
      id,
      "Read"
    );

  };


  /*
  ========================================
  MARK AS REPLIED
  ========================================
  */

  const markAsReplied = async (id) => {

    await updateStatus(
      id,
      "Replied"
    );

  };


  /*
  ========================================
  DELETE MESSAGE
  ========================================
  */

  const deleteMessage = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this message?"
      );


    if (!confirmed) {

      return;

    }


    try {

      setActionLoading(true);

      await API.delete(
        `/contact/${id}`
      );


      /*
      --------------------------------------
      REMOVE FROM STATE
      --------------------------------------
      */

      setMessages(
        (previousMessages) =>
          previousMessages.filter(
            (message) =>
              message._id !== id
          )
      );


      /*
      --------------------------------------
      CLOSE MODAL IF OPEN
      --------------------------------------
      */

      if (
        selectedMessage?._id === id
      ) {

        setSelectedMessage(null);

      }

    } catch (requestError) {

      console.error(
        "DELETE CONTACT ERROR:",
        requestError
      );

      alert(
        requestError.response?.data?.message ||
        "Failed to delete message."
      );

    } finally {

      setActionLoading(false);

    }
  };


  /*
  ========================================
  OPEN MESSAGE
  ========================================
  */

  const openMessage = async (
    message
  ) => {

    setSelectedMessage(message);


    /*
    --------------------------------------
    MARK UNREAD MESSAGE AS READ
    --------------------------------------
    */

    if (
      message.status === "Unread"
    ) {

      await markAsRead(
        message._id
      );

    }

  };


  /*
  ========================================
  CLOSE MESSAGE
  ========================================
  */

  const closeMessage = () => {

    setSelectedMessage(null);

  };


  /*
  ========================================
  LOADING STATE
  ========================================
  */

  if (loading) {

    return (

      <div className="admin-contacts">

        <div className="admin-page-header">

          <div className="admin-page-header-content">

            <h1>
              Contact Messages
            </h1>

            <p>
              View and manage messages submitted through the website.
            </p>

          </div>

        </div>


        <div className="gallery-empty-state">

          <Mail />

          <h3>
            Loading messages...
          </h3>

          <p>
            Please wait while we load your contact messages.
          </p>

        </div>

      </div>

    );

  }


  /*
  ========================================
  PAGE
  ========================================
  */

  return (

    <div className="admin-contacts">


      {/* ==================================
          PAGE HEADER
      ================================== */}

      <div className="admin-page-header">

        <div className="admin-page-header-content">

          <h1>
            Contact Messages
          </h1>

          <p>
            View and manage messages submitted through the website.
          </p>

        </div>

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
          SEARCH
      ================================== */}

      <div className="gallery-toolbar">

        <div className="gallery-toolbar-left">

          <div className="gallery-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

        </div>

      </div>


      {/* ==================================
          TABS
      ================================== */}

      <div className="admin-tabs">

        {[
          "All",
          "Unread",
          "Replied"
        ].map((tab) => (

          <button
            key={tab}
            type="button"
            className={
              activeTab === tab
                ? "admin-tab active"
                : "admin-tab"
            }
            onClick={() =>
              setActiveTab(tab)
            }
          >

            {tab}

          </button>

        ))}

      </div>


      {/* ==================================
          MESSAGES
      ================================== */}

      <div className="admin-message-list">

        {filteredMessages.length === 0 ? (

          <div className="gallery-empty-state">

            <Mail />

            <h3>
              No messages found
            </h3>

            <p>
              There are no messages matching your current filters.
            </p>

          </div>

        ) : (

          filteredMessages.map(
            (message) => (

              <article
                className={`admin-message-card ${
                  message.status === "Unread"
                    ? "unread"
                    : ""
                }`}
                key={message._id}
              >


                {/* ==========================
                    MESSAGE ICON
                ========================== */}

                <div className="admin-message-icon">

                  <Mail size={20} />

                </div>


                {/* ==========================
                    MESSAGE CONTENT
                ========================== */}

                <div className="admin-message-content">


                  {/* MESSAGE TOP */}

                  <div className="admin-message-top">

                    <div>

                      <h3>
                        {message.name}
                      </h3>

                      <span>
                        {message.email}
                      </span>

                    </div>


                    <span
                      className={`message-status ${
                        message.status
                          ?.toLowerCase()
                      }`}
                    >

                      {message.status}

                    </span>

                  </div>


                  {/* SUBJECT */}

                  <h4>

                    {message.subject ||
                      message.interestArea ||
                      "Contact Message"}

                  </h4>


                  {/* MESSAGE PREVIEW */}

                  <p>

                    {message.message?.length > 100
                      ? `${message.message.substring(
                          0,
                          100
                        )}...`
                      : message.message}

                  </p>


                  {/* MESSAGE FOOTER */}

                  <div className="admin-message-footer">


                    <span>

                      {message.createdAt
                        ? new Date(
                            message.createdAt
                          ).toLocaleDateString()
                        : "No date"}

                    </span>


                    <div className="admin-message-actions">


                      {/* VIEW */}

                      <button
                        type="button"
                        onClick={() =>
                          openMessage(
                            message
                          )
                        }
                        title="View message"
                      >

                        <Eye size={16} />

                      </button>


                      {/* MARK AS READ */}

                      {message.status ===
                        "Unread" && (

                        <button
                          type="button"
                          onClick={() =>
                            markAsRead(
                              message._id
                            )
                          }
                          title="Mark as read"
                          disabled={
                            actionLoading
                          }
                        >

                          <Check
                            size={16}
                          />

                        </button>

                      )}


                      {/* DELETE */}

                      <button
                        type="button"
                        className="delete"
                        onClick={() =>
                          deleteMessage(
                            message._id
                          )
                        }
                        title="Delete message"
                        disabled={
                          actionLoading
                        }
                      >

                        <Trash2
                          size={16}
                        />

                      </button>

                    </div>

                  </div>

                </div>

              </article>

            )
          )

        )}

      </div>


      {/* ==================================
          MESSAGE MODAL
      ================================== */}

      {selectedMessage && (

        <div
          className="modal-overlay"
          onClick={closeMessage}
        >

          <div
            className="modal-content contact-message-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* ==========================
                MODAL HEADER
            ========================== */}

            <div className="contact-modal-header">

              <div>

                <span>
                  CONTACT MESSAGE
                </span>

                <h2>

                  {selectedMessage.subject ||
                    selectedMessage.interestArea ||
                    "Contact Message"}

                </h2>

              </div>


              <button
                type="button"
                className="gallery-modal-close"
                onClick={closeMessage}
              >

                <X size={20} />

              </button>

            </div>


            {/* ==========================
                SENDER
            ========================== */}

            <div className="contact-sender">

              <strong>
                {selectedMessage.name}
              </strong>

              <span>
                {selectedMessage.email}
              </span>


              {selectedMessage.phone && (

                <span>
                  {selectedMessage.phone}
                </span>

              )}


              {selectedMessage.interestArea && (

                <span>
                  Interest:{" "}
                  {selectedMessage.interestArea}
                </span>

              )}


              <span>

                {selectedMessage.createdAt
                  ? new Date(
                      selectedMessage.createdAt
                    ).toLocaleString()
                  : "No date"}

              </span>

            </div>


            {/* ==========================
                MESSAGE BODY
            ========================== */}

            <div className="contact-message-body">

              <p>
                {selectedMessage.message}
              </p>

            </div>


            {/* ==========================
                MODAL ACTIONS
            ========================== */}

            <div className="contact-modal-actions">

              <button
                type="button"
                className="btn-secondary"
                onClick={closeMessage}
              >

                Close

              </button>


              {selectedMessage.status !==
                "Replied" && (

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() =>
                    markAsReplied(
                      selectedMessage._id
                    )
                  }
                  disabled={
                    actionLoading
                  }
                >

                  <Check size={16} />

                  Mark as Replied

                </button>

              )}

            </div>

          </div>

        </div>

      )}

    </div>

  );

};


export default AdminContacts;