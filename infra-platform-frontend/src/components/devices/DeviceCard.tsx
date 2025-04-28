import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  CardActionArea,
  CardActions,
  useTheme,
  alpha,
  Divider,
} from '@mui/material';
import {
  Computer as StandardIcon,
  SmartToy as CustomIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as OnlineIcon,
  Cancel as OfflineIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Device } from '../../types/device';
import { format } from 'date-fns';

interface DeviceCardProps {
  device: Device;
  onDelete?: (id: number) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onDelete }) => {
  const { t } = useTranslation(['devices', 'common']);
  const navigate = useNavigate();
  const theme = useTheme();

  const isStandard = device.type === 'standard';
  const DeviceIcon = isStandard ? StandardIcon : CustomIcon;
  const deviceTypeLabel = isStandard
    ? t('devices:deviceTypes.standard')
    : t('devices:deviceTypes.custom');

  const primaryColor = theme.palette.primary.main;
  const secondaryColor = theme.palette.secondary.main;
  const iconColor = isStandard ? primaryColor : secondaryColor;

  const handleCardClick = () => {
    navigate(`/devices/${device.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/devices/${device.id}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(device.id);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardActionArea onClick={handleCardClick} sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            bgcolor: alpha(iconColor, 0.08),
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: alpha(iconColor, 0.12),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: iconColor,
              mr: 2,
            }}
          >
            <DeviceIcon />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div" noWrap>
              {device.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {device.ip_address}
            </Typography>
          </Box>
          <Chip
            size="small"
            label={deviceTypeLabel}
            color={isStandard ? 'primary' : 'secondary'}
            variant="outlined"
          />
        </Box>

        <Divider />

        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            {device.is_active ? (
              <Tooltip title={t('common:status.online')}>
                <OnlineIcon fontSize="small" color="success" sx={{ mr: 1 }} />
              </Tooltip>
            ) : (
              <Tooltip title={t('common:status.offline')}>
                <OfflineIcon fontSize="small" color="error" sx={{ mr: 1 }} />
              </Tooltip>
            )}
            <Typography variant="body2" color="text.secondary">
              {device.is_active
                ? t('devices:status.active')
                : t('devices:status.inactive')}
            </Typography>
          </Box>

          {device.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {device.description}
            </Typography>
          )}

          <Box sx={{ mt: 2 }}>
            {isStandard && device.standard_device && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {t('devices:osType')}: {
                  t(`devices:osTypes.${device.standard_device.os_type}`)
                }
              </Typography>
            )}

            {!isStandard && device.custom_device && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {t('devices:plugin')}: {device.custom_device.plugin_name}
              </Typography>
            )}

            <Typography variant="body2" color="text.secondary" noWrap>
              {t('devices:added')}: {format(new Date(device.created_at), 'PPP')}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>

      <Divider />

      <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
        <Tooltip title={t('common:actions.edit')}>
          <IconButton size="small" onClick={handleEditClick} aria-label="edit">
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title={t('common:actions.delete')}>
          <IconButton
            size="small"
            onClick={handleDeleteClick}
            aria-label="delete"
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default DeviceCard;