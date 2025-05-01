// pages/dashboard/Dashboard.tsx
import React, { useCallback, useState } from 'react';
import {
  Box,
  Paper
} from '@mui/material';
import {
  DashboardOutlined
} from '@mui/icons-material';
import PageContainer from '../../components/common/PageContainer';
import { useTranslation } from 'react-i18next';
import NetworkSoul from '../../components/dashboard/NetworkSoul';
import { useDeviceStats } from '../../hooks/dashboard/useDeviceStats';
import { useAvailabilityData } from '../../hooks/dashboard/useAvailabilityData';
import { StatusOverview } from '../../components/dashboard/StatusOverview';
import { useSystemStatistics } from '../../hooks/dashboard/useSystemStatistics';
import { TimeRangeOption } from '../../types/statistics';

const Dashboard: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const [refreshTimestamp, setRefreshTimestamp] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('1h');

  const { deviceStats, isLoading: isStatsLoading, fetchDeviceStats } = useDeviceStats();
  const {
    availabilityStats,
    isLoading: isAvailabilityLoading,
    fetchAvailabilityData
  } = useAvailabilityData();
  const {
    statistics,
    isLoading: isStatisticsLoading,
    fetchStatistics
  } = useSystemStatistics();

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchDeviceStats(),
      fetchAvailabilityData(),
      fetchStatistics(timeRange)
    ]);
    setRefreshTimestamp(new Date());
    setIsRefreshing(false);
  }, [fetchDeviceStats, fetchAvailabilityData, fetchStatistics, timeRange]);

  const handleTimeRangeChange = useCallback((newRange: TimeRangeOption) => {
    setTimeRange(newRange);
    fetchStatistics(newRange);
  }, [fetchStatistics]);

  // Load data once when component mounts
  React.useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer
      title={t('title')}
      subtitle={t('subtitle')}
      icon={<DashboardOutlined sx={{ fontSize: 28 }} />}
      breadcrumbs={[
        { text: t('common:home'), link: '/' },
        { text: t('title') }
      ]}
    >
      {/* Soul Section */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2, position: 'relative' }}>
        <Paper elevation={0} sx={{ display: 'flex', backgroundColor: 'transparent' }}>
          <NetworkSoul
            healthScore={availabilityStats?.uptimePercent || 0}
            isLoading={isAvailabilityLoading}
          />
        </Paper>
      </Box>

      {/* Status overview below the soul */}
      <StatusOverview
        statistics={statistics}
        isLoading={isStatisticsLoading}
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
      />
    </PageContainer>
  );
};

export default Dashboard;