// This file houses configuration for interfacing with the API.

import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_CAMPUS_JAM_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for storing JWTs and applying them to all API requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
