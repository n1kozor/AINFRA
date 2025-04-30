// src/components/settingspage/AppearanceSettings.tsx
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
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../context/ThemeContext';
import SettingsCard from './SettingsCard';

const AppearanceSettings: React.FC = () => {
  const { t } = useTranslation(['settings', 'common']);
  const theme = useTheme();
  const { mode, toggleMode } = useThemeContext();

  const handleSavePreferences = () => {
    console.log('Theme preferences saved');
  };

  return (
    <SettingsCard
      title={t('settings:appearance.title')}
      icon={mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
      color="primary"
      currentLabel={t('settings:appearance.currentTheme')}
      currentValue={mode === 'dark'
        ? t('settings:appearance.darkMode')
        : t('settings:appearance.lightMode')}
    >
      <Box sx={{
        width: '100%',
        height: '100px', // FIXED HEIGHT
        p: 2,
        borderRadius: '8px',
        bgcolor: alpha(theme.palette.primary.main, 0.06),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Box>
          <Typography variant="body1" fontWeight={600}>
            {t('settings:appearance.toggleTheme')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('settings:appearance.toggleDescription')}
          </Typography>
        </Box>

        <Switch
          checked={mode === 'dark'}
          onChange={toggleMode}
          color="primary"
        />
      </Box>

      <Box sx={{ mt: 'auto', pt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          sx={{
            width: '100%',
            height: '44px', // FIXED HEIGHT
            borderRadius: '8px',
          }}
          onClick={handleSavePreferences}
        >
          {t('settings:buttons.savePreferences')}
        </Button>
      </Box>
    </SettingsCard>
  );
};

export default AppearanceSettings;