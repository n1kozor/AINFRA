import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import { EditOutlined, DeleteOutlined, SensorsOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Sensor, AlertLevel } from '../../types/sensor';

interface SensorTableProps {
  sensors: Sensor[];
  loading: boolean;
  onEdit: (sensor: Sensor) => void;
  onDelete: (sensor: Sensor) => void;
  getDeviceName: (deviceId: number) => string;
}

const SensorTable: React.FC<SensorTableProps> = ({
  sensors,
  loading,
  onEdit,
  onDelete,
  getDeviceName
}) => {
  const { t } = useTranslation(['sensors', 'common']);
  const theme = useTheme();

  const getAlertLevelDisplay = (level: AlertLevel) => {
    switch (level) {
      case AlertLevel.INFO:
        return { color: theme.palette.info.main, label: 'Info' };
      case AlertLevel.WARNING:
        return { color: theme.palette.warning.main, label: 'Warning' };
      case AlertLevel.CRITICAL:
        return { color: theme.palette.error.main, label: 'Critical' };
      default:
        return { color: theme.palette.grey[500], label: 'Unknown' };
    }
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <SensorsOutlined color="primary" />
          <Typography variant="h6">{t('sensors:title')}</Typography>
        </Stack>

        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>{t('common:loading')}</Typography>
          </Box>
        ) : sensors.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">{t('sensors:noSensors')}</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('sensors:sensorName')}</TableCell>
                  <TableCell>{t('sensors:device')}</TableCell>
                  <TableCell>{t('sensors:metricKey')}</TableCell>
                  <TableCell>{t('sensors:alertCondition')}</TableCell>
                  <TableCell>{t('sensors:alertLevel')}</TableCell>
                  <TableCell align="center">{t('common:actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sensors.map((sensor) => {
                  const alertLevelDisplay = getAlertLevelDisplay(sensor.alert_level);
                  return (
                    <TableRow key={sensor.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {sensor.name}
                        </Typography>
                        {sensor.description && (
                          <Typography variant="caption" color="textSecondary">
                            {sensor.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{getDeviceName(sensor.device_id)}</TableCell>
                      <TableCell>{sensor.metric_key}</TableCell>
                      <TableCell>{sensor.alert_condition}</TableCell>
                      <TableCell>
                        <Chip
                          label={alertLevelDisplay.label}
                          size="small"
                          sx={{
                            bgcolor: alpha(alertLevelDisplay.color, 0.1),
                            color: alertLevelDisplay.color,
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title={t('common:edit')}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => onEdit(sensor)}
                            >
                              <EditOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('common:delete')}>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => onDelete(sensor)}
                            >
                              <DeleteOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default SensorTable;