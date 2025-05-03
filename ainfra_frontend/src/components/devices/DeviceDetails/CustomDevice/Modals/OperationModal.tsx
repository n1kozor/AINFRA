import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Divider, Typography, CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { OperationModalProps } from '../types';

const OperationModal: React.FC<OperationModalProps> = ({
                                                         open,
                                                         onClose,
                                                         operation,
                                                         params,
                                                         onParamChange,
                                                         onExecute,
                                                         isLoading
                                                       }) => {
  const { t } = useTranslation();

  if (!operation) return null;

  return (
      <Dialog
          open={open}
          onClose={onClose}
          maxWidth="sm"
          fullWidth
      >
        <DialogTitle>
          {operation.name || t('devices.operations.execute')}
        </DialogTitle>
        <DialogContent>
          {operation.description && (
              <Typography variant="body2" color="textSecondary" paragraph>
                {operation.description}
              </Typography>
          )}
          <Divider sx={{ my: 2 }} />

          {operation.params && operation.params.length > 0 ? (
              <React.Fragment>
                {operation.params.map((param: string, index: number) => (
                    <TextField
                        key={param}
                        id={`param-${index}-${param}`}
                        label={param}
                        fullWidth
                        margin="normal"
                        value={params[param] || ''}
                        onChange={(e) => onParamChange(param, e.target.value)}
                    />
                ))}
              </React.Fragment>
          ) : (
              <Typography variant="body2" color="textSecondary">
                {t('devices.operations.noParameters')}
              </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            {t('common.actions.cancel')}
          </Button>
          <Button
              onClick={onExecute}
              color="primary"
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
          >
            {t('devices.operations.execute')}
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default OperationModal;