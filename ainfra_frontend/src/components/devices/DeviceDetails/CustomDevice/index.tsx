import React from 'react';
import { Box, CircularProgress, Grid, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Device } from '../../../../types/device';

import { useDeviceData } from '../../../../hooks/device/devicedetails/customdevice/useDeviceData';
import { usePluginData } from '../../../../hooks/device/devicedetails/customdevice/usePluginData';
import { useOperations } from '../../../../hooks/device/devicedetails/customdevice/useOperations';
import { useDeviceMetrics } from '../../../../hooks/device/devicedetails/customdevice/useDeviceMetrics';

import DynamicCard from './DynamicCard';
import QuickActions from './QuickActions';
import SystemInfoSection from './SystemInfoSection';
import DynamicTable from './DynamicTable';
import OperationsList from './OperationsList';
import OperationModal from './Modals/OperationModal';
import ConfirmationModal from './Modals/ConfirmationModal';
import DataDisplayModal from './Modals/DataDisplayModal';
import ErrorDisplay from './ErrorDisplay';

import {
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  SdStorage as DiskIcon,
  Warning as WarningIcon,
  LineStyle as MetricsIcon,
  Dns as NetworkIcon
} from '@mui/icons-material';

interface CustomDeviceDetailsProps {
  device: Device;
}

const CustomDeviceDetails: React.FC<CustomDeviceDetailsProps> = ({ device }) => {
  const { t } = useTranslation();
  useTheme();

  const {
    status,
    metrics,
    isLoading,
    error,
    refreshData
  } = useDeviceData(device.id?.toString() || '');

  const pluginId = device.custom_device?.plugin_id !== undefined
      ? device.custom_device.plugin_id.toString()
      : '';

  const {
    plugin,
    availableOperations,
    quickActions
  } = usePluginData(pluginId);

  const {
    extractMainMetrics,
    extractSystemInfo,
    extractTableData
  } = useDeviceMetrics();

  const {
    operationMutation,
    operationModalOpen,
    dataModalOpen,
    confirmModalOpen,
    selectedOperation,
    operationParams,
    modalData,
    modalTitle,
    setOperationModalOpen,
    setDataModalOpen,
    setConfirmModalOpen,
    setOperationParams,
    openOperationModal,
    handleOperation,
    executeOperation,
    executeConfirmedOperation
  } = useOperations(device.id?.toString() || '');

  const handleParamChange = (param: string, value: string) => {
    setOperationParams({
      ...operationParams,
      [param]: value
    });
  };

  const handleQuickAction = (actionId: string, requireConfirm: boolean) => {
    handleOperation(
        actionId,
        {},
        requireConfirm,
        device.custom_device?.connection_params
    );
  };

  const handleExecuteOperation = () => {
    executeOperation(device.custom_device?.connection_params);
  };

  const handleTableRowAction = (actionId: string, rowData: any = {}) => {
    const operation = availableOperations.find((op: any) => op.id === actionId);
    const requireConfirmation = operation?.confirm || false;

    handleOperation(
        actionId,
        rowData,
        requireConfirmation,
        device.custom_device?.connection_params
    );
  };

  const generateTableActions = (tableKey: string) => {
    if (plugin?.ui_schema?.components?.[tableKey]?.actions) {
      return plugin.ui_schema.components[tableKey].actions;
    }
    return [];
  };

  const getMetricIcon = (key: string) => {
    if (key.includes('cpu')) return <SpeedIcon />;
    if (key.includes('memory') || key.includes('ram')) return <MemoryIcon />;
    if (key.includes('disk') || key.includes('storage')) return <DiskIcon />;
    if (key.includes('network') || key.includes('interface')) return <NetworkIcon />;
    if (key.includes('temperature') || key.includes('temp')) return <WarningIcon />;
    return <MetricsIcon />;
  };

  if (isLoading) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" p={4}>
          <CircularProgress />
        </Box>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (status?.error) {
    return <ErrorDisplay error={status.error} message={t('devices.errors.pluginError')} />;
  }

  const mainMetrics = extractMainMetrics(metrics);
  const systemInfo = extractSystemInfo(status);
  const tableData = extractTableData(metrics);

  return (
      <Box>
        <Grid container spacing={3}>
          {quickActions.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <QuickActions
                    actions={quickActions}
                    onAction={handleQuickAction}
                    isLoading={operationMutation.isPending}
                />
              </Grid>
          )}

          {mainMetrics.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Grid container spacing={3}>
                  {mainMetrics.map((metric, index) => (
                      <Grid key={index} size={{ xs: 6, md: 3 }}>
                        <DynamicCard
                            title={metric.title}
                            value={metric.value}
                            type={metric.type}
                            icon={getMetricIcon(metric.title.toLowerCase())}
                            color={metric.color}
                        />
                      </Grid>
                  ))}
                </Grid>
              </Grid>
          )}

          {systemInfo.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <SystemInfoSection
                    data={systemInfo}
                    onRefresh={() => refreshData()}
                />
              </Grid>
          )}

          {tableData.map(table => (
              <Grid key={table.key} size={{ xs: 12 }}>
                <DynamicTable
                    title={
                        plugin?.ui_schema?.components?.[table.key]?.title ||
                        table.key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                    }
                    data={table.data}
                    actions={generateTableActions(table.key)}
                    onAction={handleTableRowAction}
                    onRefresh={refreshData}
                />
              </Grid>
          ))}

          {availableOperations.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <OperationsList
                    operations={availableOperations}
                    onSelectOperation={openOperationModal}
                />
              </Grid>
          )}
        </Grid>


        <OperationModal
            open={operationModalOpen}
            onClose={() => setOperationModalOpen(false)}
            operation={selectedOperation}
            params={operationParams}
            onParamChange={handleParamChange}
            onExecute={handleExecuteOperation}
            isLoading={operationMutation.isPending}
        />

        <ConfirmationModal
            open={confirmModalOpen}
            onClose={() => setConfirmModalOpen(false)}
            onConfirm={executeConfirmedOperation}
            isLoading={operationMutation.isPending}
        />

        <DataDisplayModal
            open={dataModalOpen}
            onClose={() => setDataModalOpen(false)}
            title={modalTitle}
            data={modalData}
        />
      </Box>
  );
};

export default CustomDeviceDetails;