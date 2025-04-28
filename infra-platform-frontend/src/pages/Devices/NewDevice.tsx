import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  useTheme,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../api';
import PageContainer from '../../components/common/PageContainer';
import DeviceForm from '../../components/devices/DeviceForm';
import StandardDeviceForm from '../../components/devices/StandardDeviceForm';
import CustomDeviceForm from '../../components/devices/CustomDeviceForm';
import { DeviceCreate, DeviceType } from '../../types/device';

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
  });

  // Fetch plugins for custom device form
  const { data: plugins } = useQuery({
    queryKey: ['plugins'],
    queryFn: api.plugins.getAll,
    enabled: deviceData.type === 'custom',
  });

  // Device creation mutation
  const createDeviceMutation = useMutation({
    mutationFn: (data: DeviceCreate) => api.devices.create(data),
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
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        {activeStep === 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              {t('devices:steps.basicInfo')}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('devices:basicInfoDescription')}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <DeviceForm
              deviceData={deviceData}
              onChange={handleDeviceDataChange}
            />
          </>
        )}

        {activeStep === 1 && deviceData.type === 'standard' && (
          <>
            <Typography variant="h6" gutterBottom>
              {t('devices:steps.standardConfig')}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('devices:standardConfigDescription')}
            </Typography>
            <Divider sx={{ my: 2 }} />
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
            <Typography variant="h6" gutterBottom>
              {t('devices:steps.customConfig')}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('devices:customConfigDescription')}
            </Typography>
            <Divider sx={{ my: 2 }} />
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
            <Typography variant="h6" gutterBottom>
              {t('devices:steps.review')}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('devices:reviewDescription')}
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                {t('devices:basicInfo')}
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('devices:name')}
                  </Typography>
                  <Typography variant="body1">{deviceData.name}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('devices:ipAddress')}
                  </Typography>
                  <Typography variant="body1">{deviceData.ip_address}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('devices:type')}
                  </Typography>
                  <Typography variant="body1">
                    {deviceData.type === 'standard'
                      ? t('devices:deviceTypes.standard')
                      : t('devices:deviceTypes.custom')}
                  </Typography>
                </Box>
                {deviceData.description && (
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('devices:description')}
                    </Typography>
                    <Typography variant="body1">{deviceData.description}</Typography>
                  </Box>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {deviceData.type === 'standard' && deviceData.standard_device && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  {t('devices:standardDeviceConfig')}
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('devices:osType')}
                    </Typography>
                    <Typography variant="body1">
                      {t(`devices:osTypes.${deviceData.standard_device.os_type}`)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('devices:hostname')}
                    </Typography>
                    <Typography variant="body1">
                      {deviceData.standard_device.hostname}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('devices:username')}
                    </Typography>
                    <Typography variant="body1">
                      {deviceData.standard_device.username}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('devices:port')}
                    </Typography>
                    <Typography variant="body1">
                      {deviceData.standard_device.port || 22}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {deviceData.type === 'custom' && deviceData.custom_device && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  {t('devices:customDeviceConfig')}
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('devices:plugin')}
                    </Typography>
                    <Typography variant="body1">
                      {plugins?.find(
                        (p) => p.id === deviceData.custom_device?.plugin_id
                      )?.name || `Plugin ID: ${deviceData.custom_device.plugin_id}`}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('devices:connectionParams')}
                    </Typography>
                    <pre
                      style={{
                        background: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.background.paper, 0.5)
                          : alpha(theme.palette.background.default, 0.5),
                        padding: theme.spacing(1),
                        borderRadius: theme.shape.borderRadius,
                        overflow: 'auto',
                      }}
                    >
                      {JSON.stringify(deviceData.custom_device.connection_params, null, 2)}
                    </pre>
                  </Box>
                </Box>
              </Box>
            )}
          </>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        {activeStep === 0 ? (
          <Button
            component={Link}
            to="/devices"
            startIcon={<ArrowBackIcon />}
          >
            {t('common:actions.back')}
          </Button>
        ) : (
          <Button onClick={handleBack}>
            {t('common:actions.back')}
          </Button>
        )}

        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={createDeviceMutation.isPending}
          >
            {t('common:actions.save')}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={
              (activeStep === 0 && (!deviceData.name || !deviceData.ip_address)) ||
              (activeStep === 1 && deviceData.type === 'standard' && (
                !deviceData.standard_device?.os_type ||
                !deviceData.standard_device?.hostname ||
                !deviceData.standard_device?.username ||
                !deviceData.standard_device?.password
              )) ||
              (activeStep === 1 && deviceData.type === 'custom' && (
                !deviceData.custom_device?.plugin_id
              ))
            }
          >
            {t('common:actions.next')}
          </Button>
        )}
      </Box>
    </PageContainer>
  );
};

export default NewDevice;