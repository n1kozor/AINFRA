// NewDevice.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Divider,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Computer as StandardIcon,
  SmartToy as CustomIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Check as CheckIcon
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
import DashboardCard from '../../components/dashboard/DashboardCard';

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
  });

  // Fetch plugins for custom device form
  const { data: plugins } = useQuery({
    queryKey: ['plugins'],
    queryFn: api.plugins.getAll,
    enabled: deviceData.type === 'custom',
  });

  // Device creation mutation
  const createDeviceMutation = useMutation({
    mutationFn: (data: DeviceCreate) => {
      // Create a copy of the data to sanitize
      const sanitizedData = {...data};

      // For standard devices, ensure we never send username, password or port
      if (sanitizedData.type === 'standard' && sanitizedData.standard_device) {
        const { username, password, port, ...safeParams } = sanitizedData.standard_device;
        sanitizedData.standard_device = safeParams;
      }

      return api.devices.create(sanitizedData);
    },
    onSuccess: (device) => {
      navigate(`/devices/${device.id}`);
    },
  });

  const steps = [
    t('devices:steps.basicInfo'),
    deviceData.type === 'standard'
      ? t('devices:steps.standardConfig')
      : t('devices:steps.customConfig'),
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

  const getStepIcon = (index: number) => {
    if (index === 0) return <InfoIcon />;
    if (index === 1) return deviceData.type === 'standard' ? <StandardIcon /> : <CustomIcon />;
    return <CheckIcon />;
  };

  const isStepValid = (step: number) => {
    if (step === 0) {
      return !!deviceData.name && !!deviceData.ip_address;
    }
    if (step === 1) {
      if (deviceData.type === 'standard') {
        return !!(
          deviceData.standard_device?.os_type &&
          deviceData.standard_device?.hostname
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

  // For the review step, prepare a sanitized version of the data to display
  const getReviewData = () => {
    if (deviceData.type === 'standard' && deviceData.standard_device) {
      // Exclude sensitive data from the review
      const { username, password, port, ...safeParams } = deviceData.standard_device;
      return safeParams;
    }

    return deviceData.type === 'standard'
      ? deviceData.standard_device
      : deviceData.custom_device;
  };

  const reviewData = getReviewData();

  return (
    <PageContainer
      title={t('devices:addDevice')}
      breadcrumbs={[
        { text: t('common:navigation.dashboard'), link: '/' },
        { text: t('common:navigation.devices'), link: '/devices' },
        { text: t('devices:addDevice') },
      ]}
    >
      <Box sx={{ width: '100%', mb: 4 }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={
            <StepConnector
              sx={{
                '&.Mui-active, &.Mui-completed': {
                  '& .MuiStepConnector-line': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          }
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  icon: getStepIcon(index),
                  active: activeStep === index,
                  completed: activeStep > index,
                }}
                sx={{
                  '& .MuiStepLabel-label': {
                    fontWeight: 600,
                    mt: 1,
                  },
                  '& .MuiStepLabel-iconContainer': {
                    bgcolor: activeStep >= index ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.text.secondary, 0.1),
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: activeStep >= index
                      ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                      : `1px solid ${alpha(theme.palette.text.secondary, 0.2)}`,
                  },
                  '& .MuiStepIcon-root': {
                    fontSize: 24,
                    color: activeStep >= index ? theme.palette.primary.main : theme.palette.text.secondary,
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DashboardCard
        title={steps[activeStep]}
        icon={getStepIcon(activeStep)}
        color={activeStep === 0 ? 'primary' : activeStep === 1 ? (deviceData.type === 'standard' ? 'info' : 'secondary') : 'success'}
      >
        <Box sx={{ p: 3 }}>
          {activeStep === 0 && (
            <>
              <Typography variant="body1" color="text.secondary" paragraph>
                {t('devices:basicInfoDescription')}
              </Typography>
              <Divider sx={{ my: 2.5 }} />
              <DeviceForm
                deviceData={deviceData}
                onChange={handleDeviceDataChange}
              />
            </>
          )}

          {activeStep === 1 && deviceData.type === 'standard' && (
            <>
              <Typography variant="body1" color="text.secondary" paragraph>
                {t('devices:standardConfigDescription')}
              </Typography>
              <Divider sx={{ my: 2.5 }} />
              <StandardDeviceForm
                standardDeviceData={deviceData.standard_device || {}}
                onChange={(standardData) =>
                  handleDeviceDataChange({ standard_device: standardData })
                }
              />
            </>
          )}

          {activeStep === 1 && deviceData.type === 'custom' && (
            <>
              <Typography variant="body1" color="text.secondary" paragraph>
                {t('devices:customConfigDescription')}
              </Typography>
              <Divider sx={{ my: 2.5 }} />
              <CustomDeviceForm
                customDeviceData={deviceData.custom_device || {}}
                plugins={plugins || []}
                onChange={(customData) =>
                  handleDeviceDataChange({ custom_device: customData })
                }
              />
            </>
          )}

          {activeStep === 2 && (
            <>
              <Typography variant="body1" color="text.secondary" paragraph>
                {t('devices:reviewDescription')}
              </Typography>
              <Divider sx={{ my: 2.5 }} />

              <Box
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  borderRadius: 2,
                  p: 2.5,
                  mb: 3,
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary.main">
                  {t('devices:basicInfo')}
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2.5,
                    mt: 1.5,
                  }}
                >
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
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {t('devices:type')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {deviceData.type === 'standard' ? (
                        <StandardIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
                      ) : (
                        <CustomIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                      )}
                      <Typography variant="body1" fontWeight={600}>
                        {deviceData.type === 'standard'
                          ? t('devices:deviceTypes.standard')
                          : t('devices:deviceTypes.custom')}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {t('devices:status')}
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      sx={{
                        color: deviceData.is_active ? 'success.main' : 'error.main',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: deviceData.is_active ? 'success.main' : 'error.main',
                          mr: 1,
                          display: 'inline-block'
                        }}
                      />
                      {deviceData.is_active
                        ? t('devices:status.active')
                        : t('devices:status.inactive')}
                    </Typography>
                  </Box>
                  {deviceData.description && (
                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {t('devices:description')}
                      </Typography>
                      <Typography variant="body1">
                        {deviceData.description}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {deviceData.type === 'standard' && reviewData && (
                <Box
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                    borderRadius: 2,
                    p: 2.5,
                    mb: 3,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom color="info.main">
                    {t('devices:standardDeviceConfig')}
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 2.5,
                      mt: 1.5,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {t('devices:osType')}
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {t(`devices:osTypes.${(reviewData as any).os_type}`)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {t('devices:hostname')}
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {(reviewData as any).hostname}
                      </Typography>
                    </Box>

                    {/* Note: We deliberately omit displaying username, password and port */}

                  </Box>
                </Box>
              )}

              {deviceData.type === 'custom' && reviewData && (
                <Box
                  sx={{
                    bgcolor: alpha(theme.palette.secondary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                    borderRadius: 2,
                    p: 2.5,
                    mb: 3,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom color="secondary.main">
                    {t('devices:customDeviceConfig')}
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 2.5,
                      mt: 1.5,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {t('devices:plugin')}
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {plugins?.find(
                          (p) => p.id === (reviewData as any).plugin_id
                        )?.name || `Plugin ID: ${(reviewData as any).plugin_id}`}
                      </Typography>
                    </Box>
                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {t('devices:connectionParams')}
                      </Typography>
                      <Box
                        sx={{
                          bg: theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.5)
                            : alpha(theme.palette.background.default, 0.5),
                          p: 2,
                          borderRadius: 1.5,
                          border: `1px solid ${theme.palette.divider}`,
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          overflowX: 'auto',
                        }}
                      >
                        <pre style={{ margin: 0 }}>
                          {JSON.stringify((reviewData as any).connection_params, null, 2)}
                        </pre>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}

              {createDeviceMutation.isError && (
                <Alert
                  severity="error"
                  variant="outlined"
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    borderWidth: 2,
                  }}
                >
                  {t('devices:error')}
                </Alert>
              )}
            </>
          )}
        </Box>
      </DashboardCard>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        {activeStep === 0 ? (
          <Button
            component={Link}
            to="/devices"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            color="inherit"
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
            color="inherit"
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
            {t('common:actions.save')}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={!isStepValid(activeStep)}
            startIcon={<SettingsIcon />}
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

export default NewDevice;