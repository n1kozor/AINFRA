// pages/dashboard/Dashboard.tsx (update)
import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Paper
} from '@mui/material';
import {
  DashboardOutlined
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import PageContainer from '../../components/common/PageContainer';
import { useTranslation } from 'react-i18next';
import NetworkSoul from '../../components/dashboard/NetworkSoul';
import { useDeviceStats } from '../../hooks/dashboard/useDeviceStats';
import { useAvailabilityData } from '../../hooks/dashboard/useAvailabilityData';
import { StatusOverview } from '../../components/dashboard/StatusOverview';

const Dashboard: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const [refreshTimestamp, setRefreshTimestamp] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { deviceStats, isLoading: isStatsLoading, fetchDeviceStats } = useDeviceStats();
  const {
    availabilityStats,
    isLoading: isAvailabilityLoading,
    fetchAvailabilityData
  } = useAvailabilityData();

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([fetchDeviceStats(), fetchAvailabilityData()]);
    setRefreshTimestamp(new Date());
    setIsRefreshing(false);
  }, [fetchDeviceStats, fetchAvailabilityData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleRefresh();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [handleRefresh]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

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

      {/* New full-width status overview below the soul */}
      <StatusOverview />

    </PageContainer>
  );
};

export default Dashboard;