import React, { useState, useEffect } from 'react';
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
  Avatar,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import {
  SmartToy as CustomIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  NetworkCheck as NetworkIcon,
  DevicesRounded as DeviceIcon,
  SubtitlesRounded as DescriptionIcon,
  Check as CheckIcon,
  Save as SaveIcon,
  ExtensionRounded as PluginIcon,
  SecurityRounded as SecurityIcon,
  TuneRounded as TuneIcon,
  DataObjectRounded as JsonIcon,
  Search as SearchIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../api';
import { DeviceCreate } from '../../types/device';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(to right, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(to right, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: alpha(theme.palette.text.primary, 0.1),
    borderRadius: 1,
  },
}));

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
    backgroundImage: `linear-gradient(135deg, ${theme.palette.secondary.light}, ${theme.palette.secondary.main})`,
    boxShadow: `0 4px 10px 0 ${alpha(theme.palette.secondary.main, 0.35)}`,
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
    2: <PluginIcon />,
    3: <TuneIcon />,
    4: <CheckIcon />,
  };

  return (
      <ColorlibStepIconRoot ownerState={{ completed, active, icon }}>
        {icons[String(icon)]}
      </ColorlibStepIconRoot>
  );
};

interface CustomDeviceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CustomDeviceModal: React.FC<CustomDeviceModalProps> = ({ open, onClose, onSuccess }) => {
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [paramsJson, setParamsJson] = useState('{}');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const [deviceData, setDeviceData] = useState<Partial<DeviceCreate>>({
    name: '',
    description: '',
    ip_address: '',
    type: 'custom',
    custom_device: {
      plugin_id: 0,
      connection_params: {},
    },
  });

  const { data: plugins, isLoading: pluginsLoading } = useQuery({
    queryKey: ['plugins'],
    queryFn: api.plugins.getAll,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setActiveTab(0);
      setSearchTerm('');
      setParamsJson('{}');
      setJsonError(null);
      setDeviceData({
        name: '',
        description: '',
        ip_address: '',
        type: 'custom',
        custom_device: {
          plugin_id: 0,
          connection_params: {},
        },
      });
    }
  }, [open]);

  useEffect(() => {
    if (deviceData.custom_device?.connection_params) {
      try {
        setParamsJson(JSON.stringify(deviceData.custom_device.connection_params, null, 2));
        setJsonError(null);
      } catch (e) {
        setJsonError('Invalid JSON');
      }
    } else {
      setParamsJson('{}');
    }
  }, [deviceData.custom_device?.connection_params]);

  const createDeviceMutation = useMutation({
    mutationFn: (data: DeviceCreate) => api.devices.create(data),
    onSuccess: () => {
      onSuccess();
    },
  });

  const steps = [
    t('devices:steps.basicInfo'),
    t('devices:steps.selectPlugin'),
    t('devices:steps.connectionDetails'),
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
    setDeviceData({
      ...deviceData,
      [name]: value,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handlePluginSelect = (pluginId: number) => {
    const plugin = plugins?.find(p => p.id === pluginId);

    let initialParams = {};
    if (plugin?.ui_schema?.properties?.connection?.properties) {
      const props = plugin.ui_schema.properties.connection.properties;
      initialParams = Object.keys(props).reduce((acc, key) => {
        if (props[key].default !== undefined) {
          acc[key] = props[key].default;
        }
        return acc;
      }, {} as Record<string, any>);
    }

    setDeviceData({
      ...deviceData,
      custom_device: {
        plugin_id: pluginId,
        connection_params: initialParams,
      }
    });
  };

  const handleJsonChange = (value: string | undefined) => {
    if (!value) return;

    setParamsJson(value);

    try {
      const params = JSON.parse(value);
      setDeviceData({
        ...deviceData,
        custom_device: {
          ...deviceData.custom_device!,
          connection_params: params,
        }
      });
      setJsonError(null);
    } catch (e) {
      setJsonError('Invalid JSON');
    }
  };

  const handleFormParamChange = (key: string, value: any, type: string) => {
    setDeviceData({
      ...deviceData,
      custom_device: {
        ...deviceData.custom_device!,
        connection_params: {
          ...deviceData.custom_device?.connection_params,
          [key]: type === 'number' ? Number(value) : value,
        }
      }
    });
  };

  const handleSubmit = () => {
    if (
        deviceData.name &&
        deviceData.ip_address &&
        deviceData.custom_device?.plugin_id
    ) {
      createDeviceMutation.mutate(deviceData as DeviceCreate);
    }
  };

  const isStepValid = (step: number) => {
    if (step === 0) {
      return !!deviceData.name && !!deviceData.ip_address;
    }
    if (step === 1) {
      return !!deviceData.custom_device?.plugin_id;
    }
    return true;
  };

  const selectedPlugin = plugins?.find(p => p.id === deviceData.custom_device?.plugin_id);

  const filteredPlugins = searchTerm && plugins
      ? plugins.filter(plugin =>
          plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plugin.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plugin.author?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      : plugins;

  const generateFormFields = () => {
    if (!selectedPlugin || !selectedPlugin.ui_schema?.properties?.connection?.properties) {
      return null;
    }

    const connectionProps = selectedPlugin.ui_schema.properties.connection.properties;
    const required = selectedPlugin.ui_schema.properties.connection.required || [];

    return (
        <Grid container spacing={2}>
          {Object.entries(connectionProps).map(([key, prop]: [string, any]) => (
              <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                  key={key}
              >
                <TextField
                    label={prop.title || key}
                    value={
                      deviceData.custom_device?.connection_params?.[key] !== undefined
                          ? deviceData.custom_device.connection_params[key]
                          : prop.default || ''
                    }
                    onChange={(e) => handleFormParamChange(key, e.target.value, prop.type)}
                    fullWidth
                    required={required.includes(key)}
                    error={
                        required.includes(key) &&
                        !deviceData.custom_device?.connection_params?.[key]
                    }
                    helperText={prop.description || ''}
                    type={prop.format === 'password' ? 'password' : 'text'}
                    multiline={prop.format === 'textarea'}
                    rows={prop.format === 'textarea' ? 4 : 1}
                    InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                            <TuneIcon sx={{ color: theme.palette.secondary.main }} />
                          </InputAdornment>
                      ),
                      sx: { borderRadius: '12px' },
                    }}
                />
              </Grid>

          ))}
        </Grid>
    );
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
              background: `linear-gradient(90deg, ${alpha(theme.palette.secondary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.15)})`,
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
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: theme.palette.secondary.main,
                  mr: 2
                }}
            >
              <CustomIcon />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t('devices:addCustomDevice')}
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
                                    <DeviceIcon sx={{ color: theme.palette.secondary.main }} />
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
                                    <NetworkIcon sx={{ color: theme.palette.secondary.main }} />
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
                                    <DescriptionIcon sx={{ color: theme.palette.secondary.main }} />
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {t('devices:selectPlugin')}
                    </Typography>

                    <TextField
                        placeholder={t('devices:searchPlugins')}
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                          startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                              </InputAdornment>
                          ),
                          sx: { borderRadius: '12px' }
                        }}
                        sx={{ width: '240px' }}
                    />
                  </Box>

                  {pluginsLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <CircularProgress size={40} />
                      </Box>
                  ) : (
                      <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                            gap: 2,
                            maxHeight: '380px',
                            overflowY: 'auto',
                            pr: 1,
                          }}
                      >
                        {filteredPlugins && filteredPlugins.length > 0 ? (
                            filteredPlugins.map((plugin) => (
                                <Paper
                                    key={plugin.id}
                                    component={motion.div}
                                    whileHover={{ y: -5, boxShadow: theme.shadows[4] }}
                                    whileTap={{ scale: 0.98 }}
                                    elevation={0}
                                    onClick={() => handlePluginSelect(plugin.id)}
                                    sx={{
                                      p: 2.5,
                                      borderRadius: '16px',
                                      cursor: 'pointer',
                                      bgcolor: deviceData.custom_device?.plugin_id === plugin.id
                                          ? alpha(theme.palette.secondary.main, 0.1)
                                          : alpha(theme.palette.background.paper, 0.8),
                                      border: `2px solid ${deviceData.custom_device?.plugin_id === plugin.id
                                          ? theme.palette.secondary.main
                                          : alpha(theme.palette.divider, 0.1)}`,
                                      transition: 'all 0.3s',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      height: '100%',
                                      boxShadow: (theme) => theme.shadows[4],
                                    }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                          bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                          color: theme.palette.secondary.main,
                                          borderRadius: '10px',
                                          width: 36,
                                          height: 36,
                                        }}
                                    >
                                      <PluginIcon />
                                    </Avatar>
                                    <Box sx={{ ml: 1.5, overflow: 'hidden' }}>
                                      <Typography
                                          variant="subtitle2"
                                          fontWeight={600}
                                          noWrap
                                          sx={{ color: deviceData.custom_device?.plugin_id === plugin.id
                                                ? theme.palette.secondary.main
                                                : theme.palette.text.primary
                                          }}
                                      >
                                        {plugin.name}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary" noWrap>
                                        v{plugin.version}
                                      </Typography>
                                    </Box>
                                  </Box>

                                  <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{
                                        mb: 2,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        flexGrow: 1,
                                        fontSize: '0.8rem',
                                      }}
                                  >
                                    {plugin.description || t('devices:noDescription')}
                                  </Typography>

                                  <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    {plugin.author && (
                                        <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.65rem' }}>
                                          {plugin.author}
                                        </Typography>
                                    )}
                                  </Box>
                                </Paper>
                            ))
                        ) : (
                            <Box
                                sx={{
                                  p: 3,
                                  textAlign: 'center',
                                  bgcolor: alpha(theme.palette.background.paper, 0.5),
                                  borderRadius: '12px',
                                  border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
                                  gridColumn: '1 / -1',
                                }}
                            >
                              <Typography variant="body1" color="text.secondary">
                                {searchTerm ? t('devices:noPluginsFound') : t('devices:noPluginsAvailable')}
                              </Typography>
                            </Box>
                        )}
                      </Box>
                  )}
                </Box>
            )}

            {activeStep === 2 && selectedPlugin && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                          width: 42,
                          height: 42,
                          bgcolor: alpha(theme.palette.secondary.main, 0.1),
                          color: theme.palette.secondary.main,
                          borderRadius: '12px',
                          boxShadow: (theme) => theme.shadows[4],
                          border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                          mr: 2,
                        }}
                    >
                      <PluginIcon sx={{ fontSize: '1.5rem' }} />
                    </Avatar>

                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {selectedPlugin.name}
                        </Typography>
                        <Chip
                            size="small"
                            label={`v${selectedPlugin.version}`}
                            sx={{
                              ml: 1,
                              borderRadius: '8px',
                              bgcolor: alpha(theme.palette.secondary.main, 0.1),
                              color: theme.palette.secondary.main,
                              fontWeight: 600,
                            }}
                        />
                      </Box>

                      {selectedPlugin.description && (
                          <Typography variant="body2" color="text.secondary">
                            {selectedPlugin.description}
                          </Typography>
                      )}
                    </Box>
                  </Box>

                  <Paper
                      elevation={0}
                      sx={{
                        borderRadius: '16px',
                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        mb: 2,
                        overflow: 'hidden'
                      }}
                  >
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{
                          '& .MuiTabs-indicator': {
                            height: 3,
                            borderRadius: '3px',
                          },
                          '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            minHeight: '50px',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                            },
                            '&.Mui-selected': {
                              color: theme.palette.secondary.main,
                            },
                          },
                        }}
                    >
                      <Tab
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TuneIcon sx={{ mr: 1, fontSize: '1rem' }} />
                              {t('devices:tabs.parameters')}
                            </Box>
                          }
                      />
                      <Tab
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <JsonIcon sx={{ mr: 1, fontSize: '1rem' }} />
                              {t('devices:tabs.jsonEditor')}
                            </Box>
                          }
                      />
                    </Tabs>

                    <Box sx={{ p: 3 }}>
                      {activeTab === 0 && (
                          <>
                            {selectedPlugin.ui_schema?.properties?.connection ? (
                                <>
                                  <Box
                                      sx={{
                                        p: 2,
                                        borderRadius: '12px',
                                        bgcolor: alpha(theme.palette.secondary.main, 0.05),
                                        border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        mb: 3,
                                      }}
                                  >
                                    <InfoIcon sx={{ color: theme.palette.secondary.main, mr: 2, mt: 0.3 }} />
                                    <Typography variant="body2">
                                      {t('devices:connectionParamsDescription')}
                                    </Typography>
                                  </Box>

                                  {generateFormFields()}
                                </>
                            ) : (
                                <Box
                                    sx={{
                                      p: 2,
                                      borderRadius: '12px',
                                      bgcolor: alpha(theme.palette.warning.main, 0.05),
                                      border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                    }}
                                >
                                  <WarningIcon sx={{ color: theme.palette.warning.main, mr: 2, mt: 0.3 }} />
                                  <Typography variant="body2">
                                    {t('devices:noUiSchema')}
                                  </Typography>
                                </Box>
                            )}
                          </>
                      )}

                      {activeTab === 1 && (
                          <>
                            <Box
                                sx={{
                                  p: 2,
                                  borderRadius: '12px',
                                  bgcolor: alpha(theme.palette.info.main, 0.05),
                                  border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  mb: 3,
                                }}
                            >
                              <InfoIcon sx={{ color: theme.palette.info.main, mr: 2, mt: 0.3 }} />
                              <Typography variant="body2">
                                {t('devices:jsonEditorDescription')}
                              </Typography>
                            </Box>

                            <Paper
                                variant="outlined"
                                sx={{
                                  borderRadius: '12px',
                                  overflow: 'hidden',
                                  border: `1px solid ${jsonError ? theme.palette.error.main : alpha(theme.palette.divider, 0.2)}`,
                                }}
                            >
                              <Editor
                                  height="240px"
                                  language="json"
                                  value={paramsJson}
                                  onChange={handleJsonChange}
                                  theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
                                  options={{
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    fontSize: 14,
                                    wordWrap: 'on',
                                    tabSize: 2,
                                    formatOnPaste: true,
                                    automaticLayout: true,
                                  }}
                              />
                            </Paper>

                            {jsonError && (
                                <Typography
                                    variant="body2"
                                    color="error"
                                    sx={{
                                      mt: 1,
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                >
                                  <WarningIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                                  {jsonError}
                                </Typography>
                            )}
                          </>
                      )}
                    </Box>
                  </Paper>
                </Box>
            )}

            {activeStep === 3 && (
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 600 }}>
                    {t('devices:reviewDeviceInfo')}
                  </Typography>

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
                      <InfoIcon color="secondary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight={700} color="secondary.main">
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

                  {selectedPlugin && (
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
                          <PluginIcon color="info" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" fontWeight={700} color="info.main">
                            {t('devices:pluginDetails')}
                          </Typography>
                        </Box>

                        <Divider sx={{ mb: 2, opacity: 0.5 }} />

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {t('devices:pluginName')}
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {selectedPlugin.name}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {t('devices:pluginVersion')}
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              v{selectedPlugin.version}
                            </Typography>
                          </Box>

                          {selectedPlugin.author && (
                              <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  {t('devices:author')}
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                  {selectedPlugin.author}
                                </Typography>
                              </Box>
                          )}
                        </Box>
                      </Paper>
                  )}

                  <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: '16px',
                        border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                        bgcolor: alpha(theme.palette.warning.main, 0.05),
                      }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SecurityIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight={700} sx={{ color: theme.palette.warning.main }}>
                        {t('devices:connectionParams')}
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 2, opacity: 0.5 }} />

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {t('devices:paramsObject')}
                    </Typography>

                    <Box
                        sx={{
                          p: 2,
                          borderRadius: '12px',
                          bgcolor: alpha(theme.palette.background.paper, 0.5),
                          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          maxHeight: '120px',
                          overflowY: 'auto',
                        }}
                    >
                  <pre style={{ margin: 0, overflowX: 'auto' }}>
                    {JSON.stringify(deviceData.custom_device?.connection_params || {}, null, 2)}
                  </pre>
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
                  color="secondary"
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
                      bgcolor: alpha(theme.palette.secondary.main, 0.12),
                    }
                  }}
              >
                {t('common:actions.saveDevice')}
              </Button>
          ) : (
              <Button
                  variant="contained"
                  color="secondary"
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
                      bgcolor: alpha(theme.palette.secondary.main, 0.12),
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

export default CustomDeviceModal;