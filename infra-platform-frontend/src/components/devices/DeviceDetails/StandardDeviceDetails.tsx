import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  useTheme,
  alpha,
  LinearProgress,
  Divider,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Memory as CpuIcon,
  Storage as MemoryIcon,
  Save as DiskIcon,
  NetworkCheck as NetworkIcon,
  Info as InfoIcon,
  Whatshot as TempIcon,
  Bolt as PerformanceIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Device, DeviceStats } from '../../../types/device';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api';
import MetricsPanel from './MetricsPanel';
import DashboardCard from '../../dashboard/DashboardCard';
import { formatBytes } from '../../../utils/formatters';

interface StandardDeviceDetailsProps {
  device: Device;
}

const StandardDeviceDetails: React.FC<StandardDeviceDetailsProps> = ({ device }) => {
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();
  const [tabValue, setTabValue] = React.useState(0);

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['deviceStats', device.id],
    queryFn: () => api.standardDevices.getStats(device.id),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !stats) {
    return (
      <Box p={3} bgcolor={alpha(theme.palette.error.main, 0.1)} borderRadius={1}>
        <Typography color="error">
          {t('devices:errors.failedToLoadStats')}
        </Typography>
        <Typography variant="body2">
          {error instanceof Error ? error.message : t('devices:errors.unknownError')}
        </Typography>
      </Box>
    );
  }

  // If Glances returned an error
  if (stats.error) {
    return (
      <Box p={3} bgcolor={alpha(theme.palette.error.main, 0.1)} borderRadius={1}>
        <Typography color="error">
          {t('devices:errors.glancesError')}
        </Typography>
        <Typography variant="body2">{stats.error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="device metrics tabs"
          centered
        >
          <Tab
            icon={<PerformanceIcon fontSize="small" />}
            iconPosition="start"
            label={t('devices:tabs.overview')}
          />
          <Tab
            icon={<CpuIcon fontSize="small" />}
            iconPosition="start"
            label={t('devices:tabs.system')}
          />
          <Tab
            icon={<DiskIcon fontSize="small" />}
            iconPosition="start"
            label={t('devices:tabs.storage')}
          />
          <Tab
            icon={<NetworkIcon fontSize="small" />}
            iconPosition="start"
            label={t('devices:tabs.network')}
          />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* System Info */}
          <Grid item xs={12} lg={6}>
            <DashboardCard
              title={t('devices:cards.systemInfo')}
              icon={<InfoIcon />}
              color="info"
            >
              <Box sx={{ p: 1 }}>
                {stats.system && (
                  <Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {t('devices:systemInfo.hostname')}
                      </Typography>
                      <Typography variant="body1">
                        {stats.system.hostname}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {t('devices:systemInfo.os')}
                      </Typography>
                      <Typography variant="body1">
                        {stats.system.os_name} {stats.system.os_version}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        {t('devices:systemInfo.uptime')}
                      </Typography>
                      <Typography variant="body1">
                        {stats.system.uptime}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </DashboardCard>
          </Grid>

          {/* CPU Usage */}
          <Grid item xs={12} sm={6} lg={3}>
            <DashboardCard
              title={t('devices:cards.cpuUsage')}
              icon={<CpuIcon />}
              color="primary"
            >
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 2,
                }}
              >
                {stats.cpu && (
                  <>
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <CircularProgress
                        variant="determinate"
                        value={stats.cpu.usage}
                        size={120}
                        thickness={4}
                        sx={{
                          color: (theme) =>
                            stats.cpu.usage > 80
                              ? theme.palette.error.main
                              : stats.cpu.usage > 60
                              ? theme.palette.warning.main
                              : theme.palette.primary.main,
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="h4" component="div">
                          {Math.round(stats.cpu.usage)}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {stats.cpu.cores.length} {t('devices:cpuInfo.cores')}
                    </Typography>
                  </>
                )}
              </Box>
            </DashboardCard>
          </Grid>

          {/* Memory Usage */}
          <Grid item xs={12} sm={6} lg={3}>
            <DashboardCard
              title={t('devices:cards.memoryUsage')}
              icon={<MemoryIcon />}
              color="secondary"
            >
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 2,
                }}
              >
                {stats.memory && (
                  <>
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <CircularProgress
                        variant="determinate"
                        value={stats.memory.percent}
                        size={120}
                        thickness={4}
                        sx={{
                          color: (theme) =>
                            stats.memory.percent > 80
                              ? theme.palette.error.main
                              : stats.memory.percent > 60
                              ? theme.palette.warning.main
                              : theme.palette.success.main,
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="h4" component="div">
                          {Math.round(stats.memory.percent)}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {formatBytes(stats.memory.used)} / {formatBytes(stats.memory.total)}
                    </Typography>
                  </>
                )}
              </Box>
            </DashboardCard>
          </Grid>

          {/* Disk Usage */}
          {stats.disk && stats.disk.length > 0 && (
            <Grid item xs={12}>
              <DashboardCard
                title={t('devices:cards.diskUsage')}
                icon={<DiskIcon />}
                color="success"
              >
                <Grid container spacing={2}>
                  {stats.disk.map((disk, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: 1,
                          backgroundColor: alpha(
                            theme.palette.background.paper,
                            0.6
                          ),
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1,
                          }}
                        >
                          <Typography variant="subtitle2" noWrap>
                            {disk.mountpoint}
                          </Typography>
                          <Chip
                            label={`${Math.round(disk.percent)}%`}
                            size="small"
                            color={
                              disk.percent > 80
                                ? 'error'
                                : disk.percent > 60
                                ? 'warning'
                                : 'success'
                            }
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={disk.percent}
                          sx={{ height: 8, borderRadius: 1, mb: 1 }}
                          color={
                            disk.percent > 80
                              ? 'error'
                              : disk.percent > 60
                              ? 'warning'
                              : 'success'
                          }
                        />
                        <Typography variant="body2" color="textSecondary">
                          {formatBytes(disk.used)} / {formatBytes(disk.total)}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </DashboardCard>
            </Grid>
          )}
        </Grid>
      )}

      {/* System Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          {/* CPU Details */}
          <Grid item xs={12} md={6}>
            <DashboardCard
              title={t('devices:cards.cpuDetails')}
              icon={<CpuIcon />}
              color="primary"
            >
              {stats.cpu && (
                <Box>
                  {/* Overall CPU Usage */}
                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle2">
                        {t('devices:cpuInfo.overall')}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {Math.round(stats.cpu.usage)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={stats.cpu.usage}
                      sx={{ height: 10, borderRadius: 1 }}
                      color={
                        stats.cpu.usage > 80
                          ? 'error'
                          : stats.cpu.usage > 60
                          ? 'warning'
                          : 'primary'
                      }
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* CPU Cores */}
                  <Typography variant="subtitle1" gutterBottom>
                    {t('devices:cpuInfo.cores')}
                  </Typography>

                  <Grid container spacing={2}>
                    {stats.cpu.cores.map((core) => (
                      <Grid item xs={12} sm={6} key={core.core}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1,
                          }}
                        >
                          <Typography variant="subtitle2">
                            {t('devices:cpuInfo.core')} {core.core}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {Math.round(core.usage)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={core.usage}
                          sx={{ height: 8, borderRadius: 1 }}
                          color={
                            core.usage > 80
                              ? 'error'
                              : core.usage > 60
                              ? 'warning'
                              : 'primary'
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </DashboardCard>
          </Grid>

          {/* Process Information */}
          <Grid item xs={12} md={6}>
            <DashboardCard
              title={t('devices:cards.processes')}
              icon={<InfoIcon />}
              color="info"
            >
              {stats.processes && (
                <Box sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 2,
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                      }}
                    >
                      <Typography variant="h5" color="primary">
                        {stats.processes.total}
                      </Typography>
                      <Typography variant="subtitle2">
                        {t('devices:processInfo.total')}
                      </Typography>
                    </Paper>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                      }}
                    >
                      <Typography variant="h5" color="success">
                        {stats.processes.running}
                      </Typography>
                      <Typography variant="subtitle2">
                        {t('devices:processInfo.running')}
                      </Typography>
                    </Paper>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                      }}
                    >
                      <Typography variant="h5" color="info">
                        {stats.processes.sleeping}
                      </Typography>
                      <Typography variant="subtitle2">
                        {t('devices:processInfo.sleeping')}
                      </Typography>
                    </Paper>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                      }}
                    >
                      <Typography variant="h5" color="warning">
                        {stats.processes.thread}
                      </Typography>
                      <Typography variant="subtitle2">
                        {t('devices:processInfo.threads')}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              )}
            </DashboardCard>
          </Grid>

          {/* Temperature Information (if available) */}
          {stats.cpu && stats.cpu.temperature && stats.cpu.temperature.length > 0 && (
            <Grid item xs={12}>
              <DashboardCard
                title={t('devices:cards.temperature')}
                icon={<TempIcon />}
                color="error"
              >
                <Grid container spacing={2} sx={{ p: 2 }}>
                  {stats.cpu.temperature.map((temp, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: alpha(
                            temp.value > 80
                              ? theme.palette.error.main
                              : temp.value > 60
                              ? theme.palette.warning.main
                              : theme.palette.success.main,
                            0.1
                          ),
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          noWrap
                          title={temp.label}
                        >
                          {temp.label}
                        </Typography>
                        <Typography
                          variant="h5"
                          color={
                            temp.value > 80
                              ? 'error'
                              : temp.value > 60
                              ? 'warning'
                              : 'success'
                          }
                        >
                          {temp.value}°C
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </DashboardCard>
            </Grid>
          )}
        </Grid>
      )}

      {/* Storage Tab */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DashboardCard
              title={t('devices:cards.diskDetails')}
              icon={<DiskIcon />}
              color="success"
            >
              {stats.disk && stats.disk.length > 0 ? (
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={3}>
                    {stats.disk.map((disk, index) => (
                      <Grid item xs={12} key={index}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.background.paper, 0.6),
                          }}
                        >
                          <Typography variant="h6" gutterBottom>
                            {disk.device} ({disk.mountpoint})
                          </Typography>

                          <Box sx={{ mb: 2 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 1,
                              }}
                            >
                              <Typography variant="body2">
                                {t('devices:diskInfo.usage')}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {disk.percent.toFixed(1)}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={disk.percent}
                              sx={{ height: 10, borderRadius: 1 }}
                              color={
                                disk.percent > 80
                                  ? 'error'
                                  : disk.percent > 60
                                  ? 'warning'
                                  : 'success'
                              }
                            />
                          </Box>

                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2,
                                  textAlign: 'center',
                                  borderRadius: 2,
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                }}
                              >
                                <Typography variant="h6" color="primary">
                                  {formatBytes(disk.total)}
                                </Typography>
                                <Typography variant="subtitle2">
                                  {t('devices:diskInfo.total')}
                                </Typography>
                              </Paper>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2,
                                  textAlign: 'center',
                                  borderRadius: 2,
                                  bgcolor: alpha(theme.palette.error.main, 0.1),
                                }}
                              >
                                <Typography variant="h6" color="error">
                                  {formatBytes(disk.used)}
                                </Typography>
                                <Typography variant="subtitle2">
                                  {t('devices:diskInfo.used')}
                                </Typography>
                              </Paper>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2,
                                  textAlign: 'center',
                                  borderRadius: 2,
                                  bgcolor: alpha(theme.palette.success.main, 0.1),
                                }}
                              >
                                <Typography variant="h6" color="success">
                                  {formatBytes(disk.free)}
                                </Typography>
                                <Typography variant="subtitle2">
                                  {t('devices:diskInfo.free')}
                                </Typography>
                              </Paper>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="textSecondary">
                    {t('devices:diskInfo.noData')}
                  </Typography>
                </Box>
              )}
            </DashboardCard>
          </Grid>
        </Grid>
      )}

      {/* Network Tab */}
      {tabValue === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DashboardCard
              title={t('devices:cards.networkInterfaces')}
              icon={<NetworkIcon />}
              color="info"
            >
              {stats.network && stats.network.length > 0 ? (
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={3}>
                    {stats.network.map((iface, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.background.paper, 0.6),
                          }}
                        >
                          <Typography variant="h6" gutterBottom>
                            {iface.interface}
                          </Typography>

                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                }}
                              >
                                <Typography variant="subtitle2" gutterBottom>
                                  {t('devices:networkInfo.received')}
                                </Typography>
                                <Typography variant="h6" color="primary">
                                  {formatBytes(iface.rx)}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {iface.rx_packets} {t('devices:networkInfo.packets')}
                                </Typography>
                              </Paper>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                }}
                              >
                                <Typography variant="subtitle2" gutterBottom>
                                  {t('devices:networkInfo.sent')}
                                </Typography>
                                <Typography variant="h6" color="secondary">
                                  {formatBytes(iface.tx)}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {iface.tx_packets} {t('devices:networkInfo.packets')}
                                </Typography>
                              </Paper>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="textSecondary">
                    {t('devices:networkInfo.noData')}
                  </Typography>
                </Box>
              )}
            </DashboardCard>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default StandardDeviceDetails;