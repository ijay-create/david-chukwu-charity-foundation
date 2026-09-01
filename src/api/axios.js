import axios from "axios";

/*
|--------------------------------------------------------------------------
| API BASE URL
|--------------------------------------------------------------------------
*/

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  withCredentials: true,
});

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
|
| Automatically attaches the JWT token.
|
| IMPORTANT:
| When sending FormData, we remove Content-Type manually so Axios/browser
| can automatically generate:
|
| multipart/form-data; boundary=...
|
*/

API.interceptors.request.use(
  (config) => {
    try {
      const token =
        localStorage.getItem("adminToken") ||
        sessionStorage.getItem("adminToken");

      if (token) {
        config.headers = config.headers || {};

        config.headers.Authorization =
          `Bearer ${token}`;
      }

      /*
      |--------------------------------------------------------------------------
      | FORM DATA
      |--------------------------------------------------------------------------
      |
      | Do NOT manually set:
      |
      | Content-Type: multipart/form-data
      |
      | The browser must generate the boundary automatically.
      |
      */

      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      } else {
        config.headers["Content-Type"] =
          "application/json";
      }
    } catch (error) {
      console.error(
        "AXIOS TOKEN ERROR:",
        error
      );
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
*/

API.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response) {
      const status =
        error.response.status;

      /*
      |--------------------------------------------------------------------------
      | UNAUTHORIZED
      |--------------------------------------------------------------------------
      */

      if (status === 401) {
        console.warn(
          "Authentication failed:",
          error.response.data?.message ||
            "Authorization token required."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | FORBIDDEN
      |--------------------------------------------------------------------------
      */

      if (status === 403) {
        console.warn(
          "Access forbidden:",
          error.response.data?.message ||
            "You do not have permission to perform this action."
        );
      }
    } else if (error.request) {
      /*
      |--------------------------------------------------------------------------
      | SERVER / NETWORK ERROR
      |--------------------------------------------------------------------------
      */

      console.error(
        "API NETWORK ERROR:",
        error.message
      );
    } else {
      /*
      |--------------------------------------------------------------------------
      | REQUEST CONFIGURATION ERROR
      |--------------------------------------------------------------------------
      */

      console.error(
        "API REQUEST ERROR:",
        error.message
      );
    }

    return Promise.reject(error);
  }
);

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default API;