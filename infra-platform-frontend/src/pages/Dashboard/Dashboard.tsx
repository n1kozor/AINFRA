import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  useTheme,
  alpha,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  DashboardOutlined,
  RefreshRounded,
  SettingsOutlined,
  AddRounded
} from '@mui/icons-material';
import PageContainer from '../../components/common/PageContainer';
import { useTranslation } from 'react-i18next';
import NetworkSoul from '../../components/dashboard/NetworkSoul';
import DeviceStatusSummary from '../../components/dashboard/DeviceStatusSummary';
import DeviceTypeDistribution from '../../components/dashboard/DeviceTypeDistribution';
import RecentActivityList from '../../components/dashboard/RecentActivityList';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { useDeviceStats } from '../../hooks/dashboard/useDeviceStats';
import { useAvailabilityData } from '../../hooks/dashboard/useAvailabilityData';

const Dashboard: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const theme = useTheme();
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

  // Auto refresh every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      handleRefresh();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [handleRefresh]);

  // Initial data loading
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
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            {t('lastUpdated')}: {refreshTimestamp.toLocaleTimeString()}
          </Typography>
        </Box>

        <Tooltip title={t('refresh')} arrow>
          <IconButton
            onClick={handleRefresh}
            disabled={isRefreshing}
            color="primary"
            sx={{
              mr: 1,
              animation: isRefreshing ? 'spin 2s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}
          >
            <RefreshRounded />
          </IconButton>
        </Tooltip>

        <Tooltip title={t('settings')} arrow>
          <IconButton color="primary">
            <SettingsOutlined />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Main Dashboard Grid */}
      <Grid container spacing={3}>
        {/* First Row */}
        <Grid item xs={12} md={4}>
          <DashboardCard title="Network Health">
            <NetworkSoul
              healthScore={availabilityStats?.uptimePercent || 0}
              isLoading={isAvailabilityLoading}
            />
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={8}>
          <DashboardCard title={t('deviceOverview')}>
            <DeviceStatusSummary
              stats={availabilityStats}
              isLoading={isAvailabilityLoading}
            />
          </DashboardCard>
        </Grid>

        {/* Second Row */}
        <Grid item xs={12} md={6}>
          <DashboardCard title={t('deviceDistribution')} height={350}>
            <DeviceTypeDistribution
              deviceStats={deviceStats}
              isLoading={isStatsLoading}
            />
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <DashboardCard title={t('recentActivity')} height={350}>
            <RecentActivityList
              isLoading={isAvailabilityLoading || isStatsLoading}
            />
          </DashboardCard>
        </Grid>
      </Grid>

      {/* Add Widget Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 10
        }}
      >
        <Tooltip title="Add Widget" arrow>
          <IconButton
            color="primary"
            size="large"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              boxShadow: theme.shadows[4],
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.9),
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s',
              width: 56,
              height: 56,
            }}
          >
            <AddRounded />
          </IconButton>
        </Tooltip>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;