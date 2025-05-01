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
  useMediaQuery,
} from '@mui/material';
import {
  SpeedRounded as DashboardIcon,
  DevicesRounded as DevicesIcon,
  ExtensionRounded as PluginIcon,
  SettingsRounded as SettingsIcon,
  SensorsOutlined,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';

const DRAWER_WIDTH = 280;

const Sidebar = () => {
  const { sidebarOpen } = useAppContext();
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
      id: 'sensors',
      text: t('common:sensors'),
      icon: <SensorsOutlined />,
      path: '/sensors',
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
      height: '100%',
      borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      overflowY: 'auto',
      overflowX: 'hidden',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none'
      }
    }}>


      <List sx={{ px: 1.5, py: 3 }}>
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
                borderRadius: "20px",
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
                      borderRadius: theme.shape.borderRadius,
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
            borderRadius: "20px",
            background: alpha(theme.palette.primary.main, 0.08),
            backdropFilter: 'blur(8px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
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
              color: theme.palette.primary.main,
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
                borderRadius: theme.shape.borderRadius,
                background: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
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
      variant="permanent"
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
          mt: '64px',
          height: 'calc(100% - 64px)',
          overflow: 'hidden',
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