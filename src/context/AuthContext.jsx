import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import API from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  /*
   * =========================================
   * RESTORE SAVED SESSION
   * =========================================
   */

  useEffect(() => {

    const storedUser =
      localStorage.getItem("adminUser") ||
      sessionStorage.getItem("adminUser");

    const storedToken =
      localStorage.getItem("adminToken") ||
      sessionStorage.getItem("adminToken");

    if (storedUser && storedToken) {

      try {

        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);
        setIsAuthenticated(true);

      } catch (error) {

        console.error(
          "Failed to restore admin session:",
          error
        );

        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminToken");

        sessionStorage.removeItem("adminUser");
        sessionStorage.removeItem("adminToken");

        setUser(null);
        setIsAuthenticated(false);
      }
    }

    setLoading(false);

  }, []);

  /*
   * =========================================
   * LOGIN
   * =========================================
   */

  const login = async (
    email,
    password,
    rememberMe = false
  ) => {

    try {

      const response = await API.post(
        "/auth/login",
        {
          email,
          password
        }
      );

      const {
        token,
        user: loggedInUser
      } = response.data;

      if (!token || !loggedInUser) {

        return {
          success: false,
          message: "Invalid response from server."
        };

      }

      /*
       * Clear old sessions
       */

      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");

      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminUser");

      /*
       * Choose storage
       */

      const storage = rememberMe
        ? localStorage
        : sessionStorage;

      storage.setItem(
        "adminToken",
        token
      );

      storage.setItem(
        "adminUser",
        JSON.stringify(loggedInUser)
      );

      /*
       * Update React state
       */

      setUser(loggedInUser);
      setIsAuthenticated(true);

      return {
        success: true,
        message: "Login successful.",
        user: loggedInUser
      };

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to connect to the server.";

      return {
        success: false,
        message
      };
    }
  };

  /*
   * =========================================
   * LOGOUT
   * =========================================
   */

  const logout = () => {

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUser");

    setUser(null);
    setIsAuthenticated(false);
  };

  /*
   * =========================================
   * CONTEXT
   * =========================================
   */

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/*
 * =========================================
 * USE AUTH
 * =========================================
 */

export const useAuth = () => {

  const context = useContext(
    AuthContext
  );

  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );

  }

  return context;
};