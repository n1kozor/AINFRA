// src/components/settingspage/ExactCard.tsx
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface ExactCardProps {
  type: 'appearance' | 'language';
  mode: string;
  onToggleTheme: () => void;
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const ExactCard: React.FC<ExactCardProps> = ({
  type,
  mode,
  onToggleTheme,
  currentLanguage,
  onLanguageChange
}) => {
  const isAppearance = type === 'appearance';

  // EXACTLY SAME DIMENSIONS FOR BOTH CARDS
  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        height: '400px', // Exact same height
        borderRadius: '16px',
        border: '1px solid rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}
    >
      {/* Header - EXACT SAME HEIGHT */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        height: '72px',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}>
        {/* Icon box - EXACT SAME DIMENSIONS */}
        <Box sx={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: isAppearance ? '#e6f0ff' : '#e6f7ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isAppearance ? '#3b82f6' : '#06b6d4',
          mr: 2
        }}>
          {isAppearance ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"></path>
            </svg>
          )}
        </Box>

        {/* Title - EXACT SAME STYLE */}
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px' }}>
          {isAppearance ? 'Appearance' : 'Language'}
        </Typography>
      </Box>

      {/* Current Setting - EXACT SAME HEIGHT */}
      <Box sx={{
        padding: '16px',
        height: '72px',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569', mb: 0.5 }}>
          {isAppearance ? 'Current Theme' : 'Current Language'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          {isAppearance
            ? (mode === 'dark' ? 'Dark Mode' : 'Light Mode')
            : (currentLanguage === 'en' ? 'English' : 'Hungarian')}
        </Typography>
      </Box>

      {/* Content Area - EXACT SAME HEIGHT */}
      <Box sx={{
        padding: '16px',
        height: '196px', // Exact height to ensure button position
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Toggle Area - EXACTLY THE SAME HEIGHT */}
        <Box sx={{
          padding: '16px',
          backgroundColor: '#f1f5f9',
          borderRadius: '8px',
          height: '100px', // Fixed height so buttons align
          mb: 2,
        }}>
          {isAppearance ? (
            /* Theme Toggle */
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '100%'
            }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '16px', color: '#1e293b' }}>
                  Toggle Theme
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Switch between light and dark modes
                </Typography>
              </Box>

              <Box
                sx={{
                  width: '48px',
                  height: '24px',
                  backgroundColor: mode === 'dark' ? '#3b82f6' : '#cbd5e1',
                  borderRadius: '12px',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onClick={onToggleTheme}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#ffffff',
                    borderRadius: '50%',
                    top: '2px',
                    left: mode === 'dark' ? '26px' : '2px',
                    transition: 'left 0.2s',
                  }}
                />
              </Box>
            </Box>
          ) : (
            /* Language Selector */
            <Box sx={{ height: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  cursor: 'pointer',
                }}
                onClick={() => onLanguageChange('en')}
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
                onClick={() => onLanguageChange('hu')}
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
          )}
        </Box>

        {/* Button - EXACTLY THE SAME POSITION AND SIZE */}
        <Box
          component="button"
          sx={{
            width: '100%',
            height: '48px',
            mt: 'auto', // Push to bottom
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 600,
            gap: '8px',
          }}
        >
          <Box component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
          </Box>
          {isAppearance ? 'Save Preferences' : 'Save Language'}
        </Box>
      </Box>
    </Paper>
  );
};

export default ExactCard;