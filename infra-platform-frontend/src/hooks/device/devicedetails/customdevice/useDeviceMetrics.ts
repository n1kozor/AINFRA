import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ValueDisplayType } from '../../../../components/devices/DeviceDetails/CustomDevice/types';

export const useDeviceMetrics = () => {
  const theme = useTheme();
  const { t } = useTranslation(['devices', 'common']);

  // Format bytes utility function
  const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Get metric color
  const getMetricColor = (key: string) => {
    if (key.includes('cpu')) return theme.palette.primary.main;
    if (key.includes('memory') || key.includes('ram')) return theme.palette.secondary.main;
    if (key.includes('disk') || key.includes('storage')) return theme.palette.warning.main;
    if (key.includes('network') || key.includes('interface')) return theme.palette.info.main;
    if (key.includes('temperature') || key.includes('temp')) return theme.palette.error.main;
    return theme.palette.success.main;
  };

  // Check if a status string indicates a positive state
  const isPositiveStatus = (status: string): boolean => {
    if (!status || typeof status !== 'string') return false;
    const positiveKeywords = ['online', 'active', 'running', 'up', 'connected', 'enabled', 'ok', 'healthy'];
    const statusLower = status.toLowerCase();
    return positiveKeywords.some(keyword => statusLower.includes(keyword));
  };

  // Extract main metrics
  const extractMainMetrics = (metrics: any) => {
    if (!metrics) return [];

    // Pre-defined important metrics to look for
    const metricKeys = [
      { key: 'cpu_usage', type: 'percentage' },
      { key: 'memory_used', type: 'percentage' },
      { key: 'disk_usage', type: 'percentage' },
      { key: 'temperature', type: 'text' },
    ];

    const mainMetrics = [];

    // First try to find our predefined important metrics
    for (const metricDef of metricKeys) {
      if (metrics[metricDef.key] !== undefined) {
        // Format the title to be user-friendly
        const formattedTitle = metricDef.key
          .replace(/_/g, ' ')
          .replace(/([A-Z])/g, ' $1')
          .replace(/^\w/, c => c.toUpperCase())
          .replace(/\b\w/g, c => c.toUpperCase());

        mainMetrics.push({
          title: t(`devices:metrics.${metricDef.key}`, formattedTitle),
          value: metrics[metricDef.key],
          type: metricDef.type as ValueDisplayType,
          color: getMetricColor(metricDef.key)
        });
      }
    }

    // If we don't have enough, add some other numeric metrics
    if (mainMetrics.length < 4) {
      for (const [key, value] of Object.entries(metrics)) {
        // Skip complex objects, arrays and already added metrics
        if (typeof value === 'object' || Array.isArray(value) || mainMetrics.some(m => m.title.toLowerCase().includes(key.toLowerCase()))) continue;
        // Skip special fields
        if (key === 'error') continue;

        let metricType: ValueDisplayType = 'text';

        // Try to determine value type
        if (typeof value === 'number') {
          if (value >= 0 && value <= 100) {
            metricType = 'percentage';
          } else if (value > 1000) {
            metricType = 'bytes';
          }
        } else if (typeof value === 'boolean') {
          metricType = 'boolean';
        }

        // Format the title to be user-friendly
        const formattedTitle = key
          .replace(/_/g, ' ')
          .replace(/([A-Z])/g, ' $1')
          .replace(/^\w/, c => c.toUpperCase())
          .replace(/\b\w/g, c => c.toUpperCase());

        mainMetrics.push({
          title: t(`devices:metrics.${key}`, formattedTitle),
          value,
          type: metricType,
          color: getMetricColor(key)
        });

        // Limit to 4 metrics total
        if (mainMetrics.length >= 4) break;
      }
    }

    return mainMetrics;
  };

  // Extract system info from status
  const extractSystemInfo = (status: any) => {
    if (!status) return [];

    const systemInfo = [];

    // Process all fields in status that aren't objects or arrays
    for (const [key, value] of Object.entries(status)) {
      if (typeof value !== 'object' && key !== 'error') {
        let fieldType: ValueDisplayType = 'text';

        // Determine field type
        if (typeof value === 'boolean') {
          fieldType = 'boolean';
        } else if (key === 'status' || key.includes('connected') || key.includes('online')) {
          fieldType = 'status';
        }

        // Format the title to be user-friendly
        const formattedTitle = key
          .replace(/_/g, ' ')
          .replace(/([A-Z])/g, ' $1')
          .replace(/^\w/, c => c.toUpperCase())
          .replace(/\b\w/g, c => c.toUpperCase());

        systemInfo.push({
          title: t(`devices:systemInfo.${key}`, formattedTitle),
          value,
          type: fieldType
        });
      }
    }

    return systemInfo;
  };

  // Identify and collect all arrays that should be rendered as tables
  const extractTableData = (metrics: any) => {
    if (!metrics) return [];

    const tableData = [];
    for (const [key, value] of Object.entries(metrics)) {
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        tableData.push({
          key,
          data: value
        });
      }
    }
    return tableData;
  };

  return {
    formatBytes,
    getMetricColor,
    isPositiveStatus,
    extractMainMetrics,
    extractSystemInfo,
    extractTableData
  };
};