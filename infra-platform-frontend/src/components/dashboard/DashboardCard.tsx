// DashboardCard.tsx
import React, { ReactNode } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  CardHeader,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  children: ReactNode;
  action?: ReactNode;
  minHeight?: number;
  noPadding?: boolean;
}

const DashboardCard = ({
  title,
  subtitle,
  icon,
  color = 'primary',
  children,
  action,
  minHeight,
  noPadding = false,
}: DashboardCardProps) => {
  const theme = useTheme();

  const iconColor = theme.palette[color].main;
  const iconBgColor = alpha(theme.palette[color].main, 0.12);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[3],
        border: `1px solid ${alpha(theme.palette[color].main, 0.1)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[6],
          transform: 'translateY(-4px)',
        },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${theme.palette[color].main}, ${theme.palette[color].light})`,
        }
      }}
    >
      <CardHeader
        sx={{
          py: 2.5,
          '& .MuiCardHeader-content': {
            overflow: 'hidden',
          },
        }}
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {icon && (
              <Box
                sx={{
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  width: 42,
                  height: 42,
                  bgcolor: iconBgColor,
                  color: iconColor,
                  border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
                  boxShadow: `0 4px 8px ${alpha(theme.palette[color].main, 0.1)}`,
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    bgcolor: alpha(theme.palette[color].main, 0.18),
                    boxShadow: `0 6px 12px ${alpha(theme.palette[color].main, 0.15)}`,
                  }
                }}
              >
                {icon}
              </Box>
            )}
            <Typography
              variant="h6"
              component="div"
              noWrap
              sx={{
                fontWeight: 600,
                letterSpacing: '-0.025em',
              }}
            >
              {title}
            </Typography>
          </Box>
        }
        subheader={
          subtitle && (
            <Typography
              variant="body2"
              color="textSecondary"
              noWrap
              sx={{ mt: 0.5 }}
            >
              {subtitle}
            </Typography>
          )
        }
        action={
          action || (
            <IconButton
              aria-label="more options"
              sx={{
                width: 36,
                height: 36,
                bgcolor: alpha(theme.palette.text.primary, 0.04),
                '&:hover': {
                  bgcolor: alpha(theme.palette.text.primary, 0.08),
                },
                transition: 'all 0.2s',
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          )
        }
      />
      <Divider sx={{ opacity: 0.6 }} />
      <CardContent
        sx={{
          flexGrow: 1,
          p: noPadding ? 0 : 2,
          ...(minHeight && { minHeight }),
          overflow: 'auto',
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;