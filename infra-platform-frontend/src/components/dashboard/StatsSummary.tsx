import React from 'react';
import {
  Grid,
  Box,
  Typography,
  useTheme,
  alpha,
  Chip,
} from '@mui/material';
import {
  ComputerRounded as StandardIcon,
  SmartToyRounded as CustomIcon,
  ExtensionRounded as PluginIcon,
  SpeedRounded as SpeedIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { DashboardStats } from '../../types/dashboard';
import { DeviceAvailabilityStats } from '../../types/availabilityApi';

interface StatsSummaryProps {
  stats?: DashboardStats;
  availabilityStats: DeviceAvailabilityStats;
}

const StatsSummary: React.FC<StatsSummaryProps> = ({ stats, availabilityStats }) => {
  const theme = useTheme();
  const { t } = useTranslation(['dashboard', 'common']);

  // Animation variants
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Data for the stat cards
  const statItems = [
    {
      title: t('dashboard:stats.totalDevices'),
      value: stats?.totalDevices || 0,
      icon: <SpeedIcon fontSize="medium" />,
      color: 'primary',
      additionalInfo: {
        available: availabilityStats.availableDevices || 0,
        unavailable: availabilityStats.unavailableDevices || 0
      }
    },
    {
      title: t('dashboard:stats.standardDevices'),
      value: stats?.standardDevices || 0,
      icon: <StandardIcon fontSize="medium" />,
      color: 'info',
    },
    {
      title: t('dashboard:stats.customDevices'),
      value: stats?.customDevices || 0,
      icon: <CustomIcon fontSize="medium" />,
      color: 'secondary',
    },
    {
      title: t('dashboard:stats.plugins'),
      value: stats?.plugins || 0,
      icon: <PluginIcon fontSize="medium" />,
      color: 'success',
    },
  ];

  return (
    <Grid container spacing={3}>
      {statItems.map((item, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <motion.div
            custom={index}
            initial="hidden"
            animate="visible"
            variants={itemVariant}
          >
            <Box
              sx={{
                p: 2.5,
                borderRadius: 3,
                backgroundColor: alpha(theme.palette[item.color].main, 0.05),
                border: `1px solid ${alpha(theme.palette[item.color].main, 0.1)}`,
                boxShadow: `0 4px 20px ${alpha(theme.palette[item.color].main, 0.1)}`,
                transition: 'all 0.3s ease',
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: `0 8px 25px ${alpha(theme.palette[item.color].main, 0.15)}`,
                  backgroundColor: alpha(theme.palette[item.color].main, 0.08),
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: alpha(theme.palette.text.secondary, 0.8),
                    fontSize: '0.9rem'
                  }}
                >
                  {item.title}
                </Typography>
                <Box
                  sx={{
                    backgroundColor: alpha(theme.palette[item.color].main, 0.12),
                    color: theme.palette[item.color].main,
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 10px ${alpha(theme.palette[item.color].main, 0.15)}`,
                  }}
                >
                  {item.icon}
                </Box>
              </Box>

              <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
                <CountUp end={item.value} duration={1.5} separator="," />
              </Typography>

              {index === 0 && 'additionalInfo' in item && (
                <Box mt={1} display="flex" gap={1}>
                  <Chip
                    size="small"
                    label={`${item.additionalInfo.available} ${t('dashboard:stats.active')}`}
                    color="success"
                    sx={{ fontWeight: 600, fontSize: '0.7rem', height: 22 }}
                  />
                  <Chip
                    size="small"
                    label={`${item.additionalInfo.unavailable} ${t('dashboard:stats.inactive')}`}
                    color="error"
                    sx={{ fontWeight: 600, fontSize: '0.7rem', height: 22 }}
                  />
                </Box>
              )}
            </Box>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsSummary;