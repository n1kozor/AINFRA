import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  LinearProgress,
  Button,
  Chip,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Memory as CpuIcon,
  Storage as MemoryIcon,
  Save as DiskIcon,
  NetworkCheck as NetworkIcon,
  Warning as WarningIcon,
  Cached as CacheIcon,
  Info as InfoIcon,
  ViewList as ProcessIcon,
  ViewModule as ContainerIcon,
  Refresh as RefreshIcon,
  DeveloperBoard as BoardIcon,
  LayersTwoTone as LayersIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api';
import { formatBytes } from '../../../utils/formatters';
import { Device, DeviceStats, ProcessInfo, ContainerInfo } from '../../../types/device';

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}


function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`device-tabpanel-${index}`}
          aria-labelledby={`device-tab-${index}`}
          {...other}
      >
        {value === index && (
            <Box sx={{ pt: 3 }}>
              {children}
            </Box>
        )}
      </div>
  );
}

interface CircularProgressWithLabelProps {
  value: number;
  size?: number;
  thickness?: number;
}

function CircularProgressWithLabel({
                                     value,
                                     size = 100,
                                     thickness = 5,
                                     ...props
                                   }: CircularProgressWithLabelProps) {
  const theme = useTheme();

  const getColor = (value: number) => {
    if (value > 80) return theme.palette.error.main;
    if (value > 60) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
            variant="determinate"
            size={size}
            thickness={thickness}
            value={value}
            sx={{ color: getColor(value) }}
            {...props}
        />
        <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
        >
          <Typography
              variant="caption"
              component="div"
              sx={{ fontWeight: 'bold', fontSize: size / 4 }}
          >
            {`${Math.round(value)}%`}
          </Typography>
        </Box>
      </Box>
  );
}

interface StandardDeviceDetailsProps {
  device: Device;
}

const StandardDeviceDetails: React.FC<StandardDeviceDetailsProps> = ({ device }) => {
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatNumber = (num = 0): string => {
    return num.toLocaleString();
  };

  const getColorByUsage = (usage = 0): string => {
    if (usage > 80) return theme.palette.error.main;
    if (usage > 60) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  const {
    data: stats,
    isLoading,
    error,
    refetch,
    isRefetching
  } = useQuery<DeviceStats>({
    queryKey: ['deviceStats', device.id],
    queryFn: () => api.standardDevices.getStats(device.id),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <CircularProgress size={40} sx={{ my: 3 }} />
          <Typography variant="h6" color="text.secondary">
            {t('devices:fetchingStats')}
          </Typography>
        </Paper>
    );
  }

  if (error || !stats) {
    return (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <WarningIcon color="warning" sx={{ fontSize: 48, mb: 2, mt: 2 }} />
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
              sx={{ mt: 1 }}
          >
            {t('devices:retry')}
          </Button>
        </Paper>
    );
  }

  if ('error' in stats && stats.error) {
    return (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <WarningIcon color="error" sx={{ fontSize: 48, mb: 2, mt: 2 }} />
          <Typography color="error.main" variant="h6" gutterBottom>
            {t('devices:errors.glancesError')}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ maxWidth: 600, mx: 'auto' }}>
            {stats.error}
          </Typography>
          <Button
              startIcon={<CacheIcon />}
              variant="contained"
              onClick={() => refetch()}
              sx={{ mt: 2 }}
          >
            {t('devices:retry')}
          </Button>
        </Paper>
    );
  }

  const system = (stats?.system || {}) as { hostname?: string, os_name?: string, platform?: string, linux_distro?: string, uptime?: string };
  const cpu = (stats?.cpu || {}) as { [key: string]: any };
  const memory = (stats?.memory || {}) as { [key: string]: any };
  const disk = (stats?.disk || []) as { [key: string]: any }[];
  const network = (stats?.network || []) as { [key: string]: any }[];
  const processes = (stats?.processes || {}) as { [key: string]: any };
  const containers = stats?.containers || [];

  return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
              onClick={() => refetch()}
              startIcon={<RefreshIcon />}
              variant="outlined"
              disabled={isRefetching}
          >
            {isRefetching ? t('devices:refreshing') : t('devices:refresh')}
          </Button>
        </Box>

        <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BoardIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">
              {system.hostname || device.name}
            </Typography>
            <Chip
                label={system.os_name || 'Unknown OS'}
                size="small"
                sx={{ ml: 2 }}
            />
          </Box>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('devices:systemInfo.platform')}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {system.os_name} {system.platform} {system.linux_distro ? `(${system.linux_distro})` : ''}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  {t('devices:systemInfo.uptime')}
                </Typography>
                <Typography variant="body1">
                  {system.uptime || 'Unknown'}
                </Typography>
              </Box>
            </Grid>



            <Grid container spacing={2} size={{ xs: 12, md: 8 }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Tooltip title={t('devices:cpuInfo.title')}>
                    <Box>
                      <CircularProgressWithLabel value={cpu.usage || 0} size={70} />
                    </Box>
                  </Tooltip>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    CPU
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Tooltip title={t('devices:memoryInfo.title')}>
                    <Box>
                      <CircularProgressWithLabel value={memory.percent || 0} size={70} />
                    </Box>
                  </Tooltip>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    RAM
                  </Typography>
                </Box>
              </Grid>

              {(memory.swap_total || 0) > 0 && (
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Tooltip title={t('devices:memoryInfo.swap')}>
                        <Box>
                          <CircularProgressWithLabel value={memory.swap_percent || 0} size={70} />
                        </Box>
                      </Tooltip>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        SWAP
                      </Typography>
                    </Box>
                  </Grid>
              )}

              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h5" fontWeight="bold" color="text.secondary">
                      {processes.total || 0}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {t('devices:processInfo.processes')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>


          </Grid>
        </Paper>

        <Box sx={{ mb: 3 }}>
          <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 48,
                  py: 1.5
                }
              }}
          >
            <Tab
                icon={<CpuIcon />}
                label={t('devices:tabs.hardware')}
                iconPosition="start"
            />
            <Tab
                icon={<DiskIcon />}
                label={t('devices:tabs.storage')}
                iconPosition="start"
            />
            <Tab
                icon={<NetworkIcon />}
                label={t('devices:tabs.network')}
                iconPosition="start"
            />
            <Tab
                icon={<ProcessIcon />}
                label={t('devices:tabs.processes')}
                iconPosition="start"
            />
            {containers && containers.length > 0 && (
                <Tab
                    icon={<ContainerIcon />}
                    label={t('devices:tabs.containers')}
                    iconPosition="start"
                />
            )}
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
            >
              {/* CPU Paper */}
              <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CpuIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    {t('devices:cpuInfo.title')}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" fontWeight={500}>
                      {t('devices:cpuInfo.usage')}
                    </Typography>
                    <Typography variant="body1" fontWeight={700} sx={{ color: getColorByUsage(cpu.usage || 0) }}>
                      {(cpu.usage || 0).toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                      variant="determinate"
                      value={cpu.usage || 0}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        mb: 2,
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getColorByUsage(cpu.usage || 0),
                        },
                      }}
                  />

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('devices:cpuInfo.user')}
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {(cpu.user || 0).toFixed(1)}%
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('devices:cpuInfo.system')}
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {(cpu.system || 0).toFixed(1)}%
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('devices:cpuInfo.idle')}
                      </Typography>
                      <Typography variant="body1" fontWeight={500} color="success.main">
                        {(cpu.idle || 0).toFixed(1)}%
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    {t('devices:cpuInfo.cores')}
                  </Typography>

                  {cpu.cores?.length > 0 ? (
                      <Grid container spacing={2}>
                        {cpu.cores.map((core, index) => (
                            <Grid key={index} size={{ xs: 6, sm: 3 }}>
                              <Box
                                  sx={{
                                    p: 1.5,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                  }}
                              >
                                <Typography variant="caption" color="text.secondary">
                                  Core {core.core}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    sx={{
                                      color: getColorByUsage(core.usage),
                                      fontSize: '1.1rem',
                                    }}
                                >
                                  {Math.round(core.usage)}%
                                </Typography>
                              </Box>
                            </Grid>
                        ))}
                      </Grid>
                  ) : (
                      <Typography variant="body2" color="text.secondary">
                        {t('devices:cpuInfo.noCoreData')}
                      </Typography>
                  )}
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('devices:cpuInfo.physicalCores')}: {cpu.cores_count || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('devices:cpuInfo.logicalCores')}: {cpu.logical_cores || 'N/A'}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
            >
              {/* Memory Paper */}
              <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MemoryIcon color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    {t('devices:memoryInfo.title')}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" fontWeight={500}>
                      {t('devices:memoryInfo.ramUsage')}
                    </Typography>
                    <Typography
                        variant="body1"
                        fontWeight={700}
                        sx={{ color: getColorByUsage(memory.percent || 0) }}
                    >
                      {(memory.percent || 0).toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                      variant="determinate"
                      value={memory.percent || 0}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        mb: 1,
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getColorByUsage(memory.percent || 0),
                        },
                      }}
                  />
                  <Typography variant="body2" sx={{ textAlign: 'right', mb: 3 }}>
                    {formatBytes(memory.used || 0)} / {formatBytes(memory.total || 0)}
                  </Typography>

                  <Grid container spacing={2}>
                    {[
                      {
                        label: t('devices:memoryInfo.free'),
                        value: memory.free,
                        color: 'success.main',
                        bg: alpha(theme.palette.success.main, 0.1),
                      },
                      {
                        label: t('devices:memoryInfo.cached'),
                        value: memory.cached,
                        color: 'info.main',
                        bg: alpha(theme.palette.info.main, 0.1),
                      },
                      {
                        label: t('devices:memoryInfo.buffers'),
                        value: memory.buffers,
                        color: 'warning.main',
                        bg: alpha(theme.palette.warning.main, 0.1),
                      },
                      {
                        label: t('devices:memoryInfo.used'),
                        value: memory.used,
                        color: 'error.main',
                        bg: alpha(theme.palette.error.main, 0.1),
                      },
                    ].map((mem, i) => (
                        <Grid key={i} size={{ xs: 6, sm: 3 }}>
                          <Box sx={{ p: 2, borderRadius: 2, bgcolor: mem.bg, height: '100%' }}>
                            <Typography variant="caption" color="text.secondary">
                              {mem.label}
                            </Typography>
                            <Typography variant="body1" fontWeight={600} color={mem.color}>
                              {formatBytes(mem.value || 0)}
                            </Typography>
                          </Box>
                        </Grid>
                    ))}
                  </Grid>
                </Box>

                {memory.swap_total > 0 && (
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                        {t('devices:memoryInfo.swap')}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('devices:memoryInfo.swapUsage')}
                        </Typography>
                        <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ color: getColorByUsage(memory.swap_percent || 0) }}
                        >
                          {(memory.swap_percent || 0).toFixed(1)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                          variant="determinate"
                          value={memory.swap_percent || 0}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            mb: 1,
                            '& .MuiLinearProgress-bar': {
                              bgcolor: getColorByUsage(memory.swap_percent || 0),
                            },
                          }}
                      />
                      <Typography variant="caption" sx={{ display: 'block', textAlign: 'right' }}>
                        {formatBytes(memory.swap_used || 0)} / {formatBytes(memory.swap_total || 0)}
                      </Typography>
                    </Box>
                )}
              </Paper>
            </Grid>
          </Grid>

        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DiskIcon color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6">
                {t('devices:storage.title')}
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {disk && disk.length > 0 ? (
                <Grid container spacing={3}>
                  {disk.map((diskItem, index) => (
                      <Grid
                          size={{
                            xs: 12,
                            md: 6,
                          }}
                          key={index}
                      >
                        <Paper
                            elevation={2}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              transition: 'all 0.3s',
                              '&:hover': {
                                boxShadow: 6,
                                transform: 'translateY(-2px)',
                              },
                            }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LayersIcon fontSize="small" sx={{ mr: 1, color: theme.palette.warning.main }} />
                              <Typography variant="subtitle1" fontWeight={600}>
                                {diskItem.device}
                              </Typography>
                            </Box>
                            <Chip label={diskItem.fs_type} size="small" variant="outlined" />
                          </Box>

                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {t('devices:storage.mountpoint')}: {diskItem.mountpoint}
                          </Typography>

                          <Box sx={{ mt: 2, mb: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {t('devices:storage.usage')}
                              </Typography>
                              <Typography
                                  variant="body2"
                                  fontWeight={600}
                                  sx={{ color: getColorByUsage(diskItem.percent) }}
                              >
                                {diskItem.percent}%
                              </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={diskItem.percent || 0}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: getColorByUsage(diskItem.percent || 0),
                                  },
                                }}
                            />
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('devices:storage.total')}
                              </Typography>
                              <Typography variant="body2" fontWeight={500}>
                                {formatBytes(diskItem.total || 0)}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('devices:storage.used')}
                              </Typography>
                              <Typography variant="body2" fontWeight={500} color="error.main">
                                {formatBytes(diskItem.used || 0)}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('devices:storage.free')}
                              </Typography>
                              <Typography variant="body2" fontWeight={500} color="success.main">
                                {formatBytes(diskItem.free || 0)}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>

                  ))}
                </Grid>
            ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {t('devices:storage.noData')}
                </Alert>
            )}
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NetworkIcon color="info" sx={{ mr: 1 }} />
              <Typography variant="h6">
                {t('devices:network.title')}
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {network && network.length > 0 ? (
                <Grid container spacing={3}>
                  {network.map((iface, index) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={index}>
                        <Paper
                            elevation={3}
                            sx={{
                              p: 2.5,
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                boxShadow: 8,
                                transform: 'translateY(-2px)',
                              },
                            }}
                        >
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            <NetworkIcon
                                fontSize="small"
                                sx={{
                                  mr: 1,
                                  verticalAlign: 'text-bottom',
                                  color: theme.palette.info.main,
                                }}
                            />
                            {iface.interface}
                          </Typography>

                          <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid size={{ xs: 6 }}>
                              <Box
                                  sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.info.main, 0.08),
                                    height: '100%',
                                  }}
                              >
                                <Typography variant="caption" color="text.secondary">
                                  {t('devices:network.received')}
                                </Typography>
                                <Typography variant="h6" color="info.main" fontWeight={600}>
                                  {formatBytes(iface.rx || 0)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  {formatNumber(iface.rx_packets || 0)} {t('devices:network.packets')}
                                </Typography>
                              </Box>
                            </Grid>

                            <Grid size={{ xs: 6 }}>
                              <Box
                                  sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.error.main, 0.05),
                                    height: '100%',
                                  }}
                              >
                                <Typography variant="caption" color="text.secondary">
                                  {t('devices:network.sent')}
                                </Typography>
                                <Typography variant="h6" color="error.main" fontWeight={600}>
                                  {formatBytes(iface.tx || 0)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  {formatNumber(iface.tx_packets || 0)} {t('devices:network.packets')}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>


                  ))}
                </Grid>
            ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {t('devices:network.noData')}
                </Alert>
            )}
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ProcessIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                {t('devices:processInfo.title')}
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid
                  size={{
                    xs: 6,
                    sm: 3,
                  }}
              >
                <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      textAlign: 'center',
                    }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {t('devices:processInfo.total')}
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color="primary.main">
                    {formatNumber(processes.total || 0)}
                  </Typography>
                </Box>
              </Grid>

              <Grid
                  size={{
                    xs: 6,
                    sm: 3,
                  }}
              >
                <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.05),
                      textAlign: 'center',
                    }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {t('devices:processInfo.running')}
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color="success.main">
                    {formatNumber(processes.running || 0)}
                  </Typography>
                </Box>
              </Grid>

              <Grid
                  size={{
                    xs: 6,
                    sm: 3,
                  }}
              >
                <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.warning.main, 0.05),
                      textAlign: 'center',
                    }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {t('devices:processInfo.sleeping')}
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color="warning.main">
                    {formatNumber(processes.sleeping || 0)}
                  </Typography>
                </Box>
              </Grid>

              <Grid
                  size={{
                    xs: 6,
                    sm: 3,
                  }}
              >
                <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.info.main, 0.05),
                      textAlign: 'center',
                    }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {t('devices:processInfo.threads')}
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color="info.main">
                    {formatNumber(processes.thread || 0)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>



            {processes.list && processes.list.length > 0 ? (
                <TableContainer component={Paper} sx={{ borderRadius: 1.5, mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('devices:processInfo.pid')}</TableCell>
                        <TableCell>{t('devices:processInfo.name')}</TableCell>
                        <TableCell>{t('devices:processInfo.user')}</TableCell>
                        <TableCell align="right">{t('devices:processInfo.cpu')}</TableCell>
                        <TableCell align="right">{t('devices:processInfo.memory')}</TableCell>
                        <TableCell>{t('devices:processInfo.status')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {processes.list.map((process: ProcessInfo, index: number) => (
                          <TableRow key={index} hover>
                            <TableCell>{process.pid}</TableCell>
                            <TableCell>
                              <Tooltip title={process.cmdline} placement="top" arrow>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {process.name}
                                  {process.cmdline && (
                                      <InfoIcon fontSize="small" sx={{ ml: 0.5, fontSize: 14, color: 'text.secondary' }} />
                                  )}
                                </Box>
                              </Tooltip>
                            </TableCell>
                            <TableCell>{process.username}</TableCell>
                            <TableCell align="right">
                              <Chip
                                  label={`${process.cpu_percent.toFixed(1)}%`}
                                  size="small"
                                  sx={{
                                    bgcolor: alpha(getColorByUsage(process.cpu_percent), 0.1),
                                    color: getColorByUsage(process.cpu_percent),
                                    fontWeight: 600
                                  }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Chip
                                  label={`${process.memory_percent.toFixed(1)}%`}
                                  size="small"
                                  sx={{
                                    bgcolor: alpha(getColorByUsage(process.memory_percent), 0.1),
                                    color: getColorByUsage(process.memory_percent),
                                    fontWeight: 600
                                  }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                  label={process.status}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    color: process.status === 'R' ? 'success.main' : 'text.secondary',
                                    fontWeight: 500
                                  }}
                              />
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
            ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {t('devices:processInfo.noData')}
                </Alert>
            )}
          </Paper>
        </TabPanel>

        {containers && containers.length > 0 && (
            <TabPanel value={tabValue} index={4}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ContainerIcon color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    {t('devices:containers.title')}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {t('devices:containers.count', { count: containers.length })}
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {containers.map((container: ContainerInfo, index: number) => (
                      <Grid
                          size={{
                            xs: 12,
                            md: 6,
                          }}
                          key={index}
                      >
                        <Paper
                            elevation={2}
                            sx={{
                              p: 2.5,
                              borderRadius: 2,
                              position: 'relative',
                              overflow: 'hidden',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: 4,
                                backgroundColor:
                                    container.status === 'running'
                                        ? theme.palette.success.main
                                        : theme.palette.warning.main,
                              },
                            }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {container.name}
                            </Typography>
                            <Chip
                                label={container.status}
                                size="small"
                                color={container.status === 'running' ? 'success' : 'warning'}
                            />
                          </Box>

                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                            {container.id.substring(0, 12)}
                          </Typography>

                          <Typography variant="body2" sx={{ mb: 1.5 }}>
                            <strong>{t('devices:containers.image')}:</strong> {container.image.join(', ')}
                          </Typography>

                          <Grid container spacing={2}>
                            <Grid
                                size={{
                                  xs: 6,
                                  sm: 3,
                                }}
                            >
                              <Typography variant="caption" color="text.secondary">
                                {t('devices:containers.cpu')}
                              </Typography>
                              <Typography variant="body2" fontWeight={600} color={getColorByUsage(container.cpu_percent || 0)}>
                                {(container.cpu_percent || 0).toFixed(1)}%
                              </Typography>
                            </Grid>

                            {container.memory_percent && container.memory_percent > 0 && (
                                <Grid
                                    size={{
                                      xs: 6,
                                      sm: 3,
                                    }}
                                >
                                  <Typography variant="caption" color="text.secondary">
                                    {t('devices:containers.memory')}
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600} color={getColorByUsage(container.memory_percent)}>
                                    {container.memory_percent.toFixed(1)}%
                                  </Typography>
                                </Grid>
                            )}

                            <Grid
                                size={{
                                  xs: 6,
                                  sm: 3,
                                }}
                            >
                              <Typography variant="caption" color="text.secondary">
                                {t('devices:containers.rx')}
                              </Typography>
                              <Typography variant="body2" fontWeight={600} color="info.main">
                                {formatBytes(container.network_rx || 0)}
                              </Typography>
                            </Grid>

                            <Grid
                                size={{
                                  xs: 6,
                                  sm: 3,
                                }}
                            >
                              <Typography variant="caption" color="text.secondary">
                                {t('devices:containers.tx')}
                              </Typography>
                              <Typography variant="body2" fontWeight={600} color="error.main">
                                {formatBytes(container.network_tx || 0)}
                              </Typography>
                            </Grid>
                          </Grid>

                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                              {t('devices:containers.uptime')}: {container.uptime}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                  ))}
                </Grid>

              </Paper>
            </TabPanel>
        )}
      </Box>
  );
};

export default StandardDeviceDetails;