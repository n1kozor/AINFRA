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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  ExtensionRounded as PluginIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import PageContainer from '../../components/common/PageContainer';
import PluginForm from '../../components/PluginPage/PluginForm';
import { usePluginActions } from '../../hooks/plugins/usePluginActions';

const NewPlugin = () => {
  const { t } = useTranslation(['plugins', 'common']);
  const theme = useTheme();
  const { createMutation } = usePluginActions();

  const [pluginData, setPluginData] = useState({
    name: '',
    description: '',
    version: '1.0.0',
    author: '',
    is_active: true,
    config: '{\n  "title": "My Plugin",\n  "description": "Plugin configuration",\n  "type": "object",\n  "properties": {\n    "setting": {\n      "type": "string",\n      "title": "Example Setting",\n      "description": "This is an example setting"\n    }\n  }\n}',
    parsed: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!pluginData.name) {
      newErrors.name = t('common:errors.required');
    }

    if (!pluginData.version) {
      newErrors.version = t('common:errors.required');
    }

    try {
      if (pluginData.config) {
        JSON.parse(pluginData.config);
      }
    } catch (e) {
      newErrors.config = t('plugins:error.invalidJson');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    try {
      const configData = JSON.parse(pluginData.config || '{}');

      const submitData = {
        name: pluginData.name,
        description: pluginData.description,
        version: pluginData.version,
        author: pluginData.author,
        is_active: pluginData.is_active,
        config: pluginData.config,
        ui_schema: configData
      };

      createMutation.mutate(submitData);
    } catch (error) {
      setErrors({
        ...errors,
        config: t('plugins:error.invalidJson')
      });
    }
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
          <PluginForm
            pluginData={pluginData}
            setPluginData={setPluginData}
            errors={errors}
          />

          {createMutation.isError && (
            <Alert
              severity="error"
              sx={{ mt: 3, borderRadius: '10px' }}
            >
              {t('plugins:error.create')}
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
              {t('common:actions.cancel')}
            </Button>

            <Button
              variant="contained"
              startIcon={createMutation.isPending ?
                <CircularProgress size={20} color="inherit" /> :
                <SaveIcon />
              }
              onClick={handleSubmit}
              disabled={createMutation.isPending}
              sx={{ borderRadius: '10px' }}
            >
              {t('common:actions.save')}
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </PageContainer>
  );
};

export default NewPlugin;