import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha,
  Divider,
  Button,
  ButtonBase,
  Avatar,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ComputerRounded as StandardIcon,
  SmartToyRounded as CustomIcon,
  ArrowForwardRounded as ArrowForwardIcon,
  StorageRounded as StorageIcon,
  HelpOutlineRounded as HelpIcon,
  AddRounded as AddIcon,
  VisibilityRounded as VisibilityIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Device } from '../../types/device';
import DashboardCard from './DashboardCard';

interface RecentDevicesCardProps {
  devices: Device[];
  onRefresh: () => void;
}

const RecentDevicesCard: React.FC<RecentDevicesCardProps> = ({ devices, onRefresh }) => {
  const theme = useTheme();
  const { t } = useTranslation(['dashboard', 'common']);
  const navigate = useNavigate();

  return (
    <DashboardCard
      title={t('dashboard:recentDevices.title')}
      subtitle={t('dashboard:recentDevices.subtitle')}
      icon={<StandardIcon />}
      color="primary"
      variant="glass"
      action={
        <Button
          component={Link}
          to="/devices"
          size="small"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          sx={{
            fontWeight: 600,
            borderRadius: '10px',
            px: 2,
          }}
        >
          {t('dashboard:viewAll')}
        </Button>
      }
      onRefresh={onRefresh}
    >
      <Box>
        {devices.length > 0 ? (
          devices.map((device, index) => (
            <React.Fragment key={device.id}>
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
                  borderRadius: '8px',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <Box>
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
                      boxShadow: `0 4px 12px ${alpha(
                        device.type === 'standard'
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                        0.15
                      )}`,
                    }}
                  >
                    {device.type === 'standard' ? <StandardIcon /> : <CustomIcon />}
                  </Avatar>
                </Box>

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
                      <Tooltip title={t('dashboard:deviceStatus.active')} arrow placement="top">
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
                      </Tooltip>
                    ) : (
                      <Tooltip title={t('dashboard:deviceStatus.inactive')} arrow placement="top">
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
                      </Tooltip>
                    )}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, flexWrap: 'wrap' }}>
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

                    <Box sx={{ display: 'flex', ml: 2, flexWrap: 'wrap' }}>
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
                          ml: { xs: 0, sm: 0 },
                          mt: { xs: 0.5, sm: 0 },
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ ml: 1 }}>
                  <IconButton
                    color="primary"
                    size="small"
                    sx={{
                      borderRadius: '10px',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
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
                </Box>
              </ButtonBase>
              {index < devices.length - 1 && (
                <Divider sx={{ opacity: 0.3 }} />
              )}
            </React.Fragment>
          ))
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
              <HelpIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />
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
    </DashboardCard>
  );
};

export default RecentDevicesCard;