// src/theme/index.ts
import { createTheme, ThemeOptions, PaletteMode } from '@mui/material';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';
import { paperTheme } from './paperTheme';

export type ThemeVariant = 'light' | 'dark' | 'paper';

export const getTheme = (themeVariant: ThemeVariant) => {
  let themeOptions: ThemeOptions;

  switch (themeVariant) {
    case 'light':
      themeOptions = lightTheme;
      break;
    case 'dark':
      themeOptions = darkTheme;
      break;
    case 'paper':
      themeOptions = paperTheme;
      break;
    default:
      themeOptions = lightTheme;
  }

  const mode: PaletteMode = themeVariant === 'paper' ? 'light' : themeVariant as PaletteMode;

  return createTheme({
    ...themeOptions,
    components: {
      ...themeOptions.components,
      MuiCssBaseline: {
        styleOverrides: {
          ...themeOptions.components?.MuiCssBaseline?.styleOverrides,
          body: {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: themeVariant === 'dark' ? 'transparent' : 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor:
                themeVariant === 'dark'
                  ? 'rgba(241, 245, 249, 0.2)'
                  : themeVariant === 'paper'
                    ? 'rgba(165, 142, 104, 0.4)'
                    : 'rgba(15, 23, 42, 0.15)',
              borderRadius: '8px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor:
                themeVariant === 'dark'
                  ? 'rgba(241, 245, 249, 0.3)'
                  : themeVariant === 'paper'
                    ? 'rgba(165, 142, 104, 0.6)'
                    : 'rgba(15, 23, 42, 0.25)',
            },
            // Adding smooth animations globally
            '& *': {
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
            },
            // Improved font rendering
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            // Use hardware acceleration when available
            transform: 'translateZ(0)',
            // Cool focus outline for accessibility
            '& *:focus-visible': {
              outline:
                themeVariant === 'dark'
                  ? '2px solid rgba(96, 165, 250, 0.5)'
                  : themeVariant === 'paper'
                    ? '2px dashed rgba(255, 107, 107, 0.5)'
                    : '2px solid rgba(59, 130, 246, 0.5)',
              outlineOffset: '2px',
            },
          },
          // Set root font size for more precise rem calculations
          html: {
            fontSize: '16px',
          },
          // Prevent blue highlight on touch
          'a, button, input, select, textarea, [tabindex]': {
            WebkitTapHighlightColor: 'transparent',
          },
          // Better image rendering
          'img, video': {
            maxWidth: '100%',
            display: 'block',
          },
          // Add a subtle transition for links
          a: {
            transition: 'color 0.2s ease, text-decoration 0.2s ease',
          },
          // Apply glass effect to certain components
          '.glass-effect': {
            backdropFilter: 'blur(10px)',
            backgroundColor:
              themeVariant === 'dark'
                ? 'rgba(15, 23, 42, 0.7)'
                : themeVariant === 'paper'
                  ? 'rgba(255, 251, 240, 0.8)'
                  : 'rgba(255, 255, 255, 0.7)',
            border: `1px solid ${
              themeVariant === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : themeVariant === 'paper'
                  ? 'rgba(214, 203, 174, 0.6)'
                  : 'rgba(255, 255, 255, 0.3)'
            }`,
          },
        },
      },
    },
    palette: {
      mode,
      ...(themeOptions.palette),
    },
  });
};