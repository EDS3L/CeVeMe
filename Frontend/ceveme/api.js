import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config ?? {};
    console.log(error);
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );
        return api.request(original);
      } catch (e) {
        window.location.href = '/auth/login';
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
