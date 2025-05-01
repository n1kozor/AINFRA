// src/hooks/useDevices.ts
import { useState, useEffect } from 'react';
import { deviceApi } from '../api/deviceApi';
import { Device } from '../types/device';

export const useDevices = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await deviceApi.getAll();
        setDevices(data);
      } catch (err) {
        console.error('Error fetching devices:', err);
        setError('Failed to load devices');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  return {
    devices,
    loading,
    error
  };
};