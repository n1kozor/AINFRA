import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  alpha,
  Skeleton
} from '@mui/material';
import {
  CheckCircleOutlined,
  ErrorOutlined,
  HistoryOutlined
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface RecentActivityListProps {
  isLoading: boolean;
}

const RecentActivityList: React.FC<RecentActivityListProps> = ({ isLoading }) => {
  const theme = useTheme();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleOutlined sx={{ color: theme.palette.success.main }} />;
      case 'error':
        return <ErrorOutlined sx={{ color: theme.palette.error.main }} />;
      default:
        return <HistoryOutlined sx={{ color: theme.palette.info.main }} />;
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          height: '100%',
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          borderRadius: 4,
          p: 2,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Recent Activity
        </Typography>

        <List sx={{ pt: 0 }}>
          {[1, 2, 3, 4].map((item) => (
            <ListItem key={item} sx={{ py: 1, px: 0 }}>
              <Skeleton variant="circular" width={32} height={32} sx={{ mr: 2 }} />
              <ListItemText
                primary={<Skeleton width="70%" />}
                secondary={<Skeleton width="40%" />}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  }

  // Instead of dummy data, we'll handle empty state
  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: alpha(theme.palette.background.paper, 0.5),
        borderRadius: 4,
        p: 2,
        boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography
        variant="h6"
        fontWeight={600}
        sx={{ mb: 2, textAlign: 'center' }}
      >
        Recent Activity
      </Typography>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
          No recent activity data available
        </Typography>
      </Box>
    </Box>
  );
};

export default RecentActivityList;