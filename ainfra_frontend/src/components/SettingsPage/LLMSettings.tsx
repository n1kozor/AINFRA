// src/components/SettingsPage/LLMSettings.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  useTheme,
  alpha,
  Stack,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { SmartToy as AIIcon, Save as SaveIcon, Refresh as RefreshIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import SettingsCard from './SettingsCard';
import { llmApi } from '../../api';
import { LLMModel } from '../../types/llm';

const LLMSettings: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  // State
  const [settings, setSettings] = useState({
    openai_api_key: '',
    default_model: '',
    mcp_base_url: ''
  });
  const [models, setModels] = useState<LLMModel[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Load models when API key is available
  useEffect(() => {
    if (settings.openai_api_key) {
      fetchModels();
    }
  }, [settings.openai_api_key]);

  // Fetch settings from API
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await llmApi.getSettings();
      setSettings(data);

      // Mask the API key if it exists
      if (data.openai_api_key) {
        setApiKey('••••••••••••••••••••••••••');
      }

      // Set selected model to match current default
      if (data.default_model) {
        setSelectedModel(data.default_model);
      }
    } catch (err) {
      console.error('Error fetching LLM settings:', err);
      setError(t('settings.llm.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  // Fetch models from API
  const fetchModels = async (refresh = false) => {
    try {
      setModelsLoading(true);
      setError(null);
      const modelsList = await llmApi.getModels(refresh);

      // Filter to only show GPT models for conversation
      const filteredModels = modelsList.filter(model =>
          model.id.startsWith('gpt-') &&
          !model.id.includes('embed') &&
          !model.id.includes('search') &&
          !model.id.includes('audio') &&
          !model.id.includes('tts') &&
          !model.id.includes('transcribe')
      );

      setModels(filteredModels);
    } catch (err) {
      console.error('Error fetching models:', err);
      setError(t('settings.llm.errorLoading'));
    } finally {
      setModelsLoading(false);
    }
  };

  // Handle saving the API key
  const handleSaveApiKey = async () => {
    if (!apiKey || apiKey === '••••••••••••••••••••••••••') return;

    try {
      setLoading(true);
      setError(null);

      await llmApi.updateSettings({
        openai_api_key: apiKey
      });

      setSuccess(t('settings.llm.apiSaved'));
      setTimeout(() => setSuccess(null), 3000);

      // Refresh settings
      await fetchSettings();

      // Clear the input field for security
      setApiKey('••••••••••••••••••••••••••');
    } catch (err) {
      console.error('Error saving API key:', err);
      setError('Failed to save API key');
    } finally {
      setLoading(false);
    }
  };

  // Handle setting the selected model as default
  const handleSetAsDefault = async () => {
    if (!selectedModel) return;

    try {
      setLoading(true);
      setError(null);

      await llmApi.updateSettings({
        default_model: selectedModel
      });

      setSuccess(t('settings.llm.modelSaved'));
      setTimeout(() => setSuccess(null), 3000);

      // Refresh settings
      await fetchSettings();
    } catch (err) {
      console.error('Error saving model selection:', err);
      setError('Failed to save model selection');
    } finally {
      setLoading(false);
    }
  };

  // Handle API key change
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  return (
      <SettingsCard
          title={t('settings.llm.title')}
          icon={<AIIcon />}
          color="success"
          currentLabel={t('settings.llm.current')}
          currentValue={settings.default_model || t('settings.llm.notConfigured')}
      >
        {/* API Key Input */}
        <Box sx={{ mb: 3 }}>
          <TextField
              fullWidth
              label={t('settings.llm.apiKey')}
              variant="outlined"
              value={apiKey}
              onChange={handleApiKeyChange}
              type={showApiKey ? 'text' : 'password'}
              placeholder={t('settings.llm.apiKeyPlaceholder')}
              InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                          onClick={toggleShowApiKey}
                          edge="end"
                      >
                        {showApiKey ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                ),
              }}
              disabled={loading}
              sx={{ mb: 1 }}
          />
          <Button
              variant="contained"
              color="success"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              fullWidth
              onClick={handleSaveApiKey}
              disabled={loading || !apiKey || apiKey === '••••••••••••••••••••••••••'}
          >
            {t('settings.buttons.saveApiKey')}
          </Button>
        </Box>

        {/* Model Selection */}
        {settings.openai_api_key && (
            <Box sx={{
              width: '100%',
              p: theme.spacing(2),
              borderRadius: "20px",
              bgcolor: alpha(theme.palette.success.main, 0.06),
              border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
              mb: theme.spacing(2),
            }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {t('settings.llm.selectModel')}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <Select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    displayEmpty
                    disabled={modelsLoading}
                    fullWidth
                    sx={{ flex: 1 }}
                >
                  <MenuItem value="" disabled>
                    {t('settings.llm.selectModel')}
                  </MenuItem>
                  {models.map((model) => (
                      <MenuItem key={model.id} value={model.id}>
                        {model.name}
                      </MenuItem>
                  ))}
                </Select>

                <IconButton
                    onClick={() => fetchModels(true)}
                    disabled={modelsLoading}
                    color="success"
                >
                  {modelsLoading ? <CircularProgress size={24} /> : <RefreshIcon />}
                </IconButton>
              </Stack>

              {modelsLoading && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                    {t('settings.llm.loadingModels')}
                  </Typography>
              )}
            </Box>
        )}

        {/* Error and Success Messages */}
        {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
        )}

        {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
        )}

        {/* Set as Default Button */}
        {settings.openai_api_key && selectedModel && (
            <Box sx={{ mt: 'auto' }}>
              <Button
                  variant="contained"
                  color="success"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  fullWidth
                  onClick={handleSetAsDefault}
                  disabled={loading || !selectedModel}
              >
                {t('settings.buttons.setAsDefault')}
              </Button>
            </Box>
        )}
      </SettingsCard>
  );
};

export default LLMSettings;