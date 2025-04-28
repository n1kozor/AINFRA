// StandardDevices.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api';
import PageContainer from '../../components/common/PageContainer';
import DeviceList from '../../components/devices/DeviceList';
import { Box, Typography, CircularProgress, alpha, useTheme, Button } from '@mui/material';
import {
  Computer as StandardDeviceIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import DashboardCard from '../../components/dashboard/DashboardCard';

const StandardDevices = () => {
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();

  const { data: devices, isLoading, error, refetch } = useQuery({
    queryKey: ['devices'],
    queryFn: api.devices.getAll,
  });

  if (error) {
    return (
      <PageContainer
        title={t('devices:standardDevices.title')}
        breadcrumbs={[
          { text: t('common:navigation.dashboard'), link: '/' },
          { text: t('common:navigation.devices'), link: '/devices' },
          { text: t('common:navigation.standardDevices') },
        ]}
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
      title={t('devices:standardDevices.title')}
      breadcrumbs={[
        { text: t('common:navigation.dashboard'), link: '/' },
        { text: t('common:navigation.devices'), link: '/devices' },
        { text: t('common:navigation.standardDevices') },
      ]}
      icon={
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            mr: 2,
          }}
        >
          <StandardDeviceIcon />
        </Box>
      }
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress size={50} thickness={4} sx={{ color: theme.palette.primary.main }} />
        </Box>
      ) : (
        <DeviceList devices={devices || []} isLoading={isLoading} type="standard" />
      )}
    </PageContainer>
  );
};

export default StandardDevices;