import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api';
import PageContainer from '../../components/common/PageContainer';
import DeviceList from '../../components/devices/DeviceList';

const StandardDevices = () => {
  const { t } = useTranslation(['devices', 'common']);

  const { data: devices, isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: api.devices.getAll,
  });

  return (
    <PageContainer
      title={t('devices:standardDevices.title')}
      breadcrumbs={[
        { text: t('common:navigation.dashboard'), link: '/' },
        { text: t('common:navigation.devices'), link: '/devices' },
        { text: t('common:navigation.standardDevices') },
      ]}
    >
      <DeviceList
        devices={devices || []}
        isLoading={isLoading}
        type="standard"
      />
    </PageContainer>
  );
};

export default StandardDevices;