// src/hooks/settings/useAppearanceSettings.ts
import { useState, useCallback } from 'react';
import { useThemeContext } from '../../context/ThemeContext';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

export const useAppearanceSettings = () => {
  const { mode, toggleMode } = useThemeContext();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation(['settings', 'common']);
  const [isSaving, setIsSaving] = useState(false);

  const savePreferences = useCallback(() => {
    setIsSaving(true);

    // Simulate API call with timeout
    setTimeout(() => {
      setIsSaving(false);
      enqueueSnackbar(t('settings:notifications.appearanceSaved'), {
        variant: 'success',
      });
    }, 600);

    // Actually save to localStorage is already handled by ThemeContext
  }, [enqueueSnackbar, t]);

  return {
    mode,
    toggleMode,
    savePreferences,
    isSaving,
  };
};