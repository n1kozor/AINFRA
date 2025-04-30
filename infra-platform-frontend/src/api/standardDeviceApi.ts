// src/api/standardDeviceApi.ts
import { axiosInstance } from './axiosConfig';
import { DeviceStats } from '../types/device';

export const standardDeviceApi = {
  getStats: async (deviceId: number): Promise<DeviceStats> => {
    const response = await axiosInstance.get(`/standard/${deviceId}/stats`);
    return response.data;
  },

  getMetric: async (deviceId: number, metric: string): Promise<any> => {
    const response = await axiosInstance.get(`/standard/${deviceId}/metrics/${metric}`);
    return response.data;
  },
};