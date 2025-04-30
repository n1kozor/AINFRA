import React from 'react';
import { Box, Typography, alpha, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ErrorDisplayProps {
  error: any;
  message?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, message }) => {
  const theme = useTheme();
  const { t } = useTranslation(['devices']);

  const errorMessage = error instanceof Error
    ? error.message
    : typeof error === 'string'
      ? error
      : t('devices:errors.unknownError');

  return (
    <Box p={3} bgcolor={alpha(theme.palette.error.main, 0.1)} borderRadius={1}>
      <Typography color="error">
        {message || t('devices:errors.failedToLoadData')}
      </Typography>
      <Typography variant="body2">
        {errorMessage}
      </Typography>
    </Box>
  );
};

export default ErrorDisplay;