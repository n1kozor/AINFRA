import { ThemeOptions, alpha } from '@mui/material';

export const darkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#60a5fa', // Lighter blue for dark mode
      light: '#93c5fd',
      dark: '#3b82f6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#34d399', // Teal
      light: '#6ee7b7',
      dark: '#10b981',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0f172a', // Deep blue-black
      paper: '#1e293b', // Lighter navy blue
    },
    error: {
      main: '#f87171', // Soft red
      light: '#fca5a5',
      dark: '#ef4444',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#fbbf24', // Warm orange
      light: '#fcd34d',
      dark: '#f59e0b',
      contrastText: '#000000',
    },
    info: {
      main: '#38bdf8', // Sky blue
      light: '#7dd3fc',
      dark: '#0ea5e9',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4ade80', // Green
      light: '#86efac',
      dark: '#22c55e',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#f1f5f9', // Nearly white
      secondary: '#94a3b8', // Light gray
    },
    divider: 'rgba(255,255,255,0.08)',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.025em',
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
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.1)',
    '0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 2px 3px -1px rgba(0, 0, 0, 0.15)',
    '0 4px 6px -2px rgba(0, 0, 0, 0.25), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    '0 6px 10px -3px rgba(0, 0, 0, 0.3), 0 3px 6px -2px rgba(0, 0, 0, 0.25)',
    '0 8px 13px -4px rgba(0, 0, 0, 0.35), 0 4px 7px -3px rgba(0, 0, 0, 0.3)',
    '0 10px 16px -5px rgba(0, 0, 0, 0.4), 0 5px 8px -4px rgba(0, 0, 0, 0.35)',
    '0 12px 20px -6px rgba(0, 0, 0, 0.45), 0 6px 10px -5px rgba(0, 0, 0, 0.4)',
    '0 14px 24px -7px rgba(0, 0, 0, 0.5), 0 7px 12px -6px rgba(0, 0, 0, 0.45)',
    '0 16px 28px -8px rgba(0, 0, 0, 0.55), 0 8px 14px -7px rgba(0, 0, 0, 0.5)',
    '0 18px 32px -9px rgba(0, 0, 0, 0.6), 0 9px 16px -8px rgba(0, 0, 0, 0.55)',
    '0 20px 36px -10px rgba(0, 0, 0, 0.65), 0 10px 18px -9px rgba(0, 0, 0, 0.6)',
    '0 22px 40px -11px rgba(0, 0, 0, 0.7), 0 11px 20px -10px rgba(0, 0, 0, 0.65)',
    '0 24px 44px -12px rgba(0, 0, 0, 0.75), 0 12px 22px -11px rgba(0, 0, 0, 0.7)',
    '0 26px 48px -13px rgba(0, 0, 0, 0.8), 0 13px 24px -12px rgba(0, 0, 0, 0.75)',
    '0 28px 52px -14px rgba(0, 0, 0, 0.85), 0 14px 26px -13px rgba(0, 0, 0, 0.8)',
    '0 30px 56px -15px rgba(0, 0, 0, 0.9), 0 15px 28px -14px rgba(0, 0, 0, 0.85)',
    '0 32px 60px -16px rgba(0, 0, 0, 0.95), 0 16px 30px -15px rgba(0, 0, 0, 0.9)',
    '0 34px 64px -17px rgba(0, 0, 0, 1), 0 17px 32px -16px rgba(0, 0, 0, 0.95)',
    '0 36px 68px -18px rgba(0, 0, 0, 1), 0 18px 34px -17px rgba(0, 0, 0, 1)',
    '0 38px 72px -19px rgba(0, 0, 0, 1), 0 19px 36px -18px rgba(0, 0, 0, 1)',
    '0 40px 80px -20px rgba(0, 0, 0, 1), 0 20px 38px -19px rgba(0, 0, 0, 1)',
    '0 9px 46px rgba(0, 0, 0, 0.8), 0 24px 38px rgba(0, 0, 0, 0.9), 0 11px 15px rgba(0, 0, 0, 0.85)',
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
          backgroundColor: alpha('#60a5fa', 0.3),
          color: '#f1f5f9',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: alpha('#f1f5f9', 0.2),
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          backgroundColor: alpha('#f1f5f9', 0.3),
        },
        '@keyframes pulse': {
          '0%': {
            boxShadow: '0 0 0 0 rgba(96, 165, 250, 0.7)',
          },
          '70%': {
            boxShadow: '0 0 0 10px rgba(96, 165, 250, 0)',
          },
          '100%': {
            boxShadow: '0 0 0 0 rgba(96, 165, 250, 0)',
          },
        },
        '@keyframes ripple': {
          '0%': {
            transform: 'scale(0.8)',
            opacity: 1,
          },
          '100%': {
            transform: 'scale(2)',
            opacity: 0,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: 'none',
          padding: '10px 24px',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          fontWeight: 600,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(96, 165, 250, 0.3)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
          '&:hover': {
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          },
          '&.Mui-disabled': {
            backgroundColor: alpha('#60a5fa', 0.12),
            color: alpha('#f1f5f9', 0.3),
          },
        },
        containedPrimary: {
          boxShadow: '0 4px 14px rgba(96, 165, 250, 0.4)',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #34d399, #10b981)',
          boxShadow: '0 4px 14px rgba(52, 211, 153, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #10b981, #059669)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.8rem',
        },
        sizeLarge: {
          padding: '12px 32px',
          fontSize: '1rem',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          background: 'linear-gradient(145deg, #1e293b, #15203b)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
          position: 'relative',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: '16px',
        },
        outlined: {
          borderColor: alpha('#f1f5f9', 0.1),
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
        },
        elevation3: {
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
        },
        elevation4: {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
        },
        elevation6: {
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
        },
        elevation8: {
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.55)',
        },
        elevation12: {
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.6)',
        },
        elevation16: {
          boxShadow: '0 24px 56px rgba(0, 0, 0, 0.65)',
        },
        elevation24: {
          boxShadow: '0 28px 64px rgba(0, 0, 0, 0.7)',
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
          backgroundColor: alpha('#0f172a', 0.8),
          backdropFilter: 'blur(20px)',
        },
        colorPrimary: {
          backgroundColor: alpha('#0f172a', 0.8),
          backdropFilter: 'blur(20px)',
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
          fontSize: '0.95rem',
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
          borderRadius: '14px',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha('#60a5fa', 0.4),
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '2px',
          },
        },
        notchedOutline: {
          borderColor: alpha('#f1f5f9', 0.12),
          transition: 'all 0.2s',
        },
        input: {
          padding: '16px',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': {
            borderBottomColor: alpha('#f1f5f9', 0.1),
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottomColor: alpha('#60a5fa', 0.5),
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 56,
          height: 32,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 4,
            '&.Mui-checked': {
              transform: 'translateX(24px)',
              '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#60a5fa',
              },
              '& .MuiSwitch-thumb': {
                backgroundColor: '#ffffff',
              },
            },
          },
          '& .MuiSwitch-thumb': {
            width: 24,
            height: 24,
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          },
          '& .MuiSwitch-track': {
            borderRadius: 16,
            opacity: 1,
            backgroundColor: alpha('#f1f5f9', 0.15),
            transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        },
        colorDefault: {
          backgroundColor: alpha('#60a5fa', 0.15),
          color: '#60a5fa',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          height: '32px',
          fontWeight: 500,
          fontSize: '0.85rem',
          background: alpha('#60a5fa', 0.15),
          color: '#60a5fa',
          '&.MuiChip-colorPrimary': {
            background: alpha('#60a5fa', 0.15),
            color: '#60a5fa',
          },
          '&.MuiChip-colorSecondary': {
            background: alpha('#34d399', 0.15),
            color: '#34d399',
          },
          '&.MuiChip-colorSuccess': {
            background: alpha('#4ade80', 0.15),
            color: '#4ade80',
          },
          '&.MuiChip-colorError': {
            background: alpha('#f87171', 0.15),
            color: '#f87171',
          },
          '&.MuiChip-colorWarning': {
            background: alpha('#fbbf24', 0.15),
            color: '#fbbf24',
          },
          '&.MuiChip-colorInfo': {
            background: alpha('#38bdf8', 0.15),
            color: '#38bdf8',
          },
        },
        outlined: {
          borderColor: alpha('#60a5fa', 0.3),
        },
        label: {
          padding: '0 12px',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '14px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&.Mui-selected': {
            backgroundColor: alpha('#60a5fa', 0.15),
            '&:hover': {
              backgroundColor: alpha('#60a5fa', 0.25),
            },
          },
          '&:hover': {
            backgroundColor: alpha('#60a5fa', 0.1),
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          transition: 'all 0.2s',
          fontWeight: 500,
          color: '#60a5fa',
          '&:hover': {
            textDecoration: 'none',
            color: '#3b82f6',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: alpha('#f1f5f9', 0.9),
          backdropFilter: 'blur(8px)',
          color: '#0f172a',
          borderRadius: '10px',
          padding: '8px 16px',
          fontSize: '0.8rem',
          fontWeight: 500,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        },
        arrow: {
          color: alpha('#f1f5f9', 0.9),
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '24px',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5)',
          backgroundImage: 'none',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: alpha('#f1f5f9', 0.1),
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#0f172a', 0.7),
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          border: `1px solid ${alpha('#f1f5f9', 0.05)}`,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: '48px',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: alpha('#60a5fa', 0.1),
          },
          '&.Mui-selected': {
            backgroundColor: alpha('#60a5fa', 0.15),
            '&:hover': {
              backgroundColor: alpha('#60a5fa', 0.25),
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          borderColor: alpha('#f1f5f9', 0.1),
        },
        head: {
          fontWeight: 600,
          color: '#f1f5f9',
          backgroundColor: alpha('#1e293b', 0.5),
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          transition: 'all 0.3s',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '16px 0',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: '0 24px',
          minHeight: '60px',
        },
        content: {
          margin: '16px 0',
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '0 24px 24px',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          paddingTop: '16px',
          paddingBottom: '16px',
          paddingLeft: '16px',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: '3px',
          borderRadius: '3px',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 16px',
          marginRight: '8px',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          transition: 'all 0.2s',
          minHeight: '48px',
          minWidth: 'auto',
          '&.Mui-selected': {
            backgroundColor: alpha('#60a5fa', 0.15),
            color: '#60a5fa',
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
          borderRadius: '6px',
          padding: '0 6px',
          height: '18px',
          minWidth: '18px',
        },
      },
    },
  },
};