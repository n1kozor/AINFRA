// src/components/settingspage/SettingsCard.tsx
import React, { ReactNode } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';

interface SettingsCardProps {
  title: string;
  icon: ReactNode;
  color: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  currentLabel: string;
  currentValue: string;
  children: ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  icon,
  color,
  currentLabel,
  currentValue,
  children
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: "20px",
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(2),
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}>
        <Box sx={{
          width: 40,
          height: 40,
          borderRadius: "20px",
          bgcolor: theme.palette[color].light,
          color: theme.palette[color].main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: theme.spacing(1.5),
        }}>
          {icon}
        </Box>
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
      </Box>

      {/* Current Setting */}
      <Box sx={{
        padding: theme.spacing(2),
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
          {currentLabel}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {currentValue}
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{
        padding: theme.spacing(2),
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