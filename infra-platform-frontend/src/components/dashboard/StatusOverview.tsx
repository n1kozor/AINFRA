// components/dashboard/StatusOverview.tsx
import React, { useState, useMemo } from 'react';
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
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper,
  Chip,
  Tabs,
  Tab,
  useMediaQuery
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  AccessTime as AccessTimeIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Speed as SpeedIcon,
  DevicesOther as DevicesIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { SystemStatistics, TimeRangeOption } from '../../types/statistics';
import { formatDistanceToNow } from 'date-fns';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

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
  const [tabValue, setTabValue] = useState(0);
  useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTimeRangeChange = (
      _event: React.MouseEvent<HTMLElement>,
    newRange: TimeRangeOption | null,
  ) => {
    if (newRange !== null) {
      onTimeRangeChange(newRange);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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

  const chartData = useMemo(() => {
    if (!statistics) return [];

    const filteredData = statistics.hourly_trend
      .filter(h => h.check_count > 0)
      .map(item => ({
        ...item,
        hour: item.hour.split(' ')[1],
        availability: item.availability_rate
      }));

    if (filteredData.length === 1) {
      const singlePoint = filteredData[0];
      return [
        singlePoint,
        { ...singlePoint, hour: `${singlePoint.hour}+` }
      ];
    }

    return filteredData;
  }, [statistics]);

  const availabilityStatus = useMemo(() => {
    if (!statistics) return { rate: 0, status: 'unknown' };

    const rate = statistics.availability_summary.availability_rate;
    let status = 'critical';

    if (rate > 80) status = 'excellent';
    else if (rate > 50) status = 'good';

    return { rate, status };
  }, [statistics]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return theme.palette.success.main;
      case 'good': return theme.palette.warning.main;
      case 'critical': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
  };

  const statusColor = getStatusColor(availabilityStatus.status);

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          width: '100%',
          background: theme.palette.background.paper,
          backdropFilter: 'blur(8px)',
          overflow: 'visible',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 3,
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                mr: 2
              }}>
                <TrendingUpIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {t('systemStats.title')}
                </Typography>
                {statistics && statistics.system_status.timestamp && (
                  <Typography variant="caption" color="text.secondary">
                    {t('lastUpdated')}: {formatDistanceToNow(new Date(statistics.system_status.timestamp), { addSuffix: true })}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: { xs: 'flex-start', sm: 'flex-end' },
              gap: 1
            }}>
              <Chip
                icon={<AccessTimeIcon fontSize="small" />}
                label={getTimeRangeLabel(timeRange)}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ mr: 1 }}
              />

              <ToggleButtonGroup
                size="small"
                value={timeRange}
                exclusive
                onChange={handleTimeRangeChange}
                aria-label="time range"
              >
                <ToggleButton value="30m" aria-label="30 minutes" sx={{ px: { xs: 1, sm: 1.5 } }}>
                  30m
                </ToggleButton>
                <ToggleButton value="1h" aria-label="1 hour" sx={{ px: { xs: 1, sm: 1.5 } }}>
                  1h
                </ToggleButton>
                <ToggleButton value="6h" aria-label="6 hours" sx={{ px: { xs: 1, sm: 1.5 } }}>
                  6h
                </ToggleButton>
                <ToggleButton value="24h" aria-label="24 hours" sx={{ px: { xs: 1, sm: 1.5 } }}>
                  24h
                </ToggleButton>
                <ToggleButton value="7d" aria-label="7 days" sx={{ px: { xs: 1, sm: 1.5 } }}>
                  7d
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 8 }}>
              <CircularProgress />
            </Box>
          ) : statistics ? (
            <>
              <Box sx={{ mb: 4, overflow: 'hidden' }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 3,
                          bgcolor: alpha(statusColor, 0.05),
                          border: `1px solid ${alpha(statusColor, 0.2)}`,
                          position: 'relative',
                        }}
                    >
                      <Box
                          sx={{
                            position: 'relative',
                            width: 80,
                            height: 80,
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                      >
                        <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              borderRadius: '50%',
                              background: `radial-gradient(circle, ${alpha(statusColor, 0.15)} 0%, transparent 70%)`,
                              animation: 'pulse 2s infinite',
                            }}
                        />
                        <Typography variant="h4" sx={{ fontWeight: 700, color: statusColor }}>
                          {Math.round(availabilityStatus.rate)}%
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {t('systemStats.availability')}
                      </Typography>
                      <Chip
                          label={t(`networkSoul.status.${availabilityStatus.status}`)}
                          sx={{
                            bgcolor: alpha(statusColor, 0.1),
                            color: statusColor,
                            mt: 1,
                            fontWeight: 600,
                          }}
                          size="small"
                      />
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        height: '100%',
                        borderRadius: 3,
                        background: theme.palette.mode === 'dark'
                          ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.default, 0.8)})`
                          : theme.palette.background.default,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                          <DevicesIcon />
                        </Avatar>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                          {statistics.device_summary.active_devices}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle2" color="text.primary" gutterBottom>
                        {t('deviceStatus.totalDevices')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('deviceStatus.available')}: {statistics.availability_summary.devices_available} • {t('deviceStatus.unavailable')}: {statistics.availability_summary.devices_unavailable}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        height: '100%',
                        borderRadius: 3,
                        background: theme.palette.mode === 'dark'
                          ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.default, 0.8)})`
                          : theme.palette.background.default,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main }}>
                          <SpeedIcon />
                        </Avatar>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                          {statistics.availability_summary.avg_response_time_ms?.toFixed(0) || 'N/A'}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle2" color="text.primary" gutterBottom>
                        {t('systemStats.avgResponseTime')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ms
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        height: '100%',
                        borderRadius: 3,
                        background: theme.palette.mode === 'dark'
                          ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.default, 0.8)})`
                          : theme.palette.background.default,
                        border: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main }}>
                          <CheckCircleIcon />
                        </Avatar>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                          {statistics.system_status.check_interval_minutes}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle2" color="text.primary" gutterBottom>
                        {t('systemStats.checkInterval')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t(statistics.system_status.check_interval_minutes > 1 ? 'timeRange.minutes' : 'timeRange.minute')}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: `1px solid ${theme.palette.divider}`,
                  mb: 3
                }}
              >
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant={isSmallScreen ? "fullWidth" : "standard"}
                  sx={{
                    px: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '& .MuiTab-root': {
                      py: 2
                    }
                  }}
                >
                  <Tab
                    label={t('systemStats.availabilityTrend')}
                    icon={<TrendingUpIcon />}
                    iconPosition="start"
                  />
                  <Tab
                    label={t('systemStats.recentErrors')}
                    icon={<WarningIcon />}
                    iconPosition="start"
                    sx={{ color: statistics.recent_errors.length > 0 ? theme.palette.error.main : 'inherit' }}
                  />
                  <Tab
                    label={t('systemStats.slowestDevices')}
                    icon={<SpeedIcon />}
                    iconPosition="start"
                  />
                </Tabs>

                <Box sx={{ p: { xs: 2, md: 3 } }}>
                  {tabValue === 0 && (
                    <>
                      <Box sx={{ height: 350, width: '100%' }}>
                        {chartData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={chartData}
                              margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                            >
                              <defs>
                                <linearGradient id="availabilityGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.primary, 0.1)} />
                              <XAxis
                                dataKey="hour"
                                axisLine={{ stroke: alpha(theme.palette.text.primary, 0.2) }}
                                tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                tickLine={{ stroke: alpha(theme.palette.text.primary, 0.2) }}
                              />
                              <YAxis
                                domain={[0, 100]}
                                axisLine={{ stroke: alpha(theme.palette.text.primary, 0.2) }}
                                tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                tickLine={{ stroke: alpha(theme.palette.text.primary, 0.2) }}
                                label={{
                                  value: t('systemStats.availabilityPercent'),
                                  angle: -90,
                                  position: 'insideLeft',
                                  style: { textAnchor: 'middle', fill: theme.palette.text.secondary }
                                }}
                              />
                              <RechartsTooltip
                                contentStyle={{
                                  backgroundColor: theme.palette.background.paper,
                                  borderRadius: 8,
                                  border: `1px solid ${theme.palette.divider}`,
                                  boxShadow: theme.shadows[3]
                                }}
                                formatter={(value: any) => [`${Number(value).toFixed(1)}%`, t('systemStats.availability')]}
                                labelFormatter={(label) => `${label}`}
                              />
                              <Area
                                type="monotone"
                                dataKey="availability"
                                strokeWidth={3}
                                stroke={theme.palette.primary.main}
                                fillOpacity={1}
                                fill="url(#availabilityGradient)"
                                activeDot={{
                                  r: 8,
                                  strokeWidth: 2,
                                  stroke: theme.palette.background.paper,
                                  fill: theme.palette.primary.main
                                }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="body1" color="text.secondary">
                              {t('systemStats.noData')}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {chartData.length > 0 && (
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          mt: 2,
                          color: theme.palette.text.secondary,
                          fontSize: '0.875rem'
                        }}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mr: 3
                          }}>
                            <Box sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: theme.palette.primary.main,
                              mr: 1
                            }} />
                            {t('systemStats.availability')}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <HistoryIcon sx={{ fontSize: 18, mr: 0.5 }} />
                            {`${chartData.length} ${t('systemStats.dataPoints')}`}
                          </Box>
                        </Box>
                      )}
                    </>
                  )}

                  {tabValue === 1 && (
                    <>
                      {statistics.recent_errors.length > 0 ? (
                        <List sx={{
                          width: '100%',
                          maxHeight: 350,
                          overflow: 'auto',
                          borderRadius: 2
                        }}>
                          {statistics.recent_errors.slice(0, 7).map((error, index) => (
                            <ListItem
                              key={index}
                              divider={index < Math.min(6, statistics.recent_errors.length - 1)}
                              sx={{
                                py: 1.5,
                                px: 2,
                                borderRadius: 2,
                                mb: 1,
                                bgcolor: alpha(theme.palette.error.main, 0.05),
                                border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                                '&:last-child': {
                                  mb: 0
                                }
                              }}
                            >
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.2) }}>
                                  <ErrorIcon sx={{ color: theme.palette.error.main }} />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="subtitle2"
                                    component="div"
                                    sx={{
                                      fontWeight: 600,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between'
                                    }}
                                  >
                                    <span>{error.device_name}</span>
                                    <Typography
                                      variant="caption"
                                      component="span"
                                      sx={{
                                        color: theme.palette.text.secondary,
                                        ml: 2,
                                        fontSize: '0.75rem',
                                        fontWeight: 400
                                      }}
                                    >
                                      {formatDistanceToNow(new Date(error.timestamp), { addSuffix: true })}
                                    </Typography>
                                  </Typography>
                                }
                                secondary={
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 0.5 }}
                                  >
                                    {error.error_message}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: 300,
                          flexDirection: 'column'
                        }}>
                          <CheckCircleIcon
                            sx={{
                              fontSize: 60,
                              color: theme.palette.success.main,
                              opacity: 0.7,
                              mb: 2
                            }}
                          />
                          <Typography variant="body1" color="text.secondary">
                            {t('systemStats.noErrors')}
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}

                  {tabValue === 2 && (
                    <>
                      {statistics.top_slowest_devices.length > 0 ? (
                        <List sx={{
                          width: '100%',
                          maxHeight: 350,
                          overflow: 'auto',
                          borderRadius: 2
                        }}>
                          {statistics.top_slowest_devices.map((device, index) => (
                            <ListItem
                              key={index}
                              divider={index < statistics.top_slowest_devices.length - 1}
                              sx={{
                                py: 1.5,
                                px: 2,
                                borderRadius: 2,
                                mb: 1,
                                bgcolor: index === 0
                                  ? alpha(theme.palette.warning.main, 0.05)
                                  : 'transparent',
                                border: index === 0
                                  ? `1px solid ${alpha(theme.palette.warning.main, 0.1)}`
                                  : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                                '&:last-child': {
                                  mb: 0
                                }
                              }}
                            >
                              <ListItemAvatar>
                                <Avatar sx={{
                                  bgcolor: alpha(
                                    index === 0
                                      ? theme.palette.warning.main
                                      : theme.palette.info.main,
                                    0.2
                                  )
                                }}>
                                  <SpeedIcon sx={{
                                    color: index === 0
                                      ? theme.palette.warning.main
                                      : theme.palette.info.main
                                  }} />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle2" component="div" sx={{ fontWeight: 600 }}>
                                      {index === 0 && (
                                        <Chip
                                          label="#1"
                                          size="small"
                                          sx={{
                                            mr: 1,
                                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                                            color: theme.palette.warning.main,
                                            height: 20,
                                            fontSize: '0.7rem'
                                          }}
                                        />
                                      )}
                                      {device.device_name}
                                    </Typography>
                                    <Typography
                                      variant="h6"
                                      component="span"
                                      sx={{
                                        fontWeight: 700,
                                        color: index === 0
                                          ? theme.palette.warning.main
                                          : theme.palette.info.main
                                      }}
                                    >
                                      {device.response_time.toFixed(0)}
                                      <Typography
                                        component="span"
                                        variant="caption"
                                        sx={{
                                          ml: 0.5,
                                          color: theme.palette.text.secondary
                                        }}
                                      >
                                        ms
                                      </Typography>
                                    </Typography>
                                  </Box>
                                }
                                secondary={
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: 'block', mt: 0.5 }}
                                  >
                                    {formatDistanceToNow(new Date(device.timestamp), { addSuffix: true })}
                                    {' • '}
                                    {device.check_method}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: 300
                        }}>
                          <Typography variant="body1" color="text.secondary">
                            {t('systemStats.noSlowDevices')}
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </Paper>
            </>
          ) : (
            <Box sx={{
              p: 6,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Box
                component="img"
                src="/assets/images/illustrations/no-data.svg"
                alt="No data"
                sx={{
                  width: '100%',
                  maxWidth: 200,
                  opacity: 0.6,
                  mb: 2
                }}
              />
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