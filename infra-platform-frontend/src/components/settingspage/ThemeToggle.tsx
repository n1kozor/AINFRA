// src/components/settingspage/ThemeToggle.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useThemeContext } from '../../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { mode, toggleMode } = useThemeContext();

  return (
    <Box sx={{
      padding: '16px 20px',
      backgroundColor: '#f1f5f9',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
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
          transition: 'background-color 0.2s',
        }}
        onClick={toggleMode}
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
  );
};

export default ThemeToggle;