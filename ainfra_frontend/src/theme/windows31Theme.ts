import { ThemeOptions } from '@mui/material';

export const windows31Theme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#000080', // Navy blue - Windows 3.1 classic
      light: '#0000A8',
      dark: '#000066',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#008080', // Teal - classic Windows accent
      light: '#00A8A8',
      dark: '#006666',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#C0C0C0', // Classic Windows gray
      paper: '#FFFFFF', // White window
    },
    error: {
      main: '#FF0000', // Bright red for errors
      light: '#FF3333',
      dark: '#CC0000',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FF8000', // Orange
      light: '#FFA333',
      dark: '#CC6600',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#0000FF', // Bright blue
      light: '#3333FF',
      dark: '#0000CC',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#008000', // Green
      light: '#00A600',
      dark: '#006600',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#000000', // Black text
      secondary: '#333333', // Dark gray for secondary text
      disabled: '#777777', // Gray for disabled text
    },
    divider: '#808080', // Gray divider
    action: {
      active: '#000000',
      hover: 'rgba(0, 0, 0, 0.1)',
      selected: 'rgba(0, 0, 128, 0.2)',
      disabled: 'rgba(0, 0, 0, 0.3)',
      disabledBackground: 'rgba(0, 0, 0, 0.1)',
    },
  },
  typography: {
    fontFamily: '"MS Sans Serif", "Pixelated MS Sans Serif", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: 0,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      letterSpacing: 0,
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 700,
      letterSpacing: 0,
      fontSize: '1.75rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 700,
      letterSpacing: 0,
      fontSize: '1.5rem',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 700,
      letterSpacing: 0,
      fontSize: '1.25rem',
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 700,
      fontSize: '1rem',
      lineHeight: 1.2,
    },
    subtitle1: {
      fontWeight: 600,
      letterSpacing: 0,
      fontSize: '0.9rem',
      lineHeight: 1.2,
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: '0.8rem',
      lineHeight: 1.2,
    },
    body1: {
      fontWeight: 400,
      fontSize: '0.9rem',
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.8rem',
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: 0,
      fontSize: '0.8rem',
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    overline: {
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      fontSize: '0.7rem',
    },
  },
  shape: {
    borderRadius: 0, // Square corners everywhere!
  },
  shadows: [
    'none',
    '2px 2px 0 #000000',  // 1
    '2px 2px 0 #000000',  // 2
    '2px 2px 0 #000000',  // 3
    '2px 2px 0 #000000',  // 4
    '2px 2px 0 #000000',  // 5
    '2px 2px 0 #000000',  // 6
    '2px 2px 0 #000000',  // 7
    '2px 2px 0 #000000',  // 8
    '2px 2px 0 #000000',  // 9
    '2px 2px 0 #000000',  // 10
    '2px 2px 0 #000000',  // 11
    '2px 2px 0 #000000',  // 12
    '2px 2px 0 #000000',  // 13
    '2px 2px 0 #000000',  // 14
    '2px 2px 0 #000000',  // 15
    '2px 2px 0 #000000',  // 16
    '2px 2px 0 #000000',  // 17
    '2px 2px 0 #000000',  // 18
    '2px 2px 0 #000000',  // 19
    '2px 2px 0 #000000',  // 20
    '2px 2px 0 #000000',  // 21
    '2px 2px 0 #000000',  // 22
    '2px 2px 0 #000000',  // 23
    '2px 2px 0 #000000',  // 24
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
          overflowX: 'hidden',
        },
        body: {
          backgroundColor: '#008080', // Classic Windows 3.1 desktop background
          backgroundImage: `
            linear-gradient(45deg, #C0C0C0 25%, transparent 25%),
            linear-gradient(-45deg, #C0C0C0 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #C0C0C0 75%),
            linear-gradient(-45deg, transparent 75%, #C0C0C0 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          overflowX: 'hidden',
          fontFamily: '"MS Sans Serif", "Pixelated MS Sans Serif", Arial, sans-serif',
          // Optional: add web font to simulate MS Sans Serif if you want
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '24px',
            backgroundColor: '#000080',
            zIndex: 2000,
          },
        },
        '::selection': {
          backgroundColor: '#000080',
          color: '#FFFFFF',
        },
        '*::-webkit-scrollbar': {
          width: '16px',
          height: '16px',
          backgroundColor: '#C0C0C0',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#808080',
          border: '1px solid #C0C0C0',
          borderRight: '1px solid #000000',
          borderBottom: '1px solid #000000',
        },
        '*::-webkit-scrollbar-track': {
          backgroundColor: '#C0C0C0',
          border: '1px solid #808080',
          borderLeft: '1px solid #FFFFFF',
          borderTop: '1px solid #FFFFFF',
        },
        '*::-webkit-scrollbar-button': {
          backgroundColor: '#C0C0C0',
          border: '1px solid #808080',
          borderLeft: '1px solid #FFFFFF',
          borderTop: '1px solid #FFFFFF',
          display: 'block',
          height: '16px',
        },
        '@keyframes blink': {
          '0%': { opacity: 1 },
          '50%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        '@font-face': {
          fontFamily: '"MS Sans Serif"',
          src: 'url("https://unpkg.com/98.css@0.1.17/dist/ms_sans_serif.woff2") format("woff2"), url("https://unpkg.com/98.css@0.1.17/dist/ms_sans_serif.woff") format("woff")',
          fontWeight: 400,
          fontStyle: 'normal',
        },

      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#C0C0C0',
          backgroundImage: 'none',
          borderRadius: 0,
          border: '2px solid',
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          boxShadow: 'none !important',
          padding: 1,
        },
        elevation1: {
          boxShadow: 'none !important',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000080',
          boxShadow: 'none',
          borderBottom: '2px solid #FFFFFF',
          borderRadius: 0,
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          '.MuiToolbar-root': {
            minHeight: '24px !important',
            paddingLeft: '8px',
            paddingRight: '8px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 0,
          fontWeight: 400,
          backgroundColor: '#C0C0C0',
          border: '2px solid',
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          boxShadow: 'none',
          padding: '2px 8px',
          minWidth: '75px',
          height: '24px',
          '&:hover': {
            backgroundColor: '#C0C0C0',
            borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          },
          '&:active': {
            borderColor: '#808080 #FFFFFF #FFFFFF #808080',
            backgroundColor: '#C0C0C0',
            padding: '3px 7px 1px 9px',
          },
          '&.Mui-focusVisible': {
            outline: '1px dotted #000000',
            outlineOffset: '-5px',
          },
        },
        contained: {
          backgroundColor: '#C0C0C0',
          '&:hover': {
            backgroundColor: '#C0C0C0',
          },
          '&.MuiButton-containedPrimary': {
            color: '#000000',
            '&:hover': {
              backgroundColor: '#C0C0C0',
            },
          },
        },
        outlined: {
          backgroundColor: '#C0C0C0',
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          '&:hover': {
            backgroundColor: '#C0C0C0',
            borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          },
        },
        text: {
          backgroundColor: 'transparent',
          border: 'none',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          },
          '&:active': {
            borderColor: 'transparent',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            padding: '2px 8px',
          },
        },
        startIcon: {
          marginRight: 4,
        },
        endIcon: {
          marginLeft: 4,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: '#C0C0C0',
          border: '2px solid',
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          padding: 4,
          '&:hover': {
            backgroundColor: '#C0C0C0',
          },
          '&:active': {
            borderColor: '#808080 #FFFFFF #FFFFFF #808080',
            padding: '5px 3px 3px 5px',
          },
          '&.Mui-focusVisible': {
            outline: '1px dotted #000000',
            outlineOffset: '-5px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#C0C0C0',
          backgroundImage: 'none',
          borderRadius: 0,
          border: '2px solid',
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          overflow: 'visible',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-22px',
            left: '-2px',
            right: '-2px',
            height: '20px',
            backgroundColor: '#000080',
            borderTop: '2px solid #FFFFFF',
            borderLeft: '2px solid #FFFFFF',
            borderRight: '2px solid #808080',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '6px',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: 1,
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '4px 8px',
          backgroundColor: '#000080',
          color: '#FFFFFF',
          marginTop: '-1px',
          marginLeft: '-1px',
          marginRight: '-1px',
          '.MuiCardHeader-title': {
            fontSize: '12px',
            fontWeight: 'bold',
          },
          '.MuiCardHeader-action': {
            marginRight: '-4px',
            marginTop: '-2px',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '8px',
          '&:last-child': {
            paddingBottom: '8px',
          },
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '8px',
          justifyContent: 'flex-end',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#C0C0C0',
          borderRight: '2px solid',
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#C0C0C0',
          borderRadius: 0,
          border: '2px solid',
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          '&::before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          minHeight: '24px',
          '&.Mui-expanded': {
            minHeight: '24px',
          },
        },
        content: {
          margin: '4px 0',
          '&.Mui-expanded': {
            margin: '4px 0',
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '8px',
          borderTop: '1px solid #808080',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '2px solid',
          borderColor: '#808080 #FFFFFF #FFFFFF #808080',
          borderRadius: 0,
          fontSize: '12px',
          lineHeight: 1.2,
        },
        input: {
          padding: '2px 4px',
          '&::placeholder': {
            opacity: 0.7,
            fontStyle: 'italic',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        },
        input: {
          padding: '2px 4px',
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#FFFFFF',
          },
          '&.Mui-focused': {
            backgroundColor: '#FFFFFF',
          },
          '&::before, &::after': {
            display: 'none',
          },
        },
        input: {
          padding: '2px 4px',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          '&::before, &::after': {
            display: 'none',
          },
        },
        input: {
          padding: '2px 4px',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '12px',
          marginBottom: '4px',
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '11px',
          marginTop: '2px',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: '2px 24px 2px 4px',
          fontSize: '12px',
        },
        icon: {
          top: 'calc(50% - 6px)',
          right: '4px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '12px',
          minHeight: '24px',
          padding: '2px 8px',
          '&:hover': {
            backgroundColor: '#000080',
            color: '#FFFFFF',
          },
          '&.Mui-selected': {
            backgroundColor: '#000080',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#000080',
            },
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: '2px 8px',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          padding: '2px 8px',
          '&:hover': {
            backgroundColor: '#000080',
            color: '#FFFFFF',
            '.MuiListItemIcon-root, .MuiListItemText-primary, .MuiListItemText-secondary': {
              color: '#FFFFFF',
            },
          },
          '&.Mui-selected': {
            backgroundColor: '#000080',
            color: '#FFFFFF',
            '.MuiListItemIcon-root, .MuiListItemText-primary, .MuiListItemText-secondary': {
              color: '#FFFFFF',
            },
            '&:hover': {
              backgroundColor: '#000080',
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: '24px',
          marginRight: '4px',
          marginLeft: '-4px',
          color: '#000000',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '12px',
        },
        secondary: {
          fontSize: '11px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          height: '2px',
          backgroundColor: 'transparent',
          borderTop: '1px solid #808080',
          borderBottom: '1px solid #FFFFFF',
          '&.MuiDivider-vertical': {
            width: '2px',
            height: 'auto',
            borderLeft: '1px solid #808080',
            borderRight: '1px solid #FFFFFF',
            borderTop: 'none',
            borderBottom: 'none',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 40,
          height: 20,
          padding: 0,
          border: '2px solid',
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          overflow: 'visible',
        },
        switchBase: {
          padding: 0,
          top: 0,
          left: 0,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
          },
        },
        thumb: {
          width: 16,
          height: 16,
          backgroundColor: '#C0C0C0',
          border: '2px solid',
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
        },
        track: {
          opacity: 1,
          backgroundColor: '#FFFFFF',
          borderRadius: 0,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 0,
          marginRight: '4px',
          backgroundColor: '#FFFFFF',
          border: '2px solid',
          borderColor: '#808080 #FFFFFF #FFFFFF #808080',
          borderRadius: 0,
          width: '16px',
          height: '16px',
          '&.Mui-checked': {
            backgroundColor: '#FFFFFF',
            '& .MuiSvgIcon-root': {
              width: '12px',
              height: '12px',
              marginLeft: '0px',
              marginTop: '0px',
            },
          },
          '& .MuiSvgIcon-root': {
            width: '14px',
            height: '14px',
            marginLeft: '-1px',
            marginTop: '-1px',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: 0,
          marginRight: '4px',
          backgroundColor: 'transparent',
          '&.Mui-checked': {
            '& .MuiSvgIcon-root:first-of-type': {
              color: '#FFFFFF',
            },
            '& .MuiSvgIcon-root:last-of-type': {
              transform: 'scale(1)',
              transition: 'transform 150ms cubic-bezier(0.4, 0, 1, 1) 0ms',
            },
          },
          '& .MuiSvgIcon-root': {
            width: '16px',
            height: '16px',
            color: '#000000',
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          height: 6,
          borderRadius: 0,
        },
        rail: {
          height: 6,
          borderRadius: 0,
          backgroundColor: '#FFFFFF',
          border: '2px solid',
          borderColor: '#808080 #FFFFFF #FFFFFF #808080',
        },
        track: {
          height: 6,
          borderRadius: 0,
          backgroundColor: '#C0C0C0',
          border: 'none',
        },
        thumb: {
          width: 16,
          height: 16,
          backgroundColor: '#C0C0C0',
          borderRadius: 0,
          border: '2px solid',
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          marginTop: '-5px',
          marginLeft: '-8px',
          '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          backgroundColor: '#C0C0C0',
          backgroundImage: 'none',
          boxShadow: 'none',
          border: '2px solid',
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          padding: 0,
          '.MuiDialogTitle-root': {
            backgroundColor: '#000080',
            color: '#FFFFFF',
            padding: '2px 8px',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '-1px',
            marginLeft: '-1px',
            marginRight: '-1px',
          },
          '.MuiDialogContent-root': {
            padding: '8px',
            borderTop: '1px solid #808080',
          },
          '.MuiDialogActions-root': {
            padding: '8px',
            justifyContent: 'flex-end',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '2px 8px',
          border: '2px solid',
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          alignItems: 'center',
          '.MuiAlert-icon': {
            marginRight: '4px',
            padding: 0,
          },
          '.MuiAlert-message': {
            padding: 0,
            fontSize: '12px',
          },
          '.MuiAlert-action': {
            marginRight: '-4px',
            padding: 0,
          },
        },
        standardError: {
          backgroundColor: '#FFCCCC',
          color: '#000000',
          '.MuiAlert-icon': {
            color: '#FF0000',
          },
        },
        standardWarning: {
          backgroundColor: '#FFFFCC',
          color: '#000000',
          '.MuiAlert-icon': {
            color: '#FF8000',
          },
        },
        standardInfo: {
          backgroundColor: '#CCCCFF',
          color: '#000000',
          '.MuiAlert-icon': {
            color: '#0000FF',
          },
        },
        standardSuccess: {
          backgroundColor: '#CCFFCC',
          color: '#000000',
          '.MuiAlert-icon': {
            color: '#008000',
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '2px solid',
          borderColor: '#808080 #FFFFFF #FFFFFF #808080',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#C0C0C0',
          border: 'none',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: '#FFFFFF',
          },
          '&:nth-of-type(even)': {
            backgroundColor: '#F0F0F0',
          },
          '&:hover': {
            backgroundColor: '#E0E0E0',
          },
        },
        head: {
          backgroundColor: '#C0C0C0 !important',
          '&:hover': {
            backgroundColor: '#C0C0C0 !important',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '2px 8px',
          fontSize: '12px',
          borderBottom: '1px solid #C0C0C0',
        },
        head: {
          fontWeight: 'bold',
          backgroundColor: '#C0C0C0',
          borderBottom: '2px solid',
          borderColor: 'transparent transparent #808080 transparent',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#FFFFCC',
          color: '#000000',
          border: '1px solid #000000',
          boxShadow: '2px 2px 0 #000000',
          borderRadius: 0,
          fontSize: '11px',
          padding: '2px 4px',
        },
        arrow: {
          color: '#000000',
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            borderRadius: 0,
            backgroundColor: '#C0C0C0',
            border: '2px solid',
            borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
            margin: '0 2px',
            minWidth: '24px',
            height: '24px',
            fontSize: '12px',
            '&:hover': {
              backgroundColor: '#C0C0C0',
            },
            '&.Mui-selected': {
              borderColor: '#808080 #FFFFFF #FFFFFF #808080',
              backgroundColor: '#C0C0C0',
              fontWeight: 'bold',
            },
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: '24px',
          backgroundColor: '#C0C0C0',
        },
        indicator: {
          display: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '12px',
          fontWeight: 'normal',
          minHeight: '24px',
          padding: '2px 12px',
          marginRight: '2px',
          borderRadius: 0,
          border: '2px solid',
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          backgroundColor: '#C0C0C0',
          '&.Mui-selected': {
            borderColor: '#808080 #FFFFFF #C0C0C0 #808080',
            backgroundColor: '#C0C0C0',
            fontWeight: 'bold',
            paddingTop: '3px',
            paddingBottom: '1px',
            paddingLeft: '13px',
            paddingRight: '11px',
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: '#FF0000',
          color: '#FFFFFF',
          fontSize: '10px',
          fontWeight: 'bold',
          minWidth: '16px',
          height: '16px',
          padding: '0 4px',
          borderRadius: 8,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#000080',
        },
        circle: {
          strokeLinecap: 'round',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 16,
          backgroundColor: '#FFFFFF',
          borderRadius: 0,
          border: '2px solid',
          borderColor: '#808080 #FFFFFF #FFFFFF #808080',
        },
        bar: {
          backgroundColor: '#000080',
          borderRadius: 0,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: '#DDDDDD',
          borderRadius: 0,
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiPaper-root': {
            backgroundColor: '#FFFFCC',
            color: '#000000',
            borderRadius: 0,
            boxShadow: '2px 2px 0 #000000',
            border: '2px solid',
            borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: '#000080',
          color: '#FFFFFF',
          border: '2px solid',
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          height: '24px',
          backgroundColor: '#C0C0C0',
          border: '2px solid',
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          '& .MuiChip-label': {
            fontSize: '12px',
            padding: '0 6px',
          },
          '& .MuiChip-deleteIcon': {
            margin: '0 4px 0 -4px',
          },
        },
        deleteIcon: {
          color: '#000000',
          '&:hover': {
            color: '#000000',
          },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: '#C0C0C0',
          '&.Mui-active': {
            color: '#000080',
          },
          '&.Mui-completed': {
            color: '#008000',
          },
        },
        text: {
          fill: '#000000',
          fontWeight: 'bold',
          fontSize: '10px',
        },
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: '#808080',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: {
          padding: '0 !important',
        },
        input: {
          padding: '2px 4px !important',
        },
        endAdornment: {
          right: '4px !important',
        },
        option: {
          fontSize: '12px',
          minHeight: '24px',
          padding: '2px 8px',
          '&[aria-selected="true"]': {
            backgroundColor: '#000080',
            color: '#FFFFFF',
          },
          '&:hover': {
            backgroundColor: '#000080',
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: '#C0C0C0',
          backgroundImage: 'none',
          borderRadius: 0,
          border: '2px solid',
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          boxShadow: '2px 2px 0 #000000',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 0,
          fontWeight: 400,
          border: '2px solid',
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          backgroundColor: '#C0C0C0',
          padding: '2px 8px',
          fontSize: '12px',
          '&:hover': {
            backgroundColor: '#C0C0C0',
          },
          '&.Mui-selected': {
            borderColor: '#808080 #FFFFFF #FFFFFF #808080',
            backgroundColor: '#C0C0C0',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#C0C0C0',
            },
          },
          '&.Mui-disabled': {
            borderColor: '#C0C0C0',
            color: '#808080',
          },
        },
      },
    },
  },
};