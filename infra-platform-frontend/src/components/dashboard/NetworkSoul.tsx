// src/components/NetworkSoul.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, useTheme, alpha, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import Lottie from 'react-lottie-player';
import SoulChatModal from '../chat/SoulChatModal';

interface NetworkSoulProps {
  healthScore: number;
  isLoading: boolean;
}

const NetworkSoul: React.FC<NetworkSoulProps> = ({ healthScore, isLoading }) => {
  const theme = useTheme();
  const [animationData, setAnimationData] = useState<any>(null);
  const lottieRef = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Get color based on health score
  const getHealthColor = () => {
    if (healthScore > 80) return theme.palette.success.main;
    if (healthScore > 50) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const healthColor = getHealthColor();

  // Get status text based on health score
  const getStatusText = () => {
    if (healthScore > 80) return 'Excellent';
    if (healthScore > 50) return 'Good';
    return 'Critical';
  };

  // Load the animation data
  useEffect(() => {
    // Simple fallback animation data
    const fallbackAnimation = {
      v: "5.7.4",
      fr: 30,
      ip: 0,
      op: 60,
      w: 200,
      h: 200,
      nm: "Network Pulse",
      ddd: 0,
      assets: [],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: "Core",
          sr: 1,
          ks: {
            o: { a: 0, k: 90 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [100, 100, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: {
              a: 1,
              k: [
                { t: 0, s: [100, 100, 100], e: [110, 110, 100] },
                { t: 30, s: [110, 110, 100], e: [100, 100, 100] },
                { t: 60, s: [100, 100, 100] }
              ]
            }
          },
          ao: 0,
          shapes: [
            {
              ty: "el",
              d: 1,
              s: { a: 0, k: [80, 80] },
              p: { a: 0, k: [0, 0] }
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.4, 0.6, 1, 1] },
              o: { a: 0, k: 100 },
              r: 1
            }
          ]
        },
        {
          ddd: 0,
          ind: 2,
          ty: 4,
          nm: "Pulse Ring 1",
          sr: 1,
          ks: {
            o: {
              a: 1,
              k: [
                { t: 0, s: [100], e: [0] },
                { t: 30, s: [0] }
              ]
            },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [100, 100, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: {
              a: 1,
              k: [
                { t: 0, s: [100, 100, 100], e: [150, 150, 100] },
                { t: 30, s: [150, 150, 100] }
              ]
            }
          },
          ao: 0,
          shapes: [
            {
              ty: "el",
              d: 1,
              s: { a: 0, k: [80, 80] },
              p: { a: 0, k: [0, 0] }
            },
            {
              ty: "st",
              c: { a: 0, k: [0.4, 0.6, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 3 },
              lc: 2,
              lj: 2
            }
          ]
        },
        {
          ddd: 0,
          ind: 3,
          ty: 4,
          nm: "Pulse Ring 2",
          sr: 1,
          ks: {
            o: {
              a: 1,
              k: [
                { t: 15, s: [100], e: [0] },
                { t: 45, s: [0] }
              ]
            },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [100, 100, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: {
              a: 1,
              k: [
                { t: 15, s: [100, 100, 100], e: [150, 150, 100] },
                { t: 45, s: [150, 150, 100] }
              ]
            }
          },
          ao: 0,
          shapes: [
            {
              ty: "el",
              d: 1,
              s: { a: 0, k: [80, 80] },
              p: { a: 0, k: [0, 0] }
            },
            {
              ty: "st",
              c: { a: 0, k: [0.4, 0.6, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 3 },
              lc: 2,
              lj: 2
            }
          ]
        },
        {
          ddd: 0,
          ind: 4,
          ty: 4,
          nm: "Particles",
          sr: 1,
          ks: {
            o: { a: 0, k: 80 },
            r: {
              a: 1,
              k: [
                { t: 0, s: [0], e: [360] },
                { t: 60, s: [360] }
              ]
            },
            p: { a: 0, k: [100, 100, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] }
          },
          ao: 0,
          shapes: [
            {
              ty: "gr",
              it: [
                {
                  ty: "el",
                  d: 1,
                  s: { a: 0, k: [10, 10] },
                  p: { a: 0, k: [40, 0] }
                },
                {
                  ty: "fl",
                  c: { a: 0, k: [0.4, 0.6, 1, 1] },
                  o: { a: 0, k: 100 },
                  r: 1
                }
              ]
            },
            {
              ty: "gr",
              it: [
                {
                  ty: "el",
                  d: 1,
                  s: { a: 0, k: [8, 8] },
                  p: { a: 0, k: [0, 50] }
                },
                {
                  ty: "fl",
                  c: { a: 0, k: [0.4, 0.6, 1, 1] },
                  o: { a: 0, k: 100 },
                  r: 1
                }
              ]
            },
            {
              ty: "gr",
              it: [
                {
                  ty: "el",
                  d: 1,
                  s: { a: 0, k: [12, 12] },
                  p: { a: 0, k: [-45, 20] }
                },
                {
                  ty: "fl",
                  c: { a: 0, k: [0.4, 0.6, 1, 1] },
                  o: { a: 0, k: 100 },
                  r: 1
                }
              ]
            }
          ]
        }
      ]
    };

    // Use embedded animation data
    setAnimationData(fallbackAnimation);

    // Alternatively, try to fetch if available
    try {
      fetch('/assets/soul_animation.json')
        .then(response => response.json())
        .then(data => {
          setAnimationData(data);
        })
        .catch(error => {
          console.log('Using fallback animation instead');
        });
    } catch (error) {
      console.log('Using fallback animation');
    }
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

  // Handle click to open chat
  const handleSoulClick = () => {
    setIsChatOpen(true);
  };

  if (isLoading) {
    return (
      <Box sx={{
        width: { xs: 220, sm: 260, md: 280 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Skeleton variant="circular" width={180} height={180} sx={{ mb: 3 }} />
        <Skeleton variant="text" sx={{ width: '60%', mb: 1 }} />
        <Skeleton variant="text" sx={{ width: '40%' }} />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          width: { xs: 220, sm: 260, md: 280 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Background glow effect */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '140%', md: '160%' },
            height: { xs: '140%', md: '160%' },
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(healthColor, 0.15)} 0%, transparent 70%)`,
            filter: 'blur(40px)',
            zIndex: 0,
          }}
        />

        {/* Soul container */}
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 3,
            width: { xs: 180, sm: 200, md: 200 },
            height: { xs: 180, sm: 200, md: 200 },
            zIndex: 1,
            cursor: 'pointer',
          }}
          onClick={handleSoulClick}
        >
          {/* The pulsing rings - absolutely centered */}
          <Box
            sx={{
              position: 'absolute',
              top: '0%',
              left: '0%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              zIndex: 0,
            }}
          >
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
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
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
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: `2px solid ${alpha(healthColor, 0.6)}`,
              }}
            />
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
              position: 'relative',
              width: '100%',
              height: '100%',
              zIndex: 2,
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{
                y: [0, -5, 0],
                rotateZ: [0, 3, -3, 0],
              }}
              transition={{
                y: {
                  repeat: Infinity,
                  duration: 2,
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

             {/* Színes réteg gradienssel - közepén erős, kifelé halványodó */}
<Box
  sx={{
    // Alapvető pozicionálás és méretezés
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',

    // Radial gradient beállítása:
    // - Középen erős szín (a healthColor függvényében)
    // - Kifelé haladva fokozatosan halványodik
    // - A hover állapot erősebb színeket eredményez
    background: `radial-gradient(
      circle,
      ${alpha(healthColor, isHovered ? 1.7 : 1.5)} 0%,     /* Középpont: erős szín */
      ${alpha(healthColor, isHovered ? 1.5 : 1.3)} 40%,    /* 40%-os távolság: közepesen erős */
      ${alpha(healthColor, isHovered ? 0.001 : 0.001)} 70%,   /* 70%-os távolság: halványabb */
      ${alpha(healthColor, isHovered ? 0.000 : 0.00)} 100% ,
        transparent 100%
    )`,

    // Color blending mód - ez határozza meg, hogyan keveredik az alatta lévő réteggel
    mixBlendMode: 'color',

    // Stacking context (z-index) és border-radius
    zIndex: 2,
    borderRadius: '50%',

    // Animáció az állapotváltozáskor
    transition: 'all 0.3s ease-in-out',
  }}
/>

{/* Fényerő réteg gradienssel - közepén világosabb, kifelé halványodik */}
<Box
  sx={{
    // Alapvető pozicionálás és méretezés
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',

    // Radial gradient beállítása a fényerő réteghez:
    // - Középen erősebb fényerő-növelés
    // - Kifelé haladva fokozatosan átlátszóvá válik
    // - A hover állapot erősebb világosítást eredményez
    background: `radial-gradient(
      circle,
      ${alpha(healthColor, isHovered ? 0.2 : 0.1)} 0%,     /* Középpont: erősebb világosítás */
      ${alpha(healthColor, isHovered ? 0.25 : 0.1)} 30%,   /* 30%-os távolság: közepesen erős */
      ${alpha(healthColor, isHovered ? 0.1 : 0.05)} 70%,    /* 70%-os távolság: gyenge */
      transparent 100%                                     /* Külső szél: teljesen átlátszó */
    )`,

    // Screen blending mód - ez világosítja az alatta lévő réteget
    // (Az eredmény mindig világosabb vagy ugyanolyan világos, mint az eredeti)
    mixBlendMode: 'screen',

    // Stacking context és border-radius
    zIndex: 3,
    borderRadius: '50%',

    // Animáció az állapotváltozáskor
    transition: 'all 0.3s ease-in-out',
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


      </Box>

      {/* Chat Modal */}
      <SoulChatModal
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        healthScore={healthScore}
        animationData={animationData}
      />
    </>
  );
};

export default NetworkSoul;