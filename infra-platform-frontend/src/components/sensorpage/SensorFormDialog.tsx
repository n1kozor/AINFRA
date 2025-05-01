// src/components/sensorpage/SensorFormDialog.tsx
import React, { useEffect, useState } from 'react';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Stack,
  alpha,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Device } from '../../types/device';
import { Sensor, SensorCreate, AlertLevel } from '../../types/sensor';
import { getCommonMetricKeys, getCommonAlertConditions } from '../../utils/sensorUtils';

interface SensorFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  sensor: Sensor | null;
  devices: Device[];
  onClose: () => void;
  onSubmit: (formData: SensorCreate) => void;
}

const SensorFormDialog: React.FC<SensorFormDialogProps> = ({
  open,
  mode,
  sensor,
  devices,
  onClose,
  onSubmit
}) => {
  const { t } = useTranslation(['sensors', 'common']);
  const theme = useTheme();

  const [formData, setFormData] = useState<SensorCreate>({
    name: '',
    description: '',
    device_id: 0,
    metric_key: '',
    alert_condition: '>'
  });

  useEffect(() => {
    if (mode === 'edit' && sensor) {
      setFormData({
        name: sensor.name,
        description: sensor.description || '',
        device_id: sensor.device_id,
        metric_key: sensor.metric_key,
        alert_condition: sensor.alert_condition,
        alert_level: sensor.alert_level
      });
    } else {
      setFormData({
        name: '',
        description: '',
        device_id: 0,
        metric_key: '',
        alert_condition: '>'
      });
    }
  }, [mode, sensor, open]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const alertConditionSymbol = formData.alert_condition.replace(/\d+(\.\d+)?/g, '') || '>';
  const alertConditionValue = formData.alert_condition.match(/\d+(\.\d+)?/)?.[0] || '';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle>
        {mode === 'create' ? t('sensors:createSensor') : t('sensors:editSensor')}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label={t('sensors:sensorName')}
              fullWidth
              required
              value={formData.name}
              onChange={handleFormChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label={t('sensors:sensorDescription')}
              fullWidth
              multiline
              rows={2}
              value={formData.description}
              onChange={handleFormChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required variant="outlined">
              <InputLabel shrink>{t('sensors:device')}</InputLabel>
              <Select
                name="device_id"
                value={formData.device_id || ''}
                label={t('sensors:device')}
                onChange={handleFormChange}
                disabled={mode === 'edit'}
                displayEmpty
                notched
              >
                <MenuItem value="" disabled>
                  <em>{t('common:select')}</em>
                </MenuItem>
                {devices.map((device) => (
                  <MenuItem key={device.id} value={device.id}>
                    {device.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required variant="outlined">
              <InputLabel shrink>{t('sensors:metricKey')}</InputLabel>
              <Select
                name="metric_key"
                value={formData.metric_key || ''}
                label={t('sensors:metricKey')}
                onChange={handleFormChange}
                displayEmpty
                notched
              >
                <MenuItem value="" disabled>
                  <em>{t('common:select')}</em>
                </MenuItem>
                {getCommonMetricKeys().map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel shrink>{t('sensors:alertCondition')}</InputLabel>
                <Select
                  name="alertConditionSymbol"
                  value={alertConditionSymbol}
                  label={t('sensors:alertCondition')}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      alert_condition: `${e.target.value}${alertConditionValue}`
                    });
                  }}
                  displayEmpty
                  notched
                >
                  <MenuItem value="" disabled>
                    <em>{t('common:select')}</em>
                  </MenuItem>
                  {getCommonAlertConditions().map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label={t('common:value')}
                type="number"
                value={alertConditionValue}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    alert_condition: `${alertConditionSymbol}${e.target.value}`
                  });
                }}
                sx={{ width: '40%' }}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>{t('sensors:alertLevel')}</InputLabel>
              <Select
                name="alert_level"
                value={formData.alert_level || AlertLevel.WARNING}
                label={t('sensors:alertLevel')}
                onChange={handleFormChange}
                displayEmpty
                notched
              >
                <MenuItem value={AlertLevel.INFO}>
                  <Chip
                    label="Info"
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main
                    }}
                  />
                </MenuItem>
                <MenuItem value={AlertLevel.WARNING}>
                  <Chip
                    label="Warning"
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.main
                    }}
                  />
                </MenuItem>
                <MenuItem value={AlertLevel.CRITICAL}>
                  <Chip
                    label="Critical"
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      color: theme.palette.error.main
                    }}
                  />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit" variant="outlined">
          {t('common:cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={!formData.name || !formData.device_id || !formData.metric_key || !formData.alert_condition}
        >
          {t('common:save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SensorFormDialog;