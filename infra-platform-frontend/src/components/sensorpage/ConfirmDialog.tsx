// src/components/sensorpage/ConfirmDialog.tsx
import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  content: string;
  warning?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonText?: string;
  confirmButtonColor?: 'error' | 'warning' | 'primary';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  content,
  warning,
  onConfirm,
  onCancel,
  confirmButtonText = 'confirm',
  confirmButtonColor = 'error'
}) => {
  const { t } = useTranslation(['common']);
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
        {warning && (
          <DialogContentText sx={{ mt: 2, color: theme.palette.error.main }}>
            {warning}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          {t('cancel')}
        </Button>
        <Button onClick={onConfirm} color={confirmButtonColor} variant="contained">
          {t(confirmButtonText)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;