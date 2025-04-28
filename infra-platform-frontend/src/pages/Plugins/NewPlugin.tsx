import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  FormControlLabel,
  Switch,
  useTheme,
  alpha,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../api';
import PageContainer from '../../components/common/PageContainer';
import Editor from '@monaco-editor/react';
import { PluginCreate } from '../../types/plugin';

const NewPlugin = () => {
  const { t } = useTranslation(['plugins', 'common']);
  const theme = useTheme();
  const navigate = useNavigate();

  const [pluginData, setPluginData] = useState<Partial<PluginCreate>>({
    name: '',
    description: '',
    version: '1.0.0',
    author: '',
    code: `from app.plugins.base import BasePlugin
from typing import Dict, Any, List

class MyCustomPlugin(BasePlugin):
    """
    Custom plugin for device monitoring.
    """

    @property
    def name(self) -> str:
        return "My Custom Plugin"

    @property
    def version(self) -> str:
        return "1.0.0"

    @property
    def description(self) -> str:
        return "A custom plugin that demonstrates the plugin API"

    @property
    def ui_schema(self) -> Dict[str, Any]:
        return {
            "title": "My Custom Plugin",
            "description": "Plugin configuration",
            "type": "object",
            "properties": {
                "connection": {
                    "type": "object",
                    "title": "Connection Settings",
                    "required": ["hostname"],
                    "properties": {
                        "hostname": {
                            "type": "string",
                            "title": "Hostname/IP",
                            "description": "The hostname or IP address"
                        },
                        "port": {
                            "type": "number",
                            "title": "Port",
                            "default": 80
                        }
                    }
                }
            }
        }

    async def connect(self, params: Dict[str, Any]) -> bool:
        """Connect to the device"""
        try:
            # Your connection logic here
            return True
        except Exception as e:
            print(f"Connection error: {str(e)}")
            return False

    async def get_status(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Get device status"""
        return {
            "status": "Connected",
            "version": "1.0",
            "uptime": "1d 2h 3m"
        }

    async def get_metrics(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Get device metrics"""
        return {
            "cpu": 45.2,
            "memory": 60.5,
            "temperature": 36.6
        }

    def get_operations(self) -> List[Dict[str, Any]]:
        """Return available operations for this plugin"""
        return [
            {
                "id": "restart",
                "name": "Restart Device",
                "description": "Restart the device",
                "params": []
            },
            {
                "id": "reset",
                "name": "Factory Reset",
                "description": "Reset device to factory settings",
                "params": ["confirm"]
            }
        ]

    async def execute_operation(self, operation_id: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a custom operation"""
        if operation_id == "restart":
            # Restart logic here
            return {"success": True, "message": "Device restarted successfully"}
        elif operation_id == "reset":
            # Reset logic here
            if params.get("confirm") == "yes":
                return {"success": True, "message": "Device has been reset"}
            return {"success": False, "message": "Confirmation required"}
        else:
            return {"error": f"Unknown operation: {operation_id}"}
`,
    ui_schema: {
      title: "Example Plugin",
      description: "Example plugin configuration",
      type: "object",
      properties: {
        connection: {
          type: "object",
          title: "Connection Settings",
          required: ["hostname"],
          properties: {
            hostname: {
              type: "string",
              title: "Hostname/IP",
              description: "The hostname or IP address"
            },
            port: {
              type: "number",
              title: "Port",
              default: 80
            }
          }
        }
      }
    }
  });

  const [uiSchemaJson, setUiSchemaJson] = useState(JSON.stringify(pluginData.ui_schema || {}, null, 2));
  const [schemaError, setSchemaError] = useState<string | null>(null);

  // Plugin creation mutation
  const createPluginMutation = useMutation({
    mutationFn: (data: PluginCreate) => api.plugins.create(data),
    onSuccess: (plugin) => {
      navigate(`/plugins/${plugin.id}`);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPluginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setPluginData((prev) => ({ ...prev, code: value }));
    }
  };

  const handleUiSchemaChange = (value: string | undefined) => {
    if (value !== undefined) {
      setUiSchemaJson(value);

      try {
        const parsed = JSON.parse(value);
        setPluginData((prev) => ({ ...prev, ui_schema: parsed }));
        setSchemaError(null);
      } catch (e) {
        setSchemaError('Invalid JSON schema');
      }
    }
  };

  const handleSubmit = () => {
    if (
      pluginData.name &&
      pluginData.version &&
      pluginData.code &&
      !schemaError
    ) {
      createPluginMutation.mutate(pluginData as PluginCreate);
    }
  };

  const isValid =
    !!pluginData.name &&
    !!pluginData.version &&
    !!pluginData.code &&
    !schemaError;

  return (
    <PageContainer
      title={t('plugins:addPlugin')}
      breadcrumbs={[
        { text: t('common:navigation.dashboard'), link: '/' },
        { text: t('common:navigation.plugins'), link: '/plugins' },
        { text: t('plugins:addPlugin') },
      ]}
    >
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('plugins:basicInfo')}
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t('plugins:name')}
              name="name"
              value={pluginData.name || ''}
              onChange={handleInputChange}
              fullWidth
              required
              error={!pluginData.name && pluginData.name !== undefined}
              helperText={
                !pluginData.name && pluginData.name !== undefined
                  ? t('common:errors.required')
                  : ''
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label={t('plugins:version')}
              name="version"
              value={pluginData.version || ''}
              onChange={handleInputChange}
              fullWidth
              required
              error={!pluginData.version && pluginData.version !== undefined}
              helperText={
                !pluginData.version && pluginData.version !== undefined
                  ? t('common:errors.required')
                  : ''
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label={t('plugins:author')}
              name="author"
              value={pluginData.author || ''}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label={t('plugins:description')}
              name="description"
              value={pluginData.description || ''}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          mb: 3,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: 1.5,
            bgcolor: alpha(theme.palette.background.default, 0.5),
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="subtitle1">
            {t('plugins:pluginCode')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('plugins:codeDescription')}
          </Typography>
        </Box>

        <Editor
          height="500px"
          language="python"
          value={pluginData.code}
          onChange={handleCodeChange}
          theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: 'on',
          }}
        />
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          mb: 3,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: 1.5,
            bgcolor: alpha(theme.palette.background.default, 0.5),
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="subtitle1">
            {t('plugins:uiSchema')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('plugins:schemaDescription')}
          </Typography>
        </Box>

        <Editor
          height="300px"
          language="json"
          value={uiSchemaJson}
          onChange={handleUiSchemaChange}
          theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: 'on',
          }}
        />

        {schemaError && (
          <Box sx={{ p: 2, color: 'error.main' }}>
            <Typography variant="body2">{schemaError}</Typography>
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          component={Link}
          to="/plugins"
          startIcon={<ArrowBackIcon />}
        >
          {t('common:actions.cancel')}
        </Button>

        <Button
          variant="contained"
          color="primary"
          startIcon={createPluginMutation.isPending ? <CircularProgress size={20} /> : <SaveIcon />}
          onClick={handleSubmit}
          disabled={!isValid || createPluginMutation.isPending}
        >
          {t('common:actions.save')}
        </Button>
      </Box>

      {createPluginMutation.isError && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: alpha(theme.palette.error.main, 0.1),
            borderRadius: 1
          }}
        >
          <Typography color="error">
            {t('plugins:error.create')}
          </Typography>
        </Box>
      )}
    </PageContainer>
  );
};

export default NewPlugin;