import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DeviceCreate, DeviceType } from '../../types/device';

interface DeviceFormProps {
  deviceData: Partial<DeviceCreate>;
  onChange: (data: Partial<DeviceCreate>) => void;
}

const DeviceForm: React.FC<DeviceFormProps> = ({ deviceData, onChange }) => {
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newType = e.target.value as DeviceType;

    // Reset specific device data when changing type
    if (newType === 'standard') {
      onChange({
        type: newType,
        custom_device: undefined,
        standard_device: {
          os_type: 'linux',
          hostname: '',
          username: '',
          password: '',
          port: 22,
        },
      });
    } else {
      onChange({
        type: newType,
        standard_device: undefined,
        custom_device: {
          plugin_id: 0,
          connection_params: {},
        },
      });
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="name"
            label={t('devices:name')}
            value={deviceData.name || ''}
            onChange={handleChange}
            fullWidth
            required
            error={!deviceData.name && deviceData.name !== undefined}
            helperText={
              !deviceData.name && deviceData.name !== undefined
                ? t('common:errors.required')
                : ''
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="ip_address"
            label={t('devices:ipAddress')}
            value={deviceData.ip_address || ''}
            onChange={handleChange}
            fullWidth
            required
            error={!deviceData.ip_address && deviceData.ip_address !== undefined}
            helperText={
              !deviceData.ip_address && deviceData.ip_address !== undefined
                ? t('common:errors.required')
                : ''
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="description"
            label={t('devices:description')}
            value={deviceData.description || ''}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">{t('devices:deviceType')}</FormLabel>
            <RadioGroup
              row
              name="type"
              value={deviceData.type || 'standard'}
              onChange={handleTypeChange}
            >
              <FormControlLabel
                value="standard"
                control={<Radio />}
                label={t('devices:deviceTypes.standard')}
              />
              <FormControlLabel
                value="custom"
                control={<Radio />}
                label={t('devices:deviceTypes.custom')}
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.info.main, 0.1)
            }}
          >
            <Typography variant="subtitle2">
              {deviceData.type === 'standard'
                ? t('devices:info.standardDevice')
                : t('devices:info.customDevice')}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeviceForm;