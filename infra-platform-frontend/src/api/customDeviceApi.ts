// src/api/customDeviceApi.ts
import { axiosInstance } from './axiosConfig';

export const customDeviceApi = {
  getStatus: async (deviceId: number): Promise<any> => {
    const response = await axiosInstance.get(`/custom/${deviceId}/status`);
    return response.data;
  },

  getMetrics: async (deviceId: number): Promise<any> => {
    const response = await axiosInstance.get(`/custom/${deviceId}/metrics`);
    return response.data;
  },

  executeOperation: async (deviceId: number, operationId: string, params: any = {}): Promise<any> => {
    const response = await axiosInstance.post(`/custom/${deviceId}/operations/${operationId}`, params);
    return response.data;
  },
};