import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  CircularProgress,
  useTheme,
  alpha,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  styled,
  StepConnector,
  stepConnectorClasses,
  Paper,
  Divider,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Computer as ComputerIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  NetworkCheck as NetworkIcon,
  Dns as HostnameIcon,
  DevicesRounded as DeviceIcon,
  SubtitlesRounded as DescriptionIcon,
  Check as CheckIcon,
  Save as SaveIcon,
  Storage as OSIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../api';
import { DeviceCreate, OSType } from '../../types/device';
import { motion } from 'framer-motion';

// Custom connector for the stepper
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: alpha(theme.palette.text.primary, 0.1),
    borderRadius: 1,
  },
}));

// Custom step icon component
const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean; icon: React.ReactNode };
}>(({ theme, ownerState }) => ({
  backgroundColor: alpha(theme.palette.text.primary, 0.1),
  zIndex: 1,
  color: theme.palette.text.primary,
  width: 44,
  height: 44,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
    boxShadow: `0 4px 10px 0 ${alpha(theme.palette.primary.main, 0.35)}`,
    color: theme.palette.common.white,
  }),
  ...(ownerState.completed && {
    backgroundImage: `linear-gradient(135deg, ${theme.palette.success.light}, ${theme.palette.success.main})`,
    boxShadow: `0 4px 10px 0 ${alpha(theme.palette.success.main, 0.35)}`,
    color: theme.palette.common.white,
  }),
}));

const ColorlibStepIcon = ({ icon, active, completed }: any) => {
  const icons: { [index: string]: React.ReactNode } = {
    1: <InfoIcon />,
    2: <HostnameIcon />,
    3: <CheckIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active, icon }}>
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
};

interface StandardDeviceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const StandardDeviceModal: React.FC<StandardDeviceModalProps> = ({ open, onClose, onSuccess }) => {
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const [deviceData, setDeviceData] = useState<Partial<DeviceCreate>>({
    name: '',
    description: '',
    ip_address: '',
    type: 'standard',
    standard_device: {
      hostname: '',
      os_type: 'linux',
    },
  });

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      setActiveStep(0);
      setDeviceData({
        name: '',
        description: '',
        ip_address: '',
        type: 'standard',
        standard_device: {
          hostname: '',
          os_type: 'linux',
        },
      });
    }
  }, [open]);

  // Device creation mutation
  const createDeviceMutation = useMutation({
    mutationFn: (data: DeviceCreate) => api.devices.create(data),
    onSuccess: () => {
      onSuccess();
    },
  });

  const steps = [
    t('devices:steps.basicInfo'),
    t('devices:steps.hostname'),
    t('devices:steps.review'),
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'hostname') {
      setDeviceData({
        ...deviceData,
        standard_device: {
          ...deviceData.standard_device!,
          hostname: value,
        }
      });
    } else {
      setDeviceData({
        ...deviceData,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    if (name === 'os_type') {
      setDeviceData({
        ...deviceData,
        standard_device: {
          ...deviceData.standard_device!,
          os_type: value as OSType,
        }
      });
    } else {
      setDeviceData({
        ...deviceData,
        [name]: value,
      });
    }
  };

  const handleSubmit = () => {
    if (
      deviceData.name &&
      deviceData.ip_address &&
      deviceData.standard_device?.hostname
    ) {
      createDeviceMutation.mutate(deviceData as DeviceCreate);
    }
  };

  const isStepValid = (step: number) => {
    if (step === 0) {
      return !!deviceData.name && !!deviceData.ip_address;
    }
    if (step === 1) {
      return !!deviceData.standard_device?.hostname;
    }
    return true;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2.5,
          px: 3,
          background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.15)})`,
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              mr: 2
            }}
          >
            <ComputerIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {t('devices:addStandardDevice')}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: alpha(theme.palette.text.primary, 0.7) }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3, px: 3 }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{ mb: 4, mt: 1 }}
          connector={<ColorlibConnector />}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>
                <Typography sx={{ fontWeight: 600, mt: 1, fontSize: '0.875rem' }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeStep === 0 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 600 }}>
                {t('devices:enterBasicInfo')}
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  bgcolor: alpha(theme.palette.background.paper, 0.5),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  mb: 2,
                }}
              >
                <Grid container spacing={3}>
                  <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                  >
                    <TextField
                        name="name"
                        label={t('devices:name')}
                        value={deviceData.name || ''}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={
                            !deviceData.name &&
                            deviceData.name !== undefined
                        }
                        helperText={
                          !deviceData.name &&
                          deviceData.name !== undefined
                              ? t('common:errors.required')
                              : t('devices:nameHint')
                        }
                        InputProps={{
                          startAdornment: (
                              <InputAdornment position="start">
                                <DeviceIcon sx={{ color: theme.palette.primary.main }} />
                              </InputAdornment>
                          ),
                          sx: { borderRadius: '12px' },
                        }}
                    />
                  </Grid>


                  <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                  >
                    <TextField
                        name="ip_address"
                        label={t('devices:ipAddress')}
                        value={deviceData.ip_address || ''}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={
                            !deviceData.ip_address &&
                            deviceData.ip_address !== undefined
                        }
                        helperText={
                          !deviceData.ip_address &&
                          deviceData.ip_address !== undefined
                              ? t('common:errors.required')
                              : t('devices:ipAddressHint')
                        }
                        InputProps={{
                          startAdornment: (
                              <InputAdornment position="start">
                                <NetworkIcon sx={{ color: theme.palette.primary.main }} />
                              </InputAdornment>
                          ),
                          sx: { borderRadius: '12px' },
                        }}
                    />
                  </Grid>


                  <Grid
                      size={{
                        xs: 12,
                      }}
                  >
                    <TextField
                        name="description"
                        label={t('devices:description')}
                        value={deviceData.description || ''}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                        helperText={t('devices:descriptionHint')}
                        InputProps={{
                          startAdornment: (
                              <InputAdornment position="start">
                                <DescriptionIcon sx={{ color: theme.palette.primary.main }} />
                              </InputAdornment>
                          ),
                          sx: {
                            borderRadius: '12px',
                            alignItems: 'flex-start',
                            '& .MuiInputAdornment-root': {
                              mt: '14px',
                              ml: '3px',
                              mr: '2px',
                            },
                          },
                        }}
                    />
                  </Grid>

                </Grid>
              </Paper>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 600 }}>
                {t('devices:enterHostname')}
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  bgcolor: alpha(theme.palette.background.paper, 0.5),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  mb: 2,
                }}
              >
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      display: 'flex',
                      alignItems: 'flex-start',
                      width: '100%'
                    }}
                  >
                    <InfoIcon
                      sx={{
                        color: theme.palette.info.main,
                        mr: 1.5,
                        mt: 0.3
                      }}
                    />
                    <Typography variant="body2">
                      {t('devices:hostnameDescription')}
                    </Typography>
                  </Paper>
                </Box>

                <Grid container spacing={3}>
                  <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                  >
                    <TextField
                        name="hostname"
                        label={t('devices:hostname')}
                        value={deviceData.standard_device?.hostname || ''}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={
                            !deviceData.standard_device?.hostname &&
                            deviceData.standard_device?.hostname !== undefined
                        }
                        helperText={
                          !deviceData.standard_device?.hostname &&
                          deviceData.standard_device?.hostname !== undefined
                              ? t('common:errors.required')
                              : t('devices:hostnameHint')
                        }
                        InputProps={{
                          startAdornment: (
                              <InputAdornment position="start">
                                <HostnameIcon sx={{ color: theme.palette.primary.main }} />
                              </InputAdornment>
                          ),
                          sx: { borderRadius: '12px' },
                        }}
                    />
                  </Grid>


                  <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                  >
                    <FormControl fullWidth>
                      <InputLabel id="os-type-label">{t('devices:osType')}</InputLabel>
                      <Select
                          labelId="os-type-label"
                          name="os_type"
                          value={deviceData.standard_device?.os_type || 'linux'}
                          onChange={handleSelectChange}
                          sx={{ borderRadius: '12px' }}
                          startAdornment={
                            <InputAdornment position="start">
                              <OSIcon sx={{ color: theme.palette.primary.main }} />
                            </InputAdornment>
                          }
                      >
                        <MenuItem value="linux">Linux</MenuItem>
                        <MenuItem value="windows">Windows</MenuItem>
                        <MenuItem value="macos">macOS</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                </Grid>
              </Paper>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 600 }}>
                {t('devices:reviewDeviceInfo')}
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  mb: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InfoIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                    {t('devices:basicInfo')}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2, opacity: 0.5 }} />

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {t('devices:name')}
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {deviceData.name}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {t('devices:ipAddress')}
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {deviceData.ip_address}
                    </Typography>
                  </Box>

                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {t('devices:description')}
                    </Typography>
                    <Typography variant="body1">
                      {deviceData.description || t('devices:noDescription')}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                  mb: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <HostnameIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight={700} color="info.main">
                    {t('devices:connectionDetails')}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2, opacity: 0.5 }} />

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {t('devices:hostname')}
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {deviceData.standard_device?.hostname}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {t('devices:osType')}
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {deviceData.standard_device?.os_type === 'linux' && 'Linux'}
                      {deviceData.standard_device?.os_type === 'windows' && 'Windows'}
                      {deviceData.standard_device?.os_type === 'macos' && 'macOS'}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          )}
        </motion.div>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        {activeStep === 0 ? (
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              px: 3,
              py: 1,
              borderRadius: '12px',
              borderWidth: '2px',
              fontWeight: 600,
              '&:hover': {
                borderWidth: '2px',
              }
            }}
          >
            {t('common:actions.cancel')}
          </Button>
        ) : (
          <Button
            onClick={handleBack}
            variant="outlined"
            sx={{
              px: 3,
              py: 1,
              borderRadius: '12px',
              borderWidth: '2px',
              fontWeight: 600,
              '&:hover': {
                borderWidth: '2px',
              }
            }}
          >
            {t('common:actions.back')}
          </Button>
        )}

        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={createDeviceMutation.isPending}
            startIcon={createDeviceMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            sx={{
              px: 3,
              py: 1,
              borderRadius: '12px',
              fontWeight: 600,
              boxShadow: theme.shadows[3],
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[6],
              },
              '&.Mui-disabled': {
                bgcolor: alpha(theme.palette.primary.main, 0.12),
              }
            }}
          >
            {t('common:actions.saveDevice')}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={!isStepValid(activeStep)}
            sx={{
              px: 3,
              py: 1,
              borderRadius: '12px',
              fontWeight: 600,
              boxShadow: theme.shadows[3],
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[6],
              },
              '&.Mui-disabled': {
                bgcolor: alpha(theme.palette.primary.main, 0.12),
              }
            }}
          >
            {t('common:actions.next')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default StandardDeviceModal;