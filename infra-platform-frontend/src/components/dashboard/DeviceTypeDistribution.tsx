import React from 'react';
import { Box, Typography, useTheme, alpha, Skeleton } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DeviceTypeDistributionProps {
  deviceStats: any;
  isLoading: boolean;
}

const DeviceTypeDistribution: React.FC<DeviceTypeDistributionProps> = ({ deviceStats, isLoading }) => {
  const theme = useTheme();

  const data = [
    { name: 'Windows', value: deviceStats?.osDistribution?.windows || 0, color: theme.palette.info.main },
    { name: 'macOS', value: deviceStats?.osDistribution?.macos || 0, color: theme.palette.success.main },
    { name: 'Linux', value: deviceStats?.osDistribution?.linux || 0, color: theme.palette.warning.main },
    { name: 'Custom', value: deviceStats?.deviceTypeDistribution?.custom || 0, color: theme.palette.secondary.main },
  ].filter(item => item.value > 0);

  const placeholderData = data.length === 0 ? [
    { name: 'No Data', value: 1, color: theme.palette.grey[300] }
  ] : [];

  const chartData = data.length > 0 ? data : placeholderData;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            background: alpha(theme.palette.background.paper, 0.9),
            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            borderRadius: 2,
            p: 1.5,
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="subtitle2" color="textPrimary">
            {payload[0].name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Devices: {payload[0].value}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Skeleton
          variant="circular"
          width={250}
          height={250}
          sx={{ opacity: 0.7 }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: alpha(theme.palette.background.paper, 0.5),
        borderRadius: 4,
        p: 2,
        boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
      }}
    >
      <Typography
        variant="h6"
        fontWeight={600}
        sx={{ mb: 2, textAlign: 'center' }}
      >
        Device Type Distribution
      </Typography>

      {chartData.length === 1 && chartData[0].name === 'No Data' ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100% - 40px)',
          }}
        >
          <Typography color="text.secondary">
            No device data available
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={theme.palette.background.paper}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default DeviceTypeDistribution;