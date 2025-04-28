import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Paper,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  error?: Error | unknown;
  showDetails?: boolean;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title,
  message,
  onRetry,
  error,
  showDetails = false,
}) => {
  const { t } = useTranslation('common');
  const theme = useTheme();

  const [expanded, setExpanded] = React.useState(false);

  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        bgcolor: 'transparent',
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.error.main, 0.5)}`,
        borderRadius: theme.shape.borderRadius,
      }}
    >
      <Alert
        severity="error"
        sx={{
          alignItems: 'flex-start',
          '.MuiAlert-message': {
            width: '100%'
          }
        }}
        action={
          onRetry && (
            <Button
              color="error"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
              sx={{ mt: 0.5 }}
            >
              {t('actions.retry')}
            </Button>
          )
        }
      >
        {title && <AlertTitle>{title}</AlertTitle>}

        <Typography variant="body2">{message}</Typography>

        {showDetails && errorMessage && (
          <>
            <Button
              color="inherit"
              size="small"
              sx={{ mt: 1, mb: expanded ? 1 : 0 }}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? t('actions.hideDetails') : t('actions.showDetails')}
            </Button>

            {expanded && (
              <Box
                sx={{
                  mt: 1,
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxHeight: '200px',
                  overflow: 'auto',
                }}
              >
                {errorMessage}
                {errorStack && (
                  <>
                    {'\n\n'}
                    {errorStack}
                  </>
                )}
              </Box>
            )}
          </>
        )}
      </Alert>
    </Paper>
  );
};

export default ErrorAlert;