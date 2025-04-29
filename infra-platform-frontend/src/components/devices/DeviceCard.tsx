import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
  alpha,
  Avatar,
  Divider,
  ButtonBase,
  Skeleton,
} from '@mui/material';
import {
  ComputerRounded as StandardIcon,
  SmartToyRounded as CustomIcon,
  VisibilityRounded as ViewIcon,
  CheckCircleRounded as OnlineIcon,
  ErrorRounded as OfflineIcon,
  StorageRounded as StorageIcon,
  ExtensionRounded as PluginIcon,
  LaptopMacRounded as MacOSIcon,
  LaptopWindowsRounded as WindowsIcon,
  LaptopRounded as LinuxIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Device } from '../../types/device';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { availabilityApi } from '../../api/availability';

interface DeviceCardProps {
  device: Device;
}

/**
 * DeviceCard component displays a device as a card
 * Shows real-time availability status by checking the device every 5 seconds
 * All cards have consistent dimensions
 */
const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  const { t } = useTranslation(['devices', 'common']);
  const navigate = useNavigate();
  const theme = useTheme();
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isStandard = device.type === 'standard';

  // Select the appropriate icon based on device type and OS
  const getDeviceIcon = () => {
    if (isStandard && device.standard_device) {
      const osType = device.standard_device.os_type;
      if (osType === 'windows') return WindowsIcon;
      if (osType === 'macos') return MacOSIcon;
      if (osType === 'linux') return LinuxIcon;
    }
    return isStandard ? StandardIcon : CustomIcon;
  };

  const DeviceIcon = getDeviceIcon();

  // Get device type label for display
  const getDeviceTypeLabel = () => {
    if (isStandard && device.standard_device) {
      return t(`devices:osTypes.${device.standard_device.os_type}`);
    } else if (!isStandard && device.custom_device) {
      return device.custom_device.plugin_name;
    } else {
      return isStandard ? t('devices:deviceTypes.standard') : t('devices:deviceTypes.custom');
    }
  };

  // Navigate to device details
  const handleCardClick = () => {
    navigate(`/devices/${device.id}`);
  };

  // Check device availability every 5 seconds
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkAvailability = async () => {
      setIsLoading(true);
      try {
        const result = await availabilityApi.checkDevice(device.id);
        setIsAvailable(result.is_available);
      } catch (error) {
        setIsAvailable(false);
        console.error(`Failed to check availability for device ${device.id}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    // Check immediately on mount
    checkAvailability();

    // Set up interval for regular checks
    intervalId = setInterval(checkAvailability, 5000);

    // Clean up interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [device.id]);

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

  // Common card styles with fixed dimensions
  const cardStyles = {
    height: 340, // Fixed height for all cards
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '20px',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundImage: 'none',
    position: 'relative',
  };

  // Render loading skeleton when availability status is being checked
  if (isLoading && isAvailable === null) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          elevation={0}
          sx={{
            ...cardStyles,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            p: 3,
          }}
        >
          <Box sx={{ display: 'flex', mb: 2 }}>
            <Skeleton variant="rounded" width={50} height={50} sx={{ borderRadius: '16px' }} />
            <Box sx={{ ml: 2, width: '100%' }}>
              <Skeleton variant="text" width="70%" height={30} />
              <Skeleton variant="text" width="40%" height={20} />
            </Box>
          </Box>
          <Skeleton variant="rounded" width="40%" height={30} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
          <Box sx={{ flexGrow: 1 }} />
          <Skeleton variant="text" width="60%" height={16} sx={{ mt: 2 }} />
          <Divider sx={{ my: 2, opacity: 0.1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Skeleton variant="rounded" width={120} height={36} />
          </Box>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        elevation={0}
        sx={{
          ...cardStyles,
          border: `1px solid ${alpha(colorScheme.main, 0.15)}`,
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 8px 25px ${alpha(colorScheme.main, 0.2)}`,
            borderColor: alpha(colorScheme.main, 0.3),
          },
        }}
      >
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
                mb: 0.5,
                // Limit to 1 line with ellipsis
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
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
                // Limit to 1 line with ellipsis
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <StorageIcon sx={{ fontSize: '0.95rem', opacity: 0.7, flexShrink: 0 }} />
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
            {/* Device type chip */}
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
              icon={isStandard ? <DeviceIcon sx={{ fontSize: '1rem !important' }} /> : <PluginIcon sx={{ fontSize: '1rem !important' }} />}
            />

            {/* Availability status chip */}
            {isLoading ? (
              <Skeleton variant="rounded" width={100} height={24} sx={{ borderRadius: '8px' }} />
            ) : (
              <Chip
                size="small"
                label={isAvailable ? t('devices:status.online') : t('devices:status.offline')}
                sx={{
                  borderRadius: '8px',
                  bgcolor: alpha(isAvailable ? theme.palette.success.main : theme.palette.error.main, 0.1),
                  color: isAvailable ? theme.palette.success.main : theme.palette.error.main,
                  border: `1px solid ${alpha(isAvailable ? theme.palette.success.main : theme.palette.error.main, 0.2)}`,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
                icon={isAvailable ?
                  <OnlineIcon sx={{ fontSize: '1rem !important' }} /> :
                  <OfflineIcon sx={{ fontSize: '1rem !important' }} />
                }
              />
            )}
          </Box>

          {/* Description - limited to 2 lines */}
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
                maxHeight: '40px', // Approximately 2 lines
                mb: 2,
                fontSize: '0.85rem',
                lineHeight: 1.6,
              }}
            >
              {device.description}
            </Typography>
          )}

          {/* Plugin information for custom devices */}
          {!isStandard && device.custom_device && (
            <Typography
              variant="body2"
              sx={{
                color: alpha(theme.palette.text.secondary, 0.8),
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '0.85rem',
                mb: 1,
                // Limit to 1 line with ellipsis
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <PluginIcon fontSize="small" sx={{ flexShrink: 0 }} />
              {t('devices:pluginConnection')}: {device.custom_device.plugin_name}
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
            {t('devices:added')}: {formatDistanceToNow(new Date(device.created_at), { addSuffix: true })}
          </Typography>
        </CardContent>

        <Divider sx={{ opacity: 0.1 }} />

        {/* Actions - only View button */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
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
        </Box>
      </Card>
    </motion.div>
  );
};

export default DeviceCard;