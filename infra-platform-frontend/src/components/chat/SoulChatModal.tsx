// src/components/chat/SoulChatModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Box,
  Typography,
  Paper,
  Divider,
  alpha,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  CloseRounded,
  SendRounded,
  PersonRounded
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Lottie from 'react-lottie-player';

interface ChatMessage {
  id: string;
  sender: 'user' | 'soul';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface SoulChatModalProps {
  open: boolean;
  onClose: () => void;
  healthScore: number;
  animationData: any;
}

const SoulChatModal: React.FC<SoulChatModalProps> = ({
  open,
  onClose,
  healthScore,
  animationData
}) => {
  const theme = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lottieRef = useRef<any>(null);

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

  // Simulate typing effect for the welcome message
  useEffect(() => {
    if (open && messages.length === 0) {
      setIsTyping(true);

      // Welcome message that will be typed out
      const welcomeMessage = `Hello! I am the Soul of your network infrastructure. I'm currently monitoring all systems and can assist with any questions about your network health and performance. The current network health status is ${getStatusText().toLowerCase()} (${healthScore}%). How can I help you today?`;

      // Initial empty message
      const initialMessage: ChatMessage = {
        id: 'welcome',
        sender: 'soul',
        content: '',
        timestamp: new Date(),
        isTyping: true
      };

      setMessages([initialMessage]);

      // Simulate typing with a delay for each character
      let currentText = '';
      let charIndex = 0;

      const typingInterval = setInterval(() => {
        if (charIndex < welcomeMessage.length) {
          currentText += welcomeMessage.charAt(charIndex);
          setMessages([{
            ...initialMessage,
            content: currentText,
            isTyping: charIndex < welcomeMessage.length - 1
          }]);
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          setMessages([{
            ...initialMessage,
            content: welcomeMessage,
            isTyping: false
          }]);
        }
      }, 30); // Speed of typing

      return () => clearInterval(typingInterval);
    }
  }, [open, healthScore]);

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [open]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle animation speed
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(1.5); // Slightly faster animation in the chat
    }
  }, [lottieRef]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isTyping) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate typing for the soul's response
    setTimeout(() => {
      const soulResponseId = `soul-${Date.now()}`;

      // Add an empty message that will show "typing"
      setMessages(prev => [...prev, {
        id: soulResponseId,
        sender: 'soul',
        content: '',
        timestamp: new Date(),
        isTyping: true
      }]);

      // Sample responses based on user input
      const userInput = newMessage.toLowerCase();
      let responseText = '';

      if (userInput.includes('hello') || userInput.includes('hi')) {
        responseText = 'Hello there! Nice to connect with you. What would you like to know about your network?';
      } else if (userInput.includes('health') || userInput.includes('status')) {
        responseText = `The current network health is ${getStatusText().toLowerCase()} with a score of ${healthScore}%. All systems are being monitored continuously.`;
      } else if (userInput.includes('issue') || userInput.includes('problem')) {
        if (healthScore < 50) {
          responseText = 'There are several critical issues affecting network performance. The primary concerns are high latency in your main router and packet loss in your eastern cluster.';
        } else if (healthScore < 80) {
          responseText = 'There are some minor issues detected. We\'re seeing slightly elevated response times in your database servers and some bandwidth constraints during peak hours.';
        } else {
          responseText = 'No significant issues detected at this time. The network is operating within optimal parameters.';
        }
      } else if (userInput.includes('improve') || userInput.includes('optimize')) {
        responseText = 'To improve network performance, consider upgrading router firmware, optimizing bandwidth allocation, and implementing QoS policies for critical services.';
      } else {
        responseText = 'I\'m monitoring all aspects of your network infrastructure. I can provide insights on network health, identify issues, and suggest optimizations. What specific area would you like to explore?';
      }

      // Simulate typing the response character by character
      let currentText = '';
      let charIndex = 0;

      const typingInterval = setInterval(() => {
        if (charIndex < responseText.length) {
          currentText += responseText.charAt(charIndex);

          setMessages(prev =>
            prev.map(msg =>
              msg.id === soulResponseId
                ? { ...msg, content: currentText, isTyping: true }
                : msg
            )
          );

          charIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);

          setMessages(prev =>
            prev.map(msg =>
              msg.id === soulResponseId
                ? { ...msg, content: responseText, isTyping: false }
                : msg
            )
          );
        }
      }, 30);

    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Determine background colors based on theme
  const headerBgColor = theme.palette.mode === 'dark'
    ? theme.palette.background.paper
    : theme.palette.background.paper;

  const contentBgColor = theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.default, 0.9)
    : theme.palette.background.default;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: theme.shadows[24],
          backgroundColor: headerBgColor,
          backgroundImage: 'none',
          minHeight: '600px',
          maxHeight: '85vh',
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: headerBgColor,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              bgcolor: alpha(healthColor, 0.1),
              color: healthColor,
              mr: 2,
              width: 50,
              height: 50,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Animated Soul Avatar */}
            <Box
              sx={{
                width: '100%',
                height: '100%',
                position: 'relative',
                filter: `brightness(1.2) contrast(1.1)`,
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
                  background: `radial-gradient(
                    circle,
                    ${alpha(healthColor, 1.7)} 0%,     /* Középpont: erős szín */
                    ${alpha(healthColor, 1.5)} 40%,    /* 40%-os távolság: közepesen erős */
                    ${alpha(healthColor, 0.001)} 70%,   /* 70%-os távolság: halványabb */
                    ${alpha(healthColor, 0.000)} 100%   /* Külső szél: nagyon halvány */
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
                  background: `radial-gradient(
                    circle,
                    ${alpha(healthColor, 0.2)} 0%,     /* Középpont: erősebb világosítás */
                    ${alpha(healthColor, 0.25)} 30%,   /* 30%-os távolság: közepesen erős */
                    ${alpha(healthColor, 0.1)} 70%,    /* 70%-os távolság: gyenge */
                    transparent 100%                  /* Külső szél: teljesen átlátszó */
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
              {animationData && (
                <Lottie
                  ref={lottieRef}
                  animationData={animationData}
                  play
                  loop
                  style={{
                    width: '100%',
                    height: '100%',
                    opacity: 0.85,
                    zIndex: 1,
                    position: 'relative'
                  }}
                />
              )}
            </Box>

            {/* Pulsing ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 0.5, 0],
                scale: [0.8, 1.2, 1.4]
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
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Network Soul
            </Typography>
            <Typography
              variant="body2"
              color={healthColor}
              sx={{ fontWeight: 500 }}
            >
              {getStatusText()} ({healthScore}%)
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} edge="end" aria-label="close"
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: alpha(theme.palette.text.primary, 0.1),
            }
          }}
        >
          <CloseRounded />
        </IconButton>
      </DialogTitle>

      {/* Messages */}
      <DialogContent sx={{
        p: 0,
        backgroundColor: contentBgColor,
        display: 'flex',
        flexDirection: 'column',
        height: '550px',
      }}>
        <Box sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 3,
          pt: 4,
          pb: 3,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.text.primary, 0.1),
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: alpha(theme.palette.text.primary, 0.2),
          },
        }}>
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                mb: 3,
                display: 'flex',
                flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
              }}
            >
              {/* Avatar */}
              {message.sender === 'user' ? (
                <Box
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                    color: theme.palette.primary.main,
                    mx: 1.5,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <PersonRounded />
                </Box>
              ) : (
                <Box
                  sx={{
                    bgcolor: alpha(healthColor, 0.1),
                    color: healthColor,
                    mx: 1.5,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  {/* Mini soul animation for each message */}
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                      filter: `brightness(1.2) contrast(1.1)`,
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
                        background: `radial-gradient(
                          circle,
                          ${alpha(healthColor, 1.7)} 0%,     /* Középpont: erős szín */
                          ${alpha(healthColor, 1.5)} 40%,    /* 40%-os távolság: közepesen erős */
                          ${alpha(healthColor, 0.001)} 70%,   /* 70%-os távolság: halványabb */
                          ${alpha(healthColor, 0.000)} 100%   /* Külső szél: nagyon halvány */
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
                        background: `radial-gradient(
                          circle,
                          ${alpha(healthColor, 0.2)} 0%,     /* Középpont: erősebb világosítás */
                          ${alpha(healthColor, 0.25)} 30%,   /* 30%-os távolság: közepesen erős */
                          ${alpha(healthColor, 0.1)} 70%,    /* 70%-os távolság: gyenge */
                          transparent 100%                  /* Külső szél: teljesen átlátszó */
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
                    {animationData && (
                      <Lottie
                        animationData={animationData}
                        play
                        loop
                        style={{
                          width: '100%',
                          height: '100%',
                          opacity: 0.85,
                          zIndex: 1,
                          position: 'relative'
                        }}
                      />
                    )}
                  </Box>
                </Box>
              )}

              {/* Message Bubble */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  borderRadius: message.sender === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  bgcolor: message.sender === 'user'
                    ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.15 : 0.08)
                    : alpha(healthColor, theme.palette.mode === 'dark' ? 0.15 : 0.08),
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: message.sender === 'user'
                    ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.3 : 0.15)
                    : alpha(healthColor, theme.palette.mode === 'dark' ? 0.3 : 0.15),
                  color: theme.palette.text.primary,
                  position: 'relative'
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.content}
                  {message.isTyping && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      ▎
                    </motion.span>
                  )}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 1,
                    textAlign: message.sender === 'user' ? 'right' : 'left',
                    opacity: 0.6
                  }}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>

                {/* Particle effects for soul messages */}
                {message.sender === 'soul' && !message.isTyping && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                      overflow: 'hidden',
                      borderRadius: '4px 16px 16px 16px',
                    }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{
                          x: Math.random() * 100,
                          y: Math.random() * 100,
                          opacity: 0,
                          scale: 0
                        }}
                        animate={{
                          x: Math.random() * 100,
                          y: Math.random() * 100,
                          opacity: [0, 0.5, 0],
                          scale: [0, Math.random() * 0.4 + 0.2, 0]
                        }}
                        transition={{
                          duration: Math.random() * 3 + 2,
                          repeat: Infinity,
                          repeatType: 'loop',
                          ease: 'easeInOut',
                          delay: Math.random() * 2
                        }}
                        style={{
                          position: 'absolute',
                          width: Math.random() * 4 + 2,
                          height: Math.random() * 4 + 2,
                          borderRadius: '50%',
                          backgroundColor: healthColor,
                          filter: 'blur(1px)',
                          boxShadow: `0 0 3px ${healthColor}`
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Divider sx={{ opacity: theme.palette.mode === 'dark' ? 0.2 : 0.1 }} />

        {/* Input */}
        <Box sx={{ p: 3, bgcolor: headerBgColor }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              placeholder="Message Network Soul..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              inputRef={inputRef}
              multiline
              maxRows={3}
              variant="outlined"
              InputProps={{
                sx: {
                  borderRadius: '16px',
                  bgcolor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.5)
                    : alpha(theme.palette.background.paper, 0.7),
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.2 : 0.1),
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(healthColor, 0.3),
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: healthColor,
                  },
                }
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isTyping}
              sx={{
                ml: 1.5,
                bgcolor: alpha(healthColor, 0.1),
                color: healthColor,
                '&:hover': {
                  bgcolor: alpha(healthColor, 0.2),
                },
                '&.Mui-disabled': {
                  bgcolor: alpha(theme.palette.text.primary, 0.05),
                  color: alpha(theme.palette.text.primary, 0.3),
                },
                height: 48,
                width: 48,
                borderRadius: '50%',
                boxShadow: theme.palette.mode === 'dark' ? 'none' : `0 2px 8px ${alpha(healthColor, 0.2)}`,
              }}
            >
              {isTyping ? (
                <CircularProgress size={24} sx={{ color: alpha(healthColor, 0.7) }} />
              ) : (
                <SendRounded />
              )}
            </IconButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SoulChatModal;