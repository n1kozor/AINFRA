// StandardDeviceForm.tsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Grid,
  InputAdornment,
  IconButton,
  Paper,
  useTheme,
  alpha,
  Typography,
  Tooltip,
  Stack,
  Slider,
  Tab,
  Tabs,
} from '@mui/material';
import {
  VisibilityRounded,
  VisibilityOffRounded,
  Computer as WindowsIcon,
  Android as LinuxIcon,
  Apple as MacIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  InfoOutlined as InfoIcon,
  AccountTree as AdvancedIcon,
  Terminal as TerminalIcon,
  AccountCircle as UserIcon,
  Dns as HostnameIcon,
  Timer as TimeoutIcon,
  Router as PortIcon,
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

  const handleSliderChange = (name: string) => (event: Event, newValue: number | number[]) => {
    onChange({ ...standardDeviceData, [name]: newValue as number });
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // OS Type options with appropriate colors
  const osTypeOptions: { value: OSType; label: string; icon: React.ReactNode; color: string }[] = [
    {
      value: 'linux',
      label: t('devices:osTypes.linux'),
      icon: <LinuxIcon />,
      color: theme.palette.success.main
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
      icon: <MacIcon />,
      color: theme.palette.warning.main
    },
  ];

  // Get color for the selected OS
  const getOsColor = () => {
    const os = osTypeOptions.find(o => o.value === standardDeviceData.os_type);
    return os?.color || theme.palette.primary.main;
  };

  return (
    <Box sx={{ px: { xs: 0, sm: 1, md: 2 } }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
        <TerminalIcon sx={{ mr: 1.5, color: getOsColor() }} />
        {t('devices:configureConnection')}
      </Typography>

      {/* Tabs Navigation */}
      <Box
        sx={{
          background: alpha(theme.palette.background.paper, 0.6),
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          p: 1,
          mb: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px',
              background: `linear-gradient(90deg, ${getOsColor()}, ${alpha(getOsColor(), 0.7)})`,
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              minHeight: '54px',
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
              '&.Mui-selected': {
                color: getOsColor(),
              }
            },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SettingsIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
                {t('devices:tabs.basic')}
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SecurityIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
                {t('devices:tabs.authentication')}
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AdvancedIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
                {t('devices:tabs.advanced')}
              </Box>
            }
          />
        </Tabs>
      </Box>

      {/* Basic Configuration Tab */}
      {activeTab === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '24px',
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              mb: 3,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background decorative elements */}
            <Box
              sx={{
                position: 'absolute',
                top: -30,
                right: -20,
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(getOsColor(), 0.1)}, transparent 70%)`,
                opacity: 0.6,
                zIndex: 0,
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  color: getOsColor(),
                }}
              >
                <Box
                  component="span"
                  sx={{
                    mr: 1,
                    display: 'flex'
                  }}
                >
                  {osTypeOptions.find(o => o.value === standardDeviceData.os_type)?.icon || <WindowsIcon />}
                </Box>
                {t('devices:operatingSystem')}
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {t('devices:selectOs')}
                </Typography>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                >
                  {osTypeOptions.map(option => (
                    <Paper
                      key={option.value}
                      component={motion.div}
                      whileHover={{ y: -5, boxShadow: `0 8px 20px ${alpha(option.color, 0.2)}` }}
                      whileTap={{ scale: 0.98 }}
                      elevation={0}
                      onClick={() => onChange({ ...standardDeviceData, os_type: option.value })}
                      sx={{
                        p: 3,
                        borderRadius: '16px',
                        cursor: 'pointer',
                        bgcolor: standardDeviceData.os_type === option.value
                          ? alpha(option.color, 0.12)
                          : alpha(theme.palette.background.paper, 0.6),
                        border: `2px solid ${standardDeviceData.os_type === option.value
                          ? option.color
                          : alpha(theme.palette.divider, 0.1)}`,
                        transition: 'all 0.3s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        flex: 1,
                        boxShadow: standardDeviceData.os_type === option.value
                          ? `0 6px 16px ${alpha(option.color, 0.2)}`
                          : 'none',
                      }}
                    >
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: standardDeviceData.os_type === option.value
                            ? `linear-gradient(135deg, ${option.color}, ${alpha(option.color, 0.7)})`
                            : alpha(option.color, 0.1),
                          mb: 2,
                          color: standardDeviceData.os_type === option.value ? '#fff' : option.color,
                          boxShadow: standardDeviceData.os_type === option.value
                            ? `0 6px 12px ${alpha(option.color, 0.3)}`
                            : 'none',
                        }}
                      >
                        {React.cloneElement(option.icon as React.ReactElement, {
                          fontSize: 'large'
                        })}
                      </Box>

                      <Typography variant="subtitle1" fontWeight={600} color={standardDeviceData.os_type === option.value ? option.color : 'text.primary'}>
                        {option.label}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              </Box>

              <Grid container spacing={3}>
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
                          <HostnameIcon sx={{ color: getOsColor() }} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: '12px',
                        '&.Mui-focused': {
                          boxShadow: `0 0 0 2px ${alpha(getOsColor(), 0.2)}`
                        }
                      }
                    }}
                  />
                </Grid>

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
                          <PortIcon sx={{ color: getOsColor() }} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: '12px',
                        '&.Mui-focused': {
                          boxShadow: `0 0 0 2px ${alpha(getOsColor(), 0.2)}`
                        }
                      }
                    }}
                    helperText={t('devices:portHint')}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </motion.div>
      )}

      {/* Authentication Tab */}
      {activeTab === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '24px',
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              mb: 3,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background decorative elements */}
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                left: -20,
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(getOsColor(), 0.1)}, transparent 70%)`,
                opacity: 0.6,
                zIndex: 0,
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  color: getOsColor(),
                }}
              >
                <SecurityIcon sx={{ mr: 1 }} />
                {t('devices:authSettings')}
              </Typography>

              <Box
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  bgcolor: alpha(getOsColor(), 0.06),
                  border: `1px solid ${alpha(getOsColor(), 0.12)}`,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'flex-start',
                  boxShadow: `0 4px 12px ${alpha(getOsColor(), 0.08)}`,
                }}
              >
                <InfoIcon sx={{ color: getOsColor(), mr: 2, mt: 0.3 }} />
                <Typography variant="body2">
                  {t('devices:authDescription')}
                </Typography>
              </Box>

              <Grid container spacing={3}>
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
                      startAdornment: (
                        <InputAdornment position="start">
                          <UserIcon sx={{ color: getOsColor() }} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: '12px',
                        '&.Mui-focused': {
                          boxShadow: `0 0 0 2px ${alpha(getOsColor(), 0.2)}`
                        }
                      }
                    }}
                  />
                </Grid>

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
                      startAdornment: (
                        <InputAdornment position="start">
                          <SecurityIcon sx={{ color: getOsColor() }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handlePasswordToggle}
                            edge="end"
                            aria-label="toggle password visibility"
                            sx={{ color: alpha(getOsColor(), 0.8) }}
                          >
                            {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: '12px',
                        '&.Mui-focused': {
                          boxShadow: `0 0 0 2px ${alpha(getOsColor(), 0.2)}`
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </motion.div>
      )}

      {/* Advanced Settings Tab */}
      {activeTab === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '24px',
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              mb: 3,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background decorative pattern */}
            <Box
              sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                opacity: 0.04,
                zIndex: 0,
                width: 120,
                height: 120,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9 0h2v20H9V0zm25.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm-20 20l1.732 1-10 17.32-1.732-1 10-17.32zM58.16 4.134l1 1.732-17.32 10-1-1.732 17.32-10zm-40 40l1 1.732-17.32 10-1-1.732 17.32-10zM80 9v2H60V9h20zM20 69v2H0v-2h20zm79.32-55l-1 1.732-17.32-10L82 4l17.32 10zm-80 80l-1 1.732-17.32-10L2 84l17.32 10zm96.546-75.84l-1.732 1-10-17.32 1.732-1 10 17.32zm-100 100l-1.732 1-10-17.32 1.732-1 10 17.32zM38.16 24.134l1 1.732-17.32 10-1-1.732 17.32-10zM60 29v2H40v-2h20zm19.32 5l-1 1.732-17.32-10L62 24l17.32 10zm16.546 4.16l-1.732 1-10-17.32 1.732-1 10 17.32zM111 40h-2V20h2v20zm3.134.84l1.732 1-10 17.32-1.732-1 10-17.32zM40 49v2H20v-2h20zm19.32 5l-1 1.732-17.32-10L42 44l17.32 10zm16.546 4.16l-1.732 1-10-17.32 1.732-1 10 17.32zM91 60h-2V40h2v20zm3.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm24.026 3.294l1 1.732-17.32 10-1-1.732 17.32-10zM39.32 74l-1 1.732-17.32-10L22 64l17.32 10zm16.546 4.16l-1.732 1-10-17.32 1.732-1 10 17.32zM71 80h-2V60h2v20zm3.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm24.026 3.294l1 1.732-17.32 10-1-1.732 17.32-10zM120 89v2h-20v-2h20zm-84.134 9.16l-1.732 1-10-17.32 1.732-1 10 17.32zM51 100h-2V80h2v20zm3.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm24.026 3.294l1 1.732-17.32 10-1-1.732 17.32-10zM100 109v2H80v-2h20zm19.32 5l-1 1.732-17.32-10 1-1.732 17.32 10zM31 120h-2v-20h2v20z' fill='%23${getOsColor().substring(1)}' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  color: getOsColor(),
                }}
              >
                <AdvancedIcon sx={{ mr: 1 }} />
                {t('devices:advancedSettings')}
              </Typography>

              <Box
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  bgcolor: alpha(theme.palette.info.main, 0.06),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.12)}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  mb: 4,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.info.main, 0.08)}`,
                }}
              >
                <InfoIcon sx={{ color: theme.palette.info.main, mr: 2, mt: 0.3 }} />
                <Typography variant="body2">
                  {t('devices:advancedSettingsDescription')}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimeoutIcon sx={{ mr: 1.5, color: getOsColor() }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  {t('devices:connectionTimeout')} ({standardDeviceData.timeout || 30} {t('devices:seconds')})
                </Typography>
              </Box>

              <Box sx={{ px: 3, mb: 3 }}>
                <Slider
                  value={standardDeviceData.timeout || 30}
                  onChange={handleSliderChange('timeout')}
                  aria-labelledby="timeout-slider"
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={5}
                  max={120}
                  sx={{
                    height: 8,
                    '& .MuiSlider-thumb': {
                      width: 22,
                      height: 22,
                      transition: 'all 0.2s ease',
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: `0 0 0 8px ${alpha(getOsColor(), 0.16)}`
                      },
                      '&:before': {
                        width: 10,
                        height: 10,
                        backgroundColor: alpha('#fff', 0.8),
                      }
                    },
                    '& .MuiSlider-track': {
                      height: 8,
                      background: `linear-gradient(90deg, ${alpha(getOsColor(), 0.7)}, ${getOsColor()})`,
                      border: 'none',
                    },
                    '& .MuiSlider-rail': {
                      height: 8,
                      backgroundColor: alpha(getOsColor(), 0.12),
                      opacity: 1,
                    },
                    '& .MuiSlider-mark': {
                      width: 4,
                      height: 4,
                      backgroundColor: alpha(getOsColor(), 0.3)
                    },
                    '& .MuiSlider-markActive': {
                      backgroundColor: '#fff',
                    },
                    '& .MuiSlider-valueLabel': {
                      backgroundColor: getOsColor(),
                      fontWeight: 600,
                    }
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', ml: 4 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    pl: 1,
                    borderLeft: `3px solid ${alpha(getOsColor(), 0.3)}`,
                    paddingLeft: 2,
                  }}
                >
                  {t('devices:timeoutDescription')}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      )}
    </Box>
  );
};

export default StandardDeviceForm;