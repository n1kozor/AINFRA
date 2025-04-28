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

const DRAWER_WIDTH = 280;

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
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, rgba(21, 35, 56, 0.8) 0%, rgba(17, 30, 49, 0.95) 100%)'
        : 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(250, 252, 255, 0.95) 100%)',
      backdropFilter: 'blur(10px)',
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 2,
        mb: 4
      }}>
        <img src="/logo.svg" alt="InfraStructure Platform" style={{ height: '48px' }} />
        <Typography
          variant="h5"
          sx={{
            ml: 1,
            fontWeight: 800,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(90deg, #3f8cff, #83b9ff)'
              : 'linear-gradient(90deg, #2962ff, #5686ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
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
          opacity: 0.6,
          letterSpacing: 1,
          pl: 2,
          mb: 1
        }}
      >
        {t('navigation.main')}
      </Typography>

      <List
        sx={{
          pt: 0,
          '& .MuiListItemButton-root': {
            borderRadius: '16px',
            mb: 1,
            py: 1.5,
            pl: 2,
            transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], {
              duration: theme.transitions.duration.shorter,
            }),
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 6px 12px rgba(0,0,0,0.2)'
                : '0 6px 12px rgba(0,0,0,0.07)'
            }
          },
          '& .MuiListItemIcon-root': {
            minWidth: '40px',
            color: theme.palette.text.secondary,
          },
          '& .MuiListItemText-primary': {
            fontSize: '0.95rem',
            fontWeight: 500,
          }
        }}
      >
        {navItems.map((item) => (
          item.children ? (
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleDevicesClick}
                  sx={{
                    background: devicesOpen
                      ? alpha(theme.palette.primary.main, 0.08)
                      : 'transparent',
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.12),
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: devicesOpen ? theme.palette.primary.main : undefined
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: devicesOpen ? 600 : 500,
                      color: devicesOpen ? theme.palette.primary.main : undefined
                    }}
                  />
                  {devicesOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>

              <Collapse in={devicesOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItem key={child.text} disablePadding>
                      <ListItemButton
                        component={Link}
                        to={child.path}
                        sx={{
                          pl: 4,
                          background: isActive(child.path)
                            ? theme.palette.mode === 'dark'
                              ? 'linear-gradient(90deg, rgba(63, 140, 255, 0.15), rgba(131, 185, 255, 0.05))'
                              : 'linear-gradient(90deg, rgba(41, 98, 255, 0.15), rgba(86, 134, 255, 0.05))'
                            : 'transparent',
                          borderLeft: isActive(child.path)
                            ? `3px solid ${theme.palette.primary.main}`
                            : '3px solid transparent',
                          '&:hover': {
                            background: theme.palette.mode === 'dark'
                              ? 'linear-gradient(90deg, rgba(63, 140, 255, 0.2), rgba(131, 185, 255, 0.08))'
                              : 'linear-gradient(90deg, rgba(41, 98, 255, 0.2), rgba(86, 134, 255, 0.08))'
                          }
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: isActive(child.path) ? theme.palette.primary.main : undefined
                          }}
                        >
                          {child.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={child.text}
                          primaryTypographyProps={{
                            fontWeight: isActive(child.path) ? 600 : 500,
                            color: isActive(child.path) ? theme.palette.primary.main : undefined
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ) : (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  background: isActive(item.path)
                    ? theme.palette.mode === 'dark'
                      ? 'linear-gradient(90deg, rgba(63, 140, 255, 0.2), rgba(131, 185, 255, 0.05))'
                      : 'linear-gradient(90deg, rgba(41, 98, 255, 0.2), rgba(86, 134, 255, 0.05))'
                    : 'transparent',
                  '&:hover': {
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(90deg, rgba(63, 140, 255, 0.25), rgba(131, 185, 255, 0.1))'
                      : 'linear-gradient(90deg, rgba(41, 98, 255, 0.25), rgba(86, 134, 255, 0.1))'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? theme.palette.primary.main : undefined
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? 600 : 500,
                    color: isActive(item.path) ? theme.palette.primary.main : undefined
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
        borderRadius: '16px',
        mb: 2,
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(63, 140, 255, 0.1), rgba(131, 185, 255, 0.05))'
          : 'linear-gradient(135deg, rgba(41, 98, 255, 0.1), rgba(86, 134, 255, 0.05))',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {t('sidebar.needHelp')}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7, mb: 1.5 }}>
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
            borderRadius: '12px',
            background: theme.palette.primary.main,
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              background: theme.palette.primary.dark,
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
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
            ? '4px 0 25px rgba(0,0,0,0.3)'
            : '4px 0 25px rgba(0,0,0,0.1)',
          transition: theme.transitions.create(['width', 'transform'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
          zIndex: 100, // Ensure sidebar is below AppBar
          mt: '64px', // Match AppBar height to avoid overlap
          height: 'calc(100% - 64px)', // Subtract AppBar height from total height
          borderRadius: '0 24px 0 0',
          overflow: 'visible',
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