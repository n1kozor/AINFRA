import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Divider,
  CircularProgress,
  useTheme,
  alpha,
  LinearProgress,
  Button,
  Paper,
} from '@mui/material';
import {
  Memory as CpuIcon,
  Storage as MemoryIcon,
  Save as DiskIcon,
  NetworkCheck as NetworkIcon,
  Warning as WarningIcon,
  Cached as CacheIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Device } from '../../../types/device';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api';
import { formatBytes } from '../../../utils/formatters';

interface StandardDeviceDetailsProps {
  device: Device;
}

const StandardDeviceDetails: React.FC<StandardDeviceDetailsProps> = ({ device }) => {
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();

  // Format number with thousands separators
  const formatNumber = (num: number = 0): string => {
    return num.toLocaleString();
  };

  // Fetch device stats
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['deviceStats', device.id],
    queryFn: () => api.standardDevices.getStats(device.id),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Helper function for color determination
  const getColorByUsage = (usage: number = 0) => {
    if (usage > 80) return theme.palette.error.main;
    if (usage > 60) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  if (isLoading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
        <CircularProgress size={40} sx={{ my: 4 }} />
        <Typography variant="body1" color="text.secondary">
          {t('devices:fetchingStats')}
        </Typography>
      </Paper>
    );
  }

  if (error || !stats) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
        <WarningIcon color="warning" sx={{ fontSize: 40, mb: 2, mt: 2 }} />
        <Typography color="warning.main" variant="h6" gutterBottom>
          {t('devices:errors.failedToLoadStats')}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {error instanceof Error ? error.message : t('devices:errors.unknownError')}
        </Typography>
        <Button
          startIcon={<CacheIcon />}
          variant="contained"
          onClick={() => refetch()}
          sx={{ mb: 2 }}
        >
          {t('devices:retry')}
        </Button>
      </Paper>
    );
  }

  // If Glances returned an error
  if (stats.error) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
        <WarningIcon color="error" sx={{ fontSize: 40, mb: 2, mt: 2 }} />
        <Typography color="error.main" variant="h6" gutterBottom>
          {t('devices:errors.glancesError')}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {stats.error}
        </Typography>
        <Button
          startIcon={<CacheIcon />}
          variant="contained"
          onClick={() => refetch()}
          sx={{ mb: 2 }}
        >
          {t('devices:retry')}
        </Button>
      </Paper>
    );
  }

  // Safely access nested properties with fallbacks
  const cpuData = stats?.cpu || {};
  const memoryData = stats?.memory || {};
  const systemData = stats?.system || {};
  const processesData = stats?.processes || {};
  const diskData = stats?.disk || [];
  const networkData = stats?.network || [];

  return (
    <Box>
      {/* System Overview Section: CPU & Memory */}
      <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('devices:systemOverview')}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* CPU */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box sx={{ mr: 2, p: 1, borderRadius: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                <CpuIcon color="primary" />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {t('devices:cpuInfo.title')}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ color: getColorByUsage(cpuData.usage || 0) }}
                  >
                    {Math.round(cpuData.usage || 0)}%
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={cpuData.usage || 0}
                  sx={{
                    mt: 1,
                    mb: 2,
                    height: 10,
                    borderRadius: 5,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getColorByUsage(cpuData.usage || 0),
                    }
                  }}
                />

                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      {t('devices:cpuInfo.user')}
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {(cpuData.user || 0).toFixed(1)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      {t('devices:cpuInfo.system')}
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {(cpuData.system || 0).toFixed(1)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      {t('devices:cpuInfo.idle')}
                    </Typography>
                    <Typography variant="body2" fontWeight={500} color="success.main">
                      {(cpuData.idle || 0).toFixed(1)}%
                    </Typography>
                  </Grid>
                </Grid>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {t('devices:cpuInfo.cores')}: {(cpuData.cores || []).length}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Memory */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box sx={{ mr: 2, p: 1, borderRadius: 1, bgcolor: alpha(theme.palette.secondary.main, 0.1) }}>
                <MemoryIcon color="secondary" />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {t('devices:memoryInfo.title')}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ color: getColorByUsage(memoryData.percent || 0) }}
                  >
                    {Math.round(memoryData.percent || 0)}%
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={memoryData.percent || 0}
                  sx={{
                    mt: 1,
                    mb: 2,
                    height: 10,
                    borderRadius: 5,
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getColorByUsage(memoryData.percent || 0),
                    }
                  }}
                />

                <Typography variant="body2" sx={{ mb: 1 }}>
                  {formatBytes(memoryData.used || 0)} / {formatBytes(memoryData.total || 0)}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {t('devices:memoryInfo.free')}
                    </Typography>
                    <Typography variant="body2" fontWeight={500} color="success.main">
                      {formatBytes(memoryData.free || 0)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {t('devices:memoryInfo.cached')}
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatBytes(memoryData.cached || 0)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* System Information and Disk Usage */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* System Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {t('devices:systemInfo.title')}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('devices:systemInfo.hostname')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {systemData.hostname || 'N/A'}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {t('devices:systemInfo.platform')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {systemData.os_name || 'N/A'} {systemData.os_version || ''}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {t('devices:systemInfo.uptime')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {systemData.uptime || 'N/A'}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {t('devices:processInfo.title')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 4, mt: 0.5 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('devices:processInfo.total')}
                  </Typography>
                  <Typography variant="body1">
                    {formatNumber(processesData.total || 0)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('devices:processInfo.running')}
                  </Typography>
                  <Typography variant="body1" color="success.main">
                    {formatNumber(processesData.running || 0)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Disk Usage */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {t('devices:storage.title')}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {diskData.length > 0 ? (
              <Grid container spacing={2}>
                {diskData.map((disk, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DiskIcon
                            fontSize="small"
                            sx={{
                              mr: 1,
                              color: alpha(theme.palette.warning.main, 0.7)
                            }}
                          />
                          <Typography variant="body2" fontWeight={500}>
                            {disk.device || 'disk'} ({disk.mountpoint || '/'})
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          sx={{ color: getColorByUsage(disk.percent || 0) }}
                        >
                          {disk.percent || 0}%
                        </Typography>
                      </Box>

                      <LinearProgress
                        variant="determinate"
                        value={disk.percent || 0}
                        sx={{
                          mb: 1,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: alpha(theme.palette.warning.main, 0.1),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getColorByUsage(disk.percent || 0),
                          }
                        }}
                      />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatBytes(disk.used || 0)} used
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatBytes(disk.free || 0)} free
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                {t('devices:storage.noData')}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Network Interfaces */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          {t('devices:network.title')}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {networkData.length > 0 ? (
          <Grid container spacing={3}>
            {networkData.map((iface, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <NetworkIcon
                      fontSize="small"
                      sx={{
                        mr: 1,
                        color: theme.palette.info.main
                      }}
                    />
                    <Typography variant="subtitle2" fontWeight={500}>
                      {iface.interface || 'eth0'}
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderRadius: 1,
                        height: '100%',
                      }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('devices:network.received')}
                        </Typography>
                        <Typography variant="body1" fontWeight={500} color="primary.main">
                          {formatBytes(iface.rx || 0)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatNumber(iface.rx_packets || 0)} {t('devices:network.packets')}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.secondary.main, 0.05),
                        borderRadius: 1,
                        height: '100%',
                      }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('devices:network.sent')}
                        </Typography>
                        <Typography variant="body1" fontWeight={500} color="secondary.main">
                          {formatBytes(iface.tx || 0)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatNumber(iface.tx_packets || 0)} {t('devices:network.packets')}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            {t('devices:network.noData')}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default StandardDeviceDetails;