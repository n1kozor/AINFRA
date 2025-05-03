import { useState } from 'react';
import {
    Box,
    Button,
    Chip,
    Typography,
    Grid,
    Divider,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    useTheme,
    alpha,
    Tooltip,
    IconButton,
    Paper,
    Container,
    Stack,
    Fade,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    ArrowBack as ArrowBackIcon,
    Computer as StandardIcon,
    SmartToy as CustomIcon,
    PowerSettingsNew as PowerIcon,
    Refresh as RefreshIcon,
    Terminal as TerminalIcon,
    Storage as StorageIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import PageContainer from '../../components/common/PageContainer';
import StandardDeviceDetails from '../../components/devices/DeviceDetails/StandardDeviceDetails';
import CustomDeviceDetails from '../../components/devices/DeviceDetails/CustomDevice';
import { format } from 'date-fns';
import { motion } from 'framer-motion';


const DeviceDetails = () => {
    const { id } = useParams();
    const deviceId = parseInt(id || '0', 10);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const theme = useTheme();
    const queryClient = useQueryClient();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const { data: device, isLoading, error, refetch } = useQuery({
        queryKey: ['device', deviceId],
        queryFn: () => api.devices.getById(deviceId),
        enabled: !!deviceId,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.devices.delete(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['devices'] });
            navigate('/devices', { state: { deleted: true } });
        },
    });

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        deleteMutation.mutate(deviceId);
        setDeleteDialogOpen(false);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
    };

    if (isLoading) {
        return (
            <PageContainer title={t('devices.loading')}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '70vh',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    <CircularProgress size={44} thickness={4} />
                    <Typography variant="subtitle1" color="text.secondary">
                        {t('devices.loadingDeviceDetails')}
                    </Typography>
                </Box>
            </PageContainer>
        );
    }

    if (error || !device) {
        return (
            <PageContainer title={t('devices.error')}>
                <Container maxWidth="md" sx={{ py: 4 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3, md: 5 },
                            borderRadius: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            bgcolor: alpha(theme.palette.background.paper, 0.7),
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <Box
                            sx={{
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                borderRadius: '50%',
                                p: 2,
                                mb: 2
                            }}
                        >
                            <InfoIcon color="error" fontSize="large" />
                        </Box>

                        <Typography variant="h5" color="error.main" gutterBottom fontWeight={600}>
                            {t('devices.deviceNotFound')}
                        </Typography>

                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
                            {error instanceof Error
                                ? error.message
                                : t('devices.errors.deviceMayHaveBeenRemoved')}
                        </Typography>

                        <Button
                            component={Link}
                            to="/devices"
                            startIcon={<ArrowBackIcon />}
                            variant="contained"
                            size="large"
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                py: 1.2,
                                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
                                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                transition: 'all 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                                }
                            }}
                        >
                            {t('common.actions.backToDevices')}
                        </Button>
                    </Paper>
                </Container>
            </PageContainer>
        );
    }

    const isStandard = device.type === 'standard';
    const DeviceIcon = isStandard ? StandardIcon : CustomIcon;

    // A DeviceStatus kiszámítása (is_active helyett)
    // Mivel nincs is_active a Device interfészben, használjunk egy alternatív ellenőrzést
    // Például feltételezzük, hogy ha van IP címe, akkor aktív
    const isActive = !!device.ip_address;

    return (
        <PageContainer
            title={device.name}
            breadcrumbs={[
                { text: t('common.navigation.dashboard'), link: '/' },
                { text: t('common.navigation.devices'), link: '/devices' },
                {
                    text: isStandard
                        ? t('common.navigation.standardDevices')
                        : t('common.navigation.customDevices'),
                    link: isStandard ? '/devices/standard' : '/devices/custom',
                },
                { text: device.name },
            ]}
            actions={
                <Stack direction="row" spacing={{ xs: 1, md: 2 }} alignItems="center">
                    <Tooltip title={t('common.actions.refresh')}>
                        <IconButton
                            onClick={() => refetch()}
                            color="default"
                            sx={{
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.background.paper, 0.7)
                            }}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>

                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        component={Link}
                        to={`/devices/${deviceId}/edit`}
                        sx={{
                            borderRadius: 8,
                            px: { xs: 2, md: 3 },
                            display: { xs: 'none', sm: 'flex' }
                        }}
                    >
                        {t('common.actions.edit')}
                    </Button>

                    <Tooltip title={t('common.actions.edit')}>
                        <IconButton
                            component={Link}
                            to={`/devices/${deviceId}/edit`}
                            color="primary"
                            sx={{
                                display: { xs: 'flex', sm: 'none' },
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.background.paper, 0.7)
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>

                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={handleDeleteClick}
                        sx={{
                            borderRadius: 8,
                            px: { xs: 2, md: 3 },
                            display: { xs: 'none', sm: 'flex' }
                        }}
                    >
                        {t('common.actions.delete')}
                    </Button>

                    <Tooltip title={t('common.actions.delete')}>
                        <IconButton
                            onClick={handleDeleteClick}
                            color="error"
                            sx={{
                                display: { xs: 'flex', sm: 'none' },
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.background.paper, 0.7)
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            }
        >
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Device Header Section */}
                <Fade in={!!device} timeout={500}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2, sm: 3 },
                            mb: 3,
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            bgcolor: alpha(theme.palette.background.paper, 0.7),
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <Grid container spacing={{ xs: 2, md: 3 }} alignItems="center">
                            <Grid size={1}>
                                <Box
                                    sx={{
                                        width: { xs: 48, md: 56 },
                                        height: { xs: 48, md: 56 },
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: isStandard
                                            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)}, ${alpha(theme.palette.primary.main, 0.2)})`
                                            : `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.2)}, ${alpha(theme.palette.secondary.main, 0.2)})`,
                                        boxShadow: `0 4px 12px ${alpha(isStandard ? theme.palette.primary.main : theme.palette.secondary.main, 0.15)}`,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 6px 16px ${alpha(isStandard ? theme.palette.primary.main : theme.palette.secondary.main, 0.25)}`,
                                        }
                                    }}
                                >
                                    <DeviceIcon
                                        sx={{
                                            fontSize: { xs: 28, md: 32 },
                                            color: isStandard ? theme.palette.primary.main : theme.palette.secondary.main
                                        }}
                                    />
                                </Box>
                            </Grid>

                            <Grid size={6}>
                                <Typography variant="h5" fontWeight={600} sx={{ wordBreak: 'break-word' }}>
                                    {device.name}
                                </Typography>

                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                    {device.ip_address && (
                                        <Typography variant="body2" color="text.secondary">
                                            {device.ip_address}
                                        </Typography>
                                    )}
                                    <Box
                                        sx={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: '50%',
                                            bgcolor: isActive ? 'success.main' : 'text.disabled',
                                            display: { xs: 'none', sm: 'block' }
                                        }}
                                    />
                                </Stack>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 'auto' }} sx={{ ml: 'auto' }}>
                                <Stack
                                    direction={{ xs: 'row', sm: 'row' }}
                                    spacing={1}
                                    justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
                                    flexWrap="wrap"
                                    gap={1}
                                >
                                    <Chip
                                        label={isStandard
                                            ? t('devices.deviceTypes.standard')
                                            : t('devices.deviceTypes.custom')
                                        }
                                        color={isStandard ? 'primary' : 'secondary'}
                                        size="small"
                                        sx={{ fontWeight: 500, borderRadius: 1.5 }}
                                    />

                                    <Chip
                                        icon={<PowerIcon fontSize="small" />}
                                        label={isActive
                                            ? t('devices.status.active')
                                            : t('devices.status.inactive')
                                        }
                                        color={isActive ? 'success' : 'default'}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontWeight: 500, borderRadius: 1.5 }}
                                    />

                                    {isStandard && device.standard_device?.os_type && (
                                        <Chip
                                            icon={<TerminalIcon fontSize="small" />}
                                            label={t(`devices.osTypes.${device.standard_device.os_type}`)}
                                            size="small"
                                            variant="outlined"
                                            color="info"
                                            sx={{ fontWeight: 500, borderRadius: 1.5 }}
                                        />
                                    )}

                                    {!isStandard && device.custom_device?.plugin_name && (
                                        <Chip
                                            icon={<StorageIcon fontSize="small" />}
                                            label={device.custom_device.plugin_name}
                                            size="small"
                                            variant="outlined"
                                            color="secondary"
                                            sx={{ fontWeight: 500, borderRadius: 1.5 }}
                                        />
                                    )}
                                </Stack>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: { xs: 2, md: 3 } }} />

                        <Grid container spacing={{ xs: 2, md: 4 }}>
                            <Grid size={{ xs: 12, md: 7 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight={600}>
                                    {t('devices.description')}
                                </Typography>
                                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                    {device.description || (
                                        <Typography component="span" variant="body2" color="text.disabled" fontStyle="italic">
                                            {t('devices.noDescription')}
                                        </Typography>
                                    )}
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, md: 5 }}>
                                <Grid container spacing={2}>
                                    {isStandard && device.standard_device ? (
                                        <>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight={600}>
                                                    {t('devices.osType')}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {t(`devices.osTypes.${device.standard_device.os_type}`)}
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight={600}>
                                                    {t('devices.hostname')}
                                                </Typography>
                                                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                                    {device.standard_device.hostname || '-'}
                                                </Typography>
                                            </Grid>
                                        </>
                                    ) : device.custom_device && (
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight={600}>
                                                {t('devices.plugin')}
                                            </Typography>
                                            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                                {device.custom_device.plugin_name}
                                            </Typography>
                                        </Grid>
                                    )}

                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight={600}>
                                            {t('devices.created')}
                                        </Typography>
                                        <Typography variant="body2">
                                            {format(new Date(device.created_at), 'PPP')}
                                        </Typography>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight={600}>
                                            {t('devices.lastUpdated')}
                                        </Typography>
                                        <Typography variant="body2">
                                            {format(new Date(device.updated_at), 'PPP')}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Fade>

                {/* Device Specific Details */}
                <Fade in={!!device} timeout={700}>
                    <Box>
                        {isStandard ? (
                            <StandardDeviceDetails device={device} />
                        ) : (
                            <CustomDeviceDetails device={device} />
                        )}
                    </Box>
                </Fade>
            </motion.div>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: 3,
                        boxShadow: theme.shadows[10]
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Typography variant="h6" fontWeight={600}>
                        {t('devices.deleteDevice.title')}
                    </Typography>
                </DialogTitle>

                <DialogContent sx={{ pt: 1 }}>
                    <DialogContentText>
                        {t('devices.deleteDevice.confirmation', {
                            name: <strong>{device.name}</strong>,
                            interpolation: { escapeValue: false }
                        })}
                    </DialogContentText>
                    <DialogContentText sx={{ mt: 2, color: 'error.main', fontSize: '0.875rem' }}>
                        {t('devices.deleteDevice.warning')}
                    </DialogContentText>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={handleDeleteCancel}
                        color="inherit"
                        sx={{ borderRadius: 2 }}
                    >
                        {t('common.actions.cancel')}
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        startIcon={
                            deleteMutation.isPending ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                <DeleteIcon />
                            )
                        }
                        disabled={deleteMutation.isPending}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            '&:hover': {
                                bgcolor: alpha(theme.palette.error.main, 0.9),
                            }
                        }}
                    >
                        {t('common.actions.delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
};

export default DeviceDetails;