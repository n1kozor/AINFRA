import React, { useState, useEffect } from 'react';
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
  Paper,
  IconButton,
  Tooltip,
  Avatar,
  Stack,
  Badge,
  LinearProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CodeRounded as CodeIcon,
  DeleteRounded as DeleteIcon,
  EditRounded as EditIcon,
  ArrowBackRounded as ArrowBackIcon,
  AccountTreeRounded as SchemaIcon,
  InfoOutlined as InfoIcon,
  GitHub as GitHubIcon,
  CalendarTodayRounded as CalendarIcon,
  UpdateRounded as UpdateIcon,
  VerifiedUserRounded as VerifiedIcon,
  FileCopyRounded as CopyIcon,
  DownloadRounded as DownloadIcon,
  MoreVertRounded as MoreIcon,
  TaskAltRounded as CheckIcon,
  ShareRounded as ShareIcon,
  BuildRounded as BuildIcon,
  SettingsRounded as SettingsIcon,
  ExtensionRounded as PluginIcon,
  CancelRounded as CancelIcon,
  ErrorOutlineRounded as WarningIcon,
  ContentCopyRounded as ClipboardIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import PageContainer from '../../components/common/PageContainer';
import { format, formatDistanceToNow } from 'date-fns';
import Editor from '@monaco-editor/react';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { motion, AnimatePresence } from 'framer-motion';

const PluginDetails = () => {
  const { id } = useParams<{ id: string }>();
  const pluginId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  const { t } = useTranslation(['plugins', 'common']);
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [schemaCopied, setSchemaCopied] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [fullScreenCode, setFullScreenCode] = useState(false);

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleCopyCode = () => {
    if (plugin) {
      navigator.clipboard.writeText(plugin.code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleCopySchema = () => {
    if (plugin?.ui_schema) {
      navigator.clipboard.writeText(JSON.stringify(plugin.ui_schema, null, 2));
      setSchemaCopied(true);
      setTimeout(() => setSchemaCopied(false), 2000);
    }
  };

  const handleDownloadCode = () => {
    if (plugin) {
      const element = document.createElement('a');
      const file = new Blob([plugin.code], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${plugin.name.replace(/\s+/g, '_').toLowerCase()}_v${plugin.version}.py`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    handleMenuClose();
  };

  const handleDownloadSchema = () => {
    if (plugin?.ui_schema) {
      const element = document.createElement('a');
      const file = new Blob([JSON.stringify(plugin.ui_schema, null, 2)], { type: 'application/json' });
      element.href = URL.createObjectURL(file);
      element.download = `${plugin.name.replace(/\s+/g, '_').toLowerCase()}_schema_v${plugin.version}.json`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    handleMenuClose();
  };

  if (isLoading) {
    return (
      <PageContainer title={t('plugins:loading')}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10 }}>
          <CircularProgress size={60} thickness={4} sx={{
            color: theme.palette.primary.main,
            mb: 3,
          }} />
          <Typography variant="h6" sx={{ color: alpha(theme.palette.text.primary, 0.7) }}>
            {t('plugins:loadingPlugin')}
          </Typography>
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
              {t('plugins:pluginNotFound')}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              {t('plugins:pluginNotFoundMessage')}
            </Typography>

            <Button
              component={Link}
              to="/plugins"
              startIcon={<ArrowBackIcon />}
              variant="contained"
              color="primary"
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
              {t('common:actions.backToPlugins')}
            </Button>
          </Box>
        </DashboardCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={plugin.name}
      icon={<PluginIcon sx={{ fontSize: 26 }} />}
      subtitle={`${t('plugins:pluginVersion')} ${plugin.version}`}
      breadcrumbs={[
        { text: t('common:navigation.dashboard'), link: '/' },
        { text: t('common:navigation.plugins'), link: '/plugins' },
        { text: plugin.name },
      ]}
      tags={plugin.tags || []}
      actions={
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title={t('common:actions.more')} arrow>
            <IconButton
              sx={{
                borderRadius: '12px',
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                width: 42,
                height: 42,
                '&:hover': {
                  bgcolor: alpha(theme.palette.background.paper, 0.9),
                },
              }}
              onClick={handleMenuOpen}
            >
              <MoreIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            component={Link}
            to={`/plugins/${pluginId}/edit`}
            sx={{
              fontWeight: 600,
              px: 3,
              py: 1.2,
              borderRadius: '14px',
              borderWidth: '1px',
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
              '&:hover': {
                borderWidth: '1px',
                transform: 'translateY(-3px)',
                boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
              }
            }}
          >
            {t('common:actions.edit')}
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
            sx={{
              fontWeight: 600,
              px: 3,
              py: 1.2,
              borderRadius: '14px',
              boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.2)}`,
              background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: `0 6px 16px ${alpha(theme.palette.error.main, 0.3)}`,
              }
            }}
          >
            {t('common:actions.delete')}
          </Button>
        </Box>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <DashboardCard
          title={t('plugins:details')}
          icon={<CodeIcon />}
          color="primary"
          variant="glass"
          action={
            plugin.is_active ? (
              <Badge
                variant="dot"
                sx={{
                  '& .MuiBadge-dot': {
                    backgroundColor: theme.palette.success.main,
                    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                  }
                }}
              >
                <Chip
                  label={t('plugins:active')}
                  color="success"
                  icon={<CheckIcon />}
                  sx={{
                    fontWeight: 600,
                    px: 1,
                    height: 32,
                    borderRadius: '10px',
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                    '& .MuiChip-icon': {
                      color: theme.palette.success.main,
                    }
                  }}
                />
              </Badge>
            ) : (
              <Chip
                label={t('plugins:inactive')}
                color="default"
                icon={<CancelIcon />}
                sx={{
                  fontWeight: 600,
                  px: 1,
                  height: 32,
                  borderRadius: '10px',
                  bgcolor: alpha(theme.palette.text.secondary, 0.1),
                  color: theme.palette.text.secondary,
                  border: `1px solid ${alpha(theme.palette.text.secondary, 0.2)}`,
                  '& .MuiChip-icon': {
                    color: theme.palette.text.secondary,
                  }
                }}
              />
            )
          }
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
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '16px',
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2.5,
                    color: theme.palette.primary.main,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05) rotate(5deg)',
                      boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.25)}`,
                    }
                  }}
                >
                  <CodeIcon sx={{ fontSize: 36 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={800} color="primary" sx={{
                    mb: 0.5,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    {plugin.name}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip
                      label={`v${plugin.version}`}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        borderRadius: '8px',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      }}
                    />
                    {plugin.api_version && (
                      <Chip
                        label={`API v${plugin.api_version}`}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          borderRadius: '8px',
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                          color: theme.palette.info.main,
                          border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                        }}
                      />
                    )}
                  </Stack>
                </Box>
              </Box>

              {plugin.verified && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: alpha(theme.palette.success.main, 0.08),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                    borderRadius: '12px',
                    px: 2,
                    py: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 14px ${alpha(theme.palette.success.main, 0.15)}`,
                    }
                  }}
                >
                  <VerifiedIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                  <Typography variant="subtitle2" fontWeight={600} color="success.main">
                    {t('plugins:verifiedPlugin')}
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3, opacity: 0.3 }} />

            <Grid container spacing={3}>
              {plugin.author && (
                <Grid item xs={12} sm={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: '16px',
                      bgcolor: alpha(theme.palette.background.paper, 0.5),
                      border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: `0 6px 20px ${alpha(theme.palette.common.black, 0.06)}`,
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          width: 48,
                          height: 48,
                          mr: 2,
                        }}
                      >
                        <GitHubIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {t('plugins:author')}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={700}>
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
                    p: 3,
                    borderRadius: '16px',
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: `0 6px 20px ${alpha(theme.palette.common.black, 0.06)}`,
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                        width: 48,
                        height: 48,
                        mr: 2,
                      }}
                    >
                      <CalendarIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {t('plugins:createdAt')}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={700}>
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
                    p: 3,
                    borderRadius: '16px',
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: `0 6px 20px ${alpha(theme.palette.common.black, 0.06)}`,
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        color: theme.palette.secondary.main,
                        width: 48,
                        height: 48,
                        mr: 2,
                      }}
                    >
                      <UpdateIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {t('plugins:updatedAt')}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {formatDistanceToNow(new Date(plugin.updated_at), { addSuffix: true })}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {plugin.description && (
              <>
                <Divider sx={{ my: 3, opacity: 0.3 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    {t('plugins:description')}
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: '16px',
                      bgcolor: alpha(theme.palette.background.paper, 0.3),
                      border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Typography variant="body1" sx={{ lineHeight: 1.7, color: alpha(theme.palette.text.primary, 0.87) }}>
                      {plugin.description}
                    </Typography>
                  </Paper>
                </Box>
              </>
            )}
          </Box>
        </DashboardCard>

        <Box sx={{ mt: 4, mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="plugin tabs"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                py: 2,
                px: 3,
                transition: 'all 0.2s',
                borderRadius: '16px 16px 0 0',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                },
                mx: 0.5,
                '&:first-of-type': {
                  ml: 0,
                }
              },
              '& .Mui-selected': {
                color: `${theme.palette.primary.main} !important`,
                bgcolor: `${alpha(theme.palette.primary.main, 0.08)} !important`,
              },
              '& .MuiTabs-indicator': {
                height: 4,
                borderRadius: '4px 4px 0 0',
              },
            }}
          >
            <Tab
              icon={<CodeIcon sx={{ fontSize: '1.3rem' }} />}
              iconPosition="start"
              label={t('plugins:tabs.code')}
            />
            <Tab
              icon={<SchemaIcon sx={{ fontSize: '1.3rem' }} />}
              iconPosition="start"
              label={t('plugins:tabs.uiSchema')}
            />
          </Tabs>
        </Box>

        <AnimatePresence mode="wait">
          {tabValue === 0 && (
            <motion.div
              key="code-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DashboardCard noPadding variant="glass">
                <Box
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                        mr: 2,
                      }}
                    >
                      <CodeIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {t('plugins:pluginCode')}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={codeCopied ? t('plugins:copied') : t('plugins:copy')} arrow>
                      <IconButton
                        onClick={handleCopyCode}
                        sx={{
                          borderRadius: '10px',
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          color: theme.palette.primary.main,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.15),
                          }
                        }}
                      >
                        {codeCopied ? <CheckIcon /> : <ClipboardIcon />}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={t('plugins:download')} arrow>
                      <IconButton
                        onClick={handleDownloadCode}
                        sx={{
                          borderRadius: '10px',
                          bgcolor: alpha(theme.palette.secondary.main, 0.08),
                          color: theme.palette.secondary.main,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.secondary.main, 0.15),
                          }
                        }}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Box
                  sx={{
                    position: 'relative',
                    '&:hover .code-actions': {
                      opacity: 1,
                    },
                  }}
                >
                  <Editor
                    height="65vh"
                    language="python"
                    value={plugin.code}
                    theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
                    options={{
                      readOnly: true,
                      minimap: { enabled: true },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      wordWrap: 'on',
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                      fontLigatures: true,
                    }}
                  />
                </Box>
              </DashboardCard>
            </motion.div>
          )}

          {tabValue === 1 && (
            <motion.div
              key="schema-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DashboardCard noPadding variant="glass">
                <Box
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        color: theme.palette.warning.main,
                        mr: 2,
                      }}
                    >
                      <SchemaIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {t('plugins:uiSchema')}
                    </Typography>
                  </Box>

                  {plugin.ui_schema && Object.keys(plugin.ui_schema).length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title={schemaCopied ? t('plugins:copied') : t('plugins:copy')} arrow>
                        <IconButton
                          onClick={handleCopySchema}
                          sx={{
                            borderRadius: '10px',
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            color: theme.palette.primary.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.15),
                            }
                          }}
                        >
                          {schemaCopied ? <CheckIcon /> : <ClipboardIcon />}
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={t('plugins:download')} arrow>
                        <IconButton
                          onClick={handleDownloadSchema}
                          sx={{
                            borderRadius: '10px',
                            bgcolor: alpha(theme.palette.secondary.main, 0.08),
                            color: theme.palette.secondary.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.secondary.main, 0.15),
                            }
                          }}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>

                {plugin.ui_schema && Object.keys(plugin.ui_schema).length > 0 ? (
                  <Editor
                    height="65vh"
                    language="json"
                    value={JSON.stringify(plugin.ui_schema, null, 2)}
                    theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
                    options={{
                      readOnly: true,
                      minimap: { enabled: true },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      wordWrap: 'on',
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                      fontLigatures: true,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      p: 8,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                        mb: 3,
                      }}
                    >
                      <InfoIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h5" color="text.primary" fontWeight={700} textAlign="center" gutterBottom>
                      {t('plugins:noUiSchema')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" textAlign="center" sx={{
                      mt: 1,
                      maxWidth: 600
                    }}>
                      {t('plugins:noUiSchemaDescription')}
                    </Typography>
                  </Box>
                )}
              </DashboardCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Options Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              minWidth: 200,
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
          <MenuItem
            onClick={() => { handleDownloadCode(); handleMenuClose(); }}
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
              <DownloadIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText>
              {t('plugins:downloadCode')}
            </ListItemText>
          </MenuItem>

          {plugin.ui_schema && Object.keys(plugin.ui_schema).length > 0 && (
            <MenuItem
              onClick={() => { handleDownloadSchema(); handleMenuClose(); }}
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
                <SchemaIcon fontSize="small" color="warning" />
              </ListItemIcon>
              <ListItemText>
                {t('plugins:downloadSchema')}
              </ListItemText>
            </MenuItem>
          )}

          <MenuItem
            onClick={() => { window.open(`${window.location.origin}/api/plugins/${pluginId}`, '_blank'); handleMenuClose(); }}
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
              <BuildIcon fontSize="small" color="info" />
            </ListItemIcon>
            <ListItemText>
              {t('plugins:viewApi')}
            </ListItemText>
          </MenuItem>

          <MenuItem
            onClick={() => { navigator.clipboard.writeText(window.location.href); handleMenuClose(); }}
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
              <ShareIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>
              {t('plugins:sharePlugin')}
            </ListItemText>
          </MenuItem>

          <Divider sx={{ my: 1, mx: 2, opacity: 0.6 }} />

          <MenuItem
            onClick={() => { handleDeleteClick(); handleMenuClose(); }}
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
            <ListItemText>
              {t('common:actions.delete')}
            </ListItemText>
          </MenuItem>
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
              <DialogContentText id="delete-dialog-description" sx={{ mb: 3, mt: 1 }}>
                {t('plugins:deletePlugin.confirmation', { name: plugin.name })}
              </DialogContentText>

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

export default PluginDetails;