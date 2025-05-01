// src/theme/index.ts
import { createTheme, ThemeOptions, PaletteMode } from '@mui/material';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';
import { paperTheme } from './paperTheme';
import { windows31Theme } from './windows31Theme';

export type ThemeVariant = 'light' | 'dark' | 'paper' | 'windows31';

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
    case 'windows31':
      themeOptions = windows31Theme;
      break;
    default:
      themeOptions = lightTheme;
  }

  const mode: PaletteMode =
    themeVariant === 'paper' || themeVariant === 'windows31'
      ? 'light'
      : themeVariant as PaletteMode;

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
              width: themeVariant === 'windows31' ? '16px' : '8px',
              height: themeVariant === 'windows31' ? '16px' : '8px',
            },
            '&::-webkit-scrollbar-track': {
              background:
                themeVariant === 'windows31'
                  ? '#C0C0C0'
                  : 'transparent',
              ...(themeVariant === 'windows31' && {
                border: '1px solid #808080',
                borderLeft: '1px solid #FFFFFF',
                borderTop: '1px solid #FFFFFF',
              }),
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor:
                themeVariant === 'dark'
                  ? 'rgba(241, 245, 249, 0.2)'
                  : themeVariant === 'paper'
                    ? 'rgba(165, 142, 104, 0.4)'
                    : themeVariant === 'windows31'
                      ? '#808080'
                      : 'rgba(15, 23, 42, 0.15)',
              borderRadius: themeVariant === 'windows31' ? 0 : '8px',
              ...(themeVariant === 'windows31' && {
                border: '1px solid #C0C0C0',
                borderRight: '1px solid #000000',
                borderBottom: '1px solid #000000',
              }),
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor:
                themeVariant === 'dark'
                  ? 'rgba(241, 245, 249, 0.3)'
                  : themeVariant === 'paper'
                    ? 'rgba(165, 142, 104, 0.6)'
                    : themeVariant === 'windows31'
                      ? '#606060'
                      : 'rgba(15, 23, 42, 0.25)',
            },
            '&::-webkit-scrollbar-button': themeVariant === 'windows31' ? {
              backgroundColor: '#C0C0C0',
              border: '1px solid #808080',
              borderLeft: '1px solid #FFFFFF',
              borderTop: '1px solid #FFFFFF',
              display: 'block',
              height: '16px',
            } : {},
            // Adding smooth animations globally (except for Windows 3.1 theme)
            '& *': {
              transition: themeVariant === 'windows31'
                ? 'none'
                : 'background-color 0.2s ease, border-color 0.2s ease',
            },
            // Improved font rendering
            WebkitFontSmoothing: themeVariant === 'windows31' ? 'none' : 'antialiased',
            MozOsxFontSmoothing: themeVariant === 'windows31' ? 'none' : 'grayscale',
            // Use hardware acceleration when available
            transform: 'translateZ(0)',
            // Cool focus outline for accessibility
            '& *:focus-visible': {
              outline:
                themeVariant === 'dark'
                  ? '2px solid rgba(96, 165, 250, 0.5)'
                  : themeVariant === 'paper'
                    ? '2px dashed rgba(255, 107, 107, 0.5)'
                    : themeVariant === 'windows31'
                      ? '1px dotted #000000'
                      : '2px solid rgba(59, 130, 246, 0.5)',
              outlineOffset: themeVariant === 'windows31' ? '1px' : '2px',
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
            transition: themeVariant === 'windows31'
              ? 'none'
              : 'color 0.2s ease, text-decoration 0.2s ease',
          },
          // Apply glass effect to certain components
          '.glass-effect': {
            backdropFilter: themeVariant === 'windows31' ? 'none' : 'blur(10px)',
            backgroundColor:
              themeVariant === 'dark'
                ? 'rgba(15, 23, 42, 0.7)'
                : themeVariant === 'paper'
                  ? 'rgba(255, 251, 240, 0.8)'
                  : themeVariant === 'windows31'
                    ? '#C0C0C0'
                    : 'rgba(255, 255, 255, 0.7)',
            border: themeVariant === 'windows31'
              ? '2px solid'
              : `1px solid ${
                  themeVariant === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : themeVariant === 'paper'
                      ? 'rgba(214, 203, 174, 0.6)'
                      : 'rgba(255, 255, 255, 0.3)'
                }`,
            borderColor: themeVariant === 'windows31'
              ? '#FFFFFF #808080 #808080 #FFFFFF'
              : undefined,
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