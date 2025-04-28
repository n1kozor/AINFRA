import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  useTheme,
  alpha,
  LinearProgress,
  Button,
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

  // Fetch device stats
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['deviceStats', device.id],
    queryFn: () => api.standardDevices.getStats(device.id),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Helper function for color determination
  const getColorByUsage = (usage: number) => {
    if (usage > 80) return theme.palette.error.main;
    if (usage > 60) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !stats) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <WarningIcon color="error" sx={{ fontSize: 40, mb: 2 }} />
        <Typography color="error" variant="h6" gutterBottom>
          {t('devices:errors.failedToLoadStats')}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {error instanceof Error ? error.message : t('devices:errors.unknownError')}
        </Typography>
        <Button
          startIcon={<CacheIcon />}
          variant="contained"
          onClick={() => refetch()}
          sx={{ mt: 1 }}
        >
          {t('devices:retry')}
        </Button>
      </Paper>
    );
  }

  // If Glances returned an error
  if (stats.error) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <WarningIcon color="error" sx={{ fontSize: 40, mb: 2 }} />
        <Typography color="error" variant="h6" gutterBottom>
          {t('devices:errors.glancesError')}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {stats.error}
        </Typography>
        <Button
          startIcon={<CacheIcon />}
          variant="contained"
          onClick={() => refetch()}
          sx={{ mt: 1 }}
        >
          {t('devices:retry')}
        </Button>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* System Overview */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('devices:cards.systemInfo')}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={3}>
            {/* System Basic Info */}
            <Grid item xs={12} md={4}>
              <Paper
                variant="outlined"
                sx={{ p: 2, height: '100%' }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  {t('devices:systemInfo.hostInfo')}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="h6">
                    {stats.system?.hostname || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stats.system?.os_name} {stats.system?.os_version}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {t('devices:systemInfo.uptime')}: {stats.system?.uptime || 'N/A'}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* CPU Usage */}
            <Grid item xs={12} md={4}>
              <Paper
                variant="outlined"
                sx={{ p: 2, height: '100%' }}
              >
                <Typography variant="subtitle2" gutterBottom display="flex" alignItems="center">
                  <CpuIcon fontSize="small" sx={{ mr: 1 }} />
                  {t('devices:cpuInfo.usage')}
                </Typography>

                <Box sx={{ position: 'relative', mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={stats.cpu?.usage || 0}
                    sx={{
                      height: 16,
                      borderRadius: 1,
                      bgcolor: alpha(getColorByUsage(stats.cpu?.usage || 0), 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getColorByUsage(stats.cpu?.usage || 0),
                      }
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5, textAlign: 'right' }}
                  >
                    {Math.round(stats.cpu?.usage || 0)}%
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  {t('devices:cpuInfo.cores')}: {stats.cpu?.cores.length || 0}
                </Typography>
              </Paper>
            </Grid>

            {/* Memory Usage */}
            <Grid item xs={12} md={4}>
              <Paper
                variant="outlined"
                sx={{ p: 2, height: '100%' }}
              >
                <Typography variant="subtitle2" gutterBottom display="flex" alignItems="center">
                  <MemoryIcon fontSize="small" sx={{ mr: 1 }} />
                  {t('devices:memoryInfo.usage')}
                </Typography>

                <Box sx={{ position: 'relative', mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={stats.memory?.percent || 0}
                    sx={{
                      height: 16,
                      borderRadius: 1,
                      bgcolor: alpha(getColorByUsage(stats.memory?.percent || 0), 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getColorByUsage(stats.memory?.percent || 0),
                      }
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5, textAlign: 'right' }}
                  >
                    {Math.round(stats.memory?.percent || 0)}%
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  {formatBytes(stats.memory?.used || 0)} / {formatBytes(stats.memory?.total || 0)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Storage Information */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom display="flex" alignItems="center">
            <DiskIcon sx={{ mr: 1 }} />
            {t('devices:cards.diskDetails')}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {stats.disk && stats.disk.length > 0 ? (
            <Grid container spacing={2}>
              {stats.disk.map((disk, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {disk.device} ({disk.mountpoint})
                    </Typography>

                    <Box sx={{ mt: 2, mb: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={disk.percent}
                        sx={{
                          height: 10,
                          borderRadius: 1,
                          bgcolor: alpha(getColorByUsage(disk.percent), 0.1),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getColorByUsage(disk.percent),
                          }
                        }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {formatBytes(disk.used)} {t('devices:diskInfo.used')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {disk.percent}%
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="success.main">
                      {formatBytes(disk.free)} {t('devices:diskInfo.free')}
                      {' '}({formatBytes(disk.total)} {t('devices:diskInfo.total')})
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              {t('devices:diskInfo.noData')}
            </Typography>
          )}
        </Paper>
      </Grid>

      {/* Network Information */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom display="flex" alignItems="center">
            <NetworkIcon sx={{ mr: 1 }} />
            {t('devices:cards.networkInterfaces')}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {stats.network && stats.network.length > 0 ? (
            <Grid container spacing={2}>
              {stats.network.map((iface, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {iface.interface}
                    </Typography>

                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          {t('devices:networkInfo.received')}
                        </Typography>
                        <Typography variant="body1">
                          {formatBytes(iface.rx)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {iface.rx_packets.toLocaleString()} {t('devices:networkInfo.packets')}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          {t('devices:networkInfo.sent')}
                        </Typography>
                        <Typography variant="body1">
                          {formatBytes(iface.tx)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {iface.tx_packets.toLocaleString()} {t('devices:networkInfo.packets')}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              {t('devices:networkInfo.noData')}
            </Typography>
          )}
        </Paper>
      </Grid>

      {/* Process Information */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('devices:processInfo.title')}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Paper
                variant="outlined"
                sx={{ p: 2, textAlign: 'center' }}
              >
                <Typography variant="h4">
                  {stats.processes?.total || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('devices:processInfo.total')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper
                variant="outlined"
                sx={{ p: 2, textAlign: 'center', bgcolor: alpha(theme.palette.success.main, 0.05) }}
              >
                <Typography variant="h4" color="success.main">
                  {stats.processes?.running || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('devices:processInfo.running')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper
                variant="outlined"
                sx={{ p: 2, textAlign: 'center', bgcolor: alpha(theme.palette.info.main, 0.05) }}
              >
                <Typography variant="h4" color="info.main">
                  {stats.processes?.sleeping || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('devices:processInfo.sleeping')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper
                variant="outlined"
                sx={{ p: 2, textAlign: 'center', bgcolor: alpha(theme.palette.warning.main, 0.05) }}
              >
                <Typography variant="h4" color="warning.main">
                  {stats.processes?.thread || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('devices:processInfo.threads')}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default StandardDeviceDetails;