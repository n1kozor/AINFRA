import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  alpha,
  Avatar,
  Paper,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Badge,
  Stack,
  Tabs,
  Tab,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Card,
} from '@mui/material';
import {
  AddRounded as AddIcon,
  SearchRounded as SearchIcon,
  EditRounded as EditIcon,
  DeleteRounded as DeleteIcon,
  ExtensionRounded as PluginIcon,
  CodeRounded as CodeIcon,
  VisibilityRounded as ViewIcon,
  VerifiedUserRounded as VerifiedIcon,
  FilterListRounded as FilterIcon,



  InfoOutlined as InfoIcon,
  InfoOutlined as MoreIcon,

  ClearRounded as TuneIcon,
  GridViewRounded as GridViewIcon,
  ViewListRounded as ListViewIcon,
  AutorenewRounded as RefreshIcon,
  TuneRounded as SettingsIcon,
  SortRounded as SortIcon,
  ArrowDownwardRounded as ArrowDownIcon,
  ArrowUpwardRounded as ArrowUpIcon,
  StarRounded as StarIcon,
  ClearRounded as ClearIcon,
  CheckCircleRounded as CheckIcon,
  WarningAmberRounded as WarningIcon,
  CancelRounded as CancelIcon,
  ShareRounded as ShareIcon,
  DownloadRounded as DownloadIcon,
  LightbulbRounded as IdeaIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import PageContainer from '../../components/common/PageContainer';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { format, formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'updated' | 'created';
type SortDirection = 'asc' | 'desc';
type FilterStatus = 'all' | 'active' | 'inactive';

const Plugins = () => {
  const { t } = useTranslation(['plugins', 'common']);
  const theme = useTheme();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPluginId, setSelectedPluginId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Fetch plugins with auto-refresh every 30 seconds
  const {
    data: plugins,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['plugins'],
    queryFn: api.plugins.getAll,
    refetchInterval: 30000, // Auto refresh every 30 seconds
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.plugins.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plugins'] });
      setDeleteDialogOpen(false);
    },
  });

  const handleDeleteClick = (id: number, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setSelectedPluginId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedPluginId !== null) {
      deleteMutation.mutate(selectedPluginId);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedPluginId(null);
  };

  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleSortChange = (option: SortOption) => {
    if (sortBy === option) {
      // Toggle direction if clicking the same option
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('desc');
    }
    handleFilterMenuClose();
  };

  const handleStatusFilterChange = (status: FilterStatus) => {
    setFilterStatus(status);
    handleFilterMenuClose();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSortBy('updated');
    setSortDirection('desc');
    setFilterStatus('all');
    setActiveTab(0);
  };

  const toggleFilterPanel = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  // Filter and sort plugins
  const processedPlugins = plugins
    ? plugins
      // First filter by search query
      .filter(plugin =>
        (searchQuery === '' ||
          plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          plugin.description?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      // Then filter by status
      .filter(plugin => {
        if (filterStatus === 'all') return true;
        return filterStatus === 'active' ? plugin.is_active : !plugin.is_active;
      })
      // Then filter by tab selection
      .filter(plugin => {
        if (activeTab === 0) return true; // All plugins
        if (activeTab === 1) return plugin.is_active; // Active plugins
        if (activeTab === 2) return !plugin.is_active; // Inactive plugins
        if (activeTab === 3) return plugin.verified === true; // Verified plugins
        return true;
      })
      // Then sort
      .sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'updated':
            comparison = new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
            break;
          case 'created':
            comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            break;
          default:
            comparison = 0;
        }

        return sortDirection === 'asc' ? -comparison : comparison;
      })
    : [];

  // Get the selected plugin for the delete dialog
  const selectedPlugin = selectedPluginId !== null
    ? plugins?.find(p => p.id === selectedPluginId)
    : null;

  // Count plugin types for tabs
  const activeCount = plugins?.filter(p => p.is_active).length || 0;
  const inactiveCount = plugins?.filter(p => !p.is_active).length || 0;
  const verifiedCount = plugins?.filter(p => p.verified).length || 0;

  const hasActiveFilters = searchQuery !== '' || sortBy !== 'updated' || sortDirection !== 'desc' || filterStatus !== 'all' || activeTab !== 0;

  // Generate grid columns based on view mode
  const getGridColumns = () => {
    if (viewMode === 'list') return { xs: 12 };
    return { xs: 12, sm: 6, md: 4, lg: 3 };
  };

  return (
    <PageContainer
      title={t('plugins:title')}
      subtitle={t('plugins:subtitle')}
      icon={<PluginIcon sx={{ fontSize: 26 }} />}
      breadcrumbs={[
        { text: t('common:navigation.dashboard'), link: '/' },
        { text: t('common:navigation.plugins') },
      ]}
      actions={
        <Stack direction="row" spacing={1}>
          <Tooltip title={t('plugins:refresh')} arrow>
            <IconButton
              onClick={() => refetch()}
              color="primary"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: '12px',
                width: 42,
                height: 42,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/plugins/new"
            startIcon={<AddIcon />}
            sx={{
              px: 3,
              py: 1.2,
              borderRadius: '14px',
              fontWeight: 600,
              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {t('plugins:addPlugin')}
          </Button>
        </Stack>
      }
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
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
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', md: 'auto' } }}>
              <TextField
                placeholder={t('common:actions.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                fullWidth
                sx={{
                  maxWidth: '400px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    transition: 'all 0.2s',
                    bgcolor: alpha(theme.palette.background.paper, 0.8),
                    '&:hover': {
                      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                    },
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.3)}`,
                    }
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchQuery('')}
                        edge="end"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: { xs: '100%', md: 'auto' } }}>
              <Box
                sx={{
                  display: 'flex',
                  bgcolor: alpha(theme.palette.background.paper, 0.5),
                  borderRadius: '12px',
                  p: 0.5,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Tooltip title={t('plugins:viewModes.grid')} arrow>
                  <IconButton
                    size="small"
                    onClick={() => handleViewModeChange('grid')}
                    color={viewMode === 'grid' ? 'primary' : 'default'}
                    sx={{
                      borderRadius: '10px',
                      bgcolor: viewMode === 'grid' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                      '&:hover': {
                        bgcolor: viewMode === 'grid'
                          ? alpha(theme.palette.primary.main, 0.15)
                          : alpha(theme.palette.action.hover, 0.1),
                      }
                    }}
                  >
                    <GridViewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title={t('plugins:viewModes.list')} arrow>
                  <IconButton
                    size="small"
                    onClick={() => handleViewModeChange('list')}
                    color={viewMode === 'list' ? 'primary' : 'default'}
                    sx={{
                      borderRadius: '10px',
                      bgcolor: viewMode === 'list' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                      '&:hover': {
                        bgcolor: viewMode === 'list'
                          ? alpha(theme.palette.primary.main, 0.15)
                          : alpha(theme.palette.action.hover, 0.1),
                      }
                    }}
                  >
                    <ListViewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Button
                variant={hasActiveFilters ? "contained" : "outlined"}
                color={hasActiveFilters ? "secondary" : "primary"}
                startIcon={hasActiveFilters ? <ClearIcon /> : <TuneIcon />}
                endIcon={hasActiveFilters ? null : <Badge color="error" variant="dot" invisible={!hasActiveFilters} />}
                onClick={hasActiveFilters ? handleClearFilters : toggleFilterPanel}
                sx={{
                  borderRadius: '12px',
                  fontWeight: 600,
                  px: 2,
                  borderWidth: '1px',
                  '&:hover': {
                    borderWidth: '1px',
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[3],
                  }
                }}
              >
                {hasActiveFilters ? t('plugins:clearFilters') : t('plugins:filter')}
              </Button>

              <Tooltip title={t('plugins:sortOptions')} arrow>
                <IconButton
                  onClick={handleFilterMenuOpen}
                  sx={{
                    borderRadius: '12px',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    width: 42,
                    height: 42,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                    }
                  }}
                >
                  <SortIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <AnimatePresence>
            {showFilterPanel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Divider sx={{ my: 2, opacity: 0.3 }} />

                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                  sx={{
                    mb: 2,
                    '& .MuiTabs-indicator': {
                      height: 3,
                      borderRadius: '3px',
                    },
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      minWidth: 'auto',
                      mx: 1,
                      '&:first-of-type': { ml: 0 },
                      '&.Mui-selected': {
                        color: theme.palette.primary.main,
                      },
                      '&:hover': {
                        color: theme.palette.primary.main,
                        opacity: 0.8,
                      },
                    },
                  }}
                >
                  <Tab
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {t('plugins:tabs.all')}
                        <Chip
                          label={plugins?.length || 0}
                          size="small"
                          sx={{
                            ml: 1,
                            height: 20,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                          }}
                        />
                      </Box>
                    }
                  />
                  <Tab
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.success.main }} />
                        {t('plugins:tabs.active')}
                        <Chip
                          label={activeCount}
                          size="small"
                          sx={{
                            ml: 1,
                            height: 20,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            color: theme.palette.success.main,
                          }}
                        />
                      </Box>
                    }
                  />
                  <Tab
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CancelIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
                        {t('plugins:tabs.inactive')}
                        <Chip
                          label={inactiveCount}
                          size="small"
                          sx={{
                            ml: 1,
                            height: 20,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            bgcolor: alpha(theme.palette.text.secondary, 0.1),
                            color: theme.palette.text.secondary,
                          }}
                        />
                      </Box>
                    }
                  />
                  <Tab
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <VerifiedIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.info.main }} />
                        {t('plugins:tabs.verified')}
                        <Chip
                          label={verifiedCount}
                          size="small"
                          sx={{
                            ml: 1,
                            height: 20,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            color: theme.palette.info.main,
                          }}
                        />
                      </Box>
                    }
                  />
                </Tabs>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                    <SortIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {t('plugins:sortBy')}:
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                      label={t('plugins:sortOptions.name')}
                      clickable
                      variant={sortBy === 'name' ? 'filled' : 'outlined'}
                      color={sortBy === 'name' ? 'primary' : 'default'}
                      onClick={() => handleSortChange('name')}
                      icon={sortBy === 'name' && (sortDirection === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                      sx={{ borderRadius: '10px' }}
                    />
                    <Chip
                      label={t('plugins:sortOptions.updated')}
                      clickable
                      variant={sortBy === 'updated' ? 'filled' : 'outlined'}
                      color={sortBy === 'updated' ? 'primary' : 'default'}
                      onClick={() => handleSortChange('updated')}
                      icon={sortBy === 'updated' && (sortDirection === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                      sx={{ borderRadius: '10px' }}
                    />
                    <Chip
                      label={t('plugins:sortOptions.created')}
                      clickable
                      variant={sortBy === 'created' ? 'filled' : 'outlined'}
                      color={sortBy === 'created' ? 'primary' : 'default'}
                      onClick={() => handleSortChange('created')}
                      icon={sortBy === 'created' && (sortDirection === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                      sx={{ borderRadius: '10px' }}
                    />
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Paper>

        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 10 }}>
            <CircularProgress size={60} thickness={4} sx={{
              color: theme.palette.primary.main,
              mb: 3,
            }} />
            <Typography variant="h6" sx={{ color: alpha(theme.palette.text.primary, 0.7) }}>
              {t('plugins:loadingPlugins')}
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ mb: 4 }}>
            <DashboardCard
              title={t('plugins:error.title')}
              icon={<InfoIcon />}
              color="error"
              variant="glass"
            >
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main,
                    mx: 'auto',
                    mb: 3,
                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                    boxShadow: `0 10px 25px ${alpha(theme.palette.error.main, 0.15)}`,
                  }}
                >
                  <WarningIcon sx={{ fontSize: 40 }} />
                </Avatar>

                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                  {t('plugins:error.title')}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                  {t('plugins:error.loading')}
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => refetch()}
                  startIcon={<RefreshIcon />}
                  sx={{
                    px: 4,
                    py: 1.2,
                    borderRadius: '14px',
                    fontWeight: 600,
                    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.25)}`,
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.35)}`,
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {t('plugins:tryAgain')}
                </Button>
              </Box>
            </DashboardCard>
          </Box>
        ) : processedPlugins.length === 0 ? (
          <Box sx={{ mb: 4 }}>
            <DashboardCard variant="glass">
              <Box
                sx={{
                  p: 8,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    mb: 3,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.15)}`,
                  }}
                >
                  {hasActiveFilters ? <SearchIcon sx={{ fontSize: 50 }} /> : <PluginIcon sx={{ fontSize: 50 }} />}
                </Avatar>

                <Typography
                  variant="h4"
                  fontWeight={800}
                  gutterBottom
                  sx={{ color: theme.palette.text.primary }}
                >
                  {searchQuery || hasActiveFilters
                    ? t('plugins:noPluginsFound')
                    : t('plugins:noPluginsYet')}
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  paragraph
                  sx={{
                    mb: 4,
                    maxWidth: 600,
                    mx: 'auto',
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                  }}
                >
                  {searchQuery || hasActiveFilters
                    ? t('plugins:tryDifferentSearch')
                    : t('plugins:getStarted')}
                </Typography>

                {searchQuery || hasActiveFilters ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleClearFilters}
                    startIcon={<ClearIcon />}
                    sx={{
                      px: 4,
                      py: 1.2,
                      borderRadius: '14px',
                      fontWeight: 600,
                      boxShadow: `0 8px 25px ${alpha(theme.palette.secondary.main, 0.25)}`,
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: `0 12px 30px ${alpha(theme.palette.secondary.main, 0.35)}`,
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {t('plugins:clearFilters')}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    component={Link}
                    to="/plugins/new"
                    startIcon={<AddIcon />}
                    sx={{
                      px: 4,
                      py: 1.2,
                      borderRadius: '14px',
                      fontWeight: 600,
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.25)}`,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.35)}`,
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {t('plugins:addFirstPlugin')}
                  </Button>
                )}
              </Box>
            </DashboardCard>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  color="text.secondary"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <PluginIcon sx={{ fontSize: '1.1rem', opacity: 0.8 }} />
                  {t('plugins:pluginCount', { count: processedPlugins.length })}
                  {hasActiveFilters && (
                    <Chip
                      size="small"
                      label={t('plugins:filtered')}
                      color="secondary"
                      onDelete={handleClearFilters}
                      deleteIcon={<ClearIcon fontSize="small" />}
                      sx={{ ml: 1, height: 24 }}
                    />
                  )}
                </Typography>
              </motion.div>
            </Box>

            <Grid container spacing={3}>
              <AnimatePresence>
                {processedPlugins.map((plugin, index) => (
                  <Grid item {...getGridColumns()} key={plugin.id}>
                    <PluginCard
                      plugin={plugin}
                      viewMode={viewMode}
                      onDelete={handleDeleteClick}
                      index={index}
                    />
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          </>
        )}

        {/* Sort Menu */}
        <Menu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={handleFilterMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 220,
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              overflow: 'visible',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 20,
                width: 10,
                height: 10,
                bgcolor: theme.palette.background.paper,
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderRight: 'none',
                borderBottom: 'none',
              },
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Typography variant="overline" sx={{ px: 2, pt: 2, display: 'block', color: theme.palette.text.secondary }}>
            {t('plugins:sort')}
          </Typography>

          <MenuItem
            onClick={() => handleSortChange('name')}
            selected={sortBy === 'name'}
            sx={{
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              },
              '&.Mui-selected': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                }
              }
            }}
          >
            <ListItemIcon>
              {sortBy === 'name' && (
                sortDirection === 'asc' ? <ArrowUpIcon color="primary" /> : <ArrowDownIcon color="primary" />
              )}
            </ListItemIcon>
            <ListItemText primary={t('plugins:sortOptions.name')} />
          </MenuItem>

          <MenuItem
            onClick={() => handleSortChange('updated')}
            selected={sortBy === 'updated'}
            sx={{
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              },
              '&.Mui-selected': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                }
              }
            }}
          >
            <ListItemIcon>
              {sortBy === 'updated' && (
                sortDirection === 'asc' ? <ArrowUpIcon color="primary" /> : <ArrowDownIcon color="primary" />
              )}
            </ListItemIcon>
            <ListItemText primary={t('plugins:sortOptions.updated')} />
          </MenuItem>

          <MenuItem
            onClick={() => handleSortChange('created')}
            selected={sortBy === 'created'}
            sx={{
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              },
              '&.Mui-selected': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                }
              }
            }}
          >
            <ListItemIcon>
              {sortBy === 'created' && (
                sortDirection === 'asc' ? <ArrowUpIcon color="primary" /> : <ArrowDownIcon color="primary" />
              )}
            </ListItemIcon>
            <ListItemText primary={t('plugins:sortOptions.created')} />
          </MenuItem>

          <Divider sx={{ my: 1, mx: 2, opacity: 0.6 }} />

          <Typography variant="overline" sx={{ px: 2, pt: 1, display: 'block', color: theme.palette.text.secondary }}>
            {t('plugins:status')}
          </Typography>

          <MenuItem
            onClick={() => handleStatusFilterChange('all')}
            selected={filterStatus === 'all'}
            sx={{
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              },
              '&.Mui-selected': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                }
              }
            }}
          >
            <ListItemText primary={t('plugins:statusOptions.all')} />
          </MenuItem>

          <MenuItem
            onClick={() => handleStatusFilterChange('active')}
            selected={filterStatus === 'active'}
            sx={{
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              '&:hover': {
                bgcolor: alpha(theme.palette.success.main, 0.1),
              },
              '&.Mui-selected': {
                bgcolor: alpha(theme.palette.success.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.success.main, 0.15),
                }
              }
            }}
          >
            <ListItemIcon>
              <CheckIcon color="success" />
            </ListItemIcon>
            <ListItemText primary={t('plugins:statusOptions.active')} />
          </MenuItem>

          <MenuItem
            onClick={() => handleStatusFilterChange('inactive')}
            selected={filterStatus === 'inactive'}
            sx={{
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              '&:hover': {
                bgcolor: alpha(theme.palette.text.secondary, 0.1),
              },
              '&.Mui-selected': {
                bgcolor: alpha(theme.palette.text.secondary, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.text.secondary, 0.15),
                }
              }
            }}
          >
            <ListItemIcon>
              <CancelIcon color="action" />
            </ListItemIcon>
            <ListItemText primary={t('plugins:statusOptions.inactive')} />
          </MenuItem>

          <Divider sx={{ my: 1, mx: 2, opacity: 0.6 }} />

          <Box sx={{ px: 2, py: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              size="small"
              startIcon={<ClearIcon />}
              onClick={() => {
                handleClearFilters();
                handleFilterMenuClose();
              }}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {t('plugins:resetFilters')}
            </Button>
          </Box>
        </Menu>

        {/* Delete Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
          PaperProps={{
            sx: {
              borderRadius: '24px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
              width: '100%',
              maxWidth: 500,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backgroundImage: 'none',
              overflow: 'hidden',
            }
          }}
          TransitionComponent={motion.div}
        >
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                position: 'absolute',
                top: -120,
                left: -100,
                width: 300,
                height: 300,
                background: `radial-gradient(circle, ${alpha(theme.palette.error.main, 0.1)}, transparent 70%)`,
                borderRadius: '50%',
                filter: 'blur(40px)',
                pointerEvents: 'none',
              }}
            />

            <DialogTitle id="delete-dialog-title" sx={{ pb: 1, pt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main,
                    width: 48,
                    height: 48,
                    mr: 2,
                  }}
                >
                  <DeleteIcon />
                </Avatar>
                <Typography variant="h5" component="span" fontWeight={700} sx={{ color: theme.palette.error.main }}>
                  {t('plugins:deletePlugin.title')}
                </Typography>
              </Box>
            </DialogTitle>

            <DialogContent>
              {selectedPlugin && (
                <DialogContentText id="delete-dialog-description" sx={{ mb: 3, mt: 1 }}>
                  {t('plugins:deletePlugin.confirmation', { name: selectedPlugin.name })}
                </DialogContentText>
              )}

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  bgcolor: alpha(theme.palette.error.main, 0.08),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  mb: 1,
                }}
              >
                <WarningIcon sx={{ color: theme.palette.error.main, mr: 2, mt: 0.2 }} />
                <DialogContentText sx={{ color: theme.palette.error.main, m: 0 }}>
                  {t('plugins:deletePlugin.warning')}
                </DialogContentText>
              </Paper>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
              <Button
                onClick={handleDeleteCancel}
                color="inherit"
                variant="outlined"
                startIcon={<CancelIcon />}
                sx={{
                  borderRadius: '14px',
                  px: 3,
                  py: 1.2,
                  fontWeight: 600,
                  borderWidth: '1px',
                  '&:hover': {
                    borderWidth: '1px',
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[2],
                  }
                }}
              >
                {t('common:actions.cancel')}
              </Button>

              <Button
                onClick={handleDeleteConfirm}
                color="error"
                variant="contained"
                startIcon={
                  deleteMutation.isPending ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <DeleteIcon />
                  )
                }
                disabled={deleteMutation.isPending}
                sx={{
                  borderRadius: '14px',
                  px: 3,
                  py: 1.2,
                  fontWeight: 600,
                  boxShadow: `0 8px 20px ${alpha(theme.palette.error.main, 0.25)}`,
                  background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                  '&:hover': {
                    boxShadow: `0 12px 25px ${alpha(theme.palette.error.main, 0.35)}`,
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                {t('common:actions.delete')}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </motion.div>
    </PageContainer>
  );
};

// Plugin Card Component
interface PluginCardProps {
  plugin: any;
  viewMode: ViewMode;
  onDelete: (id: number, event?: React.MouseEvent) => void;
  index: number;
}

const PluginCard: React.FC<PluginCardProps> = ({ plugin, viewMode, onDelete, index }) => {
  const { t } = useTranslation(['plugins', 'common']);
  const theme = useTheme();
  const navigate = useNavigate();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleCardClick = () => {
    navigate(`/plugins/${plugin.id}`);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/plugins/${plugin.id}/edit`);
    handleMenuClose();
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Paper
          elevation={0}
          onClick={handleCardClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderRadius: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            bgcolor: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(8px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.07)}`,
              borderColor: alpha(theme.palette.primary.main, 0.2),
            },
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Avatar
            variant="rounded"
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              mr: 2,
            }}
          >
            <CodeIcon />
          </Avatar>

          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={600} noWrap>
                {plugin.name}
              </Typography>
              <Chip
                size="small"
                label={`v${plugin.version}`}
                sx={{
                  ml: 1,
                  height: 20,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  borderRadius: '4px',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              />

              <Chip
                size="small"
                label={plugin.is_active ? t('plugins:active') : t('plugins:inactive')}
                color={plugin.is_active ? 'success' : 'default'}
                sx={{
                  ml: 1,
                  height: 20,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  borderRadius: '4px',
                  bgcolor: plugin.is_active
                    ? alpha(theme.palette.success.main, 0.1)
                    : alpha(theme.palette.text.secondary, 0.1),
                  color: plugin.is_active
                    ? theme.palette.success.main
                    : theme.palette.text.secondary,
                }}
              />

              {plugin.verified && (
                <Tooltip title={t('plugins:verifiedPlugin')} arrow>
                  <VerifiedIcon
                    sx={{
                      ml: 1,
                      color: theme.palette.info.main,
                      fontSize: '1rem',
                    }}
                  />
                </Tooltip>
              )}
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{ maxWidth: '90%' }}
            >
              {plugin.description || t('plugins:noDescription')}
            </Typography>
          </Box>

          {plugin.author && (
            <Chip
              size="small"
              label={plugin.author}
              sx={{
                mr: 2,
                height: 24,
                fontSize: '0.75rem',
                bgcolor: alpha(theme.palette.info.main, 0.1),
                color: theme.palette.info.main,
                fontWeight: 500,
                display: { xs: 'none', md: 'flex' },
              }}
            />
          )}

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mr: 2, fontWeight: 500, display: { xs: 'none', md: 'block' } }}
          >
            {formatDistanceToNow(new Date(plugin.updated_at), { addSuffix: true })}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="small"
              color="info"
              onClick={(e) => { e.stopPropagation(); navigate(`/plugins/${plugin.id}`); }}
              sx={{
                mr: 1,
                width: 34,
                height: 34,
                borderRadius: '10px',
                bgcolor: alpha(theme.palette.info.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.info.main, 0.2),
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <ViewIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              color="primary"
              onClick={(e) => { e.stopPropagation(); navigate(`/plugins/${plugin.id}/edit`); }}
              sx={{
                mr: 1,
                width: 34,
                height: 34,
                borderRadius: '10px',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              color="error"
              onClick={(e) => onDelete(plugin.id, e)}
              sx={{
                width: 34,
                height: 34,
                borderRadius: '10px',
                bgcolor: alpha(theme.palette.error.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.error.main, 0.2),
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{ height: '100%' }}
    >
      <Paper
        elevation={0}
        onClick={handleCardClick}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRadius: '20px',
          transition: 'all 0.3s',
          overflow: 'hidden',
          cursor: 'pointer',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          bgcolor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(8px)',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: `0 15px 35px ${alpha(theme.palette.common.black, 0.1)}`,
            borderColor: alpha(theme.palette.primary.main, 0.2),
          },
          position: 'relative',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Card Header */}
        <Box sx={{
          p: 3,
          pb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, transparent)`,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Avatar
              variant="rounded"
              sx={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.15)}`,
                mr: 2,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'rotate(10deg)',
                },
              }}
            >
              <CodeIcon />
            </Avatar>

            <Box>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  lineHeight: 1.3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {plugin.name}
                {plugin.verified && (
                  <Tooltip title={t('plugins:verifiedPlugin')} arrow>
                    <VerifiedIcon
                      sx={{
                        color: theme.palette.info.main,
                        fontSize: '1rem',
                        position: 'relative',
                        top: 2,
                      }}
                    />
                  </Tooltip>
                )}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <Chip
                  size="small"
                  label={`v${plugin.version}`}
                  sx={{
                    height: 20,
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    borderRadius: '4px',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    mr: 1,
                  }}
                />

                <Badge
                  variant="dot"
                  invisible={!plugin.is_active}
                  sx={{
                    '& .MuiBadge-dot': {
                      backgroundColor: theme.palette.success.main,
                      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      right: 3,
                      top: 3,
                    }
                  }}
                >
                  <Chip
                    size="small"
                    label={plugin.is_active ? t('plugins:active') : t('plugins:inactive')}
                    sx={{
                      height: 20,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      borderRadius: '4px',
                      bgcolor: plugin.is_active
                        ? alpha(theme.palette.success.main, 0.1)
                        : alpha(theme.palette.text.secondary, 0.1),
                      color: plugin.is_active
                        ? theme.palette.success.main
                        : theme.palette.text.secondary,
                    }}
                  />
                </Badge>
              </Box>
            </Box>
          </Box>

          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{
              width: 32,
              height: 32,
              borderRadius: '10px',
              bgcolor: alpha(theme.palette.text.primary, 0.05),
              '&:hover': {
                bgcolor: alpha(theme.palette.text.primary, 0.1),
              },
              opacity: hovered ? 1 : 0.5,
              transition: 'all 0.2s',
            }}
          >
            <MoreIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Card Content */}
        <Box sx={{ px: 3, py: 2, flexGrow: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: '4.5em',
              lineHeight: 1.5,
            }}
          >
            {plugin.description || (
              <Box sx={{ fontStyle: 'italic', opacity: 0.7 }}>
                {t('plugins:noDescription')}
              </Box>
            )}
          </Typography>

          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              {plugin.author && (
                <Chip
                  size="small"
                  label={plugin.author}
                  sx={{
                    height: 24,
                    fontSize: '0.75rem',
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    fontWeight: 500,
                  }}
                />
              )}
            </Stack>
          </Box>
        </Box>

        {/* Card Footer */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            mt: 'auto',
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            bgcolor: alpha(theme.palette.background.default, 0.3),
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {formatDistanceToNow(new Date(plugin.updated_at), { addSuffix: true })}
          </Typography>

          <Box>
            <Tooltip title={t('plugins:view')} arrow>
              <IconButton
                size="small"
                color="info"
                onClick={(e) => { e.stopPropagation(); navigate(`/plugins/${plugin.id}`); }}
                sx={{
                  mr: 1,
                  width: 32,
                  height: 32,
                  borderRadius: '10px',
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  color: theme.palette.info.main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.info.main, 0.2),
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <ViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title={t('common:actions.edit')} arrow>
              <IconButton
                size="small"
                color="primary"
                onClick={(e) => { e.stopPropagation(); navigate(`/plugins/${plugin.id}/edit`); }}
                sx={{
                  mr: 1,
                  width: 32,
                  height: 32,
                  borderRadius: '10px',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title={t('common:actions.delete')} arrow>
              <IconButton
                size="small"
                color="error"
                onClick={(e) => onDelete(plugin.id, e)}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '10px',
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.error.main, 0.2),
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Options Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 180,
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              overflow: 'visible',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: theme.palette.background.paper,
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderRight: 'none',
                borderBottom: 'none',
              },
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem
            onClick={(e) => { e.stopPropagation(); navigate(`/plugins/${plugin.id}`); handleMenuClose(); }}
            sx={{
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              '&:hover': {
                bgcolor: alpha(theme.palette.info.main, 0.1),
              }
            }}
          >
            <ListItemIcon>
              <ViewIcon fontSize="small" color="info" />
            </ListItemIcon>
            <ListItemText primary={t('plugins:view')} />
          </MenuItem>

          <MenuItem
            onClick={handleEditClick}
            sx={{
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              }
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText primary={t('common:actions.edit')} />
          </MenuItem>

          <MenuItem
            onClick={() => { navigate(`/plugins/${plugin.id}/clone`); handleMenuClose(); }}
            sx={{
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              '&:hover': {
                bgcolor: alpha(theme.palette.secondary.main, 0.1),
              }
            }}
          >
            <ListItemIcon>
              <CodeIcon fontSize="small" color="secondary" />
            </ListItemIcon>
            <ListItemText primary={t('plugins:clone')} />
          </MenuItem>

          <MenuItem
            onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(window.location.origin + `/plugins/${plugin.id}`); handleMenuClose(); }}
            sx={{
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              '&:hover': {
                bgcolor: alpha(theme.palette.success.main, 0.1),
              }
            }}
          >
            <ListItemIcon>
              <ShareIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText primary={t('common:actions.share')} />
          </MenuItem>

          <Divider sx={{ my: 1, mx: 2, opacity: 0.6 }} />

          <MenuItem
            onClick={(e) => { onDelete(plugin.id, e); handleMenuClose(); }}
            sx={{
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              color: theme.palette.error.main,
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, 0.1),
              }
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText primary={t('common:actions.delete')} />
          </MenuItem>
        </Menu>
      </Paper>
    </motion.div>
  );
};

export default Plugins;