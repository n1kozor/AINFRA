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
  const mode = ['paper', 'windows31'].includes(themeVariant) ? 'light' : themeVariant as 'light' | 'dark';

  useEffect(() => {
    // Check for stored theme
    const storedTheme = localStorage.getItem('themeVariant') as ThemeVariant | null;
    if (storedTheme && ['light', 'dark', 'paper', 'windows31'].includes(storedTheme)) {
      setThemeVariant(storedTheme);
    } else {
      // Optional: Check for user's system preference if no theme is stored
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDarkMode) {
        setThemeVariant('dark');
        localStorage.setItem('themeVariant', 'dark');
      }
    }
  }, []);

  const toggleMode = () => {
    const newThemeVariant: ThemeVariant =
      themeVariant === 'light'
        ? 'dark'
        : themeVariant === 'dark'
          ? 'paper'
          : themeVariant === 'paper'
            ? 'windows31'
            : 'light';

    setThemeVariant(newThemeVariant);
    localStorage.setItem('themeVariant', newThemeVariant);
  };

  const handleSetThemeVariant = (variant: ThemeVariant) => {
    setThemeVariant(variant);
    localStorage.setItem('themeVariant', variant);
  };

  // Apply Windows 3.1 specific body class if applicable
  useEffect(() => {
    if (themeVariant === 'windows31') {
      document.body.classList.add('windows31-theme');
    } else {
      document.body.classList.remove('windows31-theme');
    }

    return () => {
      document.body.classList.remove('windows31-theme');
    };
  }, [themeVariant]);

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