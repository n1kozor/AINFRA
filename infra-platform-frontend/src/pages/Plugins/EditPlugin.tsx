import { useState, useEffect, ChangeEvent } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  TextField,
  Divider,
  FormControlLabel,
  Switch,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  ExtensionRounded as PluginIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

import PageContainer from '../../components/common/PageContainer';
import { usePlugin } from '../../hooks/plugins/usePlugins';
import Editor from '@monaco-editor/react';
import {PluginUpdate} from "../../types/plugin.ts";

const EditPlugin = () => {
  const { t } = useTranslation(['plugins', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { data: plugin, isLoading, error } = usePlugin(id ? parseInt(id) : 0);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    version: string;
    author: string;
    code: string;
    is_active: boolean;
  }>({
    name: '',
    description: '',
    version: '',
    author: '',
    code: '',
    is_active: true
  });

  const [uiSchema, setUiSchema] = useState<string>('{}');
  const [uiSchemaError, setUiSchemaError] = useState<string>('');
  const [requestError, setRequestError] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (plugin) {
      setFormData({
        name: plugin.name || '',
        description: plugin.description || '',
        version: plugin.version || '',
        author: plugin.author || '',
        code: plugin.code || '',
        is_active: plugin.is_active
      });

      if (plugin.ui_schema) {
        try {
          const uiSchemaStr = JSON.stringify(plugin.ui_schema, null, 2);
          setUiSchema(uiSchemaStr);
        } catch (e) {
          console.error("Error parsing UI schema:", e);
          setUiSchema('{}');
        }
      } else {
        setUiSchema('{}');
      }
    }
  }, [plugin]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    const newValue = name === 'is_active' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleCodeChange = (value: string | undefined) => {
    setFormData(prev => ({ ...prev, code: value || '' }));
  };

  const handleUiSchemaChange = (value: string | undefined) => {
    setUiSchema(value || '{}');
    if (uiSchemaError) setUiSchemaError('');
  };

  const validateUiSchema = (): boolean => {
    try {
      JSON.parse(uiSchema);
      setUiSchemaError('');
      return true;
    } catch (e) {
      if (e instanceof Error) {
        setUiSchemaError(`Invalid JSON: ${e.message}`);
      } else {
        setUiSchemaError(`Invalid JSON: Unknown error`);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    setRequestError('');

    if (!validateUiSchema()) {
      return;
    }

    const updateData: PluginUpdate = {
      name: formData.name,
      description: formData.description,
      version: formData.version,
      author: formData.author,
      code: formData.code,
      is_active: formData.is_active
    };

    try {
      updateData.ui_schema = JSON.parse(uiSchema);
    } catch (e) {
      if (e instanceof Error) {
        setUiSchemaError(`Error parsing UI schema: ${e.message}`);
      } else {
        setUiSchemaError(`Error parsing UI schema: Unknown error`);
      }
      return;
    }

    setIsUpdating(true);

    try {
      if (id) {
        const response = await axios.put(`/api/v1/plugins/${id}`, updateData);
        console.log("Update successful:", response.data);
        navigate(`/plugins/${id}`);
      }
    } catch (error) {
      console.error("Update error:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error response:", error.response);
        setRequestError(`Error: ${JSON.stringify(error.response.data)}`);
      } else if (error instanceof Error) {
        setRequestError(`Error: ${error.message}`);
      } else {
        setRequestError('An unknown error occurred');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
        <PageContainer title={t('plugins:editPlugin')}>
          <Box display="flex" justifyContent="center" alignItems="center" height="400px">
            <CircularProgress />
          </Box>
        </PageContainer>
    );
  }

  if (error || !plugin) {
    return (
        <PageContainer title={t('plugins:editPlugin')}>
          <Alert severity="error">
            {t('plugins:error.loading')}
          </Alert>
          <Button
              component={Link}
              to="/plugins"
              variant="outlined"
              sx={{ mt: 2 }}
          >
            {t('common:actions.back')}
          </Button>
        </PageContainer>
    );
  }

  return (
      <PageContainer
          title={t('plugins:editPlugin')}
          subtitle={plugin.name}
          icon={<PluginIcon />}
          breadcrumbs={[
            { text: t('common:navigation.dashboard'), link: '/' },
            { text: t('common:navigation.plugins'), link: '/plugins' },
            { text: plugin.name, link: `/plugins/${id}` },
            { text: t('plugins:editPlugin') },
          ]}
      >
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
          <Paper>
            <Box p={3}>
              <Typography variant="h6" gutterBottom>
                {t('plugins:basicInformation')}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <TextField
                    label={t('plugins:fields.name')}
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />

                <TextField
                    label={t('plugins:fields.description')}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={2}
                    sx={{ mb: 2 }}
                />

                <TextField
                    label={t('plugins:fields.version')}
                    name="version"
                    value={formData.version}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />

                <TextField
                    label={t('plugins:fields.author')}
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <FormControlLabel
                    control={
                      <Switch
                          checked={formData.is_active}
                          onChange={handleInputChange}
                          name="is_active"
                      />
                    }
                    label={t('plugins:fields.active')}
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                {t('plugins:code')}
              </Typography>

              <Box sx={{ mb: 3, border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', overflow: 'hidden' }}>
                <Editor
                    height="300px"
                    language="javascript"
                    value={formData.code}
                    onChange={handleCodeChange}
                    theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      wordWrap: 'on',
                      automaticLayout: true,
                    }}
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                {t('plugins:uiSchema')}
              </Typography>

              <Box sx={{ mb: 3, border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', overflow: 'hidden' }}>
                <Editor
                    height="300px"
                    language="json"
                    value={uiSchema}
                    onChange={handleUiSchemaChange}
                    theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      wordWrap: 'on',
                      automaticLayout: true,
                    }}
                />
              </Box>

              {uiSchemaError && (
                  <Alert severity="error" sx={{ mt: 1, mb: 3 }}>
                    {uiSchemaError}
                  </Alert>
              )}

              {requestError && (
                  <Alert severity="error" sx={{ mt: 3 }}>
                    {requestError}
                  </Alert>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                    component={Link}
                    to={`/plugins/${id}`}
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                >
                  {t('common:actions.cancel')}
                </Button>

                <Button
                    variant="contained"
                    startIcon={isUpdating ?
                        <CircularProgress size={20} color="inherit" /> :
                        <SaveIcon />
                    }
                    onClick={handleSubmit}
                    disabled={isUpdating}
                >
                  {t('common:actions.save')}
                </Button>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </PageContainer>
  );
};

export default EditPlugin;