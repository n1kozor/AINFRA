import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box,
  Typography, CircularProgress, Paper, useTheme
} from '@mui/material';
import { FileCopy as CopyIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { DataDisplayModalProps } from '../types';

const DataDisplayModal: React.FC<DataDisplayModalProps> = ({
                                                             open,
                                                             onClose,
                                                             title,
                                                             data,
                                                             isLoading
                                                           }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(data);
  };

  return (
      <Dialog
          open={open}
          onClose={onClose}
          maxWidth="md"
          fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {title}
          </Typography>
          <Button
              size="small"
              onClick={handleCopy}
              startIcon={<CopyIcon />}
          >
            {t('common.actions.copy')}
          </Button>
        </DialogTitle>
        <DialogContent>
          {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
          ) : (
              <Paper
                  sx={{
                    bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                    p: 2,
                    maxHeight: '60vh',
                    overflow: 'auto',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.85rem',
                    borderRadius: 2
                  }}
              >
                {data || t('devices.noDataAvailable')}
              </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            {t('common.actions.close')}
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default DataDisplayModal;