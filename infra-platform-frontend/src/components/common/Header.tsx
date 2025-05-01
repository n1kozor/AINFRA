// src/components/layout/Header.tsx
import React, { useState } from 'react';
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
  ListItemIcon,
  ListItemText,
  Tooltip,
  Fade,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemAvatar,
  Divider,
  Button,
  Chip,
} from '@mui/material';
import {
  MenuRounded,
  Brightness4Rounded,
  Brightness7Rounded,
  TranslateRounded,
  DiamondRounded,
  NotificationsRounded,
  ErrorOutlineRounded,
  WarningAmberRounded,
  InfoOutlined,
  CheckCircleOutlineRounded,
  NotificationsActiveRounded,
  PaletteRounded,
  DarkModeRounded,
  LightModeRounded,
  ColorLensRounded,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useThemeContext } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import ReactCountryFlag from 'react-country-flag';
import { AlertStatus, AlertLevel } from '../../types/sensor';
import { formatTimeSince } from '../../utils/sensorUtils';
import { ThemeVariant } from '../../theme';

const Header = () => {
  const { toggleSidebar, activeAlerts, loadingAlerts, resolveAlert, refreshAlerts } = useAppContext();
  const { themeVariant, setThemeVariant } = useThemeContext();
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  // State for menus
  const [languageMenu, setLanguageMenu] = useState(null);
  const [notificationMenu, setNotificationMenu] = useState(null);
  const [themeMenu, setThemeMenu] = useState(null);

  // Handle resolving an alert
  const handleResolveAlert = async (alertId, event) => {
    event.stopPropagation();
    await resolveAlert(alertId);
  };

  // Language menu handlers
  const handleLanguageMenuOpen = (event) => {
    setLanguageMenu(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenu(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleLanguageMenuClose();
  };

  // Theme menu handlers
  const handleThemeMenuOpen = (event) => {
    setThemeMenu(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setThemeMenu(null);
  };

  const changeTheme = (variant: ThemeVariant) => {
    setThemeVariant(variant);
    handleThemeMenuClose();
  };

  // Notification menu handlers
  const handleNotificationMenuOpen = (event) => {
    setNotificationMenu(event.currentTarget);
    refreshAlerts(); // Refresh alerts when opening the menu
  };

  const handleNotificationMenuClose = () => {
    setNotificationMenu(null);
  };

  // Get alert icon based on level
  const getAlertIcon = (level) => {
    switch (level) {
      case AlertLevel.CRITICAL:
        return <ErrorOutlineRounded sx={{ color: theme.palette.error.main }} />;
      case AlertLevel.WARNING:
        return <WarningAmberRounded sx={{ color: theme.palette.warning.main }} />;
      case AlertLevel.INFO:
      default:
        return <InfoOutlined sx={{ color: theme.palette.info.main }} />;
    }
  };

  // Get alert color based on level
  const getAlertColor = (level) => {
    switch (level) {
      case AlertLevel.CRITICAL:
        return theme.palette.error.main;
      case AlertLevel.WARNING:
        return theme.palette.warning.main;
      case AlertLevel.INFO:
      default:
        return theme.palette.info.main;
    }
  };

  // Get theme icon based on theme variant
  const getThemeIcon = () => {
    switch (themeVariant) {
      case 'dark':
        return <DarkModeRounded />;
      case 'light':
        return <LightModeRounded />;
      case 'paper':
        return <ColorLensRounded />;
      default:
        return <PaletteRounded />;
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor:
          themeVariant === 'dark'
            ? alpha('#0f172a', 0.8)
            : themeVariant === 'paper'
              ? alpha('#FFFBF0', 0.9)
              : alpha('#ffffff', 0.8),
        backdropFilter: 'blur(20px)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow:
          themeVariant === 'dark'
            ? '0 4px 20px rgba(0,0,0,0.2)'
            : themeVariant === 'paper'
              ? 'none'
              : '0 4px 20px rgba(0,0,0,0.05)',
        borderBottom:
          themeVariant === 'paper'
            ? '2px dashed #D6CBAE'
            : `1px solid ${alpha(
                theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
                0.05
              )}`,
        color: theme.palette.text.primary,
        height: 64,
        width: '100%',
        transform: themeVariant === 'paper' ? 'rotate(-0.5deg)' : 'none',
      }}
    >
      <Toolbar sx={{
        padding: theme => theme.spacing(0, 2),
        minHeight: '64px !important',
        justifyContent: 'space-between',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleSidebar}
            sx={{
              mr: { xs: 1, sm: 2 },
              backgroundColor:
                themeVariant === 'dark'
                  ? alpha(theme.palette.common.white, 0.06)
                  : themeVariant === 'paper'
                    ? alpha('#D6CBAE', 0.15)
                    : alpha(theme.palette.common.black, 0.03),
              borderRadius: themeVariant === 'paper' ? '12px' : '14px',
              padding: '10px',
              transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], {
                duration: theme.transitions.duration.shorter,
              }),
              border:
                themeVariant === 'paper'
                  ? '2px dashed #D6CBAE'
                  : `1px solid ${theme.palette.mode === 'dark'
                    ? alpha(theme.palette.common.white, 0.08)
                    : alpha(theme.palette.common.black, 0.04)}`,
              '&:hover': {
                backgroundColor:
                  themeVariant === 'dark'
                    ? alpha(theme.palette.common.white, 0.12)
                    : themeVariant === 'paper'
                      ? alpha('#D6CBAE', 0.25)
                      : alpha(theme.palette.common.black, 0.06),
                transform: themeVariant === 'paper'
                  ? 'translateY(-2px) rotate(0.5deg)'
                  : 'translateY(-2px)',
                boxShadow:
                  themeVariant === 'paper'
                    ? '0 4px 0 -2px rgba(0,0,0,0.1)'
                    : theme.palette.mode === 'dark'
                      ? `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`
                      : `0 4px 12px ${alpha(theme.palette.common.black, 0.06)}`,
              },
              transform: themeVariant === 'paper' ? 'rotate(-0.5deg)' : 'none',
            }}
          >
            <MenuRounded />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Avatar
                sx={{
                  background:
                    themeVariant === 'paper'
                      ? '#FF6B6B'
                      : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  width: 32,
                  height: 32,
                  boxShadow:
                    themeVariant === 'paper'
                      ? '0 4px 0 -2px rgba(0,0,0,0.15)'
                      : `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  mr: 1.5,
                  border: themeVariant === 'paper' ? '2px solid #D6CBAE' : 'none',
                  transform: themeVariant === 'paper' ? 'rotate(-2deg)' : 'none',
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
                ...(themeVariant === 'paper'
                  ? {
                      color: '#FF6B6B',
                      fontFamily: '"Patrick Hand", "Just Me Again Down Here", cursive',
                    }
                  : {
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }),
              }}
            >
              InfraSphere
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Notifications Button */}
          <Tooltip
            title={t('tooltip.notifications')}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
          >
            <IconButton
              color="inherit"
              onClick={handleNotificationMenuOpen}
              aria-label="show notifications"
              aria-controls="notifications-menu"
              aria-haspopup="true"
              sx={{
                position: 'relative',
                mr: 1,
                backgroundColor:
                  themeVariant === 'dark'
                    ? alpha(theme.palette.common.white, 0.06)
                    : themeVariant === 'paper'
                      ? alpha('#D6CBAE', 0.15)
                      : alpha(theme.palette.common.black, 0.03),
                borderRadius: themeVariant === 'paper' ? '12px' : '14px',
                padding: '10px',
                transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], {
                  duration: theme.transitions.duration.shorter,
                }),
                border:
                  themeVariant === 'paper'
                    ? '2px dashed #D6CBAE'
                    : `1px solid ${theme.palette.mode === 'dark'
                      ? alpha(theme.palette.common.white, 0.08)
                      : alpha(theme.palette.common.black, 0.04)}`,
                '&:hover': {
                  backgroundColor:
                    themeVariant === 'dark'
                      ? alpha(theme.palette.common.white, 0.12)
                      : themeVariant === 'paper'
                        ? alpha('#D6CBAE', 0.25)
                        : alpha(theme.palette.common.black, 0.06),
                  transform: themeVariant === 'paper'
                    ? 'translateY(-2px) rotate(0.5deg)'
                    : 'translateY(-2px)',
                  boxShadow:
                    themeVariant === 'paper'
                      ? '0 4px 0 -2px rgba(0,0,0,0.1)'
                      : theme.palette.mode === 'dark'
                        ? `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`
                        : `0 4px 12px ${alpha(theme.palette.common.black, 0.06)}`,
                },
                transform: themeVariant === 'paper' ? 'rotate(-0.5deg)' : 'none',
              }}
            >
              <Badge
                badgeContent={activeAlerts.length}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    animation: activeAlerts.length > 0 ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': {
                        boxShadow: `0 0 0 0 ${alpha(theme.palette.error.main, 0.7)}`
                      },
                      '70%': {
                        boxShadow: `0 0 0 5px ${alpha(theme.palette.error.main, 0)}`
                      },
                      '100%': {
                        boxShadow: `0 0 0 0 ${alpha(theme.palette.error.main, 0)}`
                      }
                    }
                  }
                }}
              >
                <NotificationsRounded />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Theme Selection Button */}
          <Tooltip
            title={t('tooltip.changeTheme')}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
          >
            <IconButton
              color="inherit"
              onClick={handleThemeMenuOpen}
              aria-label="change theme"
              aria-controls="theme-menu"
              aria-haspopup="true"
              sx={{
                mx: 1,
                backgroundColor:
                  themeVariant === 'dark'
                    ? alpha(theme.palette.common.white, 0.06)
                    : themeVariant === 'paper'
                      ? alpha('#D6CBAE', 0.15)
                      : alpha(theme.palette.common.black, 0.03),
                borderRadius: themeVariant === 'paper' ? '12px' : '14px',
                padding: '10px',
                transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], {
                  duration: theme.transitions.duration.shorter,
                }),
                border:
                  themeVariant === 'paper'
                    ? '2px dashed #D6CBAE'
                    : `1px solid ${theme.palette.mode === 'dark'
                      ? alpha(theme.palette.common.white, 0.08)
                      : alpha(theme.palette.common.black, 0.04)}`,
                '&:hover': {
                  backgroundColor:
                    themeVariant === 'dark'
                      ? alpha(theme.palette.common.white, 0.12)
                      : themeVariant === 'paper'
                        ? alpha('#D6CBAE', 0.25)
                        : alpha(theme.palette.common.black, 0.06),
                  transform: themeVariant === 'paper'
                    ? 'translateY(-2px) rotate(0.5deg)'
                    : 'translateY(-2px)',
                  boxShadow:
                    themeVariant === 'paper'
                      ? '0 4px 0 -2px rgba(0,0,0,0.1)'
                      : theme.palette.mode === 'dark'
                        ? `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`
                        : `0 4px 12px ${alpha(theme.palette.common.black, 0.06)}`,
                },
                transform: themeVariant === 'paper' ? 'rotate(-0.5deg)' : 'none',
              }}
            >
              {getThemeIcon()}
            </IconButton>
          </Tooltip>

          <Tooltip
            title={t('tooltip.changeLanguage')}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
          >
            <IconButton
              color="inherit"
              onClick={handleLanguageMenuOpen}
              aria-label="change language"
              aria-controls="language-menu"
              aria-haspopup="true"
              sx={{
                backgroundColor:
                  themeVariant === 'dark'
                    ? alpha(theme.palette.common.white, 0.06)
                    : themeVariant === 'paper'
                      ? alpha('#D6CBAE', 0.15)
                      : alpha(theme.palette.common.black, 0.03),
                borderRadius: themeVariant === 'paper' ? '12px' : '14px',
                padding: '10px',
                transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], {
                  duration: theme.transitions.duration.shorter,
                }),
                border:
                  themeVariant === 'paper'
                    ? '2px dashed #D6CBAE'
                    : `1px solid ${theme.palette.mode === 'dark'
                      ? alpha(theme.palette.common.white, 0.08)
                      : alpha(theme.palette.common.black, 0.04)}`,
                '&:hover': {
                  backgroundColor:
                    themeVariant === 'dark'
                      ? alpha(theme.palette.common.white, 0.12)
                      : themeVariant === 'paper'
                        ? alpha('#D6CBAE', 0.25)
                        : alpha(theme.palette.common.black, 0.06),
                  transform: themeVariant === 'paper'
                    ? 'translateY(-2px) rotate(0.5deg)'
                    : 'translateY(-2px)',
                  boxShadow:
                    themeVariant === 'paper'
                      ? '0 4px 0 -2px rgba(0,0,0,0.1)'
                      : theme.palette.mode === 'dark'
                        ? `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`
                        : `0 4px 12px ${alpha(theme.palette.common.black, 0.06)}`,
                },
                transform: themeVariant === 'paper' ? 'rotate(-0.5deg)' : 'none',
              }}
            >
              <TranslateRounded />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Theme Menu */}
        <Menu
          id="theme-menu"
          anchorEl={themeMenu}
          keepMounted
          open={Boolean(themeMenu)}
          onClose={handleThemeMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              borderRadius: '16px',
              minWidth: '180px',
              overflow: 'visible',
              filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.08))',
              border: themeVariant === 'paper'
                ? '2px dashed #D6CBAE'
                : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              '& .MuiMenuItem-root': {
                borderRadius: '12px',
                mx: 1,
                my: 0.5,
                px: 2,
                py: 1.5,
                fontSize: '0.9rem',
                transition: 'all 0.2s',
                fontFamily: themeVariant === 'paper' ? '"Comic Neue", "Marker Felt", "Neucha", cursive' : 'inherit',
                '&:hover': {
                  backgroundColor: themeVariant === 'paper'
                    ? alpha('#FF6B6B', 0.08)
                    : alpha(theme.palette.primary.main, 0.08),
                  transform: themeVariant === 'paper'
                    ? 'translateY(-2px) rotate(0.5deg)'
                    : 'translateY(-2px)',
                  boxShadow: themeVariant === 'paper'
                    ? '0 4px 0 -2px rgba(0,0,0,0.1)'
                    : `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`,
                }
              },
              backdropFilter: 'blur(8px)',
              backgroundColor: themeVariant === 'paper'
                ? '#FFFBF0'
                : theme.palette.mode === 'dark'
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
                backgroundColor: themeVariant === 'paper'
                  ? '#FFFBF0'
                  : theme.palette.background.paper,
                borderLeft: themeVariant === 'paper'
                  ? '2px dashed #D6CBAE'
                  : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderTop: themeVariant === 'paper'
                  ? '2px dashed #D6CBAE'
                  : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                zIndex: 0,
              },
              transform: themeVariant === 'paper' ? 'rotate(-0.5deg)' : 'none',
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem
            onClick={() => changeTheme('light')}
            selected={themeVariant === 'light'}
          >
            <ListItemIcon sx={{ minWidth: '36px' }}>
              <LightModeRounded />
            </ListItemIcon>
            <ListItemText
              primary={t('theme.light')}
              primaryTypographyProps={{
                fontWeight: themeVariant === 'light' ? 600 : 400
              }}
            />
          </MenuItem>
          <MenuItem
            onClick={() => changeTheme('dark')}
            selected={themeVariant === 'dark'}
          >
            <ListItemIcon sx={{ minWidth: '36px' }}>
              <DarkModeRounded />
            </ListItemIcon>
            <ListItemText
              primary={t('theme.dark')}
              primaryTypographyProps={{
                fontWeight: themeVariant === 'dark' ? 600 : 400
              }}
            />
          </MenuItem>
          <MenuItem
            onClick={() => changeTheme('paper')}
            selected={themeVariant === 'paper'}
          >
            <ListItemIcon sx={{ minWidth: '36px' }}>
              <ColorLensRounded />
            </ListItemIcon>
            <ListItemText
              primary={t('theme.paper')}
              primaryTypographyProps={{
                fontWeight: themeVariant === 'paper' ? 600 : 400
              }}
            />
          </MenuItem>
        </Menu>

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
              border: themeVariant === 'paper'
                ? '2px dashed #D6CBAE'
                : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              '& .MuiMenuItem-root': {
                borderRadius: '12px',
                mx: 1,
                my: 0.5,
                px: 2,
                py: 1.5,
                fontSize: '0.9rem',
                transition: 'all 0.2s',
                fontFamily: themeVariant === 'paper' ? '"Comic Neue", "Marker Felt", "Neucha", cursive' : 'inherit',
                '&:hover': {
                  backgroundColor: themeVariant === 'paper'
                    ? alpha('#FF6B6B', 0.08)
                    : alpha(theme.palette.primary.main, 0.08),
                  transform: themeVariant === 'paper'
                    ? 'translateY(-2px) rotate(0.5deg)'
                    : 'translateY(-2px)',
                  boxShadow: themeVariant === 'paper'
                    ? '0 4px 0 -2px rgba(0,0,0,0.1)'
                    : `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`,
                }
              },
              backdropFilter: 'blur(8px)',
              backgroundColor: themeVariant === 'paper'
                ? '#FFFBF0'
                : theme.palette.mode === 'dark'
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
                backgroundColor: themeVariant === 'paper'
                  ? '#FFFBF0'
                  : theme.palette.background.paper,
                borderLeft: themeVariant === 'paper'
                  ? '2px dashed #D6CBAE'
                  : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderTop: themeVariant === 'paper'
                  ? '2px dashed #D6CBAE'
                  : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                zIndex: 0,
              },
              transform: themeVariant === 'paper' ? 'rotate(-0.5deg)' : 'none',
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
              <ReactCountryFlag countryCode="US" svg style={{ width: '20px', height: '20px', borderRadius: '4px' }} />
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
              <ReactCountryFlag countryCode="HU" svg style={{ width: '20px', height: '20px', borderRadius: '4px' }} />
            </ListItemIcon>
            <ListItemText
              primary={t('language.hu')}
              primaryTypographyProps={{
                fontWeight: i18n.language === 'hu' ? 600 : 400
              }}
            />
          </MenuItem>
        </Menu>

        {/* Notifications Popover */}
        <Popover
          id="notifications-menu"
          anchorEl={notificationMenu}
          open={Boolean(notificationMenu)}
          onClose={handleNotificationMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              mt: 1.5,
              width: { xs: 320, sm: 380 },
              maxHeight: 440,
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: themeVariant === 'paper'
                ? '0 8px 0 -4px rgba(0,0,0,0.1)'
                : '0 10px 40px rgba(0,0,0,0.1)',
              border: themeVariant === 'paper'
                ? '2px dashed #D6CBAE'
                : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backdropFilter: 'blur(8px)',
              backgroundColor: themeVariant === 'paper'
                ? '#FFFBF0'
                : theme.palette.mode === 'dark'
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
                backgroundColor: themeVariant === 'paper'
                  ? '#FFFBF0'
                  : theme.palette.background.paper,
                borderLeft: themeVariant === 'paper'
                  ? '2px dashed #D6CBAE'
                  : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderTop: themeVariant === 'paper'
                  ? '2px dashed #D6CBAE'
                  : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                zIndex: 0,
              },
              transform: themeVariant === 'paper' ? 'rotate(-0.5deg)' : 'none',
            }
          }}
        >
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: themeVariant === 'paper'
                ? '2px dashed #D6CBAE'
                : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              fontFamily: themeVariant === 'paper' ? '"Patrick Hand", "Just Me Again Down Here", cursive' : 'inherit',
            }}
          >
            <Typography variant="h6" sx={{
              fontWeight: 600,
              fontFamily: themeVariant === 'paper' ? '"Patrick Hand", "Just Me Again Down Here", cursive' : 'inherit',
            }}>
              {t('notifications.title')}
            </Typography>
            <Chip
              label={activeAlerts.length}
              size="small"
              color="error"
              sx={{
                fontWeight: 600,
                minWidth: 30,
                height: 24,
                animation: activeAlerts.length > 0 ? 'pulse 2s infinite' : 'none',
                fontFamily: themeVariant === 'paper' ? '"Comic Neue", "Marker Felt", "Neucha", cursive' : 'inherit',
                ...(themeVariant === 'paper' && {
                  border: '2px dashed #FFB8B8',
                  background: alpha('#FF6B6B', 0.1),
                  color: '#E74C3C',
                }),
              }}
            />
          </Box>

          {loadingAlerts ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary" sx={{
                fontFamily: themeVariant === 'paper' ? '"Comic Neue", "Marker Felt", "Neucha", cursive' : 'inherit',
              }}>
                {t('status.loading')}
              </Typography>
            </Box>
          ) : activeAlerts.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <CheckCircleOutlineRounded sx={{
                fontSize: 40,
                color: theme.palette.success.main,
                mb: 1,
                opacity: 0.8
              }} />
              <Typography variant="body2" color="textSecondary" sx={{
                fontFamily: themeVariant === 'paper' ? '"Comic Neue", "Marker Felt", "Neucha", cursive' : 'inherit',
              }}>
                {t('sensors:noActiveAlerts')}
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 1 }}>
              {activeAlerts.map((alert, index) => (
                <React.Fragment key={alert.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      py: 1.5,
                      px: 2,
                      borderRadius: '12px',
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: themeVariant === 'paper'
                          ? alpha('#FF6B6B', 0.06)
                          : alpha(theme.palette.primary.main, 0.06),
                        transform: themeVariant === 'paper'
                          ? 'translateY(-2px) rotate(0.5deg)'
                          : 'translateY(-2px)',
                        boxShadow: themeVariant === 'paper'
                          ? '0 4px 0 -2px rgba(0,0,0,0.1)'
                          : '0 4px 12px rgba(0,0,0,0.05)',
                      },
                      mb: 0.5,
                      ...(themeVariant === 'paper' && {
                        transform: 'rotate(-0.5deg)',
                      }),
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          backgroundColor: alpha(getAlertColor(alert.level), themeVariant === 'paper' ? 0.15 : 0.1),
                          color: getAlertColor(alert.level),
                          ...(themeVariant === 'paper' && {
                            border: '2px solid #D6CBAE',
                            transform: 'rotate(-2deg)',
                          }),
                        }}
                      >
                        {getAlertIcon(alert.level)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                          <Typography variant="subtitle2" sx={{
                            fontWeight: 600,
                            pr: 2,
                            fontFamily: themeVariant === 'paper' ? '"Patrick Hand", "Just Me Again Down Here", cursive' : 'inherit',
                          }}>
                            {alert.status === AlertStatus.NEW ? 'New Alert' : 'Ongoing Alert'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary" sx={{
                            fontFamily: themeVariant === 'paper' ? '"Comic Neue", "Marker Felt", "Neucha", cursive' : 'inherit',
                          }}>
                            {formatTimeSince(alert.last_checked_at)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            color="textPrimary"
                            sx={{
                              display: 'inline',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              fontFamily: themeVariant === 'paper' ? '"Comic Neue", "Marker Felt", "Neucha", cursive' : 'inherit',
                            }}
                          >
                            {alert.message}
                          </Typography>
                          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Chip
                              label={`Value: ${alert.value}`}
                              size="small"
                              sx={{
                                height: 22,
                                fontSize: '0.75rem',
                                bgcolor: alpha(getAlertColor(alert.level), 0.1),
                                color: getAlertColor(alert.level),
                                fontWeight: 500,
                                fontFamily: themeVariant === 'paper' ? '"Comic Neue", "Marker Felt", "Neucha", cursive' : 'inherit',
                                ...(themeVariant === 'paper' && {
                                  border: '2px dashed',
                                  borderColor: alpha(getAlertColor(alert.level), 0.3),
                                }),
                              }}
                            />
                            <Button
                              size="small"
                              variant={themeVariant === 'paper' ? 'outlined' : 'contained'}
                              color="primary"
                              onClick={(e) => handleResolveAlert(alert.id, e)}
                              sx={{
                                minWidth: 0,
                                fontSize: '0.75rem',
                                px: 1.5,
                                py: 0.25,
                                fontFamily: themeVariant === 'paper' ? '"Patrick Hand", "Just Me Again Down Here", cursive' : 'inherit',
                                ...(themeVariant === 'paper' && {
                                  borderStyle: 'dashed',
                                  transform: 'rotate(-0.5deg)',
                                  '&:hover': {
                                    transform: 'rotate(0.5deg) translateY(-2px)',
                                  },
                                }),
                              }}
                            >
                              {t('sensors:resolveAlert')}
                            </Button>
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                  {index < activeAlerts.length - 1 && <Divider variant="inset" component="li" sx={{
                    opacity: 0.6,
                    ...(themeVariant === 'paper' && {
                      borderStyle: 'dashed',
                    }),
                  }} />}
                </React.Fragment>
              ))}
            </List>
          )}

          <Box
            sx={{
              p: 2,
              borderTop: themeVariant === 'paper'
                ? '2px dashed #D6CBAE'
                : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              textAlign: 'center',
              bgcolor: alpha(theme.palette.background.default, 0.5),
            }}
          >
            <Button
              size="small"
              color="primary"
              endIcon={<NotificationsActiveRounded fontSize="small" />}
              component="a"
              href="/sensors"
              onClick={handleNotificationMenuClose}
              sx={{
                borderRadius: '10px',
                fontWeight: 600,
                textTransform: 'none',
                fontFamily: themeVariant === 'paper' ? '"Patrick Hand", "Just Me Again Down Here", cursive' : 'inherit',
                ...(themeVariant === 'paper' && {
                  transform: 'rotate(-0.5deg)',
                  '&:hover': {
                    transform: 'rotate(0.5deg) translateY(-2px)',
                  },
                }),
              }}
            >
              {t('notifications.viewAll')}
            </Button>
          </Box>
        </Popover>
      </Toolbar>
    </AppBar>
  );
};

export default Header;