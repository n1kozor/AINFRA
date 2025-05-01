// src/components/sensorpage/SensorFilter.tsx
import React from 'react';
import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material';
import { FilterAltOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Device } from '../../types/device';

interface SensorFilterProps {
  devices: Device[];
  selectedDeviceId: number | null;
  onDeviceChange: (deviceId: number | null) => void;
}

const SensorFilter: React.FC<SensorFilterProps> = ({
  devices,
  selectedDeviceId,
  onDeviceChange
}) => {
  const { t } = useTranslation(['sensors']);

  return (
    <Card elevation={2}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <FilterAltOutlined color="primary" />
          <Typography variant="h6">{t('deviceFilter')}</Typography>
        </Stack>
        <FormControl fullWidth>
          <InputLabel id="device-filter-label">{t('device')}</InputLabel>
          <Select
            labelId="device-filter-label"
            value={selectedDeviceId || ''}
            label={t('device')}
            onChange={(e) => onDeviceChange(e.target.value ? Number(e.target.value) : null)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">{t('allDevices')}</MenuItem>
            {devices.map((device) => (
              <MenuItem key={device.id} value={device.id}>
                {device.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  );
};

export default SensorFilter;