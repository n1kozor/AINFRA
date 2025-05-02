import { ThemeOptions, alpha } from '@mui/material';

export const lightTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#FF5A5F', // Energetic coral red
      light: '#FF8A8F',
      dark: '#E02A30',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3CDFFF', // Electric cyan
      light: '#79E9FF',
      dark: '#00B8D9',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F4F7FE', // Soft blue-tinted white
      paper: '#FFFFFF', // Pure white
    },
    error: {
      main: '#FF3D71', // Vivid pink
      light: '#FF7A9E',
      dark: '#DB004D',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FFAA00', // Vibrant amber
      light: '#FFCC4D',
      dark: '#E09300',
      contrastText: '#ffffff',
    },
    info: {
      main: '#2196FF', // Electric blue
      light: '#6EC0FF',
      dark: '#0069D9',
      contrastText: '#ffffff',
    },
    success: {
      main: '#00E096', // Neon green
      light: '#5FFFBE',
      dark: '#00AD72',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#1A1F36', // Deep space blue
      secondary: '#4A5578', // Medium slate blue
    },
    divider: 'rgba(0,0,0,0.06)',
  },
  typography: {
    fontFamily: '"Space Grotesk", "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.03em',
      lineHeight: 1.1,
    },
    h2: {
      fontWeight: 800,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    body2: {
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
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
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 3px 5px -1px rgba(0, 0, 0, 0.08), 0 2px 3px -1px rgba(0, 0, 0, 0.06)',
    '0 4px 6px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 6px 10px -3px rgba(0, 0, 0, 0.12), 0 3px 6px -2px rgba(0, 0, 0, 0.08)',
    '0 8px 13px -4px rgba(0, 0, 0, 0.14), 0 4px 7px -3px rgba(0, 0, 0, 0.1)',
    '0 10px 16px -5px rgba(0, 0, 0, 0.16), 0 5px 8px -4px rgba(0, 0, 0, 0.12)',
    '0 12px 20px -6px rgba(0, 0, 0, 0.18), 0 6px 10px -5px rgba(0, 0, 0, 0.14)',
    '0 14px 24px -7px rgba(0, 0, 0, 0.2), 0 7px 12px -6px rgba(0, 0, 0, 0.16)',
    '0 16px 28px -8px rgba(0, 0, 0, 0.22), 0 8px 14px -7px rgba(0, 0, 0, 0.18)',
    '0 18px 32px -9px rgba(0, 0, 0, 0.24), 0 9px 16px -8px rgba(0, 0, 0, 0.2)',
    '0 20px 36px -10px rgba(0, 0, 0, 0.26), 0 10px 18px -9px rgba(0, 0, 0, 0.22)',
    '0 22px 40px -11px rgba(0, 0, 0, 0.28), 0 11px 20px -10px rgba(0, 0, 0, 0.24)',
    '0 24px 44px -12px rgba(0, 0, 0, 0.3), 0 12px 22px -11px rgba(0, 0, 0, 0.26)',
    '0 26px 48px -13px rgba(0, 0, 0, 0.32), 0 13px 24px -12px rgba(0, 0, 0, 0.28)',
    '0 28px 52px -14px rgba(0, 0, 0, 0.34), 0 14px 26px -13px rgba(0, 0, 0, 0.3)',
    '0 30px 56px -15px rgba(0, 0, 0, 0.36), 0 15px 28px -14px rgba(0, 0, 0, 0.32)',
    '0 32px 60px -16px rgba(0, 0, 0, 0.38), 0 16px 30px -15px rgba(0, 0, 0, 0.34)',
    '0 34px 64px -17px rgba(0, 0, 0, 0.4), 0 17px 32px -16px rgba(0, 0, 0, 0.36)',
    '0 36px 68px -18px rgba(0, 0, 0, 0.42), 0 18px 34px -17px rgba(0, 0, 0, 0.38)',
    '0 38px 72px -19px rgba(0, 0, 0, 0.44), 0 19px 36px -18px rgba(0, 0, 0, 0.4)',
    '0 40px 80px -20px rgba(0, 0, 0, 0.46), 0 20px 38px -19px rgba(0, 0, 0, 0.42)',
    '0 9px 46px rgba(0, 0, 0, 0.12), 0 24px 38px rgba(0, 0, 0, 0.14), 0 11px 15px rgba(0, 0, 0, 0.1)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
          overflowX: 'hidden',
          overflowY: 'auto',
        },
        body: {
          overflowX: 'hidden',
          overflowY: 'auto',
        },
        '::selection': {
          backgroundColor: alpha('#FF5A5F', 0.2),
          color: '#1A1F36',
        },
        '*::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '*::-webkit-scrollbar-track': {
          background: '#F4F7FE',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: alpha('#4A5578', 0.3),
          borderRadius: '3px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          backgroundColor: alpha('#FF5A5F', 0.5),
        },
        '@keyframes pulse': {
          '0%': {
            boxShadow: '0 0 0 0 rgba(255, 90, 95, 0.7)',
          },
          '70%': {
            boxShadow: '0 0 0 15px rgba(255, 90, 95, 0)',
          },
          '100%': {
            boxShadow: '0 0 0 0 rgba(255, 90, 95, 0)',
          },
        },
        '@keyframes ripple': {
          '0%': {
            transform: 'scale(0.8)',
            opacity: 1,
          },
          '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
          },
        },
        '@keyframes float': {
          '0%': {
            transform: 'translateY(0px) rotate(0deg)',
          },
          '50%': {
            transform: 'translateY(-15px) rotate(2deg)',
          },
          '100%': {
            transform: 'translateY(0px) rotate(0deg)',
          },
        },
        '@keyframes glow': {
          '0%': {
            boxShadow: '0 0 10px rgba(255, 90, 95, 0.4)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(255, 90, 95, 0.7)',
          },
          '100%': {
            boxShadow: '0 0 10px rgba(255, 90, 95, 0.4)',
          },
        },
        '@keyframes shimmer': {
          '0%': {
            backgroundPosition: '-500px 0',
          },
          '100%': {
            backgroundPosition: '500px 0',
          },
        },
        '@keyframes bounce': {
          '0%, 20%, 50%, 80%, 100%': {
            transform: 'translateY(0)',
          },
          '40%': {
            transform: 'translateY(-20px)',
          },
          '60%': {
            transform: 'translateY(-10px)',
          },
        },
        '@keyframes spin': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          boxShadow: 'none',
          padding: '14px 30px',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          fontWeight: 600,
          '&:hover': {
            transform: 'translateY(-5px) scale(1.02)',
            boxShadow: '0 12px 28px rgba(255, 90, 95, 0.3)',
          },
          '&:active': {
            transform: 'translateY(-2px) scale(0.99)',
          },
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            background: 'linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 70%)',
            transform: 'translateX(-100%)',
          },
          '&:hover::after': {
            transition: 'all 0.8s ease-in-out',
            transform: 'translateX(100%)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #FF5A5F, #FF3366)',
          '&:hover': {
            background: 'linear-gradient(135deg, #FF3366, #FF0044)',
            boxShadow: '0 10px 25px rgba(255, 51, 102, 0.5)',
          },
          '&.Mui-disabled': {
            backgroundColor: alpha('#FF5A5F', 0.12),
            color: alpha('#FFFFFF', 0.5),
          },
        },
        containedPrimary: {
          boxShadow: '0 6px 20px rgba(255, 90, 95, 0.4)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, transparent 10%, rgba(255,255,255,0.2) 10%, rgba(255,255,255,0.2) 20%, transparent 20%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer 4s linear infinite',
            pointerEvents: 'none',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #3CDFFF, #00B8D9)',
          boxShadow: '0 6px 20px rgba(60, 223, 255, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #00B8D9, #0099B8)',
            boxShadow: '0 10px 25px rgba(0, 184, 217, 0.5)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: alpha('#FF5A5F', 0.04),
          },
        },
        outlinedPrimary: {
          borderColor: '#FF5A5F',
          '&:hover': {
            borderColor: '#E02A30',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: alpha('#FF5A5F', 0.04),
            transform: 'translateY(-2px)',
          },
        },
        sizeSmall: {
          padding: '8px 20px',
          fontSize: '0.85rem',
          borderRadius: '18px',
        },
        sizeLarge: {
          padding: '16px 38px',
          fontSize: '1.1rem',
          borderRadius: '28px',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '32px',
          '&:last-child': {
            paddingBottom: '32px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '32px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.06)',
          background: '#FFFFFF',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(241, 245, 249, 0.6)',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.09)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at top right, rgba(255, 90, 95, 0.08), transparent 70%)',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'conic-gradient(from 0deg at 50% 50%, rgba(255, 90, 95, 0) 0deg, rgba(255, 90, 95, 0.1) 180deg, rgba(255, 90, 95, 0) 360deg)',
            opacity: 0,
            transition: 'opacity 0.5s ease',
            pointerEvents: 'none',
            animation: 'spin 15s linear infinite',
          },
          '&:hover::after': {
            opacity: 1,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: 'all 0.35s ease',
        },
        rounded: {
          borderRadius: '24px',
        },
        outlined: {
          borderColor: alpha('#4A5578', 0.15),
        },
        elevation1: {
          boxShadow: '0 3px 12px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0 5px 16px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
        },
        elevation4: {
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
        },
        elevation6: {
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.14)',
        },
        elevation8: {
          boxShadow: '0 20px 44px rgba(0, 0, 0, 0.16)',
        },
        elevation12: {
          boxShadow: '0 24px 52px rgba(0, 0, 0, 0.18)',
        },
        elevation16: {
          boxShadow: '0 28px 60px rgba(0, 0, 0, 0.2)',
        },
        elevation24: {
          boxShadow: '0 32px 68px rgba(0, 0, 0, 0.22)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundImage: 'none',
        },
        colorDefault: {
          backgroundColor: alpha('#FFFFFF', 0.85),
          backdropFilter: 'blur(30px)',
          borderBottom: `1px solid ${alpha('#E2E8F0', 0.5)}`,
        },
        colorPrimary: {
          backgroundColor: alpha('#FFFFFF', 0.85),
          backdropFilter: 'blur(30px)',
          borderBottom: `1px solid ${alpha('#E2E8F0', 0.5)}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
          backgroundImage: 'none',
          backgroundColor: alpha('#FFFFFF', 0.98),
          backdropFilter: 'blur(40px)',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s',
          fontSize: '1rem',
        },
        input: {
          '&::placeholder': {
            opacity: 0.6,
            transition: 'opacity 0.3s',
          },
          '&:focus::placeholder': {
            opacity: 0.3,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha('#FF5A5F', 0.5),
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '2px',
            borderColor: '#FF5A5F',
          },
          '&.Mui-focused': {
            boxShadow: `0 0 0 4px ${alpha('#FF5A5F', 0.15)}`,
            transform: 'translateY(-3px)',
          },
          transition: 'all 0.3s',
        },
        notchedOutline: {
          borderColor: alpha('#4A5578', 0.2),
          transition: 'all 0.3s',
        },
        input: {
          padding: '18px 20px',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': {
            borderBottomColor: alpha('#4A5578', 0.2),
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottomColor: alpha('#FF5A5F', 0.5),
          },
          '&:after': {
            borderBottomColor: '#FF5A5F',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 68,
          height: 40,
          padding: 0,
          overflow: 'visible',
          '& .MuiSwitch-switchBase': {
            padding: 6,
            '&.Mui-checked': {
              transform: 'translateX(29px)',
              '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#FF5A5F',
                backgroundImage: 'linear-gradient(to right, #FF5A5F, #FF3366)',
              },
              '& .MuiSwitch-thumb': {
                backgroundColor: '#ffffff',
                boxShadow: '0 0 12px rgba(255, 90, 95, 0.8)',
                '&::before': {
                  opacity: 1,
                },
              },
            },
          },
          '& .MuiSwitch-thumb': {
            width: 28,
            height: 28,
            backgroundColor: '#ffffff',
            boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              width: '16px',
              height: '16px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'transparent',
              borderRadius: '50%',
              opacity: 0,
              transition: 'all 0.3s',
              backgroundImage: 'radial-gradient(circle, rgba(255,90,95,0.8) 0%, rgba(255,51,102,0.3) 60%, transparent 80%)',
            },
          },
          '& .MuiSwitch-track': {
            borderRadius: 20,
            opacity: 1,
            backgroundColor: alpha('#4A5578', 0.2),
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              width: '100%',
              height: '100%',
              left: 0,
              top: 0,
              background: 'linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.2) 50%, transparent 52%)',
              backgroundSize: '10px 10px',
              opacity: 0.3,
              borderRadius: 20,
            },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 3px 12px rgba(0,0,0,0.1)',
          border: `3px solid ${alpha('#FFFFFF', 0.9)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1) rotate(5deg)',
            boxShadow: '0 5px 16px rgba(0,0,0,0.15)',
          },
        },
        colorDefault: {
          backgroundColor: alpha('#FF5A5F', 0.15),
          color: '#E02A30',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          height: '38px',
          fontWeight: 600,
          fontSize: '0.9rem',
          background: alpha('#FF5A5F', 0.08),
          color: '#E02A30',
          transition: 'all 0.3s',
          '&:hover': {
            background: alpha('#FF5A5F', 0.12),
            transform: 'translateY(-3px)',
          },
          '&.MuiChip-colorPrimary': {
            background: alpha('#FF5A5F', 0.08),
            color: '#E02A30',
          },
          '&.MuiChip-colorSecondary': {
            background: alpha('#3CDFFF', 0.08),
            color: '#00B8D9',
          },
          '&.MuiChip-colorSuccess': {
            background: alpha('#00E096', 0.08),
            color: '#00AD72',
          },
          '&.MuiChip-colorError': {
            background: alpha('#FF3D71', 0.08),
            color: '#DB004D',
          },
          '&.MuiChip-colorWarning': {
            background: alpha('#FFAA00', 0.08),
            color: '#E09300',
          },
          '&.MuiChip-colorInfo': {
            background: alpha('#2196FF', 0.08),
            color: '#0069D9',
          },
        },
        outlined: {
          borderColor: alpha('#FF5A5F', 0.3),
          '&:hover': {
            borderColor: alpha('#FF5A5F', 0.6),
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
          borderRadius: '20px',
          margin: '6px 0',
          padding: '14px 18px',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          '&.Mui-selected': {
            backgroundColor: alpha('#FF5A5F', 0.08),
            '&:hover': {
              backgroundColor: alpha('#FF5A5F', 0.12),
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              height: '70%',
              width: '5px',
              backgroundColor: '#FF5A5F',
              borderRadius: '0 5px 5px 0',
            },
          },
          '&:hover': {
            backgroundColor: alpha('#FF5A5F', 0.04),
            transform: 'translateX(6px)',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#4A5578',
          minWidth: '44px',
          '.Mui-selected > &': {
            color: '#FF5A5F',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          transition: 'all 0.3s',
          fontWeight: 600,
          color: '#FF5A5F',
          position: 'relative',
          '&:hover': {
            textDecoration: 'none',
            color: '#E02A30',
            textShadow: '0 0 8px rgba(255, 90, 95, 0.3)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '0%',
            height: '3px',
            bottom: '-4px',
            left: 0,
            backgroundColor: '#E02A30',
            transition: 'width 0.35s ease',
            borderRadius: '3px',
          },
          '&:hover::after': {
            width: '100%',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: alpha('#192140', 0.95),
          backdropFilter: 'blur(16px)',
          color: '#FFFFFF',
          borderRadius: '16px',
          padding: '12px 20px',
          fontSize: '0.9rem',
          fontWeight: 500,
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
          border: `1px solid ${alpha('#4A5578', 0.2)}`,
          maxWidth: 320,
        },
        arrow: {
          color: alpha('#192140', 0.95),
          '&::before': {
            border: `1px solid ${alpha('#4A5578', 0.2)}`,
            backgroundColor: alpha('#192140', 0.95),
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '32px',
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.1)',
          backgroundImage: 'none',
          background: '#FFFFFF',
          border: `1px solid ${alpha('#E2E8F0', 0.5)}`,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            right: '0',
            width: '30%',
            height: '30%',
            background: 'radial-gradient(circle, rgba(255,90,95,0.06) 0%, transparent 70%)',
            borderRadius: '0 0 0 100%',
            pointerEvents: 'none',
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '28px 32px 16px',
          fontSize: '1.6rem',
          fontWeight: 700,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '24px 32px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 32px 28px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: alpha('#4A5578', 0.12),
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#1A1F36', 0.3),
          backdropFilter: 'blur(16px)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '24px',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12)',
          border: `1px solid ${alpha('#E2E8F0', 0.5)}`,
          backgroundImage: 'none',
          background: alpha('#FFFFFF', 0.97),
          backdropFilter: 'blur(30px)',
        },
        list: {
          padding: '10px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: '52px',
          padding: '12px 18px',
          borderRadius: '16px',
          transition: 'all 0.25s',
          margin: '3px 0',
          '&:hover': {
            backgroundColor: alpha('#FF5A5F', 0.05),
            transform: 'translateX(4px)',
          },
          '&.Mui-selected': {
            backgroundColor: alpha('#FF5A5F', 0.08),
            '&:hover': {
              backgroundColor: alpha('#FF5A5F', 0.12),
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '20px 28px',
          borderColor: alpha('#4A5578', 0.12),
        },
        head: {
          fontWeight: 700,
          color: '#1A1F36',
          backgroundColor: alpha('#F4F7FE', 0.8),
          fontSize: '0.95rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        },
        body: {
          fontSize: '1rem',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'all 0.25s',
          '&:hover': {
            backgroundColor: alpha('#4A5578', 0.03),
            transform: 'translateY(-2px)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
          border: `1px solid ${alpha('#E2E8F0', 0.5)}`,
          overflow: 'hidden',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          transition: 'all 0.4s',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '18px 0',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
            background: '#FFFFFF',
          },
          backgroundColor: 'transparent',
          backgroundImage: 'none',
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: '0 32px',
          minHeight: '72px',
          transition: 'all 0.3s',
          '&.Mui-expanded': {
            backgroundColor: alpha('#FF5A5F', 0.04),
          },
        },
        content: {
          margin: '18px 0',
        },
        expandIconWrapper: {
          color: '#FF5A5F',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          '&.Mui-expanded': {
            transform: 'rotate(225deg)',
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '16px 32px 32px',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          paddingTop: '18px',
          paddingBottom: '18px',
          paddingLeft: '20px',
        },
        icon: {
          color: '#4A5578',
          transition: 'transform 0.3s',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${alpha('#4A5578', 0.12)}`,
        },
        indicator: {
          height: '4px',
          borderRadius: '4px 4px 0 0',
          background: 'linear-gradient(90deg, #FF5A5F, #FF3366)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '18px 24px',
          marginRight: '10px',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: '56px',
          minWidth: '140px',
          '&.Mui-selected': {
            backgroundColor: alpha('#FF5A5F', 0.06),
            color: '#E02A30',
          },
          '&:hover:not(.Mui-selected)': {
            backgroundColor: alpha('#4A5578', 0.04),
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 700,
          borderRadius: '10px',
          padding: '0 10px',
          height: '22px',
          minWidth: '22px',
          fontSize: '0.8rem',
        },
        colorPrimary: {
          backgroundColor: '#FF5A5F',
        },
        colorSecondary: {
          backgroundColor: '#3CDFFF',
        },
        colorError: {
          backgroundColor: '#FF3D71',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          padding: '18px 24px',
          backdropFilter: 'blur(20px)',
          border: '1px solid transparent',
          animation: 'float 4s ease-in-out infinite',
        },
        standardSuccess: {
          backgroundColor: alpha('#00E096', 0.08),
          color: '#00AD72',
          borderColor: alpha('#00E096', 0.2),
        },
        standardError: {
          backgroundColor: alpha('#FF3D71', 0.08),
          color: '#DB004D',
          borderColor: alpha('#FF3D71', 0.2),
        },
        standardWarning: {
          backgroundColor: alpha('#FFAA00', 0.08),
          color: '#E09300',
          borderColor: alpha('#FFAA00', 0.2),
        },
        standardInfo: {
          backgroundColor: alpha('#2196FF', 0.08),
          color: '#0069D9',
          borderColor: alpha('#2196FF', 0.2),
        },
        icon: {
          opacity: 0.9,
        },
      },
    },
    MuiAlertTitle: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          marginBottom: '10px',
          fontSize: '1.1rem',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          height: '8px',
          backgroundColor: alpha('#4A5578', 0.1),
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            animation: 'shimmer 2s infinite',
            pointerEvents: 'none',
          },
        },
        barColorPrimary: {
          background: 'linear-gradient(90deg, #FF5A5F, #FF3366)',
        },
        barColorSecondary: {
          background: 'linear-gradient(90deg, #3CDFFF, #00B8D9)',
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        colorPrimary: {
          color: '#FF5A5F',
        },
        colorSecondary: {
          color: '#3CDFFF',
        },
        root: {
          animation: `$spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite`,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#4A5578', 0.08),
          borderRadius: '12px',
          '&::after': {
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            animation: 'shimmer 1.5s infinite',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          borderColor: alpha('#4A5578', 0.12),
          padding: '12px 18px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          textTransform: 'none',
          fontWeight: 600,
          '&.Mui-selected': {
            backgroundColor: alpha('#FF5A5F', 0.08),
            color: '#E02A30',
            '&:hover': {
              backgroundColor: alpha('#FF5A5F', 0.12),
            },
          },
          '&:hover': {
            backgroundColor: alpha('#4A5578', 0.05),
            transform: 'translateY(-3px)',
          },
        },
      },
    },
  },
};