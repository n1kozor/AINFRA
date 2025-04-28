// Sidebar.tsx
import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  useTheme,
  alpha,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Memory as DevicesIcon,
  Computer as StandardDeviceIcon,
  Extension as PluginIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  SmartToy as CustomDeviceIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';

const DRAWER_WIDTH = 240;

const Sidebar = () => {
  const { sidebarOpen } = useAppContext();
  const { t } = useTranslation();
  const location = useLocation();
  const theme = useTheme();

  const [devicesOpen, setDevicesOpen] = React.useState(true);

  const handleDevicesClick = () => {
    setDevicesOpen(!devicesOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      text: t('navigation.dashboard'),
      icon: <DashboardIcon />,
      path: '/',
    },
    {
      text: t('navigation.devices'),
      icon: <DevicesIcon />,
      children: [
        {
          text: t('navigation.standardDevices'),
          icon: <StandardDeviceIcon />,
          path: '/devices/standard',
        },
        {
          text: t('navigation.customDevices'),
          icon: <CustomDeviceIcon />,
          path: '/devices/custom',
        },
      ],
    },
    {
      text: t('navigation.plugins'),
      icon: <PluginIcon />,
      path: '/plugins',
    },
    {
      text: t('navigation.settings'),
      icon: <SettingsIcon />,
      path: '/settings',
    },
  ];

  const drawerContent = (
    <Box sx={{
      overflow: 'auto',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      p: 2,
      backgroundColor: theme.palette.mode === 'dark'
        ? '#121e2d' // Solid dark blue for dark mode sidebar
        : '#f8fafc', // Light gray for light mode sidebar
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        py: 2,
        mb: 3
      }}>
        <Typography
          variant="h6"
          sx={{
            ml: 1.5,
            fontWeight: 700,
            color: theme.palette.primary.main,
          }}
        >
          InfraSphere
        </Typography>
      </Box>

      <Typography
        variant="caption"
        sx={{
          textTransform: 'uppercase',
          fontWeight: 700,
          color: theme.palette.text.secondary,
          letterSpacing: 1,
          pl: 2,
          mb: 1
        }}
      >
        {t('navigation.main')}
      </Typography>

      <List sx={{ pt: 0 }}>
        {navItems.map((item) => (
          item.children ? (
            <React.Fragment key={item.text}>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={handleDevicesClick}
                  sx={{
                    borderRadius: '10px',
                    backgroundColor: devicesOpen
                      ? alpha(theme.palette.primary.main, 0.08)
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: devicesOpen ? theme.palette.primary.main : theme.palette.text.primary,
                      minWidth: '40px',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: devicesOpen ? 600 : 500,
                      color: devicesOpen ? theme.palette.primary.main : theme.palette.text.primary,
                    }}
                  />
                  {devicesOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>

              <Collapse in={devicesOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItem key={child.text} disablePadding sx={{ mb: 1 }}>
                      <ListItemButton
                        component={Link}
                        to={child.path}
                        sx={{
                          pl: 4,
                          borderRadius: '10px',
                          backgroundColor: isActive(child.path)
                            ? alpha(theme.palette.primary.main, 0.12)
                            : 'transparent',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          }
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: isActive(child.path) ? theme.palette.primary.main : theme.palette.text.primary,
                            minWidth: '40px',
                          }}
                        >
                          {child.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={child.text}
                          primaryTypographyProps={{
                            fontWeight: isActive(child.path) ? 600 : 500,
                            color: isActive(child.path) ? theme.palette.primary.main : theme.palette.text.primary,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ) : (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: '10px',
                  backgroundColor: isActive(item.path)
                    ? alpha(theme.palette.primary.main, 0.12)
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? theme.palette.primary.main : theme.palette.text.primary,
                    minWidth: '40px',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? 600 : 500,
                    color: isActive(item.path) ? theme.palette.primary.main : theme.palette.text.primary,
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{
        p: 2,
        borderRadius: '10px',
        mb: 2,
        backgroundColor: theme.palette.mode === 'dark'
          ? alpha(theme.palette.primary.main, 0.1)
          : alpha(theme.palette.primary.main, 0.05),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {t('sidebar.needHelp')}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1.5, color: theme.palette.text.secondary }}>
          {t('sidebar.supportDesc')}
        </Typography>
        <Box
          component="button"
          sx={{
            display: 'block',
            width: '100%',
            py: 1,
            px: 2,
            border: 'none',
            borderRadius: '8px',
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            }
          }}
        >
          {t('sidebar.contactSupport')}
        </Box>
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
        zIndex: 100, // Ensure sidebar is below AppBar
        [`& .MuiDrawer-paper`]: {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          border: 'none',
          boxShadow: theme.palette.mode === 'dark'
            ? '2px 0 10px rgba(0,0,0,0.2)'
            : '2px 0 10px rgba(0,0,0,0.05)',
          transition: theme.transitions.create(['width', 'transform'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          zIndex: 100, // Ensure sidebar is below AppBar
          mt: '64px', // Match AppBar height to avoid overlap
          height: 'calc(100% - 64px)', // Subtract AppBar height from total height
          overflow: 'hidden',
          ...(!sidebarOpen && {
            transform: 'translateX(-100%)',
            boxShadow: 'none',
          }),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;