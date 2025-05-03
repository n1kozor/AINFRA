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
  const { t } = useTranslation();
  const [, setRefreshTimestamp] = useState<Date>(new Date());
  const [, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('24h');

  const {fetchDeviceStats } = useDeviceStats();
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

  React.useEffect(() => {
    handleRefresh();
  }, []);

  return (
      <PageContainer
          title={t('dashboard.title')}
          subtitle={t('dashboard.subtitle')}
          icon={<DashboardOutlined sx={{ fontSize: 28 }} />}
          breadcrumbs={[
            { text: t('common.home'), link: '/' },
            { text: t('dashboard.title') }
          ]}
      >
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2, position: 'relative' }}>
          <Paper elevation={0} sx={{ display: 'flex', backgroundColor: 'transparent' }}>
            <NetworkSoul
                healthScore={availabilityStats?.uptimePercent || 0}
                isLoading={isAvailabilityLoading}
            />
          </Paper>
        </Box>

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