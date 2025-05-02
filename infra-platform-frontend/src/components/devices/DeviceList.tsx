import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Chip,
  useTheme,
  Tooltip,
  alpha,
  Paper,
  Avatar,
  IconButton,
  Collapse,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  SearchRounded as SearchIcon,
  TuneRounded as TuneIcon,
  RefreshRounded as RefreshIcon,
  ArrowUpwardRounded as ArrowUpIcon,
  ArrowDownwardRounded as ArrowDownIcon,
  SortRounded as SortIcon,
  ClearRounded as ClearIcon,
  ErrorOutlineRounded as WarningIcon,
  ViewListRounded as ListViewIcon,
  ViewModuleRounded as GridViewIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Device, DeviceType } from '../../types/device';
import DeviceCard from './DeviceCard';
import { motion, AnimatePresence } from 'framer-motion';

interface DeviceListProps {
  devices: Device[];
  isLoading: boolean;
  type?: DeviceType;
  onRefresh?: () => void;
}

type SortOption = 'name' | 'created_at' | 'type';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

const DeviceList: React.FC<DeviceListProps> = ({ devices, isLoading, type, onRefresh }) => {
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [deviceTypeFilter, setDeviceTypeFilter] = useState('all');
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeTab] = useState<number>(0);

  const filteredDevices = devices.filter((device) => {
    if (type && device.type !== type) return false;
    if (activeTab === 1 && device.type !== 'standard') return false;
    if (activeTab === 2 && device.type !== 'custom') return false;

    if (searchQuery &&
        !device.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !device.description?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !device.ip_address.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if ((deviceTypeFilter === 'standard' && device.type !== 'standard') ||
        (deviceTypeFilter === 'custom' && device.type !== 'custom')) {
      return false;
    }

    return true;
  });

  const sortedDevices = [...filteredDevices].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name': comparison = a.name.localeCompare(b.name); break;
      case 'created_at': comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime(); break;
      case 'type': comparison = a.type.localeCompare(b.type); break;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDeviceTypeFilter('all');
    setSortBy('name');
    setSortDirection('asc');
    setAdvancedFiltersOpen(false);
  };

  const hasActiveFilters = searchQuery || deviceTypeFilter !== 'all' || sortBy !== 'name' || sortDirection !== 'asc';

  return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <Box>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {onRefresh && (
                  <Tooltip title={t('common:actions.refresh')} arrow>
                    <IconButton
                        onClick={onRefresh}
                        sx={{
                          borderRadius: '12px',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) },
                        }}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
              )}

              <Box sx={{ display: 'flex', bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: '12px', p: 0.5 }}>
                <IconButton
                    size="small"
                    onClick={() => setViewMode('grid')}
                    sx={{
                      borderRadius: '10px',
                      bgcolor: viewMode === 'grid' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                      color: viewMode === 'grid' ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.5),
                    }}
                >
                  <GridViewIcon fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    onClick={() => setViewMode('list')}
                    sx={{
                      borderRadius: '10px',
                      bgcolor: viewMode === 'list' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                      color: viewMode === 'list' ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.5),
                    }}
                >
                  <ListViewIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>

          <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                borderRadius: '20px',
                bgcolor: alpha(theme.palette.background.paper, 0.7),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
          >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
              <TextField
                  placeholder={t('common:actions.search')}
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
                    endAdornment: searchQuery ? (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setSearchQuery('')}><ClearIcon fontSize="small" /></IconButton>
                        </InputAdornment>
                    ) : null,
                    sx: { borderRadius: '12px' }
                  }}
                  fullWidth
                  sx={{ flex: 1 }}
              />

              <TextField
                  select
                  label={t('devices:typeFilter')}
                  variant="outlined"
                  size="small"
                  value={deviceTypeFilter}
                  onChange={(e) => setDeviceTypeFilter(e.target.value)}
                  InputProps={{ sx: { borderRadius: '12px', minWidth: '160px' } }}
              >
                <MenuItem value="all">{t('devices:typeOptions.all')}</MenuItem>
                <MenuItem value="standard">{t('devices:typeOptions.standard')}</MenuItem>
                <MenuItem value="custom">{t('devices:typeOptions.custom')}</MenuItem>
              </TextField>

              <Button
                  variant={hasActiveFilters ? "contained" : "outlined"}
                  color={hasActiveFilters ? "error" : "primary"}
                  onClick={hasActiveFilters ? clearFilters : () => setAdvancedFiltersOpen(!advancedFiltersOpen)}
                  startIcon={hasActiveFilters ? <ClearIcon /> : <TuneIcon />}
                  sx={{ borderRadius: '12px', whiteSpace: 'nowrap' }}
              >
                {hasActiveFilters ? t('devices:clearFilters') : t('devices:advancedFilters')}
              </Button>
            </Box>

            <Collapse in={advancedFiltersOpen}>
              <Divider sx={{ my: 2, opacity: 0.2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <SortIcon fontSize="small" sx={{ mr: 0.5 }} />{t('devices:sortBy')}:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['name', 'created_at', 'type'].map((option) => (
                      <Chip
                          key={option}
                          label={t(`devices:sortOptions.${option === 'created_at' ? 'created' : option}`)}
                          clickable
                          variant={sortBy === option ? 'filled' : 'outlined'}
                          color={sortBy === option ? 'primary' : 'default'}
                          onClick={() => toggleSort(option as SortOption)}
                          icon={sortBy === option ? (sortDirection === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />) : undefined}
                          sx={{ borderRadius: '10px' }}
                      />
                  ))}
                </Box>
              </Box>
            </Collapse>
          </Paper>

          <AnimatePresence>
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
                  <CircularProgress size={40} thickness={4} />
                </Box>
            ) : filteredDevices.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                >
                  <Paper
                      elevation={0}
                      sx={{
                        p: 5,
                        textAlign: 'center',
                        borderRadius: '24px',
                        bgcolor: alpha(theme.palette.background.paper, 0.7),
                        backdropFilter: 'blur(20px)',
                      }}
                  >
                    <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 3, bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main }}>
                      <WarningIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h5" gutterBottom fontWeight={700}>{t('devices:noDevicesFound')}</Typography>
                    <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: '500px', mx: 'auto', mb: 3 }}>
                      {hasActiveFilters ? t('devices:tryDifferentFilters') : t('devices:noDevicesYet')}
                    </Typography>
                    {hasActiveFilters ? (
                        <Button variant="outlined" color="primary" onClick={clearFilters} startIcon={<ClearIcon />}>
                          {t('devices:clearFilters')}
                        </Button>
                    ) : (
                        <Button variant="contained" component={Link} to="/devices/new" sx={{ borderRadius: '12px', fontWeight: 600 }}>
                          {t('devices:addFirstDevice')}
                        </Button>
                    )}
                  </Paper>
                </motion.div>
            ) : (
                <Grid container spacing={3}>
                  {sortedDevices.map((device) => (
                      <Grid
                          size={{
                            xs: 12,
                            sm: viewMode === 'list' ? 12 : 6,
                            md: viewMode === 'list' ? 12 : 4,
                            lg: viewMode === 'list' ? 12 : 3,
                          }}
                          key={device.id}
                      >
                        <DeviceCard device={device} />
                      </Grid>

                  ))}
                </Grid>
            )}
          </AnimatePresence>
        </Box>
      </motion.div>
  );
};

export default DeviceList;