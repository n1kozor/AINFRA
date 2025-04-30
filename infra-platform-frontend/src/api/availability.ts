// src/api/availability.ts
import { availabilityAxios } from './axiosConfig';
import { AvailabilityCheck, AvailabilitySettings, AvailabilityChartData } from '../types/availability';

export const availabilityApi = {
  checkDevice: async (deviceId: number): Promise<any> => {
    const response = await availabilityAxios.get(`/${deviceId}/check`);
    return response.data;
  },

  getDeviceHistory: async (deviceId: number, limit: number = 100): Promise<AvailabilityCheck[]> => {
    const response = await availabilityAxios.get(`/${deviceId}/history?limit=${limit}`);
    return response.data;
  },

  getChartData: async (deviceId: number, days: number = 7): Promise<AvailabilityChartData> => {
    const response = await availabilityAxios.get(`/${deviceId}/chart-data?days=${days}`);
    return response.data;
  },

  checkAllDevices: async (maxConcurrent: number = 50): Promise<any[]> => {
    const response = await availabilityAxios.get(`/check-all?max_concurrent=${maxConcurrent}`);
    return response.data;
  },

  getLatestAvailability: async (): Promise<any[]> => {
    const response = await availabilityAxios.get('/latest');
    return response.data;
  },

  getCheckResults: async (): Promise<any[]> => {
    const response = await availabilityAxios.get('/results');
    return response.data;
  },

  runChecks: async (maxConcurrent: number = 100): Promise<{ message: string, status: any }> => {
    const response = await availabilityAxios.post(`/run-checks?max_concurrent=${maxConcurrent}`);
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
    const response = await availabilityAxios.get('/check-status');
    return response.data;
  },

  getSettings: async (): Promise<AvailabilitySettings> => {
    const response = await availabilityAxios.get('/settings');
    return response.data;
  },

  updateSettings: async (settings: { check_interval_minutes: number }): Promise<AvailabilitySettings> => {
    const response = await availabilityAxios.post('/settings', settings);
    return response.data;
  },

  syncDevices: async (): Promise<any> => {
    const response = await availabilityAxios.post('/sync-devices');
    return response.data;
  },

  getDevices: async (): Promise<any[]> => {
    const response = await availabilityAxios.get('/devices');
    return response.data;
  }
};