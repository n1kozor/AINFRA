// PluginDetails.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
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
  Grid,
} from '@mui/material';
import {
  Code as CodeIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Schema as SchemaIcon,
  Info as InfoIcon,
  GitHub as GitHubIcon,
  CalendarToday as CalendarIcon,
  Update as UpdateIcon,
  VerifiedUser as VerifiedIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import PageContainer from '../../components/common/PageContainer';
import { format } from 'date-fns';
import Editor from '@monaco-editor/react';
import DashboardCard from '../../components/dashboard/DashboardCard';

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
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress size={50} thickness={4} sx={{ color: theme.palette.primary.main }} />
        </Box>
      </PageContainer>
    );
  }

  if (error || !plugin) {
    return (
      <PageContainer title={t('plugins:error.title')}>
        <DashboardCard
          title={t('plugins:error.title')}
          icon={<InfoIcon />}
          color="error"
        >
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              {t('plugins:pluginNotFound')}
            </Typography>
            <Button
              component={Link}
              to="/plugins"
              startIcon={<ArrowBackIcon />}
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                px: 4,
                py: 1.2,
                borderRadius: '12px',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                }
              }}
            >
              {t('common:actions.back')}
            </Button>
          </Box>
        </DashboardCard>
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            component={Link}
            to={`/plugins/${pluginId}/edit`}
            sx={{
              fontWeight: 600,
              px: 3,
              py: 1.2,
              borderRadius: '12px',
              borderWidth: '2px',
              '&:hover': {
                borderWidth: '2px',
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[2],
              }
            }}
          >
            {t('common:actions.edit')}
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
            sx={{
              fontWeight: 600,
              px: 3,
              py: 1.2,
              borderRadius: '12px',
              borderWidth: '2px',
              '&:hover': {
                borderWidth: '2px',
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[2],
              }
            }}
          >
            {t('common:actions.delete')}
          </Button>
        </Box>
      }
    >
      <DashboardCard
        title={t('plugins:details')}
        icon={<CodeIcon />}
        color="primary"
        subtitle={`v${plugin.version}`}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '14px',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2.5,
                  color: theme.palette.primary.main,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                  }
                }}
              >
                <CodeIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700}>{plugin.name}</Typography>
                <Typography variant="body1" color="text.secondary">
                  v{plugin.version}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Chip
                label={plugin.is_active ? t('plugins:active') : t('plugins:inactive')}
                color={plugin.is_active ? 'success' : 'default'}
                sx={{
                  fontWeight: 600,
                  px: 1,
                  height: 32,
                  borderRadius: '8px',
                  bgcolor: plugin.is_active ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.grey[500], 0.1),
                  color: plugin.is_active ? theme.palette.success.dark : theme.palette.grey[600],
                  border: `1px solid ${plugin.is_active ? alpha(theme.palette.success.main, 0.3) : alpha(theme.palette.grey[500], 0.2)}`,
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3, opacity: 0.6 }} />

          <Grid container spacing={3}>
            {plugin.author && (
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <GitHubIcon sx={{
                    color: alpha(theme.palette.text.secondary, 0.8),
                    fontSize: 20,
                    mr: 1.5,
                  }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {t('plugins:author')}
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {plugin.author}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon sx={{
                  color: alpha(theme.palette.text.secondary, 0.8),
                  fontSize: 20,
                  mr: 1.5,
                }} />
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {t('plugins:createdAt')}
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {format(new Date(plugin.created_at), 'PPP')}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <UpdateIcon sx={{
                  color: alpha(theme.palette.text.secondary, 0.8),
                  fontSize: 20,
                  mr: 1.5,
                }} />
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {t('plugins:updatedAt')}
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {format(new Date(plugin.updated_at), 'PPP')}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {plugin.description && (
            <>
              <Divider sx={{ my: 3, opacity: 0.6 }} />
              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  {t('plugins:description')}
                </Typography>
                <Typography variant="body1" sx={{ py: 1 }}>
                  {plugin.description}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </DashboardCard>

      <Box sx={{ mt: 3, mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="plugin tabs"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              py: 2,
              transition: 'all 0.2s',
              borderRadius: '10px 10px 0 0',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              },
            },
            '& .Mui-selected': {
              color: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '2px 2px 0 0',
            },
          }}
        >
          <Tab
            icon={<CodeIcon sx={{ fontSize: '1.1rem' }} />}
            iconPosition="start"
            label={t('plugins:tabs.code')}
          />
          <Tab
            icon={<SchemaIcon sx={{ fontSize: '1.1rem' }} />}
            iconPosition="start"
            label={t('plugins:tabs.uiSchema')}
          />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <DashboardCard noPadding>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.8)}`
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '8px',
                backgroundColor: alpha(theme.palette.info.main, 0.1),
                mr: 2
              }}
            >
              <CodeIcon fontSize="small" sx={{ color: theme.palette.info.main }} />
            </Box>
            <Typography variant="subtitle1" fontWeight={600}>
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
        </DashboardCard>
      )}

      {tabValue === 1 && (
        <DashboardCard noPadding>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.8)}`
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '8px',
                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                mr: 2
              }}
            >
              <SchemaIcon fontSize="small" sx={{ color: theme.palette.warning.main }} />
            </Box>
            <Typography variant="subtitle1" fontWeight={600}>
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
                p: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <InfoIcon
                sx={{
                  fontSize: 64,
                  color: alpha(theme.palette.text.secondary, 0.2),
                  mb: 2,
                  p: 1,
                  borderRadius: '50%',
                  backgroundColor: alpha(theme.palette.text.secondary, 0.05),
                }}
              />
              <Typography variant="h6" color="text.secondary" fontWeight={500}>
                {t('plugins:noUiSchema')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t('plugins:noUiSchemaDescription')}
              </Typography>
            </Box>
          )}
        </DashboardCard>
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
          <DialogContentText id="delete-dialog-description" sx={{ mb: 2 }}>
            {t('plugins:deletePlugin.confirmation', { name: plugin.name })}
          </DialogContentText>
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

export default PluginDetails;