// Settings.tsx
import React from 'react';
import {
  Grid,
  Typography,
  Box,
  FormControlLabel,
  Switch,
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  useTheme,
  alpha,
  Card,
  Divider,
  TextField,
  IconButton,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Translate as TranslateIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  CloudSync as CloudSyncIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../context/ThemeContext';
import PageContainer from '../components/common/PageContainer';
import DashboardCard from '../components/dashboard/DashboardCard';

const Settings = () => {
  const { t, i18n } = useTranslation(['settings', 'common']);
  const { mode, toggleMode } = useThemeContext();
  const theme = useTheme();

  const [apiUrl, setApiUrl] = React.useState(import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1');
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = React.useState(true);
  const [syncInterval, setSyncInterval] = React.useState('30');
  const [logRetentionDays, setLogRetentionDays] = React.useState('90');

  const handleLanguageChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
  };

  const handleSaveApiConfig = () => {
    // Save API configuration
    console.log('Saving API URL:', apiUrl);
    // Implementation would depend on how you store configuration
  };

  const handleRefreshSystem = () => {
    console.log('Refreshing system data');
    // Implementation for refreshing system data
  };

  const handleSavePreferences = () => {
    console.log('Saving preferences');
    // Implementation for saving user preferences
  };

  const toggleOptionStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    p: 2,
    mb: 2,
    borderRadius: 2,
    bgcolor: alpha(theme.palette.primary.main, 0.06),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    transition: 'all 0.2s',
    '&:hover': {
      bgcolor: alpha(theme.palette.primary.main, 0.1),
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
    }
  };

  const settingItemStyle = {
    mb: 3,
    '&:last-child': {
      mb: 0
    }
  };

  const settingLabelStyle = {
    fontWeight: 500,
    color: theme.palette.text.primary,
    mb: 0.5,
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
        {/* Appearance Settings */}
        <Grid item xs={12} md={6} lg={4}>
          <DashboardCard
            title={t('settings:appearance.title')}
            icon={mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
            color="primary"
          >
            <Box sx={{ p: 2 }}>
              <Box sx={settingItemStyle}>
                <Typography variant="subtitle2" sx={settingLabelStyle}>
                  {t('settings:appearance.currentTheme')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {mode === 'dark'
                    ? t('settings:appearance.darkMode')
                    : t('settings:appearance.lightMode')}
                </Typography>
              </Box>

              <Box sx={toggleOptionStyle}>
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    {t('settings:appearance.toggleTheme')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('settings:appearance.toggleDescription')}
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={mode === 'dark'}
                      onChange={toggleMode}
                      color="primary"
                    />
                  }
                  label=""
                  sx={{ mb: 0 }}
                />
              </Box>

              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                sx={{
                  mt: 2,
                  width: '100%',
                  py: 1.25,
                  borderRadius: '12px',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  }
                }}
                onClick={handleSavePreferences}
              >
                {t('settings:buttons.savePreferences')}
              </Button>
            </Box>
          </DashboardCard>
        </Grid>

        {/* Language Settings */}
        <Grid item xs={12} md={6} lg={4}>
          <DashboardCard
            title={t('settings:language.title')}
            icon={<TranslateIcon />}
            color="info"
          >
            <Box sx={{ p: 2 }}>
              <Box sx={settingItemStyle}>
                <Typography variant="subtitle2" sx={settingLabelStyle}>
                  {t('settings:language.current')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {i18n.language === 'en'
                    ? t('settings:language.english')
                    : t('settings:language.hungarian')}
                </Typography>
              </Box>

              <FormControl fullWidth variant="outlined" sx={{ mt: 3, mb: 3 }}>
                <InputLabel id="language-select-label">
                  {t('settings:language.select')}
                </InputLabel>
                <Select
                  labelId="language-select-label"
                  value={i18n.language}
                  label={t('settings:language.select')}
                  onChange={handleLanguageChange}
                  sx={{
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.info.main, 0.2),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.info.main,
                    },
                  }}
                >
                  <MenuItem value="en">{t('settings:language.english')}</MenuItem>
                  <MenuItem value="hu">{t('settings:language.hungarian')}</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="info"
                startIcon={<SaveIcon />}
                sx={{
                  width: '100%',
                  py: 1.25,
                  borderRadius: '12px',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  }
                }}
                onClick={handleSavePreferences}
              >
                {t('settings:buttons.saveLanguage')}
              </Button>
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Settings;