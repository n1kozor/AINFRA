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
              backgroundColor: 'transparent',
            }}
          >
            {/* Decorative elements */}
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