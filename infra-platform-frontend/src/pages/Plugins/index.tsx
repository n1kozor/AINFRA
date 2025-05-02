import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid, // Using Grid v2
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
  Avatar,
  Tabs,
  Tab,
} from '@mui/material';
import {
  AddRounded as AddIcon,
  SearchRounded as SearchIcon,
  DeleteRounded as DeleteIcon,
  ExtensionRounded as PluginIcon,
  ClearRounded as ClearIcon,
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

  // State management
  const [searchQuery, setSearchQuery] = useState('');
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
          .filter(plugin =>
              (searchQuery === '' ||
                  plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  plugin.description?.toLowerCase().includes(searchQuery.toLowerCase()))
          )
          .filter(plugin => {
            if (activeTab === 0) return true; // All plugins
            if (activeTab === 1) return plugin.is_active; // Active plugins
            if (activeTab === 2) return !plugin.is_active; // Inactive plugins
            return true;
          })
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

  return (
      <PageContainer
          title={t('plugins:title')}
          subtitle={t('plugins:subtitle')}
          icon={<PluginIcon />}
          breadcrumbs={[
            { text: t('common:navigation.dashboard'), link: '/' },
            { text: t('common:navigation.plugins') },
          ]}
          actions={
            <Button
                variant="contained"
                component={Link}
                to="/plugins/new"
                startIcon={<AddIcon />}
            >
              {t('plugins:addPlugin')}
            </Button>
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
                sx={{ maxWidth: { xs: '100%', sm: '300px' } }}
                InputProps={{
                  startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
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

          <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{ mb: 3 }}
          >
            <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {t('plugins:tabs.all')}
                    <Chip
                        label={plugins?.length || 0}
                        size="small"
                        sx={{ ml: 1 }}
                    />
                  </Box>
                }
            />
            <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {t('plugins:tabs.active')}
                    <Chip
                        label={activeCount}
                        size="small"
                        color="success"
                        sx={{ ml: 1 }}
                    />
                  </Box>
                }
            />
            <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CancelIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {t('plugins:tabs.inactive')}
                    <Chip
                        label={inactiveCount}
                        size="small"
                        sx={{ ml: 1 }}
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
                    color="error"
                    sx={{ mx: 'auto', mb: 2 }}
                >
                  <WarningIcon />
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
                    sx={{ mx: 'auto', mb: 3 }}
                >
                  {searchQuery ? <SearchIcon /> : <PluginIcon />}
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
                      <Grid key={plugin.id} spacing={3} sx={{ width: { xs: '100%', sm: '50%', md: '33.33%', lg: '25%' } }}>
                        <PluginCard
                            plugin={plugin}
                            onDelete={handleDeleteClick}
                            index={index}
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
          >
            <DialogTitle>
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

            <DialogActions>
              <Button
                  onClick={handleDeleteCancel}
                  color="inherit"
                  variant="outlined"
              >
                {t('common:actions.cancel')}
              </Button>
              <Button
                  onClick={handleDeleteConfirm}
                  color="error"
                  variant="contained"
                  startIcon={deleteMutation.isPending && <CircularProgress size={16} color="inherit" />}
                  disabled={deleteMutation.isPending}
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