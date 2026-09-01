import { useState } from "react";

import {
  Navigate,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import "../styles/Login.css";


/*
 * ========================================
 * ADMIN LOGIN
 * ========================================
 */

const AdminLogin = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    isAuthenticated
  } = useAuth();


  /*
   * ========================================
   * FORM STATE
   * ========================================
   */

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [rememberMe, setRememberMe] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  /*
   * ========================================
   * REDIRECT AUTHENTICATED USER
   * ========================================
   */

  if (isAuthenticated) {

    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );

  }


  /*
   * ========================================
   * INPUT CHANGE
   * ========================================
   */

  const handleChange = (event) => {

    const {
      name,
      value
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value
      })
    );

    setError("");

  };


  /*
   * ========================================
   * BACK TO HOMEPAGE
   * ========================================
   */

  const handleBack = () => {

    navigate("/", {
      replace: true
    });

  };


  /*
   * ========================================
   * LOGIN
   * ========================================
   */

  const handleSubmit = async (event) => {

    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    try {

      const result = await login(
        formData.email.trim(),
        formData.password,
        rememberMe
      );

      if (!result.success) {

        setError(
          result.message ||
          "Unable to sign in."
        );

        return;

      }


      /*
       * ====================================
       * LOGIN SUCCESS
       * ====================================
       *
       * If the user was redirected to login
       * from a protected admin page, return
       * them there.
       *
       * Otherwise go to the dashboard.
       */

      const destination =
        location.state?.from ||
        "/admin/dashboard";

      navigate(destination, {
        replace: true
      });

    } catch (loginError) {

      console.error(
        "ADMIN LOGIN ERROR:",
        loginError
      );

      setError(
        "Unable to sign in. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  /*
   * ========================================
   * TOGGLE PASSWORD
   * ========================================
   */

  const togglePasswordVisibility = () => {

    setShowPassword(
      (previous) =>
        !previous
    );

  };


  /*
   * ========================================
   * RENDER
   * ========================================
   */

  return (
    <main className="admin-login-page">

      <div className="admin-login-card">


        {/* ==================================
            BACK TO WEBSITE
        ================================== */}

        <button
          type="button"
          className="admin-login-back"
          onClick={handleBack}
          aria-label="Back to website"
          title="Back to website"
          disabled={loading}
        >

          <ArrowLeft size={18} />

          <span>
            Back
          </span>

        </button>


        {/* ==================================
            LOGO
        ================================== */}

        <div className="admin-login-logo">

          <div className="admin-logo-mark">
            DCF
          </div>

        </div>


        {/* ==================================
            HEADING
        ================================== */}

        <div className="admin-login-heading">

          <span>
            ADMINISTRATOR
          </span>

          <h1>
            Admin Login
          </h1>

          <p>
            Sign in to manage the charity foundation.
          </p>

        </div>


        {/* ==================================
            ERROR MESSAGE
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
            LOGIN FORM
        ================================== */}

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >


          {/* ==================================
              EMAIL
          ================================== */}

          <div className="form-group">

            <label
              htmlFor="admin-email"
            >
              Email Address
            </label>

            <div className="admin-input-wrapper">

              <Mail size={18} />

              <input
                id="admin-email"
                type="email"
                name="email"
                placeholder="Admin email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={loading}
                required
              />

            </div>

          </div>


          {/* ==================================
              PASSWORD
          ================================== */}

          <div className="form-group">

            <label
              htmlFor="admin-password"
            >
              Password
            </label>

            <div className="admin-input-wrapper">

              <Lock size={18} />

              <input
                id="admin-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loading}
                required
              />


              {/* PASSWORD VISIBILITY */}

              <button
                type="button"
                className="password-toggle"
                onClick={
                  togglePasswordVisibility
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                title={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                disabled={loading}
              >

                {showPassword ? (

                  <EyeOff size={18} />

                ) : (

                  <Eye size={18} />

                )}

              </button>

            </div>

          </div>


          {/* ==================================
              REMEMBER ME
          ================================== */}

          <div className="admin-login-options">

            <label className="remember-option">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={
                  (event) =>
                    setRememberMe(
                      event.target.checked
                    )
                }
                disabled={loading}
              />

              <span>
                Remember me
              </span>

            </label>

          </div>


          {/* ==================================
              SIGN IN
          ================================== */}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >

            {loading
              ? "Signing in..."
              : "SIGN IN"}

          </button>

        </form>


        {/* ==================================
            FOOTER
        ================================== */}

        <div className="admin-login-footer">

          <span>
            David Chukwu Charity Foundation
          </span>

        </div>

      </div>

    </main>
  );
};


export default AdminLogin;