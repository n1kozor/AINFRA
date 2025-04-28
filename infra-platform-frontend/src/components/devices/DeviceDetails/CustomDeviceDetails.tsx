import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  useTheme,
  alpha,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Chip,
  Alert,
  Paper,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Code as CodeIcon,
  PlayArrow as PlayIcon,
  LineStyle as MetricsIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Launch as LaunchIcon,
  FileCopy as CopyIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Device } from '../../../types/device';
import { Plugin } from '../../../types/plugin';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../api';
import DashboardCard from '../../dashboard/DashboardCard';

interface CustomDeviceDetailsProps {
  device: Device;
}

// Value display types for dynamic rendering
type ValueDisplayType = 'text' | 'status' | 'progress' | 'percentage' | 'bytes' | 'boolean';

interface DynamicCardProps {
  title: string;
  subtitle?: string;
  value: any;
  type?: ValueDisplayType;
  icon?: React.ReactNode;
  color?: string;
  onClick?: () => void;
}

// Dynamic card component to display different value types
const DynamicCard: React.FC<DynamicCardProps> = ({
  title,
  subtitle,
  value,
  type = 'text',
  icon,
  color,
  onClick
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  // Format value based on type
  const formatValue = () => {
    if (value === undefined || value === null) return '-';

    switch (type) {
      case 'status':
        return (
          <Chip
            label={value ? t('common:status.online') : t('common:status.offline')}
            color={value ? 'success' : 'error'}
            size="small"
          />
        );
      case 'boolean':
        return value ? <CheckIcon color="success" /> : <CloseIcon color="error" />;
      case 'progress':
      case 'percentage':
        const percentage = typeof value === 'number' ? value : parseFloat(value);
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">{percentage}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{ height: 6, borderRadius: 1, mt: 1 }}
              color={percentage > 80 ? 'error' : percentage > 60 ? 'warning' : 'success'}
            />
          </Box>
        );
      case 'bytes':
        return formatBytes(typeof value === 'number' ? value : parseFloat(value));
      default:
        return value.toString();
    }
  };

  // Display appropriate icon
  const getIcon = () => {
    if (icon) return icon;

    switch (type) {
      case 'status':
        return value ? <CheckIcon /> : <CloseIcon />;
      case 'progress':
      case 'percentage':
        return <MetricsIcon />;
      case 'bytes':
        return <StorageIcon />;
      case 'boolean':
        return value ? <CheckIcon /> : <CloseIcon />;
      default:
        return <MetricsIcon />;
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        } : {}
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: alpha(color || theme.palette.primary.main, 0.1),
            color: color || theme.palette.primary.main
          }}>
            {getIcon()}
          </Box>
          {onClick && <LaunchIcon fontSize="small" color="action" />}
        </Box>

        <Typography variant="h6" gutterBottom>
          {formatValue()}
        </Typography>

        <Typography color="textSecondary" variant="body2">
          {title}
        </Typography>

        {subtitle && (
          <Typography color="textSecondary" variant="caption">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// Helper functions
const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Check if a status string indicates a positive state (generic function)
const isPositiveStatus = (status: string): boolean => {
  if (!status || typeof status !== 'string') return false;

  const positiveKeywords = ['online', 'active', 'running', 'up', 'connected', 'enabled', 'ok', 'healthy'];
  const statusLower = status.toLowerCase();

  return positiveKeywords.some(keyword => statusLower.includes(keyword));
};

const CustomDeviceDetails: React.FC<CustomDeviceDetailsProps> = ({ device }) => {
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [operationModalOpen, setOperationModalOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<any>(null);
  const [operationParams, setOperationParams] = useState<any>({});
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [modalData, setModalData] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [dataLoading, setDataLoading] = useState(false);

  // Fetch device status
  const { data: status, isLoading: statusLoading, error: statusError } = useQuery({
    queryKey: ['deviceStatus', device.id],
    queryFn: () => api.customDevices.getStatus(device.id),
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch device metrics
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useQuery({
    queryKey: ['deviceMetrics', device.id],
    queryFn: () => api.customDevices.getMetrics(device.id),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch plugin details to get available operations
  const pluginId = device.custom_device?.plugin_id;
  const { data: plugin, isLoading: pluginLoading } = useQuery({
    queryKey: ['plugin', pluginId],
    queryFn: () => (pluginId ? api.plugins.getById(pluginId) : null),
    enabled: !!pluginId,
  });

  // Setup mutation for executing operations
  const operationMutation = useMutation({
    mutationFn: ({ operationId, params }: { operationId: string; params: any }) =>
      api.customDevices.executeOperation(device.id, operationId, params),
    onSuccess: (data, variables) => {
      // Handle textual data that should be displayed in modal
      if (data && (data.logs || data.output || data.result)) {
        const textContent = data.logs || data.output || JSON.stringify(data.result, null, 2);
        setModalData(textContent);
        setModalTitle(t(`devices:operations.${variables.operationId}`, variables.operationId));
        setDataModalOpen(true);
      }

      // Refetch status and metrics after operation
      queryClient.invalidateQueries({ queryKey: ['deviceStatus', device.id] });
      queryClient.invalidateQueries({ queryKey: ['deviceMetrics', device.id] });
    },
  });

  // Extract operations from plugin
  const availableOperations = extractOperations(plugin);

  // Extract key metrics dynamically
  const extractMainMetrics = () => {
    if (!metrics) return [];

    const mainMetrics = [];

    // Find numeric/boolean metrics that might be interesting
    for (const [key, value] of Object.entries(metrics)) {
      // Skip complex objects and arrays
      if (typeof value === 'object' || Array.isArray(value)) continue;

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
        type: metricType
      });

      // Limit to 4 metrics to avoid overwhelming the UI
      if (mainMetrics.length >= 4) break;
    }

    return mainMetrics;
  };

  // Extract system info from status
  const extractSystemInfo = () => {
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

  // Új függvény - Általános művelet végrehajtó
  const handleExecuteGenericAction = (actionId: string, rowData: any = {}) => {
    // Ebben a funkcióban kezeljük az összes táblázaton belüli művelet végrehajtását
    const params = {
      ...device.custom_device?.connection_params,
      ...rowData
    };

    operationMutation.mutate({
      operationId: actionId,
      params
    });
  };

  // Új függvény - Gombokat generál táblázathoz
  const generateTableActions = (tableData: any, tableKey: string) => {
    // Ha van plugin UI schema és van benne műveletek az adott táblázathoz
    if (plugin?.ui_schema?.components?.[tableKey]?.actions) {
      const actions = plugin.ui_schema.components[tableKey].actions;

      return actions.map((action: any) => ({
        title: action.title,
        action: action.action,
        buttonType: action.buttonType || "primary",
        enabledWhen: action.enabledWhen
      }));
    }

    // Egyébként univerzális műveletek, mint pl a frissítés
    return [
      {
        title: t('common:actions.refresh'),
        action: 'refresh',
        buttonType: 'primary'
      }
    ];
  };

  // Általános táblázat renderelő függvény - Ez a legfontosabb új funkció!
  const renderDynamicTable = (key: string, data: any[]) => {
    if (!data || data.length === 0) return null;

    // Táblázat oszlopok generálása az első elemből
    const columns = Object.keys(data[0])
      .filter(colKey => typeof data[0][colKey] !== 'object') // Csak egyszerű típusok
      .map(colKey => ({
        key: colKey,
        title: colKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      }));

    // Lehetséges műveletek a táblázathoz
    const tableActions = generateTableActions(data, key);

    // Táblanév generálása
    const tableName = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    return (
      <Grid item xs={12} key={key}>
        <DashboardCard
          title={tableName}
          icon={<StorageIcon />}
          color="info"
          action={
            <Button
              size="small"
              startIcon={<RefreshIcon />}
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ['deviceMetrics', device.id] });
              }}
            >
              {t('common:actions.refresh')}
            </Button>
          }
        >
          <Box sx={{ p: 2 }}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {columns.map(col => (
                      <TableCell key={col.key}>
                        {col.title}
                      </TableCell>
                    ))}
                    {tableActions.length > 0 && <TableCell>Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {columns.map(col => (
                        <TableCell key={col.key}>
                          {typeof row[col.key] === 'boolean' ?
                            (row[col.key] ? <CheckIcon color="success" /> : <CloseIcon color="error" />) :
                            (col.key === 'status' ?
                              <Chip
                                size="small"
                                label={row[col.key]}
                                color={isPositiveStatus(row[col.key]) ? 'success' : 'default'}
                              /> :
                              row[col.key]
                            )
                          }
                        </TableCell>
                      ))}
                      {tableActions.length > 0 && (
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {tableActions.map((action, actionIndex) => {
                              // Ellenőrizzük, hogy a gomb engedélyezett-e a jelenlegi sorban
                              let isEnabled = true;
                              if (action.enabledWhen) {
                                try {
                                  // Biztonságos értékelés - csak egyszerű feltételekre
                                  isEnabled = eval(action.enabledWhen.replace(/row\./g, 'row["') + '"]');
                                } catch (e) {
                                  console.error('Error evaluating button condition:', e);
                                  isEnabled = false;
                                }
                              }

                              return isEnabled ? (
                                <Button
                                  key={actionIndex}
                                  size="small"
                                  variant="outlined"
                                  color={action.buttonType === 'primary' ? 'primary' :
                                         action.buttonType === 'success' ? 'success' :
                                         action.buttonType === 'warning' ? 'warning' :
                                         action.buttonType === 'error' ? 'error' : 'secondary'}
                                  onClick={() => handleExecuteGenericAction(action.action, row)}
                                >
                                  {action.title}
                                </Button>
                              ) : null;
                            })}
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DashboardCard>
      </Grid>
    );
  };

  // Handle executing operation
  const handleExecuteOperation = () => {
    if (selectedOperation) {
      // Combine connection parameters from device with user-provided parameters
      const params = {
        ...device.custom_device?.connection_params,
        ...operationParams,
      };

      operationMutation.mutate({
        operationId: selectedOperation.id,
        params,
      });

      setOperationModalOpen(false);
    }
  };

  // Handle opening operation modal
  const handleOperationClick = (operation: any) => {
    setSelectedOperation(operation);
    setOperationParams({});
    setOperationModalOpen(true);
  };

  // Loading and error states
  if (statusLoading || metricsLoading || pluginLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  // If any API returns an error
  if (statusError || metricsError) {
    const error = statusError || metricsError;
    return (
      <Box p={3} bgcolor={alpha(theme.palette.error.main, 0.1)} borderRadius={1}>
        <Typography color="error">
          {t('devices:errors.failedToLoadData')}
        </Typography>
        <Typography variant="body2">
          {error instanceof Error ? error.message : t('devices:errors.unknownError')}
        </Typography>
      </Box>
    );
  }

  // If the plugin API response contains an error
  if (status?.error) {
    return (
      <Box p={3} bgcolor={alpha(theme.palette.error.main, 0.1)} borderRadius={1}>
        <Typography color="error">
          {t('devices:errors.pluginError')}
        </Typography>
        <Typography variant="body2">{status.error}</Typography>
      </Box>
    );
  }

  // Main metrics and system info
  const mainMetrics = extractMainMetrics();
  const systemInfo = extractSystemInfo();

  // Identify and collect all arrays that should be rendered as tables
  const tableData = [];
  if (metrics) {
    for (const [key, value] of Object.entries(metrics)) {
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        tableData.push({
          key,
          data: value
        });
      }
    }
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Main metrics */}
        {mainMetrics.length > 0 && (
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {mainMetrics.map((metric, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <DynamicCard
                    title={metric.title}
                    value={metric.value}
                    type={metric.type as ValueDisplayType}
                    icon={metric.icon}
                    color={metric.color}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}

        {/* System Info */}
        {systemInfo.length > 0 && (
          <Grid item xs={12}>
            <DashboardCard
              title={t('devices:cards.systemInfo')}
              icon={<CodeIcon />}
              color="primary"
              action={
                <Button
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={() => {
                    queryClient.invalidateQueries({ queryKey: ['deviceStatus', device.id] });
                  }}
                >
                  {t('common:actions.refresh')}
                </Button>
              }
            >
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  {systemInfo.map((info, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <Box sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                        borderRadius: theme.shape.borderRadius,
                        boxShadow: theme.shadows[1],
                      }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {info.title}
                        </Typography>
                        {info.type === 'status' ? (
                          <Chip
                            label={info.value ? t('common:status.online') : t('common:status.offline')}
                            color={info.value ? 'success' : 'error'}
                            size="small"
                          />
                        ) : info.type === 'boolean' ? (
                          info.value ? <CheckIcon color="success" /> : <CloseIcon color="error" />
                        ) : (
                          <Typography variant="body1">
                            {info.value}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </DashboardCard>
          </Grid>
        )}

        {/* Minden táblázatos adat dinamikus megjelenítése */}
        {tableData.map(table => renderDynamicTable(table.key, table.data))}

        {/* Available Operations */}
        {availableOperations.length > 0 && (
          <Grid item xs={12}>
            <DashboardCard
              title={t('devices:cards.availableOperations')}
              icon={<PlayIcon />}
              color="success"
            >
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  {availableOperations.map((operation) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={operation.id}>
                      <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        onClick={() => handleOperationClick(operation)}
                        sx={{
                          py: 1.5,
                          display: 'flex',
                          flexDirection: 'column',
                          textAlign: 'center',
                          height: '100%',
                        }}
                      >
                        <Typography variant="subtitle1" gutterBottom>
                          {operation.name}
                        </Typography>
                        {operation.description && (
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {operation.description}
                          </Typography>
                        )}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </DashboardCard>
          </Grid>
        )}
      </Grid>

      {/* Operation Modal */}
      <Dialog
        open={operationModalOpen}
        onClose={() => setOperationModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedOperation?.name || t('devices:operations.execute')}
        </DialogTitle>
        <DialogContent>
          {selectedOperation?.description && (
            <Typography variant="body2" color="textSecondary" paragraph>
              {selectedOperation.description}
            </Typography>
          )}
          <Divider sx={{ my: 2 }} />

          {selectedOperation?.params && selectedOperation.params.length > 0 ? (
            <Box sx={{ mt: 2 }}>
              {selectedOperation.params.map((param: string, index: number) => (
                <TextField
                  key={param}
                  id={`param-${index}-${param}`}
                  label={param}
                  fullWidth
                  margin="normal"
                  value={operationParams[param] || ''}
                  onChange={(e) =>
                    setOperationParams({
                      ...operationParams,
                      [param]: e.target.value,
                    })
                  }
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">
              {t('devices:operations.noParameters')}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOperationModalOpen(false)} color="inherit">
            {t('common:actions.cancel')}
          </Button>
          <Button
            onClick={handleExecuteOperation}
            color="primary"
            variant="contained"
            disabled={operationMutation.isPending}
            startIcon={operationMutation.isPending && <CircularProgress size={20} color="inherit" />}
          >
            {t('devices:operations.execute')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Data Modal (logs, output, etc.) */}
      <Dialog
        open={dataModalOpen}
        onClose={() => setDataModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {modalTitle}
          </Typography>
          <Button
            size="small"
            onClick={() => {
              navigator.clipboard.writeText(modalData);
            }}
            startIcon={<CopyIcon />}
          >
            {t('common:actions.copy')}
          </Button>
        </DialogTitle>
        <DialogContent>
          {dataLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Paper
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                p: 2,
                maxHeight: '60vh',
                overflow: 'auto',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                fontSize: '0.85rem',
              }}
            >
              {modalData || t('devices:noDataAvailable')}
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDataModalOpen(false)}>
            {t('common:actions.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Helper function to extract operations from plugin
function extractOperations(plugin: Plugin | undefined) {
  if (!plugin) {
    return [];
  }

  // First check if operations are directly available in the plugin object
  if (plugin.operations && Array.isArray(plugin.operations)) {
    return plugin.operations;
  }

  // Try to extract operations from code
  if (plugin.code) {
    try {
      // Look for get_operations method in the code
      const operationsMatch = plugin.code.match(/get_operations\(\)[\s\S]*?return\s+([\s\S]*?)\n\s*\}/);
      if (operationsMatch && operationsMatch[1]) {
        // This is a basic parser - in a real app, you'd use a proper parser
        const operationsStr = operationsMatch[1]
          .replace(/'/g, '"')
          .replace(/(\w+):/g, '"$1":')
          .replace(/,\s*}/g, '}')  // Fix trailing commas
          .replace(/,\s*]/g, ']'); // Fix trailing commas in arrays

        try {
          return JSON.parse(operationsStr);
        } catch (parseError) {
          console.error('Failed to parse operations string:', parseError);
          return [];
        }
      }
    } catch (e) {
      console.error('Failed to extract operations:', e);
    }
  }

  return [];
}

export default CustomDeviceDetails;