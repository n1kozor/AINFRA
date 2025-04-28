import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Chip,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Device, DeviceType } from '../../types/device';
import DeviceCard from './DeviceCard';

interface DeviceListProps {
  devices: Device[];
  isLoading: boolean;
  type?: DeviceType;
}

const DeviceList: React.FC<DeviceListProps> = ({ devices, isLoading, type }) => {
  const { t } = useTranslation(['devices', 'common']);
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredDevices = devices.filter((device) => {
    // Filter by type if specified
    if (type && device.type !== type) {
      return false;
    }

    // Filter by search query
    if (
      searchQuery &&
      !device.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !device.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by status
    if (statusFilter === 'active' && !device.is_active) {
      return false;
    }

    if (statusFilter === 'inactive' && device.is_active) {
      return false;
    }

    return true;
  });

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            {type === 'standard'
              ? t('devices:standardDevices.title')
              : type === 'custom'
              ? t('devices:customDevices.title')
              : t('devices:allDevices.title')}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t('devices:deviceCount', { count: filteredDevices.length })}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            width: { xs: '100%', md: 'auto' },
          }}
        >
          <TextField
            label={t('common:actions.search')}
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200 }}
          />

          <TextField
            select
            label={t('devices:statusFilter')}
            variant="outlined"
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">{t('devices:statusOptions.all')}</MenuItem>
            <MenuItem value="active">{t('devices:statusOptions.active')}</MenuItem>
            <MenuItem value="inactive">{t('devices:statusOptions.inactive')}</MenuItem>
          </TextField>

          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/devices/new"
            startIcon={<AddIcon />}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {t('devices:addDevice')}
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <Typography>{t('common:status.loading')}</Typography>
      ) : filteredDevices.length === 0 ? (
        <Box
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {t('devices:noDevicesFound')}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            {t('devices:tryDifferentFilters')}
          </Typography>
          <Button
            variant="outlined"
            component={Link}
            to="/devices/new"
            startIcon={<AddIcon />}
          >
            {t('devices:addFirstDevice')}
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredDevices.map((device) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={device.id}>
              <DeviceCard device={device} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default DeviceList;