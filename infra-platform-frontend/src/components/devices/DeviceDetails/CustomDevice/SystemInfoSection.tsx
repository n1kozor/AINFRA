import React from 'react';
import { Box, Grid, Typography, Chip, alpha, useTheme } from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { ValueDisplayType } from './types';
import CardContainer from './CardContainer';

interface SystemInfoSectionProps {
  data: Array<{
    title: string;
    value: any;
    type: ValueDisplayType;
  }>;
  onRefresh?: () => void;
}

const SystemInfoSection: React.FC<SystemInfoSectionProps> = ({ data, onRefresh }) => {
  const theme = useTheme();
  const { t } = useTranslation(['devices', 'common']);

  if (!data || data.length === 0) return null;

  return (
    <CardContainer
      title={t('devices:cards.systemInfo')}
      icon={<CheckIcon />}
      color={theme.palette.primary.main}
      onRefresh={onRefresh}
    >
      <Grid container spacing={2}>
        {data.map((info, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Box sx={{
              p: 2,
              bgcolor: alpha(theme.palette.background.paper, 0.5),
              borderRadius: theme.shape.borderRadius,
              boxShadow: theme.shadows[1],
              height: '100%'
            }}>
              <Typography variant="subtitle2" gutterBottom>
                {info.title}
              </Typography>
              {info.type === 'status' ? (
                <Chip
                  label={
                    typeof info.value === 'boolean'
                      ? (info.value ? t('common:status.online') : t('common:status.offline'))
                      : info.value
                  }
                  color={
                    typeof info.value === 'boolean'
                      ? (info.value ? 'success' : 'error')
                      : (info.value?.toString()?.toLowerCase().includes('online') ? 'success' : 'error')
                  }
                  size="small"
                />
              ) : info.type === 'boolean' ? (
                info.value ? <CheckIcon color="success" /> : <CloseIcon color="error" />
              ) : (
                <Typography variant="body1">
                  {info.value}
                </Typography>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </CardContainer>
  );
};

export default SystemInfoSection;