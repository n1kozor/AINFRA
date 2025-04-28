// Plugins.tsx
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
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Extension as PluginIcon,
  Code as CodeIcon,
  Visibility as ViewIcon,
  VerifiedUser as VerifiedIcon,
  FilterList as FilterIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import PageContainer from '../../components/common/PageContainer';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { format } from 'date-fns';

const Plugins = () => {
  const { t } = useTranslation(['plugins', 'common']);
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPluginId, setSelectedPluginId] = useState<number | null>(null);

  // Fetch plugins
  const {
    data: plugins,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['plugins'],
    queryFn: api.plugins.getAll,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.plugins.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plugins'] });
      setDeleteDialogOpen(false);
    },
  });

  const handleDeleteClick = (id: number) => {
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

  // Filter plugins by search query
  const filteredPlugins = plugins
    ? plugins.filter(
        (plugin) =>
          plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          plugin.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Get the selected plugin for the delete dialog
  const selectedPlugin = selectedPluginId !== null
    ? plugins?.find(p => p.id === selectedPluginId)
    : null;

  return (
    <PageContainer
      title={t('plugins:title')}
      breadcrumbs={[
        { text: t('common:navigation.dashboard'), link: '/' },
        { text: t('common:navigation.plugins') },
      ]}
      actions={
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/plugins/new"
          startIcon={<AddIcon />}
          sx={{
            px: 3,
            py: 1.2,
            borderRadius: '12px',
            fontWeight: 600,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[4],
            }
          }}
        >
          {t('plugins:addPlugin')}
        </Button>
      }
    >
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              borderRadius: '12px',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              p: 1,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <PluginIcon />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            {t('plugins:pluginCount', { count: filteredPlugins.length })}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            width: { xs: '100%', sm: 'auto' },
            mt: { xs: 1, sm: 0 }
          }}
        >
          <TextField
            placeholder={t('common:actions.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{
              minWidth: '250px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                transition: 'all 0.2s',
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
            }}
          />

          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            sx={{
              borderRadius: '12px',
              borderWidth: '2px',
              px: 2,
              '&:hover': {
                borderWidth: '2px',
              }
            }}
          >
            {t('plugins:filter')}
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress size={50} thickness={4} sx={{ color: theme.palette.primary.main }} />
        </Box>
      ) : error ? (
        <DashboardCard
          title={t('plugins:error.title')}
          icon={<InfoIcon />}
          color="error"
        >
          <Box sx={{ p: 3 }}>
            <Typography fontWeight={500}>
              {t('plugins:error.loading')}
            </Typography>
          </Box>
        </DashboardCard>
      ) : filteredPlugins.length === 0 ? (
        <DashboardCard>
          <Box
            sx={{
              p: 6,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <PluginIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
            </Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {searchQuery
                ? t('plugins:noPluginsFound')
                : t('plugins:noPluginsYet')}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              {searchQuery
                ? t('plugins:tryDifferentSearch')
                : t('plugins:getStarted')}
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/plugins/new"
              startIcon={<AddIcon />}
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: '12px',
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                }
              }}
            >
              {t('plugins:addFirstPlugin')}
            </Button>
          </Box>
        </DashboardCard>
      ) : (
        <Grid container spacing={3}>
          {filteredPlugins.map((plugin) => (
            <Grid item xs={12} sm={6} md={4} key={plugin.id}>
              <DashboardCard
                title={plugin.name}
                subtitle={`v${plugin.version}`}
                icon={<CodeIcon />}
                color="primary"
                noPadding
                action={
                  <Chip
                    size="small"
                    label={plugin.is_active ? t('plugins:active') : t('plugins:inactive')}
                    color={plugin.is_active ? 'success' : 'default'}
                    sx={{
                      fontWeight: 600,
                      bgcolor: plugin.is_active
                        ? alpha(theme.palette.success.main, 0.1)
                        : alpha(theme.palette.grey[500], 0.1),
                      color: plugin.is_active
                        ? theme.palette.success.dark
                        : theme.palette.grey[600],
                    }}
                  />
                }
              >
                <Box sx={{ p: 2, flexGrow: 1 }}>
                  {plugin.description ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        minHeight: '4.5em'
                      }}
                    >
                      {plugin.description}
                    </Typography>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        fontStyle: 'italic',
                        color: alpha(theme.palette.text.secondary, 0.7),
                        mb: 2,
                        minHeight: '4.5em'
                      }}
                    >
                      {t('plugins:noDescription')}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {plugin.author && (
                      <Chip
                        size="small"
                        label={plugin.author}
                        sx={{
                          mr: 1,
                          height: 24,
                          fontSize: '0.75rem',
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                          color: theme.palette.info.main,
                          fontWeight: 500,
                        }}
                      />
                    )}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 'auto', fontWeight: 500 }}
                    >
                      {format(new Date(plugin.updated_at), 'PPP')}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: `1px solid ${theme.palette.divider}`,
                    bgcolor: alpha(theme.palette.background.default, 0.7),
                    p: 1.5,
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    component={Link}
                    to={`/plugins/${plugin.id}`}
                    startIcon={<ViewIcon />}
                    sx={{
                      borderRadius: '10px',
                      fontWeight: 600,
                      px: 2,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      }
                    }}
                  >
                    {t('plugins:view')}
                  </Button>

                  <Box>
                    <IconButton
                      size="small"
                      color="primary"
                      component={Link}
                      to={`/plugins/${plugin.id}/edit`}
                      aria-label={t('common:actions.edit')}
                      sx={{
                        mr: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.2),
                        }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(plugin.id)}
                      aria-label={t('common:actions.delete')}
                      sx={{
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.error.main, 0.2),
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </DashboardCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: theme.shadows[10],
            width: '100%',
            maxWidth: 480,
          }
        }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ pb: 1, pt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DeleteIcon sx={{ color: theme.palette.error.main, mr: 1.5 }} />
            <Typography variant="h5" component="span" fontWeight={600}>
              {t('plugins:deletePlugin.title')}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPlugin && (
            <DialogContentText id="delete-dialog-description" sx={{ mb: 2 }}>
              {t('plugins:deletePlugin.confirmation', { name: selectedPlugin.name })}
            </DialogContentText>
          )}
          <Box
            sx={{
              p: 2,
              borderRadius: '12px',
              bgcolor: alpha(theme.palette.error.main, 0.08),
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <VerifiedIcon sx={{ color: theme.palette.error.main, mr: 1.5 }} />
            <DialogContentText sx={{ color: theme.palette.error.main, m: 0 }}>
              {t('plugins:deletePlugin.warning')}
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button
            onClick={handleDeleteCancel}
            color="inherit"
            variant="outlined"
            sx={{
              borderRadius: '10px',
              px: 3,
              py: 1,
              fontWeight: 600,
              borderWidth: '2px',
              '&:hover': {
                borderWidth: '2px',
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
              borderRadius: '10px',
              px: 3,
              py: 1,
              fontWeight: 600,
              boxShadow: theme.shadows[5],
              '&:hover': {
                boxShadow: theme.shadows[8],
                transform: 'translateY(-2px)',
              }
            }}
          >
            {t('common:actions.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Plugins;