// src/components/SettingsPage/AppearanceSettings.tsx
import React from 'react';
import {
  Box,
  Typography,
  Switch,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Save as SaveIcon,
  DesktopWindows as DesktopWindowsIcon,
  ColorLens as ColorLensIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../context/ThemeContext';
import SettingsCard from './SettingsCard';

const AppearanceSettings: React.FC = () => {
  const { t } = useTranslation(['settings', 'common']);
  const theme = useTheme();
  const { themeVariant, toggleMode, setThemeVariant } = useThemeContext();

  const getThemeIcon = () => {
    switch (themeVariant) {
      case 'dark':
        return <DarkModeIcon />;
      case 'light':
        return <LightModeIcon />;
      case 'paper':
        return <ColorLensIcon />;
      case 'windows31':
        return <DesktopWindowsIcon />;
      default:
        return <LightModeIcon />;
    }
  };

  const getThemeName = () => {
    switch (themeVariant) {
      case 'dark':
        return t('settings:appearance.darkMode');
      case 'light':
        return t('settings:appearance.lightMode');
      case 'paper':
        return t('settings:appearance.paperMode');
      case 'windows31':
        return t('settings:appearance.windowsMode');
      default:
        return t('settings:appearance.lightMode');
    }
  };

  const handleSavePreferences = () => {
    console.log('Theme preferences saved');
  };

  return (
    <SettingsCard
      title={t('settings:appearance.title')}
      icon={getThemeIcon()}
      color="primary"
      currentLabel={t('settings:appearance.currentTheme')}
      currentValue={getThemeName()}
    >

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: theme.spacing(1),
        mb: theme.spacing(2),
      }}>
        <Button
          variant={themeVariant === 'light' ? 'contained' : 'outlined'}
          size="small"
          startIcon={<LightModeIcon />}
          onClick={() => setThemeVariant('light')}
          color="primary"
        >
          {t('theme.light')}
        </Button>
        <Button
          variant={themeVariant === 'dark' ? 'contained' : 'outlined'}
          size="small"
          startIcon={<DarkModeIcon />}
          onClick={() => setThemeVariant('dark')}
          color="primary"
        >
          {t('theme.dark')}
        </Button>
        <Button
          variant={themeVariant === 'paper' ? 'contained' : 'outlined'}
          size="small"
          startIcon={<ColorLensIcon />}
          onClick={() => setThemeVariant('paper')}
          color="primary"
        >
          {t('theme.paper')}
        </Button>
        <Button
          variant={themeVariant === 'windows31' ? 'contained' : 'outlined'}
          size="small"
          startIcon={<DesktopWindowsIcon />}
          onClick={() => setThemeVariant('windows31')}
          color="primary"
        >
          {t('theme.windows31')}
        </Button>
      </Box>

      <Box sx={{ mt: 'auto' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          fullWidth
          onClick={handleSavePreferences}
        >
          {t('settings:buttons.savePreferences')}
        </Button>
      </Box>
    </SettingsCard>
  );
};

export default AppearanceSettings;