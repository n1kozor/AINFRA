// src/hooks/settings/useLanguageSettings.ts
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { SelectChangeEvent } from '@mui/material';

export const useLanguageSettings = () => {
  const { i18n, t } = useTranslation(['settings']);
  const { enqueueSnackbar } = useSnackbar();
  const [isSaving, setIsSaving] = useState(false);

  // Get current language
  const language = i18n.language;

  // Available languages with their country codes for flags
  const availableLanguages = [
    { code: 'en', name: t('settings:language.english'), countryCode: 'GB' },
    { code: 'hu', name: t('settings:language.hungarian'), countryCode: 'HU' },
  ];

  const handleLanguageChange = useCallback((event: SelectChangeEvent | { target: { value: string } }) => {
    i18n.changeLanguage(event.target.value as string);
  }, [i18n]);

  const saveLanguagePreference = useCallback(() => {
    setIsSaving(true);

    // Simulate API call with timeout
    setTimeout(() => {
      setIsSaving(false);
      enqueueSnackbar(t('settings:notifications.languageSaved'), {
        variant: 'success',
      });
    }, 600);

    // Language is already saved by i18n when changed
    localStorage.setItem('i18nextLng', language);
  }, [enqueueSnackbar, t, language]);

  return {
    language,
    availableLanguages,
    handleLanguageChange,
    saveLanguagePreference,
    isSaving,
  };
};