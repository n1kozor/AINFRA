// Dashboard.tsx - teljesen átdolgozott elrendezés
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Button,
  useTheme,
  alpha,
  Tooltip,
  IconButton,
  CircularProgress,
  Stack,
  Paper,
  Divider,
  Chip,
} from '@mui/material';
import {
  ComputerRounded as StandardIcon,
  SmartToyRounded as CustomIcon,
  ExtensionRounded as PluginIcon,
  SpeedRounded as SpeedIcon,
  RefreshRounded as RefreshIcon,
  HealthAndSafetyRounded as HealthIcon,
  SignalCellularAltRounded as SignalIcon,
  ViewDayRounded as ViewDayIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';

// Custom hooks
import { useDashboardData } from '../hooks/useDashboardData';
import { useAvailability } from '../hooks/useAvailability';

// Components
import PageContainer from '../components/common/PageContainer';
import StatsCard from '../components/dashboard/StatsCard';
import DeviceAvailabilityCard from '../components/dashboard/DeviceAvailabilityCard';
import OsDistributionCard from '../components/dashboard/OsDistributionCard';
import SystemHealthCard from '../components/dashboard/SystemHealthCard';
import RecentDevicesCard from '../components/dashboard/RecentDevicesCard';

// Empty availability stats as initial value
const emptyStats = {
  totalDevices: 0,
  availableDevices: 0,
  unavailableDevices: 0,
  uptimePercent: 0
};

const Dashboard = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const theme = useTheme();
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState<number>(0);

  // Hooks for data fetching and availability
  const {
    useLatestAvailabilityData,
    useCheckResults,
    useDeviceAvailabilityChart,
    useRunAvailabilityChecks,
    useCheckStatus,
    calculateAvailabilityStats,
    mergeAvailabilityData
  } = useAvailability();

  // Get latest availability data from DB (fast query)
  const {
    data: latestAvailability,
    isLoading: isLoadingLatestAvailability,
    refetch: refetchLatestAvailability,
  } = useLatestAvailabilityData();

  // Get streaming check results when a check is running
  const { data: checkStatus } = useCheckStatus();

  // Only fetch streaming results if a check is in progress
  const {
    data: streamingResults,
    isLoading: isLoadingStreamingResults,
  } = useCheckResults(2000, checkStatus?.in_progress || false);

  // Background check mutation with high concurrency
  const { mutate: runBackgroundChecks, isLoading: isStartingChecks } = useRunAvailabilityChecks();

  // Dashboard data
  const {
    devices,
    plugins,
    stats,
    recentDevices,
    osDistributionData,
    systemHealthData,
    isLoading,
    refetchAll
  } = useDashboardData(refreshKey, calculateAvailabilityStats(
    mergeAvailabilityData(latestAvailability, streamingResults)
  ));

  // Get chart data for a selected device
  const {
    data: deviceChartData,
    isLoading: isLoadingDeviceChart,
  } = useDeviceAvailabilityChart(
    selectedDevice || 0,
    7,
    !!selectedDevice
  );

  // Run initial availability check in background if not already running
  useEffect(() => {
    if (!checkStatus?.in_progress && !isStartingChecks && devices && devices.length > 0) {
      const concurrency = Math.min(Math.max(10, Math.floor(devices.length / 5)), 100);
      runBackgroundChecks(concurrency);
    }
  }, [devices, checkStatus?.in_progress, isStartingChecks, runBackgroundChecks]);

  // Automatically select the first device if none is selected
  useEffect(() => {
    if (!selectedDevice && devices && devices.length > 0) {
      setSelectedDevice(devices[0].id);
    }
  }, [devices, selectedDevice]);

  // Handler for refreshing all data
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetchAll();
    refetchLatestAvailability();

    // Start a new availability check with high concurrency
    if (!checkStatus?.in_progress && devices) {
      const concurrency = Math.min(Math.max(10, Math.floor(devices.length / 5)), 100);
      runBackgroundChecks(concurrency);
    }
  };

  // Merge and calculate availability stats
  const availabilityData = React.useMemo(() => {
    return mergeAvailabilityData(latestAvailability, streamingResults);
  }, [latestAvailability, streamingResults, mergeAvailabilityData]);

  const availabilityStats = React.useMemo(() => {
    return calculateAvailabilityStats(availabilityData);
  }, [availabilityData, calculateAvailabilityStats]);

  return (
    <PageContainer
      title={t('dashboard:title')}
      subtitle={t('dashboard:subtitle')}
      icon={<SpeedIcon sx={{ fontSize: 26 }} />}
      actions={
        <Stack direction="row" spacing={1}>
          <Tooltip title={t('dashboard:refresh')} arrow>
            <IconButton
              onClick={handleRefresh}
              color="primary"
              disabled={isStartingChecks}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: '12px',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                }
              }}
            >
              {isStartingChecks ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <RefreshIcon />
              )}
            </IconButton>
          </Tooltip>

          <Button
            component={Link}
            to="/devices/new"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{
              px: 3,
              py: 1.2,
              borderRadius: '12px',
              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            }}
          >
            {t('dashboard:addDevice')}
          </Button>
        </Stack>
      }
    >
      <AnimatePresence>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', width: '100%' }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* Dashboard Summary Section */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.85)})`,
                backdropFilter: 'blur(10px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? `0 8px 32px ${alpha(theme.palette.common.black, 0.25)}`
                  : `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'flex-start', md: 'center' },
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={{ xs: 2, md: 0 }}>
                  <ViewDayIcon sx={{ fontSize: 24, color: theme.palette.primary.main }} />
                  <Typography variant="h5" fontWeight={700}>
                    {t('dashboard:sections.overview')}
                  </Typography>
                </Box>

                {/* Mobile device counts */}
                <Box
                  sx={{
                    display: { xs: 'flex', md: 'none' },
                    gap: 2,
                    flexWrap: 'wrap'
                  }}
                >
                  <Chip
                    label={`${stats?.totalDevices || 0} ${t('dashboard:stats.totalDevicesShort')}`}
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip
                    label={`${availabilityStats.availableDevices || 0} ${t('dashboard:stats.availableShort')}`}
                    color="success"
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip
                    label={`${availabilityStats.unavailableDevices || 0} ${t('dashboard:stats.unavailableShort')}`}
                    color="error"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {/* Desktop detailed stats */}
                <Box
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    gap: 3,
                  }}
                >
                  <Box textAlign="center">
                    <Typography variant="h5" fontWeight={700} color={theme.palette.primary.main}>
                      {stats?.totalDevices || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('dashboard:stats.totalDevices')}
                    </Typography>
                  </Box>

                  <Divider orientation="vertical" flexItem />

                  <Box textAlign="center">
                    <Typography variant="h5" fontWeight={700} color={theme.palette.success.main}>
                      {availabilityStats.availableDevices || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('dashboard:stats.available')}
                    </Typography>
                  </Box>

                  <Divider orientation="vertical" flexItem />

                  <Box textAlign="center">
                    <Typography variant="h5" fontWeight={700} color={theme.palette.error.main}>
                      {availabilityStats.unavailableDevices || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('dashboard:stats.unavailable')}
                    </Typography>
                  </Box>

                  <Divider orientation="vertical" flexItem />

                  <Box textAlign="center">
                    <Typography variant="h5" fontWeight={700} color={theme.palette.info.main}>
                      {availabilityStats.uptimePercent || 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('dashboard:stats.uptimePercent')}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} lg={3}>
                  <StatsCard
                    title={t('dashboard:stats.totalDevices')}
                    value={stats?.totalDevices || 0}
                    icon={<SpeedIcon />}
                    color="primary"
                    trend={10}
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <StatsCard
                    title={t('dashboard:stats.standardDevices')}
                    value={stats?.standardDevices || 0}
                    icon={<StandardIcon />}
                    color="info"
                    trend={5}
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <StatsCard
                    title={t('dashboard:stats.customDevices')}
                    value={stats?.customDevices || 0}
                    icon={<CustomIcon />}
                    color="secondary"
                    trend={-2}
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <StatsCard
                    title={t('dashboard:stats.plugins')}
                    value={plugins?.length || 0}
                    icon={<PluginIcon />}
                    color="success"
                    trend={8}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Main Content Area */}
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 3,
                }}
              >
                <SignalIcon sx={{ fontSize: 24, color: theme.palette.info.main }} />
                <Typography variant="h5" fontWeight={700}>
                  {t('dashboard:sections.monitoring')}
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {/* Device Availability Card - Main column */}
                <Grid item xs={12} lg={8} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <DeviceAvailabilityCard
                    devices={devices}
                    availabilityStats={availabilityStats}
                    selectedDevice={selectedDevice}
                    onSelectDevice={setSelectedDevice}
                    chartData={deviceChartData}
                    isLoadingChartData={isLoadingDeviceChart}
                    isLoadingAvailability={isLoadingLatestAvailability && isLoadingStreamingResults}
                    onRefresh={handleRefresh}
                    checkStatus={checkStatus}
                  />

                  {/* Recent Devices - Below availability card */}
                  <RecentDevicesCard
                    devices={recentDevices}
                    onRefresh={handleRefresh}
                  />
                </Grid>

                {/* Right sidebar column */}
                <Grid item xs={12} lg={4} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <SystemHealthCard
                    data={systemHealthData}
                    healthScore={stats?.healthScore || 0}
                    onRefresh={handleRefresh}
                  />

                  <OsDistributionCard
                    data={osDistributionData}
                    onRefresh={handleRefresh}
                  />
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default Dashboard;