import { ThemeOptions, alpha } from '@mui/material';

export const paperTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#FF6B6B', // Warm coral red
      light: '#FF9E9E',
      dark: '#E74C3C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#07B39B', // Mint teal
      light: '#4ECCA3',
      dark: '#048C7F',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FAF6E9', // Creamy paper
      paper: '#FFFBF0', // Warm eggshell
    },
    error: {
      main: '#FF5252', // Bright red
      light: '#FF7B7B',
      dark: '#D32F2F',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFB746', // Sunflower yellow
      light: '#FFCC80',
      dark: '#EF9A24',
      contrastText: '#1A2030',
    },
    info: {
      main: '#64B5F6', // Sky blue
      light: '#90CAF9',
      dark: '#4285F4',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#66BB6A', // Leaf green
      light: '#9CCC65',
      dark: '#388E3C',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#2D3748', // Deep charcoal
      secondary: '#596574', // Slate gray
    },
    divider: 'rgba(0,0,0,0.1)',
  },
  typography: {
    fontFamily: '"Comic Neue", "Marker Felt", "Neucha", cursive, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.1,
      fontFamily: '"Gochi Hand", "Permanent Marker", cursive',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.005em',
      lineHeight: 1.2,
      fontFamily: '"Gochi Hand", "Permanent Marker", cursive',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: 0,
      lineHeight: 1.2,
      fontFamily: '"Gochi Hand", "Permanent Marker", cursive',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '0.005em',
      lineHeight: 1.3,
      fontFamily: '"Patrick Hand", "Just Me Again Down Here", cursive',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '0.005em',
      lineHeight: 1.4,
      fontFamily: '"Patrick Hand", "Just Me Again Down Here", cursive',
    },
    h6: {
      fontWeight: 600,
      lineHeight: 1.5,
      fontFamily: '"Patrick Hand", "Just Me Again Down Here", cursive',
    },
    subtitle1: {
      fontWeight: 600,
      letterSpacing: '0.01em',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontWeight: 400,
      lineHeight: 1.65,
      letterSpacing: '0.01em',
    },
    body2: {
      fontWeight: 400,
      lineHeight: 1.65,
      letterSpacing: '0.01em',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
      fontFamily: '"Patrick Hand", "Just Me Again Down Here", cursive',
    },
    caption: {
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.02em',
    },
    overline: {
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 2px 8px -2px rgba(0, 0, 0, 0.1)',
    '0 3px 10px -3px rgba(0, 0, 0, 0.12)',
    '0 4px 12px -3px rgba(0, 0, 0, 0.15)',
    '0 5px 14px -4px rgba(0, 0, 0, 0.16)',
    '0 6px 16px -4px rgba(0, 0, 0, 0.18)',
    '0 8px 20px -5px rgba(0, 0, 0, 0.2)',
    '0 10px 24px -6px rgba(0, 0, 0, 0.22)',
    '0 12px 28px -7px rgba(0, 0, 0, 0.24)',
    '0 14px 32px -8px rgba(0, 0, 0, 0.26)',
    '0 16px 38px -9px rgba(0, 0, 0, 0.28)',
    '0 18px 42px -10px rgba(0, 0, 0, 0.3)',
    '0 20px 46px -11px rgba(0, 0, 0, 0.32)',
    '0 22px 50px -12px rgba(0, 0, 0, 0.34)',
    '0 24px 54px -13px rgba(0, 0, 0, 0.36)',
    '0 26px 58px -14px rgba(0, 0, 0, 0.38)',
    '0 28px 62px -15px rgba(0, 0, 0, 0.4)',
    '0 30px 66px -16px rgba(0, 0, 0, 0.42)',
    '0 32px 70px -17px rgba(0, 0, 0, 0.44)',
    '0 36px 78px -18px rgba(0, 0, 0, 0.46)',
    '0 38px 82px -19px rgba(0, 0, 0, 0.48)',
    '0 40px 90px -20px rgba(0, 0, 0, 0.5)',
    '0 42px 94px -21px rgba(0, 0, 0, 0.52)',
    '0 8px 25px rgba(0, 0, 0, 0.15), 0 14px 20px rgba(0, 0, 0, 0.1), 0 8px 10px rgba(0, 0, 0, 0.05)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
          overflowX: 'hidden',
          overflowY: 'auto',
          background: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23dfd6ba' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        },
        body: {
          overflowX: 'hidden',
          overflowY: 'auto',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            background: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23a58e68' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 20.83l2.83-2.83 1.41 1.41L1.41 22H0v-1.17zM0 3.07l2.83-2.83 1.41 1.41L1.41 4.24H0V3.07zm25.66 33.1l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zm0-17.76l2.83-2.83 1.41 1.41-2.83 2.83h-1.41V18.41zm0-17.76l2.83-2.83 1.41 1.41-2.83 2.83h-1.41V.65zM10.83 40H9.41l2.83-2.83 1.41 1.41L10.83 40zm0-17.76H9.41l2.83-2.83 1.41 1.41-2.82 2.83zm0-17.76H9.41l2.83-2.83 1.41 1.41-2.83 2.83zm40.23 35.52H49.5l2.83-2.83 1.41 1.41-2.82 2.83zm0-17.76H49.5l2.83-2.83 1.41 1.41-2.83 2.83zm0-17.76H49.5l2.83-2.83 1.41 1.41-2.83 2.83zm16.06 35.52h-1.43l2.83-2.83 1.41 1.41-2.83 2.83zm0-17.76h-1.43l2.83-2.83 1.41 1.41-2.83 2.83zm0-17.76h-1.43l2.83-2.83 1.41 1.41-2.83 2.83zM40 40h-1.41l2.83-2.83 1.41 1.41L40 40zm0-17.76h-1.41l2.83-2.83 1.41 1.41-2.83 2.83zm0-17.76h-1.41l2.83-2.83 1.41 1.41-2.83 2.83z'/%3E%3C/g%3E%3C/svg%3E")`,
          },
        },
        '::selection': {
          backgroundColor: alpha('#FF6B6B', 0.2),
          color: '#2D3748',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: '#F0E6D2',
          borderRadius: '10px',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: alpha('#A58E68', 0.4),
          borderRadius: '10px',
          border: '2px solid #F0E6D2',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          backgroundColor: alpha('#A58E68', 0.6),
        },
        '@keyframes wiggle': {
          '0%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1.5deg)' },
          '100%': { transform: 'rotate(-1deg)' },
        },
        '@keyframes scribble': {
          '0%': { backgroundPosition: '0% 0%' },
          '25%': { backgroundPosition: '100% 100%' },
          '50%': { backgroundPosition: '100% 0%' },
          '75%': { backgroundPosition: '0% 100%' },
          '100%': { backgroundPosition: '0% 0%' },
        },
        '@keyframes float': {
          '0%': { transform: 'translateY(0px) rotate(-1deg)' },
          '50%': { transform: 'translateY(-8px) rotate(1deg)' },
          '100%': { transform: 'translateY(0px) rotate(-1deg)' },
        },
        '@keyframes dotted-line': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '100% 0' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: 'none',
          padding: '10px 24px',
          transition: 'all 0.3s',
          fontWeight: 600,
          transform: 'rotate(-0.5deg)',
          border: '2px solid transparent',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          overflow: 'visible',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '3px',
            left: '3px',
            width: 'calc(100% + 4px)',
            height: 'calc(100% + 4px)',
            borderRadius: '18px',
            background: 'transparent',
            border: '2px dashed rgba(0,0,0,0.1)',
            zIndex: -1,
            transform: 'rotate(1deg)',
          },
          '&:hover': {
            transform: 'rotate(0.5deg) scale(1.03)',
            animation: 'wiggle 0.5s ease-in-out',
          },
          '&:active': {
            transform: 'rotate(-0.2deg) scale(0.98)',
          },
        },
        contained: {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          background: '#FF6B6B',
          boxShadow: '0 4px 0 #E74C3C',
          transform: 'translate(0, -2px) rotate(-0.5deg)',
          '&:hover': {
            background: '#FF5252',
            boxShadow: '0 6px 0 #E74C3C',
            transform: 'translate(0, -4px) rotate(0.5deg)',
          },
          '&:active': {
            boxShadow: '0 2px 0 #E74C3C',
            transform: 'translate(0, 0) rotate(-0.2deg)',
          },
          '&.Mui-disabled': {
            backgroundColor: alpha('#FF6B6B', 0.4),
            color: alpha('#FFFFFF', 0.6),
          },
        },
        containedPrimary: {
          background: '#FF6B6B',
          boxShadow: '0 4px 0 #E74C3C',
        },
        containedSecondary: {
          background: '#07B39B',
          boxShadow: '0 4px 0 #048C7F',
          '&:hover': {
            background: '#06A38E',
            boxShadow: '0 6px 0 #048C7F',
          },
          '&:active': {
            boxShadow: '0 2px 0 #048C7F',
          },
        },
        outlined: {
          borderWidth: '2px',
          borderColor: '#FF6B6B',
          color: '#FF6B6B',
          borderStyle: 'dashed',
          backgroundColor: 'rgba(255, 107, 107, 0.04)',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: 'rgba(255, 107, 107, 0.08)',
            borderColor: '#E74C3C',
          },
          '&::after': {
            borderStyle: 'solid',
          },
        },
        outlinedPrimary: {
          borderColor: '#FF6B6B',
          color: '#FF6B6B',
          '&:hover': {
            borderColor: '#E74C3C',
            backgroundColor: 'rgba(255, 107, 107, 0.08)',
          },
        },
        outlinedSecondary: {
          borderColor: '#07B39B',
          color: '#07B39B',
          backgroundColor: 'rgba(7, 179, 155, 0.04)',
          '&:hover': {
            borderColor: '#048C7F',
            backgroundColor: 'rgba(7, 179, 155, 0.08)',
          },
        },
        text: {
          padding: '6px 16px',
          '&:hover': {
            backgroundColor: 'rgba(255, 107, 107, 0.08)',
          },
          '&::after': {
            display: 'none',
          },
        },
        textPrimary: {
          color: '#FF6B6B',
          '&:hover': {
            backgroundColor: 'rgba(255, 107, 107, 0.08)',
          },
        },
        textSecondary: {
          color: '#07B39B',
          '&:hover': {
            backgroundColor: 'rgba(7, 179, 155, 0.08)',
          },
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.875rem',
          borderRadius: '12px',
          '&::after': {
            borderRadius: '14px',
          },
        },
        sizeLarge: {
          padding: '14px 34px',
          fontSize: '1.1rem',
          borderRadius: '20px',
          '&::after': {
            borderRadius: '22px',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '28px 24px',
          '&:last-child': {
            paddingBottom: '28px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: '0 8px 0 -4px rgba(0,0,0,0.1)',
          background: '#FFFBF0',
          border: '2px solid #D6CBAE',
          overflow: 'hidden',
          position: 'relative',
          transform: 'rotate(-0.5deg)',
          transition: 'all 0.3s',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23a58e68' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 20.83l2.83-2.83 1.41 1.41L1.41 22H0v-1.17zM0 3.07l2.83-2.83 1.41 1.41L1.41 4.24H0V3.07zm25.66 33.1l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zm0-17.76l2.83-2.83 1.41 1.41-2.83 2.83h-1.41V18.41zm0-17.76l2.83-2.83 1.41 1.41-2.83 2.83h-1.41V.65zM10.83 40H9.41l2.83-2.83 1.41 1.41L10.83 40zm0-17.76H9.41l2.83-2.83 1.41 1.41-2.82 2.83zm0-17.76H9.41l2.83-2.83 1.41 1.41-2.83 2.83zm40.23 35.52H49.5l2.83-2.83 1.41 1.41-2.82 2.83zm0-17.76H49.5l2.83-2.83 1.41 1.41-2.83 2.83zm0-17.76H49.5l2.83-2.83 1.41 1.41-2.83 2.83zm16.06 35.52h-1.43l2.83-2.83 1.41 1.41-2.83 2.83zm0-17.76h-1.43l2.83-2.83 1.41 1.41-2.83 2.83zm0-17.76h-1.43l2.83-2.83 1.41 1.41-2.83 2.83zM40 40h-1.41l2.83-2.83 1.41 1.41L40 40zm0-17.76h-1.41l2.83-2.83 1.41 1.41-2.83 2.83zm0-17.76h-1.41l2.83-2.83 1.41 1.41-2.83 2.83z'/%3E%3C/g%3E%3C/svg%3E")`,
            pointerEvents: 'none',
            zIndex: 0,
          },
          '&:hover': {
            transform: 'rotate(0.5deg) translateY(-5px)',
            boxShadow: '0 12px 0 -6px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: 'all 0.3s ease',
        },
        rounded: {
          borderRadius: '16px',
        },
        outlined: {
          borderColor: '#D6CBAE',
          borderWidth: '2px',
          borderStyle: 'solid',
        },
        elevation1: {
          boxShadow: '0 4px 0 -2px rgba(0,0,0,0.08)',
        },
        elevation2: {
          boxShadow: '0 6px 0 -3px rgba(0,0,0,0.1)',
        },
        elevation3: {
          boxShadow: '0 8px 0 -4px rgba(0,0,0,0.1)',
        },
        elevation4: {
          boxShadow: '0 10px 0 -5px rgba(0,0,0,0.12)',
        },
        elevation6: {
          boxShadow: '0 12px 0 -6px rgba(0,0,0,0.15)',
        },
        elevation8: {
          boxShadow: '0 14px 0 -7px rgba(0,0,0,0.18)',
        },
        elevation12: {
          boxShadow: '0 16px 0 -8px rgba(0,0,0,0.2)',
        },
        elevation16: {
          boxShadow: '0 18px 0 -9px rgba(0,0,0,0.22)',
        },
        elevation24: {
          boxShadow: '0 20px 0 -10px rgba(0,0,0,0.25)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundImage: 'none',
          borderBottom: '2px solid #D6CBAE',
        },
        colorDefault: {
          backgroundColor: alpha('#FFFBF0', 0.9),
          backdropFilter: 'blur(10px)',
        },
        colorPrimary: {
          backgroundColor: alpha('#FFFBF0', 0.9),
          backdropFilter: 'blur(10px)',
          borderBottom: '2px dashed #D6CBAE',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
          backgroundImage: 'none',
          backgroundColor: '#FFFBF0',
          borderRight: '2px dashed #D6CBAE',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s',
          fontSize: '0.95rem',
          fontFamily: '"Comic Neue", "Marker Felt", "Neucha", cursive',
        },
        input: {
          '&::placeholder': {
            opacity: 0.7,
            fontStyle: 'italic',
            transition: 'opacity 0.3s',
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
            borderColor: '#FF6B6B',
            borderWidth: '2px',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '2px',
            borderColor: '#FF6B6B',
            borderStyle: 'dashed',
          },
          transition: 'all 0.3s',
          transform: 'rotate(-0.5deg)',
          '&:hover': {
            transform: 'rotate(0.5deg)',
          },
        },
        notchedOutline: {
          borderColor: '#D6CBAE',
          borderWidth: '2px',
          transition: 'all 0.3s',
        },
        input: {
          padding: '16px 18px',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': {
            borderBottomColor: '#D6CBAE',
            borderBottomWidth: '2px',
            borderBottomStyle: 'solid',
          },
          '&:after': {
            borderBottomColor: '#FF6B6B',
            borderBottomWidth: '2px',
            borderBottomStyle: 'dashed',
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottomColor: '#FF6B6B',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 60,
          height: 34,
          padding: 0,
          transform: 'rotate(-0.5deg)',
          '& .MuiSwitch-switchBase': {
            padding: 4,
            '&.Mui-checked': {
              transform: 'translateX(26px)',
              '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#FF6B6B',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 20.83l2.83-2.83 1.41 1.41L1.41 22H0v-1.17zM0 3.07l2.83-2.83 1.41 1.41L1.41 4.24H0V3.07zm25.66 33.1l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zm0-17.76l2.83-2.83 1.41 1.41-2.83 2.83h-1.41V18.41zm0-17.76l2.83-2.83 1.41 1.41-2.83 2.83h-1.41V.65zM10.83 40H9.41l2.83-2.83 1.41 1.41L10.83 40zm0-17.76H9.41l2.83-2.83 1.41 1.41-2.82 2.83zm0-17.76H9.41l2.83-2.83 1.41 1.41-2.83 2.83z'/%3E%3C/g%3E%3C/svg%3E")`,
                border: '2px solid #E74C3C',
              },
              '& .MuiSwitch-thumb': {
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              },
            },
          },
          '& .MuiSwitch-thumb': {
            width: 26,
            height: 26,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 4C6.68629 4 4 6.68629 4 10C4 13.3137 6.68629 16 10 16C13.3137 16 16 13.3137 16 10C16 6.68629 13.3137 4 10 4ZM10 14C7.79086 14 6 12.2091 6 10C6 7.79086 7.79086 6 10 6C12.2091 6 14 7.79086 14 10C14 12.2091 12.2091 14 10 14Z' fill='%23FF6B6B' fill-opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          },
          '& .MuiSwitch-track': {
            borderRadius: 17,
            opacity: 1,
            backgroundColor: '#D6CBAE',
            border: '2px solid #A58E68',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 0 -2px rgba(0,0,0,0.15)',
          border: '2px solid #D6CBAE',
          transform: 'rotate(-2deg)',
        },
        colorDefault: {
          backgroundColor: alpha('#FF6B6B', 0.15),
          color: '#FF6B6B',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          height: '36px',
          fontWeight: 600,
          fontSize: '0.9rem',
          background: alpha('#FF6B6B', 0.1),
          color: '#E74C3C',
          border: '2px dashed #FFB8B8',
          transition: 'all 0.2s',
          transform: 'rotate(-0.5deg)',
          '&:hover': {
            background: alpha('#FF6B6B', 0.15),
            transform: 'rotate(0.5deg)',
          },
          '&.MuiChip-colorPrimary': {
            background: alpha('#FF6B6B', 0.1),
            color: '#E74C3C',
            border: '2px dashed #FFB8B8',
          },
          '&.MuiChip-colorSecondary': {
            background: alpha('#07B39B', 0.1),
            color: '#048C7F',
            border: '2px dashed #84E8DC',
          },
          '&.MuiChip-colorSuccess': {
            background: alpha('#66BB6A', 0.1),
            color: '#388E3C',
            border: '2px dashed #A5D6A7',
          },
          '&.MuiChip-colorError': {
            background: alpha('#FF5252', 0.1),
            color: '#D32F2F',
            border: '2px dashed #FFACAC',
          },
          '&.MuiChip-colorWarning': {
            background: alpha('#FFB746', 0.1),
            color: '#EF9A24',
            border: '2px dashed #FFD699',
          },
          '&.MuiChip-colorInfo': {
            background: alpha('#64B5F6', 0.1),
            color: '#4285F4',
            border: '2px dashed #A6D4FA',
          },
        },
        outlined: {
          borderWidth: '2px',
          borderStyle: 'dashed',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: alpha('#FF6B6B', 0.05),
          },
        },
        label: {
          padding: '0 16px',
        },
        deleteIcon: {
          color: 'inherit',
          opacity: 0.7,
          '&:hover': {
            opacity: 1,
            color: 'inherit',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          margin: '4px 8px',
          padding: '12px 16px',
          transition: 'all 0.3s',
          '&.Mui-selected': {
            backgroundColor: alpha('#FF6B6B', 0.1),
            '&:hover': {
              backgroundColor: alpha('#FF6B6B', 0.15),
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              left: '6px',
              top: '50%',
              transform: 'translateY(-50%)',
              height: '70%',
              width: '6px',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='60' viewBox='0 0 6 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 0V60' stroke='%23FF6B6B' stroke-width='6' stroke-dasharray='1 7'/%3E%3C/svg%3E")`,
              borderRadius: '3px',
            },
          },
          '&:hover': {
            backgroundColor: alpha('#FF6B6B', 0.08),
            transform: 'translateX(4px) rotate(0.5deg)',
          },
          transform: 'rotate(-0.5deg)',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#A58E68',
          minWidth: '42px',
          '.Mui-selected > &': {
            color: '#FF6B6B',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          transition: 'all 0.25s',
          fontWeight: 600,
          color: '#FF6B6B',
          position: 'relative',
          display: 'inline-block',
          '&:hover': {
            textDecoration: 'none',
            color: '#E74C3C',
            transform: 'rotate(1deg)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '6px',
            bottom: '-2px',
            left: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='6' viewBox='0 0 100 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 3C20 1 40 5 60 3C80 1 90 3 100 3' stroke='%23FF6B6B' stroke-width='2' stroke-dasharray='4 4'/%3E%3C/svg%3E")`,
            backgroundSize: '100% 6px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom',
            animation: 'dotted-line 10s linear infinite',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#FFFBF0',
          color: '#2D3748',
          borderRadius: '16px',
          padding: '12px 20px',
          fontSize: '0.9rem',
          fontWeight: 500,
          boxShadow: '0 6px 0 -3px rgba(0,0,0,0.1)',
          border: '2px dashed #D6CBAE',
          maxWidth: 300,
          transform: 'rotate(-0.5deg)',
        },
        arrow: {
          color: '#FFFBF0',
          '&::before': {
            border: '2px dashed #D6CBAE',
            backgroundColor: '#FFFBF0',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '24px',
          boxShadow: '0 12px 0 -6px rgba(0,0,0,0.1)',
          backgroundImage: 'none',
          background: '#FFFBF0',
          border: '3px solid #D6CBAE',
          overflow: 'hidden',
          transform: 'rotate(-0.5deg)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '24px 28px 16px',
          fontSize: '1.5rem',
          fontWeight: 700,
          fontFamily: '"Patrick Hand", "Just Me Again Down Here", cursive',
          borderBottom: '2px dashed #D6CBAE',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '20px 28px',
          background: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a58e68' fill-opacity='0.05'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 28px 24px',
          borderTop: '2px dashed #D6CBAE',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderStyle: 'dashed',
          borderColor: '#D6CBAE',
          borderWidth: '2px',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#2D3748', 0.5),
          backdropFilter: 'blur(5px)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '20px',
          boxShadow: '0 8px 0 -4px rgba(0,0,0,0.1)',
          border: '2px dashed #D6CBAE',
          backgroundImage: 'none',
          background: '#FFFBF0',
          transform: 'rotate(-0.5deg)',
        },
        list: {
          padding: '8px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: '48px',
          padding: '10px 16px',
          borderRadius: '12px',
          transition: 'all 0.2s',
          margin: '2px 0',
          fontFamily: '"Comic Neue", "Marker Felt", "Neucha", cursive',
          '&:hover': {
            backgroundColor: alpha('#FF6B6B', 0.08),
            transform: 'rotate(0.5deg)',
          },
          '&.Mui-selected': {
            backgroundColor: alpha('#FF6B6B', 0.1),
            '&:hover': {
              backgroundColor: alpha('#FF6B6B', 0.15),
            },
          },
          transform: 'rotate(-0.5deg)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '18px 24px',
          borderColor: '#D6CBAE',
          borderWidth: '2px',
          borderStyle: 'dashed',
          fontFamily: '"Comic Neue", "Marker Felt", "Neucha", cursive',
        },
        head: {
          fontWeight: 700,
          color: '#2D3748',
          backgroundColor: alpha('#FAF6E9', 0.8),
          fontSize: '0.95rem',
          fontFamily: '"Patrick Hand", "Just Me Again Down Here", cursive',
        },
        body: {
          fontSize: '0.95rem',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: alpha('#FF6B6B', 0.03),
          },
          '&:nth-of-type(odd)': {
            backgroundColor: alpha('#FAF6E9', 0.5),
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: '0 8px 0 -4px rgba(0,0,0,0.1)',
          border: '2px solid #D6CBAE',
          overflow: 'hidden',
          transform: 'rotate(-0.5deg)',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: '0 6px 0 -3px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          transition: 'all 0.3s',
          backgroundColor: 'transparent',
          backgroundImage: 'none',
          marginTop: '16px',
          marginBottom: '16px',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '16px 0',
            boxShadow: '0 8px 0 -4px rgba(0,0,0,0.15)',
            background: '#FFFBF0',
            transform: 'rotate(0.5deg)',
          },
          transform: 'rotate(-0.5deg)',
          border: '2px dashed #D6CBAE',
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: '0 24px',
          minHeight: '64px',
          transition: 'all 0.2s',
          borderBottom: '2px dashed transparent',
          '&.Mui-expanded': {
            backgroundColor: alpha('#FAF6E9', 0.5),
            borderBottom: '2px dashed #D6CBAE',
          },
        },
        content: {
          margin: '16px 0',
          fontFamily: '"Patrick Hand", "Just Me Again Down Here", cursive',
          fontWeight: 600,
        },
        expandIconWrapper: {
          color: '#FF6B6B',
          transition: 'all 0.3s',
          transform: 'rotate(-5deg)',
          '&.Mui-expanded': {
            transform: 'rotate(185deg)',
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a58e68' fill-opacity='0.05'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          paddingTop: '16px',
          paddingBottom: '16px',
          paddingLeft: '18px',
        },
        icon: {
          color: '#A58E68',
          transition: 'transform 0.2s',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '2px dashed #D6CBAE',
        },
        indicator: {
          height: '4px',
          borderRadius: '4px 4px 0 0',
          background: '#FF6B6B',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='4' viewBox='0 0 40 4' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 2C5 0.5 10 3.5 15 2C20 0.5 25 3.5 30 2C35 0.5 40 3.5 40 2' stroke='%23E74C3C' stroke-width='1' stroke-dasharray='3 1'/%3E%3C/svg%3E")`,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 20px',
          marginRight: '8px',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          transition: 'all 0.25s',
          minHeight: '48px',
          minWidth: '120px',
          fontFamily: '"Patrick Hand", "Just Me Again Down Here", cursive',
          transform: 'rotate(-0.5deg)',
          '&.Mui-selected': {
            backgroundColor: alpha('#FF6B6B', 0.08),
            color: '#FF6B6B',
            transform: 'translateY(-3px) rotate(0.5deg)',
          },
          '&:hover:not(.Mui-selected)': {
            backgroundColor: alpha('#A58E68', 0.05),
            transform: 'translateY(-2px) rotate(0.5deg)',
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 700,
          borderRadius: '10px',
          padding: '0 8px',
          height: '20px',
          minWidth: '20px',
          fontSize: '0.75rem',
          border: '2px solid #FFFBF0',
          fontFamily: '"Comic Neue", "Marker Felt", "Neucha", cursive',
        },
        colorPrimary: {
          backgroundColor: '#FF6B6B',
          color: '#FFFFFF',
        },
        colorSecondary: {
          backgroundColor: '#07B39B',
          color: '#FFFFFF',
        },
        colorError: {
          backgroundColor: '#FF5252',
          color: '#FFFFFF',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          padding: '16px 20px',
          border: '2px dashed transparent',
          alignItems: 'center',
          transform: 'rotate(-0.5deg)',
        },
        standardSuccess: {
          backgroundColor: alpha('#66BB6A', 0.1),
          color: '#388E3C',
          border: '2px dashed #A5D6A7',
        },
        standardError: {
          backgroundColor: alpha('#FF5252', 0.1),
          color: '#D32F2F',
          border: '2px dashed #FFACAC',
        },
        standardWarning: {
          backgroundColor: alpha('#FFB746', 0.1),
          color: '#EF9A24',
          border: '2px dashed #FFD699',
        },
        standardInfo: {
          backgroundColor: alpha('#64B5F6', 0.1),
          color: '#4285F4',
          border: '2px dashed #A6D4FA',
        },
        icon: {
          opacity: 0.9,
        },
        message: {
          padding: '8px 0',
          fontFamily: '"Comic Neue", "Marker Felt", "Neucha", cursive',
        },
      },
    },
    MuiAlertTitle: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          marginBottom: '8px',
          fontFamily: '"Patrick Hand", "Just Me Again Down Here", cursive',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          height: '10px',
          backgroundColor: alpha('#D6CBAE', 0.3),
          border: '2px solid #D6CBAE',
          overflow: 'hidden',
        },
        bar: {
          borderRadius: '6px',
        },
        barColorPrimary: {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 20.83l2.83-2.83 1.41 1.41L1.41 22H0v-1.17zM0 3.07l2.83-2.83 1.41 1.41L1.41 4.24H0V3.07zm25.66 33.1l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zm0-17.76l2.83-2.83 1.41 1.41-2.83 2.83h-1.41V18.41zm0-17.76l2.83-2.83 1.41 1.41-2.83 2.83h-1.41V.65z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: '#FF6B6B',
        },
        barColorSecondary: {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 20.83l2.83-2.83 1.41 1.41L1.41 22H0v-1.17zM0 3.07l2.83-2.83 1.41 1.41L1.41 4.24H0V3.07zm25.66 33.1l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zm0-17.76l2.83-2.83 1.41 1.41-2.83 2.83h-1.41V18.41zm0-17.76l2.83-2.83 1.41 1.41-2.83 2.83h-1.41V.65z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: '#07B39B',
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        colorPrimary: {
          color: '#FF6B6B',
        },
        colorSecondary: {
          color: '#07B39B',
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#D6CBAE', 0.2),
          borderRadius: '10px',
          '&::after': {
            background: `linear-gradient(90deg, transparent, ${alpha('#D6CBAE', 0.2)}, transparent)`,
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          borderColor: '#D6CBAE',
          borderWidth: '2px',
          borderStyle: 'dashed',
          padding: '10px 16px',
          transition: 'all 0.2s',
          textTransform: 'none',
          fontWeight: 600,
          fontFamily: '"Patrick Hand", "Just Me Again Down Here", cursive',
          transform: 'rotate(-0.5deg)',
          '&.Mui-selected': {
            backgroundColor: alpha('#FF6B6B', 0.1),
            borderColor: '#FFB8B8',
            color: '#FF6B6B',
            '&:hover': {
              backgroundColor: alpha('#FF6B6B', 0.15),
            },
          },
          '&:hover': {
            backgroundColor: alpha('#A58E68', 0.05),
            transform: 'rotate(0.5deg)',
          },
        },
      },
    },
  },
};