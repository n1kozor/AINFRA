import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha,
  Divider,
  Chip,
  Button,
  Stack
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  StorageRounded as StorageIcon,
  HelpOutlineRounded as HelpIcon,
  AddRounded as AddIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { OsDistribution } from '../../types/dashboard';
import DashboardCard from './DashboardCard';

interface OsDistributionCardProps {
  data: OsDistribution[];
  onRefresh: () => void;
}

const OsDistributionCard: React.FC<OsDistributionCardProps> = ({ data, onRefresh }) => {
  const theme = useTheme();
  const { t } = useTranslation(['dashboard', 'common']);

  return (
    <DashboardCard
      title={t('dashboard:osDistribution.title')}
      subtitle={t('dashboard:osDistribution.subtitle')}
      icon={<StorageIcon />}
      color="warning"
      variant="glass"
      fullHeight
      onRefresh={onRefresh}
    >
      <Box
        sx={{
          height: 300,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={theme.palette.background.paper}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(value: number, name: string) => [
                  `${value} ${t('dashboard:osDistribution.devices')}`,
                  name
                ]}
                contentStyle={{
                  background: alpha(theme.palette.background.paper, 0.9),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  borderRadius: '10px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            p: 3
          }}>
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              }}
            >
              <HelpIcon fontSize="large" sx={{ color: theme.palette.warning.main }} />
            </Box>
            <Typography align="center" color="textSecondary" variant="subtitle1" fontWeight={500}>
              {t('dashboard:osDistribution.noDevices')}
            </Typography>
            <Typography align="center" color="textSecondary" sx={{ mt: 1, fontSize: '0.85rem' }}>
              {t('dashboard:osDistribution.addDevices')}
            </Typography>
            <Button
              component={Link}
              to="/devices/new"
              variant="outlined"
              color="warning"
              size="small"
              startIcon={<AddIcon />}
              sx={{ mt: 2, borderRadius: '12px' }}
            >
              {t('dashboard:addDevice')}
            </Button>
          </Box>
        )}
      </Box>

      <Box p={2}>
        <Divider sx={{ opacity: 0.4, my: 1 }} />
        <Stack direction="row" spacing={1} mt={1} justifyContent="center">
          {data.map((os, index) => (
            <Chip
              key={index}
              label={os.name}
              sx={{
                bgcolor: alpha(os.color, 0.1),
                color: os.color,
                fontWeight: 600,
                borderRadius: '10px',
                border: `1px solid ${alpha(os.color, 0.2)}`,
              }}
              size="small"
            />
          ))}
        </Stack>
      </Box>
    </DashboardCard>
  );
};

export default OsDistributionCard;