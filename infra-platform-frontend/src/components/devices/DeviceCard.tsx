import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  CardActionArea,
  useTheme,
  alpha,
  Badge,
  Stack,
  Avatar,
  Divider,
  ButtonBase,
} from '@mui/material';
import {
  ComputerRounded as StandardIcon,
  SmartToyRounded as CustomIcon,
  EditRounded as EditIcon,
  DeleteRounded as DeleteIcon,
  VisibilityRounded as ViewIcon,
  ArrowForwardRounded as ArrowIcon,
  CheckCircleRounded as OnlineIcon,
  ErrorRounded as OfflineIcon,
  StorageRounded as StorageIcon,
  ExtensionRounded as PluginIcon,
  AccessTimeRounded as TimeIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Device } from '../../types/device';
import { format, formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface DeviceCardProps {
  device: Device;
  onDelete?: (id: number) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onDelete }) => {
  const { t } = useTranslation(['devices', 'common']);
  const navigate = useNavigate();
  const theme = useTheme();

  const isStandard = device.type === 'standard';
  const DeviceIcon = isStandard ? StandardIcon : CustomIcon;

  const getDeviceTypeLabel = () => {
    if (isStandard && device.standard_device) {
      return t(`devices:osTypes.${device.standard_device.os_type}`);
    } else if (!isStandard && device.custom_device) {
      return device.custom_device.plugin_name;
    } else {
      return isStandard ? t('devices:deviceTypes.standard') : t('devices:deviceTypes.custom');
    }
  };

  const handleCardClick = () => {
    navigate(`/devices/${device.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/devices/${device.id}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(device.id);
    }
  };

  // Get color scheme based on device type
  const getColorScheme = () => {
    if (isStandard) {
      if (device.standard_device?.os_type === 'windows') {
        return theme.palette.info;
      } else if (device.standard_device?.os_type === 'linux') {
        return theme.palette.warning;
      } else if (device.standard_device?.os_type === 'macos') {
        return theme.palette.success;
      } else {
        return theme.palette.primary;
      }
    } else {
      return theme.palette.secondary;
    }
  };

  const colorScheme = getColorScheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        elevation={0}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '20px',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundImage: 'none',
          border: `1px solid ${alpha(colorScheme.main, 0.15)}`,
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 8px 25px ${alpha(colorScheme.main, 0.2)}`,
            borderColor: alpha(colorScheme.main, 0.3),
          },
          position: 'relative',
        }}
      >
        {/* Status indicator */}
        <Badge
          variant="dot"
          overlap="circular"
          color={device.is_active ? 'success' : 'error'}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            '& .MuiBadge-badge': {
              width: 12,
              height: 12,
              borderRadius: '50%',
              border: `2px solid ${theme.palette.background.paper}`,
              boxShadow: `0 0 0 ${device.is_active ? '2px' : '0px'} ${alpha(theme.palette.success.main, 0.3)}`,
              animation: device.is_active ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%': {
                  boxShadow: `0 0 0 0 ${alpha(theme.palette.success.main, 0.7)}`,
                },
                '70%': {
                  boxShadow: `0 0 0 5px ${alpha(theme.palette.success.main, 0)}`,
                },
                '100%': {
                  boxShadow: `0 0 0 0 ${alpha(theme.palette.success.main, 0)}`,
                },
              },
            },
          }}
        />

        {/* Header section */}
        <Box
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'flex-start',
            background: `linear-gradient(135deg, ${alpha(colorScheme.main, 0.12)}, ${alpha(colorScheme.main, 0.03)})`,
          }}
        >
          <Avatar
            variant="rounded"
            sx={{
              width: 50,
              height: 50,
              bgcolor: alpha(colorScheme.main, 0.15),
              color: colorScheme.main,
              borderRadius: '16px',
              boxShadow: `0 8px 16px ${alpha(colorScheme.main, 0.2)}`,
              border: `1px solid ${alpha(colorScheme.main, 0.2)}`,
              p: 1.5,
            }}
          >
            <DeviceIcon fontSize="large" />
          </Avatar>

          <Box sx={{ ml: 2, flexGrow: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: '1.1rem',
                lineHeight: 1.2,
                mb: 0.5
              }}
            >
              {device.name}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: alpha(theme.palette.text.primary, 0.7),
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '0.85rem',
              }}
            >
              <StorageIcon sx={{ fontSize: '0.95rem', opacity: 0.7 }} />
              {device.ip_address}
            </Typography>
          </Box>
        </Box>

        {/* Content section */}
        <CardContent
          sx={{
            flexGrow: 1,
            p: 3,
            '&:last-child': { pb: 3 },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Status chip */}
          <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              size="small"
              label={getDeviceTypeLabel()}
              sx={{
                borderRadius: '8px',
                bgcolor: alpha(colorScheme.main, 0.1),
                color: colorScheme.main,
                border: `1px solid ${alpha(colorScheme.main, 0.2)}`,
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
              icon={isStandard ? <StandardIcon sx={{ fontSize: '1rem !important' }} /> : <PluginIcon sx={{ fontSize: '1rem !important' }} />}
            />

            <Chip
              size="small"
              label={device.is_active ? t('devices:status.active') : t('devices:status.inactive')}
              sx={{
                borderRadius: '8px',
                bgcolor: alpha(device.is_active ? theme.palette.success.main : theme.palette.error.main, 0.1),
                color: device.is_active ? theme.palette.success.main : theme.palette.error.main,
                border: `1px solid ${alpha(device.is_active ? theme.palette.success.main : theme.palette.error.main, 0.2)}`,
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
              icon={device.is_active ?
                <OnlineIcon sx={{ fontSize: '1rem !important' }} /> :
                <OfflineIcon sx={{ fontSize: '1rem !important' }} />
              }
            />
          </Box>

          {/* Description */}
          {device.description && (
            <Typography
              variant="body2"
              sx={{
                color: alpha(theme.palette.text.primary, 0.7),
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                mb: 2,
                fontSize: '0.85rem',
                lineHeight: 1.6,
              }}
            >
              {device.description}
            </Typography>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Date added */}
          <Typography
            variant="caption"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: alpha(theme.palette.text.secondary, 0.8),
              fontSize: '0.75rem',
              mt: 2,
            }}
          >
            <TimeIcon fontSize="inherit" />
            {t('devices:added')}: {formatDistanceToNow(new Date(device.created_at), { addSuffix: true })}
          </Typography>
        </CardContent>

        <Divider sx={{ opacity: 0.1 }} />

        {/* Actions */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <ButtonBase
            onClick={handleCardClick}
            sx={{
              borderRadius: '12px',
              overflow: 'hidden',
              px: 2,
              py: 1,
              color: colorScheme.main,
              fontSize: '0.85rem',
              fontWeight: 600,
              bgcolor: alpha(colorScheme.main, 0.1),
              transition: 'all 0.2s',
              border: `1px solid ${alpha(colorScheme.main, 0.2)}`,
              '&:hover': {
                bgcolor: alpha(colorScheme.main, 0.15),
                transform: 'translateY(-2px)',
              },
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <ViewIcon fontSize="small" />
            {t('common:actions.view')}
          </ButtonBase>

          <Box>
            <Tooltip title={t('common:actions.edit')}>
              <IconButton
                size="small"
                onClick={handleEditClick}
                sx={{
                  color: theme.palette.info.main,
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  borderRadius: '8px',
                  mr: 1,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.info.main, 0.2),
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title={t('common:actions.delete')}>
              <IconButton
                size="small"
                onClick={handleDeleteClick}
                sx={{
                  color: theme.palette.error.main,
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                  borderRadius: '8px',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.error.main, 0.2),
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Card>
    </motion.div>
  );
};

export default DeviceCard;