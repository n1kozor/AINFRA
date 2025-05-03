import React, { useState, useEffect } from 'react';
import { Button, Snackbar, Alert as MuiAlert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { AddCircleOutlined, SensorsOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

import PageContainer from '../../components/common/PageContainer';
import SensorFilter from '../../components/SensorPage/SensorFilter';
import SensorTable from '../../components/SensorPage/SensorTable';
import AlertsList from '../../components/SensorPage/AlertsList';
import SensorFormDialog from '../../components/SensorPage/SensorFormDialog';
import ConfirmDialog from '../../components/SensorPage/ConfirmDialog';

import { useSensors } from '../../hooks/useSensors';
import { useDevices } from '../../hooks/useSensorDevices';
import { useAppContext } from '../../context/AppContext';
import { Sensor, SensorCreate, SensorUpdate } from '../../types/sensor';

const SensorsPage: React.FC = () => {
  // Use translation from translation namespace as fallback
  const { t } = useTranslation(['translation', 'common']);
  useTheme();
  const { activeAlerts, resolveAlert, refreshAlerts } = useAppContext();

  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: 'success' | 'error'}>({
    open: false,
    message: '',
    severity: 'success'
  });

  const { devices} = useDevices();
  const {
    sensors,
    loading: sensorsLoading,
    createSensor,
    updateSensor,
    deleteSensor,
    refreshSensors,
  } = useSensors(selectedDeviceId || undefined);

  const standardDevices = devices?.filter(device => device.type === 'standard') || [];

  const getDeviceName = (deviceId: number) => {
    const device = devices?.find(d => d.id === deviceId);
    return device ? device.name : t('common:unknown');
  };

  const handleDeviceChange = (deviceId: number | null) => {
    setSelectedDeviceId(deviceId);
  };

  const handleOpenCreateDialog = () => {
    setDialogMode('create');
    setSelectedSensor(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (sensor: Sensor) => {
    setDialogMode('edit');
    setSelectedSensor(sensor);
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setOpenDeleteDialog(true);
  };

  const handleSubmit = async (formData: SensorCreate) => {
    try {
      if (dialogMode === 'create') {
        await createSensor(formData);
        setSnackbar({
          open: true,
          message: t('sensors.sensorCreated'),
          severity: 'success'
        });
      } else if (selectedSensor) {
        const updateData: SensorUpdate = {
          name: formData.name,
          description: formData.description,
          metric_key: formData.metric_key,
          alert_condition: formData.alert_condition,
          alert_level: formData.alert_level
        };
        await updateSensor(selectedSensor.id, updateData);
        setSnackbar({
          open: true,
          message: t('sensors.sensorUpdated'),
          severity: 'success'
        });
      }
      setOpenDialog(false);
      await refreshSensors();
    } catch (error) {
      console.error('Error submitting sensor:', error);
      setSnackbar({
        open: true,
        message: t('sensors.errorOccurred'),
        severity: 'error'
      });
    }
  };

  const handleDeleteSensor = async () => {
    if (selectedSensor) {
      try {
        await deleteSensor(selectedSensor.id);
        setOpenDeleteDialog(false);
        setSnackbar({
          open: true,
          message: t('sensors.sensorDeleted'),
          severity: 'success'
        });
        await refreshSensors();
      } catch (error) {
        console.error('Error deleting sensor:', error);
        setSnackbar({
          open: true,
          message: t('sensors.errorOccurred'),
          severity: 'error'
        });
      }
    }
  };

  const handleResolveAlert = async (alertId: number) => {
    try {
      const success = await resolveAlert(alertId);
      if (success) {
        setSnackbar({
          open: true,
          message: t('sensors.alertResolved'),
          severity: 'success'
        });
        await refreshAlerts();
      } else {
        setSnackbar({
          open: true,
          message: t('sensors.errorOccurred'),
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error resolving alert:', error);
      setSnackbar({
        open: true,
        message: t('sensors.errorOccurred'),
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    refreshSensors();
    refreshAlerts();
  }, []);

  return (
      <PageContainer
          title={t('sensors.title')}
          subtitle={t('sensors.subtitle')}
          icon={<SensorsOutlined sx={{ fontSize: 28 }} />}
          breadcrumbs={[
            { text: t('dashboard.title'), link: '/' },
            { text: t('sensors.title') }
          ]}
          actions={
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutlined />}
                onClick={handleOpenCreateDialog}
            >
              {t('sensors.addSensor')}
            </Button>
          }
      >
        <Grid container spacing={3}>
          <SensorFilter
              devices={standardDevices}
              selectedDeviceId={selectedDeviceId}
              onDeviceChange={handleDeviceChange}
          />
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <SensorTable
              sensors={sensors.filter(sensor => selectedDeviceId ? sensor.device_id === selectedDeviceId : true)}
              loading={sensorsLoading}
              onEdit={handleOpenEditDialog}
              onDelete={handleOpenDeleteDialog}
              getDeviceName={getDeviceName}
          />

          <AlertsList
              alerts={activeAlerts}
              sensors={sensors}
              onResolve={handleResolveAlert}
          />
        </Grid>

        <SensorFormDialog
            open={openDialog}
            mode={dialogMode}
            sensor={selectedSensor}
            devices={standardDevices}
            onClose={() => setOpenDialog(false)}
            onSubmit={handleSubmit}
        />

        <ConfirmDialog
            open={openDeleteDialog}
            title={t('sensors.deleteConfirmation')}
            content={t('sensors.confirmDelete')}
            warning={t('sensors.deleteWarning')}
            onConfirm={handleDeleteSensor}
            onCancel={() => setOpenDeleteDialog(false)}
            confirmButtonText="delete"
            confirmButtonColor="error"
        />

        <Snackbar
            open={snackbar.open}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <MuiAlert
              elevation={6}
              variant="filled"
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
          >
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </PageContainer>
  );
};

export default SensorsPage;