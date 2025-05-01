// components/dashboard/StatusOverview.tsx
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  Grid,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Speed as SpeedIcon,
  DevicesOther as DevicesIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { SystemStatistics, TimeRangeOption } from '../../types/statistics';
import { formatDistanceToNow } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatusOverviewProps {
  statistics: SystemStatistics | null;
  isLoading: boolean;
  timeRange: TimeRangeOption;
  onTimeRangeChange: (range: TimeRangeOption) => void;
}

export const StatusOverview: React.FC<StatusOverviewProps> = ({
  statistics,
  isLoading,
  timeRange,
  onTimeRangeChange
}) => {
  const theme = useTheme();
  const { t } = useTranslation('dashboard');

  const handleTimeRangeChange = (
    event: React.MouseEvent<HTMLElement>,
    newRange: TimeRangeOption | null,
  ) => {
    if (newRange !== null) {
      onTimeRangeChange(newRange);
    }
  };

  // Format time label for the selected time range
  const getTimeRangeLabel = (range: TimeRangeOption): string => {
    switch (range) {
      case '30m': return t('timeRange.thirtyMinutes');
      case '1h': return t('timeRange.oneHour');
      case '6h': return t('timeRange.sixHours');
      case '24h': return t('timeRange.oneDay');
      case '7d': return t('timeRange.sevenDays');
      case 'all': return t('timeRange.allTime');
      default: return '';
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          width: '100%',
          background: theme.palette.background.paper,
          backdropFilter: 'blur(8px)',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t('systemStats.title')}
            </Typography>

            <ToggleButtonGroup
              size="small"
              value={timeRange}
              exclusive
              onChange={handleTimeRangeChange}
              aria-label="time range"
            >
              <ToggleButton value="30m" aria-label="30 minutes">
                30m
              </ToggleButton>
              <ToggleButton value="1h" aria-label="1 hour">
                1h
              </ToggleButton>
              <ToggleButton value="6h" aria-label="6 hours">
                6h
              </ToggleButton>
              <ToggleButton value="24h" aria-label="24 hours">
                24h
              </ToggleButton>
              <ToggleButton value="7d" aria-label="7 days">
                7d
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : statistics ? (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t('timeRange.timeRangeLabel')}: {getTimeRangeLabel(timeRange)}
                {statistics.system_status.timestamp && (
                  <> • {t('lastUpdated')}: {
                    formatDistanceToNow(new Date(statistics.system_status.timestamp), { addSuffix: true })
                  }</>
                )}
              </Typography>

              {/* Summary Statistics */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%', p: 2, boxShadow: theme.shadows[1] }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                        <DevicesIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h4" component="div">
                          {statistics.device_summary.active_devices}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('deviceStatus.totalDevices')}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%', p: 2, boxShadow: theme.shadows[1] }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 2 }}>
                        <CheckCircleIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h4" component="div">
                          {statistics.availability_summary.devices_available}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('deviceStatus.available')}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%', p: 2, boxShadow: theme.shadows[1] }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: theme.palette.error.main, mr: 2 }}>
                        <ErrorIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h4" component="div">
                          {statistics.availability_summary.devices_unavailable}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('deviceStatus.unavailable')}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%', p: 2, boxShadow: theme.shadows[1] }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: theme.palette.info.main, mr: 2 }}>
                        <SpeedIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h4" component="div">
                          {statistics.availability_summary.avg_response_time_ms?.toFixed(1) || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('systemStats.avgResponseTime')} (ms)
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              </Grid>

              {/* Availability Trend Chart */}
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                {t('systemStats.availabilityTrend')}
              </Typography>

              <Box sx={{ height: 300, mb: 4 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={statistics.hourly_trend.filter(h => h.check_count > 0)}
                    margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="hour"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      label={{ value: t('systemStats.availabilityPercent'), angle: -90, position: 'insideLeft' }}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      formatter={(value: any) => [`${Number(value).toFixed(1)}%`, t('systemStats.availability')]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="availability_rate"
                      stroke={theme.palette.primary.main}
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                {/* Recent Errors */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    {t('systemStats.recentErrors')}
                  </Typography>

                  {statistics.recent_errors.length > 0 ? (
                    <List sx={{
                      bgcolor: theme.palette.background.default,
                      borderRadius: 2,
                      p: 0,
                      overflow: 'auto',
                      maxHeight: 400,
                    }}>
                      {statistics.recent_errors.slice(0, 5).map((error, index) => (
                        <ListItem
                          key={index}
                          divider={index < Math.min(4, statistics.recent_errors.length - 1)}
                          sx={{ alignItems: 'flex-start' }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: theme.palette.error.light }}>
                              <WarningIcon color="error" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" component="span">
                                {error.device_name}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography variant="body2" color="text.secondary" component="span">
                                  {error.error_message}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 0.5 }}>
                                  {formatDistanceToNow(new Date(error.timestamp), { addSuffix: true })}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center', bgcolor: theme.palette.background.default, borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('systemStats.noErrors')}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                {/* Slowest Devices */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    {t('systemStats.slowestDevices')}
                  </Typography>

                  {statistics.top_slowest_devices.length > 0 ? (
                    <List sx={{
                      bgcolor: theme.palette.background.default,
                      borderRadius: 2,
                      p: 0,
                      overflow: 'auto',
                      maxHeight: 400,
                    }}>
                      {statistics.top_slowest_devices.map((device, index) => (
                        <ListItem
                          key={index}
                          divider={index < statistics.top_slowest_devices.length - 1}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: theme.palette.warning.light }}>
                              <SpeedIcon color="warning" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" component="span">
                                {device.device_name}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography variant="body2" color="text.secondary" component="span">
                                  {t('systemStats.responseTime')}: {device.response_time.toFixed(1)} ms
                                </Typography>
                                <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 0.5 }}>
                                  {formatDistanceToNow(new Date(device.timestamp), { addSuffix: true })}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center', bgcolor: theme.palette.background.default, borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('systemStats.noSlowDevices')}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                {t('systemStats.noData')}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};