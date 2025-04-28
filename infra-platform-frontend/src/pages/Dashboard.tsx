// Dashboard.tsx
import React from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  useTheme,
  alpha,
  Divider,
  Chip,
} from '@mui/material';
import {
  Computer as StandardIcon,
  SmartToy as CustomIcon,
  Extension as PluginIcon,
  Speed as SpeedIcon,
  Warning as WarningIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api';
import PageContainer from '../components/common/PageContainer';
import DashboardCard from '../components/dashboard/DashboardCard';
import { Device } from '../types/device';

const Dashboard = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const theme = useTheme();

  // Fetch devices
  const { data: devices, isLoading: isLoadingDevices } = useQuery({
    queryKey: ['devices'],
    queryFn: api.devices.getAll,
  });

  // Fetch plugins
  const { data: plugins, isLoading: isLoadingPlugins } = useQuery({
    queryKey: ['plugins'],
    queryFn: api.plugins.getAll,
  });

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

    return {
      totalDevices: devices.length,
      standardDevices: standardDevices.length,
      customDevices: customDevices.length,
      activeDevices: activeDevices.length,
      inactiveDevices: inactiveDevices.length,
      osCounts,
    };
  }, [devices]);

  const recentDevices = React.useMemo(() => {
    if (!devices) return [];
    return [...devices]
      .sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5);
  }, [devices]);

  return (
    <PageContainer
      title={t('dashboard:title')}
      actions={
        <Button
          component={Link}
          to="/devices/new"
          variant="contained"
          color="primary"
          startIcon={<StandardIcon />}
          sx={{
            px: 3,
            py: 1,
          }}
        >
          {t('dashboard:addDevice')}
        </Button>
      }
    >
      {isLoadingDevices || isLoadingPlugins ? (
        <Typography>{t('common:status.loading')}</Typography>
      ) : (
        <Box>
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} lg={3}>
              <StatsCard
                title={t('dashboard:stats.totalDevices')}
                value={stats?.totalDevices || 0}
                icon={<SpeedIcon />}
                color="primary"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <StatsCard
                title={t('dashboard:stats.standardDevices')}
                value={stats?.standardDevices || 0}
                icon={<StandardIcon />}
                color="info"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <StatsCard
                title={t('dashboard:stats.customDevices')}
                value={stats?.customDevices || 0}
                icon={<CustomIcon />}
                color="secondary"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <StatsCard
                title={t('dashboard:stats.plugins')}
                value={plugins?.length || 0}
                icon={<PluginIcon />}
                color="success"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* Device Status */}
            <Grid item xs={12} md={6}>
              <DashboardCard
                title={t('dashboard:deviceStatus.title')}
                icon={<SpeedIcon />}
                color="primary"
                action={
                  <Button
                    component={Link}
                    to="/devices"
                    size="small"
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ fontWeight: 600 }}
                  >
                    {t('dashboard:viewAll')}
                  </Button>
                }
              >
                <Box p={2}>
                  {stats && (
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            borderRadius: theme.shape.borderRadius,
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            p: 2,
                            textAlign: 'center',
                            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                            transition: 'all 0.2s',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                              bgcolor: alpha(theme.palette.success.main, 0.15),
                            }
                          }}
                        >
                          <Typography
                            variant="h4"
                            color="success.main"
                            gutterBottom
                            sx={{ fontWeight: 700 }}
                          >
                            {stats.activeDevices}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {t('dashboard:deviceStatus.active')}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box
                          sx={{
                            borderRadius: theme.shape.borderRadius,
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            p: 2,
                            textAlign: 'center',
                            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                            transition: 'all 0.2s',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                              bgcolor: alpha(theme.palette.error.main, 0.15),
                            }
                          }}
                        >
                          <Typography
                            variant="h4"
                            color="error.main"
                            gutterBottom
                            sx={{ fontWeight: 700 }}
                          >
                            {stats.inactiveDevices}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {t('dashboard:deviceStatus.inactive')}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  )}

                  <Box mt={4}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                      {t('dashboard:deviceStatus.byOs')}
                    </Typography>

                    {stats && Object.entries(stats.osCounts).length > 0 ? (
                      <Grid container spacing={2}>
                        {Object.entries(stats.osCounts).map(([os, count]) => (
                          <Grid item xs={4} key={os}>
                            <Box
                              sx={{
                                borderRadius: theme.shape.borderRadius,
                                bgcolor: alpha(
                                  os === 'windows'
                                    ? theme.palette.info.main
                                    : os === 'linux'
                                    ? theme.palette.warning.main
                                    : theme.palette.secondary.main,
                                  0.1
                                ),
                                p: 2,
                                textAlign: 'center',
                                border: `1px solid ${alpha(
                                  os === 'windows'
                                    ? theme.palette.info.main
                                    : os === 'linux'
                                    ? theme.palette.warning.main
                                    : theme.palette.secondary.main,
                                  0.2
                                )}`,
                                transition: 'all 0.2s',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                                  bgcolor: alpha(
                                    os === 'windows'
                                      ? theme.palette.info.main
                                      : os === 'linux'
                                      ? theme.palette.warning.main
                                      : theme.palette.secondary.main,
                                    0.15
                                  ),
                                }
                              }}
                            >
                              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                                {count}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {t(`dashboard:osTypes.${os}`)}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                        {t('dashboard:deviceStatus.noStandardDevices')}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </DashboardCard>
            </Grid>

            {/* Recent Devices */}
            <Grid item xs={12} md={6}>
              <DashboardCard
                title={t('dashboard:recentDevices.title')}
                icon={<StandardIcon />}
                color="info"
                action={
                  <Button
                    component={Link}
                    to="/devices"
                    size="small"
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ fontWeight: 600 }}
                  >
                    {t('dashboard:viewAll')}
                  </Button>
                }
              >
                <Box>
                  {recentDevices.length > 0 ? (
                    recentDevices.map((device, index) => (
                      <React.Fragment key={device.id}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            py: 2.5,
                            px: 3,
                            transition: 'all 0.2s',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.04),
                            }
                          }}
                        >
                          <Box
                            sx={{
                              mr: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              p: 1.5,
                              borderRadius: '50%',
                              bgcolor: alpha(
                                device.type === 'standard'
                                  ? theme.palette.primary.main
                                  : theme.palette.secondary.main,
                                0.1
                              ),
                              border: `1px solid ${alpha(
                                device.type === 'standard'
                                  ? theme.palette.primary.main
                                  : theme.palette.secondary.main,
                                0.2
                              )}`,
                            }}
                          >
                            {device.type === 'standard' ? (
                              <StandardIcon color="primary" />
                            ) : (
                              <CustomIcon color="secondary" />
                            )}
                          </Box>

                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>
                              {device.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                noWrap
                              >
                                {device.ip_address}
                              </Typography>
                              <Chip
                                size="small"
                                label={
                                  device.type === 'standard'
                                    ? t(`dashboard:osTypes.${device.standard_device?.os_type || 'unknown'}`)
                                    : device.custom_device?.plugin_name || t('dashboard:deviceTypes.custom')
                                }
                                sx={{
                                  ml: 1,
                                  height: 20,
                                  fontSize: '0.7rem',
                                  backgroundColor: alpha(
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
                                }}
                              />
                              <Chip
                                size="small"
                                label={device.is_active
                                  ? t('dashboard:deviceStatus.active')
                                  : t('dashboard:deviceStatus.inactive')
                                }
                                sx={{
                                  ml: 1,
                                  height: 20,
                                  fontSize: '0.7rem',
                                  backgroundColor: alpha(
                                    device.is_active
                                      ? theme.palette.success.main
                                      : theme.palette.error.main,
                                    0.1
                                  ),
                                  color: device.is_active
                                    ? theme.palette.success.main
                                    : theme.palette.error.main,
                                  border: `1px solid ${alpha(
                                    device.is_active
                                      ? theme.palette.success.main
                                      : theme.palette.error.main,
                                    0.2
                                  )}`,
                                }}
                              />
                            </Box>
                          </Box>

                          <Button
                            component={Link}
                            to={`/devices/${device.id}`}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderRadius: '10px',
                              fontWeight: 600,
                              '&:hover': {
                                boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                                transform: 'translateY(-2px)',
                              }
                            }}
                          >
                            {t('dashboard:viewDetails')}
                          </Button>
                        </Box>
                        {index < recentDevices.length - 1 && (
                          <Divider sx={{ opacity: 0.6 }} />
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography color="textSecondary" sx={{ py: 2 }}>
                        {t('dashboard:recentDevices.noDevices')}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </DashboardCard>
            </Grid>
          </Grid>
        </Box>
      )}
    </PageContainer>
  );
};

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

const StatsCard = ({ title, value, icon, color }: StatsCardProps) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[3],
        border: `1px solid ${alpha(theme.palette[color].main, 0.1)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: theme.shadows[8],
          border: `1px solid ${alpha(theme.palette[color].main, 0.3)}`,
        },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: theme.palette[color].main,
        }
      }}
    >
      <CardContent sx={{ py: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              gutterBottom
              sx={{ fontWeight: 500, fontSize: '0.875rem' }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 700,
                mt: 0.5,
                color: theme.palette.mode === 'dark'
                  ? theme.palette[color].light
                  : theme.palette[color].dark
              }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette[color].main, 0.12),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette[color].main,
              border: `1px solid ${alpha(theme.palette[color].main, 0.24)}`,
              boxShadow: `0 4px 10px ${alpha(theme.palette[color].main, 0.2)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                bgcolor: alpha(theme.palette[color].main, 0.18),
                boxShadow: `0 6px 15px ${alpha(theme.palette[color].main, 0.3)}`,
              }
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Dashboard;