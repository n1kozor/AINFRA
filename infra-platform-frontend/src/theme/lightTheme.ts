// lightTheme.ts
import { ThemeOptions, alpha } from '@mui/material';

export const lightTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#1e6aff', // Vibrant blue
      light: '#6695ff',
      dark: '#0041cc',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00c896', // Teal
      light: '#5dffca',
      dark: '#009667',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f9fafc', // Light gray
      paper: '#ffffff', // White
    },
    error: {
      main: '#f04a63', // Soft red
      light: '#ff7a8e',
      dark: '#ba003b',
    },
    warning: {
      main: '#ff9914', // Warm orange
      light: '#ffc85a',
      dark: '#c76d00',
    },
    info: {
      main: '#0ea5e9', // Sky blue
      light: '#66d7ff',
      dark: '#0076b6',
    },
    success: {
      main: '#10b981', // Green
      light: '#5decb1',
      dark: '#008853',
    },
    text: {
      primary: '#0f172a', // Near black
      secondary: '#475569', // Dark gray
    },
    divider: 'rgba(0,0,0,0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
    body1: {
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontWeight: 400,
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
    caption: {
      fontWeight: 400,
      lineHeight: 1.5,
    },
    overline: {
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 0 10px 0 rgba(0, 0, 0, 0.03), 0 2px 3px -1px rgba(0, 0, 0, 0.05)',
    '0 0 15px 0 rgba(0, 0, 0, 0.04), 0 2px 3px -1px rgba(0, 0, 0, 0.05)',
    '0 0 20px 0 rgba(0, 0, 0, 0.04), 0 2px 3px -1px rgba(0, 0, 0, 0.05)',
    '0 0 25px 0 rgba(0, 0, 0, 0.05), 0 2px 3px -1px rgba(0, 0, 0, 0.05)',
    '0 0 30px 0 rgba(0, 0, 0, 0.05), 0 2px 3px -1px rgba(0, 0, 0, 0.05)',
    '0 0 35px 0 rgba(0, 0, 0, 0.06), 0 2px 3px -1px rgba(0, 0, 0, 0.05)',
    '0 0 40px 0 rgba(0, 0, 0, 0.06), 0 2px 3px -1px rgba(0, 0, 0, 0.05)',
    '0 0 45px 0 rgba(0, 0, 0, 0.07), 0 2px 3px -1px rgba(0, 0, 0, 0.05)',
    '0 0 50px 0 rgba(0, 0, 0, 0.07), 0 2px 3px -1px rgba(0, 0, 0, 0.05)',
    '0 0 55px 0 rgba(0, 0, 0, 0.08), 0 2px 3px -1px rgba(0, 0, 0, 0.05)',
    '0 0 60px 0 rgba(0, 0, 0, 0.08), 0 2px 3px -1px rgba(0, 0, 0, 0.05)',
    '0 0 65px 0 rgba(0, 0, 0, 0.09), 0 2px 3px -1px rgba(0, 0, 0, 0.05)',
    '0 0 70px 0 rgba(0, 0, 0, 0.09), 0 2px 3px -1px rgba(0, 0, 0, 0.05)',
    '0 0 75px 0 rgba(0, 0, 0, 0.1), 0 2px 3px -1px rgba(0, 0, 0, 0.05)',
    '0 3px 10px rgba(0, 0, 0, 0.1), 0 2px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.05)',
    '0 5px 15px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1), 0 2px 3px rgba(0, 0, 0, 0.05)',
    '0 8px 20px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1)',
    '0 12px 30px rgba(0, 0, 0, 0.25), 0 8px 15px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.15)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
        },
        '::selection': {
          backgroundColor: alpha('#1e6aff', 0.15),
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          padding: '8px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          '&.Mui-disabled': {
            backgroundColor: alpha('#1e6aff', 0.12),
            color: alpha('#0f172a', 0.3),
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(234, 242, 252, 0.5)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
        },
        elevation4: {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        },
        elevation6: {
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
        },
        elevation8: {
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.18)',
        },
        elevation12: {
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.2)',
        },
        elevation16: {
          boxShadow: '0 24px 56px rgba(0, 0, 0, 0.22)',
        },
        elevation24: {
          boxShadow: '0 28px 64px rgba(0, 0, 0, 0.25)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s',
        },
        input: {
          '&::placeholder': {
            opacity: 0.7,
            transition: 'opacity 0.2s',
          },
          '&:focus::placeholder': {
            opacity: 0.4,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha('#1e6aff', 0.5),
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '2px',
          },
        },
        notchedOutline: {
          borderColor: alpha('#0f172a', 0.15),
          transition: 'all 0.2s',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 48,
          height: 26,
          padding: 0,
        },
        switchBase: {
          padding: 2,
          '&.Mui-checked': {
            transform: 'translateX(22px)',
            '& + .MuiSwitch-track': {
              opacity: 1,
            },
          },
        },
        thumb: {
          width: 22,
          height: 22,
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        },
        track: {
          borderRadius: 13,
          opacity: 1,
          backgroundColor: alpha('#000000', 0.08),
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          height: '28px',
          fontWeight: 500,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            backgroundColor: alpha('#1e6aff', 0.1),
            '&:hover': {
              backgroundColor: alpha('#1e6aff', 0.15),
            },
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          transition: 'all 0.2s',
          '&:hover': {
            textDecoration: 'none',
          },
        },
      },
    },
  },
};