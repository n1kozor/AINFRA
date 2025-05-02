// src/components/chat/DeviceChatModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Box,
  Typography,
  Avatar,
  Paper,
  Divider,
  alpha,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  CloseRounded,
  SendRounded,
  SmartToyRounded,
  PersonRounded
} from '@mui/icons-material';
import { llmApi } from '../../api/llmApi';
import { deviceChatPrompt, getDeviceWelcomeMessage } from '../../utils/chatPrompts';
import { useTranslation } from 'react-i18next';
import {DeviceType} from "../../types/device.ts";

interface ChatMessage {
  id: string;
  sender: 'user' | 'device';
  content: string;
  timestamp: Date;
}

interface DeviceChatModalProps {
  open: boolean;
  onClose: () => void;
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  colorScheme: any;
}

const DeviceChatModal: React.FC<DeviceChatModalProps> = ({
  open,
  onClose,
  deviceId,
  deviceName,
  deviceType,
  colorScheme
}) => {
  const { t, i18n } = useTranslation(['chat', 'common']);
  const theme = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Debug the device type to ensure it's being passed correctly
    console.log(`DeviceChatModal opened for device ${deviceName} (${deviceId}) of type: ${deviceType}`);
  }, [open, deviceId, deviceName, deviceType]);

  // Add initial message when chat opens
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'device',
          content: getDeviceWelcomeMessage(deviceName),
          timestamp: new Date()
        }
      ]);
    }

    if (open && inputRef.current) {
      // Focus the input field when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [open, deviceName, messages.length, i18n.language]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      // Format conversation history in the correct user/assistant format
      const conversationContext = messages
        .map(msg => {
          const role = msg.sender === 'user' ? 'User' : 'Assistant';
          return `${role}: ${msg.content}`;
        })
        .join('\n\n');

      // Create the full prompt with context
      const prompt = `${deviceChatPrompt(deviceId, deviceName)}\n\nConversation history:\n${conversationContext}\n\nUser: ${newMessage}\n\n${deviceName} (as Assistant):`;

      // Get response from LLM - passing the deviceType
      const response = await llmApi.generateReport(
        prompt,
        deviceId,
        deviceName,
        deviceType // Ensure this prop is passed
      );

      // Add device response
      const deviceResponse: ChatMessage = {
        id: `device-${Date.now()}`,
        sender: 'device',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, deviceResponse]);
    } catch (error) {
      console.error('Error generating device response:', error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'device',
        content: t('errorFetchingResponse', 'Sorry, I encountered an error while processing your request.'),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
          minHeight: '900px',
          maxHeight: '80vh',
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
          <Avatar
            sx={{
              bgcolor: alpha(colorScheme.main, 0.15),
              color: colorScheme.main,
              mr: 2,
              width: 40,
              height: 40
            }}
          >
            <SmartToyRounded />
          </Avatar>
          <Typography variant="h6" fontWeight={600}>
            {deviceName} ({deviceType === 'standard' ? 'Standard' : 'Custom'})
          </Typography>
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
        height: '500px',
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
              <Avatar
                sx={{
                  bgcolor: message.sender === 'user'
                    ? alpha(theme.palette.primary.main, 0.15)
                    : alpha(colorScheme.main, 0.15),
                  color: message.sender === 'user'
                    ? theme.palette.primary.main
                    : colorScheme.main,
                  mx: 1.5,
                  width: 36,
                  height: 36,
                  flexShrink: 0,
                }}
              >
                {message.sender === 'user'
                  ? <PersonRounded fontSize="small" />
                  : <SmartToyRounded fontSize="small" />
                }
              </Avatar>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  borderRadius: message.sender === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  bgcolor: message.sender === 'user'
                    ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.15 : 0.08)
                    : alpha(colorScheme.main, theme.palette.mode === 'dark' ? 0.15 : 0.08),
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: message.sender === 'user'
                    ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.3 : 0.15)
                    : alpha(colorScheme.main, theme.palette.mode === 'dark' ? 0.3 : 0.15),
                  color: theme.palette.text.primary,
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.content}
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
              </Paper>
            </Box>
          ))}
          {isLoading && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, ml: 7 }}>
              <CircularProgress size={24} sx={{ color: colorScheme.main }} />
              <Typography variant="body2" sx={{ ml: 2, color: alpha(theme.palette.text.primary, 0.6) }}>
                {t('typing', { deviceName: deviceName }, "{{deviceName}} is typing...")}
              </Typography>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        <Divider sx={{ opacity: theme.palette.mode === 'dark' ? 0.2 : 0.1 }} />

        {/* Input */}
        <Box sx={{ p: 3, bgcolor: headerBgColor }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              placeholder={t('deviceMessagePlaceholder', { deviceName: deviceName }, "Message {{deviceName}}...")}
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
                    borderColor: alpha(colorScheme.main, 0.3),
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colorScheme.main,
                  },
                }
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isLoading}
              sx={{
                ml: 1.5,
                bgcolor: alpha(colorScheme.main, 0.1),
                color: colorScheme.main,
                '&:hover': {
                  bgcolor: alpha(colorScheme.main, 0.2),
                },
                '&.Mui-disabled': {
                  bgcolor: alpha(theme.palette.text.primary, 0.05),
                  color: alpha(theme.palette.text.primary, 0.3),
                },
                height: 48,
                width: 48,
                boxShadow: theme.palette.mode === 'dark' ? 'none' : `0 2px 8px ${alpha(colorScheme.main, 0.2)}`,
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: alpha(colorScheme.main, 0.7) }} />
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

export default DeviceChatModal;