import axios from 'axios';
import { deviceApi } from './deviceApi';
import { standardDeviceApi } from './standardDeviceApi';
import { customDeviceApi } from './customDeviceApi';
import { pluginApi } from './pluginApi';
import { availabilityApi } from './availability';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with base configuration
export const axiosInstance = axios.create({
  baseURL: API_URL,
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

// Export API modules
export const api = {
  devices: deviceApi,
  standardDevices: standardDeviceApi,
  customDevices: customDeviceApi,
  plugins: pluginApi,
  availability: availabilityApi,
};