import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Typography,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Computer as StandardIcon,
  SmartToy as CustomIcon,
  PowerSettingsNew as PowerIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import PageContainer from '../../components/common/PageContainer';
import StandardDeviceDetails from '../../components/devices/DeviceDetails/StandardDeviceDetails';
import CustomDeviceDetails from '../../components/devices/DeviceDetails/CustomDeviceDetails';
import { format } from 'date-fns';

const DeviceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const deviceId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch device data
  const { data: device, isLoading, error } = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => api.devices.getById(deviceId),
    enabled: !!deviceId,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.devices.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      navigate('/devices');
    },
  });

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(deviceId);
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <PageContainer title={t('devices:loading')}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (error || !device) {
    return (
      <PageContainer title={t('devices:error')}>
        <Box sx={{ p: 3, bgcolor: alpha(theme.palette.error.main, 0.1), borderRadius: 1 }}>
          <Typography color="error">
            {t('devices:deviceNotFound')}
          </Typography>
          <Button
            component={Link}
            to="/devices"
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            {t('common:actions.back')}
          </Button>
        </Box>
      </PageContainer>
    );
  }

  const isStandard = device.type === 'standard';
  const DeviceIcon = isStandard ? StandardIcon : CustomIcon;

  return (
    <PageContainer
      title={device.name}
      breadcrumbs={[
        { text: t('common:navigation.dashboard'), link: '/' },
        { text: t('common:navigation.devices'), link: '/devices' },
        {
          text: isStandard
            ? t('common:navigation.standardDevices')
            : t('common:navigation.customDevices'),
          link: isStandard ? '/devices/standard' : '/devices/custom',
        },
        { text: device.name },
      ]}
      actions={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            component={Link}
            to={`/devices/${deviceId}/edit`}
          >
            {t('common:actions.edit')}
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
          >
            {t('common:actions.delete')}
          </Button>
        </Box>
      }
    >
      <Grid container spacing={3}>
        {/* Device Info */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: theme.shape.borderRadius,
              boxShadow: theme.shadows[1],
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 0 } }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: alpha(
                      isStandard
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main,
                      0.1
                    ),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    color: isStandard
                      ? theme.palette.primary.main
                      : theme.palette.secondary.main,
                  }}
                >
                  <DeviceIcon fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="h5">{device.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {device.ip_address}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={
                    isStandard
                      ? t('devices:deviceTypes.standard')
                      : t('devices:deviceTypes.custom')
                  }
                  color={isStandard ? 'primary' : 'secondary'}
                />
                <Chip
                  icon={<PowerIcon />}
                  label={
                    device.is_active
                      ? t('devices:status.active')
                      : t('devices:status.inactive')
                  }
                  color={device.is_active ? 'success' : 'error'}
                  variant="outlined"
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('devices:description')}
                </Typography>
                <Typography>
                  {device.description || t('devices:noDescription')}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('devices:details')}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  {isStandard && device.standard_device ? (
                    <>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {t('devices:osType')}
                        </Typography>
                        <Typography>
                          {t(`devices:osTypes.${device.standard_device.os_type}`)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {t('devices:hostname')}
                        </Typography>
                        <Typography>{device.standard_device.hostname}</Typography>
                      </Box>
                    </>
                  ) : (
                    device.custom_device && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {t('devices:plugin')}
                        </Typography>
                        <Typography>{device.custom_device.plugin_name}</Typography>
                      </Box>
                    )
                  )}
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('devices:added')}
                    </Typography>
                    <Typography>
                      {format(new Date(device.created_at), 'PPP')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('devices:lastUpdated')}
                    </Typography>
                    <Typography>
                      {format(new Date(device.updated_at), 'PPP')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Device Type Specific Details */}
        <Grid item xs={12}>
          {isStandard ? (
            <StandardDeviceDetails device={device} />
          ) : (
            <CustomDeviceDetails device={device} />
          )}
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          {t('devices:deleteDevice.title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {t('devices:deleteDevice.confirmation', { name: device.name })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            {t('common:actions.cancel')}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            startIcon={
              deleteMutation.isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <DeleteIcon />
              )
            }
            disabled={deleteMutation.isPending}
          >
            {t('common:actions.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default DeviceDetails;