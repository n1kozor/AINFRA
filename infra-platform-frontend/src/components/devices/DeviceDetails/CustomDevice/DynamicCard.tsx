import React from 'react';
import {
  Box, Typography, Card, CardContent, Chip, LinearProgress, alpha, useTheme
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  LineStyle as MetricsIcon,
  Launch as LaunchIcon,
  Storage as StorageIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { DynamicCardProps } from './types';

const DynamicCard: React.FC<DynamicCardProps> = ({
  title,
  subtitle,
  value,
  type = 'text',
  icon,
  color,
  onClick
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  // Format value based on type
  const formatValue = () => {
    if (value === undefined || value === null) return '-';

    switch (type) {
      case 'status':
        return (
          <Chip
            label={value ? t('common:status.online') : t('common:status.offline')}
            color={value ? 'success' : 'error'}
            size="small"
          />
        );
      case 'boolean':
        return value ? <CheckIcon color="success" /> : <CloseIcon color="error" />;
      case 'progress':
      case 'percentage':
        const percentage = typeof value === 'number' ? value : parseFloat(value);
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">{percentage}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{ height: 6, borderRadius: 1, mt: 1 }}
              color={percentage > 80 ? 'error' : percentage > 60 ? 'warning' : 'success'}
            />
          </Box>
        );
      case 'bytes':
        return formatBytes(typeof value === 'number' ? value : parseFloat(value));
      default:
        return value.toString();
    }
  };

  // Format bytes utility function
  const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Display appropriate icon
  const getIcon = () => {
    if (icon) return icon;

    switch (type) {
      case 'status':
        return value ? <CheckIcon /> : <CloseIcon />;
      case 'progress':
      case 'percentage':
        return <MetricsIcon />;
      case 'bytes':
        return <StorageIcon />;
      case 'boolean':
        return value ? <CheckIcon /> : <CloseIcon />;
      default:
        return <MetricsIcon />;
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        borderRadius: 2,
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        } : {}
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: alpha(color || theme.palette.primary.main, 0.1),
            color: color || theme.palette.primary.main
          }}>
            {getIcon()}
          </Box>
          {onClick && <LaunchIcon fontSize="small" color="action" />}
        </Box>

        <Typography variant="h6" gutterBottom>
          {formatValue()}
        </Typography>

        <Typography color="textSecondary" variant="body2">
          {title}
        </Typography>

        {subtitle && (
          <Typography color="textSecondary" variant="caption">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default DynamicCard;