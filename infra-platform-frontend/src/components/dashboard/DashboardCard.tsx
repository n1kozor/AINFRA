import React, { ReactNode, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  CardHeader,
  Divider,
  useTheme,
  alpha,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
} from '@mui/material';
import {
  MoreVertRounded,
  EditRounded,
  DeleteRounded,
  RefreshRounded,
  InfoRounded,
  ShareRounded,
  StarRounded,
  SettingsRounded,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  children: ReactNode;
  action?: ReactNode;
  minHeight?: number | string;
  noPadding?: boolean;
  variant?: 'default' | 'glass' | 'gradient';
  loading?: boolean;
  collapsible?: boolean;
  fullHeight?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onRefresh?: () => void;
}

const DashboardCard = ({
  title,
  subtitle,
  icon,
  color = 'primary',
  children,
  action,
  minHeight,
  noPadding = false,
  variant = 'default',
  loading = false,
  collapsible = false,
  fullHeight = false,
  onEdit,
  onDelete,
  onRefresh,
}: DashboardCardProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [expanded, setExpanded] = useState(true);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // Card styling based on variant
  const getCardStyle = () => {
    const baseStyle = {
      height: fullHeight ? '100%' : 'auto',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      borderRadius: '24px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-4px)',
      },
      position: 'relative',
    };

    switch (variant) {
      case 'glass':
        return {
          ...baseStyle,
          backdropFilter: 'blur(16px)',
          background: theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.7)
            : alpha(theme.palette.background.paper, 0.8),
          border: `1px solid ${alpha(theme.palette[color].main, 0.15)}`,
          boxShadow: `0 10px 30px ${alpha(theme.palette.mode === 'dark' ? '#000000' : theme.palette[color].main, 0.1)}`,
          '&:hover': {
            ...baseStyle['&:hover'],
            boxShadow: `0 15px 35px ${alpha(theme.palette.mode === 'dark' ? '#000000' : theme.palette[color].main, 0.15)}`,
          },
        };

      case 'gradient':
        return {
          ...baseStyle,
          background: `linear-gradient(145deg, ${alpha(theme.palette[color].main, 0.15)}, ${alpha(theme.palette[color].dark, 0.05)})`,
          border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
          boxShadow: `0 10px 30px ${alpha(theme.palette[color].main, 0.15)}`,
          '&:hover': {
            ...baseStyle['&:hover'],
            boxShadow: `0 15px 35px ${alpha(theme.palette[color].main, 0.2)}`,
          },
        };

      default:
        return {
          ...baseStyle,
          background: theme.palette.background.paper,
          border: `1px solid ${alpha(theme.palette[color].main, 0.1)}`,
          boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.07)}`,
          '&:hover': {
            ...baseStyle['&:hover'],
            boxShadow: `0 15px 35px ${alpha(theme.palette.common.black, 0.1)}`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette[color].main}, ${theme.palette[color].light})`,
          }
        };
    }
  };

  const iconColor = theme.palette[color].main;
  const iconBgColor = alpha(theme.palette[color].main, 0.15);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ height: fullHeight ? '100%' : 'auto' }}
    >
      <Card
        component={motion.div}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300 }}
        sx={getCardStyle()}
      >
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              zIndex: 10,
              overflow: 'hidden',
              '&::after': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '30%',
                height: '100%',
                background: `linear-gradient(90deg, transparent, ${theme.palette[color].main}, transparent)`,
                animation: 'loadingAnimation 1.5s infinite',
              },
              '@keyframes loadingAnimation': {
                '0%': {
                  left: '-30%',
                },
                '100%': {
                  left: '130%',
                },
              },
            }}
          />
        )}

        <CardHeader
          sx={{
            py: 2.5,
            px: 3,
            '& .MuiCardHeader-content': {
              overflow: 'hidden',
            },
          }}
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {icon && (
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Box
                    sx={{
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '14px',
                      width: 44,
                      height: 44,
                      bgcolor: iconBgColor,
                      color: iconColor,
                      border: variant === 'gradient' ? 'none' : `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
                      boxShadow: variant === 'gradient'
                        ? `0 6px 20px ${alpha(theme.palette[color].main, 0.3)}`
                        : `0 4px 12px ${alpha(theme.palette[color].main, 0.15)}`,
                    }}
                  >
                    {icon}
                  </Box>
                </motion.div>
              )}
              <Box>
                <Typography
                  variant="h6"
                  component="div"
                  noWrap
                  sx={{
                    fontWeight: 700,
                    letterSpacing: '-0.025em',
                    fontSize: '1.1rem',
                    color: variant === 'gradient'
                      ? theme.palette[color].main
                      : theme.palette.text.primary,
                  }}
                >
                  {title}
                </Typography>

                {subtitle && (
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{
                      mt: 0.3,
                      color: alpha(theme.palette.text.secondary, 0.8),
                      fontSize: '0.85rem',
                    }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </Box>
          }
          action={
            action || (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {(onEdit || onDelete || onRefresh) && (
                  <Tooltip title={t('actions.more')} arrow>
                    <IconButton
                      aria-label="more options"
                      onClick={handleMenuOpen}
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: alpha(theme.palette.text.primary, 0.05),
                        borderRadius: '12px',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.text.primary, 0.1),
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      <MoreVertRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )
          }
        />

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 180,
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              overflow: 'visible',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: theme.palette.background.paper,
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
                borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {onRefresh && (
            <MenuItem
              onClick={() => { handleMenuClose(); onRefresh?.(); }}
              sx={{
                borderRadius: '8px',
                mx: 1,
                my: 0.5,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                }
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                <RefreshRounded fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">{t('actions.refresh')}</Typography>
            </MenuItem>
          )}

          {onEdit && (
            <MenuItem
              onClick={() => { handleMenuClose(); onEdit?.(); }}
              sx={{
                borderRadius: '8px',
                mx: 1,
                my: 0.5,
                '&:hover': {
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                }
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.info.main }}>
                <EditRounded fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">{t('actions.edit')}</Typography>
            </MenuItem>
          )}

          <MenuItem
            onClick={handleMenuClose}
            sx={{
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              '&:hover': {
                bgcolor: alpha(theme.palette.secondary.main, 0.1),
              }
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.secondary.main }}>
              <ShareRounded fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2">{t('actions.share')}</Typography>
          </MenuItem>

          <MenuItem
            onClick={handleMenuClose}
            sx={{
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              '&:hover': {
                bgcolor: alpha(theme.palette.warning.main, 0.1),
              }
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.warning.main }}>
              <StarRounded fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2">{t('actions.favorite')}</Typography>
          </MenuItem>

          <Divider sx={{ my: 1, mx: 2, opacity: 0.6 }} />

          {onDelete && (
            <MenuItem
              onClick={() => { handleMenuClose(); onDelete?.(); }}
              sx={{
                borderRadius: '8px',
                mx: 1,
                my: 0.5,
                color: theme.palette.error.main,
                '&:hover': {
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                }
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.error.main }}>
                <DeleteRounded fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">{t('actions.delete')}</Typography>
            </MenuItem>
          )}
        </Menu>

        <Divider sx={{ opacity: 0.4 }} />

        <CardContent
          component={motion.div}
          animate={{ height: expanded || !collapsible ? 'auto' : 0, opacity: expanded || !collapsible ? 1 : 0 }}
          sx={{
            position: 'relative',
            flexGrow: 1,
            p: noPadding ? 0 : 0,
            ...(minHeight && { minHeight }),
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px',
              height: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: alpha(theme.palette.text.primary, 0.1),
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: alpha(theme.palette.text.primary, 0.2),
            },
          }}
        >
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardCard;