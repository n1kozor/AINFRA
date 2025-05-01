// src/hooks/dashboard/useSystemStatistics.ts
import { useState, useCallback } from 'react';
import { statisticsApi } from '../../api/statisticsApi';
import type { SystemStatistics, TimeRangeOption } from '../../types/statistics';

export const useSystemStatistics = () => {
  const [statistics, setStatistics] = useState<SystemStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async (timeRange?: TimeRangeOption) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await statisticsApi.getSystemStatistics(timeRange);
      setStatistics(data);
    } catch (err) {
      console.error('Error fetching system statistics:', err);
      setError('Failed to load system statistics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    statistics,
    isLoading,
    error,
    fetchStatistics
  };
};