import React, { useState } from 'react';
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
  Tooltip,
  Stack,
  Tabs,
  Tab,
} from '@mui/material';
import {
  AddRounded as AddIcon,
  SearchRounded as SearchIcon,
  DeleteRounded as DeleteIcon,
  ExtensionRounded as PluginIcon,
  InfoOutlined as InfoIcon,
  ClearRounded as ClearIcon,
  GridViewRounded as GridViewIcon,
  ViewListRounded as ListViewIcon,
  WarningAmberRounded as WarningIcon,
  CheckCircleRounded as CheckIcon,
  CancelRounded as CancelIcon,
} from '@mui/icons-material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import PageContainer from '../../components/common/PageContainer';
import PluginCard from '../../components/PluginPage/PluginCard';
import { usePlugins } from '../../hooks/plugins/usePlugins';
import { usePluginActions } from '../../hooks/plugins/usePluginActions';

const Plugins = () => {
  const { t } = useTranslation(['plugins', 'common']);
  const theme = useTheme();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState(0);

  // Custom hooks
  const { data: plugins, isLoading, error, refetch } = usePlugins();
  const {
    deleteMutation,
    deleteDialogOpen,
    selectedPluginId,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel
  } = usePluginActions();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Filter and sort plugins
  const filteredPlugins = plugins
    ? plugins
      // First filter by search query
      .filter(plugin =>
        (searchQuery === '' ||
          plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          plugin.description?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      // Then filter by tab selection
      .filter(plugin => {
        if (activeTab === 0) return true; // All plugins
        if (activeTab === 1) return plugin.is_active; // Active plugins
        if (activeTab === 2) return !plugin.is_active; // Inactive plugins
        if (activeTab === 3) return plugin.verified === true; // Verified plugins
        return true;
      })
      // Sort by updated_at desc by default
      .sort((a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
    : [];

  // Get the selected plugin for the delete dialog
  const selectedPlugin = selectedPluginId !== null
    ? plugins?.find(p => p.id === selectedPluginId)
    : null;

  // Count plugin types for tabs
  const activeCount = plugins?.filter(p => p.is_active).length || 0;
  const inactiveCount = plugins?.filter(p => !p.is_active).length || 0;
  const verifiedCount = plugins?.filter(p => p.verified).length || 0;

  return (
    <PageContainer
      title={t('plugins:title')}
      subtitle={t('plugins:subtitle')}
      icon={<PluginIcon sx={{ fontSize: 24 }} />}
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
                borderRadius: '10px',
                width: 40,
                height: 40,
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
              px: 2,
              py: 1,
              borderRadius: '10px',
              fontWeight: 600,
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
        transition={{ duration: 0.3 }}
      >
        <Box sx={{
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2
        }}>
          <TextField
            placeholder={t('common:actions.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{
              maxWidth: { xs: '100%', sm: '300px' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
              }
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

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Tooltip title={t('plugins:viewModes.grid')} arrow>
              <IconButton
                size="small"
                onClick={() => setViewMode('grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
                sx={{
                  borderRadius: '8px',
                  bgcolor: viewMode === 'grid' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                }}
              >
                <GridViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title={t('plugins:viewModes.list')} arrow>
              <IconButton
                size="small"
                onClick={() => setViewMode('list')}
                color={viewMode === 'list' ? 'primary' : 'default'}
                sx={{
                  borderRadius: '8px',
                  bgcolor: viewMode === 'list' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                }}
              >
                <ListViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
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
              minWidth: 'auto',
              mx: 1,
              '&:first-of-type': { ml: 0 },
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
                  sx={{ ml: 1, height: 20, fontWeight: 600, fontSize: '0.75rem' }}
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
        </Tabs>

        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 6 }}>
            <CircularProgress size={50} thickness={4} sx={{ mb: 3 }} />
            <Typography variant="h6" color="text.secondary">
              {t('plugins:loadingPlugins')}
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                mx: 'auto',
                mb: 2,
              }}
            >
              <WarningIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              {t('plugins:error.title')}
            </Typography>
            <Typography color="text.secondary" paragraph>
              {t('plugins:error.loading')}
            </Typography>
            <Button
              variant="contained"
              onClick={() => refetch()}
              startIcon={<RefreshIcon />}
            >
              {t('plugins:tryAgain')}
            </Button>
          </Box>
        ) : filteredPlugins.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 6 }}>
            <Avatar
              sx={{
                width: 70,
                height: 70,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                mx: 'auto',
                mb: 3,
              }}
            >
              {searchQuery ? <SearchIcon sx={{ fontSize: 40 }} /> : <PluginIcon sx={{ fontSize: 40 }} />}
            </Avatar>
            <Typography variant="h5" gutterBottom fontWeight={700}>
              {searchQuery
                ? t('plugins:noPluginsFound')
                : t('plugins:noPluginsYet')}
            </Typography>
            <Typography color="text.secondary" paragraph sx={{ maxWidth: 500, mx: 'auto' }}>
              {searchQuery
                ? t('plugins:tryDifferentSearch')
                : t('plugins:getStarted')}
            </Typography>
            {searchQuery ? (
              <Button
                variant="outlined"
                onClick={() => setSearchQuery('')}
                startIcon={<ClearIcon />}
              >
                {t('plugins:clearSearch')}
              </Button>
            ) : (
              <Button
                variant="contained"
                component={Link}
                to="/plugins/new"
                startIcon={<AddIcon />}
              >
                {t('plugins:addFirstPlugin')}
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={3}>
            <AnimatePresence>
              {filteredPlugins.map((plugin, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={plugin.id}>
                  <PluginCard
                    plugin={plugin}
                    onDelete={handleDeleteClick}
                    index={index}
                    compact={viewMode === 'list'}
                  />
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}

        {/* Delete Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              maxWidth: 400,
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DeleteIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {t('plugins:deletePlugin.title')}
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent>
            <DialogContentText>
              {selectedPlugin && t('plugins:deletePlugin.confirmation', { name: selectedPlugin.name })}
            </DialogContentText>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleDeleteCancel}
              color="inherit"
              variant="outlined"
              sx={{ borderRadius: '8px' }}
            >
              {t('common:actions.cancel')}
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              startIcon={deleteMutation.isPending && <CircularProgress size={16} color="inherit" />}
              disabled={deleteMutation.isPending}
              sx={{ borderRadius: '8px' }}
            >
              {t('common:actions.delete')}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </PageContainer>
  );
};

export default Plugins;