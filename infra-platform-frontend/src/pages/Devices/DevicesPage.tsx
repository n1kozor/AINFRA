import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api';
import PageContainer from '../../components/common/PageContainer';
import DeviceList from '../../components/devices/DeviceList';
import {
  Box,
  Typography,
  CircularProgress,
  alpha,
  useTheme,
  Button,
  Badge,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  DevicesRounded as DevicesIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Computer as StandardDeviceIcon,
  SmartToy as CustomDeviceIcon,
  FilterAlt as FilterIcon,
  AddRounded as AddIcon
} from '@mui/icons-material';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DeviceType } from '../../types/device';

const DevicesPage = () => {
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<DeviceType | 'all'>('all');

  const { data: devices, isLoading, error, refetch } = useQuery({
    queryKey: ['devices'],
    queryFn: api.devices.getAll,
  });

  const standardDevicesCount = devices?.filter(d => d.type === 'standard').length || 0;
  const customDevicesCount = devices?.filter(d => d.type === 'custom').length || 0;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: DeviceType | 'all') => {
    setActiveTab(newValue);
  };

  const getFilteredDevices = () => {
    if (!devices) return [];
    if (activeTab === 'all') return devices;
    return devices.filter(device => device.type === activeTab);
  };

  const handleRefresh = () => {
    refetch();
  };

  if (error) {
    return (
      <PageContainer
        title={t('devices:allDevices.title')}
        subtitle={t('devices:tryDifferentFilters')}
        breadcrumbs={[
          { text: t('common:navigation.dashboard'), link: '/' },
          { text: t('common:navigation.devices') },
        ]}
        icon={<DevicesIcon />}
      >
        <DashboardCard
          title={t('devices:error')}
          icon={<WarningIcon />}
          color="error"
        >
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography paragraph>
              {t('devices:errorFetchingDevices')}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={() => refetch()}
              sx={{
                mt: 2,
                px: 3,
                py: 1.2,
                borderRadius: '12px',
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                }
              }}
            >
              {t('common:actions.retry')}
            </Button>
          </Box>
        </DashboardCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={t('devices:allDevices.title')}
      subtitle={devices && devices.length > 0
        ? t('devices:deviceCount', { count: devices.length })
        : t('devices:noDevicesYet')}
      breadcrumbs={[
        { text: t('common:navigation.dashboard'), link: '/' },
        { text: t('common:navigation.devices') },
      ]}
      icon={<DevicesIcon />}
      actions={
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/devices/new"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: '12px',
            px: 3,
            py: 1.2,
            boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            '&:hover': {
              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s',
          }}
        >
          {t('devices:addDevice')}
        </Button>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: '20px',
            overflow: 'hidden',
            bgcolor: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            aria-label="device type tabs"
            sx={{
              minHeight: '60px',
              '& .MuiTabs-indicator': {
                height: 4,
                borderRadius: '2px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
              '& .MuiTab-root': {
                minHeight: '60px',
                fontWeight: 600,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: alpha(theme.palette.action.hover, 0.1),
                  color: theme.palette.primary.main,
                }
              },
            }}
          >
            <Tab
              value="all"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Badge
                    badgeContent={devices?.length || 0}
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontWeight: 700,
                        borderRadius: '8px',
                        minWidth: '24px',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                      <DevicesIcon sx={{ mr: 1 }} />
                      {t('devices:statusOptions.all')}
                    </Box>
                  </Badge>
                </Box>
              }
              sx={{
                color: activeTab === 'all' ? theme.palette.primary.main : theme.palette.text.primary
              }}
            />
            <Tab
              value="standard"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Badge
                    badgeContent={standardDevicesCount}
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontWeight: 700,
                        borderRadius: '8px',
                        minWidth: '24px',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                      <StandardDeviceIcon sx={{ mr: 1 }} />
                      {t('devices:deviceTypes.standard')}
                    </Box>
                  </Badge>
                </Box>
              }
              sx={{
                color: activeTab === 'standard' ? theme.palette.primary.main : theme.palette.text.primary
              }}
            />
            <Tab
              value="custom"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Badge
                    badgeContent={customDevicesCount}
                    color="secondary"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontWeight: 700,
                        borderRadius: '8px',
                        minWidth: '24px',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                      <CustomDeviceIcon sx={{ mr: 1 }} />
                      {t('devices:deviceTypes.custom')}
                    </Box>
                  </Badge>
                </Box>
              }
              sx={{
                color: activeTab === 'custom' ? theme.palette.secondary.main : theme.palette.text.primary
              }}
            />
          </Tabs>
        </Paper>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
            <CircularProgress size={50} thickness={4} sx={{ color: theme.palette.primary.main }} />
          </Box>
        ) : (
          <DeviceList
            devices={getFilteredDevices()}
            isLoading={isLoading}
            onRefresh={handleRefresh}
          />
        )}
      </motion.div>
    </PageContainer>
  );
};

export default DevicesPage;