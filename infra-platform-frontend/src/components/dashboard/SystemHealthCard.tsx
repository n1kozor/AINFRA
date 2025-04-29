import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha,
  LinearProgress,
  CircularProgress,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  SentimentVerySatisfiedRounded as SatisfiedIcon,
  SentimentDissatisfiedRounded as DissatisfiedIcon,
  ShieldRounded as ShieldIcon,
} from '@mui/icons-material';
import { SystemHealth } from '../../types/dashboard';
import DashboardCard from './DashboardCard';

interface SystemHealthCardProps {
  data: SystemHealth[];
  healthScore: number;
  onRefresh: () => void;
}

const SystemHealthCard: React.FC<SystemHealthCardProps> = ({ data, healthScore, onRefresh }) => {
  const theme = useTheme();
  const { t } = useTranslation(['dashboard', 'common']);

  return (
    <DashboardCard
      title={t('dashboard:systemHealth.title')}
      subtitle={t('dashboard:systemHealth.subtitle')}
      icon={<ShieldIcon />}
      color="success"
      variant="glass"
      onRefresh={onRefresh}
    >
      <Box p={2}>
        {data.map((item, index) => (
          <Box key={index} mb={index < data.length - 1 ? 2.5 : 0}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, alignItems: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.87rem',
                }}
              >
                {item.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.87rem',
                    color:
                      item.status === 'good'
                        ? theme.palette.success.main
                        : item.status === 'warning'
                          ? theme.palette.warning.main
                          : theme.palette.error.main,
                  }}
                >
                  {item.value}%
                </Typography>
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    ml: 1,
                    backgroundColor:
                      item.status === 'good'
                        ? theme.palette.success.main
                        : item.status === 'warning'
                          ? theme.palette.warning.main
                          : theme.palette.error.main,
                  }}
                />
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={item.value}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.divider, 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor:
                    item.status === 'good'
                      ? theme.palette.success.main
                      : item.status === 'warning'
                        ? theme.palette.warning.main
                        : theme.palette.error.main,
                },
              }}
            />
          </Box>
        ))}
      </Box>

      <Divider sx={{ opacity: 0.4 }} />

      <Box p={2} textAlign="center">
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mb: 1.5,
          }}
        >
          {t('dashboard:systemHealth.overallStatus')}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress
              variant="determinate"
              value={healthScore}
              size={120}
              thickness={5}
              sx={{
                color:
                  healthScore > 80
                    ? theme.palette.success.main
                    : healthScore > 50
                      ? theme.palette.warning.main
                      : theme.palette.error.main,
                boxShadow: `0 0 15px ${alpha(
                  healthScore > 80
                    ? theme.palette.success.main
                    : healthScore > 50
                      ? theme.palette.warning.main
                      : theme.palette.error.main,
                  0.3
                )}`,
                borderRadius: '50%',
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 20 }}
              >
                {healthScore > 80 ? (
                  <SatisfiedIcon
                    sx={{
                      fontSize: 40,
                      color: theme.palette.success.main,
                    }}
                  />
                ) : healthScore > 50 ? (
                  <ShieldIcon
                    sx={{
                      fontSize: 40,
                      color: theme.palette.warning.main,
                    }}
                  />
                ) : (
                  <DissatisfiedIcon
                    sx={{
                      fontSize: 40,
                      color: theme.palette.error.main,
                    }}
                  />
                )}
              </motion.div>
            </Box>
          </Box>
        </Box>

        <Typography variant="h5" fontWeight={700}>
          {healthScore > 80
            ? t('dashboard:systemHealth.status.excellent')
            : healthScore > 50
              ? t('dashboard:systemHealth.status.good')
              : t('dashboard:systemHealth.status.critical')}
        </Typography>

        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mt: 0.5, fontSize: '0.85rem' }}
        >
          {healthScore > 80
            ? t('dashboard:systemHealth.messages.excellent')
            : healthScore > 50
              ? t('dashboard:systemHealth.messages.good')
              : t('dashboard:systemHealth.messages.critical')}
        </Typography>
      </Box>
    </DashboardCard>
  );
};

export default SystemHealthCard;