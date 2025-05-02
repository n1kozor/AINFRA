import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import {
  NotificationsActiveOutlined,
  InfoOutlined,
  WarningAmberOutlined,
  CheckCircleOutlineOutlined
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Alert, AlertStatus, Sensor } from '../../types/sensor';
import { formatTimeSince } from '../../utils/sensorUtils';

interface AlertsListProps {
  alerts: Alert[];
  sensors: Sensor[];
  onResolve: (alertId: number) => void;
}

const AlertsList: React.FC<AlertsListProps> = ({ alerts, sensors, onResolve }) => {
  const { t } = useTranslation(['sensors']);
  const theme = useTheme();

  const getAlertStatusDisplay = (status: AlertStatus) => {
    switch (status) {
      case AlertStatus.NEW:
        return { color: theme.palette.info.main, icon: <InfoOutlined /> };
      case AlertStatus.ONGOING:
        return { color: theme.palette.warning.main, icon: <WarningAmberOutlined /> };
      case AlertStatus.RESOLVED:
        return { color: theme.palette.success.main, icon: <CheckCircleOutlineOutlined /> };
      default:
        return { color: theme.palette.grey[500], icon: <InfoOutlined /> };
    }
  };

  return (
    <Card
      elevation={2}
      sx={{
        bgcolor: alpha(theme.palette.warning.main, 0.03),
        borderLeft: `4px solid ${theme.palette.warning.main}`,
        height: '100%'
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <NotificationsActiveOutlined color="warning" />
          <Typography variant="h6">{t('activeAlerts')}</Typography>
        </Stack>

        {alerts.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">{t('noActiveAlerts')}</Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {alerts.map((alert) => {
              const statusDisplay = getAlertStatusDisplay(alert.status);
              const sensor = sensors.find(s => s.id === alert.sensor_id);

              return (
                <Paper
                  key={alert.id}
                  elevation={1}
                  sx={{
                    p: 2,
                    borderLeft: `3px solid ${statusDisplay.color}`,
                    bgcolor: alpha(statusDisplay.color, 0.05)
                  }}
                >
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2">
                        {sensor?.name || `Sensor #${alert.sensor_id}`}
                      </Typography>
                      <Chip
                        icon={statusDisplay.icon}
                        label={alert.status}
                        size="small"
                        sx={{
                          bgcolor: alpha(statusDisplay.color, 0.1),
                          color: statusDisplay.color,
                          fontWeight: 600
                        }}
                      />
                    </Stack>

                    <Typography variant="body2">{alert.message}</Typography>

                    <Divider />

                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" color="textSecondary">
                        {t('value')}: {alert.value}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formatTimeSince(alert.last_checked_at)}
                      </Typography>
                    </Stack>

                    {alert.status !== AlertStatus.RESOLVED && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => onResolve(alert.id)}
                      >
                        {t('resolveAlert')}
                      </Button>
                    )}
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsList;