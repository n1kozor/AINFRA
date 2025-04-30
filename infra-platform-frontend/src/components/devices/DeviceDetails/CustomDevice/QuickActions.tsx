import React from 'react';
import { Box, Button, Paper, Typography, alpha, useTheme } from '@mui/material';
import {
  PowerSettingsNew as PowerIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  Update as UpdateIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Code as CodeIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { QuickActionsProps } from './types';

const QuickActions: React.FC<QuickActionsProps> = ({ actions, onAction, isLoading }) => {
  const theme = useTheme();
  const { t } = useTranslation(['devices', 'common']);

  // Get button props based on variant
  const getButtonProps = (variant = 'primary') => {
    const variants: any = {
      primary: {
        variant: 'contained',
        color: 'primary',
        sx: { borderRadius: 2 }
      },
      secondary: {
        variant: 'outlined',
        color: 'secondary',
        sx: { borderRadius: 2 }
      },
      warning: {
        variant: 'contained',
        color: 'warning',
        sx: { borderRadius: 2 }
      },
      error: {
        variant: 'contained',
        color: 'error',
        sx: { borderRadius: 2 }
      },
      success: {
        variant: 'contained',
        color: 'success',
        sx: { borderRadius: 2 }
      }
    };

    return variants[variant] || variants.primary;
  };

  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    const icons: any = {
      power: <PowerIcon />,
      settings: <SettingsIcon />,
      restart: <RefreshIcon />,
      update: <UpdateIcon />,
      warning: <WarningIcon />,
      info: <InfoIcon />,
      code: <CodeIcon />,
      play: <PlayIcon />
    };

    return icons[iconName] || null;
  };

  if (!actions || actions.length === 0) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}
    >
      <Typography variant="subtitle1" sx={{ mr: 2, fontWeight: 500 }}>
        {t('devices:quickActions')}:
      </Typography>

      {actions.map((button, index) => {
        const buttonProps = getButtonProps(button.variant);
        const icon = button.icon ? getIconComponent(button.icon) : null;

        return (
          <Button
            key={index}
            {...buttonProps}
            startIcon={icon}
            onClick={() => onAction(button.action, button.confirm || false)}
            disabled={isLoading}
          >
            {button.title}
          </Button>
        );
      })}
    </Paper>
  );
};

export default QuickActions;