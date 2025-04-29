// DeviceForm.tsx
import React from 'react';
import {
  Box,
  TextField,
  Grid,
  Typography,
  useTheme,
  alpha,
  Paper,
  Tooltip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  ComputerRounded as ComputerIcon,
  SmartToyRounded as CustomIcon,
  HelpOutlineRounded as HelpIcon,
  InfoOutlined as InfoIcon,
  DevicesRounded as DeviceIcon,
  SubtitlesRounded as DescriptionIcon,
  NetworkCheckRounded as NetworkIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { DeviceCreate, DeviceType } from '../../types/device';
import { motion } from 'framer-motion';

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

  const handleTypeChange = (type: DeviceType) => {
    onChange({ type });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
        {t('devices:enterBasicInfo')}
      </Typography>

      <Grid container spacing={3}>
        {/* Device Information */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              bgcolor: alpha(theme.palette.background.paper, 0.5),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              mb: 3,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                mb: 2,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <DeviceIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              {t('devices:identificationDetails')}
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
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
                      : t('devices:nameHint')
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DeviceIcon sx={{ color: theme.palette.primary.main }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '12px' }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
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
                      : t('devices:ipAddressHint')
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <NetworkIcon sx={{ color: theme.palette.primary.main }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '12px' }
                  }}
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
                  helperText={t('devices:descriptionHint')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon sx={{ color: theme.palette.primary.main }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '12px',
                      alignItems: 'flex-start',
                      '& .MuiInputAdornment-root': {
                        mt: '14px',
                        ml: '3px',
                        mr: '2px'
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Device Type Selection */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              bgcolor: alpha(theme.palette.background.paper, 0.5),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                {t('devices:selectDeviceType')}
              </Typography>
              <Tooltip title={t('devices:deviceTypeDescription')}>
                <IconButton size="small" sx={{ ml: 1, color: alpha(theme.palette.text.primary, 0.6) }}>
                  <HelpIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 3,
            }}>
              {/* Standard Device Option */}
              <Paper
                component={motion.div}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                elevation={0}
                onClick={() => handleTypeChange('standard')}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  bgcolor: deviceData.type === 'standard'
                    ? alpha(theme.palette.primary.main, 0.1)
                    : alpha(theme.palette.background.paper, 0.5),
                  border: `2px solid ${deviceData.type === 'standard'
                    ? theme.palette.primary.main
                    : alpha(theme.palette.divider, 0.1)}`,
                  transition: 'all 0.3s',
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'center', md: 'flex-start' },
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.primary.main, deviceData.type === 'standard' ? 0.2 : 0.1),
                    mb: { xs: 2, md: 0 },
                    mr: { md: 2 },
                    color: theme.palette.primary.main,
                    flexShrink: 0,
                  }}
                >
                  <ComputerIcon sx={{ fontSize: '2rem' }} />
                </Box>

                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography variant="h6" gutterBottom fontWeight={700} sx={{ mb: 1 }}>
                    {t('devices:deviceTypes.standard')}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {t('devices:standardDeviceDescription')}
                  </Typography>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '20px',
                        fontWeight: 600,
                      }}
                    >
                      <InfoIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />
                      {t('devices:supportsSSH')}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Custom Device Option */}
              <Paper
                component={motion.div}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                elevation={0}
                onClick={() => handleTypeChange('custom')}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  bgcolor: deviceData.type === 'custom'
                    ? alpha(theme.palette.secondary.main, 0.1)
                    : alpha(theme.palette.background.paper, 0.5),
                  border: `2px solid ${deviceData.type === 'custom'
                    ? theme.palette.secondary.main
                    : alpha(theme.palette.divider, 0.1)}`,
                  transition: 'all 0.3s',
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'center', md: 'flex-start' },
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.secondary.main, deviceData.type === 'custom' ? 0.2 : 0.1),
                    mb: { xs: 2, md: 0 },
                    mr: { md: 2 },
                    color: theme.palette.secondary.main,
                    flexShrink: 0,
                  }}
                >
                  <CustomIcon sx={{ fontSize: '2rem' }} />
                </Box>

                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography variant="h6" gutterBottom fontWeight={700} sx={{ mb: 1 }}>
                    {t('devices:deviceTypes.custom')}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {t('devices:customDeviceDescription')}
                  </Typography>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        color: theme.palette.warning.main,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '20px',
                        fontWeight: 600,
                      }}
                    >
                      <InfoIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />
                      {t('devices:requiresPlugin')}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeviceForm;