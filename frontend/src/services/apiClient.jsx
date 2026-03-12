import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Lightweight factory so callers can pass the token they have on hand.
export function apiClient(token) {
  const instance = axios.create({
    baseURL: BASE_URL,
  });

  if (token) {
    instance.interceptors.request.use((config) => {
      const next = { ...config };
      next.headers = {
        ...next.headers,
        Authorization: `Bearer ${token}`,
      };
      return next;
    });
  }

  return instance;
}

