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
  Paper,
  useTheme,
  alpha,
  Typography,
  Tooltip,
  Chip,
  Stack,
  Slider,
  Tab,
  Tabs,
} from '@mui/material';
import {
  VisibilityRounded,
  VisibilityOffRounded,
  ComputerRounded as WindowsIcon,
  AndroidRounded as LinuxIcon,
  SettingsRounded as SettingsIcon,
  SecurityRounded as SecurityIcon,
  InfoOutlined as InfoIcon,
  TuneRounded as TuneIcon,
  VerifiedUserRounded as AuthIcon,
  TerminalRounded as TerminalIcon,
  AccountTreeRounded as AdvancedIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { StandardDeviceCreate, OSType } from '../../types/device';
import { motion } from 'framer-motion';

interface StandardDeviceFormProps {
  standardDeviceData: Partial<StandardDeviceCreate>;
  onChange: (data: Partial<StandardDeviceCreate>) => void;
}

const StandardDeviceForm: React.FC<StandardDeviceFormProps> = ({
  standardDeviceData,
  onChange,
}) => {
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...standardDeviceData, [name]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value as string;
    onChange({ ...standardDeviceData, [name]: value });
  };

  const handleSliderChange = (name: string) => (event: Event, newValue: number | number[]) => {
    onChange({ ...standardDeviceData, [name]: newValue as number });
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const osTypeOptions: { value: OSType; label: string; icon: React.ReactNode; color: string }[] = [
    {
      value: 'linux',
      label: t('devices:osTypes.linux'),
      icon: <LinuxIcon />,
      color: theme.palette.warning.main
    },
    {
      value: 'windows',
      label: t('devices:osTypes.windows'),
      icon: <WindowsIcon />,
      color: theme.palette.info.main
    },
    {
      value: 'macos',
      label: t('devices:osTypes.macos'),
      icon: <WindowsIcon />,
      color: theme.palette.success.main
    },
  ];

  const getOsIcon = () => {
    const os = osTypeOptions.find(o => o.value === standardDeviceData.os_type);
    return os?.icon || <WindowsIcon />;
  };

  const getOsColor = () => {
    const os = osTypeOptions.find(o => o.value === standardDeviceData.os_type);
    return os?.color || theme.palette.primary.main;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            mb: 3,
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              minHeight: '54px',
              borderRadius: '12px 12px 0 0',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
            },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SettingsIcon sx={{ mr: 1 }} />
                {t('devices:tabs.basic')}
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SecurityIcon sx={{ mr: 1 }} />
                {t('devices:tabs.authentication')}
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AdvancedIcon sx={{ mr: 1 }} />
                {t('devices:tabs.advanced')}
              </Box>
            }
          />
        </Tabs>

        {activeTab === 0 && (
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
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                  {t('devices:osSettings')}
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      color: alpha(theme.palette.text.primary, 0.7),
                    }}
                  >
                    {t('devices:osType')}
                    <Tooltip title={t('devices:osTypeDescription')} arrow>
                      <InfoIcon sx={{ ml: 1, fontSize: '1rem', opacity: 0.7 }} />
                    </Tooltip>
                  </Typography>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{ mb: 1 }}
                  >
                    {osTypeOptions.map(option => (
                      <Paper
                        key={option.value}
                        component={motion.div}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        elevation={0}
                        onClick={() => onChange({ ...standardDeviceData, os_type: option.value })}
                        sx={{
                          p: 3,
                          borderRadius: '16px',
                          cursor: 'pointer',
                          bgcolor: standardDeviceData.os_type === option.value
                            ? alpha(option.color, 0.1)
                            : alpha(theme.palette.background.paper, 0.5),
                          border: `2px solid ${standardDeviceData.os_type === option.value
                            ? option.color
                            : alpha(theme.palette.divider, 0.1)}`,
                          transition: 'all 0.3s',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          flex: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: alpha(option.color, standardDeviceData.os_type === option.value ? 0.2 : 0.1),
                            mb: 2,
                            color: option.color,
                          }}
                        >
                          {option.icon}
                        </Box>

                        <Typography variant="subtitle1" fontWeight={600}>
                          {option.label}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </Grid>

              {/* Hostname */}
              <Grid item xs={12} md={6}>
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
                      : t('devices:hostnameHint')
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {getOsIcon()}
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '12px',
                    }
                  }}
                />
              </Grid>

              {/* Port number */}
              <Grid item xs={12} md={6}>
                <TextField
                  name="port"
                  label={t('devices:port')}
                  type="number"
                  value={standardDeviceData.port || 22}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TerminalIcon />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '12px',
                    }
                  }}
                  helperText={t('devices:portHint')}
                />
              </Grid>
            </Grid>
          </Paper>
        )}

        {activeTab === 1 && (
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
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                  {t('devices:authSettings')}
                </Typography>

                <Box
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    bgcolor: alpha(getOsColor(), 0.05),
                    border: `1px solid ${alpha(getOsColor(), 0.1)}`,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  <AuthIcon sx={{ color: getOsColor(), mr: 2 }} />
                  <Typography variant="body2">
                    {t('devices:authDescription')}
                  </Typography>
                </Box>
              </Grid>

              {/* Username */}
              <Grid item xs={12} md={6}>
                <TextField
                  name="username"
                  label={t('devices:username')}
                  value={standardDeviceData.username || ''}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!standardDeviceData.username && standardDeviceData.username !== undefined}
                  helperText={
                    !standardDeviceData.username && standardDeviceData.username !== undefined
                      ? t('common:errors.required')
                      : t('devices:usernameHint')
                  }
                  InputProps={{
                    sx: {
                      borderRadius: '12px',
                    }
                  }}
                />
              </Grid>

              {/* Password */}
              <Grid item xs={12} md={6}>
                <TextField
                  name="password"
                  label={t('devices:password')}
                  type={showPassword ? 'text' : 'password'}
                  value={standardDeviceData.password || ''}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!standardDeviceData.password && standardDeviceData.password !== undefined}
                  helperText={
                    !standardDeviceData.password && standardDeviceData.password !== undefined
                      ? t('common:errors.required')
                      : t('devices:passwordHint')
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handlePasswordToggle}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '12px',
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        )}

        {activeTab === 2 && (
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
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                  {t('devices:advancedSettings')}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('devices:connectionTimeout')} ({standardDeviceData.timeout || 30} {t('devices:seconds')})
                </Typography>
                <Slider
                  value={standardDeviceData.timeout || 30}
                  onChange={handleSliderChange('timeout')}
                  aria-labelledby="timeout-slider"
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={5}
                  max={120}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {t('devices:timeoutDescription')}
                </Typography>
              </Grid>

              {/* Additional settings can go here */}
            </Grid>
          </Paper>
        )}
      </Box>
    </motion.div>
  );
};

export default StandardDeviceForm;