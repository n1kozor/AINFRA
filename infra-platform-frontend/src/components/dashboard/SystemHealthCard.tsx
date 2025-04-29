import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie-player';
import DashboardCard from './DashboardCard';

interface SystemHealthCardProps {
  healthScore: number;
  onRefresh: () => void;
}

const SystemHealthCard: React.FC<SystemHealthCardProps> = ({ healthScore, onRefresh }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [animationData, setAnimationData] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get color based on health score
  const getHealthColor = () => {
    if (healthScore > 80) return theme.palette.success.main;
    if (healthScore > 50) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const healthColor = getHealthColor();

  // Get status text based on health score
  const getStatusText = () => {
    if (healthScore > 80) return t('dashboard.systemHealth.excellent');
    if (healthScore > 50) return t('dashboard.systemHealth.acceptable');
    return t('dashboard.systemHealth.critical');
  };

  // Load the animation data
  useEffect(() => {
    fetch('/assets/soul_animation.json')
      .then(response => response.json())
      .then(data => {
        setAnimationData(data);
      })
      .catch(error => {
        console.error('Error loading animation:', error);
      });
  }, []);

  return (
    <DashboardCard
      title={t('dashboard.systemHealth.title')}
      onRefresh={onRefresh}
      variant="glass"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background glow effect */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(healthColor, 0.15)} 0%, transparent 70%)`,
            filter: `blur(15px)`,
            zIndex: 0
          }}
        />

        {/* Container with CSS filters for animation color */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 1,
            type: "spring",
            bounce: 0.4
          }}
          style={{
            marginBottom: 10,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 1,
            marginTop: 10,
            position: 'relative'
          }}
        >
          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            ref={containerRef}
            style={{
              position: 'relative'
            }}
          >
            {/* Colored overlay for the soul animation */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: healthColor,
                    mixBlendMode: 'color',
                    zIndex: 2,
                    opacity: 0.7,
                    borderRadius: '50%',
                  }}
                />


            {/* Brightness adjustment layer for better contrast */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                mixBlendMode: 'screen',
                backgroundColor: alpha(healthColor, 0.3),
                zIndex: 3,
                borderRadius: '50%',
              }}
            />

            {/* Show Lottie animation */}
            {animationData ? (
              <Box
                sx={{
                  filter: 'brightness(1.2) contrast(1.1)',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <Lottie
                  animationData={animationData}
                  play
                  loop
                  style={{
                    width: 150,
                    height: 150,
                   opacity: 0.5,
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: alpha(healthColor, 0.2),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  style={{
                    width: '30%',
                    height: '30%',
                    borderRadius: '50%',
                    border: `3px solid ${healthColor}`,
                    borderTopColor: 'transparent'
                  }}
                />
              </Box>
            )}
          </motion.div>
        </motion.div>

        {/* Percentage display with pulsing animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              textShadow: [
                `0 0 8px ${alpha(healthColor, 0.4)}`,
                `0 0 12px ${alpha(healthColor, 0.7)}`,
                `0 0 8px ${alpha(healthColor, 0.4)}`
              ]
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              repeatType: "mirror"
            }}
          >

          </motion.div>
        </motion.div>

        {/* Status text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            color={healthColor}
            textAlign="center"
            sx={{ mt: 1 }}
          >
            {getStatusText()} {t('dashboard.systemHealth.status')}
          </Typography>
        </motion.div>

        {/* Detailed description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mt: 1, textAlign: 'center' }}
          >
            {healthScore > 80
              ? t('dashboard.systemHealth.happySoulMessage')
              : healthScore > 50
                ? t('dashboard.systemHealth.troubledSoulMessage')
                : t('dashboard.systemHealth.sufferingSoulMessage')}
          </Typography>
        </motion.div>
      </Box>
    </DashboardCard>
  );
};

export default SystemHealthCard;