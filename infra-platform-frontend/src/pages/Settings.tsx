import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  FormControlLabel,
  Switch,
  Grid,
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Translate as TranslateIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../context/ThemeContext';
import PageContainer from '../components/common/PageContainer';

const Settings = () => {
  const { t, i18n } = useTranslation(['common']);
  const { mode, toggleMode } = useThemeContext();
  const theme = useTheme();

  const handleLanguageChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <PageContainer title={t('common:navigation.settings')}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
              </Box>
              <Typography variant="h6">{t('common:theme.title')}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography>
                {mode === 'dark'
                  ? t('common:theme.currentDark')
                  : t('common:theme.currentLight')}
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={mode === 'dark'}
                    onChange={toggleMode}
                    color="primary"
                  />
                }
                label={mode === 'dark' ? t('common:theme.dark') : t('common:theme.light')}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: theme.palette.secondary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                <TranslateIcon />
              </Box>
              <Typography variant="h6">{t('common:language.title')}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="language-select-label">
                {t('common:language.select')}
              </InputLabel>
              <Select
                labelId="language-select-label"
                value={i18n.language}
                label={t('common:language.select')}
                onChange={handleLanguageChange}
              >
                <MenuItem value="en">{t('common:language.en')}</MenuItem>
                <MenuItem value="hu">{t('common:language.hu')}</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  color: theme.palette.info.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                <SettingsIcon />
              </Box>
              <Typography variant="h6">{t('common:settings.advanced')}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {t('common:settings.apiUrl')}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                {t('common:settings.version')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                1.0.0
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Settings;