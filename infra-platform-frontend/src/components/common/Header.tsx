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
  Divider, // Hozzáadva a hiányzó Divider import
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
  backgroundColor: alpha(theme.palette.common.white, 0.08),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
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
  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  '&:focus-within': {
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
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
  color: alpha(theme.palette.common.white, 0.7),
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
  backgroundColor: alpha(theme.palette.common.white, 0.07),
  borderRadius: '14px',
  padding: '10px',
  margin: '0 6px',
  transition: theme.transitions.create(['background-color', 'transform', 'box-shadow']),
  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.2)}`,
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
        backgroundColor: 'transparent',
        backdropFilter: 'blur(12px)',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(90deg, rgba(10, 25, 41, 0.85) 0%, rgba(19, 47, 76, 0.85) 100%)'
          : 'linear-gradient(90deg, rgba(240, 244, 248, 0.85) 0%, rgba(215, 227, 252, 0.85) 100%)',
        zIndex: 1100, // Higher than sidebar
        boxShadow: theme.palette.mode === 'dark'
          ? '0 4px 20px rgba(0,0,0,0.3)'
          : '0 4px 20px rgba(0,0,0,0.08)',
        borderBottom: `1px solid ${alpha(
          theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
          0.05
        )}`,
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
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(90deg, #3f8cff, #83b9ff)'
              : 'linear-gradient(90deg, #2962ff, #5686ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {t('appName')}
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

          <Tooltip
            title={t('tooltip.notifications')}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
          >
            <ActionIconButton color="inherit" aria-label="notifications">
              <Badge
                badgeContent={3}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.6rem',
                    height: '18px',
                    minWidth: '18px',
                    borderRadius: '9px',
                    boxShadow: '0 0 0 2px #fff',
                  }
                }}
              >
                <Notifications />
              </Badge>
            </ActionIconButton>
          </Tooltip>

          <Box
            onClick={handleUserMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              ml: 2,
              cursor: 'pointer',
              background: alpha(theme.palette.common.white, 0.07),
              py: 0.5,
              px: 1,
              borderRadius: '14px',
              border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
              transition: theme.transitions.create(['background-color', 'transform', 'box-shadow']),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.15),
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.2)}`,
              }
            }}
          >
            <Avatar
              sx={{
                bgcolor: theme.palette.secondary.main,
                width: 36,
                height: 36,
                boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
              }}
            >
              U
            </Avatar>
            <Box sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                User Name
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7, lineHeight: 1 }}>
                Administrator
              </Typography>
            </Box>
            <KeyboardArrowDown sx={{ ml: 1, opacity: 0.7, fontSize: '1rem' }} />
          </Box>

          <Menu
            id="user-menu"
            anchorEl={userMenu}
            keepMounted
            open={Boolean(userMenu)}
            onClose={handleUserMenuClose}
            PaperProps={{
              sx: {
                borderRadius: '16px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                mt: 1.5,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                minWidth: '200px',
                '& .MuiMenuItem-root': {
                  borderRadius: '8px',
                  mx: 1,
                  my: 0.5,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  }
                }
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleUserMenuClose}>
              {t('userMenu.profile')}
            </MenuItem>
            <MenuItem onClick={handleUserMenuClose}>
              {t('userMenu.settings')}
            </MenuItem>
            <Divider sx={{ my: 1, mx: 1 }} />
            <MenuItem onClick={handleUserMenuClose}>
              {t('userMenu.logout')}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;