// src/hooks/dashboard/useDeviceStats.ts
import { useState, useCallback } from 'react';
import { deviceApi } from '../../api/deviceApi';

export const useDeviceStats = () => {
  const [deviceStats, setDeviceStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDeviceStats = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get all devices
      const devices = await deviceApi.getAll();
      
      // Calculate device type distribution
      const deviceTypeDistribution = {
        standard: devices.filter(d => d.type === 'standard').length,
        custom: devices.filter(d => d.type === 'custom').length
      };
      
      // Calculate OS distribution for standard devices
      const osDistribution = {
        windows: devices.filter(d => d.type === 'standard' && d.standard_device?.os_type === 'windows').length,
        macos: devices.filter(d => d.type === 'standard' && d.standard_device?.os_type === 'macos').length,
        linux: devices.filter(d => d.type === 'standard' && d.standard_device?.os_type === 'linux').length,
      };
      
      setDeviceStats({
        totalDevices: devices.length,
        deviceTypeDistribution,
        osDistribution
      });
    } catch (error) {
      console.error('Error fetching device stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    deviceStats,
    isLoading,
    fetchDeviceStats
  };
};