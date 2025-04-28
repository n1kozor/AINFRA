// Settings.tsx
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
  Card,
  CardContent,
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

  // Card style that will be reused
  const cardStyle = {
    borderRadius: 2,
    p: 0,
    height: '100%',
    boxShadow: theme.shadows[1],
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    transition: 'all 0.2s',
    '&:hover': {
      boxShadow: theme.shadows[3],
    }
  };

  // Section header style
  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    p: 3,
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
  };

  // Section content style
  const sectionContentStyle = {
    p: 3
  };

  // Icon style
  const iconStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    width: 40,
    height: 40,
    borderRadius: '12px',
    mr: 2
  };

  return (
    <PageContainer
      title={t('common:navigation.settings')}
      breadcrumbs={[
        { text: t('common:navigation.dashboard'), link: '/' },
        { text: t('common:navigation.settings') },
      ]}
    >
      <Grid container spacing={3}>
        {/* Theme Settings */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={cardStyle}>
            <Box sx={sectionHeaderStyle}>
              <Box sx={{
                ...iconStyle,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main
              }}>
                {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
              </Box>
              <Typography variant="h6" fontWeight={600}>
                {t('common:theme.title')}
              </Typography>
            </Box>
            <Box sx={sectionContentStyle}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {t('common:theme.currentMode')}
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {mode === 'dark' ? t('common:theme.dark') : t('common:theme.light')}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }}
              >
                <Typography variant="body1" fontWeight={500}>
                  {t('common:theme.toggleTheme')}
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
                  sx={{ mb: 0 }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Language Settings */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={cardStyle}>
            <Box sx={sectionHeaderStyle}>
              <Box sx={{
                ...iconStyle,
                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                color: theme.palette.secondary.main
              }}>
                <TranslateIcon />
              </Box>
              <Typography variant="h6" fontWeight={600}>
                {t('common:language.title')}
              </Typography>
            </Box>
            <Box sx={sectionContentStyle}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {t('common:language.current')}
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {i18n.language === 'en' ? t('common:language.en') : t('common:language.hu')}
                </Typography>
              </Box>

              <FormControl fullWidth variant="outlined">
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
            </Box>
          </Paper>
        </Grid>

        {/* System Information */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={cardStyle}>
            <Box sx={sectionHeaderStyle}>
              <Box sx={{
                ...iconStyle,
                bgcolor: alpha(theme.palette.info.main, 0.1),
                color: theme.palette.info.main
              }}>
                <SettingsIcon />
              </Box>
              <Typography variant="h6" fontWeight={600}>
                {t('common:settings.system')}
              </Typography>
            </Box>
            <Box sx={sectionContentStyle}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {t('common:settings.version')}
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  1.0.0
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {t('common:settings.apiUrl')}
                </Typography>
                <Box sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.background.default, 0.5),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                }}>
                  {import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>


      </Grid>
    </PageContainer>
  );
};

export default Settings;