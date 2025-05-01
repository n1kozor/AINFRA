import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api';
import PageContainer from '../../components/common/PageContainer';
import DeviceCard from '../../components/devices/DeviceCard';
import StandardDeviceModal from '../../components/devices/StandardDeviceModal';
import CustomDeviceModal from '../../components/devices/CustomDeviceModal';
import {
  Box,
  Typography,
  CircularProgress,
  alpha,
  useTheme,
  Button,
  Grid,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Avatar
} from '@mui/material';
import {
  DevicesRounded as DevicesIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Computer as StandardDeviceIcon,
  SmartToy as CustomDeviceIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { DeviceType } from '../../types/device';

const DevicesPage = () => {
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();

  // Modals
  const [standardModalOpen, setStandardModalOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [addMenuAnchorEl, setAddMenuAnchorEl] = useState<null | HTMLElement>(null);

  // Data fetching
  const {
    data: devices,
    isLoading,
    error,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['devices'],
    queryFn: api.devices.getAll,
    refetchOnWindowFocus: false,
  });

  // Event handlers
  const handleAddClick = (event: React.MouseEvent<HTMLElement>) => {
    setAddMenuAnchorEl(event.currentTarget);
  };

  const handleAddMenuClose = () => {
    setAddMenuAnchorEl(null);
  };

  const handleAddStandardDevice = () => {
    setStandardModalOpen(true);
    handleAddMenuClose();
  };

  const handleAddCustomDevice = () => {
    setCustomModalOpen(true);
    handleAddMenuClose();
  };

  // If there's an error loading devices
  if (error) {
    return (
      <PageContainer
        title={t('devices:allDevices')}
        breadcrumbs={[
          { text: t('common:navigation.dashboard'), link: '/' },
          { text: t('common:navigation.devices') },
        ]}
        icon={<DevicesIcon />}
      >
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: '24px',
            bgcolor: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(20px)',
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography color="error" variant="h5" fontWeight={700} gutterBottom>
              {t('devices:errorFetchingDevices')}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {t('devices:errorFetchDescription')}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => refetch()}
              startIcon={<DevicesIcon />}
              sx={{ borderRadius: '12px', fontWeight: 600 }}
            >
              {t('common:actions.retry')}
            </Button>
          </Box>
        </Paper>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={t('devices:allDevices')}
      subtitle={
        devices
          ? t('devices:deviceCount', { count: devices.length })
          : t('devices:loadingDevices')
      }
      breadcrumbs={[
        { text: t('common:navigation.dashboard'), link: '/' },
        { text: t('common:navigation.devices') },
      ]}
      icon={<DevicesIcon />}
      actions={
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddClick}
          startIcon={<AddIcon />}
          sx={{
            borderRadius: '12px',
            fontWeight: 600,
          }}
        >
          {t('devices:addDevice')}
        </Button>
      }
    >
      {/* Main content container */}
      <Box sx={{ position: 'relative', overflow: 'visible' }}>
        {/* Devices display */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 8,
              }}
            >
              <CircularProgress size={48} />
            </Box>
          ) : (
            <>
              {devices && devices.length > 0 ? (
                <Grid container spacing={4} sx={{ mt: 1, overflow: 'visible' }}>
                  {devices.map((device) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      key={device.id}
                      sx={{ overflow: 'visible' }} // Important to prevent clipping
                    >
                      <DeviceCard device={device} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <NoDevicesFound onAddDevice={handleAddClick} />
              )}
            </>
          )}
        </AnimatePresence>
      </Box>

      {/* Add device menu */}
      <Menu
        anchorEl={addMenuAnchorEl}
        open={Boolean(addMenuAnchorEl)}
        onClose={handleAddMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            borderRadius: '12px',
            minWidth: '220px',
          }
        }}
      >
        <MenuItem onClick={handleAddStandardDevice} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <StandardDeviceIcon sx={{ color: theme.palette.primary.main }} />
          </ListItemIcon>
          <ListItemText
            primary={t('devices:deviceTypes.standard')}
            secondary={t('devices:standardDeviceDescription')}
            primaryTypographyProps={{ fontWeight: 600 }}
            secondaryTypographyProps={{ fontSize: '0.75rem' }}
          />
        </MenuItem>
        <MenuItem onClick={handleAddCustomDevice} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <CustomDeviceIcon sx={{ color: theme.palette.secondary.main }} />
          </ListItemIcon>
          <ListItemText
            primary={t('devices:deviceTypes.custom')}
            secondary={t('devices:customDeviceDescription')}
            primaryTypographyProps={{ fontWeight: 600 }}
            secondaryTypographyProps={{ fontSize: '0.75rem' }}
          />
        </MenuItem>
      </Menu>

      {/* Modals for adding devices */}
      <StandardDeviceModal
        open={standardModalOpen}
        onClose={() => setStandardModalOpen(false)}
        onSuccess={() => {
          setStandardModalOpen(false);
          refetch();
        }}
      />

      <CustomDeviceModal
        open={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        onSuccess={() => {
          setCustomModalOpen(false);
          refetch();
        }}
      />
    </PageContainer>
  );
};

// No devices found component
const NoDevicesFound = ({ onAddDevice }: { onAddDevice: (event: React.MouseEvent<HTMLElement>) => void }) => {
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        textAlign: 'center',
        borderRadius: '16px',
        bgcolor: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: alpha(theme.palette.warning.main, 0.1),
            color: theme.palette.warning.main,
            mx: 'auto',
            mb: 2
          }}
        >
          <WarningIcon fontSize="large" />
        </Avatar>
        <Typography variant="h6" fontWeight={700}>
          {t('devices:noDevicesYet')}
        </Typography>
        <Typography sx={{ mt: 1 }} color="text.secondary">
          {t('devices:addYourFirstDevice')}
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={onAddDevice}
        startIcon={<AddIcon />}
        sx={{ borderRadius: '12px' }}
      >
        {t('devices:addFirstDevice')}
      </Button>
    </Paper>
  );
};

export default DevicesPage;