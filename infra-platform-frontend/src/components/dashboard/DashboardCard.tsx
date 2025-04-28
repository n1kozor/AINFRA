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
  const iconBgColor = alpha(theme.palette[color].main, 0.1);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: theme.shadows[3],
      }}
    >
      <CardHeader
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
                  width: 40,
                  height: 40,
                  bgcolor: iconBgColor,
                  color: iconColor,
                }}
              >
                {icon}
              </Box>
            )}
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          </Box>
        }
        subheader={subtitle}
        action={
          action || (
            <IconButton aria-label="more options">
              <MoreVertIcon />
            </IconButton>
          )
        }
      />
      <Divider />
      <CardContent
        sx={{
          flexGrow: 1,
          p: noPadding ? 0 : 2,
          ...(minHeight && { minHeight }),
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;