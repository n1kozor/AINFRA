import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api';
import PageContainer from '../../components/common/PageContainer';
import DeviceList from '../../components/devices/DeviceList';

const CustomDevices = () => {
  const { t } = useTranslation(['devices', 'common']);

  const { data: devices, isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: api.devices.getAll,
  });

  return (
    <PageContainer
      title={t('devices:customDevices.title')}
      breadcrumbs={[
        { text: t('common:navigation.dashboard'), link: '/' },
        { text: t('common:navigation.devices'), link: '/devices' },
        { text: t('common:navigation.customDevices') },
      ]}
    >
      <DeviceList
        devices={devices || []}
        isLoading={isLoading}
        type="custom"
      />
    </PageContainer>
  );
};

export default CustomDevices;