import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  Typography,
  Badge,
  Divider,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  SpeedRounded as DashboardIcon,
  DevicesRounded as DevicesIcon,
  ComputerRounded as StandardDeviceIcon,
  SmartToyRounded as CustomDeviceIcon,
  ExtensionRounded as PluginIcon,
  SettingsRounded as SettingsIcon,
  WorkspacePremiumRounded as ProIcon,
  SensorsOutlined,
} from '@mui/icons-material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useThemeContext } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const DRAWER_WIDTH = 280;

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const { themeVariant } = useThemeContext();
  const { t } = useTranslation();
  const location = useLocation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const MotionListItem = motion.create(ListItem);
  const MotionListItemIcon = motion.create(ListItemIcon);

  const navItems = [
    {
      id: 'dashboard',
      text: t('navigation.dashboard'),
      icon: <DashboardIcon />,
      path: '/',
    },
    {
      id: 'devices',
      text: t('navigation.devices'),
      icon: <DevicesIcon />,
      path: '/devices',
    },
    {
      icon: <SensorsOutlined />,
      text: t('common:sensors'),
      path: '/sensors',
      active: location.pathname === '/sensors'
    },
    {
      id: 'plugins',
      text: t('navigation.plugins'),
      icon: <PluginIcon />,
      path: '/plugins',
      badge: {
        content: "New",
        color: "success"
      }
    },
    {
      id: 'settings',
      text: t('navigation.settings'),
      icon: <SettingsIcon />,
      path: '/settings',
    },
  ];

  // Get background styles based on theme variant
  const getBackgroundStyles = () => {
    switch (themeVariant) {
      case 'dark':
        return {
          background: `linear-gradient(145deg, ${alpha('#121e2d', 0.95)}, ${alpha('#0c1524', 0.97)})`,
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
        };
      case 'paper':
        return {
          background: '#FFFBF0',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a58e68' fill-opacity='0.05'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          borderRight: `2px dashed #D6CBAE`,
          transform: 'rotate(-0.5deg)',
        };
      default: // Light theme
        return {
          background: `linear-gradient(145deg, ${alpha('#f8fafc', 0.97)}, ${alpha('#ffffff', 0.99)})`,
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
        };
    }
  };

  // Get list item styles based on theme variant
  const getListItemStyles = (isActiveItem: boolean) => {
    switch (themeVariant) {
      case 'dark':
        return {
          borderRadius: '16px',
          p: 1.5,
          backgroundColor: isActiveItem
            ? alpha(theme.palette.primary.main, 0.15)
            : 'transparent',
          transition: 'all 0.3s',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
            '.MuiListItemIcon-root': {
              color: theme.palette.primary.main,
              transform: 'scale(1.1) rotate(5deg)'
            },
          },
        };
      case 'paper':
        return {
          borderRadius: '14px',
          p: 1.5,
          backgroundColor: isActiveItem
            ? alpha('#FF6B6B', 0.1)
            : 'transparent',
          transition: 'all 0.3s',
          border: isActiveItem ? '2px dashed #FFB8B8' : '2px dashed transparent',
          transform: 'rotate(-0.5deg)',
          '&:hover': {
            backgroundColor: alpha('#FF6B6B', 0.08),
            transform: 'rotate(0.5deg) translateY(-2px)',
            '.MuiListItemIcon-root': {
              color: '#FF6B6B',
              transform: 'scale(1.1) rotate(5deg)'
            },
          },
        };
      default: // Light theme
        return {
          borderRadius: '16px',
          p: 1.5,
          backgroundColor: isActiveItem
            ? alpha(theme.palette.primary.main, 0.08)
            : 'transparent',
          transition: 'all 0.3s',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            '.MuiListItemIcon-root': {
              color: theme.palette.primary.main,
              transform: 'scale(1.1) rotate(5deg)'
            },
          },
        };
    }
  };

  // Get list item icon styles based on theme variant
  const getIconStyles = (isActiveItem: boolean) => {
    const baseStyles = {
      minWidth: '42px',
      transition: 'all 0.3s ease',
    };

    switch (themeVariant) {
      case 'dark':
        return {
          ...baseStyles,
          color: isActiveItem ? theme.palette.primary.main : theme.palette.text.primary,
        };
      case 'paper':
        return {
          ...baseStyles,
          color: isActiveItem ? '#FF6B6B' : '#A58E68',
        };
      default: // Light theme
        return {
          ...baseStyles,
          color: isActiveItem ? theme.palette.primary.main : theme.palette.text.primary,
        };
    }
  };

  // Get text styles based on theme variant
  const getTextStyles = (isActiveItem: boolean) => {
    switch (themeVariant) {
      case 'dark':
        return {
          fontWeight: isActiveItem ? 700 : 500,
          color: isActiveItem ? theme.palette.primary.main : theme.palette.text.primary,
          fontSize: '0.95rem',
        };
      case 'paper':
        return {
          fontWeight: isActiveItem ? 700 : 500,
          color: isActiveItem ? '#FF6B6B' : theme.palette.text.primary,
          fontSize: '0.95rem',
          fontFamily: '"Comic Neue", "Marker Felt", "Neucha", cursive',
        };
      default: // Light theme
        return {
          fontWeight: isActiveItem ? 700 : 500,
          color: isActiveItem ? theme.palette.primary.main : theme.palette.text.primary,
          fontSize: '0.95rem',
        };
    }
  };

  // Get badge styles based on theme variant
  const getBadgeStyles = () => {
    const baseStyles = {
      '& .MuiBadge-badge': {
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.7rem',
        px: 0.8,
      }
    };

    if (themeVariant === 'paper') {
      return {
        ...baseStyles,
        '& .MuiBadge-badge': {
          ...baseStyles['& .MuiBadge-badge'],
          fontFamily: '"Comic Neue", "Marker Felt", "Neucha", cursive',
          border: '1px dashed #FFB8B8',
        }
      };
    }

    return baseStyles;
  };

  // Get caption styles based on theme variant
  const getCaptionStyles = () => {
    const baseStyles = {
      textTransform: 'uppercase',
      fontWeight: 700,
      color: alpha(theme.palette.text.primary, 0.5),
      letterSpacing: 1,
      fontSize: '0.65rem',
    };

    if (themeVariant === 'paper') {
      return {
        ...baseStyles,
        fontFamily: '"Patrick Hand", "Just Me Again Down Here", cursive',
        color: '#A58E68',
      };
    }

    return baseStyles;
  };

  // Get promotional box styles based on theme variant
  const getPromoBoxStyles = () => {
    switch (themeVariant) {
      case 'dark':
        return {
          p: 2.5,
          borderRadius: '24px',
          background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
          backdropFilter: 'blur(8px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          boxShadow: `0 8px 32px ${alpha('#000', 0.1)}`,
          position: 'relative',
          overflow: 'hidden',
        };
      case 'paper':
        return {
          p: 2.5,
          borderRadius: '20px',
          background: '#FFFBF0',
          border: `2px dashed #D6CBAE`,
          boxShadow: '0 6px 0 -3px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden',
          transform: 'rotate(-0.5deg)',
        };
      default: // Light theme
        return {
          p: 2.5,
          borderRadius: '24px',
          background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
          backdropFilter: 'blur(8px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
          position: 'relative',
          overflow: 'hidden',
        };
    }
  };

  // Get promo title styles based on theme variant
  const getPromoTitleStyles = () => {
    switch (themeVariant) {
      case 'dark':
      case 'light':
        return {
          fontWeight: 700,
          mb: 1,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        };
      case 'paper':
        return {
          fontWeight: 700,
          mb: 1,
          color: '#FF6B6B',
          fontFamily: '"Patrick Hand", "Just Me Again Down Here", cursive',
        };
    }
  };

  // Get promo description styles based on theme variant
  const getPromoDescStyles = () => {
    const baseStyles = {
      mb: 2,
      color: alpha(theme.palette.text.primary, 0.7),
      fontSize: '0.85rem',
      lineHeight: 1.5,
    };

    if (themeVariant === 'paper') {
      return {
        ...baseStyles,
        fontFamily: '"Comic Neue", "Marker Felt", "Neucha", cursive',
      };
    }

    return baseStyles;
  };

  // Get promo button styles based on theme variant
  const getPromoButtonStyles = () => {
    switch (themeVariant) {
      case 'dark':
      case 'light':
        return {
          display: 'flex',
          width: '100%',
          py: 1.2,
          px: 2,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          border: 'none',
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.875rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
          '&:hover': {
            boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.6)}`,
          }
        };
      case 'paper':
        return {
          display: 'flex',
          width: '100%',
          py: 1.2,
          px: 2,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          border: '2px dashed #FFB8B8',
          borderRadius: '12px',
          background: '#FF6B6B',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.875rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 4px 0 #E74C3C',
          transform: 'rotate(-0.5deg)',
          fontFamily: '"Patrick Hand", "Just Me Again Down Here", cursive',
          '&:hover': {
            boxShadow: '0 6px 0 #E74C3C',
            transform: 'translateY(-2px) rotate(0.5deg)',
          },
          '&:active': {
            boxShadow: '0 2px 0 #E74C3C',
            transform: 'translateY(0) rotate(-0.2deg)',
          }
        };
    }
  };

  const drawerContent = (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%', // Full height
      ...getBackgroundStyles(),
      overflowY: 'auto',
      overflowX: 'hidden',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none'
      }
    }}>
      <Box sx={{ px: 2.5, mb: 1 }}>
        <Typography
          variant="caption"
          sx={getCaptionStyles()}
        >
          {t('navigation.main')}
        </Typography>
      </Box>

      <List sx={{ px: 1.5, py: 0 }}>
        {navItems.map((item) => (
          <MotionListItem
            key={item.id}
            disablePadding
            sx={{ mb: 0.5 }}
            initial={!hasAnimated ? { opacity: 0, y: 10 } : false}
            animate={!hasAnimated ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2 }}
          >
            <ListItemButton
              component={Link}
              to={item.path}
              sx={getListItemStyles(isActive(item.path))}
            >
              <MotionListItemIcon
                sx={getIconStyles(isActive(item.path))}
                animate={{
                  rotate: isActive(item.path) ? 5 : 0,
                  scale: isActive(item.path) ? 1.1 : 1
                }}
                whileHover={{ scale: 1.1 }}
              >
                {item.icon}
              </MotionListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={getTextStyles(isActive(item.path))}
              />
              {item.badge && (
                <Badge
                  badgeContent={item.badge.content}
                  color={item.badge.color as "error" | "success" | "default"}
                  sx={getBadgeStyles()}
                />
              )}
            </ListItemButton>
          </MotionListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1, minHeight: '20px' }} />

      <Box sx={{ p: 2.5 }}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Box sx={getPromoBoxStyles()}>
            {themeVariant !== 'paper' && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.3)}, ${alpha(theme.palette.secondary.main, 0.3)})`,
                  borderRadius: '50%',
                  filter: 'blur(40px)',
                  transform: 'translate(30%, -30%)',
                  opacity: 0.6,
                }}
              />
            )}

            <Typography variant="subtitle1" sx={getPromoTitleStyles()}>
              {t('sidebar.joinUs')}
            </Typography>

            <Typography variant="body2" sx={getPromoDescStyles()}>
              {t('sidebar.joinDesc')}
            </Typography>

            <Box
              component={motion.button}
              whileHover={{ scale: themeVariant === 'paper' ? 1.02 : 1.03 }}
              whileTap={{ scale: 0.98 }}
              sx={getPromoButtonStyles()}
            >
              <GitHubIcon fontSize="small" />
              {t('sidebar.contactUs')}
            </Box>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );

  return (
    <Drawer
      open={sidebarOpen}
      variant="permanent" // Always keep it in the DOM
      sx={{
        width: sidebarOpen ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        zIndex: 100,
        [`& .MuiDrawer-paper`]: {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          border: 'none',
          transition: theme.transitions.create(['width', 'transform'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
          zIndex: 100,
          mt: '64px', // Match header height
          height: 'calc(100% - 64px)', // Full height minus header
          overflow: 'hidden',
          // Transform sidebar off-screen when closed (rather than changing width)
          ...(!sidebarOpen && {
            transform: 'translateX(-100%)',
          }),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;