import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box,
  Typography, CircularProgress
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { ConfirmationModalProps } from '../types';

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
                                                               open,
                                                               onClose,
                                                               onConfirm,
                                                               isLoading
                                                             }) => {
  const { t } = useTranslation();

  return (
      <Dialog
          open={open}
          onClose={onClose}
          maxWidth="xs"
          fullWidth
      >
        <DialogTitle>
          {t('devices.confirmAction')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WarningIcon color="warning" sx={{ mr: 1, fontSize: 28 }} />
            <Typography>
              {t('devices.confirmActionMessage')}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {t('devices.confirmActionDescription')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
              onClick={onClose}
              color="inherit"
          >
            {t('common.actions.cancel')}
          </Button>
          <Button
              onClick={onConfirm}
              color="error"
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
          >
            {t('common.actions.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default ConfirmationModal;