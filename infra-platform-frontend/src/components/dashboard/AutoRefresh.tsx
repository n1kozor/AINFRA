import React from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  alpha,
  SelectChangeEvent
} from '@mui/material';
import { RefreshRounded } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface AutoRefreshProps {
  interval: number;
  onIntervalChange: (interval: number) => void;
  onRefresh: () => void;
}

const AutoRefresh: React.FC<AutoRefreshProps> = ({
  interval,
  onIntervalChange,
  onRefresh
}) => {
  const { t } = useTranslation('dashboard');
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<number>) => {
    onIntervalChange(Number(event.target.value));
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <FormControl
        size="small"
        sx={{
          minWidth: 120,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
          }
        }}
      >
        <InputLabel>{t('autoRefresh.label')}</InputLabel>
        <Select
          value={interval}
          label={t('autoRefresh.label')}
          onChange={handleChange}
        >
          <MenuItem value={0}>{t('autoRefresh.off')}</MenuItem>
          <MenuItem value={10}>10 {t('autoRefresh.seconds')}</MenuItem>
          <MenuItem value={30}>30 {t('autoRefresh.seconds')}</MenuItem>
          <MenuItem value={60}>1 {t('autoRefresh.minute')}</MenuItem>
          <MenuItem value={300}>5 {t('autoRefresh.minutes')}</MenuItem>
        </Select>
      </FormControl>

      <Tooltip title={t('refresh')} arrow>
        <IconButton
          onClick={onRefresh}
          sx={{
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
            }
          }}
        >
          <RefreshRounded />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default AutoRefresh;