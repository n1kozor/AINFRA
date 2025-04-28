import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Button,
  Paper,
  useTheme,
  alpha,
  Tooltip,
  IconButton,
  Divider,
  Chip,
  Stack,
  Avatar,
  Tab,
  Tabs,
  Badge,
  Alert,
} from '@mui/material';
import {
  CodeRounded as CodeIcon,
  AddRounded as AddIcon,
  DeleteRounded as DeleteIcon,
  ExtensionRounded as PluginIcon,
  CloudRounded as CloudIcon,
  SettingsRounded as SettingsIcon,
  DataObjectRounded as JsonIcon,
  InfoOutlined as InfoIcon,
  DownloadRounded as DownloadIcon,
  HelpOutlineRounded as HelpIcon,
  VerifiedUserRounded as VerifiedIcon,
  WarningAmberRounded as WarningIcon,
  UpdateRounded as UpdateIcon,
  AutorenewRounded as RefreshIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { CustomDeviceCreate } from '../../types/device';
import { Plugin } from '../../types/plugin';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomDeviceFormProps {
  customDeviceData: Partial<CustomDeviceCreate>;
  plugins: Plugin[];
  onChange: (data: Partial<CustomDeviceCreate>) => void;
}

const CustomDeviceForm: React.FC<CustomDeviceFormProps> = ({
  customDeviceData,
  plugins,
  onChange,
}) => {
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();

  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [paramsJson, setParamsJson] = useState('{}');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [editorHeight, setEditorHeight] = useState('300px');

  // Update selected plugin when plugin_id changes
  useEffect(() => {
    if (customDeviceData.plugin_id) {
      const plugin = plugins.find((p) => p.id === customDeviceData.plugin_id);
      if (plugin) {
        setSelectedPlugin(plugin);
      }
    }
  }, [customDeviceData.plugin_id, plugins]);

  // Update params JSON when connection_params change
  useEffect(() => {
    if (customDeviceData.connection_params) {
      try {
        setParamsJson(JSON.stringify(customDeviceData.connection_params, null, 2));
        setJsonError(null);
      } catch (e) {
        setJsonError('Invalid JSON');
      }
    } else {
      setParamsJson('{}');
    }
  }, [customDeviceData.connection_params]);

  const handlePluginChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const pluginId = e.target.value as number;
    const plugin = plugins.find((p) => p.id === pluginId);

    setSelectedPlugin(plugin || null);

    // Initialize connection params from UI schema if available
    let initialParams = {};
    if (plugin?.ui_schema?.properties?.connection?.properties) {
      const props = plugin.ui_schema.properties.connection.properties;
      initialParams = Object.keys(props).reduce((acc, key) => {
        // Add default values if available
        if (props[key].default !== undefined) {
          acc[key] = props[key].default;
        }
        return acc;
      }, {} as Record<string, any>);
    }

    onChange({
      plugin_id: pluginId,
      connection_params: initialParams,
    });
  };

  const handleJsonChange = (value: string | undefined) => {
    if (!value) return;

    setParamsJson(value);

    try {
      const params = JSON.parse(value);
      onChange({
        ...customDeviceData,
        connection_params: params,
      });
      setJsonError(null);
    } catch (e) {
      setJsonError('Invalid JSON');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Helper to generate form fields from plugin UI schema
  const generateFormFields = () => {
    if (!selectedPlugin || !selectedPlugin.ui_schema?.properties?.connection?.properties) {
      return null;
    }

    const connectionProps = selectedPlugin.ui_schema.properties.connection.properties;
    const required = selectedPlugin.ui_schema.properties.connection.required || [];

    return (
      <Grid container spacing={2}>
        {Object.entries(connectionProps).map(([key, prop]: [string, any]) => (
          <Grid item xs={12} sm={6} key={key}>
            <TextField
              label={prop.title || key}
              value={
                customDeviceData.connection_params?.[key] !== undefined
                  ? customDeviceData.connection_params[key]
                  : prop.default || ''
              }
              onChange={(e) => {
                const value = e.target.value;
                onChange({
                  ...customDeviceData,
                  connection_params: {
                    ...customDeviceData.connection_params,
                    [key]: prop.type === 'number' ? Number(value) : value,
                  },
                });
              }}
              fullWidth
              required={required.includes(key)}
              error={required.includes(key) && !customDeviceData.connection_params?.[key]}
              helperText={prop.description || ''}
              type={prop.format === 'password' ? 'password' : 'text'}
              multiline={prop.format === 'textarea'}
              rows={prop.format === 'textarea' ? 4 : 1}
              InputProps={{
                sx: {
                  borderRadius: '12px',
                }
              }}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '24px',
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          mb: 4,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <PluginIcon sx={{ mr: 1 }} />
          {t('devices:selectPlugin')}
          <Tooltip title={t('devices:pluginDescription')} arrow>
            <IconButton size="small" sx={{ ml: 1, color: theme.palette.text.secondary }}>
              <HelpIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2,
              }}
            >
              {plugins.map((plugin) => (
                <Paper
                  key={plugin.id}
                  component={motion.div}
                  whileHover={{ y: -5, boxShadow: theme.shadows[5] }}
                  whileTap={{ scale: 0.98 }}
                  elevation={0}
                  onClick={() => handlePluginChange({ target: { value: plugin.id } } as any)}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    cursor: 'pointer',
                    bgcolor: customDeviceData.plugin_id === plugin.id
                      ? alpha(theme.palette.secondary.main, 0.1)
                      : alpha(theme.palette.background.paper, 0.5),
                    border: `2px solid ${customDeviceData.plugin_id === plugin.id
                      ? theme.palette.secondary.main
                      : alpha(theme.palette.divider, 0.1)}`,
                    transition: 'all 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      variant="rounded"
                      sx={{
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        color: theme.palette.secondary.main,
                        borderRadius: '12px',
                        width: 48,
                        height: 48,
                      }}
                    >
                      <PluginIcon />
                    </Avatar>
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} noWrap>
                        {plugin.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        v{plugin.version}
                      </Typography>
                    </Box>

                    {plugin.verified && (
                      <Tooltip title={t('devices:verifiedPlugin')} arrow>
                        <VerifiedIcon
                          sx={{
                            ml: 'auto',
                            color: theme.palette.success.main,
                            fontSize: '1.2rem'
                          }}
                        />
                      </Tooltip>
                    )}
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
                    }}
                  >
                    {plugin.description || t('devices:noDescription')}
                  </Typography>

                  <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                      size="small"
                      label={plugin.category || t('devices:uncategorized')}
                      sx={{
                        borderRadius: '8px',
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                        fontSize: '0.7rem',
                        height: '24px',
                      }}
                    />

                    {plugin.author && (
                      <Typography variant="caption" color="text.secondary">
                        {plugin.author}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {selectedPlugin && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '24px',
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.main,
                    borderRadius: '16px',
                    boxShadow: `0 8px 16px ${alpha(theme.palette.secondary.main, 0.2)}`,
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                    mr: 2,
                  }}
                >
                  <PluginIcon sx={{ fontSize: '2rem' }} />
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
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                      }}
                    />
                    {selectedPlugin.verified && (
                      <Tooltip title={t('devices:verifiedPlugin')} arrow>
                        <Chip
                          size="small"
                          icon={<VerifiedIcon sx={{ fontSize: '0.9rem !important' }} />}
                          label={t('devices:verified')}
                          sx={{
                            ml: 1,
                            borderRadius: '8px',
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            color: theme.palette.success.main,
                            fontWeight: 600,
                            '& .MuiChip-icon': {
                              color: theme.palette.success.main,
                            }
                          }}
                        />
                      </Tooltip>
                    )}
                  </Box>

                  {selectedPlugin.description && (
                    <Typography variant="body2" color="text.secondary">
                      {selectedPlugin.description}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<DownloadIcon />}
                    size="small"
                    onClick={() => {}}
                    sx={{ borderRadius: '10px', mr: 1 }}
                  >
                    {t('devices:docmentation')}
                  </Button>
                </Box>
              </Box>

              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                  mb: 3,
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '3px',
                  },
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    '&.Mui-selected': {
                      color: theme.palette.secondary.main,
                    },
                  },
                }}
              >
                <Tab
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SettingsIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                      {t('devices:tabs.parameters')}
                    </Box>
                  }
                />
                <Tab
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <JsonIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                      {t('devices:tabs.jsonEditor')}
                    </Box>
                  }
                />
                <Tab
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <InfoIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                      {t('devices:tabs.details')}
                    </Box>
                  }
                />
              </Tabs>

              {activeTab === 0 && (
                <Box>
                  {selectedPlugin.ui_schema?.properties?.connection ? (
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          mb: 2,
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {t('devices:connectionParams')}
                        <InfoIcon
                          sx={{
                            ml: 1,
                            color: alpha(theme.palette.text.primary, 0.6),
                            fontSize: '1rem'
                          }}
                        />
                      </Typography>
                      {generateFormFields()}
                    </Box>
                  ) : (
                    <Alert
                      severity="info"
                      sx={{
                        borderRadius: '12px',
                        '& .MuiAlert-icon': {
                          alignItems: 'center',
                        }
                      }}
                    >
                      {t('devices:noUiSchema')}
                    </Alert>
                  )}

                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<RefreshIcon />}
                      sx={{
                        borderRadius: '12px',
                        boxShadow: `0 4px 14px ${alpha(theme.palette.secondary.main, 0.3)}`,
                      }}
                      onClick={() => {
                        // Reset to defaults
                        if (selectedPlugin?.ui_schema?.properties?.connection?.properties) {
                          const props = selectedPlugin.ui_schema.properties.connection.properties;
                          const initialParams = Object.keys(props).reduce((acc, key) => {
                            if (props[key].default !== undefined) {
                              acc[key] = props[key].default;
                            }
                            return acc;
                          }, {} as Record<string, any>);

                          onChange({
                            ...customDeviceData,
                            connection_params: initialParams,
                          });
                        }
                      }}
                    >
                      {t('devices:resetToDefaults')}
                    </Button>
                  </Box>
                </Box>
              )}

              {activeTab === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {t('devices:jsonEditor')}
                      <InfoIcon
                        sx={{
                          ml: 1,
                          color: alpha(theme.palette.text.primary, 0.6),
                          fontSize: '1rem'
                        }}
                      />
                    </Typography>

                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setEditorHeight(editorHeight === '300px' ? '500px' : '300px')}
                        sx={{ borderRadius: '10px' }}
                      >
                        {editorHeight === '300px' ? t('devices:expand') : t('devices:collapse')}
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                          try {
                            const formattedJson = JSON.stringify(JSON.parse(paramsJson), null, 2);
                            setParamsJson(formattedJson);
                            setJsonError(null);
                          } catch (e) {
                            setJsonError(t('devices:invalidJson'));
                          }
                        }}
                        sx={{ borderRadius: '10px' }}
                      >
                        {t('devices:formatJson')}
                      </Button>
                    </Stack>
                  </Box>

                  <motion.div
                    animate={{ height: editorHeight }}
                    transition={{ duration: 0.3 }}
                  >
                    <Paper
                      variant="outlined"
                      sx={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: `1px solid ${jsonError ? theme.palette.error.main : alpha(theme.palette.divider, 0.2)}`,
                      }}
                    >
                      <Editor
                        height={editorHeight}
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
                  </motion.div>

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
                </Box>
              )}

              {activeTab === 2 && (
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: '16px',
                          bgcolor: alpha(theme.palette.background.paper, 0.5),
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          height: '100%',
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          {t('devices:pluginInfo')}
                        </Typography>

                        <Divider sx={{ mb: 2, opacity: 0.1 }} />

                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {t('devices:pluginName')}
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {selectedPlugin.name}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {t('devices:pluginVersion')}
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {selectedPlugin.version}
                            </Typography>
                          </Box>

                          {selectedPlugin.author && (
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {t('devices:author')}
                              </Typography>
                              <Typography variant="body1" fontWeight={500}>
                                {selectedPlugin.author}
                              </Typography>
                            </Box>
                          )}

                          {selectedPlugin.homepage && (
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {t('devices:homepage')}
                              </Typography>
                              <Typography
                                variant="body1"
                                fontWeight={500}
                                sx={{
                                  color: theme.palette.primary.main,
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                }}
                                onClick={() => window.open(selectedPlugin.homepage, '_blank')}
                              >
                                {selectedPlugin.homepage}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: '16px',
                          bgcolor: alpha(theme.palette.background.paper, 0.5),
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          height: '100%',
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          {t('devices:compatibility')}
                        </Typography>

                        <Divider sx={{ mb: 2, opacity: 0.1 }} />

                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {t('devices:apiVersion')}
                            </Typography>
                            <Chip
                              label={`v${selectedPlugin.api_version || '1.0'}`}
                              size="small"
                              sx={{
                                borderRadius: '8px',
                                mt: 0.5,
                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                color: theme.palette.info.main,
                              }}
                            />
                          </Box>

                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {t('devices:supportedOs')}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                              {selectedPlugin.supported_platforms ? (
                                selectedPlugin.supported_platforms.map((platform, index) => (
                                  <Chip
                                    key={index}
                                    label={platform}
                                    size="small"
                                    sx={{
                                      borderRadius: '8px',
                                      bgcolor: alpha(theme.palette.success.main, 0.1),
                                      color: theme.palette.success.main,
                                    }}
                                  />
                                ))
                              ) : (
                                <Chip
                                  label={t('devices:allPlatforms')}
                                  size="small"
                                  sx={{
                                    borderRadius: '8px',
                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                    color: theme.palette.success.main,
                                  }}
                                />
                              )}
                            </Box>
                          </Box>

                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {t('devices:lastUpdated')}
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {selectedPlugin.updated_at
                                ? new Date(selectedPlugin.updated_at).toLocaleDateString()
                                : t('devices:unknown')}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default CustomDeviceForm;