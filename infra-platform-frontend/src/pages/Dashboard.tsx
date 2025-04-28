import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Button,
  useTheme,
  alpha,
  Divider,
  Chip,
  Badge,
  IconButton,
  CircularProgress,
  Tooltip,
  Avatar,
  ButtonBase,
  Stack,
  LinearProgress,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import {
  ComputerRounded as StandardIcon,
  SmartToyRounded as CustomIcon,
  ExtensionRounded as PluginIcon,
  SpeedRounded as SpeedIcon,
  WarningRounded as WarningIcon,
  ArrowForwardRounded as ArrowForwardIcon,
  RefreshRounded as RefreshIcon,
  SentimentVerySatisfiedRounded as SatisfiedIcon,
  SentimentDissatisfiedRounded as DissatisfiedIcon,
  CheckCircleRounded as CheckIcon,
  ErrorRounded as ErrorIcon,
  SignalCellularAltRounded as SignalIcon,
  StorageRounded as StorageIcon,
  MemoryRounded as MemoryIcon,
  HelpOutlineRounded as HelpIcon,
  SettingsRounded as SettingsIcon,
  TrendingUpRounded as TrendingUpIcon,
  TrendingDownRounded as TrendingDownIcon,
  NotificationsRounded as NotificationsIcon,
  AddRounded as AddIcon,
  CloudRounded as CloudIcon,
  VisibilityRounded as VisibilityIcon,
  ExpandMoreRounded as ExpandMoreIcon,
  ShieldRounded as ShieldIcon,
  HealthAndSafetyRounded as HealthIcon,
  AlarmRounded as AlarmIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import PageContainer from '../components/common/PageContainer';
import DashboardCard from '../components/dashboard/DashboardCard';
import { Device } from '../types/device';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, AreaChart, Area } from 'recharts';
import CountUp from 'react-countup';

// Define a type for the OS distribution data
interface OsDistribution {
  name: string;
  value: number;
  color: string;
}

// Define a type for the system health data
interface SystemHealth {
  name: string;
  value: number;
  status: 'good' | 'warning' | 'critical';
}

// Define a type for the device activity data
interface DeviceActivity {
  time: string;
  active: number;
  inactive: number;
}

const Dashboard = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const theme = useTheme();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  // Fetch devices with refresh capability
  const {
    data: devices,
    isLoading: isLoadingDevices,
    refetch: refetchDevices,
  } = useQuery({
    queryKey: ['devices', refreshKey],
    queryFn: api.devices.getAll,
  });

  // Fetch plugins with refresh capability
  const {
    data: plugins,
    isLoading: isLoadingPlugins,
    refetch: refetchPlugins,
  } = useQuery({
    queryKey: ['plugins', refreshKey],
    queryFn: api.plugins.getAll,
  });

  // Handler for refreshing all data
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!devices) return null;

    const standardDevices = devices.filter(d => d.type === 'standard');
    const customDevices = devices.filter(d => d.type === 'custom');
    const activeDevices = devices.filter(d => d.is_active);
    const inactiveDevices = devices.filter(d => !d.is_active);

    // Count devices by OS
    const osCounts = standardDevices.reduce((acc, device) => {
      const osType = device.standard_device?.os_type || 'unknown';
      acc[osType] = (acc[osType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate system health based on active/inactive ratio
    const healthScore = devices.length > 0
      ? Math.round((activeDevices.length / devices.length) * 100)
      : 100;

    return {
      totalDevices: devices.length,
      standardDevices: standardDevices.length,
      customDevices: customDevices.length,
      activeDevices: activeDevices.length,
      inactiveDevices: inactiveDevices.length,
      osCounts,
      healthScore,
    };
  }, [devices]);

  // Get recent devices
  const recentDevices = React.useMemo(() => {
    if (!devices) return [];
    return [...devices]
      .sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5);
  }, [devices]);

  // Prepare data for OS distribution chart
  const osDistributionData: OsDistribution[] = React.useMemo(() => {
    if (!stats?.osCounts) return [];

    const colorMap: Record<string, string> = {
      windows: theme.palette.info.main,
      linux: theme.palette.warning.main,
      macos: theme.palette.success.main,
      unknown: theme.palette.grey[500],
    };

    return Object.entries(stats.osCounts).map(([os, count]) => ({
      name: t(`dashboard:osTypes.${os}`),
      value: count,
      color: colorMap[os] || theme.palette.secondary.main,
    }));
  }, [stats?.osCounts, theme, t]);

  // Prepare system health metrics
  const systemHealthData: SystemHealth[] = React.useMemo(() => {
    if (!stats) return [];

    return [
      {
        name: t('dashboard:systemHealth.devices'),
        value: stats.healthScore,
        status: stats.healthScore > 80 ? 'good' : stats.healthScore > 50 ? 'warning' : 'critical',
      },
      {
        name: t('dashboard:systemHealth.cpu'),
        value: 65,
        status: 65 > 80 ? 'good' : 65 > 50 ? 'warning' : 'critical',
      },
      {
        name: t('dashboard:systemHealth.memory'),
        value: 82,
        status: 82 > 80 ? 'good' : 82 > 50 ? 'warning' : 'critical',
      },
      {
        name: t('dashboard:systemHealth.storage'),
        value: 45,
        status: 45 > 80 ? 'good' : 45 > 50 ? 'warning' : 'critical',
      },
    ];
  }, [stats, t]);

  // Sample device activity data
  const deviceActivityData: DeviceActivity[] = [
    { time: '00:00', active: 18, inactive: 5 },
    { time: '04:00', active: 15, inactive: 8 },
    { time: '08:00', active: 20, inactive: 3 },
    { time: '12:00', active: 25, inactive: 2 },
    { time: '16:00', active: 22, inactive: 4 },
    { time: '20:00', active: 19, inactive: 6 },
    { time: '24:00', active: 17, inactive: 7 },
  ];

  // Handle changing tabs for device activity view
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: '12px',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                }
              }}
            >
              <RefreshIcon />
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
        {(isLoadingDevices || isLoadingPlugins) ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
              width: '100%'
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* System Overview Section */}
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                mt: 1,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: theme.palette.text.primary,
              }}
            >
              <HealthIcon
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: 24,
                }}
              />
              {t('dashboard:sections.overview')}
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
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

            {/* Main Dashboard Content */}
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: theme.palette.text.primary,
              }}
            >
              <SignalIcon
                sx={{
                  color: theme.palette.info.main,
                  fontSize: 24,
                }}
              />
              {t('dashboard:sections.details')}
            </Typography>

            <Grid container spacing={3}>
              {/* Device Status Overview */}
              <Grid item xs={12} md={8}>
                <DashboardCard
                  title={t('dashboard:deviceActivity.title')}
                  subtitle={t('dashboard:deviceActivity.subtitle')}
                  icon={<SignalIcon />}
                  color="info"
                  variant="glass"
                  fullHeight
                  action={
                    <Tabs
                      value={activeTab}
                      onChange={handleTabChange}
                      sx={{
                        '& .MuiTabs-indicator': {
                          height: 3,
                          borderRadius: '3px',
                        },
                        '& .MuiTab-root': {
                          minWidth: 'auto',
                          minHeight: 'auto',
                          px: 2,
                          py: 1,
                          fontSize: '0.85rem',
                          fontWeight: 600,
                        }
                      }}
                    >
                      <Tab label={t('dashboard:deviceActivity.tabs.day')} />
                      <Tab label={t('dashboard:deviceActivity.tabs.week')} />
                      <Tab label={t('dashboard:deviceActivity.tabs.month')} />
                    </Tabs>
                  }
                  onRefresh={handleRefresh}
                >
                  <Box height="300px" mt={1} p={2}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={deviceActivityData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.7}/>
                            <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorInactive" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.palette.error.main} stopOpacity={0.7}/>
                            <stop offset="95%" stopColor={theme.palette.error.main} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                        <XAxis
                          dataKey="time"
                          tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                          axisLine={{ stroke: alpha(theme.palette.divider, 0.3) }}
                          tickLine={{ stroke: alpha(theme.palette.divider, 0.3) }}
                        />
                        <YAxis
                          tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                          axisLine={{ stroke: alpha(theme.palette.divider, 0.3) }}
                          tickLine={{ stroke: alpha(theme.palette.divider, 0.3) }}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            background: alpha(theme.palette.background.paper, 0.9),
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            borderRadius: '10px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            fontSize: '12px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="active"
                          name={t('dashboard:deviceStatus.active')}
                          stroke={theme.palette.success.main}
                          fillOpacity={1}
                          fill="url(#colorActive)"
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="inactive"
                          name={t('dashboard:deviceStatus.inactive')}
                          stroke={theme.palette.error.main}
                          fillOpacity={1}
                          fill="url(#colorInactive)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>

                  <Box p={2}>
                    <Divider sx={{ opacity: 0.4, my: 1 }} />

                    <Grid container spacing={2} mt={1}>
                      <Grid item xs={6} sm={3}>
                        <Box
                          sx={{
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            p: 2,
                            borderRadius: '16px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: `0 8px 16px ${alpha(theme.palette.success.main, 0.15)}`,
                            }
                          }}
                        >
                          <CheckIcon sx={{ color: theme.palette.success.main, mb: 1, fontSize: 32 }} />
                          <Typography variant="h5" color="success.main" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1 }}>
                            <CountUp end={stats?.activeDevices || 0} duration={1.5} />
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.8rem', color: alpha(theme.palette.text.primary, 0.7) }}>
                            {t('dashboard:deviceStatus.active')}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} sm={3}>
                        <Box
                          sx={{
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            p: 2,
                            borderRadius: '16px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: `0 8px 16px ${alpha(theme.palette.error.main, 0.15)}`,
                            }
                          }}
                        >
                          <ErrorIcon sx={{ color: theme.palette.error.main, mb: 1, fontSize: 32 }} />
                          <Typography variant="h5" color="error.main" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1 }}>
                            <CountUp end={stats?.inactiveDevices || 0} duration={1.5} />
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.8rem', color: alpha(theme.palette.text.primary, 0.7) }}>
                            {t('dashboard:deviceStatus.inactive')}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} sm={3}>
                        <Box
                          sx={{
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            p: 2,
                            borderRadius: '16px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: `0 8px 16px ${alpha(theme.palette.info.main, 0.15)}`,
                            }
                          }}
                        >
                          <CloudIcon sx={{ color: theme.palette.info.main, mb: 1, fontSize: 32 }} />
                          <Typography variant="h5" color="info.main" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1 }}>
                            <CountUp end={25} duration={1.5} />
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.8rem', color: alpha(theme.palette.text.primary, 0.7) }}>
                            {t('dashboard:deviceStatus.cloud')}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} sm={3}>
                        <Box
                          sx={{
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            p: 2,
                            borderRadius: '16px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: `0 8px 16px ${alpha(theme.palette.warning.main, 0.15)}`,
                            }
                          }}
                        >
                          <AlarmIcon sx={{ color: theme.palette.warning.main, mb: 1, fontSize: 32 }} />
                          <Typography variant="h5" color="warning.main" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1 }}>
                            <CountUp end={3} duration={1.5} />
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.8rem', color: alpha(theme.palette.text.primary, 0.7) }}>
                            {t('dashboard:deviceStatus.alerts')}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </DashboardCard>
              </Grid>

              {/* Device Distribution */}
              <Grid item xs={12} md={4}>
                <DashboardCard
                  title={t('dashboard:osDistribution.title')}
                  subtitle={t('dashboard:osDistribution.subtitle')}
                  icon={<StorageIcon />}
                  color="warning"
                  variant="glass"
                  fullHeight
                  onRefresh={handleRefresh}
                >
                  <Box
                    sx={{
                      height: 300,
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    {osDistributionData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={osDistributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {osDistributionData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                stroke={theme.palette.background.paper}
                                strokeWidth={2}
                              />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            formatter={(value: number, name: string) => [
                              `${value} ${t('dashboard:osDistribution.devices')}`,
                              name
                            ]}
                            contentStyle={{
                              background: alpha(theme.palette.background.paper, 0.9),
                              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                              borderRadius: '10px',
                              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        p: 3
                      }}>
                        <Box
                          sx={{
                            width: 70,
                            height: 70,
                            borderRadius: '50%',
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                          }}
                        >
                          <HelpIcon fontSize="large" sx={{ color: theme.palette.warning.main }} />
                        </Box>
                        <Typography align="center" color="textSecondary" variant="subtitle1" fontWeight={500}>
                          {t('dashboard:osDistribution.noDevices')}
                        </Typography>
                        <Typography align="center" color="textSecondary" sx={{ mt: 1, fontSize: '0.85rem' }}>
                          {t('dashboard:osDistribution.addDevices')}
                        </Typography>
                        <Button
                          component={Link}
                          to="/devices/new"
                          variant="outlined"
                          color="warning"
                          size="small"
                          startIcon={<AddIcon />}
                          sx={{ mt: 2, borderRadius: '12px' }}
                        >
                          {t('dashboard:addDevice')}
                        </Button>
                      </Box>
                    )}
                  </Box>

                  <Box p={2}>
                    <Divider sx={{ opacity: 0.4, my: 1 }} />
                    <Stack direction="row" spacing={1} mt={1} justifyContent="center">
                      {osDistributionData.map((os, index) => (
                        <Chip
                          key={index}
                          label={os.name}
                          sx={{
                            bgcolor: alpha(os.color, 0.1),
                            color: os.color,
                            fontWeight: 600,
                            borderRadius: '10px',
                            border: `1px solid ${alpha(os.color, 0.2)}`,
                          }}
                          size="small"
                        />
                      ))}
                    </Stack>
                  </Box>
                </DashboardCard>
              </Grid>

              {/* System Health Metrics */}
              <Grid item xs={12} md={4}>
                <DashboardCard
                  title={t('dashboard:systemHealth.title')}
                  subtitle={t('dashboard:systemHealth.subtitle')}
                  icon={<HealthIcon />}
                  color="success"
                  variant="glass"
                  onRefresh={handleRefresh}
                >
                  <Box p={2}>
                    {systemHealthData.map((item, index) => (
                      <Box key={index} mb={index < systemHealthData.length - 1 ? 2.5 : 0}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, alignItems: 'center' }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.87rem',
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.87rem',
                                color:
                                  item.status === 'good'
                                    ? theme.palette.success.main
                                    : item.status === 'warning'
                                      ? theme.palette.warning.main
                                      : theme.palette.error.main,
                              }}
                            >
                              {item.value}%
                            </Typography>
                            <Box
                              component={motion.div}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1, duration: 0.3 }}
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                ml: 1,
                                backgroundColor:
                                  item.status === 'good'
                                    ? theme.palette.success.main
                                    : item.status === 'warning'
                                      ? theme.palette.warning.main
                                      : theme.palette.error.main,
                              }}
                            />
                          </Box>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={item.value}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: alpha(theme.palette.divider, 0.1),
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              backgroundColor:
                                item.status === 'good'
                                  ? theme.palette.success.main
                                  : item.status === 'warning'
                                    ? theme.palette.warning.main
                                    : theme.palette.error.main,
                            },
                          }}
                        />
                      </Box>
                    ))}
                  </Box>

                  <Divider sx={{ opacity: 0.4 }} />

                  <Box p={2} textAlign="center">
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        mb: 1.5,
                      }}
                    >
                      {t('dashboard:systemHealth.overallStatus')}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          display: 'inline-flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <CircularProgress
                          variant="determinate"
                          value={stats?.healthScore || 0}
                          size={120}
                          thickness={5}
                          sx={{
                            color:
                              (stats?.healthScore || 0) > 80
                                ? theme.palette.success.main
                                : (stats?.healthScore || 0) > 50
                                  ? theme.palette.warning.main
                                  : theme.palette.error.main,
                            boxShadow: `0 0 15px ${alpha(
                              (stats?.healthScore || 0) > 80
                                ? theme.palette.success.main
                                : (stats?.healthScore || 0) > 50
                                  ? theme.palette.warning.main
                                  : theme.palette.error.main,
                              0.3
                            )}`,
                            borderRadius: '50%',
                          }}
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
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 20 }}
                          >
                            {(stats?.healthScore || 0) > 80 ? (
                              <SatisfiedIcon
                                sx={{
                                  fontSize: 40,
                                  color: theme.palette.success.main,
                                }}
                              />
                            ) : (stats?.healthScore || 0) > 50 ? (
                              <ShieldIcon
                                sx={{
                                  fontSize: 40,
                                  color: theme.palette.warning.main,
                                }}
                              />
                            ) : (
                              <DissatisfiedIcon
                                sx={{
                                  fontSize: 40,
                                  color: theme.palette.error.main,
                                }}
                              />
                            )}
                          </motion.div>
                        </Box>
                      </Box>
                    </Box>

                    <Typography variant="h5" fontWeight={700}>
                      {(stats?.healthScore || 0) > 80
                        ? t('dashboard:systemHealth.status.excellent')
                        : (stats?.healthScore || 0) > 50
                          ? t('dashboard:systemHealth.status.good')
                          : t('dashboard:systemHealth.status.critical')}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 0.5, fontSize: '0.85rem' }}
                    >
                      {(stats?.healthScore || 0) > 80
                        ? t('dashboard:systemHealth.messages.excellent')
                        : (stats?.healthScore || 0) > 50
                          ? t('dashboard:systemHealth.messages.good')
                          : t('dashboard:systemHealth.messages.critical')}
                    </Typography>
                  </Box>
                </DashboardCard>
              </Grid>

              {/* Recent Devices */}
              <Grid item xs={12} md={8}>
                <DashboardCard
                  title={t('dashboard:recentDevices.title')}
                  subtitle={t('dashboard:recentDevices.subtitle')}
                  icon={<StandardIcon />}
                  color="primary"
                  variant="glass"
                  action={
                    <Button
                      component={Link}
                      to="/devices"
                      size="small"
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        fontWeight: 600,
                        borderRadius: '10px',
                        px: 2,
                      }}
                    >
                      {t('dashboard:viewAll')}
                    </Button>
                  }
                  onRefresh={handleRefresh}
                >
                  <Box>
                    {recentDevices.length > 0 ? (
                      recentDevices.map((device, index) => (
                        <React.Fragment key={device.id}>
                          <ButtonBase
                            component={Link}
                            to={`/devices/${device.id}`}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              width: '100%',
                              textAlign: 'left',
                              py: 2,
                              px: 3,
                              transition: 'all 0.2s',
                              borderRadius: '8px',
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.06),
                                transform: 'translateY(-2px)',
                              }
                            }}
                          >
                            <Box>
                              <Avatar
                                sx={{
                                  width: 48,
                                  height: 48,
                                  bgcolor: alpha(
                                    device.type === 'standard'
                                      ? theme.palette.primary.main
                                      : theme.palette.secondary.main,
                                    0.1
                                  ),
                                  color: device.type === 'standard'
                                    ? theme.palette.primary.main
                                    : theme.palette.secondary.main,
                                  border: `1px solid ${alpha(
                                    device.type === 'standard'
                                      ? theme.palette.primary.main
                                      : theme.palette.secondary.main,
                                    0.2
                                  )}`,
                                  boxShadow: `0 4px 12px ${alpha(
                                    device.type === 'standard'
                                      ? theme.palette.primary.main
                                      : theme.palette.secondary.main,
                                    0.15
                                  )}`,
                                }}
                              >
                                {device.type === 'standard' ? <StandardIcon /> : <CustomIcon />}
                              </Avatar>
                            </Box>

                            <Box sx={{ ml: 2, flexGrow: 1 }}>
                              <Typography
                                variant="subtitle1"
                                noWrap
                                sx={{
                                  fontWeight: 600,
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                {device.name}
                                {device.is_active ? (
                                  <Tooltip title={t('dashboard:deviceStatus.active')} arrow placement="top">
                                    <Box
                                      component={motion.div}
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ repeat: Infinity, duration: 2 }}
                                      sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: theme.palette.success.main,
                                        ml: 1,
                                        display: 'inline-block',
                                        boxShadow: `0 0 0 3px ${alpha(theme.palette.success.main, 0.2)}`,
                                      }}
                                    />
                                  </Tooltip>
                                ) : (
                                  <Tooltip title={t('dashboard:deviceStatus.inactive')} arrow placement="top">
                                    <Box
                                      sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: theme.palette.error.main,
                                        ml: 1,
                                        display: 'inline-block',
                                      }}
                                    />
                                  </Tooltip>
                                )}
                              </Typography>

                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, flexWrap: 'wrap' }}>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  noWrap
                                  sx={{
                                    fontSize: '0.85rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                >
                                  <StorageIcon sx={{ fontSize: 16, mr: 0.5, opacity: 0.6 }} />
                                  {device.ip_address}
                                </Typography>

                                <Box sx={{ display: 'flex', ml: 2, flexWrap: 'wrap' }}>
                                  <Chip
                                    size="small"
                                    label={
                                      device.type === 'standard'
                                        ? t(`dashboard:osTypes.${device.standard_device?.os_type || 'unknown'}`)
                                        : device.custom_device?.plugin_name || t('dashboard:deviceTypes.custom')
                                    }
                                    sx={{
                                      height: 22,
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      bgcolor: alpha(
                                        device.type === 'standard'
                                          ? theme.palette.info.main
                                          : theme.palette.secondary.main,
                                        0.1
                                      ),
                                      color: device.type === 'standard'
                                        ? theme.palette.info.main
                                        : theme.palette.secondary.main,
                                      border: `1px solid ${alpha(
                                        device.type === 'standard'
                                          ? theme.palette.info.main
                                          : theme.palette.secondary.main,
                                        0.2
                                      )}`,
                                      ml: { xs: 0, sm: 0 },
                                      mt: { xs: 0.5, sm: 0 },
                                    }}
                                  />
                                </Box>
                              </Box>
                            </Box>

                            <Box sx={{ ml: 1 }}>
                              <IconButton
                                color="primary"
                                size="small"
                                sx={{
                                  borderRadius: '10px',
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                                  }
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(`/devices/${device.id}`);
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </ButtonBase>
                          {index < recentDevices.length - 1 && (
                            <Divider sx={{ opacity: 0.3 }} />
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                          }}
                        >
                          <HelpIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />
                        </Box>
                        <Typography color="textSecondary" variant="subtitle1" fontWeight={500}>
                          {t('dashboard:recentDevices.noDevices')}
                        </Typography>
                        <Typography color="textSecondary" sx={{ mt: 1, fontSize: '0.85rem' }}>
                          {t('dashboard:recentDevices.addYourFirst')}
                        </Typography>
                        <Button
                          component={Link}
                          to="/devices/new"
                          variant="contained"
                          color="primary"
                          startIcon={<AddIcon />}
                          sx={{ mt: 3, borderRadius: '12px' }}
                        >
                          {t('dashboard:addDevice')}
                        </Button>
                      </Box>
                    )}
                  </Box>
                </DashboardCard>
              </Grid>
            </Grid>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  trend?: number;
}

const StatsCard = ({ title, value, icon, color, trend = 0 }: StatsCardProps) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Paper
        component={motion.div}
        whileHover={{ y: -5 }}
        transition={{ type: 'spring', stiffness: 300 }}
        sx={{
          height: '100%',
          borderRadius: '24px',
          boxShadow: `0 8px 30px ${alpha(theme.palette[color].main, 0.12)}`,
          border: `1px solid ${alpha(theme.palette[color].main, 0.1)}`,
          overflow: 'hidden',
          position: 'relative',
          p: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.05)} 0%, ${alpha(theme.palette[color].light, 0.05)} 100%)`,
          backdropFilter: 'blur(10px)',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette[color].main}, ${theme.palette[color].light})`,
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              variant="body2"
              gutterBottom
              sx={{
                fontWeight: 500,
                color: alpha(theme.palette.text.secondary, 0.8),
                fontSize: '0.85rem',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{
                fontWeight: 700,
                mt: 1,
                color: theme.palette.mode === 'dark'
                  ? theme.palette[color].light
                  : theme.palette[color].dark,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                component={CountUp}
                end={value}
                duration={1.5}
                separator=","
                sx={{ lineHeight: 1 }}
              />

              {trend !== 0 && (
                <Chip
                  icon={trend > 0 ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                  label={`${Math.abs(trend)}%`}
                  size="small"
                  sx={{
                    ml: 1,
                    height: 22,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    bgcolor: alpha(
                      trend > 0 ? theme.palette.success.main : theme.palette.error.main,
                      0.1
                    ),
                    color: trend > 0 ? theme.palette.success.main : theme.palette.error.main,
                    border: `1px solid ${alpha(
                      trend > 0 ? theme.palette.success.main : theme.palette.error.main,
                      0.2
                    )}`,
                  }}
                />
              )}
            </Typography>
          </Box>

          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                bgcolor: alpha(theme.palette[color].main, 0.12),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette[color].main,
                border: `1px solid ${alpha(theme.palette[color].main, 0.24)}`,
                boxShadow: `0 6px 16px ${alpha(theme.palette[color].main, 0.2)}`,
              }}
            >
              {icon}
            </Box>
          </motion.div>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default Dashboard;