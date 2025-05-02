import React, { useState, useEffect } from 'react';
import { Button, Grid, Snackbar, Alert as MuiAlert, useTheme } from '@mui/material';
import { AddCircleOutlined, SensorsOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import PageContainer from '../../components/common/PageContainer';
import SensorFilter from '../../components/sensorpage/SensorFilter';
import SensorTable from '../../components/sensorpage/SensorTable';
import AlertsList from '../../components/sensorpage/AlertsList';
import SensorFormDialog from '../../components/sensorpage/SensorFormDialog';
import ConfirmDialog from '../../components/sensorpage/ConfirmDialog';

import { useSensors } from '../../hooks/useSensors';
import { useDevices } from '../../hooks/useSensorDevices';
import { useAppContext } from '../../context/AppContext';
import { Sensor, SensorCreate, SensorUpdate } from '../../types/sensor';

const SensorsPage: React.FC = () => {
  const { t } = useTranslation(['sensors', 'common']);
  const { activeAlerts, resolveAlert, refreshAlerts } = useAppContext();
  const theme = useTheme();

  // State variables
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

  // Get data from hooks
  const { devices, loading: devicesLoading } = useDevices();
  const {
    sensors,
    loading: sensorsLoading,
    createSensor,
    updateSensor,
    deleteSensor,
    refreshSensors,
  } = useSensors(selectedDeviceId || undefined);

  // Filter standard devices only
  const standardDevices = devices?.filter(device => device.type === 'standard') || [];

  // Function to find device name by id
  const getDeviceName = (deviceId: number) => {
    const device = devices?.find(d => d.id === deviceId);
    return device ? device.name : t('common:unknown');
  };

  // Handle device filter change
  const handleDeviceChange = (deviceId: number | null) => {
    setSelectedDeviceId(deviceId);
  };

  // Open create dialog
  const handleOpenCreateDialog = () => {
    setDialogMode('create');
    setSelectedSensor(null);
    setOpenDialog(true);
  };

  // Open edit dialog
  const handleOpenEditDialog = (sensor: Sensor) => {
    setDialogMode('edit');
    setSelectedSensor(sensor);
    setOpenDialog(true);
  };

  // Open delete dialog
  const handleOpenDeleteDialog = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setOpenDeleteDialog(true);
  };

  // Handle form submit
  const handleSubmit = async (formData: SensorCreate) => {
    try {
      if (dialogMode === 'create') {
        await createSensor(formData);
        setSnackbar({
          open: true,
          message: t('sensors:sensorCreated'),
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
          message: t('sensors:sensorUpdated'),
          severity: 'success'
        });
      }
      setOpenDialog(false);
      refreshSensors();
    } catch (error) {
      console.error('Error submitting sensor:', error);
      setSnackbar({
        open: true,
        message: t('sensors:errorOccurred'),
        severity: 'error'
      });
    }
  };

  // Handle delete sensor
  const handleDeleteSensor = async () => {
    if (selectedSensor) {
      try {
        await deleteSensor(selectedSensor.id);
        setOpenDeleteDialog(false);
        setSnackbar({
          open: true,
          message: t('sensors:sensorDeleted'),
          severity: 'success'
        });
        refreshSensors();
      } catch (error) {
        console.error('Error deleting sensor:', error);
        setSnackbar({
          open: true,
          message: t('sensors:errorOccurred'),
          severity: 'error'
        });
      }
    }
  };

  // Handle resolve alert - now using the global context
  const handleResolveAlert = async (alertId: number) => {
    try {
      const success = await resolveAlert(alertId);
      if (success) {
        setSnackbar({
          open: true,
          message: t('sensors:alertResolved'),
          severity: 'success'
        });
      } else {
        throw new Error('Failed to resolve alert');
      }
    } catch (error) {
      console.error('Error resolving alert:', error);
      setSnackbar({
        open: true,
        message: t('sensors:errorOccurred'),
        severity: 'error'
      });
    }
  };

  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Refresh data when component mounts
  useEffect(() => {
    refreshSensors();
    refreshAlerts();
  }, []);

  return (
    <PageContainer
      title={t('sensors:title')}
      subtitle={t('sensors:subtitle')}
      icon={<SensorsOutlined sx={{ fontSize: 28 }} />}
      breadcrumbs={[
        { text: t('common:home'), link: '/' },
        { text: t('sensors:title') }
      ]}
      actions={
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlined />}
          onClick={handleOpenCreateDialog}
        >
          {t('sensors:addSensor')}
        </Button>
      }
    >
      <Grid container spacing={3}>
        {/* Top Section */}
        <Grid item xs={12}>
          <SensorFilter
            devices={standardDevices}
            selectedDeviceId={selectedDeviceId}
            onDeviceChange={handleDeviceChange}
          />
        </Grid>

        {/* Main content layout */}
        <Grid item xs={12} container spacing={3}>
          {/* Sensors Table */}
          <Grid item xs={12} lg={8}>
            <SensorTable
              sensors={sensors.filter(sensor => selectedDeviceId ? sensor.device_id === selectedDeviceId : true)}
              loading={sensorsLoading}
              onEdit={handleOpenEditDialog}
              onDelete={handleOpenDeleteDialog}
              getDeviceName={getDeviceName}
            />
          </Grid>

          {/* Alerts List */}
          <Grid item xs={12} lg={4} sx={{ display: 'flex' }}>
            <AlertsList
              alerts={activeAlerts}
              sensors={sensors}
              onResolve={handleResolveAlert}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Dialogs */}
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
        title={t('sensors:deleteConfirmation')}
        content={t('sensors:confirmDelete')}
        warning={t('sensors:deleteWarning')}
        onConfirm={handleDeleteSensor}
        onCancel={() => setOpenDeleteDialog(false)}
        confirmButtonText="delete"
        confirmButtonColor="error"
      />

      {/* Snackbar for notifications */}
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