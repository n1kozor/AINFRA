// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { getTheme, ThemeVariant } from '../theme';

interface ThemeContextType {
  themeVariant: ThemeVariant;
  mode: 'light' | 'dark';
  toggleMode: () => void;
  setThemeVariant: (variant: ThemeVariant) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeVariant: 'light',
  mode: 'light',
  toggleMode: () => {},
  setThemeVariant: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [themeVariant, setThemeVariant] = useState<ThemeVariant>('light');

  // Determine the PaletteMode based on the themeVariant
  const mode = themeVariant === 'paper' ? 'light' : themeVariant as 'light' | 'dark';

  useEffect(() => {
    // Check for stored theme
    const storedTheme = localStorage.getItem('themeVariant') as ThemeVariant | null;
    if (storedTheme && ['light', 'dark', 'paper'].includes(storedTheme)) {
      setThemeVariant(storedTheme);
    }
  }, []);

  const toggleMode = () => {
    const newThemeVariant: ThemeVariant =
      themeVariant === 'light'
        ? 'dark'
        : themeVariant === 'dark'
          ? 'paper'
          : 'light';

    setThemeVariant(newThemeVariant);
    localStorage.setItem('themeVariant', newThemeVariant);
  };

  const handleSetThemeVariant = (variant: ThemeVariant) => {
    setThemeVariant(variant);
    localStorage.setItem('themeVariant', variant);
  };

  const theme = getTheme(themeVariant);

  return (
    <ThemeContext.Provider value={{
      themeVariant,
      mode,
      toggleMode,
      setThemeVariant: handleSetThemeVariant,
    }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};