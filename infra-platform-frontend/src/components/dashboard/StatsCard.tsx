import React from 'react';
import { motion } from 'framer-motion';
import {
  Paper,
  Box,
  Typography,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import CountUp from 'react-countup';
import {
  TrendingUpRounded as TrendingUpIcon,
  TrendingDownRounded as TrendingDownIcon,
} from '@mui/icons-material';
import { StatsCardProps } from '../../types/dashboard';

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, trend = 0 }) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Paper
        component={motion.div}
        whileHover={{ y: -5 }}
        transition={{ type: 'spring', stiffness: 300 }}
        sx={{
          height: '100%',
          borderRadius: '24px',
          boxShadow: `0 8px 30px ${alpha(theme.palette[color].main, 0.12)}`,
          border: `1px solid ${alpha(theme.palette[color].main, 0.1)}`,
          overflow: 'hidden',
          position: 'relative',
          p: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.05)} 0%, ${alpha(theme.palette[color].light, 0.05)} 100%)`,
          backdropFilter: 'blur(10px)',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette[color].main}, ${theme.palette[color].light})`,
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              variant="body2"
              gutterBottom
              sx={{
                fontWeight: 500,
                color: alpha(theme.palette.text.secondary, 0.8),
                fontSize: '0.85rem',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{
                fontWeight: 700,
                mt: 1,
                color: theme.palette.mode === 'dark'
                  ? theme.palette[color].light
                  : theme.palette[color].dark,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                component={CountUp}
                end={value}
                duration={1.5}
                separator=","
                sx={{ lineHeight: 1 }}
              />

              {trend !== 0 && (
                <Chip
                  icon={trend > 0 ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                  label={`${Math.abs(trend)}%`}
                  size="small"
                  sx={{
                    ml: 1,
                    height: 22,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    bgcolor: alpha(
                      trend > 0 ? theme.palette.success.main : theme.palette.error.main,
                      0.1
                    ),
                    color: trend > 0 ? theme.palette.success.main : theme.palette.error.main,
                    border: `1px solid ${alpha(
                      trend > 0 ? theme.palette.success.main : theme.palette.error.main,
                      0.2
                    )}`,
                  }}
                />
              )}
            </Typography>
          </Box>

          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                bgcolor: alpha(theme.palette[color].main, 0.12),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette[color].main,
                border: `1px solid ${alpha(theme.palette[color].main, 0.24)}`,
                boxShadow: `0 6px 16px ${alpha(theme.palette[color].main, 0.2)}`,
              }}
            >
              {icon}
            </Box>
          </motion.div>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default StatsCard;