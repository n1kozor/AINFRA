import { createTheme, ThemeOptions, PaletteMode } from '@mui/material';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';

export const getTheme = (mode: PaletteMode) => {
  const themeOptions: ThemeOptions = mode === 'light' ? lightTheme : darkTheme;

  return createTheme({
    ...themeOptions,
    components: {
      ...themeOptions.components,
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: mode === 'light' ? 'transparent' : 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: mode === 'light' ? 'rgba(15, 23, 42, 0.15)' : 'rgba(241, 245, 249, 0.2)',
              borderRadius: '8px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: mode === 'light' ? 'rgba(15, 23, 42, 0.25)' : 'rgba(241, 245, 249, 0.3)',
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
              outline: mode === 'light'
                ? '2px solid rgba(59, 130, 246, 0.5)'
                : '2px solid rgba(96, 165, 250, 0.5)',
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
            backgroundColor: mode === 'light'
              ? 'rgba(255, 255, 255, 0.7)'
              : 'rgba(15, 23, 42, 0.7)',
            border: `1px solid ${mode === 'light'
              ? 'rgba(255, 255, 255, 0.3)'
              : 'rgba(255, 255, 255, 0.05)'}`,
          },
        },
      },
    },
    palette: {
      mode,
      ...(mode === 'light' ? lightTheme.palette : darkTheme.palette),
    },
  });
};