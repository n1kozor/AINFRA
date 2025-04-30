import React from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  alpha,
  useTheme,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Editor from '@monaco-editor/react';

interface PluginFormProps {
  pluginData: any;
  setPluginData: (data: any) => void;
  errors?: Record<string, string>;
}

const PluginForm: React.FC<PluginFormProps> = ({
  pluginData,
  setPluginData,
  errors = {}
}) => {
  const { t } = useTranslation(['plugins', 'common']);
  const theme = useTheme();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPluginData({
      ...pluginData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleJsonChange = (value: string | undefined) => {
    if (value !== undefined) {
      try {
        const parsed = JSON.parse(value);
        setPluginData({
          ...pluginData,
          config: value,
          parsed: parsed
        });
      } catch (error) {
        // Handle JSON parsing error
        setPluginData({
          ...pluginData,
          config: value,
          parsed: null
        });
      }
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          {t('plugins:basicInfo')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label={t('plugins:name')}
            name="name"
            value={pluginData.name || ''}
            onChange={handleInputChange}
            fullWidth
            required
            error={!!errors.name}
            helperText={errors.name || ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
              }
            }}
          />

          <TextField
            label={t('plugins:version')}
            name="version"
            value={pluginData.version || ''}
            onChange={handleInputChange}
            fullWidth
            required
            error={!!errors.version}
            helperText={errors.version || ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label={t('plugins:author')}
            name="author"
            value={pluginData.author || ''}
            onChange={handleInputChange}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
              }
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={pluginData.is_active ?? true}
                  onChange={handleInputChange}
                  name="is_active"
                  color="success"
                />
              }
              label={t('plugins:active')}
            />
          </Box>
        </Box>

        <TextField
          label={t('plugins:description')}
          name="description"
          value={pluginData.description || ''}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={2}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
            }
          }}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          {t('plugins:pluginConfiguration')}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {t('plugins:jsonConfigDescription')}
        </Typography>

        <Editor
          height="300px"
          language="json"
          value={pluginData.config || '{}'}
          onChange={handleJsonChange}
          theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: 'on',
          }}
        />

        {errors.config && (
          <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
            {errors.config}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PluginForm;