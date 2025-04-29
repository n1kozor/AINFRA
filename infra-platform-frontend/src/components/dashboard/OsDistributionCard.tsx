import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  Divider,
} from '@mui/material';
import { StorageRounded as StorageIcon, RefreshRounded as RefreshIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { OsDistribution } from '../../types/dashboard';

interface OsDistributionCardProps {
  data: OsDistribution[];
  onRefresh: () => void;
}

const OsDistributionCard: React.FC<OsDistributionCardProps> = ({ data, onRefresh }) => {
  const theme = useTheme();
  const { t } = useTranslation(['dashboard', 'common']);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.85)})`,
        backdropFilter: 'blur(10px)',
        boxShadow: theme.palette.mode === 'dark'
          ? `0 8px 32px ${alpha(theme.palette.common.black, 0.25)}`
          : `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Box display="flex" alignItems="center">
          <StorageIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
          <Typography variant="h6" fontWeight={700}>
            {t('dashboard:osDistribution.title')}
          </Typography>
        </Box>
        <Tooltip title={t('dashboard:refresh')} arrow>
          <IconButton
            onClick={onRefresh}
            size="small"
            sx={{
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1)
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Chart and Legend */}
      <Box p={2}>
        <Box height={250}>
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
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                flexDirection: 'column'
              }}
            >
              <Typography variant="body1" color="text.secondary" align="center">
                {t('dashboard:osDistribution.noDevices')}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" mt={1}>
                {t('dashboard:osDistribution.addDevices')}
              </Typography>
            </Box>
          )}
        </Box>

        {data.length > 0 && (
          <>
            <Divider sx={{ my: 2, opacity: 0.6 }} />

            <Stack
              direction="row"
              flexWrap="wrap"
              gap={1}
              justifyContent="center"
            >
              {data.map((os, index) => (
                <Chip
                  key={index}
                  label={`${os.name} (${os.value})`}
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
          </>
        )}
      </Box>
    </Paper>
  );
};

export default OsDistributionCard;