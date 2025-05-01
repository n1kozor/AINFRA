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
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useThemeContext } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import ReactCountryFlag from 'react-country-flag';
import { AlertStatus, AlertLevel } from '../../types/sensor';
import { formatTimeSince } from '../../utils/sensorUtils';

const Header = () => {
  const { toggleSidebar, activeAlerts, loadingAlerts, resolveAlert, refreshAlerts } = useAppContext();
  const { mode, toggleMode } = useThemeContext();
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  // State for menus
  const [languageMenu, setLanguageMenu] = useState(null);
  const [notificationMenu, setNotificationMenu] = useState(null);

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

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.mode === 'dark'
          ? alpha('#0f172a', 0.8)
          : alpha('#ffffff', 0.8),
        backdropFilter: 'blur(20px)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
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
        width: '100%',
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
              backgroundColor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.common.white, 0.06)
                : alpha(theme.palette.common.black, 0.03),
              borderRadius: '14px',
              padding: '10px',
              transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], {
                duration: theme.transitions.duration.shorter,
              }),
              border: `1px solid ${theme.palette.mode === 'dark'
                ? alpha(theme.palette.common.white, 0.08)
                : alpha(theme.palette.common.black, 0.04)}`,
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.12)
                  : alpha(theme.palette.common.black, 0.06),
                transform: 'translateY(-2px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`
                  : `0 4px 12px ${alpha(theme.palette.common.black, 0.06)}`,
              },
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
                backgroundColor: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.06)
                  : alpha(theme.palette.common.black, 0.03),
                borderRadius: '14px',
                padding: '10px',
                transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], {
                  duration: theme.transitions.duration.shorter,
                }),
                border: `1px solid ${theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.08)
                  : alpha(theme.palette.common.black, 0.04)}`,
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.common.white, 0.12)
                    : alpha(theme.palette.common.black, 0.06),
                  transform: 'translateY(-2px)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`
                    : `0 4px 12px ${alpha(theme.palette.common.black, 0.06)}`,
                },
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

          <Tooltip
            title={mode === 'dark' ? t('tooltip.lightMode') : t('tooltip.darkMode')}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
          >
            <IconButton
              color="inherit"
              onClick={toggleMode}
              aria-label={mode === 'dark' ? 'switch to light mode' : 'switch to dark mode'}
              sx={{
                mx: 1,
                backgroundColor: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.06)
                  : alpha(theme.palette.common.black, 0.03),
                borderRadius: '14px',
                padding: '10px',
                transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], {
                  duration: theme.transitions.duration.shorter,
                }),
                border: `1px solid ${theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.08)
                  : alpha(theme.palette.common.black, 0.04)}`,
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.common.white, 0.12)
                    : alpha(theme.palette.common.black, 0.06),
                  transform: 'translateY(-2px)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`
                    : `0 4px 12px ${alpha(theme.palette.common.black, 0.06)}`,
                },
              }}
            >
              {mode === 'dark' ? <Brightness7Rounded /> : <Brightness4Rounded />}
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
                backgroundColor: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.06)
                  : alpha(theme.palette.common.black, 0.03),
                borderRadius: '14px',
                padding: '10px',
                transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], {
                  duration: theme.transitions.duration.shorter,
                }),
                border: `1px solid ${theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.08)
                  : alpha(theme.palette.common.black, 0.04)}`,
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.common.white, 0.12)
                    : alpha(theme.palette.common.black, 0.06),
                  transform: 'translateY(-2px)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`
                    : `0 4px 12px ${alpha(theme.palette.common.black, 0.06)}`,
                },
              }}
            >
              <TranslateRounded />
            </IconButton>
          </Tooltip>
        </Box>

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
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
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
        >
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
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
              }}
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
              <CheckCircleOutlineRounded sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1, opacity: 0.8 }} />
              <Typography variant="body2" color="textSecondary">
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
                        backgroundColor: alpha(theme.palette.primary.main, 0.06),
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      },
                      mb: 0.5,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          backgroundColor: alpha(getAlertColor(alert.level), 0.1),
                          color: getAlertColor(alert.level),
                        }}
                      >
                        {getAlertIcon(alert.level)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, pr: 2 }}>
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
                                height: 22,
                                fontSize: '0.75rem',
                                bgcolor: alpha(getAlertColor(alert.level), 0.1),
                                color: getAlertColor(alert.level),
                                fontWeight: 500
                              }}
                            />
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={(e) => handleResolveAlert(alert.id, e)}
                              sx={{
                                minWidth: 0,
                                fontSize: '0.75rem',
                                px: 1.5,
                                py: 0.25,
                              }}
                            >
                              {t('sensors:resolveAlert')}
                            </Button>
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                  {index < activeAlerts.length - 1 && <Divider variant="inset" component="li" sx={{ opacity: 0.6 }} />}
                </React.Fragment>
              ))}
            </List>
          )}

          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
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
              sx={{ borderRadius: '10px', fontWeight: 600, textTransform: 'none' }}
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