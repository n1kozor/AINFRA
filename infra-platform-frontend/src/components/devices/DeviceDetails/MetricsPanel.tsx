import React from 'react';
import { Box, Typography, Grid, Paper, useTheme, alpha } from '@mui/material';

interface MetricsPanelProps {
  title: string;
  metrics: {
    label: string;
    value: string | number;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  }[];
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ title, metrics }) => {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: theme.shape.borderRadius,
                bgcolor: alpha(
                  theme.palette[metric.color || 'primary'].main,
                  0.1
                ),
              }}
            >
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {metric.label}
              </Typography>
              <Typography
                variant="h6"
                color={metric.color || 'primary'}
                sx={{ wordBreak: 'break-word' }}
              >
                {metric.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MetricsPanel;