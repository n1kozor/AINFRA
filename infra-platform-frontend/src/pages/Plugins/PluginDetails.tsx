import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  alpha,
  Grid,
  Paper,
  Avatar,
} from '@mui/material';
import {
  DeleteRounded as DeleteIcon,
  EditRounded as EditIcon,
  ArrowBackRounded as ArrowBackIcon,
  InfoOutlined as InfoIcon,
  CalendarTodayRounded as CalendarIcon,
  UpdateRounded as UpdateIcon,
  VerifiedUserRounded as VerifiedIcon,
  ExtensionRounded as PluginIcon,
  WarningAmberRounded as WarningIcon,
  CheckCircleRounded as CheckIcon,
  CancelRounded as CancelIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

import PageContainer from '../../components/common/PageContainer';
import PluginDetailTabs from '../../components/PluginPage/PluginDetailTabs';
import { usePlugin } from '../../hooks/plugins/usePlugins';
import { usePluginActions } from '../../hooks/plugins/usePluginActions';

const PluginDetails = () => {
  const { id } = useParams<{ id: string }>();
  const pluginId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  const { t } = useTranslation(['plugins', 'common']);
  const theme = useTheme();

  // Custom hooks
  const { data: plugin, isLoading, error } = usePlugin(pluginId);
  const {
    deleteMutation,
    deleteDialogOpen,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel
  } = usePluginActions();

  if (isLoading) {
    return (
      <PageContainer title={t('plugins:loading')}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10 }}>
          <CircularProgress size={50} sx={{ mb: 3 }} />
          <Typography variant="h6" color="text.secondary">
            {t('plugins:loadingPlugin')}
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  if (error || !plugin) {
    return (
      <PageContainer title={t('plugins:error.title')}>
        <Box sx={{ textAlign: 'center', p: 6 }}>
          <Avatar
            sx={{
              width: 70,
              height: 70,
              bgcolor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
              mx: 'auto',
              mb: 3,
            }}
          >
            <WarningIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h5" gutterBottom fontWeight={700}>
            {t('plugins:pluginNotFound')}
          </Typography>
          <Typography color="text.secondary" paragraph sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
            {t('plugins:pluginNotFoundMessage')}
          </Typography>
          <Button
            component={Link}
            to="/plugins"
            startIcon={<ArrowBackIcon />}
            variant="contained"
          >
            {t('common:actions.backToPlugins')}
          </Button>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={plugin.name}
      icon={<PluginIcon />}
      subtitle={`${t('plugins:pluginVersion')} ${plugin.version}`}
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
            sx={{ borderRadius: '10px' }}
          >
            {t('common:actions.edit')}
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteClick(pluginId)}
            sx={{ borderRadius: '10px' }}
          >
            {t('common:actions.delete')}
          </Button>
        </Box>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '16px',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            mb: 3
          }}
        >
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '12px',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  mr: 2
                }}
              >
                <PluginIcon sx={{ fontSize: 30 }} />
              </Avatar>

              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {plugin.name}
                  {plugin.verified && (
                    <VerifiedIcon
                      sx={{
                        ml: 1,
                        color: theme.palette.success.main,
                        fontSize: '1.1rem',
                        verticalAlign: 'middle'
                      }}
                    />
                  )}
                </Typography>

                <Box sx={{ display: 'flex', mt: 0.5 }}>
                  <Chip
                    label={`v${plugin.version}`}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  {plugin.is_active ? (
                    <Chip
                      icon={<CheckIcon />}
                      label={t('plugins:active')}
                      size="small"
                      color="success"
                    />
                  ) : (
                    <Chip
                      icon={<CancelIcon />}
                      label={t('plugins:inactive')}
                      size="small"
                      color="default"
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </Box>

          {plugin.description && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {t('plugins:description')}
              </Typography>
              <Typography variant="body2" paragraph>
                {plugin.description}
              </Typography>
            </Box>
          )}

          <Grid container spacing={3} sx={{ mb: 1 }}>
            {plugin.author && (
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '10px',
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        width: 36,
                        height: 36,
                        mr: 1.5,
                      }}
                    >
                      <InfoIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {t('plugins:author')}
                      </Typography>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {plugin.author}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            )}

            <Grid item xs={12} sm={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '10px',
                  bgcolor: alpha(theme.palette.background.paper, 0.5),
                  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main,
                      width: 36,
                      height: 36,
                      mr: 1.5,
                    }}
                  >
                    <CalendarIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('plugins:createdAt')}
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {formatDistanceToNow(new Date(plugin.created_at), { addSuffix: true })}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '10px',
                  bgcolor: alpha(theme.palette.background.paper, 0.5),
                  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.main,
                      width: 36,
                      height: 36,
                      mr: 1.5,
                    }}
                  >
                    <UpdateIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('plugins:updatedAt')}
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {formatDistanceToNow(new Date(plugin.updated_at), { addSuffix: true })}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            borderRadius: '16px',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            overflow: 'hidden'
          }}
        >
          <PluginDetailTabs plugin={plugin} />
        </Paper>

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
              {t('plugins:deletePlugin.confirmation', { name: plugin.name })}
            </DialogContentText>

            <Box sx={{
              mt: 2,
              p: 2,
              bgcolor: alpha(theme.palette.error.main, 0.05),
              borderRadius: '10px',
              border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`
            }}>
              <Typography variant="body2" color="error.main">
                {t('plugins:deletePlugin.warning')}
              </Typography>
            </Box>
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

export default PluginDetails;