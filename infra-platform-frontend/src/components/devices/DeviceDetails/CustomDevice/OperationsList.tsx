import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { PlayArrow as PlayIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import CardContainer from './CardContainer';

interface OperationsListProps {
  operations: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  onSelectOperation: (operation: any) => void;
}

const OperationsList: React.FC<OperationsListProps> = ({ operations, onSelectOperation }) => {
  const { t } = useTranslation(['devices']);

  if (!operations || operations.length === 0) return null;

  return (
    <CardContainer
      title={t('devices:cards.availableOperations')}
      icon={<PlayIcon />}
      color="success"
    >
      <Grid container spacing={2}>
        {operations.map((operation) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={operation.id}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => onSelectOperation(operation)}
              sx={{
                py: 1.5,
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                height: '100%',
                borderRadius: 2
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                {operation.name}
              </Typography>
              {operation.description && (
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {operation.description}
                </Typography>
              )}
            </Button>
          </Grid>
        ))}
      </Grid>
    </CardContainer>
  );
};

export default OperationsList;