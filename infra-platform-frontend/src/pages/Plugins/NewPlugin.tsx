import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Paper,
  TextField,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  ExtensionRounded as PluginIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import PageContainer from '../../components/common/PageContainer';
import { usePluginActions } from '../../hooks/plugins/usePluginActions';

// Helper function to safely display any value as string
const safeDisplay = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value).length > 50
      ? JSON.stringify(value).substring(0, 50) + '...'
      : JSON.stringify(value);
  }
  return String(value);
};

const NewPlugin = () => {
  const { t } = useTranslation(['plugins', 'common']);
  const theme = useTheme();
  const { createMutation } = usePluginActions();

  const [pluginJson, setPluginJson] = useState('');
  const [parsedPlugin, setParsedPlugin] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [parseSuccess, setParseSuccess] = useState(false);

  // Validate the plugin JSON
  const validatePluginJson = (pluginData) => {
    // Check for required fields
    const requiredFields = ['name', 'description', 'version', 'author'];
    const missingFields = requiredFields.filter(field => !pluginData[field]);

    if (missingFields.length > 0) {
      return {
        valid: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      };
    }

    // Check if ui_schema exists
    if (!pluginData.ui_schema) {
      return {
        valid: false,
        error: 'Missing UI schema'
      };
    }

    return { valid: true };
  };

  // Handle parsing the plugin JSON
  const handleParseJson = () => {
    try {
      setValidationError('');
      setParseSuccess(false);

      if (!pluginJson.trim()) {
        setValidationError('Please enter plugin JSON');
        return;
      }

      const parsed = JSON.parse(pluginJson);
      const validation = validatePluginJson(parsed);

      if (!validation.valid) {
        setValidationError(validation.error);
        return;
      }

      setParsedPlugin(parsed);
      setParseSuccess(true);
    } catch (error) {
      setValidationError(`Invalid JSON format: ${error.message}`);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!parsedPlugin) {
      setValidationError('Please validate the plugin JSON first');
      return;
    }

    createMutation.mutate(parsedPlugin);
  };

  return (
    <PageContainer
      title={t('plugins:addPlugin')}
      icon={<PluginIcon />}
      breadcrumbs={[
        { text: t('common:navigation.dashboard'), link: '/' },
        { text: t('common:navigation.plugins'), link: '/plugins' },
        { text: t('plugins:addPlugin') },
      ]}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '16px',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            mb: 3
          }}
        >
          <Typography variant="h6" gutterBottom>
            {t('plugins:importPluginJson')}
          </Typography>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Paste the full plugin JSON configuration including name, description, version, author, code, and UI schema.
          </Typography>

          <TextField
            label="Plugin JSON"
            multiline
            fullWidth
            rows={15}
            value={pluginJson}
            onChange={(e) => setPluginJson(e.target.value)}
            placeholder='{
  "name": "Plugin Name",
  "description": "Plugin Description",
  "version": "1.0.0",
  "author": "Author Name",
  "code": "...",
  "ui_schema": {...}
}'
            sx={{
              mb: 2,
              fontFamily: 'monospace',
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px'
              }
            }}
            error={!!validationError}
            helperText={validationError}
          />

          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={handleParseJson}
            sx={{ borderRadius: '10px', mb: 3 }}
          >
            Validate JSON
          </Button>

          {parseSuccess && (
            <Alert
              severity="success"
              sx={{ mb: 3, borderRadius: '10px' }}
            >
              Plugin JSON successfully validated
            </Alert>
          )}

          {parsedPlugin && (
            <>
              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Plugin Details
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Name
                </Typography>
                <Typography variant="body1">
                  {safeDisplay(parsedPlugin.name)}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Description
                </Typography>
                <Typography variant="body1">
                  {safeDisplay(parsedPlugin.description)}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Version
                </Typography>
                <Typography variant="body1">
                  {safeDisplay(parsedPlugin.version)}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Author
                </Typography>
                <Typography variant="body1">
                  {safeDisplay(parsedPlugin.author)}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  UI Schema
                </Typography>
                <Typography variant="body1" sx={{ color: 'success.main' }}>
                  UI Schema is valid and included
                </Typography>
              </Box>

              {parsedPlugin.code && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Code
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'success.main' }}>
                    Code is included ({typeof parsedPlugin.code === 'string' ? parsedPlugin.code.length : 'unknown'} characters)
                  </Typography>
                </Box>
              )}
            </>
          )}

          {createMutation.isError && (
            <Alert
              severity="error"
              sx={{ mt: 3, borderRadius: '10px' }}
            >
              {typeof createMutation.error === 'string' ? createMutation.error : 'Failed to create plugin'}
            </Alert>
          )}

          {createMutation.isSuccess && (
            <Alert
              severity="success"
              sx={{ mt: 3, borderRadius: '10px' }}
            >
              Plugin created successfully
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              component={Link}
              to="/plugins"
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              sx={{ borderRadius: '10px' }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              startIcon={createMutation.isPending ?
                <CircularProgress size={20} color="inherit" /> :
                <SaveIcon />
              }
              onClick={handleSubmit}
              disabled={createMutation.isPending || !parsedPlugin}
              sx={{ borderRadius: '10px' }}
            >
              Save Plugin
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </PageContainer>
  );
};

export default NewPlugin;