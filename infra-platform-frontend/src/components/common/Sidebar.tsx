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
  Avatar,
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
} from '@mui/icons-material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';

const DRAWER_WIDTH = 280;




const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
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

  const drawerContent = (
      <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    height: '100%', // Full height
    background: theme.palette.mode === 'dark'
      ? `linear-gradient(145deg, ${alpha('#121e2d', 0.95)}, ${alpha('#0c1524', 0.97)})`
      : `linear-gradient(145deg, ${alpha('#f8fafc', 0.97)}, ${alpha('#ffffff', 0.99)})`,
    borderRight: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
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
          sx={{
            textTransform: 'uppercase',
            fontWeight: 700,
            color: alpha(theme.palette.text.primary, 0.5),
            letterSpacing: 1,
            fontSize: '0.65rem',
          }}
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
              sx={{
                borderRadius: '16px',
                p: 1.5,
                backgroundColor: isActive(item.path)
                  ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.15 : 0.08)
                  : 'transparent',
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.12),
                  '.MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                    transform: 'scale(1.1) rotate(5deg)'
                  },
                },
              }}
            >
              <MotionListItemIcon
                sx={{
                  minWidth: '42px',
                  color: isActive(item.path) ? theme.palette.primary.main : theme.palette.text.primary,
                  transition: 'all 0.3s ease',
                }}
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
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 700 : 500,
                  color: isActive(item.path) ? theme.palette.primary.main : theme.palette.text.primary,
                  fontSize: '0.95rem',
                }}
              />
              {item.badge && (
                <Badge
                  badgeContent={item.badge.content}
                  color={item.badge.color as "error" | "success" | "default"}
                  sx={{
                    '& .MuiBadge-badge': {
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      px: 0.8,
                    }
                  }}
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
          <Box sx={{
            p: 2.5,
            borderRadius: '24px',
            background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
            backdropFilter: 'blur(8px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            boxShadow: `0 8px 32px ${alpha(theme.palette.mode === 'dark' ? '#000' : theme.palette.primary.main, 0.1)}`,
            position: 'relative',
            overflow: 'hidden',
          }}>
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

            <Typography variant="subtitle1" sx={{
              fontWeight: 700,
              mb: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {t('sidebar.joinUs')}
            </Typography>

            <Typography variant="body2" sx={{
              mb: 2,
              color: alpha(theme.palette.text.primary, 0.7),
              fontSize: '0.85rem',
              lineHeight: 1.5,
            }}>
              {t('sidebar.joinDesc')}
            </Typography>

            <Box
              component={motion.button}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              sx={{
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
              }}
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