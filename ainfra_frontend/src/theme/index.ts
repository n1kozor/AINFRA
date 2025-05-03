import { createTheme, ThemeOptions, PaletteMode, Theme, CSSObject } from '@mui/material';
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
          : (themeVariant as PaletteMode);

  const customBodyStyles = {
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': {
      width: themeVariant === 'windows31' ? '16px' : '8px',
      height: themeVariant === 'windows31' ? '16px' : '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: themeVariant === 'windows31' ? '#C0C0C0' : 'transparent',
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
    '&::-webkit-scrollbar-button':
        themeVariant === 'windows31'
            ? {
              backgroundColor: '#C0C0C0',
              border: '1px solid #808080',
              borderLeft: '1px solid #FFFFFF',
              borderTop: '1px solid #FFFFFF',
              display: 'block',
              height: '16px',
            }
            : {},
    '& *': {
      transition:
          themeVariant === 'windows31'
              ? 'none'
              : 'background-color 0.2s ease, border-color 0.2s ease',
    },
    WebkitFontSmoothing: themeVariant === 'windows31' ? 'none' : 'antialiased',
    MozOsxFontSmoothing: themeVariant === 'windows31' ? 'none' : 'grayscale',
    transform: 'translateZ(0)',
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
  };

  return createTheme({
    ...themeOptions,
    palette: { mode, ...(themeOptions.palette ?? {}) },
    components: {
      ...(themeOptions.components ?? {}),
      MuiCssBaseline: {
        ...(themeOptions.components?.MuiCssBaseline ?? {}),
        styleOverrides: (themeParam: Theme) => {
          const baseOverrides = themeOptions.components?.MuiCssBaseline?.styleOverrides;
          let resolvedStyles: CSSObject = {};

          if (typeof baseOverrides === 'function') {
            const result = baseOverrides(themeParam);
            if (result && typeof result === 'object') {
              resolvedStyles = result as CSSObject;
            }
          } else if (baseOverrides && typeof baseOverrides === 'object') {
            resolvedStyles = baseOverrides as CSSObject;
          }

          // Create a properly typed body styles object
          const bodyStyles = resolvedStyles.body as CSSObject || {};

          return {
            ...resolvedStyles,
            body: {
              ...bodyStyles,
              ...customBodyStyles,
            },
          };
        },
      },
    },
  });
};