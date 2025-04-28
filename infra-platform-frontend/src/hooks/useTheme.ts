import { useContext } from 'react';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useThemeContext } from '../context/ThemeContext';

export const useTheme = () => {
  const muiTheme = useMuiTheme();
  const { mode, toggleMode } = useThemeContext();

  return {
    theme: muiTheme,
    mode,
    toggleMode,
    isDark: mode === 'dark',
    isLight: mode === 'light',
  };
};

export default useTheme;