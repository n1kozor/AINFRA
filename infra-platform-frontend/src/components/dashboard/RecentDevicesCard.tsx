import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha,
  Paper,
  Divider,
  Button,
  ButtonBase,
  Avatar,
  IconButton,
  Tooltip,
  Chip,
  Stack,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ComputerRounded as StandardIcon,
  SmartToyRounded as CustomIcon,
  ArrowForwardRounded as ArrowForwardIcon,
  StorageRounded as StorageIcon,
  AddRounded as AddIcon,
  VisibilityRounded as VisibilityIcon,
  RefreshRounded as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Device } from '../../types/device';

interface RecentDevicesCardProps {
  devices: Device[];
  onRefresh: () => void;
}

const RecentDevicesCard: React.FC<RecentDevicesCardProps> = ({ devices, onRefresh }) => {
  const theme = useTheme();
  const { t } = useTranslation(['dashboard', 'common']);
  const navigate = useNavigate();

  // Animation variants for list
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.85)})`,
        backdropFilter: 'blur(10px)',
        boxShadow: theme.palette.mode === 'dark'
          ? `0 8px 32px ${alpha(theme.palette.common.black, 0.25)}`
          : `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <StorageIcon sx={{ color: theme.palette.info.main }} />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {t('dashboard:recentDevices.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('dashboard:recentDevices.subtitle')}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Tooltip title={t('dashboard:refresh')} arrow>
            <IconButton
              onClick={onRefresh}
              size="small"
              sx={{
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1)
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button
            component={Link}
            to="/devices"
            size="small"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            sx={{
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            {t('dashboard:viewAll')}
          </Button>
        </Stack>
      </Box>

      {/* Device List */}
      <Box>
        {devices.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {devices.map((device, index) => (
              <motion.div key={device.id} variants={itemVariants}>
                <ButtonBase
                  component={Link}
                  to={`/devices/${device.id}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left',
                    py: 2,
                    px: 3,
                    transition: 'all 0.2s',
                    borderRadius: '0px',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.06),
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: alpha(
                        device.type === 'standard'
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                        0.1
                      ),
                      color: device.type === 'standard'
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main,
                      border: `1px solid ${alpha(
                        device.type === 'standard'
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                        0.2
                      )}`,
                    }}
                  >
                    {device.type === 'standard' ? <StandardIcon /> : <CustomIcon />}
                  </Avatar>

                  <Box sx={{ ml: 2, flexGrow: 1 }}>
                    <Typography
                      variant="subtitle1"
                      noWrap
                      sx={{
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {device.name}
                      {device.is_active ? (
                        <Box
                          component={motion.div}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: theme.palette.success.main,
                            ml: 1,
                            display: 'inline-block',
                            boxShadow: `0 0 0 3px ${alpha(theme.palette.success.main, 0.2)}`,
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: theme.palette.error.main,
                            ml: 1,
                            display: 'inline-block',
                          }}
                        />
                      )}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        noWrap
                        sx={{
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <StorageIcon sx={{ fontSize: 16, mr: 0.5, opacity: 0.6 }} />
                        {device.ip_address}
                      </Typography>

                      <Chip
                        size="small"
                        label={
                          device.type === 'standard'
                            ? t(`dashboard:osTypes.${device.standard_device?.os_type || 'unknown'}`)
                            : device.custom_device?.plugin_name || t('dashboard:deviceTypes.custom')
                        }
                        sx={{
                          height: 22,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          ml: 2,
                          bgcolor: alpha(
                            device.type === 'standard'
                              ? theme.palette.info.main
                              : theme.palette.secondary.main,
                            0.1
                          ),
                          color: device.type === 'standard'
                            ? theme.palette.info.main
                            : theme.palette.secondary.main,
                          border: `1px solid ${alpha(
                            device.type === 'standard'
                              ? theme.palette.info.main
                              : theme.palette.secondary.main,
                            0.2
                          )}`,
                        }}
                      />
                    </Box>
                  </Box>

                  <IconButton
                    color="primary"
                    size="small"
                    sx={{
                      borderRadius: '10px',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      }
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/devices/${device.id}`);
                    }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </ButtonBase>
                {index < devices.length - 1 && (
                  <Divider sx={{ opacity: 0.3 }} />
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <StandardIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />
            </Box>
            <Typography color="textSecondary" variant="subtitle1" fontWeight={500}>
              {t('dashboard:recentDevices.noDevices')}
            </Typography>
            <Typography color="textSecondary" sx={{ mt: 1, fontSize: '0.85rem' }}>
              {t('dashboard:recentDevices.addYourFirst')}
            </Typography>
            <Button
              component={Link}
              to="/devices/new"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{ mt: 3, borderRadius: '12px' }}
            >
              {t('dashboard:addDevice')}
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default RecentDevicesCard;