import axios from 'axios';

// Base URL is proxied by Vite to http://localhost:8080
const api = axios.create({
  baseURL: '/api',
  withCredentials: false
});

function getToken() {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // Token expired or unauthorized → clear and redirect to login
      try {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
      } catch (_) {}
      if (typeof window !== 'undefined') {
        const current = window.location.pathname + window.location.search;
        const redirect = `/login?next=${encodeURIComponent(current)}`;
        if (!window.location.pathname.startsWith('/login')) {
          window.location.assign(redirect);
        }
      }
    }
    const message = error?.response?.data?.message || error.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

export default api;


