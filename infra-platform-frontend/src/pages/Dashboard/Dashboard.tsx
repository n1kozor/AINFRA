import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Grid,
  Paper
} from '@mui/material';
import {
  DashboardOutlined,
  RefreshRounded,
  SettingsOutlined
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import PageContainer from '../../components/common/PageContainer';
import { useTranslation } from 'react-i18next';
import NetworkSoul from '../../components/dashboard/NetworkSoul';
import DeviceStatusSummary from '../../components/dashboard/DeviceStatusSummary';
import DeviceTypeDistribution from '../../components/dashboard/DeviceTypeDistribution';
import RecentActivityList from '../../components/dashboard/RecentActivityList';
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

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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



      {/* Main Dashboard Layout */}
      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          position: 'relative',
        }}
      >
        {/* Soul Section - At the top and centered */}
        <Box
          component={motion.div}
          variants={itemVariants}
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 3,
              borderRadius: 6,
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.7)}, ${alpha(theme.palette.background.paper, 0.5)})`,
              backdropFilter: 'blur(20px)',
              boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.1)}`,
              position: 'relative',
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            }}
          >
            {/* Decorative elements */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.4,
                background: `radial-gradient(circle at 30% 40%, ${alpha(theme.palette.primary.main, 0.1)}, transparent 50%),
                            radial-gradient(circle at 70% 60%, ${alpha(theme.palette.secondary.main, 0.1)}, transparent 50%)`,
                zIndex: 0,
              }}
            />

            <NetworkSoul
              healthScore={availabilityStats?.uptimePercent || 0}
              isLoading={isAvailabilityLoading}
            />
          </Paper>
        </Box>




      </Box>
    </PageContainer>
  );
};

export default Dashboard;