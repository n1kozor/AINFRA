// Plugins.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Paper,
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
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import PageContainer from '../../components/common/PageContainer';

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

  return (
    <PageContainer
      title={t('plugins:title')}
      actions={
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/plugins/new"
          startIcon={<AddIcon />}
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
        <Typography variant="subtitle1" fontWeight={500}>
          {t('plugins:pluginCount', { count: filteredPlugins.length })}
        </Typography>

        <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <TextField
            placeholder={t('common:actions.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ minWidth: '250px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            color: theme.palette.error.main,
            border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`
          }}
        >
          <Typography fontWeight={500}>
            {t('plugins:error.loading')}
          </Typography>
        </Paper>
      ) : filteredPlugins.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: 'center',
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <PluginIcon
            sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.2), mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            {searchQuery
              ? t('plugins:noPluginsFound')
              : t('plugins:noPluginsYet')}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {searchQuery
              ? t('plugins:tryDifferentSearch')
              : t('plugins:getStarted')}
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/plugins/new"
            startIcon={<AddIcon />}
          >
            {t('plugins:addFirstPlugin')}
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredPlugins.map((plugin) => (
            <Grid item xs={12} sm={6} md={4} key={plugin.id}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                  border: `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[2],
                    borderColor: 'transparent'
                  },
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    bgcolor: theme.palette.background.default
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 1,
                      borderRadius: '8px',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      mr: 2,
                    }}
                  >
                    <CodeIcon color="primary" />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600} component="div" noWrap>
                      {plugin.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      v{plugin.version}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={plugin.is_active ? t('plugins:active') : t('plugins:inactive')}
                    color={plugin.is_active ? 'success' : 'default'}
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ flexGrow: 1, p: 2 }}>
                  {plugin.description && (
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
                        height: '4.5em'
                      }}
                    >
                      {plugin.description}
                    </Typography>
                  )}

                  <Box sx={{ mt: 'auto' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      {plugin.author && (
                        <>
                          {t('plugins:author')}: <b>{plugin.author}</b>
                        </>
                      )}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    bgcolor: theme.palette.background.default
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    component={Link}
                    to={`/plugins/${plugin.id}`}
                    startIcon={<ViewIcon />}
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
                      sx={{ mr: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(plugin.id)}
                      aria-label={t('common:actions.delete')}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
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
      >
        <DialogTitle id="delete-dialog-title">
          {t('plugins:deletePlugin.title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {t('plugins:deletePlugin.warning')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            {t('common:actions.cancel')}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
            startIcon={
              deleteMutation.isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <DeleteIcon />
              )
            }
          >
            {t('common:actions.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Plugins;