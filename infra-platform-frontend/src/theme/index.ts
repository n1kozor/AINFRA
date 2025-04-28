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
              width: '0.4em',
            },
            '&::-webkit-scrollbar-track': {
              background: mode === 'light' ? '#f1f1f1' : '#2d2d2d',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: mode === 'light' ? '#888' : '#555',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: mode === 'light' ? '#555' : '#7a7a7a',
            },
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