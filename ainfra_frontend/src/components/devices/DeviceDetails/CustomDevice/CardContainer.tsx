import React from 'react';
import { Box, Card, CardContent, CardHeader, Divider, IconButton, Typography } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface CardContainerProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    color?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    onRefresh?: () => void;
}

const CardContainer: React.FC<CardContainerProps> = ({
                                                         title,
                                                         subtitle,
                                                         icon,
                                                         color,
                                                         action,
                                                         children,
                                                         onRefresh
                                                     }) => {
    const defaultAction = onRefresh ? (
        <IconButton size="small" onClick={onRefresh}>
            <RefreshIcon />
        </IconButton>
    ) : null;

    return (
        <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardHeader
                title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {icon && <Box sx={{ color }}>{icon}</Box>}
                        <Typography variant="h6">{title}</Typography>
                    </Box>
                }
                subheader={subtitle}
                action={action || defaultAction}
            />
            <Divider />
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
};

export default CardContainer;