import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../api';

export const useDeviceData = (deviceId: string) => {
  const queryClient = useQueryClient();

  // Fetch device status
  const {
    data: status,
    isLoading: statusLoading,
    error: statusError
  } = useQuery({
    queryKey: ['deviceStatus', deviceId],
    queryFn: () => api.customDevices.getStatus(Number(deviceId)),
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch device metrics
  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError
  } = useQuery({
    queryKey: ['deviceMetrics', deviceId],
    queryFn: () => api.customDevices.getMetrics(Number(deviceId)),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Refresh data function
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['deviceStatus', deviceId] });
    queryClient.invalidateQueries({ queryKey: ['deviceMetrics', deviceId] });
  };

  return {
    status,
    metrics,
    isLoading: statusLoading || metricsLoading,
    error: statusError || metricsError,
    refreshData
  };
};