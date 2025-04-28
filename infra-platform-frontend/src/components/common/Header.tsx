// Header.tsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  alpha,
  InputBase,
  styled,
  Badge,
  Tooltip,
  Fade,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Brightness4,
  Brightness7,
  Translate,
  Notifications,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useThemeContext } from '../../context/ThemeContext';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '20px',
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.common.white, 0.15)
    : alpha(theme.palette.common.black, 0.07),
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.25)
      : alpha(theme.palette.common.black, 0.09),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  maxWidth: '400px',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  transition: theme.transitions.create(['background-color', 'box-shadow']),
  border: `1px solid ${theme.palette.mode === 'dark'
    ? alpha(theme.palette.common.white, 0.15)
    : alpha(theme.palette.common.black, 0.05)}`,
  '&:focus-within': {
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.25)
      : alpha(theme.palette.common.black, 0.09),
  }
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.mode === 'dark'
    ? alpha(theme.palette.common.white, 0.7)
    : alpha(theme.palette.common.black, 0.6),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '32ch',
      '&:focus': {
        width: '40ch',
      },
    },
  },
}));

const ActionIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.common.white, 0.1)
    : alpha(theme.palette.common.black, 0.05),
  borderRadius: '14px',
  padding: '10px',
  margin: '0 6px',
  transition: theme.transitions.create(['background-color', 'transform', 'box-shadow']),
  border: `1px solid ${theme.palette.mode === 'dark'
    ? alpha(theme.palette.common.white, 0.1)
    : alpha(theme.palette.common.black, 0.02)}`,
  color: theme.palette.mode === 'dark'
    ? theme.palette.common.white
    : theme.palette.common.black,
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.2)
      : alpha(theme.palette.common.black, 0.1),
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? `0 4px 8px ${alpha(theme.palette.common.black, 0.25)}`
      : `0 4px 8px ${alpha(theme.palette.common.black, 0.1)}`,
  },
}));

const Header = () => {
  const { toggleSidebar, searchQuery, setSearchQuery } = useAppContext();
  const { mode, toggleMode } = useThemeContext();
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const [languageMenu, setLanguageMenu] = React.useState<null | HTMLElement>(null);
  const [userMenu, setUserMenu] = React.useState<null | HTMLElement>(null);

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenu(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenu(null);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenu(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenu(null);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    handleLanguageMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.mode === 'dark'
          ? '#0f172a' // Solid dark blue for dark mode
          : '#ffffff', // Solid white for light mode
        backdropFilter: 'blur(10px)',
        zIndex: 1100, // Higher than sidebar
        boxShadow: theme.palette.mode === 'dark'
          ? '0 4px 20px rgba(0,0,0,0.3)'
          : '0 4px 20px rgba(0,0,0,0.08)',
        borderBottom: `1px solid ${alpha(
          theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
          0.05
        )}`,
        color: theme.palette.mode === 'dark'
          ? theme.palette.common.white
          : theme.palette.common.black, // Ensuring text is visible
      }}
    >
      <Toolbar sx={{ padding: theme => theme.spacing(1, 2) }}>
        <ActionIconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </ActionIconButton>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            display: { xs: 'none', sm: 'block' },
            fontWeight: 800,
            letterSpacing: '-0.5px',
            color: theme.palette.primary.main, // Direct color setting instead of gradient
          }}
        >
          InfraStructure Platform
        </Typography>

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder={t('actions.search')}
            inputProps={{ 'aria-label': 'search' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Search>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip
            title={mode === 'dark' ? t('tooltip.lightMode') : t('tooltip.darkMode')}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
          >
            <ActionIconButton
              color="inherit"
              onClick={toggleMode}
              aria-label={mode === 'dark' ? 'switch to light mode' : 'switch to dark mode'}
            >
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </ActionIconButton>
          </Tooltip>

          <Tooltip
            title={t('tooltip.changeLanguage')}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
          >
            <ActionIconButton
              color="inherit"
              onClick={handleLanguageMenuOpen}
              aria-label="change language"
              aria-controls="language-menu"
              aria-haspopup="true"
            >
              <Translate />
            </ActionIconButton>
          </Tooltip>

          <Menu
            id="language-menu"
            anchorEl={languageMenu}
            keepMounted
            open={Boolean(languageMenu)}
            onClose={handleLanguageMenuClose}
            PaperProps={{
              sx: {
                borderRadius: '16px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                mt: 1.5,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                minWidth: '150px',
                '& .MuiMenuItem-root': {
                  borderRadius: '8px',
                  mx: 1,
                  my: 0.5,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  }
                }
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => changeLanguage('en')}>
              {t('language.en')}
            </MenuItem>
            <MenuItem onClick={() => changeLanguage('hu')}>
              {t('language.hu')}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;