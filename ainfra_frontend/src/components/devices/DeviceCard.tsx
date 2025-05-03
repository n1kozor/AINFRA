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
    IconButton,
    Tooltip,
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
    ChatRounded as ChatIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Device } from '../../types/device';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { availabilityApi } from '../../api/availability';
import DeviceChatModal from '../chat/DeviceChatModal';

interface DeviceCardProps {
    device: Device;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const theme = useTheme();
    const [isAvailable, setIsAvailable] = useState<boolean>(false);
    const [chatOpen, setChatOpen] = useState<boolean>(false);

    const isStandard = device.type === 'standard';

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

    const getDeviceTypeLabel = () => {
        if (isStandard && device.standard_device) {
            return t(`devices.osTypes.${device.standard_device.os_type}`);
        } else if (!isStandard && device.custom_device) {
            return device.custom_device.plugin_name;
        } else {
            return isStandard ? t('devices.deviceTypes.standard') : t('devices.deviceTypes.custom');
        }
    };

    const handleCardClick = () => {
        navigate(`/devices/${device.id}`);
    };

    const handleChatClick = (e: React.MouseEvent) => {
        if (!isAvailable) return;
        e.stopPropagation();
        setChatOpen(true);
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const checkAvailability = async () => {
            try {
                const result = await availabilityApi.checkDevice(device.id);
                setIsAvailable(result.is_available);
            } catch (error) {
                setIsAvailable(false);
                console.error(`Failed to check availability for device ${device.id}:`, error);
            }
        };

        checkAvailability();

        intervalId = setInterval(checkAvailability, 5000);

        return () => {
            clearInterval(intervalId);
        };
    }, [device.id]);

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
            style={{
                position: 'relative',
                margin: '8px',
                transformStyle: 'preserve-3d'
            }}
        >
            <motion.div
                whileHover={{
                    y: -5,
                    transition: { duration: 0.3, ease: 'easeOut' }
                }}
                style={{
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    transform: 'translate3d(0,0,0)'
                }}
            >
                <Tooltip
                    title={isAvailable ? t('devices.actions.chat') : t('devices.errors.deviceOffline')}
                    arrow
                    placement="top"
                >
                    <div style={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        zIndex: 20,
                        transform: 'translate3d(0,0,10px)'
                    }}>
                        <IconButton
                            onClick={handleChatClick}
                            size="small"
                            aria-label="Chat with device"
                            disabled={!isAvailable}
                            sx={{
                                backgroundColor: isAvailable
                                    ? alpha(colorScheme.main, 0.9)
                                    : alpha(theme.palette.grey[500], 0.4),
                                color: isAvailable ? '#fff' : alpha('#fff', 0.5),
                                width: 40,
                                height: 40,
                                boxShadow: isAvailable
                                    ? `0 4px 12px ${alpha(colorScheme.main, 0.4)}`
                                    : 'none',
                                border: `2px solid ${theme.palette.background.default}`,
                                transition: 'all 0.2s',
                                opacity: isAvailable ? 1 : 0.6,
                                '&:hover': isAvailable ? {
                                    backgroundColor: colorScheme.main,
                                    transform: 'scale(1.1)',
                                } : {},
                                '&.Mui-disabled': {
                                    backgroundColor: alpha(theme.palette.grey[500], 0.4),
                                    color: alpha('#fff', 0.5),
                                }
                            }}
                        >
                            <ChatIcon fontSize="small" />
                        </IconButton>
                    </div>
                </Tooltip>

                <Card
                    elevation={0}
                    sx={{
                        height: 360,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: `1px solid ${alpha(colorScheme.main, 0.15)}`,
                        '&:hover': {
                            boxShadow: `0 8px 25px ${alpha(colorScheme.main, 0.2)}`,
                            borderColor: alpha(colorScheme.main, 0.3),
                        },
                        position: 'relative',
                        transform: 'translate3d(0,0,0)'
                    }}
                >
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

                    <CardContent
                        sx={{
                            flexGrow: 1,
                            p: 3,
                            pt: 2,
                            pb: 1,
                            '&:last-child': { pb: 2 },
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
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
                                icon={isStandard ? <DeviceIcon sx={{ fontSize: '1rem !important' }} /> : <PluginIcon sx={{ fontSize: '1rem !important' }} />}
                            />

                            <Chip
                                size="small"
                                label={isAvailable ? t('devices.status.online') : t('devices.status.offline')}
                                sx={{
                                    borderRadius: '8px',
                                    minWidth: 90,
                                    bgcolor: alpha(isAvailable ? theme.palette.success.main : theme.palette.error.main, 0.1),
                                    color: isAvailable ? theme.palette.success.main : theme.palette.error.main,
                                    border: `1px solid ${alpha(isAvailable ? theme.palette.success.main : theme.palette.error.main, 0.2)}`,
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease',
                                }}
                                icon={isAvailable ?
                                    <OnlineIcon sx={{ fontSize: '1rem !important' }} /> :
                                    <OfflineIcon sx={{ fontSize: '1rem !important' }} />
                                }
                            />
                        </Box>

                        <Box sx={{ minHeight: 45, mb: 1 }}>
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
                                        fontSize: '0.85rem',
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {device.description}
                                </Typography>
                            )}
                        </Box>

                        <Box sx={{ minHeight: 28, mb: 1 }}>
                            {!isStandard && device.custom_device && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: alpha(theme.palette.text.secondary, 0.8),
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        fontSize: '0.85rem',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <PluginIcon fontSize="small" sx={{ flexShrink: 0 }} />
                                    {t('devices.pluginConnection')}: {device.custom_device.plugin_name}
                                </Typography>
                            )}
                        </Box>

                        <Box sx={{ flexGrow: 1 }} />

                        <Typography
                            variant="caption"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                color: alpha(theme.palette.text.secondary, 0.8),
                                fontSize: '0.75rem',
                            }}
                        >
                            {t('devices.added')}: {formatDistanceToNow(new Date(device.created_at), { addSuffix: true })}
                        </Typography>
                    </CardContent>

                    <Divider sx={{ opacity: 0.1 }} />

                    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                        <ButtonBase
                            onClick={handleCardClick}
                            sx={{
                                borderRadius: '12px',
                                overflow: 'hidden',
                                width: '100%',
                                px: 2,
                                py: 1.5,
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
                                justifyContent: 'center',
                                gap: 0.5,
                            }}
                        >
                            <ViewIcon fontSize="small" />
                            {t('common.actions.view')}
                        </ButtonBase>
                    </Box>
                </Card>
            </motion.div>

            {isAvailable && (
                <DeviceChatModal
                    open={chatOpen}
                    onClose={() => setChatOpen(false)}
                    deviceId={device.id.toString()}
                    deviceName={device.name}
                    deviceType={device.type}
                    colorScheme={colorScheme}
                />
            )}
        </motion.div>
    );
};

export default DeviceCard;