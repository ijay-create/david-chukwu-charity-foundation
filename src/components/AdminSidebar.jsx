import {
  LayoutDashboard,
  Images,
  HandHeart,
  DollarSign,
  Mail,
  Users,
  Settings,
  LogOut,
  X,
  Info,
  Heart,
  TrendingUp,
  UserPlus,
  Landmark,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import "../styles/AdminSidebar.css";


/*
|--------------------------------------------------------------------------
| ADMIN MENU ITEMS
|--------------------------------------------------------------------------
*/

const menuItems = [
  {
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },

  {
    path: "/admin/gallery",
    label: "Gallery",
    icon: Images,
  },

  {
    path: "/admin/about",
    label: "About Us",
    icon: Info,
  },

  {
    path: "/admin/causes",
    label: "Our Causes",
    icon: Heart,
  },

  {
    path: "/admin/impact",
    label: "Our Impact",
    icon: TrendingUp,
  },

  {
    path: "/admin/get-involved",
    label: "Get Involved",
    icon: UserPlus,
  },

  {
    path: "/admin/outreach",
    label: "Outreach Programs",
    icon: HandHeart,
  },

  {
    path: "/admin/donations",
    label: "Donations",
    icon: DollarSign,
  },

  /*
  |--------------------------------------------------------------------------
  | DONATION ACCOUNTS
  |--------------------------------------------------------------------------
  */

  {
    path: "/admin/donation-accounts",
    label: "Donation Accounts",
    icon: Landmark,
  },

  {
    path: "/admin/contacts",
    label: "Contact Messages",
    icon: Mail,
  },

  {
    path: "/admin/volunteers",
    label: "Volunteers",
    icon: Users,
  },

  {
    path: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];


/*
|--------------------------------------------------------------------------
| ADMIN SIDEBAR
|--------------------------------------------------------------------------
*/

const AdminSidebar = ({
  isOpen,
  onClose,
}) => {

  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();


  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {

    logout();

    onClose();

    navigate(
      "/admin/login",
      {
        replace: true,
      }
    );

  };


  return (

    <>

      {/* ==============================================================
          MOBILE OVERLAY
      ============================================================== */}

      {isOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={onClose}
        />
      )}


      {/* ==============================================================
          SIDEBAR
      ============================================================== */}

      <aside
        className={
          `admin-sidebar ${
            isOpen
              ? "open"
              : ""
          }`
        }
      >

        {/* ============================================================
            SIDEBAR HEADER
        ============================================================ */}

        <div className="admin-sidebar-header">

          <div className="admin-sidebar-brand">

            <div className="admin-sidebar-logo">
              DCF
            </div>

            <div className="admin-sidebar-brand-text">

              <strong>
                David Chukwu
              </strong>

              <span>
                Charity Foundation
              </span>

            </div>

          </div>


          {/* ==========================================================
              CLOSE BUTTON
          ========================================================== */}

          <button
            type="button"
            className="admin-sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >

            <X size={21} />

          </button>

        </div>


        {/* ============================================================
            NAVIGATION
        ============================================================ */}

        <nav className="admin-sidebar-navigation">

          <span className="admin-sidebar-label">
            MAIN MENU
          </span>


          <div className="admin-sidebar-menu">

            {menuItems.map(
              ({
                path,
                label,
                icon: Icon,
              }) => (

                <NavLink
                  key={path}
                  to={path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    isActive
                      ? "admin-sidebar-link active"
                      : "admin-sidebar-link"
                  }
                >

                  <Icon
                    size={20}
                    strokeWidth={2}
                  />

                  <span>
                    {label}
                  </span>

                </NavLink>

              )
            )}

          </div>

        </nav>


        {/* ============================================================
            SIDEBAR FOOTER
        ============================================================ */}

        <div className="admin-sidebar-footer">

          {/* ==========================================================
              USER
          ========================================================== */}

          <div className="admin-sidebar-user">

            <div className="admin-sidebar-user-avatar">

              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "A"}

            </div>


            <div className="admin-sidebar-user-info">

              <strong>
                {user?.name ||
                  "Administrator"}
              </strong>

              <span>
                Administrator
              </span>

            </div>

          </div>


          {/* ==========================================================
              LOGOUT
          ========================================================== */}

          <button
            type="button"
            className="admin-sidebar-logout"
            onClick={handleLogout}
          >

            <LogOut size={20} />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>

    </>

  );

};


export default AdminSidebar;