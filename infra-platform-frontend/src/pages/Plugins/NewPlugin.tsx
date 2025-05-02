// src/pages/NewPlugin.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
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

// Match whatever your backend expects for creation
interface PluginCreate {
  name: string;
  description: string;
  version: string;
  author: string;
  ui_schema: any;
  code: string;           // now required
  [key: string]: any;
}

// Safely render any field
const safeDisplay = (value: any): string => {
  if (value == null) return '';
  if (typeof value === 'object') {
    const s = JSON.stringify(value);
    return s.length > 50 ? s.slice(0, 50) + '…' : s;
  }
  return String(value);
};

const NewPlugin: React.FC = () => {
  const { t } = useTranslation(['plugins', 'common']);
  const { createMutation } = usePluginActions();

  // If you ever pull initial JSON from props/location, do:
  // const initial = props.location.state?.pluginJson ?? '';
  // and then:
  const [pluginJson, setPluginJson] = useState<string>('');
  const [parsedPlugin, setParsedPlugin] = useState<PluginCreate | null>(null);
  const [validationError, setValidationError] = useState<string>('');
  const [parseSuccess, setParseSuccess] = useState<boolean>(false);

  // enforce that `code` is present (so createMutation gets a string)
  const validatePluginJson = (data: any): { valid: boolean; error?: string } => {
    const required = [
      'name',
      'description',
      'version',
      'author',
      'code',
      'ui_schema',
    ];
    const missing = required.filter((f) => data[f] == null);
    if (missing.length) {
      return { valid: false, error: `Missing required: ${missing.join(', ')}` };
    }
    return { valid: true };
  };

  const handleParseJson = () => {
    setValidationError('');
    setParseSuccess(false);

    if (!pluginJson.trim()) {
      setValidationError('Please enter plugin JSON');
      return;
    }

    let data: any;
    try {
      data = JSON.parse(pluginJson);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setValidationError(`Invalid JSON format: ${msg}`);
      return;
    }

    const { valid, error } = validatePluginJson(data);
    if (!valid) {
      setValidationError(error!);
      return;
    }

    // Now safe to cast: code is a string, ui_schema exists, etc.
    const ready: PluginCreate = {
      ...data,
      code: data.code as string,
    };

    setParsedPlugin(ready);
    setParseSuccess(true);
  };

  const handleSubmit = () => {
    if (!parsedPlugin) {
      setValidationError('Please validate the plugin JSON first');
      return;
    }
    createMutation.mutate(parsedPlugin);
  };

  // react-query style
  const { status, error } = createMutation;
  const isLoading = status === 'pending';
  const isError = status === 'error';
  const isSuccess = status === 'success';

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Paper>
            <Box p={3}>
              <Typography variant="h6" gutterBottom>
                {t('plugins:importPluginJson')}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Paste the full plugin JSON (name, description, version, author, code, ui_schema).
              </Typography>

              <TextField
                  label="Plugin JSON"
                  multiline
                  fullWidth
                  rows={15}
                  value={pluginJson}
                  onChange={(e) => setPluginJson(e.target.value ?? '')}
                  placeholder={`{
  "name": "My Plugin",
  "description": "What it does...",
  "version": "1.0.0",
  "author": "Me",
  "code": "function run() {…}",
  "ui_schema": { … }
}`}
                  sx={{ mb: 2, fontFamily: 'monospace' }}
                  error={!!validationError}
                  helperText={validationError}
              />

              <Button variant="outlined" startIcon={<UploadIcon />} onClick={handleParseJson} sx={{ mb: 3 }}>
                Validate JSON
              </Button>

              {parseSuccess && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Plugin JSON successfully validated
                  </Alert>
              )}

              {parsedPlugin && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" gutterBottom>
                      Plugin Details
                    </Typography>

                    {(['name', 'description', 'version', 'author'] as const).map((field) => (
                        <Box key={field} sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="textSecondary">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </Typography>
                          <Typography variant="body1">{safeDisplay(parsedPlugin[field])}</Typography>
                        </Box>
                    ))}

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        UI Schema
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'success.main' }}>
                        Present and valid
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Code
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'success.main' }}>
                        {parsedPlugin.code.length} characters
                      </Typography>
                    </Box>
                  </>
              )}

              {isError && (
                  <Alert severity="error" sx={{ mt: 3 }}>
                    {error instanceof Error ? error.message : 'Failed to create plugin'}
                  </Alert>
              )}

              {isSuccess && (
                  <Alert severity="success" sx={{ mt: 3 }}>
                    Plugin created successfully
                  </Alert>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button component={Link} to="/plugins" startIcon={<ArrowBackIcon />} variant="outlined">
                  Cancel
                </Button>
                <Button
                    variant="contained"
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    onClick={handleSubmit}
                    disabled={isLoading || !parsedPlugin}
                >
                  Save Plugin
                </Button>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </PageContainer>
  );
};

export default NewPlugin;
