import axios from 'axios';

const resolveApiBaseUrl = (): string =>
  (
    import.meta.env.VITE_API_BASE_URL?.trim() ||
    import.meta.env.VITE_BACKEND_BASE_URL?.trim() ||
    'http://localhost:3000'
  ).replace(/\/+$/, '');

export const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiConfig = {
  baseURL: resolveApiBaseUrl(),
};

export default apiClient;
