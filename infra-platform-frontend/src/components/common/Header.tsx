import React, { useState, useRef } from 'react';
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
  Button,
  Stack,
  ListItemIcon,
  ListItemText,
  Chip,
  Popover,
  ButtonBase,
  useMediaQuery,
} from '@mui/material';
import {
  MenuRounded,
  SearchRounded,
  Brightness4Rounded,
  Brightness7Rounded,
  TranslateRounded,
  NotificationsRounded,
  KeyboardArrowDownRounded,
  PersonRounded,
  SettingsRounded,
  LogoutRounded,
  DoneAllRounded,
  WarningAmberRounded,
  LightbulbRounded,
  DiamondRounded,
  HelpRounded,
  CampaignRounded,
  CloseRounded,
  AppsRounded,
  ArrowForwardRounded,
  AssessmentRounded,
  TuneRounded,
  GridViewRounded,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useThemeContext } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '20px',
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.common.white, 0.08)
    : alpha(theme.palette.common.black, 0.04),
  width: '100%',
  maxWidth: '400px',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
  transition: theme.transitions.create(['background-color', 'box-shadow', 'width'], {
    duration: theme.transitions.duration.shorter,
  }),
  border: `1px solid ${theme.palette.mode === 'dark'
    ? alpha(theme.palette.common.white, 0.1)
    : alpha(theme.palette.common.black, 0.05)}`,
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.12)
      : alpha(theme.palette.common.black, 0.06),
  },
  '&:focus-within': {
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.14)
      : alpha(theme.palette.common.black, 0.07),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '360px',
    },
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
    ? alpha(theme.palette.common.white, 0.6)
    : alpha(theme.palette.common.black, 0.5),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const ActionIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.common.white, 0.06)
    : alpha(theme.palette.common.black, 0.03),
  borderRadius: '14px',
  padding: '10px',
  margin: '0 4px',
  transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], {
    duration: theme.transitions.duration.shorter,
  }),
  border: `1px solid ${theme.palette.mode === 'dark'
    ? alpha(theme.palette.common.white, 0.08)
    : alpha(theme.palette.common.black, 0.04)}`,
  color: theme.palette.mode === 'dark'
    ? theme.palette.common.white
    : theme.palette.common.black,
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.12)
      : alpha(theme.palette.common.black, 0.06),
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`
      : `0 4px 12px ${alpha(theme.palette.common.black, 0.06)}`,
  },
}));

const NotificationItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: 16,
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.6)
    : alpha(theme.palette.background.paper, 0.7),
  transition: theme.transitions.create(['background-color', 'transform']),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.primary.main, 0.05),
    transform: 'translateY(-2px)',
  },
  backdropFilter: 'blur(8px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
  boxShadow: `0 4px 15px ${alpha(theme.palette.common.black, 0.05)}`,
}));

const AppButton = styled(ButtonBase)(({ theme }) => ({
  flexDirection: 'column',
  padding: theme.spacing(2),
  borderRadius: 16,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.4)
    : alpha(theme.palette.background.paper, 0.7),
  backdropFilter: 'blur(8px)',
  transition: theme.transitions.create(['background-color', 'transform', 'box-shadow']),
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.primary.main, 0.05),
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 20px ${alpha(theme.palette.common.black, 0.1)}`,
  },
  border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
}));

const notifications = [
  {
    id: 1,
    title: 'System Upgrade',
    message: 'A new version (2.5.1) is available for installation',
    time: '10 min ago',
    type: 'update',
    icon: <TuneRounded />,
    color: 'primary',
    read: false
  },
  {
    id: 2,
    title: 'Server Alert',
    message: 'CPU usage exceeding 90% on prod-server-03',
    time: '45 min ago',
    type: 'warning',
    icon: <WarningAmberRounded />,
    color: 'warning',
    read: false
  },
  {
    id: 3,
    title: 'Backup Completed',
    message: 'Daily backup completed successfully',
    time: '2 hours ago',
    type: 'success',
    icon: <DoneAllRounded />,
    color: 'success',
    read: true
  },
  {
    id: 4,
    title: 'New Device Connected',
    message: 'Server rack-04-b is now online and operational',
    time: '1 day ago',
    type: 'info',
    icon: <LightbulbRounded />,
    color: 'info',
    read: true
  }
];

const apps = [
  {
    id: 'monitoring',
    title: 'Monitoring',
    icon: <AssessmentRounded sx={{ fontSize: 28 }} />,
    color: 'primary',
    description: 'System metrics dashboard',
  },
  {
    id: 'config',
    title: 'Config Manager',
    icon: <TuneRounded sx={{ fontSize: 28 }} />,
    color: 'secondary',
    description: 'Device configuration tool',
  },
  {
    id: 'topology',
    title: 'Network Topology',
    icon: <GridViewRounded sx={{ fontSize: 28 }} />,
    color: 'error',
    description: 'Visual network mapper',
    badge: 'New'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: <AssessmentRounded sx={{ fontSize: 28 }} />,
    color: 'info',
    description: 'Performance insights',
    badge: 'Beta'
  },
  {
    id: 'admin',
    title: 'Admin Portal',
    icon: <PersonRounded sx={{ fontSize: 28 }} />,
    color: 'warning',
    description: 'User & roles management',
  },
  {
    id: 'help',
    title: 'Help Center',
    icon: <HelpRounded sx={{ fontSize: 28 }} />,
    color: 'success',
    description: 'Knowledge base & support',
  },
];

const Header = () => {
  const { toggleSidebar, searchQuery, setSearchQuery } = useAppContext();
  const { mode, toggleMode } = useThemeContext();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [languageMenu, setLanguageMenu] = useState<null | HTMLElement>(null);
  const [userMenu, setUserMenu] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);
  const [appsAnchor, setAppsAnchor] = useState<null | HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchFocused, setSearchFocused] = useState(false);

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

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleAppsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAppsAnchor(event.currentTarget);
  };

  const handleAppsClose = () => {
    setAppsAnchor(null);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    handleLanguageMenuClose();
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.mode === 'dark'
          ? alpha('#0f172a', 0.8)
          : alpha('#ffffff', 0.8),
        backdropFilter: 'blur(20px)',
        zIndex: 1100,
        boxShadow: theme.palette.mode === 'dark'
          ? '0 4px 20px rgba(0,0,0,0.2)'
          : '0 4px 20px rgba(0,0,0,0.05)',
        borderBottom: `1px solid ${alpha(
          theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
          0.05
        )}`,
        color: theme.palette.mode === 'dark'
          ? theme.palette.common.white
          : theme.palette.common.black,
        height: 64,
      }}
    >
      <Toolbar sx={{
        padding: theme => theme.spacing(0, 2),
        minHeight: '64px !important',
        justifyContent: 'space-between',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ActionIconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleSidebar}
            sx={{ mr: { xs: 1, sm: 2 } }}
          >
            <MenuRounded />
          </ActionIconButton>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              mr: 4,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Avatar
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  width: 32,
                  height: 32,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  mr: 1.5,
                }}
              >
                <DiamondRounded sx={{ fontSize: 16, color: '#fff' }} />
              </Avatar>
            </motion.div>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.5px',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              InfraSphere
            </Typography>
          </Box>

          {!isSmallScreen && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, width: 300 }}
                animate={{ opacity: 1, width: searchFocused ? 360 : 300 }}
                exit={{ opacity: 0, width: 300 }}
                transition={{ duration: 0.3 }}
              >
                <Search>
                  <SearchIconWrapper>
                    <SearchRounded />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder={t('actions.search')}
                    inputProps={{
                      'aria-label': 'search',
                      ref: searchRef,
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                </Search>
              </motion.div>
            </AnimatePresence>
          )}
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          {isSmallScreen && (
            <ActionIconButton
              color="inherit"
              aria-label="search"
              edge="end"
              onClick={() => searchRef.current?.focus()}
            >
              <SearchRounded />
            </ActionIconButton>
          )}

          <Tooltip
            title={t('tooltip.apps')}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
          >
            <ActionIconButton
              color="inherit"
              onClick={handleAppsOpen}
              aria-label="app switcher"
            >
              <AppsRounded />
            </ActionIconButton>
          </Tooltip>

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
              {mode === 'dark' ? <Brightness7Rounded /> : <Brightness4Rounded />}
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
              <TranslateRounded />
            </ActionIconButton>
          </Tooltip>

          <Tooltip
            title={t('tooltip.notifications')}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
          >
            <ActionIconButton
              color="inherit"
              onClick={handleNotificationsOpen}
              aria-label="notifications"
            >
              <Badge
                badgeContent={unreadNotifications}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: theme.palette.error.main,
                    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                  }
                }}
              >
                <NotificationsRounded />
              </Badge>
            </ActionIconButton>
          </Tooltip>

          <Box
            sx={{
              display: { xs: 'none', sm: 'block' },
              ml: 1
            }}
          >
            <Button
              onClick={handleUserMenuOpen}
              sx={{
                borderRadius: '14px',
                px: 1.5,
                py: 1,
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.text.primary,
                textTransform: 'none',
                transition: 'all 0.2s ease',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                  transform: 'translateY(-2px)',
                }
              }}
              endIcon={<KeyboardArrowDownRounded />}
            >
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  backgroundColor: theme.palette.primary.main,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  mr: 1,
                }}
              >
                A
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    lineHeight: 1
                  }}>
                  Admin
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: alpha(theme.palette.text.primary, 0.6),
                    fontSize: '0.7rem'
                  }}>
                  Infrastructure Lead
                </Typography>
              </Box>
            </Button>
          </Box>

          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <IconButton
              onClick={handleUserMenuOpen}
              sx={{
                padding: 0.5,
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: theme.palette.primary.main,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                A
              </Avatar>
            </IconButton>
          </Box>
        </Stack>

        {/* Language Menu */}
        <Menu
          id="language-menu"
          anchorEl={languageMenu}
          keepMounted
          open={Boolean(languageMenu)}
          onClose={handleLanguageMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              borderRadius: '16px',
              minWidth: '180px',
              overflow: 'visible',
              filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.08))',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              '& .MuiMenuItem-root': {
                borderRadius: '12px',
                mx: 1,
                my: 0.5,
                px: 2,
                py: 1.5,
                fontSize: '0.9rem',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`,
                }
              },
              backdropFilter: 'blur(8px)',
              backgroundColor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.8)
                : alpha(theme.palette.background.paper, 0.8),
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 20,
                width: 12,
                height: 12,
                transform: 'translateY(-50%) rotate(45deg)',
                backgroundColor: theme.palette.background.paper,
                borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                zIndex: 0,
              },
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem
            onClick={() => changeLanguage('en')}
            selected={i18n.language === 'en'}
          >
            <ListItemIcon sx={{ minWidth: '36px' }}>
              <Box
                component="img"
                src="/icons/flag-us.svg"
                alt="English"
                sx={{ width: 20, height: 20, borderRadius: '4px' }}
              />
            </ListItemIcon>
            <ListItemText
              primary={t('language.en')}
              primaryTypographyProps={{
                fontWeight: i18n.language === 'en' ? 600 : 400
              }}
            />
          </MenuItem>
          <MenuItem
            onClick={() => changeLanguage('hu')}
            selected={i18n.language === 'hu'}
          >
            <ListItemIcon sx={{ minWidth: '36px' }}>
              <Box
                component="img"
                src="/icons/flag-hu.svg"
                alt="Hungarian"
                sx={{ width: 20, height: 20, borderRadius: '4px' }}
              />
            </ListItemIcon>
            <ListItemText
              primary={t('language.hu')}
              primaryTypographyProps={{
                fontWeight: i18n.language === 'hu' ? 600 : 400
              }}
            />
          </MenuItem>
        </Menu>

        {/* User Menu */}
        <Menu
          id="user-menu"
          anchorEl={userMenu}
          keepMounted
          open={Boolean(userMenu)}
          onClose={handleUserMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              borderRadius: '16px',
              minWidth: '220px',
              overflow: 'visible',
              filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.08))',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backdropFilter: 'blur(8px)',
              backgroundColor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.8)
                : alpha(theme.palette.background.paper, 0.8),
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 20,
                width: 12,
                height: 12,
                transform: 'translateY(-50%) rotate(45deg)',
                backgroundColor: theme.palette.background.paper,
                borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                zIndex: 0,
              },
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Administrator
            </Typography>
            <Typography variant="caption" color="text.secondary">
              admin@infrasphere.tech
            </Typography>
            <Chip
              label="Premium"
              size="small"
              icon={<DiamondRounded sx={{ fontSize: '12px !important' }} />}
              sx={{
                mt: 1,
                borderRadius: '6px',
                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                color: theme.palette.secondary.main,
                fontWeight: 600,
                fontSize: '0.7rem',
                height: '22px',
                '& .MuiChip-icon': {
                  color: theme.palette.secondary.main,
                  ml: 0.5,
                }
              }}
            />
          </Box>

          <Divider sx={{ my: 1, opacity: 0.1 }} />

          <MenuItem onClick={handleUserMenuClose} sx={{
            borderRadius: '12px',
            mx: 1,
            my: 0.5,
            px: 2,
            py: 1.5,
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              transform: 'translateY(-2px)',
              boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`,
            }
          }}>
            <ListItemIcon sx={{ minWidth: '36px', color: theme.palette.primary.main }}>
              <PersonRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t('user.profile')} />
          </MenuItem>

          <MenuItem onClick={handleUserMenuClose} sx={{
            borderRadius: '12px',
            mx: 1,
            my: 0.5,
            px: 2,
            py: 1.5,
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              transform: 'translateY(-2px)',
              boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`,
            }
          }}>
            <ListItemIcon sx={{ minWidth: '36px', color: theme.palette.info.main }}>
              <SettingsRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t('user.settings')} />
          </MenuItem>

          <Divider sx={{ my: 1, opacity: 0.1 }} />

          <MenuItem onClick={handleUserMenuClose} sx={{
            borderRadius: '12px',
            mx: 1,
            my: 0.5,
            mb: 1,
            px: 2,
            py: 1.5,
            color: theme.palette.error.main,
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: alpha(theme.palette.error.main, 0.08),
              transform: 'translateY(-2px)',
              boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`,
            }
          }}>
            <ListItemIcon sx={{ minWidth: '36px', color: theme.palette.error.main }}>
              <LogoutRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t('user.logout')} />
          </MenuItem>
        </Menu>

        {/* Notifications Panel */}
        <Popover
          id="notifications-menu"
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleNotificationsClose}
          PaperProps={{
            sx: {
              width: { xs: 320, sm: 380 },
              borderRadius: '20px',
              mt: 1.5,
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              backdropFilter: 'blur(8px)',
              backgroundColor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.9)
                : alpha(theme.palette.background.paper, 0.9),
              overflow: 'hidden',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 20,
                width: 12,
                height: 12,
                transform: 'translateY(-50%) rotate(45deg)',
                backgroundColor: theme.palette.background.paper,
                borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                zIndex: 0,
              },
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 3 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {t('notifications.title')}
              </Typography>
              <IconButton
                size="small"
                onClick={handleNotificationsClose}
                sx={{
                  backgroundColor: alpha(theme.palette.text.primary, 0.05),
                  borderRadius: '10px',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.text.primary, 0.1),
                  }
                }}
              >
                <CloseRounded fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ mt: 1, mb: 2 }}>
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <NotificationItem
                    sx={{
                      opacity: notification.read ? 0.7 : 1,
                      border: notification.read ? 'none' : `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: alpha(theme.palette[notification.color as 'primary' | 'warning' | 'success' | 'info'].main, 0.1),
                          color: theme.palette[notification.color as 'primary' | 'warning' | 'success' | 'info'].main,
                          mr: 2,
                        }}
                      >
                        {notification.icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {notification.title}
                          </Typography>
                          {!notification.read && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: theme.palette.primary.main,
                                ml: 1,
                              }}
                            />
                          )}
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: alpha(theme.palette.text.primary, 0.7),
                            mb: 0.5,
                            fontSize: '0.85rem',
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: alpha(theme.palette.text.primary, 0.5),
                            fontSize: '0.75rem',
                          }}
                        >
                          {notification.time}
                        </Typography>
                      </Box>
                    </Box>
                  </NotificationItem>
                </motion.div>
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                endIcon={<ArrowForwardRounded />}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                {t('notifications.viewAll')}
              </Button>
            </Box>
          </Box>
        </Popover>

        {/* Apps Panel */}
        <Popover
          id="apps-menu"
          anchorEl={appsAnchor}
          open={Boolean(appsAnchor)}
          onClose={handleAppsClose}
          PaperProps={{
            sx: {
              width: { xs: 320, sm: 600 },
              borderRadius: '20px',
              mt: 1.5,
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              backdropFilter: 'blur(8px)',
              backgroundColor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.9)
                : alpha(theme.palette.background.paper, 0.9),
              overflow: 'hidden',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 20,
                width: 12,
                height: 12,
                transform: 'translateY(-50%) rotate(45deg)',
                backgroundColor: theme.palette.background.paper,
                borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                zIndex: 0,
              },
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 3 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {t('apps.title')}
              </Typography>
              <IconButton
                size="small"
                onClick={handleAppsClose}
                sx={{
                  backgroundColor: alpha(theme.palette.text.primary, 0.05),
                  borderRadius: '10px',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.text.primary, 0.1),
                  }
                }}
              >
                <CloseRounded fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 2
            }}>
              {apps.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <AppButton sx={{ width: '100%' }}>
                    <Box sx={{ position: 'relative', mb: 1 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: alpha(theme.palette[app.color as 'primary' | 'secondary' | 'error' | 'info' | 'warning' | 'success'].main, 0.1),
                          color: theme.palette[app.color as 'primary' | 'secondary' | 'error' | 'info' | 'warning' | 'success'].main,
                        }}
                      >
                        {app.icon}
                      </Avatar>
                      {app.badge && (
                        <Chip
                          label={app.badge}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: -5,
                            right: -15,
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            borderRadius: '6px',
                            backgroundColor: theme.palette.error.main,
                            color: '#fff',
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {app.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: alpha(theme.palette.text.primary, 0.6),
                        fontSize: '0.75rem',
                        textAlign: 'center',
                      }}
                    >
                      {app.description}
                    </Typography>
                  </AppButton>
                </motion.div>
              ))}
            </Box>
          </Box>
        </Popover>
      </Toolbar>
    </AppBar>
  );
};

export default Header;