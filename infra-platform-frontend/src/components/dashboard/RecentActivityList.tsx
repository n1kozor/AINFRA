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

// In a real implementation, this would be fetched from an API
const mockActivities = [
  {
    id: 1,
    type: 'success',
    device: 'Server 1',
    message: 'Status check successful',
    timestamp: new Date(Date.now() - 1000 * 60 * 5)
  },
  {
    id: 2,
    type: 'error',
    device: 'Database Server',
    message: 'Connection failed',
    timestamp: new Date(Date.now() - 1000 * 60 * 15)
  },
  {
    id: 3,
    type: 'success',
    device: 'Web Server',
    message: 'Status check successful',
    timestamp: new Date(Date.now() - 1000 * 60 * 25)
  },
  {
    id: 4,
    type: 'error',
    device: 'Backup Server',
    message: 'Not responding',
    timestamp: new Date(Date.now() - 1000 * 60 * 45)
  },
];

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
        return <HistoryOutlined />;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 2, height: '100%' }}>
        <List>
          {[1, 2, 3, 4].map((item) => (
            <ListItem key={item} sx={{ px: 0, mb: 1.5 }}>
              <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }} />
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

  return (
    <Box sx={{ p: 2, height: '100%' }}>
      <List sx={{ height: '100%', overflow: 'auto', py: 0 }}>
        {mockActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ListItem
              sx={{
                px: 2,
                py: 1.5,
                mb: 1.5,
                borderRadius: 2,
                backgroundColor: alpha(
                  activity.type === 'success'
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                  0.07
                ),
                '&:hover': {
                  backgroundColor: alpha(
                    activity.type === 'success'
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                    0.12
                  ),
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {getIcon(activity.type)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={600}>
                    {activity.device}: {activity.message}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </Typography>
                }
              />
            </ListItem>
          </motion.div>
        ))}
      </List>
    </Box>
  );
};

export default RecentActivityList;