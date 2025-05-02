// src/context/ThemeContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  const mode = ['paper', 'windows31'].includes(themeVariant) ? 'light' : themeVariant as 'light' | 'dark';

  useEffect(() => {
    const storedTheme = localStorage.getItem('themeVariant') as ThemeVariant | null;
    if (storedTheme && ['light', 'dark', 'paper', 'windows31'].includes(storedTheme)) {
      setThemeVariant(storedTheme);
    } else {
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