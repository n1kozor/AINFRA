import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api';
import PageContainer from '../../components/common/PageContainer';
import DeviceCard from '../../components/devices/DeviceCard';
import StandardDeviceModal from '../../components/devices/StandardDeviceModal';
import CustomDeviceModal from '../../components/devices/CustomDeviceModal';
import {
  Box,
  Typography,
  CircularProgress,
  alpha,
  useTheme,
  Button,
  Chip,
  Paper,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Drawer,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField,
  Avatar,
  InputAdornment,
  Select,
  OutlinedInput,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  LinearProgress,
  Card,
  CardContent,
  Badge
} from '@mui/material';
import {
  DevicesRounded as DevicesIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Computer as StandardDeviceIcon,
  SmartToy as CustomDeviceIcon,
  FilterAlt as FilterIcon,
  Search as SearchIcon,
  ClearAll as ClearIcon,
  Add as AddIcon,
  ViewModule as GridIcon,
  SettingsRemote as RemoteIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  SortByAlpha as SortIcon,
  CheckCircleRounded as OnlineIcon,
  ErrorRounded as OfflineIcon,
  Close as CloseIcon,
  Tune as TuneIcon,
  LaptopMacRounded as MacOSIcon,
  LaptopWindowsRounded as WindowsIcon,
  LaptopRounded as LinuxIcon,
  Sort as SortByIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Device, DeviceType, OSType } from '../../types/device';

// View modes
type ViewMode = 'grid' | 'compact';
type SortField = 'name' | 'created_at' | 'type' | 'status';
type SortDirection = 'asc' | 'desc';
type AvailabilityFilter = 'all' | 'online' | 'offline';

const DevicesPage = () => {
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();

  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | DeviceType>('all');
  const [osFilter, setOsFilter] = useState<'all' | OSType>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Modals
  const [standardModalOpen, setStandardModalOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [addMenuAnchorEl, setAddMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [sortMenuAnchorEl, setSortMenuAnchorEl] = useState<null | HTMLElement>(null);

  // Data fetching
  const {
    data: devices,
    isLoading,
    error,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['devices'],
    queryFn: api.devices.getAll,
    refetchOnWindowFocus: false,
  });

  // Device statistics
  const deviceStats = useMemo(() => {
    if (!devices) return null;

    const totalCount = devices.length;
    const standardCount = devices.filter(d => d.type === 'standard').length;
    const customCount = devices.filter(d => d.type === 'custom').length;

    // Calculate online/offline stats using the device card availability data
    // Note: In a real app, you would get this data from your API
    const onlineCount = devices.filter(d => {
      // This is just a placeholder - in your real app, use the actual availability data
      const randomIsOnline = Math.random() > 0.3; // Just for demo
      return randomIsOnline;
    }).length;

    const offlineCount = totalCount - onlineCount;

    return {
      totalCount,
      standardCount,
      customCount,
      onlineCount,
      offlineCount,
      onlinePercentage: totalCount > 0 ? (onlineCount / totalCount) * 100 : 0,
    };
  }, [devices]);

  // Filtered and sorted devices
  const filteredDevices = useMemo(() => {
    if (!devices) return [];

    return devices.filter(device => {
      // Type filter
      if (typeFilter !== 'all' && device.type !== typeFilter) return false;

      // OS filter (only for standard devices)
      if (osFilter !== 'all' && device.type === 'standard') {
        if (!device.standard_device || device.standard_device.os_type !== osFilter) {
          return false;
        }
      }

      // Availability filter
      // Note: In a real app, you'd use the actual availability data from API
      if (availabilityFilter !== 'all') {
        // This is just a placeholder for demo
        const randomIsOnline = Math.random() > 0.3;
        if (availabilityFilter === 'online' && !randomIsOnline) return false;
        if (availabilityFilter === 'offline' && randomIsOnline) return false;
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = device.name.toLowerCase().includes(query);
        const matchesDescription = device.description?.toLowerCase().includes(query) || false;
        const matchesIP = device.ip_address.toLowerCase().includes(query);

        if (!matchesName && !matchesDescription && !matchesIP) return false;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;

      // Sort by field
      switch (sortField) {
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
          // Placeholder for demo - in real app use actual availability
          const aIsOnline = Math.random() > 0.3;
          const bIsOnline = Math.random() > 0.3;
          comparison = (aIsOnline === bIsOnline) ? 0 : aIsOnline ? -1 : 1;
          break;
      }

      // Apply sort direction
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [devices, typeFilter, osFilter, availabilityFilter, searchQuery, sortField, sortDirection]);

  // Event handlers
  const handleViewModeChange = (_event: React.MouseEvent<HTMLElement>, newMode: ViewMode | null) => {
    if (newMode) setViewMode(newMode);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortMenuAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortMenuAnchorEl(null);
  };

  const handleSortSelect = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    handleSortMenuClose();
  };

  const handleAddClick = (event: React.MouseEvent<HTMLElement>) => {
    setAddMenuAnchorEl(event.currentTarget);
  };

  const handleAddMenuClose = () => {
    setAddMenuAnchorEl(null);
  };

  const handleAddStandardDevice = () => {
    setStandardModalOpen(true);
    handleAddMenuClose();
  };

  const handleAddCustomDevice = () => {
    setCustomModalOpen(true);
    handleAddMenuClose();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setAvailabilityFilter('all');
    setTypeFilter('all');
    setOsFilter('all');
    setSortField('name');
    setSortDirection('asc');
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return searchQuery !== '' || availabilityFilter !== 'all' || typeFilter !== 'all' ||
           osFilter !== 'all' || sortField !== 'name' || sortDirection !== 'asc';
  }, [searchQuery, availabilityFilter, typeFilter, osFilter, sortField, sortDirection]);

  // If there's an error loading devices
  if (error) {
    return (
      <PageContainer
        title={t('devices:allDevices')}
        breadcrumbs={[
          { text: t('common:navigation.dashboard'), link: '/' },
          { text: t('common:navigation.devices') },
        ]}
        icon={<DevicesIcon />}
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
          <Box sx={{ mb: 3 }}>
            <Typography color="error" variant="h5" fontWeight={700} gutterBottom>
              {t('devices:errorFetchingDevices')}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {t('devices:errorFetchDescription')}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => refetch()}
              startIcon={<RefreshIcon />}
              sx={{ borderRadius: '12px', fontWeight: 600 }}
            >
              {t('common:actions.retry')}
            </Button>
          </Box>
        </Paper>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={t('devices:allDevices')}
      subtitle={
        deviceStats
          ? t('devices:deviceCount', { count: deviceStats.totalCount })
          : t('devices:loadingDevices')
      }
      breadcrumbs={[
        { text: t('common:navigation.dashboard'), link: '/' },
        { text: t('common:navigation.devices') },
      ]}
      icon={<DevicesIcon />}
    >
      {isRefetching && (
        <Box sx={{ width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 9999 }}>
          <LinearProgress color="primary" />
        </Box>
      )}

      {/* Main content container */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Sidebar drawer for mobile */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer}
          PaperProps={{
            sx: {
              width: '85%',
              maxWidth: 350,
              borderRadius: '0 24px 24px 0',
              p: 3
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>{t('devices:filters')}</Typography>
            <IconButton onClick={toggleDrawer} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <FiltersContent
            availabilityFilter={availabilityFilter}
            setAvailabilityFilter={setAvailabilityFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            osFilter={osFilter}
            setOsFilter={setOsFilter}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        </Drawer>

        {/* Permanent sidebar for desktop */}
        <Box
          sx={{
            width: 280,
            flexShrink: 0,
            display: { xs: 'none', md: 'block' }
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '20px',
              bgcolor: alpha(theme.palette.background.paper, 0.6),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              position: 'sticky',
              top: 24,
            }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
              {t('devices:filters')}
            </Typography>

            <FiltersContent
              availabilityFilter={availabilityFilter}
              setAvailabilityFilter={setAvailabilityFilter}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              osFilter={osFilter}
              setOsFilter={setOsFilter}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={handleClearFilters}
            />
          </Paper>
        </Box>

        {/* Main content */}
        <Box sx={{ flexGrow: 1 }}>
          {/* Status summary cards */}
          <AnimatePresence>
            {deviceStats && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  {/* All Devices card */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: '16px',
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Badge
                        badgeContent={deviceStats.totalCount}
                        color="primary"
                        max={999}
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            px: 1,
                            borderRadius: '8px',
                          }
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                            color: theme.palette.primary.main,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <DevicesIcon />
                        </Avatar>
                      </Badge>

                      <Box sx={{ ml: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('devices:allDevices')}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="h6" fontWeight={700}>
                            {deviceStats.totalCount}
                          </Typography>
                          <Chip
                            size="small"
                            label={`${deviceStats.onlineCount} ${t('devices:online')}`}
                            sx={{
                              borderRadius: '8px',
                              bgcolor: alpha(theme.palette.success.main, 0.1),
                              color: theme.palette.success.main,
                              fontSize: '0.7rem',
                              height: 20,
                            }}
                          />
                        </Stack>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Standard Devices card */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: '16px',
                        bgcolor: alpha(theme.palette.info.main, 0.08),
                        border: `1px solid ${alpha(theme.palette.info.main, 0.12)}`,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Badge
                        badgeContent={deviceStats.standardCount}
                        color="info"
                        max={999}
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            px: 1,
                            borderRadius: '8px',
                          }
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.info.main, 0.2),
                            color: theme.palette.info.main,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <StandardDeviceIcon />
                        </Avatar>
                      </Badge>

                      <Box sx={{ ml: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('devices:standardDevices')}
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {deviceStats.standardCount}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Custom Devices card */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: '16px',
                        bgcolor: alpha(theme.palette.secondary.main, 0.08),
                        border: `1px solid ${alpha(theme.palette.secondary.main, 0.12)}`,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Badge
                        badgeContent={deviceStats.customCount}
                        color="secondary"
                        max={999}
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            px: 1,
                            borderRadius: '8px',
                          }
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.secondary.main, 0.2),
                            color: theme.palette.secondary.main,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <CustomDeviceIcon />
                        </Avatar>
                      </Badge>

                      <Box sx={{ ml: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('devices:customDevices')}
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {deviceStats.customCount}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search and controls toolbar */}
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            {/* Left side: search and filter toggle */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                placeholder={t('common:actions.search')}
                value={searchQuery}
                onChange={handleSearchChange}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchQuery('')}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                  sx: { borderRadius: '12px' }
                }}
                sx={{
                  width: { xs: '100%', sm: '280px' },
                }}
              />

              <IconButton
                onClick={toggleDrawer}
                color={hasActiveFilters ? "secondary" : "default"}
                sx={{
                  display: { md: 'none' },
                  border: `1px solid ${alpha(
                    hasActiveFilters ? theme.palette.secondary.main : theme.palette.divider,
                    0.3
                  )}`,
                  borderRadius: '12px',
                }}
              >
                <FilterIcon />
              </IconButton>
            </Box>

            {/* Right side: view toggle, sort, add button */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                size="small"
                aria-label="view mode"
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  '& .MuiToggleButton-root': {
                    borderRadius: '8px',
                    px: 1.5,
                    '&.Mui-selected': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    }
                  },
                  bgcolor: alpha(theme.palette.background.paper, 0.5),
                  p: 0.5,
                  borderRadius: '10px',
                }}
              >
                <ToggleButton value="grid" aria-label="grid view">
                  <GridIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="compact" aria-label="compact view">
                  <RemoteIcon fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>

              <Tooltip title={t('common:actions.sort')}>
                <IconButton
                  onClick={handleSortClick}
                  sx={{
                    borderRadius: '12px',
                    bgcolor: sortField !== 'name' || sortDirection !== 'asc'
                      ? alpha(theme.palette.info.main, 0.1)
                      : alpha(theme.palette.action.hover, 0.1),
                    color: sortField !== 'name' || sortDirection !== 'asc'
                      ? theme.palette.info.main
                      : theme.palette.text.primary,
                    border: `1px solid ${alpha(
                      sortField !== 'name' || sortDirection !== 'asc'
                        ? theme.palette.info.main
                        : theme.palette.divider,
                      0.2
                    )}`,
                  }}
                >
                  <SortByIcon />
                </IconButton>
              </Tooltip>

              <Button
                variant="contained"
                color="primary"
                onClick={handleAddClick}
                startIcon={<AddIcon />}
                sx={{
                  borderRadius: '12px',
                  fontWeight: 600,
                }}
              >
                {t('devices:addDevice')}
              </Button>
            </Box>
          </Box>

          {/* Devices display */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 8,
                }}
              >
                <CircularProgress size={48} />
              </Box>
            ) : (
              <>
                {/* Filter summary if filters are active */}
                {hasActiveFilters && (
                  <Box
                    sx={{
                      mb: 3,
                      px: 2,
                      py: 1.5,
                      bgcolor: alpha(theme.palette.info.main, 0.08),
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {t('devices:showingFilteredResults', {
                        count: filteredDevices.length,
                        total: devices?.length || 0
                      })}
                    </Typography>

                    <Button
                      variant="text"
                      size="small"
                      onClick={handleClearFilters}
                      startIcon={<ClearIcon />}
                      color="info"
                    >
                      {t('common:actions.clearFilters')}
                    </Button>
                  </Box>
                )}

                {filteredDevices.length > 0 ? (
                  <Grid container spacing={3}>
                    {filteredDevices.map((device) => (
                      <Grid
                        item
                        xs={12}
                        sm={viewMode === 'compact' ? 12 : 6}
                        md={viewMode === 'compact' ? 6 : 4}
                        lg={viewMode === 'compact' ? 4 : 3}
                        key={device.id}
                      >
                        <DeviceCard device={device} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <NoDevicesFound
                    hasFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                    onAddDevice={handleAddClick}
                  />
                )}
              </>
            )}
          </AnimatePresence>
        </Box>
      </Box>

      {/* Sort menu */}
      <Menu
        anchorEl={sortMenuAnchorEl}
        open={Boolean(sortMenuAnchorEl)}
        onClose={handleSortMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            borderRadius: '12px',
            minWidth: '180px',
          }
        }}
      >
        <MenuItem onClick={() => handleSortSelect('name')} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <SortIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('devices:sortOptions.name')} />
          {sortField === 'name' && (
            <Box component="span" sx={{ ml: 'auto', color: 'primary.main' }}>
              {sortDirection === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />}
            </Box>
          )}
        </MenuItem>

        <MenuItem onClick={() => handleSortSelect('created_at')} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <SortIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('devices:sortOptions.created')} />
          {sortField === 'created_at' && (
            <Box component="span" sx={{ ml: 'auto', color: 'primary.main' }}>
              {sortDirection === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />}
            </Box>
          )}
        </MenuItem>

        <MenuItem onClick={() => handleSortSelect('type')} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <SortIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('devices:sortOptions.type')} />
          {sortField === 'type' && (
            <Box component="span" sx={{ ml: 'auto', color: 'primary.main' }}>
              {sortDirection === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />}
            </Box>
          )}
        </MenuItem>

        <MenuItem onClick={() => handleSortSelect('status')} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <SortIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('devices:sortOptions.status')} />
          {sortField === 'status' && (
            <Box component="span" sx={{ ml: 'auto', color: 'primary.main' }}>
              {sortDirection === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />}
            </Box>
          )}
        </MenuItem>
      </Menu>

      {/* Add device menu */}
      <Menu
        anchorEl={addMenuAnchorEl}
        open={Boolean(addMenuAnchorEl)}
        onClose={handleAddMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            borderRadius: '12px',
            minWidth: '220px',
          }
        }}
      >
        <MenuItem onClick={handleAddStandardDevice} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <StandardDeviceIcon sx={{ color: theme.palette.primary.main }} />
          </ListItemIcon>
          <ListItemText
            primary={t('devices:deviceTypes.standard')}
            secondary={t('devices:standardDeviceDescription')}
            primaryTypographyProps={{ fontWeight: 600 }}
            secondaryTypographyProps={{ fontSize: '0.75rem' }}
          />
        </MenuItem>
        <MenuItem onClick={handleAddCustomDevice} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <CustomDeviceIcon sx={{ color: theme.palette.secondary.main }} />
          </ListItemIcon>
          <ListItemText
            primary={t('devices:deviceTypes.custom')}
            secondary={t('devices:customDeviceDescription')}
            primaryTypographyProps={{ fontWeight: 600 }}
            secondaryTypographyProps={{ fontSize: '0.75rem' }}
          />
        </MenuItem>
      </Menu>

      {/* Modals for adding devices */}
      <StandardDeviceModal
        open={standardModalOpen}
        onClose={() => setStandardModalOpen(false)}
        onSuccess={() => {
          setStandardModalOpen(false);
          refetch();
        }}
      />

      <CustomDeviceModal
        open={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        onSuccess={() => {
          setCustomModalOpen(false);
          refetch();
        }}
      />
    </PageContainer>
  );
};

// Filters component
const FiltersContent = ({
  availabilityFilter,
  setAvailabilityFilter,
  typeFilter,
  setTypeFilter,
  osFilter,
  setOsFilter,
  hasActiveFilters,
  onClearFilters
}: {
  availabilityFilter: AvailabilityFilter;
  setAvailabilityFilter: (value: AvailabilityFilter) => void;
  typeFilter: 'all' | DeviceType;
  setTypeFilter: (value: 'all' | DeviceType) => void;
  osFilter: 'all' | OSType;
  setOsFilter: (value: 'all' | OSType) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}) => {
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();

  return (
    <>
      {/* Availability filter */}
      <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
        <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1.5 }}>
          {t('devices:availabilityStatus')}
        </FormLabel>
        <RadioGroup
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value as AvailabilityFilter)}
        >
          <FormControlLabel
            value="all"
            control={<Radio size="small" />}
            label={t('devices:all')}
          />
          <FormControlLabel
            value="online"
            control={<Radio size="small" color="success" />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <OnlineIcon fontSize="small" color="success" sx={{ mr: 0.5 }} />
                {t('devices:status.online')}
              </Box>
            }
          />
          <FormControlLabel
            value="offline"
            control={<Radio size="small" color="error" />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <OfflineIcon fontSize="small" color="error" sx={{ mr: 0.5 }} />
                {t('devices:status.offline')}
              </Box>
            }
          />
        </RadioGroup>
      </FormControl>

      <Divider sx={{ my: 2 }} />

      {/* Device type filter */}
      <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
        <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1.5 }}>
          {t('devices:deviceType')}
        </FormLabel>
        <RadioGroup
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as 'all' | DeviceType)}
        >
          <FormControlLabel
            value="all"
            control={<Radio size="small" />}
            label={t('devices:all')}
          />
          <FormControlLabel
            value="standard"
            control={<Radio size="small" color="primary" />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StandardDeviceIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                {t('devices:deviceTypes.standard')}
              </Box>
            }
          />
          <FormControlLabel
            value="custom"
            control={<Radio size="small" color="secondary" />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CustomDeviceIcon fontSize="small" color="secondary" sx={{ mr: 0.5 }} />
                {t('devices:deviceTypes.custom')}
              </Box>
            }
          />
        </RadioGroup>
      </FormControl>

      {/* OS Filter - only show when standard type is selected */}
      {(typeFilter === 'standard' || typeFilter === 'all') && (
        <>
          <Divider sx={{ my: 2 }} />

          <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
            <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1.5 }}>
              {t('devices:operatingSystem')}
            </FormLabel>
            <RadioGroup
              value={osFilter}
              onChange={(e) => setOsFilter(e.target.value as 'all' | OSType)}
            >
              <FormControlLabel
                value="all"
                control={<Radio size="small" />}
                label={t('devices:all')}
              />
              <FormControlLabel
                value="linux"
                control={<Radio size="small" color="warning" />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LinuxIcon fontSize="small" color="warning" sx={{ mr: 0.5 }} />
                    {t('devices:osTypes.linux')}
                  </Box>
                }
              />
              <FormControlLabel
                value="windows"
                control={<Radio size="small" color="info" />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WindowsIcon fontSize="small" color="info" sx={{ mr: 0.5 }} />
                    {t('devices:osTypes.windows')}
                  </Box>
                }
              />
              <FormControlLabel
                value="macos"
                control={<Radio size="small" color="success" />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MacOSIcon fontSize="small" color="success" sx={{ mr: 0.5 }} />
                    {t('devices:osTypes.macos')}
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
        </>
      )}

      {/* Clear filters button */}
      {hasActiveFilters && (
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          onClick={onClearFilters}
          startIcon={<ClearIcon />}
          sx={{ mt: 1 }}
        >
          {t('common:actions.clearFilters')}
        </Button>
      )}
    </>
  );
};

// No devices found component
const NoDevicesFound = ({
  hasFilters,
  onClearFilters,
  onAddDevice
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
  onAddDevice: (event: React.MouseEvent<HTMLElement>) => void;
}) => {
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        textAlign: 'center',
        borderRadius: '16px',
        bgcolor: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: alpha(theme.palette.warning.main, 0.1),
            color: theme.palette.warning.main,
            mx: 'auto',
            mb: 2
          }}
        >
          <WarningIcon fontSize="large" />
        </Avatar>
        <Typography variant="h6" fontWeight={700}>
          {hasFilters ? t('devices:noDevicesMatchFilters') : t('devices:noDevicesYet')}
        </Typography>
        <Typography sx={{ mt: 1 }} color="text.secondary">
          {hasFilters
            ? t('devices:tryDifferentFilters')
            : t('devices:addYourFirstDevice')
          }
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        {hasFilters && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClearFilters}
            sx={{ borderRadius: '12px' }}
          >
            {t('common:actions.clearFilters')}
          </Button>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={onAddDevice}
          startIcon={<AddIcon />}
          sx={{ borderRadius: '12px' }}
        >
          {t('devices:addFirstDevice')}
        </Button>
      </Box>
    </Paper>
  );
};

export default DevicesPage;