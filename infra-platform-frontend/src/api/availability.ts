import { axiosInstance } from './index';
import { AvailabilityCheck, AvailabilitySettings, AvailabilityChartData } from '../types/availability';

export const availabilityApi = {
  checkDevice: async (deviceId: number): Promise<any> => {
    const response = await axiosInstance.get(`/availability/${deviceId}/check`);
    return response.data;
  },

  getDeviceHistory: async (deviceId: number, limit: number = 100): Promise<AvailabilityCheck[]> => {
    const response = await axiosInstance.get(`/availability/${deviceId}/history?limit=${limit}`);
    return response.data;
  },

  getChartData: async (deviceId: number, days: number = 7): Promise<AvailabilityChartData> => {
    const response = await axiosInstance.get(`/availability/${deviceId}/chart-data?days=${days}`);
    return response.data;
  },

  checkAllDevices: async (maxConcurrent: number = 50): Promise<any[]> => {
    const response = await axiosInstance.get(`/availability/check-all?max_concurrent=${maxConcurrent}`);
    return response.data;
  },

  getLatestAvailability: async (): Promise<any[]> => {
    const response = await axiosInstance.get('/availability/latest');
    return response.data;
  },

  // New method to get streaming results
  getCheckResults: async (): Promise<any[]> => {
    const response = await axiosInstance.get('/availability/results');
    return response.data;
  },

  runChecks: async (maxConcurrent: number = 100): Promise<{ message: string, status: any }> => {
    const response = await axiosInstance.post(`/availability/run-checks?max_concurrent=${maxConcurrent}`);
    return response.data;
  },

  getCheckStatus: async (): Promise<{
    in_progress: boolean,
    completed_count: number,
    total_count: number,
    start_time: number | null,
    elapsed_seconds?: number,
    estimated_total_seconds?: number
  }> => {
    const response = await axiosInstance.get('/availability/check-status');
    return response.data;
  },

  getSettings: async (): Promise<AvailabilitySettings> => {
    const response = await axiosInstance.get('/availability/settings');
    return response.data;
  },

  updateSettings: async (settings: { check_interval_minutes: number }): Promise<AvailabilitySettings> => {
    const response = await axiosInstance.post('/availability/settings', settings);
    return response.data;
  }
};