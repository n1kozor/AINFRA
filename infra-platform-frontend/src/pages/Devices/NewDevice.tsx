// NewDevice.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Tooltip,
  StepConnector,
  stepConnectorClasses,
  styled,
  Grid,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Computer as ComputerIcon,
  SmartToy as CustomIcon,
  Settings as SettingsIcon,
  Info as Info,
  Info as InfoIcon,
  Check as CheckIcon,
  NetworkCheck as NetworkIcon,

} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../api';
import PageContainer from '../../components/common/PageContainer';
import DeviceForm from '../../components/devices/DeviceForm';
import StandardDeviceForm from '../../components/devices/StandardDeviceForm';
import CustomDeviceForm from '../../components/devices/CustomDeviceForm';
import { DeviceCreate } from '../../types/device';
import { motion } from 'framer-motion';

// Custom connector for the stepper
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
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
  width: 50,
  height: 50,
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
    1: <Info />,
    2: <NetworkIcon />,
    3: <CheckIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active, icon }}>
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
};

const NewDevice = () => {
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [deviceData, setDeviceData] = useState<Partial<DeviceCreate>>({
    name: '',
    description: '',
    ip_address: '',
    type: 'standard',
    is_active: true,
    standard_device: {
      os_type: 'linux',
      hostname: '',
      username: '',
      password: '',
      port: 22,
      timeout: 30,
    },
  });

  // Fetch plugins for custom device form
  const { data: plugins } = useQuery({
    queryKey: ['plugins'],
    queryFn: api.plugins.getAll,
    enabled: deviceData.type === 'custom',
  });

  // Reset custom/standard device data when switching types
  useEffect(() => {
    if (deviceData.type === 'standard') {
      setDeviceData(prev => ({
        ...prev,
        custom_device: undefined,
        standard_device: prev.standard_device || {
          os_type: 'linux',
          hostname: '',
          username: '',
          password: '',
          port: 22,
          timeout: 30,
        },
      }));
    } else {
      setDeviceData(prev => ({
        ...prev,
        standard_device: undefined,
        custom_device: prev.custom_device || {
          plugin_id: 0,
          connection_params: {},
        },
      }));
    }
  }, [deviceData.type]);

  // Device creation mutation
  const createDeviceMutation = useMutation({
    mutationFn: (data: DeviceCreate) => api.devices.create(data),
    onSuccess: (device) => {
      navigate(`/devices/${device.id}`);
    },
  });

  const steps = [
    t('devices:steps.basicInfo'),
    t('devices:steps.connectionDetails'),
    t('devices:steps.review'),
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleDeviceDataChange = (data: Partial<DeviceCreate>) => {
    setDeviceData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = () => {
    if (
      deviceData.name &&
      deviceData.ip_address &&
      deviceData.type &&
      ((deviceData.type === 'standard' && deviceData.standard_device) ||
        (deviceData.type === 'custom' && deviceData.custom_device))
    ) {
      createDeviceMutation.mutate(deviceData as DeviceCreate);
    }
  };

  const isStepValid = (step: number) => {
    if (step === 0) {
      return !!deviceData.name && !!deviceData.ip_address && !!deviceData.type;
    }
    if (step === 1) {
      if (deviceData.type === 'standard') {
        return !!(
          deviceData.standard_device?.os_type &&
          deviceData.standard_device?.hostname &&
          deviceData.standard_device?.username &&
          deviceData.standard_device?.password
        );
      } else {
        return !!(
          deviceData.custom_device?.plugin_id &&
          deviceData.custom_device?.connection_params
        );
      }
    }
    return true;
  };

  return (
    <PageContainer
      title={t('devices:addDevice')}
      breadcrumbs={[
        { text: t('common:navigation.dashboard'), link: '/' },
        { text: t('common:navigation.devices'), link: '/devices' },
        { text: t('devices:addDevice') },
      ]}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: '24px',
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          position: 'relative',
          overflow: 'hidden',
          mb: 3,
        }}
      >
        {/* Background decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -80,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)}, transparent 70%)`,
            opacity: 0.6,
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            bottom: -60,
            left: -40,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.15)}, transparent 70%)`,
            opacity: 0.5,
            zIndex: 0,
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              mb: 2,
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('devices:addDevice')}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '800px' }}>
            {t('devices:addDeviceDescription')}
          </Typography>

          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{ mb: 4 }}
            connector={<ColorlibConnector />}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  <Typography sx={{ fontWeight: 600, mt: 1 }}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Divider sx={{ mb: 4 }} />

          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeStep === 0 && (
              <DeviceForm
                deviceData={deviceData}
                onChange={handleDeviceDataChange}
              />
            )}

            {activeStep === 1 && deviceData.type === 'standard' && (
              <StandardDeviceForm
                standardDeviceData={deviceData.standard_device || {}}
                onChange={(standardData) =>
                  handleDeviceDataChange({ standard_device: standardData })
                }
              />
            )}

            {activeStep === 1 && deviceData.type === 'custom' && (
              <CustomDeviceForm
                customDeviceData={deviceData.custom_device || {}}
                plugins={plugins || []}
                onChange={(customData) =>
                  handleDeviceDataChange({ custom_device: customData })
                }
              />
            )}

            {activeStep === 2 && (
              <DeviceReview
                deviceData={deviceData}
                plugins={plugins || []}
                error={createDeviceMutation.isError}
              />
            )}
          </motion.div>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        {activeStep === 0 ? (
          <Button
            component={Link}
            to="/devices"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            sx={{
              px: 3,
              py: 1.2,
              borderRadius: '12px',
              borderWidth: '2px',
              fontWeight: 600,
              '&:hover': {
                borderWidth: '2px',
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[2],
              }
            }}
          >
            {t('common:actions.back')}
          </Button>
        ) : (
          <Button
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            sx={{
              px: 3,
              py: 1.2,
              borderRadius: '12px',
              borderWidth: '2px',
              fontWeight: 600,
              '&:hover': {
                borderWidth: '2px',
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[2],
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
              px: 4,
              py: 1.2,
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
              py: 1.2,
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
      </Box>
    </PageContainer>
  );
};

// Device Review Component
interface DeviceReviewProps {
  deviceData: Partial<DeviceCreate>;
  plugins: any[];
  error: boolean;
}

const DeviceReview: React.FC<DeviceReviewProps> = ({ deviceData, plugins, error }) => {
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
        {t('devices:reviewTitle')}
      </Typography>

      {/* Basic Information */}
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

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('devices:name')}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {deviceData.name}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('devices:ipAddress')}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {deviceData.ip_address}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('devices:type')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {deviceData.type === 'standard' ? (
                <ComputerIcon sx={{ color: theme.palette.info.main, mr: 1, fontSize: '1rem' }} />
              ) : (
                <CustomIcon sx={{ color: theme.palette.secondary.main, mr: 1, fontSize: '1rem' }} />
              )}
              <Typography variant="body1" fontWeight={600}>
                {deviceData.type === 'standard'
                  ? t('devices:deviceTypes.standard')
                  : t('devices:deviceTypes.custom')}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('devices:status')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: deviceData.is_active ? 'success.main' : 'error.main',
                  mr: 1,
                }}
              />
              <Typography
                variant="body1"
                fontWeight={600}
                color={deviceData.is_active ? 'success.main' : 'error.main'}
              >
                {deviceData.is_active
                  ? t('devices:status.active')
                  : t('devices:status.inactive')}
              </Typography>
            </Box>
          </Grid>

          {deviceData.description && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('devices:description')}
              </Typography>
              <Typography variant="body1">
                {deviceData.description}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Standard Device Details */}
      {deviceData.type === 'standard' && deviceData.standard_device && (
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
            <ComputerIcon color="info" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight={700} color="info.main">
              {t('devices:connectionDetails')}
            </Typography>
          </Box>

          <Divider sx={{ mb: 2, opacity: 0.5 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('devices:osType')}
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {t(`devices:osTypes.${deviceData.standard_device.os_type}`)}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('devices:hostname')}
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {deviceData.standard_device.hostname}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('devices:port')}
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {deviceData.standard_device.port || 22}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('devices:username')}
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {deviceData.standard_device.username}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('devices:password')}
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                ••••••••
              </Typography>
            </Grid>

            {deviceData.standard_device.timeout && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('devices:connectionTimeout')}
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {deviceData.standard_device.timeout} {t('devices:seconds')}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}

      {/* Custom Device Details */}
      {deviceData.type === 'custom' && deviceData.custom_device && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '16px',
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
            bgcolor: alpha(theme.palette.secondary.main, 0.05),
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CustomIcon color="secondary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight={700} color="secondary.main">
              {t('devices:customDeviceConfig')}
            </Typography>
          </Box>

          <Divider sx={{ mb: 2, opacity: 0.5 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('devices:plugin')}
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {plugins?.find(
                  (p) => p.id === deviceData.custom_device?.plugin_id
                )?.name || `Plugin ID: ${deviceData.custom_device?.plugin_id}`}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('devices:connectionParams')}
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: alpha(theme.palette.background.paper, 0.5),
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                <pre style={{ margin: 0, overflowX: 'auto' }}>
                  {JSON.stringify(deviceData.custom_device.connection_params, null, 2)}
                </pre>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {error && (
        <Alert
          severity="error"
          variant="filled"
          sx={{
            borderRadius: '12px',
            mt: 3,
          }}
        >
          {t('devices:errorSavingDevice')}
        </Alert>
      )}
    </Box>
  );
};

export default NewDevice;