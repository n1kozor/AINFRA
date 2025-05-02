// src/components/SettingsPage/LanguageSettings.tsx
import React from 'react';
import {
  Box,
  FormControlLabel,
  Button,
  useTheme,
  alpha,
  Stack,
  Radio,
  RadioGroup,
} from '@mui/material';
import { Translate as TranslateIcon, Save as SaveIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import SettingsCard from './SettingsCard';

const LanguageSettings: React.FC = () => {
  const { t, i18n } = useTranslation(['settings', 'common']);
  const theme = useTheme();
  const currentLanguage = i18n.language;

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  const handleSaveLanguage = () => {
    console.log('Language preferences saved');
  };

  return (
    <SettingsCard
      title={t('settings:language.title')}
      icon={<TranslateIcon />}
      color="info"
      currentLabel={t('settings:language.current')}
      currentValue={currentLanguage === 'en'
        ? t('settings:language.english')
        : t('settings:language.hungarian')}
    >
      <Box sx={{
        width: '100%',
        p: theme.spacing(2),
        borderRadius: "20px",
        bgcolor: alpha(theme.palette.info.main, 0.06),
        border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
        mb: theme.spacing(2),
      }}>
        <RadioGroup
          value={currentLanguage}
          onChange={handleLanguageChange}
        >
          <Stack spacing={1}>
            <FormControlLabel
              value="en"
              control={<Radio color="info" />}
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span role="img" aria-label="English">🇬🇧</span>
                  <span>{t('settings:language.english')}</span>
                </Stack>
              }
              sx={{
                p: 0.5,
                ml: 0,
                borderRadius: "20px",
              }}
            />
            <FormControlLabel
              value="hu"
              control={<Radio color="info" />}
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span role="img" aria-label="Hungarian">🇭🇺</span>
                  <span>{t('settings:language.hungarian')}</span>
                </Stack>
              }
              sx={{
                p: 0.5,
                ml: 0,
                borderRadius: "20px",
              }}
            />
          </Stack>
        </RadioGroup>
      </Box>

      <Box sx={{ mt: 'auto' }}>
        <Button
          variant="contained"
          color="info"
          startIcon={<SaveIcon />}
          fullWidth
          onClick={handleSaveLanguage}
        >
          {t('settings:buttons.saveLanguage')}
        </Button>
      </Box>
    </SettingsCard>
  );
};

export default LanguageSettings;