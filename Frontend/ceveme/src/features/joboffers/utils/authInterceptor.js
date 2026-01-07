import axios from "../../../api";

let refreshTokenPromise = null;

export const setupAuthInterceptor = () => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!refreshTokenPromise) {
          refreshTokenPromise = refreshAccessToken();
        }

        try {
          await refreshTokenPromise;
          refreshTokenPromise = null;
          return axios(originalRequest);
        } catch (refreshError) {
          refreshTokenPromise = null;
          handleAuthFailure();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

async function refreshAccessToken() {
  const response = await axios.post(
    "/api/auth/refresh",
    {},
    {
      _skipAuth: true,
    }
  );

  if (response.data?.accessToken) {
    return response.data.accessToken;
  }

  throw new Error("No access token in response");
}

function handleAuthFailure() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  if (window.location.pathname !== "/login") {
    const returnUrl = encodeURIComponent(
      window.location.pathname + window.location.search
    );
    window.location.href = `/login?returnUrl=${returnUrl}`;
  }
}

export default { setupAuthInterceptor };
