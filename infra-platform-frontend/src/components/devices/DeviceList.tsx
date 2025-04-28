import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  Badge,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  AddRounded as AddIcon,
  SearchRounded as SearchIcon,
  FilterListRounded as FilterIcon,
  ComputerRounded as StandardIcon,
  SmartToyRounded as CustomIcon,
  SettingsRounded as SettingsIcon,
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

type SortOption = 'name' | 'created_at' | 'type' | 'status';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

const DeviceList: React.FC<DeviceListProps> = ({ devices, isLoading, type, onRefresh }) => {
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeTab, setActiveTab] = useState<number>(0);

  // Filter devices based on search query, status, and type
  const filteredDevices = devices.filter((device) => {
    // Filter by type if specified
    if (type && device.type !== type) {
      return false;
    }

    // Filter by tab selection (All/Standard/Custom)
    if (activeTab === 1 && device.type !== 'standard') return false;
    if (activeTab === 2 && device.type !== 'custom') return false;

    // Filter by search query
    if (
      searchQuery &&
      !device.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !device.description?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !device.ip_address.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by status
    if (statusFilter === 'active' && !device.is_active) {
      return false;
    }

    if (statusFilter === 'inactive' && device.is_active) {
      return false;
    }

    return true;
  });

  // Sort filtered devices
  const sortedDevices = [...filteredDevices].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'status':
        comparison = (a.is_active === b.is_active) ? 0 : a.is_active ? -1 : 1;
        break;
      default:
        comparison = 0;
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
    setStatusFilter('all');
    setSortBy('name');
    setSortDirection('asc');
    setAdvancedFiltersOpen(false);
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || sortBy !== 'name' || sortDirection !== 'asc';

  // Count of each device type
  const standardCount = devices.filter(d => d.type === 'standard').length;
  const customCount = devices.filter(d => d.type === 'custom').length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box>
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
          }}
        >
          <Box>


          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              width: { xs: '100%', md: 'auto' },
              alignItems: { xs: 'stretch', sm: 'center' },
            }}
          >
            {/* Refresh button */}
            {onRefresh && (
              <Tooltip title={t('common:actions.refresh')} arrow>
                <IconButton
                  onClick={onRefresh}
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: '12px',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                    },
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            )}

            {/* Toggle view mode */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: alpha(theme.palette.background.paper, 0.5),
                borderRadius: '12px',
                p: 0.5,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <IconButton
                size="small"
                onClick={() => setViewMode('grid')}
                sx={{
                  borderRadius: '10px',
                  bgcolor: viewMode === 'grid' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  color: viewMode === 'grid' ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.5),
                  '&:hover': {
                    bgcolor: viewMode === 'grid'
                      ? alpha(theme.palette.primary.main, 0.15)
                      : alpha(theme.palette.action.hover, 0.1),
                  },
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
                  '&:hover': {
                    bgcolor: viewMode === 'list'
                      ? alpha(theme.palette.primary.main, 0.15)
                      : alpha(theme.palette.action.hover, 0.1),
                  },
                }}
              >
                <ListViewIcon fontSize="small" />
              </IconButton>
            </Box>

            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/devices/new"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: '12px',
                px: 3,
                py: 1.2,
                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                '&:hover': {
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s',
              }}
            >
              {t('devices:addDevice')}
            </Button>
          </Box>
        </Box>



        {/* Filters */}
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              width: '100%',
              alignItems: { xs: 'stretch', sm: 'center' },
            }}
          >
            <TextField
              placeholder={t('common:actions.search')}
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery('')}
                      edge="end"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
                sx: {
                  borderRadius: '12px',
                  '&.MuiOutlinedInput-root': {
                    bgcolor: alpha(theme.palette.background.paper, 0.8),
                  }
                }
              }}
              fullWidth
              sx={{ flex: 1 }}
            />

            <TextField
              select
              label={t('devices:statusFilter')}
              variant="outlined"
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: '12px',
                  minWidth: '160px',
                  '&.MuiOutlinedInput-root': {
                    bgcolor: alpha(theme.palette.background.paper, 0.8),
                  }
                }
              }}
            >
              <MenuItem value="all">{t('devices:statusOptions.all')}</MenuItem>
              <MenuItem value="active">{t('devices:statusOptions.active')}</MenuItem>
              <MenuItem value="inactive">{t('devices:statusOptions.inactive')}</MenuItem>
            </TextField>

            <Button
              variant={hasActiveFilters ? "contained" : "outlined"}
              color={hasActiveFilters ? "error" : "primary"}
              onClick={hasActiveFilters ? clearFilters : () => setAdvancedFiltersOpen(!advancedFiltersOpen)}
              startIcon={hasActiveFilters ? <ClearIcon /> : <TuneIcon />}
              sx={{
                borderRadius: '12px',
                whiteSpace: 'nowrap',
                minWidth: { xs: 'auto', sm: '140px' },
                boxShadow: hasActiveFilters ? `0 4px 14px ${alpha(theme.palette.error.main, 0.3)}` : 'none',
                transition: 'all 0.3s',
              }}
            >
              {hasActiveFilters
                ? t('devices:clearFilters')
                : t('devices:advancedFilters')}
            </Button>
          </Box>

          <Collapse in={advancedFiltersOpen}>
            <Divider sx={{ my: 2, opacity: 0.2 }} />

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                flexWrap: 'wrap',
                gap: 2,
                pt: 1,
              }}
            >
              <Typography variant="subtitle2" sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                <SortIcon fontSize="small" sx={{ mr: 0.5 }} />
                {t('devices:sortBy')}:
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  label={t('devices:sortOptions.name')}
                  clickable
                  variant={sortBy === 'name' ? 'filled' : 'outlined'}
                  color={sortBy === 'name' ? 'primary' : 'default'}
                  onClick={() => toggleSort('name')}
                  icon={sortBy === 'name' && (sortDirection === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                  sx={{ borderRadius: '10px' }}
                />
                <Chip
                  label={t('devices:sortOptions.created')}
                  clickable
                  variant={sortBy === 'created_at' ? 'filled' : 'outlined'}
                  color={sortBy === 'created_at' ? 'primary' : 'default'}
                  onClick={() => toggleSort('created_at')}
                  icon={sortBy === 'created_at' && (sortDirection === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                  sx={{ borderRadius: '10px' }}
                />
                <Chip
                  label={t('devices:sortOptions.type')}
                  clickable
                  variant={sortBy === 'type' ? 'filled' : 'outlined'}
                  color={sortBy === 'type' ? 'primary' : 'default'}
                  onClick={() => toggleSort('type')}
                  icon={sortBy === 'type' && (sortDirection === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                  sx={{ borderRadius: '10px' }}
                />
                <Chip
                  label={t('devices:sortOptions.status')}
                  clickable
                  variant={sortBy === 'status' ? 'filled' : 'outlined'}
                  color={sortBy === 'status' ? 'primary' : 'default'}
                  onClick={() => toggleSort('status')}
                  icon={sortBy === 'status' && (sortDirection === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                  sx={{ borderRadius: '10px' }}
                />
              </Box>
            </Box>
          </Collapse>
        </Paper>



        {/* Results */}
        <AnimatePresence>
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 10
              }}
            >
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
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 3,
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                  }}
                >
                  <WarningIcon fontSize="large" />
                </Avatar>

                <Typography variant="h5" gutterBottom fontWeight={700}>
                  {t('devices:noDevicesFound')}
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  paragraph
                  sx={{ maxWidth: '500px', mx: 'auto', mb: 3 }}
                >
                  {hasActiveFilters
                    ? t('devices:tryDifferentFilters')
                    : t('devices:noDevicesYet')}
                </Typography>

                {hasActiveFilters ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={clearFilters}
                    startIcon={<ClearIcon />}
                    sx={{
                      borderRadius: '12px',
                      px: 3,
                      py: 1.2,
                      fontWeight: 600,
                    }}
                  >
                    {t('devices:clearFilters')}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    component={Link}
                    to="/devices/new"
                    startIcon={<AddIcon />}
                    sx={{
                      borderRadius: '12px',
                      px: 3,
                      py: 1.2,
                      fontWeight: 600,
                      boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      '&:hover': {
                        boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {t('devices:addFirstDevice')}
                  </Button>
                )}
              </Paper>
            </motion.div>
          ) : (
            <Grid container spacing={3}>
              {sortedDevices.map((device) => (
                <Grid
                  item
                  xs={12}
                  sm={viewMode === 'list' ? 12 : 6}
                  md={viewMode === 'list' ? 12 : 4}
                  lg={viewMode === 'list' ? 12 : 3}
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