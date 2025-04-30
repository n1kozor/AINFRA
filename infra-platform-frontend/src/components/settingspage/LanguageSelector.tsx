// src/components/settingspage/LanguageSelector.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language;

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Box sx={{
      padding: '16px 20px',
      backgroundColor: '#f1f5f9',
      borderRadius: '8px',
    }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          cursor: 'pointer',
        }}
        onClick={() => handleLanguageChange('en')}
      >
        <Box sx={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: '2px solid',
          borderColor: currentLanguage === 'en' ? '#3b82f6' : '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 2,
        }}>
          {currentLanguage === 'en' && (
            <Box sx={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
            }} />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ mr: 1, fontWeight: 600 }}>
            GB
          </Typography>
          <Typography variant="body1">
            English
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => handleLanguageChange('hu')}
      >
        <Box sx={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: '2px solid',
          borderColor: currentLanguage === 'hu' ? '#3b82f6' : '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 2,
        }}>
          {currentLanguage === 'hu' && (
            <Box sx={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
            }} />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ mr: 1, fontWeight: 600 }}>
            HU
          </Typography>
          <Typography variant="body1">
            Hungarian
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LanguageSelector;