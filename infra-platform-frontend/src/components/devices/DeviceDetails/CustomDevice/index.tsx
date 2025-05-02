// Main component file that uses all the smaller components
import React from 'react';
import { Box, CircularProgress, Grid, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Device } from '../../../../types/device';

// Custom hooks
import { useDeviceData } from '../../../../hooks/device/devicedetails/customdevice/useDeviceData';
import { usePluginData } from '../../../../hooks/device/devicedetails/customdevice/usePluginData';
import { useOperations } from '../../../../hooks/device/devicedetails/customdevice/useOperations';
import { useDeviceMetrics } from '../../../../hooks/device/devicedetails/customdevice/useDeviceMetrics';

// Components
import DynamicCard from './DynamicCard';
import QuickActions from './QuickActions';
import SystemInfoSection from './SystemInfoSection';
import DynamicTable from './DynamicTable';
import OperationsList from './OperationsList';
import OperationModal from './Modals/OperationModal';
import ConfirmationModal from './Modals/ConfirmationModal';
import DataDisplayModal from './Modals/DataDisplayModal';
import ErrorDisplay from './ErrorDisplay';

// Icons (for dynamic metrics display)
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
  const { t } = useTranslation(['devices', 'common']);
  useTheme();
// Get device data
  const {
    status,
    metrics,
    isLoading,
    error,
    refreshData
  } = useDeviceData(device.id);

  // Get plugin data
  const pluginId = device.custom_device?.plugin_id;
  const {
    plugin,
    availableOperations,
    quickActions
  } = usePluginData(pluginId);

  // Get device metrics utilities
  const {
    extractMainMetrics,
    extractSystemInfo,
    extractTableData
  } = useDeviceMetrics();

  // Setup operations handling
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
  } = useOperations(device.id);

  // Handle parameter changes in operation modal
  const handleParamChange = (param: string, value: string) => {
    setOperationParams({
      ...operationParams,
      [param]: value
    });
  };

  // Action handler for quick actions
  const handleQuickAction = (actionId: string, requireConfirm: boolean) => {
    handleOperation(
      actionId,
      {},
      requireConfirm,
      device.custom_device?.connection_params
    );
  };

  // Execute operation from modal with connection params
  const handleExecuteOperation = () => {
    executeOperation(device.custom_device?.connection_params);
  };

  // Table row action handler
  const handleTableRowAction = (actionId: string, rowData: any = {}) => {
    // Find the operation from available operations
    const operation = availableOperations.find(op => op.id === actionId);
    const requireConfirmation = operation?.confirm || false;

    handleOperation(
      actionId,
      rowData,
      requireConfirmation,
      device.custom_device?.connection_params
    );
  };

  // Generate actions for table rows
  const generateTableActions = (tableKey: string) => {
    if (plugin?.ui_schema?.components?.[tableKey]?.actions) {
      return plugin.ui_schema.components[tableKey].actions;
    }
    return [];
  };

  // Get icon for metric display
  const getMetricIcon = (key: string) => {
    if (key.includes('cpu')) return <SpeedIcon />;
    if (key.includes('memory') || key.includes('ram')) return <MemoryIcon />;
    if (key.includes('disk') || key.includes('storage')) return <DiskIcon />;
    if (key.includes('network') || key.includes('interface')) return <NetworkIcon />;
    if (key.includes('temperature') || key.includes('temp')) return <WarningIcon />;
    return <MetricsIcon />;
  };

  // Loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return <ErrorDisplay error={error} />;
  }

  // If the device status contains an error
  if (status?.error) {
    return <ErrorDisplay error={status.error} message={t('devices:errors.pluginError')} />;
  }

  // Process data for display
  const mainMetrics = extractMainMetrics(metrics);
  const systemInfo = extractSystemInfo(status);
  const tableData = extractTableData(metrics);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Quick Action Buttons */}
        {quickActions.length > 0 && (
            <Grid
                size={{
                  xs: 12,
                }}
            >
              <QuickActions
                  actions={quickActions}
                  onAction={handleQuickAction}
                  isLoading={operationMutation.isPending}
              />
            </Grid>

        )}

        {/* Main metrics */}
        {mainMetrics.length > 0 && (
            <Grid
                size={{
                  xs: 12,
                }}
            >
              <Grid container spacing={3}>
                {mainMetrics.map((metric, index) => (
                    <Grid
                        size={{
                          xs: 6,
                          md: 3,
                        }}
                        key={index}
                    >
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

        {/* System Info */}
        {systemInfo.length > 0 && (
            <Grid
                size={{
                  xs: 12,
                }}
            >
              <SystemInfoSection
                  data={systemInfo}
                  onRefresh={() => refreshData()}
              />
            </Grid>

        )}

        {/* Dynamic tables */}
        {tableData.map(table => (
            <Grid
                size={{
                  xs: 12,
                }}
                key={table.key}
            >
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

        {/* Available Operations */}
        {availableOperations.length > 0 && (
            <Grid
                size={{
                  xs: 12,
                }}
            >
              <OperationsList
                  operations={availableOperations}
                  onSelectOperation={openOperationModal}
              />
            </Grid>

        )}
      </Grid>

      {/* Modals */}
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