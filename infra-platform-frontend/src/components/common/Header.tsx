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
  DesktopWindowsRounded,
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
      case 'windows31':
        return <DesktopWindowsRounded />;
      default:
        return <PaletteRounded />;
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="default"
      sx={{
        backdropFilter: 'blur(20px)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
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
                  color: theme.palette.primary.contrastText,
                  bgcolor: theme.palette.primary.main,
                  mr: 1.5,
                }}
              >
                <DiamondRounded />
              </Avatar>
            </motion.div>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              InfraSphere
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Notifications Button */}
          <Tooltip
            title={t('tooltip.notifications')}
            arrow
          >
            <IconButton
              color="inherit"
              onClick={handleNotificationMenuOpen}
              aria-label="show notifications"
              aria-controls="notifications-menu"
              aria-haspopup="true"
              size="large"
            >
              <Badge
                badgeContent={activeAlerts.length}
                color="error"
              >
                <NotificationsRounded />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Theme Selection Button */}
          <Tooltip
            title={t('tooltip.changeTheme')}
            arrow
          >
            <IconButton
              color="inherit"
              onClick={handleThemeMenuOpen}
              aria-label="change theme"
              aria-controls="theme-menu"
              aria-haspopup="true"
              size="large"
            >
              {getThemeIcon()}
            </IconButton>
          </Tooltip>

          <Tooltip
            title={t('tooltip.changeLanguage')}
            arrow
          >
            <IconButton
              color="inherit"
              onClick={handleLanguageMenuOpen}
              aria-label="change language"
              aria-controls="language-menu"
              aria-haspopup="true"
              size="large"
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
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem
            onClick={() => changeTheme('light')}
            selected={themeVariant === 'light'}
          >
            <ListItemIcon>
              <LightModeRounded />
            </ListItemIcon>
            <ListItemText primary={t('theme.light')} />
          </MenuItem>
          <MenuItem
            onClick={() => changeTheme('dark')}
            selected={themeVariant === 'dark'}
          >
            <ListItemIcon>
              <DarkModeRounded />
            </ListItemIcon>
            <ListItemText primary={t('theme.dark')} />
          </MenuItem>
          <MenuItem
            onClick={() => changeTheme('paper')}
            selected={themeVariant === 'paper'}
          >
            <ListItemIcon>
              <ColorLensRounded />
            </ListItemIcon>
            <ListItemText primary={t('theme.paper')} />
          </MenuItem>
          <MenuItem
            onClick={() => changeTheme('windows31')}
            selected={themeVariant === 'windows31'}
          >
            <ListItemIcon>
              <DesktopWindowsRounded />
            </ListItemIcon>
            <ListItemText primary={t('theme.windows31')} />
          </MenuItem>
        </Menu>

        {/* Language Menu */}
        <Menu
          id="language-menu"
          anchorEl={languageMenu}
          keepMounted
          open={Boolean(languageMenu)}
          onClose={handleLanguageMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem
            onClick={() => changeLanguage('en')}
            selected={i18n.language === 'en'}
          >
            <ListItemIcon>
              <ReactCountryFlag countryCode="US" svg />
            </ListItemIcon>
            <ListItemText primary={t('language.en')} />
          </MenuItem>
          <MenuItem
            onClick={() => changeLanguage('hu')}
            selected={i18n.language === 'hu'}
          >
            <ListItemIcon>
              <ReactCountryFlag countryCode="HU" svg />
            </ListItemIcon>
            <ListItemText primary={t('language.hu')} />
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
        >
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t('notifications.title')}
            </Typography>
            <Chip
              label={activeAlerts.length}
              size="small"
              color="error"
            />
          </Box>

          {loadingAlerts ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                {t('status.loading')}
              </Typography>
            </Box>
          ) : activeAlerts.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <CheckCircleOutlineRounded sx={{
                fontSize: 40,
                color: theme.palette.success.main,
                mb: 1,
              }} />
              <Typography variant="body2" color="textSecondary">
                {t('sensors:noActiveAlerts')}
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {activeAlerts.map((alert, index) => (
                <React.Fragment key={alert.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: alpha(getAlertColor(alert.level), 0.1),
                          color: getAlertColor(alert.level),
                        }}
                      >
                        {getAlertIcon(alert.level)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {alert.status === AlertStatus.NEW ? 'New Alert' : 'Ongoing Alert'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
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
                            }}
                          >
                            {alert.message}
                          </Typography>
                          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Chip
                              label={`Value: ${alert.value}`}
                              size="small"
                              sx={{
                                bgcolor: alpha(getAlertColor(alert.level), 0.1),
                                color: getAlertColor(alert.level),
                              }}
                            />
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={(e) => handleResolveAlert(alert.id, e)}
                            >
                              {t('sensors:resolveAlert')}
                            </Button>
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                  {index < activeAlerts.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}

          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
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