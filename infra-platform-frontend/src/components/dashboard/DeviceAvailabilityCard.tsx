// DeviceAvailabilityCard.tsx - újragondolt, letisztult verzió
import React, { useState } from 'react';
import {
  Box,
  Divider,
  LinearProgress,
  Tooltip,
  Typography,
  Autocomplete,
  TextField,
  Button,
  useTheme,
  alpha,
  Paper,
  IconButton,
  ButtonGroup,
  Chip,
  Stack
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  SignalCellularAltRounded as SignalIcon,
  FilterListOff as ResetIcon,
  AccessTimeRounded as TimeIcon,
  CalendarMonthRounded as CalendarIcon,
  SpeedRounded as SpeedIcon,
  DevicesRounded as DevicesIcon,
  RefreshRounded as RefreshIcon,
} from '@mui/icons-material';
import { Device } from '../../types/device';
import { DeviceAvailabilityStats, AvailabilityChartData, CheckStatus } from '../../types/availabilityApi';
import DashboardCard from './DashboardCard';
import AvailabilityStatus from './AvailabilityStatus';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
interface DeviceAvailabilityCardProps {
  devices: Device[] | undefined;
  availabilityStats: DeviceAvailabilityStats;
  selectedDevice: number | null;
  onSelectDevice: (deviceId: number) => void;
  chartData?: AvailabilityChartData;
  isLoadingChartData: boolean;
  isLoadingAvailability: boolean;
  onRefresh: () => void;
  checkStatus?: CheckStatus;
}

type ChartType = 'status' | 'uptime' | 'response';

const DeviceAvailabilityCard: React.FC<DeviceAvailabilityCardProps> = ({
  devices = [],
  availabilityStats,
  selectedDevice,
  onSelectDevice,
  chartData,
  isLoadingChartData,
  isLoadingAvailability,
  onRefresh,
  checkStatus,
}) => {
  const theme = useTheme();
  const { t } = useTranslation(['dashboard', 'common']);
  const [chartType, setChartType] = useState<ChartType>('status');

  // Check if monitoring is in progress
  const checkInProgress = checkStatus?.in_progress || false;
  const progress = checkStatus?.total_count
    ? Math.round((checkStatus.completed_count / checkStatus.total_count) * 100)
    : 0;

  // Prepare chart data
  const availabilityTimelineData = chartData?.timestamps.map((timestamp, index) => ({
    time: format(parseISO(timestamp), 'HH:mm'),
    date: format(parseISO(timestamp), 'yyyy-MM-dd'),
    available: chartData.availability[index],
    response: chartData.response_times[index],
  })) || [];

  const dailyUptimeData = chartData?.daily_dates.map((date, index) => ({
    date,
    uptime: chartData.daily_uptime[index],
  })) || [];

  // Overall pie chart data
  const overallStatusData = [
    {
      name: t('dashboard:overview.available'),
      value: availabilityStats.availableDevices,
      color: theme.palette.success.main
    },
    {
      name: t('dashboard:overview.unavailable'),
      value: availabilityStats.unavailableDevices,
      color: theme.palette.error.main
    }
  ];

  // Handle device selection
  const handleDeviceChange = (event: any, value: Device | null) => {
    if (value) {
      onSelectDevice(value.id);
    }
  };

  // Reset device selection to show all
  const handleShowAll = () => {
    onSelectDevice(0);
  };

  // Find selected device details
  const selectedDeviceDetails = selectedDevice ? devices.find(d => d.id === selectedDevice) : null;

  // Create dynamic title based on selection and chart type
  const getCardTitle = () => {
    if (selectedDevice && selectedDeviceDetails) {
      return (
        <Box display="flex" alignItems="center">
          <DevicesIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight={600} noWrap>
            {selectedDeviceDetails.name}
          </Typography>
          <Chip
            size="small"
            label={selectedDeviceDetails.ip_address}
            sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
            variant="outlined"
          />
        </Box>
      );
    }

    // Default title for overview
    return t('dashboard:deviceActivity.title');
  };

  // Create chart-type specific subtitle
  const getChartSubtitle = () => {
    switch (chartType) {
      case 'status':
        return t('dashboard:chartTypes.statusDescription');
      case 'uptime':
        return t('dashboard:chartTypes.uptimeDescription');
      case 'response':
        return t('dashboard:chartTypes.responseDescription');
      default:
        return '';
    }
  };

  // Animation for the charts
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0 }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.85)})`,
        backdropFilter: 'blur(10px)',
        boxShadow: theme.palette.mode === 'dark'
          ? `0 8px 32px ${alpha(theme.palette.common.black, 0.25)}`
          : `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
      }}
    >
      {/* Header with controls */}
      <Box
        sx={{
          p: 3,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Box>
          {getCardTitle()}
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {getChartSubtitle()}
          </Typography>

          {checkInProgress && (
            <Box mt={1} position="relative">
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 4, borderRadius: 2 }}
              />
              <Typography variant="caption" color="text.secondary" mt={0.5}>
                {t('dashboard:deviceStatus.updatingNow')} ({progress}%)
              </Typography>
            </Box>
          )}
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
          {/* Chart type selection */}
          <ButtonGroup
            variant="outlined"
            size="small"
            aria-label="chart type selection"
            sx={{
              '.MuiButtonGroup-grouped': {
                borderRadius: 2,
                borderColor: alpha(theme.palette.divider, 0.2),
              },
              '.MuiButtonGroup-grouped.Mui-selected': {
                background: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
              }
            }}
          >
            <Tooltip title={t('dashboard:chartTypes.status')}>
              <Button
                variant={chartType === 'status' ? 'contained' : 'outlined'}
                color={chartType === 'status' ? 'primary' : 'inherit'}
                onClick={() => setChartType('status')}
                startIcon={<SignalIcon />}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  {t('dashboard:chartTypes.status')}
                </Box>
              </Button>
            </Tooltip>

            <Tooltip title={t('dashboard:chartTypes.uptime')}>
              <Button
                variant={chartType === 'uptime' ? 'contained' : 'outlined'}
                color={chartType === 'uptime' ? 'primary' : 'inherit'}
                onClick={() => setChartType('uptime')}
                startIcon={<CalendarIcon />}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  {t('dashboard:chartTypes.uptime')}
                </Box>
              </Button>
            </Tooltip>

            <Tooltip title={t('dashboard:chartTypes.response')}>
              <Button
                variant={chartType === 'response' ? 'contained' : 'outlined'}
                color={chartType === 'response' ? 'primary' : 'inherit'}
                onClick={() => setChartType('response')}
                startIcon={<SpeedIcon />}
                disabled={!selectedDevice}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  {t('dashboard:chartTypes.response')}
                </Box>
              </Button>
            </Tooltip>
          </ButtonGroup>

          {/* Device selection */}
          <Box sx={{ width: { xs: '100%', sm: 280 } }}>
            {selectedDevice ? (
              <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={handleShowAll}
                startIcon={<ResetIcon />}
                sx={{ borderRadius: 2 }}
              >
                {t('dashboard:deviceActivity.showAll')}
              </Button>
            ) : (
              <Autocomplete
                id="device-select"
                options={devices}
                getOptionLabel={(option: Device) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder={t('dashboard:deviceActivity.selectDevice')}
                    InputProps={{
                      ...params.InputProps,
                      sx: {
                        borderRadius: 2,
                        '.MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(theme.palette.divider, 0.2),
                        }
                      }
                    }}
                  />
                )}
                onChange={handleDeviceChange}
                sx={{ width: '100%' }}
              />
            )}
          </Box>
        </Stack>
      </Box>

      {/* Chart area */}
      {/* Chart area */}
<Box p={3} height={350}>
  {isLoadingChartData ? (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
      <LinearProgress sx={{ width: '50%' }} />
    </Box>
  ) : selectedDevice ? (
    /* Individual device charts */
    <Box key={`${selectedDevice}-${chartType}`} sx={{ height: '100%', opacity: 1 }}>
      <ResponsiveContainer width="100%" height="100%">
        {chartType === 'status' && (
          <AreaChart
            data={availabilityTimelineData}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorAvailable" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.7}/>
                <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0}/>
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
              domain={[0, 1]}
              ticks={[0, 1]}
              tickFormatter={(value) => value === 1 ? t('dashboard:deviceStatus.active') : t('dashboard:deviceStatus.inactive')}
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
              formatter={(value: number) => [
                value === 1
                  ? t('dashboard:deviceStatus.active')
                  : t('dashboard:deviceStatus.inactive'),
                t('dashboard:deviceStatus.status')
              ]}
              labelFormatter={(label) => label}
            />
            <Area
              type="stepAfter"
              dataKey="available"
              name={t('dashboard:deviceStatus.status')}
              stroke={theme.palette.success.main}
              fillOpacity={1}
              fill="url(#colorAvailable)"
              strokeWidth={2}
            />
          </AreaChart>
        )}

        {chartType === 'uptime' && (
          <BarChart
            data={dailyUptimeData}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              axisLine={{ stroke: alpha(theme.palette.divider, 0.3) }}
              tickLine={{ stroke: alpha(theme.palette.divider, 0.3) }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              axisLine={{ stroke: alpha(theme.palette.divider, 0.3) }}
              tickLine={{ stroke: alpha(theme.palette.divider, 0.3) }}
              tickFormatter={(value) => `${value}%`}
            />
            <RechartsTooltip
              contentStyle={{
                background: alpha(theme.palette.background.paper, 0.9),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderRadius: '10px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value}%`, t('dashboard:deviceStatus.uptime')]}
            />
            <Bar
              dataKey="uptime"
              name={t('dashboard:deviceStatus.uptime')}
              fill={theme.palette.primary.main}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        )}

        {chartType === 'response' && (
          <AreaChart
            data={availabilityTimelineData}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.info.main} stopOpacity={0.7}/>
                <stop offset="95%" stopColor={theme.palette.info.main} stopOpacity={0}/>
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
              tickFormatter={(value) => `${value} ms`}
            />
            <RechartsTooltip
              contentStyle={{
                background: alpha(theme.palette.background.paper, 0.9),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderRadius: '10px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value} ms`, t('dashboard:deviceStatus.responseTime')]}
            />
            <Area
              type="monotone"
              dataKey="response"
              name={t('dashboard:deviceStatus.responseTime')}
              stroke={theme.palette.info.main}
              fillOpacity={1}
              fill="url(#colorResponse)"
              strokeWidth={2}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </Box>
  ) : (
    /* Overall/summary charts */
    <Box key={`overall-${chartType}`} sx={{ height: '100%', opacity: 1 }}>
      {chartType === 'status' && (
        <Box height="100%" display="flex" alignItems="center">
          <ResponsiveContainer width="50%" height="100%">
            <PieChart>
              <Pie
                data={overallStatusData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {overallStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(value: number, name: string) => [value, name]}
                contentStyle={{
                  background: alpha(theme.palette.background.paper, 0.9),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  borderRadius: '10px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <Box width="50%" p={3}>
            <Typography variant="h6" mb={2} fontWeight={600}>
              {t('dashboard:overview.summaryTitle')}
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('dashboard:overview.availabilityRate')}
                </Typography>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  {availabilityStats.uptimePercent}%
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('dashboard:overview.deviceCount')}
                </Typography>
                <Typography variant="body1">
                  {t('dashboard:overview.availableCount', { count: availabilityStats.availableDevices })}
                </Typography>
                <Typography variant="body1">
                  {t('dashboard:overview.unavailableCount', { count: availabilityStats.unavailableDevices })}
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary">
                {t('dashboard:deviceActivity.selectDeviceHint')}
              </Typography>
            </Stack>
          </Box>
        </Box>
      )}

      {chartType === 'uptime' && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={[
              {
                name: t('dashboard:deviceStatus.uptime'),
                value: availabilityStats.uptimePercent,
                fill: theme.palette.success.main
              },
              {
                name: t('dashboard:deviceStatus.downtime'),
                value: 100 - availabilityStats.uptimePercent,
                fill: theme.palette.error.main
              }
            ]}
            margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.1} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={150}
            />
            <RechartsTooltip
              formatter={(value: number) => [`${value}%`, '']}
              contentStyle={{
                background: alpha(theme.palette.background.paper, 0.9),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderRadius: '10px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
            />
            <Bar
              dataKey="value"
              fill={(data) => data.fill}
              radius={[0, 4, 4, 0]}
              barSize={40}
              label={(props) => {
                const { x, y, width, height, value } = props;
                return (
                  <text
                    x={x + width - 10}
                    y={y + height / 2}
                    fill="#fff"
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontWeight="bold"
                  >
                    {value}%
                  </text>
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      )}

      {chartType === 'response' && (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
          <Typography variant="h6" gutterBottom>
            {t('dashboard:deviceActivity.selectDeviceForResponse')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, textAlign: 'center', mt: 1 }}>
            {t('dashboard:deviceActivity.responseChartDescription')}
          </Typography>

          {devices.length > 0 && (
            <Autocomplete
              id="device-select-response"
              options={devices}
              getOptionLabel={(option: Device) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder={t('dashboard:deviceActivity.selectDevice')}
                  sx={{ mt: 3, width: 300 }}
                />
              )}
              onChange={handleDeviceChange}
              sx={{ width: '100%', maxWidth: 300 }}
            />
          )}
        </Box>
      )}
    </Box>
  )}
</Box>

      {/* Footer with availability status */}
      <Box
        sx={{
          p: 3,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: alpha(theme.palette.background.default, 0.4)
        }}
      >
        <AvailabilityStatus
          stats={availabilityStats}
          loading={isLoadingAvailability}
          checkInProgress={checkInProgress}
        />

        {/* Refresh button */}
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            size="small"
            variant="outlined"
            disabled={checkInProgress}
            sx={{ borderRadius: 2 }}
          >
            {t('dashboard:refresh')}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default DeviceAvailabilityCard;