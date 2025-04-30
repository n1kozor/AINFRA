import React from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Avatar,
  Paper,
  Tooltip,
  alpha,
  useTheme,
  Badge,
} from '@mui/material';
import {
  CodeRounded as CodeIcon,
  DeleteRounded as DeleteIcon,
  EditRounded as EditIcon,
  VerifiedUserRounded as VerifiedIcon,
  VisibilityRounded as ViewIcon,
  CheckCircleRounded as CheckIcon,
  CancelRounded as CancelIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface PluginCardProps {
  plugin: any;
  onDelete: (id: number, event?: React.MouseEvent) => void;
  index: number;
  compact?: boolean;
}

const PluginCard: React.FC<PluginCardProps> = ({ plugin, onDelete, index, compact = false }) => {
  const { t } = useTranslation(['plugins', 'common']);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/plugins/${plugin.id}`);
  };

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
          borderRadius: '16px',
          transition: 'all 0.25s',
          overflow: 'hidden',
          cursor: 'pointer',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          bgcolor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(8px)',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 12px 20px ${alpha(theme.palette.common.black, 0.08)}`,
            borderColor: alpha(theme.palette.primary.main, 0.2),
          },
        }}
      >
        {/* Card Header */}
        <Box sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, transparent)`,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Avatar
              variant="rounded"
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                mr: 1.5,
              }}
            >
              <CodeIcon />
            </Avatar>

            <Box>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  fontSize: '1rem',
                  lineHeight: 1.2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                {plugin.name}
                {plugin.verified && (
                  <Tooltip title={t('plugins:verifiedPlugin')} arrow>
                    <VerifiedIcon sx={{ color: theme.palette.info.main, fontSize: '0.9rem' }} />
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
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
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
        </Box>

        {/* Card Content */}
        <Box sx={{ px: 2, py: 1.5, flexGrow: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: compact ? '1.5em' : '3em',
              lineHeight: 1.5,
            }}
          >
            {plugin.description || (
              <Box sx={{ fontStyle: 'italic', opacity: 0.7 }}>
                {t('plugins:noDescription')}
              </Box>
            )}
          </Typography>

          {plugin.author && !compact && (
            <Chip
              size="small"
              label={plugin.author}
              sx={{
                mt: 1.5,
                height: 22,
                fontSize: '0.75rem',
                bgcolor: alpha(theme.palette.info.main, 0.1),
                color: theme.palette.info.main,
                fontWeight: 500,
              }}
            />
          )}
        </Box>

        {/* Card Footer */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1.5,
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
                  mr: 0.5,
                  width: 28,
                  height: 28,
                  borderRadius: '8px',
                  bgcolor: alpha(theme.palette.info.main, 0.1),
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
                  mr: 0.5,
                  width: 28,
                  height: 28,
                  borderRadius: '8px',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
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
                  width: 28,
                  height: 28,
                  borderRadius: '8px',
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default PluginCard;