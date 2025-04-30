// src/api/axiosConfig.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const AVAILABILITY_API_URL = import.meta.env.VITE_AVAILABILITY_API_URL || 'http://localhost:8001';

// Create axios instance with base configuration
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const availabilityAxios = axios.create({
  baseURL: AVAILABILITY_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('API Error:', error);
    }

    return Promise.reject(error);
  }
);

availabilityAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.error('Availability API Error:', error);
    }
    return Promise.reject(error);
  }
);