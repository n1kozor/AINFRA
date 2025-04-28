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
} from '@mui/material';
import {
  Computer as StandardIcon,
  SmartToy as CustomIcon,
  Extension as PluginIcon,
  Speed as SpeedIcon,
  Warning as WarningIcon,
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
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            p: 2,
                            textAlign: 'center',
                          }}
                        >
                          <Typography
                            variant="h4"
                            color="success.main"
                            gutterBottom
                          >
                            {stats.activeDevices}
                          </Typography>
                          <Typography variant="body2">
                            {t('dashboard:deviceStatus.active')}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box
                          sx={{
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            p: 2,
                            textAlign: 'center',
                          }}
                        >
                          <Typography
                            variant="h4"
                            color="error.main"
                            gutterBottom
                          >
                            {stats.inactiveDevices}
                          </Typography>
                          <Typography variant="body2">
                            {t('dashboard:deviceStatus.inactive')}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  )}

                  <Box mt={3}>
                    <Typography variant="subtitle1" gutterBottom>
                      {t('dashboard:deviceStatus.byOs')}
                    </Typography>

                    {stats && Object.entries(stats.osCounts).length > 0 ? (
                      <Grid container spacing={2}>
                        {Object.entries(stats.osCounts).map(([os, count]) => (
                          <Grid item xs={4} key={os}>
                            <Box
                              sx={{
                                borderRadius: 2,
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
                              }}
                            >
                              <Typography variant="h5" gutterBottom>
                                {count}
                              </Typography>
                              <Typography variant="body2">
                                {t(`dashboard:osTypes.${os}`)}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
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
                            py: 2,
                            px: 3,
                          }}
                        >
                          <Box
                            sx={{
                              mr: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              p: 1,
                              borderRadius: '50%',
                              bgcolor: alpha(
                                device.type === 'standard'
                                  ? theme.palette.primary.main
                                  : theme.palette.secondary.main,
                                0.1
                              ),
                            }}
                          >
                            {device.type === 'standard' ? (
                              <StandardIcon color="primary" />
                            ) : (
                              <CustomIcon color="secondary" />
                            )}
                          </Box>

                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" noWrap>
                              {device.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              noWrap
                            >
                              {device.ip_address} • {
                                device.type === 'standard'
                                  ? t(`dashboard:osTypes.${device.standard_device?.os_type || 'unknown'}`)
                                  : device.custom_device?.plugin_name || t('dashboard:deviceTypes.custom')
                              }
                            </Typography>
                          </Box>

                          <Button
                            component={Link}
                            to={`/devices/${device.id}`}
                            size="small"
                            variant="outlined"
                          >
                            {t('dashboard:viewDetails')}
                          </Button>
                        </Box>
                        {index < recentDevices.length - 1 && <Divider />}
                      </React.Fragment>
                    ))
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography color="textSecondary">
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
        boxShadow: theme.shadows[3],
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <CardContent>
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
            >
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette[color].main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette[color].main,
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