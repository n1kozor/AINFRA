import { ThemeOptions, alpha } from '@mui/material';

export const lightTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#8B5CF6', // Vibrant purple for 2025
      light: '#A78BFA',
      dark: '#7C3AED',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10B981', // Modern teal
      light: '#34D399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8FAFC', // Soft white/blue tint
      paper: '#FFFFFF', // Pure white
    },
    error: {
      main: '#F43F5E', // Vibrant rose
      light: '#FB7185',
      dark: '#E11D48',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#F59E0B', // Amber
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: '#ffffff',
    },
    info: {
      main: '#0EA5E9', // Electric blue
      light: '#38BDF8',
      dark: '#0284C7',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10B981', // Emerald
      light: '#34D399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#0F172A', // Deep navy
      secondary: '#475569', // Medium slate gray
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
    borderRadius: 12,
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
          backgroundColor: alpha('#8B5CF6', 0.2),
          color: '#0F172A',
        },
        '*::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '*::-webkit-scrollbar-track': {
          background: '#F8FAFC',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: alpha('#94A3B8', 0.4),
          borderRadius: '3px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          backgroundColor: alpha('#8B5CF6', 0.5),
        },
        '@keyframes pulse': {
          '0%': {
            boxShadow: '0 0 0 0 rgba(139, 92, 246, 0.7)',
          },
          '70%': {
            boxShadow: '0 0 0 10px rgba(139, 92, 246, 0)',
          },
          '100%': {
            boxShadow: '0 0 0 0 rgba(139, 92, 246, 0)',
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
        '@keyframes float': {
          '0%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
          '100%': {
            transform: 'translateY(0px)',
          },
        },
        '@keyframes glow': {
          '0%': {
            boxShadow: '0 0 5px rgba(139, 92, 246, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.6)',
          },
          '100%': {
            boxShadow: '0 0 5px rgba(139, 92, 246, 0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: 'none',
          padding: '12px 28px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          fontWeight: 600,
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.25)',
          },
          '&:active': {
            transform: 'translateY(-1px)',
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
            background: 'linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 70%)',
            transform: 'translateX(-100%)',
          },
          '&:hover::after': {
            transition: 'all 0.6s ease-in-out',
            transform: 'translateX(100%)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
          },
          '&.Mui-disabled': {
            backgroundColor: alpha('#8B5CF6', 0.12),
            color: alpha('#FFFFFF', 0.5),
          },
        },
        containedPrimary: {
          boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #10B981, #059669)',
          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #059669, #047857)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: alpha('#8B5CF6', 0.04),
          },
        },
        outlinedPrimary: {
          borderColor: '#8B5CF6',
          '&:hover': {
            borderColor: '#7C3AED',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: alpha('#8B5CF6', 0.04),
          },
        },
        sizeSmall: {
          padding: '8px 18px',
          fontSize: '0.85rem',
          borderRadius: '12px',
        },
        sizeLarge: {
          padding: '14px 36px',
          fontSize: '1.1rem',
          borderRadius: '18px',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '28px',
          '&:last-child': {
            paddingBottom: '28px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          background: '#FFFFFF',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(241, 245, 249, 0.6)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at top right, rgba(139, 92, 246, 0.08), transparent 60%)',
            pointerEvents: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: 'all 0.25s ease',
        },
        rounded: {
          borderRadius: '20px',
        },
        outlined: {
          borderColor: alpha('#94A3B8', 0.2),
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
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.14)',
        },
        elevation8: {
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.16)',
        },
        elevation12: {
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.18)',
        },
        elevation16: {
          boxShadow: '0 24px 56px rgba(0, 0, 0, 0.2)',
        },
        elevation24: {
          boxShadow: '0 28px 64px rgba(0, 0, 0, 0.22)',
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
          backgroundColor: alpha('#FFFFFF', 0.75),
          backdropFilter: 'blur(24px)',
          borderBottom: `1px solid ${alpha('#E2E8F0', 0.8)}`,
        },
        colorPrimary: {
          backgroundColor: alpha('#FFFFFF', 0.75),
          backdropFilter: 'blur(24px)',
          borderBottom: `1px solid ${alpha('#E2E8F0', 0.8)}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
          backgroundImage: 'none',
          backgroundColor: alpha('#FFFFFF', 0.95),
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s',
          fontSize: '0.95rem',
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
          borderRadius: '16px',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha('#8B5CF6', 0.5),
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '2px',
            borderColor: '#8B5CF6',
          },
          '&.Mui-focused': {
            boxShadow: `0 0 0 3px ${alpha('#8B5CF6', 0.15)}`,
          },
          transition: 'box-shadow 0.3s',
        },
        notchedOutline: {
          borderColor: alpha('#94A3B8', 0.25),
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
            borderBottomColor: alpha('#94A3B8', 0.25),
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottomColor: alpha('#8B5CF6', 0.5),
          },
          '&:after': {
            borderBottomColor: '#8B5CF6',
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
          '& .MuiSwitch-switchBase': {
            padding: 4,
            '&.Mui-checked': {
              transform: 'translateX(26px)',
              '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#8B5CF6',
                backgroundImage: 'linear-gradient(to right, #8B5CF6, #6D28D9)',
              },
              '& .MuiSwitch-thumb': {
                backgroundColor: '#ffffff',
                boxShadow: '0 0 8px rgba(139, 92, 246, 0.8)',
              },
            },
          },
          '& .MuiSwitch-thumb': {
            width: 26,
            height: 26,
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            transition: 'all 0.3s',
          },
          '& .MuiSwitch-track': {
            borderRadius: 17,
            opacity: 1,
            backgroundColor: alpha('#94A3B8', 0.3),
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          border: `2px solid ${alpha('#FFFFFF', 0.8)}`,
        },
        colorDefault: {
          backgroundColor: alpha('#8B5CF6', 0.12),
          color: '#7C3AED',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          height: '36px',
          fontWeight: 600,
          fontSize: '0.85rem',
          background: alpha('#8B5CF6', 0.08),
          color: '#7C3AED',
          transition: 'all 0.2s',
          '&:hover': {
            background: alpha('#8B5CF6', 0.12),
          },
          '&.MuiChip-colorPrimary': {
            background: alpha('#8B5CF6', 0.08),
            color: '#7C3AED',
          },
          '&.MuiChip-colorSecondary': {
            background: alpha('#10B981', 0.08),
            color: '#059669',
          },
          '&.MuiChip-colorSuccess': {
            background: alpha('#10B981', 0.08),
            color: '#059669',
          },
          '&.MuiChip-colorError': {
            background: alpha('#F43F5E', 0.08),
            color: '#E11D48',
          },
          '&.MuiChip-colorWarning': {
            background: alpha('#F59E0B', 0.08),
            color: '#D97706',
          },
          '&.MuiChip-colorInfo': {
            background: alpha('#0EA5E9', 0.08),
            color: '#0284C7',
          },
        },
        outlined: {
          borderColor: alpha('#8B5CF6', 0.3),
          '&:hover': {
            borderColor: alpha('#8B5CF6', 0.6),
          },
        },
        label: {
          padding: '0 14px',
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
          borderRadius: '16px',
          margin: '4px 0',
          padding: '12px 16px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&.Mui-selected': {
            backgroundColor: alpha('#8B5CF6', 0.08),
            '&:hover': {
              backgroundColor: alpha('#8B5CF6', 0.12),
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              height: '65%',
              width: '4px',
              backgroundColor: '#8B5CF6',
              borderRadius: '0 4px 4px 0',
            },
          },
          '&:hover': {
            backgroundColor: alpha('#8B5CF6', 0.04),
            transform: 'translateX(4px)',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#64748B',
          minWidth: '42px',
          '.Mui-selected > &': {
            color: '#8B5CF6',
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
          color: '#8B5CF6',
          position: 'relative',
          '&:hover': {
            textDecoration: 'none',
            color: '#7C3AED',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '0%',
            height: '2px',
            bottom: '-2px',
            left: 0,
            backgroundColor: '#7C3AED',
            transition: 'width 0.3s ease',
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
          backgroundColor: alpha('#F8FAFC', 0.9),
          backdropFilter: 'blur(10px)',
          color: '#0F172A',
          borderRadius: '12px',
          padding: '10px 18px',
          fontSize: '0.85rem',
          fontWeight: 500,
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${alpha('#E2E8F0', 0.6)}`,
          maxWidth: 300,
        },
        arrow: {
          color: alpha('#F8FAFC', 0.9),
          '&::before': {
            border: `1px solid ${alpha('#E2E8F0', 0.6)}`,
            backgroundColor: alpha('#F8FAFC', 0.9),
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '28px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.08)',
          backgroundImage: 'none',
          background: '#FFFFFF',
          border: `1px solid ${alpha('#E2E8F0', 0.6)}`,
          overflow: 'hidden',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '24px 28px 16px',
          fontSize: '1.5rem',
          fontWeight: 700,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '20px 28px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 28px 24px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: alpha('#94A3B8', 0.15),
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#0F172A', 0.2),
          backdropFilter: 'blur(12px)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${alpha('#E2E8F0', 0.6)}`,
          backgroundImage: 'none',
          background: '#FFFFFF',
          backdropFilter: 'blur(24px)',
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
          '&:hover': {
            backgroundColor: alpha('#8B5CF6', 0.04),
          },
          '&.Mui-selected': {
            backgroundColor: alpha('#8B5CF6', 0.08),
            '&:hover': {
              backgroundColor: alpha('#8B5CF6', 0.12),
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '18px 24px',
          borderColor: alpha('#94A3B8', 0.15),
        },
        head: {
          fontWeight: 700,
          color: '#0F172A',
          backgroundColor: alpha('#F8FAFC', 0.8),
          fontSize: '0.9rem',
          letterSpacing: '0.03em',
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
            backgroundColor: alpha('#94A3B8', 0.03),
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
          border: `1px solid ${alpha('#E2E8F0', 0.6)}`,
          overflow: 'hidden',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          transition: 'all 0.3s',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '16px 0',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.08)',
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
          padding: '0 28px',
          minHeight: '64px',
          transition: 'all 0.2s',
          '&.Mui-expanded': {
            backgroundColor: alpha('#8B5CF6', 0.04),
          },
        },
        content: {
          margin: '16px 0',
        },
        expandIconWrapper: {
          color: '#8B5CF6',
          transition: 'all 0.3s',
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '16px 28px 28px',
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
          color: '#64748B',
          transition: 'transform 0.2s',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${alpha('#94A3B8', 0.15)}`,
        },
        indicator: {
          height: '3px',
          borderRadius: '3px 3px 0 0',
          background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '16px 20px',
          marginRight: '8px',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          transition: 'all 0.25s',
          minHeight: '48px',
          minWidth: '120px',
          '&.Mui-selected': {
            backgroundColor: alpha('#8B5CF6', 0.06),
            color: '#7C3AED',
          },
          '&:hover:not(.Mui-selected)': {
            backgroundColor: alpha('#94A3B8', 0.04),
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 700,
          borderRadius: '8px',
          padding: '0 8px',
          height: '20px',
          minWidth: '20px',
          fontSize: '0.75rem',
        },
        colorPrimary: {
          backgroundColor: '#8B5CF6',
        },
        colorSecondary: {
          backgroundColor: '#10B981',
        },
        colorError: {
          backgroundColor: '#F43F5E',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          padding: '16px 20px',
          backdropFilter: 'blur(12px)',
        },
        standardSuccess: {
          backgroundColor: alpha('#10B981', 0.08),
          color: '#059669',
        },
        standardError: {
          backgroundColor: alpha('#F43F5E', 0.08),
          color: '#E11D48',
        },
        standardWarning: {
          backgroundColor: alpha('#F59E0B', 0.08),
          color: '#D97706',
        },
        standardInfo: {
          backgroundColor: alpha('#0EA5E9', 0.08),
          color: '#0284C7',
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
          marginBottom: '8px',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          height: '6px',
          backgroundColor: alpha('#94A3B8', 0.12),
        },
        barColorPrimary: {
          background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',
        },
        barColorSecondary: {
          background: 'linear-gradient(90deg, #10B981, #059669)',
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        colorPrimary: {
          color: '#8B5CF6',
        },
        colorSecondary: {
          color: '#10B981',
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#94A3B8', 0.12),
          borderRadius: '10px',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          borderColor: alpha('#94A3B8', 0.15),
          padding: '10px 16px',
          transition: 'all 0.2s',
          textTransform: 'none',
          fontWeight: 600,
          '&.Mui-selected': {
            backgroundColor: alpha('#8B5CF6', 0.08),
            color: '#7C3AED',
            '&:hover': {
              backgroundColor: alpha('#8B5CF6', 0.12),
            },
          },
          '&:hover': {
            backgroundColor: alpha('#94A3B8', 0.06),
          },
        },
      },
    },
  },
};