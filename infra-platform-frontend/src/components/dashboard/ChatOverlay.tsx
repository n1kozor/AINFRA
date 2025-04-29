// ChatOverlay.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  TextField,
  useTheme,
  alpha,
  Avatar,
} from '@mui/material';
import { Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie-player';

interface ChatOverlayProps {
  onClose: () => void;
  healthScore: number;
  healthColor: string;
  initialPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({
  onClose,
  healthScore,
  healthColor,
  initialPosition
}) => {
  const theme = useTheme();
  const { t } = useTranslation(['dashboard']);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Calculate initial position for the animation
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // Calculate scaling and position based on initial soul position
  const initialScale = Math.min(initialPosition.width / 800, initialPosition.height / (window.innerHeight * 0.8));
  const initialX = initialPosition.x - centerX;
  const initialY = initialPosition.y - centerY;

  // Load soul animation data
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

  // Add initial system message
  useEffect(() => {
    // Only add the initial message after the entrance animation completes
    if (animationComplete) {
      const initialGreeting = healthScore > 80
        ? "Hello! I'm your system soul, feeling great today! How can I help you?"
        : healthScore > 50
          ? "Hi there. I'm your system soul. I'm not feeling my best, but I'm here to assist you."
          : "Hello... I'm your system soul and I'm not feeling well. But I'll try to help if I can...";

      setMessages([
        {
          id: 1,
          text: initialGreeting,
          isUser: false,
          timestamp: new Date()
        }
      ]);

      // Start typing indicator for additional message
      setTimeout(() => {
        setIsTyping(true);

        setTimeout(() => {
          const secondMessage = "What would you like to know about your system today?";

          setMessages(prev => [
            ...prev,
            {
              id: 2,
              text: secondMessage,
              isUser: false,
              timestamp: new Date()
            }
          ]);
          setIsTyping(false);
        }, 2000);
      }, 1000);
    }
  }, [animationComplete, healthScore]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages([...messages, newUserMessage]);
    setMessage('');

    // Simulate AI typing
    setIsTyping(true);

    // Simulate response after delay
    setTimeout(() => {
      const responses = [
        "I understand your concern. Let me look into that for you.",
        "That's interesting. I'm processing your request now.",
        "I see what you mean. Let me think about that for a moment.",
        "I'm analyzing your question. One moment please.",
        "I appreciate your input. Let me formulate a response.",
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const newSystemMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newSystemMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Handle key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Creates particles for the soul expansion effect - positioned relative to center
  const renderParticles = () => {
    return [...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        initial={{
          x: 0,
          y: 0,
          scale: 0,
          opacity: 0
        }}
        animate={{
          x: [0, (Math.random() - 0.5) * 300],
          y: [0, (Math.random() - 0.5) * 300],
          scale: [0, Math.random() * 0.9 + 0.1],
          opacity: [0, 0.8, 0]
        }}
        transition={{
          duration: Math.random() * 1.5 + 0.5,
          delay: 0.2 + Math.random() * 0.3,
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: Math.random() * 10 + 4,
          height: Math.random() * 10 + 4,
          borderRadius: '50%',
          backgroundColor: healthColor,
          filter: 'blur(2px)',
          boxShadow: `0 0 10px ${healthColor}`,
          transform: 'translate(-50%, -50%)'
        }}
      />
    ));
  };

  return (
    <motion.div
      initial={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        backgroundColor: 'rgba(0,0,0,0)',
      }}
      animate={{
        backgroundColor: alpha(theme.palette.background.default, 0.8),
        backdropFilter: 'blur(8px)',
        pointerEvents: 'auto',
      }}
      transition={{
        backgroundColor: { delay: 0.3, duration: 0.5 },
        backdropFilter: { delay: 0.3, duration: 0.5 }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Soul expansion animation - centered positioning */}
      <motion.div
        ref={chatBoxRef}
        initial={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '800px',
          height: '80vh',
          maxWidth: '90%',
          x: initialX,
          y: initialY,
          translateX: '-50%',
          translateY: '-50%',
          scale: initialScale,
          borderRadius: '50%',
          opacity: 1,
          zIndex: 10000,
        }}
        animate={{
          x: 0,
          y: 0,
          translateX: '-50%',
          translateY: '-50%',
          scale: 1,
          borderRadius: '16px',
          opacity: 1,
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 200,
          duration: 0.7,
        }}
        onAnimationComplete={() => setAnimationComplete(true)}
      >
        {/* Expansion particles */}
        {renderParticles()}

        {/* Chat interface */}
        <Paper
          elevation={4}
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
            background: theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.9)
              : alpha(theme.palette.background.paper, 0.95),
            boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.2)}`,
            position: 'relative',
          }}
        >
          {/* Soul animation that fades out - centered in dialog */}
          <AnimatePresence>
            {!animationComplete && animationData && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 0.8, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) scale(2)',
                  zIndex: 10,
                  width: 150,
                  height: 150,
                  filter: 'brightness(1.5)',
                }}
              >
                {/* Colored overlay */}
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
                    opacity: 0.9,
                    borderRadius: '50%',
                  }}
                />

                <Lottie
                  animationData={animationData}
                  play
                  loop
                  style={{
                    width: '100%',
                    height: '100%',
                    opacity: 0.85,
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat content - fades in after animation completes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: animationComplete ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              width: '100%',
            }}
          >
            {/* Chat header */}
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${theme.palette.divider}`,
                background: `linear-gradient(135deg, ${alpha(healthColor, 0.1)}, ${alpha(healthColor, 0.05)})`,
              }}
            >
              <Box display="flex" alignItems="center">
                <motion.div
                  initial={{ scale: 1.5, x: -20, opacity: 0 }}
                  animate={{ scale: 1, x: 0, opacity: 1 }}
                  transition={{
                    delay: animationComplete ? 0.2 : 0,
                    type: 'spring',
                    damping: 20
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: alpha(healthColor, 0.2),
                      color: healthColor,
                      width: 42,
                      height: 42,
                      mr: 2,
                      border: `2px solid ${alpha(healthColor, 0.5)}`,
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut"
                      }}
                    >
                      S
                    </motion.div>
                  </Avatar>
                </motion.div>

                <Box>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: animationComplete ? 0.3 : 0 }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      {t('systemHealth.systemSoul')}
                    </Typography>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: animationComplete ? 0.4 : 0 }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {healthScore > 80
                        ? t('systemHealth.excellent')
                        : healthScore > 50
                          ? t('systemHealth.acceptable')
                          : t('systemHealth.critical')} {t('systemHealth.status')}
                    </Typography>
                  </motion.div>
                </Box>
              </Box>

              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: animationComplete ? 0.5 : 0 }}
              >
                <IconButton
                  onClick={onClose}
                  size="small"
                  sx={{
                    background: alpha(theme.palette.common.white, 0.1),
                    backdropFilter: 'blur(5px)',
                    '&:hover': {
                      background: alpha(theme.palette.common.white, 0.2),
                    }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </motion.div>
            </Box>

            {/* Chat messages area */}
            <Box
              sx={{
                p: 3,
                flexGrow: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                position: 'relative',
              }}
            >
              {/* Show a glowing orb when no messages yet - perfectly centered */}
              {messages.length === 0 && !isTyping && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      boxShadow: [
                        `0 0 20px ${alpha(healthColor, 0.4)}`,
                        `0 0 30px ${alpha(healthColor, 0.6)}`,
                        `0 0 20px ${alpha(healthColor, 0.4)}`,
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${healthColor} 30%, ${alpha(healthColor, 0.5)} 70%)`,
                      marginBottom: 20,
                    }}
                  />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'center' }}
                  >
                    Establishing connection with System Soul...
                  </Typography>
                </Box>
              )}

              {/* Messages */}
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{
                      opacity: 0,
                      y: 20,
                      x: msg.isUser ? 20 : -20,
                      scale: 0.95
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      x: 0,
                      scale: 1
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      type: 'spring',
                      damping: 25,
                      stiffness: 300
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                        mb: 2
                      }}
                    >
                      {!msg.isUser && (
                        <Avatar
                          sx={{
                            bgcolor: alpha(healthColor, 0.2),
                            color: healthColor,
                            mr: 1.5,
                            width: 36,
                            height: 36
                          }}
                        >
                          S
                        </Avatar>
                      )}

                      <Paper
                        elevation={0}
                        sx={{
                          maxWidth: '70%',
                          p: 2,
                          borderRadius: 3,
                          bgcolor: msg.isUser
                            ? alpha(theme.palette.primary.main, 0.1)
                            : alpha(theme.palette.background.default, 0.5),
                          borderTopLeftRadius: !msg.isUser ? 0 : undefined,
                          borderTopRightRadius: msg.isUser ? 0 : undefined,
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Glowing border effect for soul messages */}
                        {!msg.isUser && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              borderLeft: `2px solid ${alpha(healthColor, 0.6)}`,
                              opacity: 0.5,
                              pointerEvents: 'none',
                            }}
                          />
                        )}

                        <Typography variant="body1">
                          {msg.text}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          textAlign={msg.isUser ? "right" : "left"}
                          sx={{ mt: 0.5 }}
                        >
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Paper>

                      {msg.isUser && (
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                            ml: 1.5,
                            width: 36,
                            height: 36
                          }}
                        >
                          U
                        </Avatar>
                      )}
                    </Box>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        ml: 7
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 0.5,
                          p: 1.5,
                          borderRadius: 3,
                          bgcolor: alpha(theme.palette.background.default, 0.5),
                          width: 'fit-content',
                        }}
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{
                              y: [0, -5, 0],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.8,
                              ease: "easeInOut",
                              delay: i * 0.15
                            }}
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: healthColor,
                                boxShadow: `0 0 5px ${healthColor}`
                              }}
                            />
                          </motion.div>
                        ))}
                      </Box>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Reference for auto-scrolling */}
              <div ref={messagesEndRef} />
            </Box>

            {/* Message input */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{
                y: animationComplete ? 0 : 50,
                opacity: animationComplete ? 1 : 0
              }}
              transition={{ delay: 0.5, type: 'spring', damping: 20 }}
            >
              <Box
                sx={{
                  p: 2,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  background: `linear-gradient(135deg, ${alpha(healthColor, 0.05)}, ${alpha(healthColor, 0.1)})`,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(8px)',
                      }
                    }}
                  />

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconButton
                      onClick={handleSendMessage}
                      disabled={message.trim() === ''}
                      sx={{
                        bgcolor: alpha(healthColor, 0.2),
                        color: healthColor,
                        borderRadius: 2,
                        height: 40,
                        width: 40,
                        '&:hover': {
                          bgcolor: alpha(healthColor, 0.3),
                        },
                        '&:disabled': {
                          bgcolor: alpha(theme.palette.action.disabled, 0.1),
                          color: theme.palette.action.disabled,
                        }
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  </motion.div>
                </Box>
              </Box>
            </motion.div>
          </motion.div>
        </Paper>
      </motion.div>
    </motion.div>
  );
};

export default ChatOverlay;