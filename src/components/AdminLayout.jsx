import {
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  useState,
} from "react";

import {
  Menu,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar";

import "../styles/Admin.layout.css";


/*
|--------------------------------------------------------------------------
| PAGE TITLES
|--------------------------------------------------------------------------
*/

const pageTitles = {

  "/admin/dashboard":
    "Dashboard",

  "/admin/gallery":
    "Gallery",

  "/admin/about":
    "About Us",

  "/admin/causes":
    "Our Causes",

  "/admin/impact":
    "Our Impact",

  "/admin/get-involved":
    "Get Involved",

  "/admin/outreach":
    "Outreach Programs",

  "/admin/donations":
    "Donations",

  /*
  |--------------------------------------------------------------------------
  | DONATION ACCOUNTS
  |--------------------------------------------------------------------------
  */

  "/admin/donation-accounts":
    "Donation Accounts",

  "/admin/contacts":
    "Contact Messages",

  "/admin/volunteers":
    "Volunteers",

  "/admin/settings":
    "Settings",

};


/*
|--------------------------------------------------------------------------
| ADMIN LAYOUT
|--------------------------------------------------------------------------
*/

const AdminLayout = () => {

  const location =
    useLocation();


  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | PAGE TITLE
  |--------------------------------------------------------------------------
  */

  const pageTitle =
    pageTitles[
      location.pathname
    ] || "Admin";


  /*
  |--------------------------------------------------------------------------
  | SIDEBAR
  |--------------------------------------------------------------------------
  */

  const openSidebar = () => {

    setSidebarOpen(true);

  };


  const closeSidebar = () => {

    setSidebarOpen(false);

  };


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <div className="admin-layout">

      {/* ==============================================================
          SIDEBAR
      ============================================================== */}

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />


      {/* ==============================================================
          MAIN
      ============================================================== */}

      <div className="admin-main">

        {/* ============================================================
            HEADER
        ============================================================ */}

        <header className="admin-header">

          <div className="admin-header-left">

            <button
              type="button"
              className="admin-menu-button"
              onClick={openSidebar}
              aria-label="Open admin menu"
            >

              <Menu size={22} />

            </button>


            <div className="admin-page-title">

              <h1>
                {pageTitle}
              </h1>

              <span>
                Administration Panel
              </span>

            </div>

          </div>


          {/* ==========================================================
              HEADER RIGHT
          ========================================================== */}

          <div className="admin-header-right">

            <div className="admin-header-foundation">

              David Chukwu Charity Foundation

            </div>

          </div>

        </header>


        {/* ============================================================
            PAGE CONTENT
        ============================================================ */}

        <main className="admin-content">

          <Outlet />

        </main>

      </div>

    </div>

  );

};


export default AdminLayout;