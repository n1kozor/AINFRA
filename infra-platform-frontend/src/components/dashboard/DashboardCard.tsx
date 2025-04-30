import React from 'react';
import { Paper, Typography, Box, useTheme, alpha, IconButton, Tooltip } from '@mui/material';
import { MoreVertRounded } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  height?: string | number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  children,
  height = '100%'
}) => {
  const theme = useTheme();

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      elevation={0}
      sx={{
        height,
        width: '100%',
        borderRadius: 3,
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.paper, 0.95)})`,
        backdropFilter: 'blur(10px)',
        boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.07)}`,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.09)}`,
        }
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
        <Tooltip title="More options">
          <IconButton size="small">
            <MoreVertRounded fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {children}
      </Box>
    </Paper>
  );
};

export default DashboardCard;