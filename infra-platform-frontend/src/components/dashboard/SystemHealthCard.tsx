// SystemHealthCard.tsx - completely restructured approach
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HealthAndSafetyRounded as HealthIcon, RefreshRounded as RefreshIcon } from '@mui/icons-material';
import Lottie from 'react-lottie-player';
import ChatOverlay from './ChatOverlay';

interface SystemHealthCardProps {
  healthScore: number;
  onRefresh: () => void;
}

const SystemHealthCard: React.FC<SystemHealthCardProps> = ({ healthScore, onRefresh }) => {
  const theme = useTheme();
  const { t } = useTranslation(['dashboard']);
  const [animationData, setAnimationData] = useState<any>(null);
  const lottieRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const soulRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [soulPosition, setSoulPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Get color based on health score
  const getHealthColor = () => {
    if (healthScore > 80) return theme.palette.success.main;
    if (healthScore > 50) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const healthColor = getHealthColor();

  // Get status text based on health score
  const getStatusText = () => {
    if (healthScore > 80) return t('systemHealth.excellent');
    if (healthScore > 50) return t('systemHealth.acceptable');
    return t('systemHealth.critical');
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

  // Handle animation speed when hovering
  useEffect(() => {
    if (lottieRef.current) {
      if (isHovered) {
        lottieRef.current.setSpeed(1.75); // Speed up on hover
      } else {
        lottieRef.current.setSpeed(1); // Normal speed
      }
    }
  }, [isHovered, lottieRef]);

  // Handle soul click - capture position for animation
  const handleSoulClick = () => {
    if (soulRef.current) {
      const rect = soulRef.current.getBoundingClientRect();
      setSoulPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height
      });
    }
    setIsChatOpen(true);
  };

  return (
    <>
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
          position: 'relative',
          zIndex: 1
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
            <HealthIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
            <Typography variant="h6" fontWeight={700}>
              {t('systemHealth.title')}
            </Typography>
          </Box>
          <Tooltip title={t('refresh')} arrow>
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

        {/* Soul animation content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Container for soul, centered within its parent */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2,
              mt: 1,
              width: 150,  // Match the soul size
              height: 150, // Match the soul size
            }}
            ref={containerRef}
          >
            {/* BACKGROUND EFFECTS - absolute positioned and stacked underneath */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              {/* Background glow effect */}
              <motion.div
                animate={isHovered ? {
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                } : {
                  scale: 1,
                  opacity: 0.5
                }}
                transition={{
                  duration: 2,
                  repeat: isHovered ? Infinity : 0,
                  repeatType: "reverse"
                }}
                style={{
                  position: 'absolute',
                  width: '150%',
                  height: '150%',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${alpha(healthColor, 0.3)} 0%, transparent 70%)`,
                  filter: `blur(${isHovered ? 20 : 15}px)`,
                }}
              />

              {/* Pulsing rings around soul */}
              {isHovered && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: [0, 0.5, 0],
                      scale: [0.8, 1.2, 1.5]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeOut"
                    }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      border: `2px solid ${alpha(healthColor, 0.6)}`,
                    }}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: [0, 0.5, 0],
                      scale: [0.8, 1.2, 1.5]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      delay: 0.5,
                      ease: "easeOut"
                    }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      border: `2px solid ${alpha(healthColor, 0.6)}`,
                    }}
                  />
                </>
              )}
            </Box>

            {/* FOREGROUND: Soul animation with higher stacking context */}
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
                cursor: 'pointer',
                position: 'relative',
                width: 150,
                height: 150,
                // Creating a new stacking context with transform ensures this
                // element and all its children render on top of siblings
                transform: 'translateZ(0)'
              }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              onClick={handleSoulClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                ref={soulRef}
                animate={isHovered ? {
                  y: [0, -8, 0],
                  rotateZ: [0, 5, -5, 0],
                } : {
                  y: [0, -5, 0],
                }}
                transition={{
                  y: {
                    repeat: Infinity,
                    duration: isHovered ? 1.2 : 2,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  },
                  rotateZ: {
                    repeat: Infinity,
                    duration: 5,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }
                }}
                style={{
                  position: 'relative',
                  filter: isHovered ? 'brightness(1.3) contrast(1.2)' : 'brightness(1.2) contrast(1.1)',
                  transition: 'filter 0.3s ease-in-out',
                  width: '100%',
                  height: '100%',
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
                    opacity: isHovered ? 0.9 : 0.7,
                    borderRadius: '50%',
                    transition: 'opacity 0.3s ease-in-out',
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
                    backgroundColor: alpha(healthColor, isHovered ? 0.5 : 0.3),
                    zIndex: 3,
                    borderRadius: '50%',
                    transition: 'background-color 0.3s ease-in-out',
                  }}
                />

                {/* Lottie animation */}
                {animationData ? (
                  <Box
                    sx={{
                      position: 'relative',
                      zIndex: 1,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Lottie
                      ref={lottieRef}
                      animationData={animationData}
                      play
                      loop
                      style={{
                        width: '100%',
                        height: '100%',
                        opacity: 0.85,
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: alpha(healthColor, 0.2),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: isHovered ? 1 : 2,
                        ease: "linear"
                      }}
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

                {/* Additional particles when hovered */}
                {isHovered && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                      zIndex: 5
                    }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{
                          x: '-50%',
                          y: '-50%',
                          scale: 0,
                          opacity: 0
                        }}
                        animate={{
                          x: ['-50%', `calc(-50% + ${(Math.random() - 0.5) * 60}px)`],
                          y: ['-50%', `calc(-50% + ${(Math.random() - 0.5) * 60}px)`],
                          scale: [0, Math.random() * 0.5 + 0.5],
                          opacity: [0, 0.8, 0]
                        }}
                        transition={{
                          duration: Math.random() * 2 + 1,
                          delay: Math.random() * 0.5,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: Math.random() * 6 + 2,
                          height: Math.random() * 6 + 2,
                          borderRadius: '50%',
                          backgroundColor: healthColor,
                          filter: 'blur(1px)',
                          boxShadow: `0 0 5px ${healthColor}`
                        }}
                      />
                    ))}
                  </Box>
                )}
              </motion.div>
            </motion.div>
          </Box>

          {/* Health score and status */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Typography
              variant="h3"
              fontWeight={700}
              color={healthColor}
              textAlign="center"
              sx={{
                mt: 1,
                textShadow: `0 0 10px ${alpha(healthColor, 0.4)}`
              }}
            >
              {healthScore}%
            </Typography>
          </motion.div>

          {/* Status text */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
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
              {getStatusText()} {t('systemHealth.status')}
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
              sx={{ mt: 1, textAlign: 'center', maxWidth: '90%', mx: 'auto' }}
            >
              {healthScore > 80
                ? t('systemHealth.happySoulMessage')
                : healthScore > 50
                  ? t('systemHealth.troubledSoulMessage')
                  : t('systemHealth.sufferingSoulMessage')}
            </Typography>
          </motion.div>
        </Box>
      </Paper>

      {/* Chat Overlay */}
      <AnimatePresence>
        {isChatOpen && (
          <ChatOverlay
            onClose={() => setIsChatOpen(false)}
            healthScore={healthScore}
            healthColor={healthColor}
            initialPosition={soulPosition}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default SystemHealthCard;