import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha,
  Grid,
  CircularProgress,
  Chip,
} from '@mui/material';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';
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
          p: 2
        }}
      >
        <CircularProgress size={24} color="primary" />
      </Box>
    );
  }

  return (
    <Box>
      {/* Check in progress indicator */}
      {checkInProgress && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <Chip
            icon={<CircularProgress size={16} color="inherit" />}
            label={t('dashboard:deviceStatus.checkInProgress')}
            size="small"
            color="info"
            variant="outlined"
          />
        </Box>
      )}

      {/* Status grid with condensed design */}
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.success.main, 0.05),
              border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" fontWeight={700} color="success.main">
              <CountUp end={stats.availableDevices} duration={1.2} />
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('dashboard:deviceStatus.active')}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6} md={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.error.main, 0.05),
              border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" fontWeight={700} color="error.main">
              <CountUp end={stats.unavailableDevices} duration={1.2} />
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('dashboard:deviceStatus.inactive')}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6} md={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.info.main, 0.05),
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" fontWeight={700} color="info.main">
              <CountUp end={stats.totalDevices} duration={1.2} />
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('dashboard:deviceStatus.total')}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6} md={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.warning.main, 0.05),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" fontWeight={700} color="warning.main">
              <CountUp end={stats.uptimePercent} duration={1.2} suffix="%" />
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('dashboard:deviceStatus.uptime')}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AvailabilityStatus;