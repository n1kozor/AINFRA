// src/hooks/useSensors.ts
import { useState, useEffect, useCallback } from 'react';
import { sensorApi } from '../api/sensorApi';
import { Sensor, Alert, SensorCreate, SensorUpdate, AlertCreate } from '../types/sensor';

export const useSensors = (deviceId?: number) => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSensors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data: Sensor[];
      if (deviceId) {
        data = await sensorApi.getDeviceSensors(deviceId);
      } else {
        data = await sensorApi.getAllSensors();
      }
      setSensors(data);
    } catch (err) {
      console.error('Error fetching sensors:', err);
      setError('Failed to load sensors. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  const fetchActiveAlerts = useCallback(async () => {
    try {
      const data = await sensorApi.getActiveAlerts(deviceId);
      setActiveAlerts(data);
    } catch (err) {
      console.error('Error fetching active alerts:', err);
    }
  }, [deviceId]);

  useEffect(() => {
    fetchSensors();
    fetchActiveAlerts();

    // Optional: Set up polling for active alerts
    const alertPollInterval = setInterval(fetchActiveAlerts, 30000); // Poll every 30 seconds

    return () => {
      clearInterval(alertPollInterval);
    };
  }, [fetchSensors, fetchActiveAlerts]);

  const createSensor = async (sensorData: SensorCreate) => {
    try {
      const newSensor = await sensorApi.createSensor(sensorData);
      setSensors([...sensors, newSensor]);
      return newSensor;
    } catch (err) {
      console.error('Error creating sensor:', err);
      throw err;
    }
  };

  const updateSensor = async (id: number, sensorData: SensorUpdate) => {
    try {
      const updatedSensor = await sensorApi.updateSensor(id, sensorData);
      setSensors(sensors.map(sensor =>
        sensor.id === id ? updatedSensor : sensor
      ));
      return updatedSensor;
    } catch (err) {
      console.error('Error updating sensor:', err);
      throw err;
    }
  };

  const deleteSensor = async (id: number) => {
    try {
      await sensorApi.deleteSensor(id);
      setSensors(sensors.filter(sensor => sensor.id !== id));
    } catch (err) {
      console.error('Error deleting sensor:', err);
      throw err;
    }
  };

  const resolveAlert = async (alertId: number) => {
    try {
      const resolvedAlert = await sensorApi.resolveAlert(alertId);

      // Update the active alerts list
      setActiveAlerts(activeAlerts.filter(alert => alert.id !== alertId));

      // Update the alert in the sensors list
      setSensors(sensors.map(sensor => {
        if (sensor.alerts.some(alert => alert.id === alertId)) {
          return {
            ...sensor,
            alerts: sensor.alerts.map(alert =>
              alert.id === alertId ? resolvedAlert : alert
            )
          };
        }
        return sensor;
      }));

      return resolvedAlert;
    } catch (err) {
      console.error('Error resolving alert:', err);
      throw err;
    }
  };

  return {
    sensors,
    activeAlerts,
    loading,
    error,
    createSensor,
    updateSensor,
    deleteSensor,
    resolveAlert,
    refreshSensors: fetchSensors,
    refreshAlerts: fetchActiveAlerts
  };
};