// src/hooks/dashboard/useAvailabilityData.ts
import { useState, useCallback } from 'react';
import { availabilityApi } from '../../api/availability';
import { DeviceAvailabilityStats } from '../../types/availability';

export const useAvailabilityData = () => {
  const [availabilityStats, setAvailabilityStats] = useState<DeviceAvailabilityStats>({
    totalDevices: 0,
    availableDevices: 0,
    unavailableDevices: 0,
    uptimePercent: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchAvailabilityData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get latest availability for all devices
      const latestAvailability = await availabilityApi.getLatestAvailability();

      if (latestAvailability.length > 0) {
        const totalDevices = latestAvailability.length;
        const availableDevices = latestAvailability.filter(d => d.is_available).length;
        const unavailableDevices = totalDevices - availableDevices;
        const uptimePercent = totalDevices > 0
          ? Math.round((availableDevices / totalDevices) * 100)
          : 0;

        setAvailabilityStats({
          totalDevices,
          availableDevices,
          unavailableDevices,
          uptimePercent
        });
      }
    } catch (error) {
      console.error('Error fetching availability data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    availabilityStats,
    isLoading,
    fetchAvailabilityData
  };
};