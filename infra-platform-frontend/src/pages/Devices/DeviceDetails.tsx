import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Typography,
  Grid,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  alpha,
  Tooltip,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Computer as StandardIcon,
  SmartToy as CustomIcon,
  PowerSettingsNew as PowerIcon,
  Refresh as RefreshIcon,
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
  const { id } = useParams();
  const deviceId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch device data
  const { data: device, isLoading, error, refetch } = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => api.devices.getById(deviceId),
    enabled: !!deviceId,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.devices.delete(id),
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh'
          }}
        >
          <CircularProgress size={36} />
        </Box>
      </PageContainer>
    );
  }

  if (error || !device) {
    return (
      <PageContainer title={t('devices:error')}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" color="error.main" gutterBottom>
            {t('devices:deviceNotFound')}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error instanceof Error ? error.message : t('devices:errors.deviceMayHaveBeenRemoved')}
          </Typography>

          <Button
            component={Link}
            to="/devices"
            startIcon={<ArrowBackIcon />}
            variant="contained"
          >
            {t('common:actions.back')}
          </Button>
        </Paper>
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
          <Tooltip title={t('common:actions.refresh')}>
            <IconButton onClick={() => refetch()} color="default">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
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
      {/* Device Header Section */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isStandard
                  ? alpha(theme.palette.primary.main, 0.1)
                  : alpha(theme.palette.secondary.main, 0.1),
              }}
            >
              <DeviceIcon
                sx={{
                  fontSize: 32,
                  color: isStandard ? theme.palette.primary.main : theme.palette.secondary.main
                }}
              />
            </Box>
          </Grid>

          <Grid item xs>
            <Typography variant="h5" fontWeight={600}>
              {device.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {device.ip_address}
            </Typography>
          </Grid>

          <Grid item>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={isStandard
                  ? t('devices:deviceTypes.standard')
                  : t('devices:deviceTypes.custom')
                }
                color={isStandard ? 'primary' : 'secondary'}
                size="small"
              />
              <Chip
                icon={<PowerIcon fontSize="small" />}
                label={device.is_active
                  ? t('devices:status.active')
                  : t('devices:status.inactive')
                }
                color={device.is_active ? 'success' : 'error'}
                size="small"
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t('devices:description')}
            </Typography>
            <Typography variant="body2">
              {device.description || t('devices:noDescription')}
            </Typography>
          </Grid>

          <Grid item xs={12} md={5}>
            <Grid container spacing={2}>
              {isStandard && device.standard_device ? (
                <>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {t('devices:osType')}
                    </Typography>
                    <Typography variant="body2">
                      {t(`devices:osTypes.${device.standard_device.os_type}`)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {t('devices:hostname')}
                    </Typography>
                    <Typography variant="body2">
                      {device.standard_device.hostname}
                    </Typography>
                  </Grid>
                </>
              ) : device.custom_device && (
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {t('devices:plugin')}
                  </Typography>
                  <Typography variant="body2">
                    {device.custom_device.plugin_name}
                  </Typography>
                </Grid>
              )}

              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('devices:created')}
                </Typography>
                <Typography variant="body2">
                  {format(new Date(device.created_at), 'PPP')}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('devices:lastUpdated')}
                </Typography>
                <Typography variant="body2">
                  {format(new Date(device.updated_at), 'PPP')}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Device Specific Details */}
      {isStandard ? (
        <StandardDeviceDetails device={device} />
      ) : (
        <CustomDeviceDetails device={device} />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>
          {t('devices:deleteDevice.title')}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {t('devices:deleteDevice.confirmation', { name: device.name })}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
            color="inherit"
          >
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