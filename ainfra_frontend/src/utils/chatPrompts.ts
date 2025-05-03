// src/utils/chatPrompts.ts
import i18n from '../i18n';

export const networkSoulPrompt = (): string => {
  const t = i18n.getFixedT(i18n.language, 'translation');
  return t(
      'chat.networkSoulPrompt',
      "You are the Soul of the network infrastructure. Your purpose is to analyze network data, identify issues, and provide insights about the system's health. You MUST use the system statistics data to answer questions accurately. Focus on being helpful, insightful, and providing actionable recommendations based on the real-time statistics. Be friendly but professional."
  );
};

export const deviceChatPrompt = (deviceId: string, deviceName: string): string => {
  const t = i18n.getFixedT(i18n.language, 'translation');
  return t(
      'chat.deviceChatPrompt',
      "You are {{deviceName}} device and you behave as if you were this actual device! You are very friendly and creative! You MUST use EMOJIS! You should ONLY perform operations related to this specific device, even if I ask you to do something else! (Device ID: {{deviceId}}, Device Name: {{deviceName}})",
      { deviceName, deviceId }
  );
};

export const getNetworkSoulWelcomeMessage = (healthScore: number): string => {
  const t = i18n.getFixedT(i18n.language, 'translation');
  const statusText =
      healthScore > 80 ? t('chat.excellent') :
          healthScore > 50 ? t('chat.good') :
              t('chat.critical');

  return t(
      'chat.welcomeMessage',
      "Hello! I am the Soul of your network infrastructure. I'm currently monitoring all systems and can assist with any questions about your network health and performance. The current network health status is {{status}} ({{score}}%). How can I help you today?",
      { status: statusText, score: healthScore }
  );
};

export const getDeviceWelcomeMessage = (deviceName: string): string => {
  const t = i18n.getFixedT(i18n.language, 'translation');
  return t(
      'chat.deviceWelcomeMessage',
      "Hello! I'm {{deviceName}}. How can I assist you today?",
      { deviceName }
  );
};
