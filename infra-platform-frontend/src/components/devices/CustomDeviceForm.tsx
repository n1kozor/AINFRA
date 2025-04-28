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
} from '@mui/material';
import { Code as CodeIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { CustomDeviceCreate } from '../../types/device';
import { Plugin } from '../../types/plugin';
import Editor from '@monaco-editor/react';

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
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel id="plugin-label">
              {t('devices:plugin')}
            </InputLabel>
            <Select
              labelId="plugin-label"
              value={customDeviceData.plugin_id || ''}
              onChange={handlePluginChange}
              label={t('devices:plugin')}
              error={!customDeviceData.plugin_id}
            >
              {plugins.map((plugin) => (
                <MenuItem key={plugin.id} value={plugin.id}>
                  {plugin.name} (v{plugin.version})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {selectedPlugin && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
              <Typography variant="subtitle1" gutterBottom>
                {selectedPlugin.name} - v{selectedPlugin.version}
              </Typography>
              {selectedPlugin.description && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  {selectedPlugin.description}
                </Typography>
              )}
              {selectedPlugin.author && (
                <Typography variant="caption" color="text.secondary">
                  {t('devices:author')}: {selectedPlugin.author}
                </Typography>
              )}
            </Paper>
          </Grid>
        )}

        {selectedPlugin && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {t('devices:connectionParams')}
            </Typography>

            {selectedPlugin.ui_schema?.properties?.connection ? (
              <Box sx={{ mb: 3 }}>{generateFormFields()}</Box>
            ) : (
              <Typography variant="body2" color="text.secondary" paragraph>
                {t('devices:manualConnectionParams')}
              </Typography>
            )}

            <Paper
              variant="outlined"
              sx={{
                mt: 2,
                p: 0,
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 1,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  bgcolor: alpha(theme.palette.background.default, 0.5),
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CodeIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">
                    {t('devices:rawJson')}
                  </Typography>
                </Box>
              </Box>

              <Editor
                height="200px"
                language="json"
                value={paramsJson}
                onChange={handleJsonChange}
                theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  wordWrap: 'on',
                }}
              />
            </Paper>

            {jsonError && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {jsonError}
              </Typography>
            )}
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CustomDeviceForm;