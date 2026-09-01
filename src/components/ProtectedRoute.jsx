import {
  Navigate,
  Outlet,
  useLocation
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";


const ProtectedRoute = () => {

  const {
    isAuthenticated,
    loading
  } = useAuth();

  const location = useLocation();


  /*
  ========================================
  WAIT FOR AUTH SESSION
  ========================================
  */

  if (loading) {

    return (
      <div className="admin-auth-loading">
        Loading...
      </div>
    );

  }


  /*
  ========================================
  NOT AUTHENTICATED
  ========================================
  */

  if (!isAuthenticated) {

    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname
        }}
      />
    );

  }


  /*
  ========================================
  AUTHENTICATED
  ========================================
  */

  return <Outlet />;

};


export default ProtectedRoute;