// darkTheme.ts
import { ThemeOptions, alpha } from '@mui/material';

export const darkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#4f86ff', // Vibrant blue
      light: '#7aa4ff',
      dark: '#2851e0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#36d399', // Teal
      light: '#6fffcc',
      dark: '#00a06a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0f172a', // Deep blue-black
      paper: '#1a253a', // Lighter navy blue
    },
    error: {
      main: '#ff4d6d', // Soft red
      light: '#ff7a91',
      dark: '#cc0022',
    },
    warning: {
      main: '#ffad33', // Warm orange
      light: '#ffcc80',
      dark: '#e58a00',
    },
    info: {
      main: '#55b9f3', // Sky blue
      light: '#8aeaff',
      dark: '#0088c0',
    },
    success: {
      main: '#32d583', // Green
      light: '#7fffb0',
      dark: '#00a256',
    },
    text: {
      primary: '#f8fafc', // Nearly white
      secondary: '#94a3b8', // Light gray
    },
    divider: 'rgba(255,255,255,0.08)',
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
    borderRadius: 4,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 0 10px 0 rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 0 15px 0 rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 0 20px 0 rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 0 25px 0 rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 0 30px 0 rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 0 35px 0 rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 0 40px 0 rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 0 45px 0 rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 0 50px 0 rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 0 55px 0 rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 0 60px 0 rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 0 65px 0 rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 0 70px 0 rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 0 75px 0 rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 5px 15px rgba(0, 0, 0, 0.4), 0 3px 5px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)',
    '0 8px 20px rgba(0, 0, 0, 0.5), 0 5px 10px rgba(0, 0, 0, 0.4), 0 2px 5px rgba(0, 0, 0, 0.3)',
    '0 12px 30px rgba(0, 0, 0, 0.6), 0 8px 15px rgba(0, 0, 0, 0.5), 0 3px 8px rgba(0, 0, 0, 0.4)',
    '0 15px 40px rgba(0, 0, 0, 0.7), 0 10px 20px rgba(0, 0, 0, 0.6), 0 5px 10px rgba(0, 0, 0, 0.5)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
        },
        '::selection': {
          backgroundColor: alpha('#4f86ff', 0.2),
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: 'none',
          padding: '8px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
          },
        },
        contained: {
          '&.Mui-disabled': {
            backgroundColor: alpha('#4f86ff', 0.2),
            color: alpha('#ffffff', 0.4),
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
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          background: 'linear-gradient(145deg, #1a253a, #141e30)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
        },
        elevation3: {
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
        },
        elevation4: {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
        },
        elevation6: {
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
        },
        elevation8: {
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
        },
        elevation12: {
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.5)',
        },
        elevation16: {
          boxShadow: '0 24px 56px rgba(0, 0, 0, 0.55)',
        },
        elevation24: {
          boxShadow: '0 28px 64px rgba(0, 0, 0, 0.6)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
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
            borderColor: alpha('#4f86ff', 0.5),
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '2px',
          },
        },
        notchedOutline: {
          borderColor: alpha('#ffffff', 0.15),
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
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        },
        track: {
          borderRadius: 13,
          opacity: 1,
          backgroundColor: alpha('#ffffff', 0.1),
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
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
            backgroundColor: alpha('#4f86ff', 0.15),
            '&:hover': {
              backgroundColor: alpha('#4f86ff', 0.25),
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