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
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
          cursor: 'pointer',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Avatar variant="rounded" sx={{ mr: 1.5 }}>
              <CodeIcon />
            </Avatar>

            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1rem', lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {plugin.name}
                {plugin.verified && (
                  <Tooltip title={t('plugins:verifiedPlugin')} arrow>
                    <VerifiedIcon sx={{ fontSize: '0.9rem' }} />
                  </Tooltip>
                )}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <Chip
                  size="small"
                  label={`v${plugin.version}`}
                  sx={{ mr: 1 }}
                />

                <Badge
                  variant="dot"
                  invisible={!plugin.is_active}
                  sx={{
                    '& .MuiBadge-dot': {
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                    }
                  }}
                >
                  <Chip
                    size="small"
                    label={plugin.is_active ? t('plugins:active') : t('plugins:inactive')}
                    color={plugin.is_active ? "success" : "default"}
                  />
                </Badge>
              </Box>
            </Box>
          </Box>
        </Box>

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
              sx={{ mt: 1.5 }}
              color="info"
            />
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1.5,
            mt: 'auto',
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
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
              >
                <ViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title={t('common:actions.edit')} arrow>
              <IconButton
                size="small"
                color="primary"
                onClick={(e) => { e.stopPropagation(); navigate(`/plugins/${plugin.id}/edit`); }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title={t('common:actions.delete')} arrow>
              <IconButton
                size="small"
                color="error"
                onClick={(e) => onDelete(plugin.id, e)}
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