import { axiosInstance } from './index';
import { Device, DeviceCreate, DeviceUpdate } from '../types/device';

export const deviceApi = {
  getAll: async (): Promise<Device[]> => {
    const response = await axiosInstance.get('/devices');
    return response.data;
  },

  getById: async (id: number): Promise<Device> => {
    const response = await axiosInstance.get(`/devices/${id}`);
    return response.data;
  },

  create: async (device: DeviceCreate): Promise<Device> => {
    const response = await axiosInstance.post('/devices', device);
    return response.data;
  },

  update: async (id: number, device: DeviceUpdate): Promise<Device> => {
    const response = await axiosInstance.put(`/devices/${id}`, device);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/devices/${id}`);
  },
};