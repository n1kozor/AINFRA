// src/api/sensorApi.ts
import { axiosInstance } from './axiosConfig';
import { Sensor, SensorCreate, SensorUpdate, Alert, AlertCreate, AlertFilter } from '../types/sensor';

export const sensorApi = {
  // Sensor operations
  getAllSensors: async (): Promise<Sensor[]> => {
    const response = await axiosInstance.get('/sensors');
    return response.data;
  },

  getSensorById: async (id: number): Promise<Sensor> => {
    const response = await axiosInstance.get(`/sensors/${id}`);
    return response.data;
  },

  getDeviceSensors: async (deviceId: number): Promise<Sensor[]> => {
    const response = await axiosInstance.get(`/sensors/device/${deviceId}`);
    return response.data;
  },

  createSensor: async (sensor: SensorCreate): Promise<Sensor> => {
    const response = await axiosInstance.post('/sensors', sensor);
    return response.data;
  },

  updateSensor: async (id: number, sensor: SensorUpdate): Promise<Sensor> => {
    const response = await axiosInstance.put(`/sensors/${id}`, sensor);
    return response.data;
  },

  deleteSensor: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/sensors/${id}`);
  },

  // Alert operations
  createAlert: async (alert: AlertCreate): Promise<Alert> => {
    const response = await axiosInstance.post('/sensors/alerts', alert);
    return response.data;
  },

  getActiveAlerts: async (deviceId?: number): Promise<Alert[]> => {
    const params = deviceId ? { device_id: deviceId } : undefined;
    const response = await axiosInstance.get('/sensors/alerts/active', { params });
    return response.data;
  },

  getAlertHistory: async (filter?: AlertFilter): Promise<Alert[]> => {
    const response = await axiosInstance.get('/sensors/alerts/history', {
      params: filter
    });
    return response.data;
  },

  resolveAlert: async (alertId: number): Promise<Alert> => {
    const response = await axiosInstance.put(`/sensors/alerts/${alertId}/resolve`);
    return response.data;
  }
};