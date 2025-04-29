// AvailabilityChart.tsx
import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  CircularProgress,
  alpha,
  useTheme,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { useTranslation } from 'react-i18next';
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
  Legend,
  LineChart,
  Line
} from 'recharts';
import { AvailabilityChartData } from '../../types/availability';
import { format, parseISO } from 'date-fns';
import { Device } from '../../types/device';

interface AvailabilityChartProps {
  data?: AvailabilityChartData;
  loading: boolean;
  devices?: Device[];
  selectedDevice: number | null;
  onSelectDevice: (deviceId: number) => void;
}

const AvailabilityChart: React.FC<AvailabilityChartProps> = ({
  data,
  loading,
  devices,
  selectedDevice,
  onSelectDevice
}) => {
  const theme = useTheme();
  const { t } = useTranslation(['dashboard', 'common']);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleDeviceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onSelectDevice(event.target.value as number);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px',
          width: '100%'
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Prepare data for live status chart
  const availabilityTimelineData = data?.timestamps.map((timestamp, index) => ({
    time: format(parseISO(timestamp), 'HH:mm'),
    date: format(parseISO(timestamp), 'yyyy-MM-dd'),
    available: data.availability[index],
    response: data.response_times[index],
  })) || [];

  // Prepare data for daily uptime chart
  const dailyUptimeData = data?.daily_dates.map((date, index) => ({
    date,
    uptime: data.daily_uptime[index],
  })) || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        {/* Chart Type Selection */}
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
          <Tab label={t('dashboard:deviceActivity.tabs.live')} />
          <Tab label={t('dashboard:deviceActivity.tabs.daily')} />
          <Tab label={t('dashboard:deviceActivity.tabs.response')} />
        </Tabs>

        {/* Device Selection - now with proper styling */}
        {devices && devices.length > 0 && (
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="device-select-label">
              {t('dashboard:deviceActivity.selectDevice')}
            </InputLabel>
            <Select
              labelId="device-select-label"
              id="device-select"
              value={selectedDevice || ''}
              onChange={handleDeviceChange}
              label={t('dashboard:deviceActivity.selectDevice')}
            >
              {devices.map((device) => (
                <MenuItem key={device.id} value={device.id}>
                  {device.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {/* No device selected view - Shows all devices summary */}
      {!selectedDevice && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.7),
            borderRadius: 2,
            mb: 2
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            {t('dashboard:deviceActivity.allDevicesSummary')}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box height="250px">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyUptimeData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
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
                </ResponsiveContainer>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('dashboard:deviceActivity.selectDevicePrompt')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('dashboard:deviceActivity.overviewDescription')}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Chart Views for selected device */}
      {selectedDevice && (
        <Box height="300px" mt={1}>
          {activeTab === 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={availabilityTimelineData}
                margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
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
            </ResponsiveContainer>
          )}

          {activeTab === 1 && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dailyUptimeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
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
            </ResponsiveContainer>
          )}

          {activeTab === 2 && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={availabilityTimelineData}
                margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
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
            </ResponsiveContainer>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AvailabilityChart;