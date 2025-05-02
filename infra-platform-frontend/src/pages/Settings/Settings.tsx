// src/pages/Settings.tsx
import React from 'react';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageContainer from '../../components/common/PageContainer';
import AppearanceSettings from '../../components/SettingsPage/AppearanceSettings';
import LanguageSettings from '../../components/SettingsPage/LanguageSettings';

const Settings: React.FC = () => {
  const { t } = useTranslation(['settings', 'common']);

  return (
    <PageContainer
      title={t('common:navigation.settings')}
      breadcrumbs={[
        { text: t('common:navigation.dashboard'), link: '/' },
        { text: t('common:navigation.settings') },
      ]}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AppearanceSettings />
        </Grid>

        <Grid item xs={12} md={6}>
          <LanguageSettings />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Settings;