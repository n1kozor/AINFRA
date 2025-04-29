import { ThemeOptions, alpha } from '@mui/material';

export const lightTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#3b82f6', // Modern blue
      light: '#93c5fd',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10b981', // Vibrant teal
      light: '#5eead4',
      dark: '#047857',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f1f5f9', // Light gray/blue
      paper: '#ffffff', // White
    },
    error: {
      main: '#ef4444', // Modern red
      light: '#fca5a5',
      dark: '#b91c1c',
    },
    warning: {
      main: '#f59e0b', // Amber
      light: '#fcd34d',
      dark: '#d97706',
    },
    info: {
      main: '#0ea5e9', // Sky blue
      light: '#7dd3fc',
      dark: '#0369a1',
    },
    success: {
      main: '#22c55e', // Green
      light: '#86efac',
      dark: '#15803d',
    },
    text: {
      primary: '#0f172a', // Dark slate blue
      secondary: '#475569', // Slate
    },
    divider: 'rgba(0,0,0,0.06)',
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
    '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
    '0 3px 5px -1px rgba(0, 0, 0, 0.06), 0 2px 3px -1px rgba(0, 0, 0, 0.04)',
    '0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    '0 6px 10px -3px rgba(0, 0, 0, 0.08), 0 3px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 8px 13px -4px rgba(0, 0, 0, 0.1), 0 4px 7px -3px rgba(0, 0, 0, 0.06)',
    '0 10px 16px -5px rgba(0, 0, 0, 0.12), 0 5px 8px -4px rgba(0, 0, 0, 0.07)',
    '0 12px 20px -6px rgba(0, 0, 0, 0.14), 0 6px 10px -5px rgba(0, 0, 0, 0.08)',
    '0 14px 24px -7px rgba(0, 0, 0, 0.16), 0 7px 12px -6px rgba(0, 0, 0, 0.09)',
    '0 16px 28px -8px rgba(0, 0, 0, 0.18), 0 8px 14px -7px rgba(0, 0, 0, 0.1)',
    '0 18px 32px -9px rgba(0, 0, 0, 0.2), 0 9px 16px -8px rgba(0, 0, 0, 0.11)',
    '0 20px 36px -10px rgba(0, 0, 0, 0.22), 0 10px 18px -9px rgba(0, 0, 0, 0.12)',
    '0 22px 40px -11px rgba(0, 0, 0, 0.24), 0 11px 20px -10px rgba(0, 0, 0, 0.13)',
    '0 24px 44px -12px rgba(0, 0, 0, 0.26), 0 12px 22px -11px rgba(0, 0, 0, 0.14)',
    '0 26px 48px -13px rgba(0, 0, 0, 0.28), 0 13px 24px -12px rgba(0, 0, 0, 0.15)',
    '0 28px 52px -14px rgba(0, 0, 0, 0.3), 0 14px 26px -13px rgba(0, 0, 0, 0.16)',
    '0 30px 56px -15px rgba(0, 0, 0, 0.32), 0 15px 28px -14px rgba(0, 0, 0, 0.17)',
    '0 32px 60px -16px rgba(0, 0, 0, 0.34), 0 16px 30px -15px rgba(0, 0, 0, 0.18)',
    '0 34px 64px -17px rgba(0, 0, 0, 0.36), 0 17px 32px -16px rgba(0, 0, 0, 0.19)',
    '0 36px 68px -18px rgba(0, 0, 0, 0.38), 0 18px 34px -17px rgba(0, 0, 0, 0.2)',
    '0 38px 72px -19px rgba(0, 0, 0, 0.4), 0 19px 36px -18px rgba(0, 0, 0, 0.21)',
    '0 40px 80px -20px rgba(0, 0, 0, 0.4), 0 20px 38px -19px rgba(0, 0, 0, 0.22)',
    '0 9px 46px rgba(0, 0, 0, 0.08), 0 24px 38px rgba(0, 0, 0, 0.05), 0 11px 15px rgba(0, 0, 0, 0.05)',
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
          backgroundColor: alpha('#3b82f6', 0.15),
          color: '#0f172a',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: alpha('#0f172a', 0.15),
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          backgroundColor: alpha('#0f172a', 0.25),
        },
        '@keyframes pulse': {
          '0%': {
            boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)',
          },
          '70%': {
            boxShadow: '0 0 0 5px rgba(59, 130, 246, 0)',
          },
          '100%': {
            boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)',
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
            boxShadow: '0 6px 20px rgba(59, 130, 246, 0.1)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          },
          '&.Mui-disabled': {
            backgroundColor: alpha('#3b82f6', 0.12),
            color: alpha('#0f172a', 0.3),
          },
        },
        containedPrimary: {
          boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #10b981, #059669)',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #059669, #047857)',
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
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(234, 242, 252, 0.5)',
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
          borderColor: alpha('#0f172a', 0.08),
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
        },
        elevation3: {
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
        },
        elevation4: {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        },
        elevation6: {
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)',
        },
        elevation8: {
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12)',
        },
        elevation12: {
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.16)',
        },
        elevation16: {
          boxShadow: '0 24px 56px rgba(0, 0, 0, 0.18)',
        },
        elevation24: {
          boxShadow: '0 28px 64px rgba(0, 0, 0, 0.2)',
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
          backgroundColor: alpha('#ffffff', 0.8),
          backdropFilter: 'blur(20px)',
        },
        colorPrimary: {
          backgroundColor: alpha('#ffffff', 0.8),
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
            borderColor: alpha('#3b82f6', 0.4),
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '2px',
          },
        },
        notchedOutline: {
          borderColor: alpha('#0f172a', 0.12),
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
            borderBottomColor: alpha('#0f172a', 0.1),
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottomColor: alpha('#3b82f6', 0.5),
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
                backgroundColor: '#3b82f6',
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
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          },
          '& .MuiSwitch-track': {
            borderRadius: 16,
            opacity: 1,
            backgroundColor: alpha('#0f172a', 0.1),
            transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
        colorDefault: {
          backgroundColor: alpha('#3b82f6', 0.1),
          color: '#3b82f6',
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
          background: alpha('#3b82f6', 0.08),
          color: '#3b82f6',
          '&.MuiChip-colorPrimary': {
            background: alpha('#3b82f6', 0.08),
            color: '#3b82f6',
          },
          '&.MuiChip-colorSecondary': {
            background: alpha('#10b981', 0.08),
            color: '#10b981',
          },
          '&.MuiChip-colorSuccess': {
            background: alpha('#22c55e', 0.08),
            color: '#22c55e',
          },
          '&.MuiChip-colorError': {
            background: alpha('#ef4444', 0.08),
            color: '#ef4444',
          },
          '&.MuiChip-colorWarning': {
            background: alpha('#f59e0b', 0.08),
            color: '#f59e0b',
          },
          '&.MuiChip-colorInfo': {
            background: alpha('#0ea5e9', 0.08),
            color: '#0ea5e9',
          },
        },
        outlined: {
          borderColor: alpha('#3b82f6', 0.3),
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
            backgroundColor: alpha('#3b82f6', 0.1),
            '&:hover': {
              backgroundColor: alpha('#3b82f6', 0.15),
            },
          },
          '&:hover': {
            backgroundColor: alpha('#3b82f6', 0.06),
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
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
          color: '#3b82f6',
          '&:hover': {
            textDecoration: 'none',
            color: '#1d4ed8',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: alpha('#0f172a', 0.85),
          backdropFilter: 'blur(8px)',
          borderRadius: '10px',
          padding: '8px 16px',
          fontSize: '0.8rem',
          fontWeight: 500,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.16)',
        },
        arrow: {
          color: alpha('#0f172a', 0.85),
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '24px',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
          backgroundImage: 'none',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: alpha('#0f172a', 0.05),
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#0f172a', 0.5),
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: '48px',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: alpha('#3b82f6', 0.06),
          },
          '&.Mui-selected': {
            backgroundColor: alpha('#3b82f6', 0.1),
            '&:hover': {
              backgroundColor: alpha('#3b82f6', 0.15),
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          borderColor: alpha('#0f172a', 0.05),
        },
        head: {
          fontWeight: 600,
          color: '#0f172a',
          backgroundColor: alpha('#f8fafc', 0.5),
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          transition: 'all 0.3s',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '16px 0',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
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
            backgroundColor: alpha('#3b82f6', 0.08),
            color: '#3b82f6',
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