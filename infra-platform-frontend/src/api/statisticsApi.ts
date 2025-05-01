// src/api/statisticsApi.ts
import { axiosInstance } from './axiosConfig';
import type { SystemStatistics, TimeRangeOption } from '../types/statistics';

/**
 * API module for system statistics and monitoring data
 */
export const statisticsApi = {
  /**
   * Get comprehensive system statistics from the monitoring service
   *
   * @param timeRange Optional time range filter for the data
   * @returns Statistics about device availability, response times, and trends
   */
  getSystemStatistics: async (timeRange?: TimeRangeOption): Promise<SystemStatistics> => {
    const params = timeRange ? { time_range: timeRange } : {};
    const response = await axiosInstance.get('/all-system-stats', { params });
    return response.data;
  },
};