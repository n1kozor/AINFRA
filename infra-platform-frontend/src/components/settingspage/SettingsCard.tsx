// src/components/settingspage/SettingsCard.tsx
import React, { ReactNode } from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface SettingsCardProps {
  title: string;
  icon: string;
  currentLabel: string;
  currentValue: string;
  children: ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  icon,
  currentLabel,
  currentValue,
  children
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid rgba(0, 0, 0, 0.05)',
        borderRadius: '16px',
        overflow: 'hidden',
        height: '350px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        height: '72px',
      }}>
        <Box sx={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: icon === 'settings' ? '#e6f0ff' : '#e6fcff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '12px',
          color: icon === 'settings' ? '#3b82f6' : '#06b6d4',
        }}>
          {icon === 'settings' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 3h-6.5l-1-1h-7l-1 1H2v2h19z"></path>
              <path d="M5 15h14M5 12h14M5 9h14M5 18h14"></path>
            </svg>
          )}
        </Box>
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
      </Box>

      {/* Current Setting */}
      <Box sx={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        height: '68px',
      }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569' }}>
          {currentLabel}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          {currentValue}
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{
        padding: '16px 20px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {children}
      </Box>
    </Paper>
  );
};

export default SettingsCard;