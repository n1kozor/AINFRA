// src/pages/Settings.tsx
import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageContainer from '../components/common/PageContainer';
import ExactCard from '../components/settingspage/ExactCard';
import { useThemeContext } from '../context/ThemeContext'; // Használjuk a hookot a közvetlen Context helyett

const Settings: React.FC = () => {
  const { t } = useTranslation(['settings', 'common']);
  const { mode, toggleMode } = useThemeContext(); // Használjuk a hookot
  const { i18n } = useTranslation();

  const handleThemeToggle = () => {
    toggleMode();
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <PageContainer
      title={t('common:navigation.settings')}
      breadcrumbs={[
        { text: t('common:navigation.dashboard'), link: '/' },
        { text: t('common:navigation.settings') },
      ]}
    >
      <Box sx={{ width: '100%', mb: 3 }}>
        <Typography variant="h3" fontWeight="bold">
          Settings
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ width: '100%' }}>
        <Grid item xs={12} md={6} sx={{ width: '100%' }}>
          <ExactCard
            type="appearance"
            mode={mode}
            onToggleTheme={handleThemeToggle}
            currentLanguage=""
            onLanguageChange={() => {}}
          />
        </Grid>

        <Grid item xs={12} md={6} sx={{ width: '100%' }}>
          <ExactCard
            type="language"
            mode=""
            onToggleTheme={() => {}}
            currentLanguage={i18n.language}
            onLanguageChange={handleLanguageChange}
          />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Settings;