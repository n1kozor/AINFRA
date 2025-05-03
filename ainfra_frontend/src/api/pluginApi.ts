// src/api/pluginApi.ts
import { axiosInstance } from './axiosConfig';
import { Plugin, PluginCreate, PluginUpdate } from '../types/plugin';

export const pluginApi = {
  getAll: async (): Promise<Plugin[]> => {
    const response = await axiosInstance.get('/plugins');
    return response.data;
  },

  getById: async (id: number): Promise<Plugin> => {
    const response = await axiosInstance.get(`/plugins/${id}`);
    return response.data;
  },

  create: async (plugin: PluginCreate): Promise<Plugin> => {
    const response = await axiosInstance.post('/plugins', plugin);
    return response.data;
  },

  update: async (id: number, plugin: PluginUpdate): Promise<Plugin> => {
    const response = await axiosInstance.put(`/plugins/${id}`, plugin);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/plugins/${id}`);
  },
};