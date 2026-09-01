import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

/*
==================================================
GLOBAL COMPONENTS
==================================================
*/

import Navbar from "./components/Navbar";
import DonationModal from "./components/DonationModal";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import ScrollToTop from "./components/ScrollToTop";

import Footer from "./layouts/Footer";

/*
==================================================
PUBLIC PAGES
==================================================
*/

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import OurCauses from "./pages/OurCauses";
import OurImpact from "./pages/OurImpact";
import Gallery from "./pages/Gallery";
import GetInvolved from "./pages/GetInvolved";

/*
==================================================
ADMIN PAGES
==================================================
*/

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import AdminGallery from "./pages/admin/AdminGallery";
import AdminAbout from "./pages/admin/AdminAbout";
import AdminCauses from "./pages/admin/AdminCauses";
import AdminImpact from "./pages/admin/AdminImpact";
import AdminGetInvolved from "./pages/admin/AdminGetInvolved";
import AdminOutreach from "./pages/admin/AdminOutreach";
import AdminDonations from "./pages/admin/AdminDonations";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminVolunteers from "./pages/admin/AdminVolunteers";
import AdminSettings from "./pages/admin/AdminSettings";

/*
==================================================
FIXED IMPORT
==================================================

App.jsx is inside:

src/App.jsx

Therefore the correct path is:

./pages/admin/DonationAccounts

NOT:

../pages/admin/DonationAccounts
==================================================
*/

import DonationAccounts from "./pages/admin/DonationAccounts";

/*
==================================================
PUBLIC LAYOUT
==================================================
*/

const PublicLayout = ({
  children,
  onDonateClick,
}) => {
  return (
    <>
      <Navbar
        onDonateClick={onDonateClick}
      />

      {children}

      <Footer />
    </>
  );
};

/*
==================================================
APP CONTENT
==================================================
*/

const AppContent = () => {
  const [
    isDonationModalOpen,
    setIsDonationModalOpen,
  ] = useState(false);

  /*
  ================================================
  OPEN DONATION MODAL
  ================================================
  */

  const openDonationModal = () => {
    setIsDonationModalOpen(true);
  };

  /*
  ================================================
  CLOSE DONATION MODAL
  ================================================
  */

  const closeDonationModal = () => {
    setIsDonationModalOpen(false);
  };

  return (
    <>
      {/* ==================================================
          GLOBAL SCROLL TO TOP / BOTTOM
      ================================================== */}

      <ScrollToTop />

      {/* ==================================================
          APPLICATION ROUTES
      ================================================== */}

      <Routes>

        {/* ==========================================================
            PUBLIC HOME
        ========================================================== */}

        <Route
          path="/"
          element={
            <PublicLayout
              onDonateClick={openDonationModal}
            >
              <Home
                onDonateClick={openDonationModal}
              />
            </PublicLayout>
          }
        />

        {/* ==========================================================
            PUBLIC ABOUT US
        ========================================================== */}

        <Route
          path="/about"
          element={
            <PublicLayout
              onDonateClick={openDonationModal}
            >
              <AboutUs
                onDonateClick={openDonationModal}
              />
            </PublicLayout>
          }
        />

        {/* ==========================================================
            PUBLIC OUR CAUSES
        ========================================================== */}

        <Route
          path="/causes"
          element={
            <PublicLayout
              onDonateClick={openDonationModal}
            >
              <OurCauses
                onDonateClick={openDonationModal}
              />
            </PublicLayout>
          }
        />

        {/* ==========================================================
            PUBLIC OUR IMPACT
        ========================================================== */}

        <Route
          path="/impact"
          element={
            <PublicLayout
              onDonateClick={openDonationModal}
            >
              <OurImpact
                onDonateClick={openDonationModal}
              />
            </PublicLayout>
          }
        />

        {/* ==========================================================
            PUBLIC GALLERY
        ========================================================== */}

        <Route
          path="/gallery"
          element={
            <PublicLayout
              onDonateClick={openDonationModal}
            >
              <Gallery
                onDonateClick={openDonationModal}
              />
            </PublicLayout>
          }
        />

        {/* ==========================================================
            PUBLIC GET INVOLVED
        ========================================================== */}

        <Route
          path="/get-involved"
          element={
            <PublicLayout
              onDonateClick={openDonationModal}
            >
              <GetInvolved
                onDonateClick={openDonationModal}
              />
            </PublicLayout>
          }
        />

        {/* ==========================================================
            ADMIN LOGIN
        ========================================================== */}

        <Route
          path="/admin/login"
          element={
            <AdminLogin />
          }
        />

        {/* ==========================================================
            PROTECTED ADMIN AREA
        ========================================================== */}

        <Route
          element={
            <ProtectedRoute />
          }
        >

          {/* ========================================================
              ADMIN LAYOUT
          ======================================================== */}

          <Route
            path="/admin"
            element={
              <AdminLayout />
            }
          >

            {/* ======================================================
                ADMIN DASHBOARD
            ====================================================== */}

            <Route
              path="dashboard"
              element={
                <AdminDashboard />
              }
            />

            {/* ======================================================
                ADMIN GALLERY
            ====================================================== */}

            <Route
              path="gallery"
              element={
                <AdminGallery />
              }
            />

            {/* ======================================================
                ADMIN ABOUT
            ====================================================== */}

            <Route
              path="about"
              element={
                <AdminAbout />
              }
            />

            {/* ======================================================
                ADMIN CAUSES
            ====================================================== */}

            <Route
              path="causes"
              element={
                <AdminCauses />
              }
            />

            {/* ======================================================
                ADMIN IMPACT
            ====================================================== */}

            <Route
              path="impact"
              element={
                <AdminImpact />
              }
            />

            {/* ======================================================
                ADMIN GET INVOLVED
            ====================================================== */}

            <Route
              path="get-involved"
              element={
                <AdminGetInvolved />
              }
            />

            {/* ======================================================
                ADMIN OUTREACH
            ====================================================== */}

            <Route
              path="outreach"
              element={
                <AdminOutreach />
              }
            />

            {/* ======================================================
                ADMIN DONATIONS
            ====================================================== */}

            <Route
              path="donations"
              element={
                <AdminDonations />
              }
            />

            {/* ======================================================
                ADMIN DONATION ACCOUNTS
            ====================================================== */}

            <Route
              path="donation-accounts"
              element={
                <DonationAccounts />
              }
            />

            {/* ======================================================
                ADMIN CONTACTS
            ====================================================== */}

            <Route
              path="contacts"
              element={
                <AdminContacts />
              }
            />

            {/* ======================================================
                ADMIN VOLUNTEERS
            ====================================================== */}

            <Route
              path="volunteers"
              element={
                <AdminVolunteers />
              }
            />

            {/* ======================================================
                ADMIN SETTINGS
            ====================================================== */}

            <Route
              path="settings"
              element={
                <AdminSettings />
              }
            />

          </Route>

        </Route>

        {/* ==========================================================
            FALLBACK ROUTE
        ========================================================== */}

        <Route
          path="*"
          element={
            <PublicLayout
              onDonateClick={openDonationModal}
            >
              <Home
                onDonateClick={openDonationModal}
              />
            </PublicLayout>
          }
        />

      </Routes>

      {/* ============================================================
          DONATION MODAL
      ============================================================ */}

      {isDonationModalOpen && (
        <DonationModal
          onClose={closeDonationModal}
        />
      )}
    </>
  );
};

/*
==================================================
APP
==================================================
*/

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;