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
  Paper,
  Divider,
  Tooltip,
  IconButton,
  Zoom,
} from '@mui/material';
import {
  ComputerRounded as ComputerIcon,
  SmartToyRounded as SmartToyIcon,
  HelpOutlineRounded as HelpIcon,
  InfoOutlined as InfoIcon,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '24px',
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          mb: 4,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {t('devices:basicInfo')}
          <Tooltip
            title={t('devices:basicInfoDescription')}
            arrow
            TransitionComponent={Zoom}
          >
            <IconButton size="small" sx={{ ml: 1, color: alpha(theme.palette.text.primary, 0.6) }}>
              <HelpIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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
                sx: {
                  borderRadius: '12px',
                }
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
                sx: {
                  borderRadius: '12px',
                }
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
                sx: {
                  borderRadius: '12px',
                }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '24px',
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {t('devices:deviceType')}
          <Tooltip
            title={t('devices:deviceTypeDescription')}
            arrow
            TransitionComponent={Zoom}
          >
            <IconButton size="small" sx={{ ml: 1, color: alpha(theme.palette.text.primary, 0.6) }}>
              <HelpIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Paper
                component={motion.div}
                whileHover={{ y: -5, boxShadow: theme.shadows[8] }}
                whileTap={{ scale: 0.98 }}
                elevation={0}
                onClick={() => onChange({ type: 'standard' })}
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
                  flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' },
                  transition: 'all 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.primary.main, deviceData.type === 'standard' ? 0.2 : 0.1),
                    mb: 2,
                    color: theme.palette.primary.main,
                  }}
                >
                  <ComputerIcon sx={{ fontSize: '2.5rem' }} />
                </Box>

                <Typography variant="h6" gutterBottom fontWeight={700}>
                  {t('devices:deviceTypes.standard')}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {t('devices:standardDeviceDescription')}
                </Typography>

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
                    fontSize: '0.7rem',
                  }}
                >
                  <InfoIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />
                  {t('devices:supportsSSH')}
                </Typography>
              </Paper>

              <Paper
                component={motion.div}
                whileHover={{ y: -5, boxShadow: theme.shadows[8] }}
                whileTap={{ scale: 0.98 }}
                elevation={0}
                onClick={() => onChange({ type: 'custom' })}
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
                  flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' },
                  transition: 'all 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.secondary.main, deviceData.type === 'custom' ? 0.2 : 0.1),
                    mb: 2,
                    color: theme.palette.secondary.main,
                  }}
                >
                  <SmartToyIcon sx={{ fontSize: '2.5rem' }} />
                </Box>

                <Typography variant="h6" gutterBottom fontWeight={700}>
                  {t('devices:deviceTypes.custom')}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {t('devices:customDeviceDescription')}
                </Typography>

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
                    fontSize: '0.7rem',
                  }}
                >
                  <InfoIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />
                  {t('devices:requiresPlugin')}
                </Typography>
              </Paper>
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ mt: 1 }}>
            <Box
              sx={{
                p: 3,
                borderRadius: '16px',
                bgcolor: alpha(
                  deviceData.type === 'standard'
                    ? theme.palette.primary.main
                    : theme.palette.secondary.main,
                  0.05
                ),
                border: `1px solid ${alpha(
                  deviceData.type === 'standard'
                    ? theme.palette.primary.main
                    : theme.palette.secondary.main,
                  0.1
                )}`,
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              <InfoIcon
                sx={{
                  color: deviceData.type === 'standard'
                    ? theme.palette.primary.main
                    : theme.palette.secondary.main,
                  fontSize: '1.5rem',
                  mr: 2,
                  mt: 0.5,
                }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                  {deviceData.type === 'standard'
                    ? t('devices:info.standardDeviceTitle')
                    : t('devices:info.customDeviceTitle')}
                </Typography>
                <Typography variant="body2">
                  {deviceData.type === 'standard'
                    ? t('devices:info.standardDevice')
                    : t('devices:info.customDevice')}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </motion.div>
  );
};

export default DeviceForm;