import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { OsDistribution, SystemHealth } from '../types/dashboard';
import { Device } from '../types/device';
import { DeviceAvailabilityStats } from '../types/availability';

export const useDashboardData = (refreshKey: number, availabilityStats?: DeviceAvailabilityStats) => {
  const theme = useTheme();
  const { t } = useTranslation(['dashboard', 'common']);

  // Fetch devices
  const {
    data: devices,
    isLoading: isLoadingDevices,
    refetch: refetchDevices,
  } = useQuery({
    queryKey: ['devices', refreshKey],
    queryFn: api.devices.getAll,
  });

  // Fetch plugins
  const {
    data: plugins,
    isLoading: isLoadingPlugins,
    refetch: refetchPlugins,
  } = useQuery({
    queryKey: ['plugins', refreshKey],
    queryFn: api.plugins.getAll,
  });

  // Calculate statistics
  const stats = useMemo(() => {
    if (!devices) return null;

    const standardDevices = devices.filter(d => d.type === 'standard');
    const customDevices = devices.filter(d => d.type === 'custom');
    const activeDevices = devices.filter(d => d.is_active);
    const inactiveDevices = devices.filter(d => !d.is_active);

    // Count devices by OS
    const osCounts = standardDevices.reduce((acc, device) => {
      const osType = device.standard_device?.os_type || 'unknown';
      acc[osType] = (acc[osType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate system health based on availability
    const healthScore = availabilityStats?.uptimePercent || 0;

    return {
      totalDevices: devices.length,
      standardDevices: standardDevices.length,
      customDevices: customDevices.length,
      activeDevices: activeDevices.length,
      inactiveDevices: inactiveDevices.length,
      osCounts,
      healthScore,
    };
  }, [devices, availabilityStats]);

  // Get recent devices
  const recentDevices = useMemo(() => {
    if (!devices) return [];
    return [...devices]
      .sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5);
  }, [devices]);

  // Prepare data for OS distribution chart
  const osDistributionData: OsDistribution[] = useMemo(() => {
    if (!stats?.osCounts) return [];

    const colorMap: Record<string, string> = {
      windows: theme.palette.info.main,
      linux: theme.palette.warning.main,
      macos: theme.palette.success.main,
      unknown: theme.palette.grey[500],
    };

    return Object.entries(stats.osCounts).map(([os, count]) => ({
      name: t(`dashboard:osTypes.${os}`),
      value: count,
      color: colorMap[os] || theme.palette.secondary.main,
    }));
  }, [stats?.osCounts, theme, t]);

  // Prepare system health metrics
  const systemHealthData: SystemHealth[] = useMemo(() => {
    if (!stats) return [];

    return [
      {
        name: t('dashboard:systemHealth.devices'),
        value: stats.healthScore,
        status: stats.healthScore > 80 ? 'good' : stats.healthScore > 50 ? 'warning' : 'critical',
      },
      {
        name: t('dashboard:systemHealth.cpu'),
        value: 65,
        status: 65 > 80 ? 'good' : 65 > 50 ? 'warning' : 'critical',
      },
      {
        name: t('dashboard:systemHealth.memory'),
        value: 82,
        status: 82 > 80 ? 'good' : 82 > 50 ? 'warning' : 'critical',
      },
      {
        name: t('dashboard:systemHealth.storage'),
        value: 45,
        status: 45 > 80 ? 'good' : 45 > 50 ? 'warning' : 'critical',
      },
    ];
  }, [stats, t]);

  // Refetch all data
  const refetchAll = useCallback(() => {
    refetchDevices();
    refetchPlugins();
  }, [refetchDevices, refetchPlugins]);

  return {
    devices,
    plugins,
    stats,
    recentDevices,
    osDistributionData,
    systemHealthData,
    isLoading: isLoadingDevices || isLoadingPlugins,
    refetchAll,
  };
};