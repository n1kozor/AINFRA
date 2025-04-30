import React from 'react';
import { Box, Typography, Grid, useTheme, alpha, Skeleton } from '@mui/material';
import {
  DeviceHubOutlined,
  CheckCircleOutline,
  ErrorOutline,
  SpeedOutlined
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { DeviceAvailabilityStats } from '../../../types/availability';

interface DeviceStatusSummaryProps {
  stats: DeviceAvailabilityStats | null;
  isLoading: boolean;
}

const DeviceStatusSummary: React.FC<DeviceStatusSummaryProps> = ({ stats, isLoading }) => {
  const theme = useTheme();

  const statsItems = [
    {
      title: 'Total Devices',
      value: stats?.totalDevices || 0,
      icon: <DeviceHubOutlined fontSize="large" />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Available',
      value: stats?.availableDevices || 0,
      icon: <CheckCircleOutline fontSize="large" />,
      color: theme.palette.success.main,
    },
    {
      title: 'Unavailable',
      value: stats?.unavailableDevices || 0,
      icon: <ErrorOutline fontSize="large" />,
      color: theme.palette.error.main,
    },
    {
      title: 'Uptime',
      value: stats?.uptimePercent || 0,
      suffix: '%',
      icon: <SpeedOutlined fontSize="large" />,
      color: theme.palette.info.main,
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ p: 2, height: '100%' }}>
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={6} md={3} key={item}>
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, height: '100%' }}>
      <Grid container spacing={2}>
        {statsItems.map((item, index) => (
          <Grid item xs={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(item.color, 0.08)} 0%, ${alpha(item.color, 0.03)} 100%)`,
                  border: `1px solid ${alpha(item.color, 0.12)}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 120,
                  transition: 'all 0.3s',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${alpha(item.color, 0.12)} 0%, ${alpha(item.color, 0.05)} 100%)`,
                    boxShadow: `0 8px 20px ${alpha(item.color, 0.15)}`
                  }
                }}
              >
                <Box
                  sx={{
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1,
                    p: 1,
                    borderRadius: '50%',
                    background: alpha(item.color, 0.1)
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="h5" fontWeight={700} color={item.color}>
                  {item.value}{item.suffix || ''}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.title}
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DeviceStatusSummary;