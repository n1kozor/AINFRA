import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha,
  Grid,
  CircularProgress
} from '@mui/material';
import {
  CheckCircleRounded as CheckIcon,
  ErrorRounded as ErrorIcon,
  CloudRounded as CloudIcon,
  AlarmRounded as AlarmIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { DeviceAvailabilityStats } from '../../types/availabilityApi';

interface AvailabilityStatusProps {
  stats: DeviceAvailabilityStats;
  loading: boolean;
  checkInProgress?: boolean;
}

const AvailabilityStatus: React.FC<AvailabilityStatusProps> = ({
  stats,
  loading,
  checkInProgress = false,
}) => {
  const theme = useTheme();
  const { t } = useTranslation(['dashboard', 'common']);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          py: 4
        }}
      >
        <CircularProgress size={32} color="primary" />
      </Box>
    );
  }

  return (
    <Box position="relative">
      {/* Indikátor az ellenőrzési folyamatról */}
      {checkInProgress && (
        <Box
          sx={{
            position: 'absolute',
            top: -12,
            right: 0,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            typography: 'caption',
            color: 'text.secondary',
            fontSize: '0.75rem',
          }}
        >
          <CircularProgress size={12} thickness={6} color="inherit" />
          {t('dashboard:deviceStatus.checkInProgress')}
        </Box>
      )}

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
              <CountUp end={stats.availableDevices} duration={1.5} />
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
              <CountUp end={stats.unavailableDevices} duration={1.5} />
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
              <CountUp end={stats.totalDevices} duration={1.5} />
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: alpha(theme.palette.text.primary, 0.7) }}>
              {t('dashboard:deviceStatus.total')}
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
              <CountUp end={stats.uptimePercent} duration={1.5} suffix="%" />
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: alpha(theme.palette.text.primary, 0.7) }}>
              {t('dashboard:deviceStatus.uptime')}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AvailabilityStatus;