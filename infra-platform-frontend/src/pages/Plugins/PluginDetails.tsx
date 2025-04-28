import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Paper,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Code as CodeIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Schema as SchemaIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import PageContainer from '../../components/common/PageContainer';
import { format } from 'date-fns';
import Editor from '@monaco-editor/react';

const PluginDetails = () => {
  const { id } = useParams<{ id: string }>();
  const pluginId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  const { t } = useTranslation(['plugins', 'common']);
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch plugin data
  const { data: plugin, isLoading, error } = useQuery({
    queryKey: ['plugin', pluginId],
    queryFn: () => api.plugins.getById(pluginId),
    enabled: !!pluginId,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.plugins.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plugins'] });
      navigate('/plugins');
    },
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(pluginId);
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <PageContainer title={t('plugins:loading')}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (error || !plugin) {
    return (
      <PageContainer title={t('plugins:error.title')}>
        <Box sx={{ p: 3, bgcolor: alpha(theme.palette.error.main, 0.1), borderRadius: 1 }}>
          <Typography color="error">
            {t('plugins:pluginNotFound')}
          </Typography>
          <Button
            component={Link}
            to="/plugins"
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            {t('common:actions.back')}
          </Button>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={plugin.name}
      breadcrumbs={[
        { text: t('common:navigation.dashboard'), link: '/' },
        { text: t('common:navigation.plugins'), link: '/plugins' },
        { text: plugin.name },
      ]}
      actions={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            component={Link}
            to={`/plugins/${pluginId}/edit`}
          >
            {t('common:actions.edit')}
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
          >
            {t('common:actions.delete')}
          </Button>
        </Box>
      }
    >
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                color: theme.palette.primary.main,
              }}
            >
              <CodeIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h5">{plugin.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                v{plugin.version}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={plugin.is_active ? t('plugins:active') : t('plugins:inactive')}
              color={plugin.is_active ? 'success' : 'default'}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          {plugin.author && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('plugins:author')}
              </Typography>
              <Typography variant="body1">{plugin.author}</Typography>
            </Box>
          )}

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('plugins:createdAt')}
            </Typography>
            <Typography variant="body1">
              {format(new Date(plugin.created_at), 'PPP')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('plugins:updatedAt')}
            </Typography>
            <Typography variant="body1">
              {format(new Date(plugin.updated_at), 'PPP')}
            </Typography>
          </Box>
        </Box>

        {plugin.description && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('plugins:description')}
              </Typography>
              <Typography variant="body1">{plugin.description}</Typography>
            </Box>
          </>
        )}
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="plugin tabs"
        >
          <Tab
            icon={<CodeIcon fontSize="small" />}
            iconPosition="start"
            label={t('plugins:tabs.code')}
          />
          <Tab
            icon={<SchemaIcon fontSize="small" />}
            iconPosition="start"
            label={t('plugins:tabs.uiSchema')}
          />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              p: 1.5,
              bgcolor: alpha(theme.palette.background.default, 0.5),
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CodeIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">
              {t('plugins:pluginCode')}
            </Typography>
          </Box>

          <Editor
            height="60vh"
            language="python"
            value={plugin.code}
            theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
            options={{
              readOnly: true,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              fontSize: 14,
              wordWrap: 'on',
            }}
          />
        </Paper>
      )}

      {tabValue === 1 && (
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              p: 1.5,
              bgcolor: alpha(theme.palette.background.default, 0.5),
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <SchemaIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">
              {t('plugins:uiSchema')}
            </Typography>
          </Box>

          {plugin.ui_schema && Object.keys(plugin.ui_schema).length > 0 ? (
            <Editor
              height="60vh"
              language="json"
              value={JSON.stringify(plugin.ui_schema, null, 2)}
              theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
              options={{
                readOnly: true,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                fontSize: 14,
                wordWrap: 'on',
              }}
            />
          ) : (
            <Box
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <InfoIcon
                sx={{ fontSize: 48, color: alpha(theme.palette.text.secondary, 0.3), mb: 2 }}
              />
              <Typography variant="body1" color="text.secondary">
                {t('plugins:noUiSchema')}
              </Typography>
            </Box>
          )}
        </Paper>
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
            {t('plugins:deletePlugin.confirmation', { name: plugin.name })}
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, color: 'error.main' }}>
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
            startIcon={
              deleteMutation.isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <DeleteIcon />
              )
            }
            disabled={deleteMutation.isPending}
          >
            {t('common:actions.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default PluginDetails;