// components/dashboard/StatusOverview.tsx
import React from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';

export const StatusOverview: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          width: '100%',
          background: theme.palette.background.paper,
          backdropFilter: 'blur(8px)',
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Status
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};