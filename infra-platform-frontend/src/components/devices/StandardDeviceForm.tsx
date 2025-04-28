import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { StandardDeviceCreate, OSType } from '../../types/device';

interface StandardDeviceFormProps {
  standardDeviceData: Partial<StandardDeviceCreate>;
  onChange: (data: Partial<StandardDeviceCreate>) => void;
}

const StandardDeviceForm: React.FC<StandardDeviceFormProps> = ({
  standardDeviceData,
  onChange,
}) => {
  const { t } = useTranslation(['devices', 'common']);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...standardDeviceData, [name]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value as string;
    onChange({ ...standardDeviceData, [name]: value });
  };



  const osTypeOptions: { value: OSType; label: string }[] = [
    { value: 'linux', label: t('devices:osTypes.linux') },
    { value: 'windows', label: t('devices:osTypes.windows') },
    { value: 'macos', label: t('devices:osTypes.macos') },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel id="os-type-label">
              {t('devices:osType')}
            </InputLabel>
            <Select
              labelId="os-type-label"
              name="os_type"
              value={standardDeviceData.os_type || ''}
              onChange={handleSelectChange}
              label={t('devices:osType')}
              error={!standardDeviceData.os_type}
            >
              {osTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {!standardDeviceData.os_type && (
              <FormHelperText error>{t('common:errors.required')}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="hostname"
            label={t('devices:hostname')}
            value={standardDeviceData.hostname || ''}
            onChange={handleChange}
            fullWidth
            required
            error={!standardDeviceData.hostname && standardDeviceData.hostname !== undefined}
            helperText={
              !standardDeviceData.hostname && standardDeviceData.hostname !== undefined
                ? t('common:errors.required')
                : ''
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StandardDeviceForm;