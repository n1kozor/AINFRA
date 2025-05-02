import React, { useEffect, useState } from 'react';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  alpha,
  useTheme,
  InputAdornment,
  SelectChangeEvent
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
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    t('sensors:basicInfo'),
    t('sensors:deviceSelection'),
    t('sensors:alertSettings')
  ];

  const [formData, setFormData] = useState<SensorCreate>({
    name: '',
    description: '',
    device_id: 0,
    metric_key: '',
    alert_condition: '>'
  });

  const [processName, setProcessName] = useState('');

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

      if (sensor.metric_key === 'process.exists') {
        const processNameMatch = sensor.alert_condition.match(/process:(.+?),/);
        if (processNameMatch && processNameMatch[1]) {
          setProcessName(processNameMatch[1]);
        }
      }
    } else {
      setFormData({
        name: '',
        description: '',
        device_id: 0,
        metric_key: '',
        alert_condition: '>'
      });
      setProcessName('');
    }
    setActiveStep(0);
  }, [mode, sensor, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<unknown>, name: string) => {
    setFormData({
      ...formData,
      [name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (formData.metric_key === 'process.exists') {
      const condition = formData.alert_condition;
      const alertValue = condition.match(/\d+(\.\d+)?/)?.[0] || '1';
      const alertSymbol = condition.replace(/\d+(\.\d+)?/g, '') || '==';

      const processCondition = `process:${processName},${alertSymbol}${alertValue}`;

      onSubmit({
        ...formData,
        alert_condition: processCondition
      });
    } else {
      onSubmit(formData);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const isProcessMetric = formData.metric_key === 'process.exists';
  const isCpuMetric = formData.metric_key === 'cpu.total';
  const isMemMetric = formData.metric_key === 'mem.available';

  let alertConditionSymbol = '==';
  let alertConditionValue = '1';

  if (!isProcessMetric) {
    alertConditionSymbol = formData.alert_condition.replace(/\d+(\.\d+)?/g, '') || '>';
    alertConditionValue = formData.alert_condition.match(/\d+(\.\d+)?/)?.[0] || '';
  } else if (formData.alert_condition.includes('process:')) {
    const match = formData.alert_condition.match(/process:.+?,(.+?)(\d+)/);
    if (match) {
      alertConditionSymbol = match[1];
      alertConditionValue = match[2];
    }
  }

  const getAlertLevelChip = (level: AlertLevel) => {
    const levelConfig = {
      [AlertLevel.INFO]: {
        label: "Info",
        color: theme.palette.info.main
      },
      [AlertLevel.WARNING]: {
        label: "Warning",
        color: theme.palette.warning.main
      },
      [AlertLevel.CRITICAL]: {
        label: "Critical",
        color: theme.palette.error.main
      }
    };

    const config = levelConfig[level];

    return (
        <Chip
            label={config.label}
            size="small"
            sx={{
              backgroundColor: alpha(config.color, 0.1),
              color: config.color,
              fontWeight: 600
            }}
        />
    );
  };

  const isFormValid = () => {
    if (activeStep === 0) {
      return formData.name.trim() !== '';
    } else if (activeStep === 1) {
      return !!formData.device_id && formData.metric_key !== '';
    } else if (isProcessMetric) {
      return processName.trim() !== '' && alertConditionSymbol && alertConditionValue !== '';
    } else {
      return alertConditionSymbol && alertConditionValue !== '';
    }
  };

  const getMetricUnit = () => {
    if (isCpuMetric) {
      return '%';
    } else if (isMemMetric) {
      return 'MB';
    }
    return '';
  };

  const getMetricHelpText = () => {
    if (isCpuMetric) {
      return t('sensors:cpuThresholdHelp', 'Enter CPU usage threshold as percentage (0-100%)');
    } else if (isMemMetric) {
      return t('sensors:memThresholdHelp', 'Enter memory threshold in megabytes (MB)');
    }
    return '';
  };

  const getInputProps = () => {
    if (isCpuMetric) {
      return { min: 0, max: 100 };
    }
    return { min: 0 };
  };

  return (
      <Dialog
          open={open}
          onClose={onClose}
          maxWidth="sm"
          fullWidth
      >
        <DialogTitle>
          {mode === 'create' ? t('sensors:createSensor') : t('sensors:editSensor')}
        </DialogTitle>

        <DialogContent sx={{ pb: 1 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
              <Box sx={{ p: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {t('sensors:basicInfo')}
                </Typography>

                <TextField
                    name="name"
                    label={t('sensors:sensorName')}
                    fullWidth
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    variant="outlined"
                    sx={{ mb: 3 }}
                />

                <TextField
                    name="description"
                    label={t('sensors:sensorDescription')}
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    variant="outlined"
                />
              </Box>
          )}

          {activeStep === 1 && (
              <Box sx={{ p: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {t('sensors:deviceSelection')}
                </Typography>

                <FormControl fullWidth required sx={{ mb: 3 }}>
                  <InputLabel>{t('sensors:device')}</InputLabel>
                  <Select
                      name="device_id"
                      value={formData.device_id || ''}
                      label={t('sensors:device')}
                      onChange={(e) => handleSelectChange(e, 'device_id')}
                      disabled={mode === 'edit'}
                  >
                    {devices.map((device) => (
                        <MenuItem key={device.id} value={device.id}>
                          {device.name}
                        </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth required>
                  <InputLabel>{t('sensors:metricKey')}</InputLabel>
                  <Select
                      name="metric_key"
                      value={formData.metric_key || ''}
                      label={t('sensors:metricKey')}
                      onChange={(e) => handleSelectChange(e, 'metric_key')}
                  >
                    {getCommonMetricKeys().map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
          )}

          {activeStep === 2 && (
              <Box sx={{ p: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {t('sensors:alertSettings')}
                </Typography>

                {isProcessMetric ? (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {t('sensors:processName')}
                      </Typography>
                      <TextField
                          label={t('sensors:enterProcessName')}
                          value={processName}
                          onChange={(e) => setProcessName(e.target.value)}
                          fullWidth
                          required
                          sx={{ mb: 2 }}
                      />

                      <Typography variant="subtitle2" gutterBottom>
                        {t('sensors:alertCondition')}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl fullWidth required>
                          <InputLabel>{t('sensors:condition')}</InputLabel>
                          <Select
                              value={alertConditionSymbol}
                              label={t('sensors:condition')}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  alert_condition: `process:${processName},${e.target.value}${alertConditionValue}`
                                });
                              }}
                          >
                            <MenuItem value="==">Exists (==)</MenuItem>
                            <MenuItem value="!=">Does Not Exist (!=)</MenuItem>
                          </Select>
                        </FormControl>

                        <TextField
                            label={t('common:threshold')}
                            type="number"
                            value={alertConditionValue}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                alert_condition: `process:${processName},${alertConditionSymbol}${e.target.value}`
                              });
                            }}
                            fullWidth
                            required
                            slotProps={{
                              input: {
                                inputProps: { min: 0, max: 1 }
                              }
                            }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('sensors:processAlertHelp')}
                      </Typography>
                    </Box>
                ) : (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {t('sensors:alertCondition')}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl fullWidth required>
                          <InputLabel>{t('sensors:condition')}</InputLabel>
                          <Select
                              value={alertConditionSymbol}
                              label={t('sensors:condition')}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  alert_condition: `${e.target.value}${alertConditionValue}`
                                });
                              }}
                          >
                            {getCommonAlertConditions().map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <TextField
                            label={t('common:threshold')}
                            type="number"
                            value={alertConditionValue}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                alert_condition: `${alertConditionSymbol}${e.target.value}`
                              });
                            }}
                            fullWidth
                            required
                            slotProps={{
                              input: {
                                inputProps: getInputProps(),
                                endAdornment: getMetricUnit() ?
                                    <InputAdornment position="end">{getMetricUnit()}</InputAdornment> : undefined
                              }
                            }}
                        />
                      </Box>
                      {getMetricHelpText() && (
                          <Typography variant="caption" color="text.secondary">
                            {getMetricHelpText()}
                          </Typography>
                      )}
                    </Box>
                )}

                <FormControl fullWidth required>
                  <InputLabel>{t('sensors:alertLevel')}</InputLabel>
                  <Select
                      name="alert_level"
                      value={formData.alert_level || AlertLevel.WARNING}
                      label={t('sensors:alertLevel')}
                      onChange={(e) => handleSelectChange(e, 'alert_level')}
                      renderValue={(value) => (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getAlertLevelChip(value as AlertLevel)}
                          </Box>
                      )}
                  >
                    <MenuItem value={AlertLevel.INFO}>
                      {getAlertLevelChip(AlertLevel.INFO)}
                    </MenuItem>
                    <MenuItem value={AlertLevel.WARNING}>
                      {getAlertLevelChip(AlertLevel.WARNING)}
                    </MenuItem>
                    <MenuItem value={AlertLevel.CRITICAL}>
                      {getAlertLevelChip(AlertLevel.CRITICAL)}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
          <Box>
            {activeStep > 0 && (
                <Button onClick={handleBack} color="inherit">
                  {t('common:back')}
                </Button>
            )}
          </Box>
          <Box>
            <Button
                onClick={onClose}
                color="inherit"
                variant="outlined"
                sx={{ mr: 1 }}
            >
              {t('common:cancel')}
            </Button>

            {activeStep < steps.length - 1 ? (
                <Button
                    onClick={handleNext}
                    color="primary"
                    variant="contained"
                    disabled={!isFormValid()}
                >
                  {t('common:next')}
                </Button>
            ) : (
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                    disabled={!isFormValid()}
                >
                  {mode === 'create' ? t('common:create') : t('common:save')}
                </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>
  );
};

export default SensorFormDialog;