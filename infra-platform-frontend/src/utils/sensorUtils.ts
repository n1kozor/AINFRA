// src/utils/sensorUtils.ts
import { AlertLevel, AlertStatus } from '../types/sensor';

export const formatAlertCondition = (condition: string): string => {
  // Format condition for display purposes
  return condition
    .replace(/>/g, '>')
    .replace(/</g, '<')
    .replace(/==/g, '=')
    .replace(/>=/g, '≥')
    .replace(/<=/g, '≤');
};

export const getAlertLevelColor = (level: AlertLevel): string => {
  switch (level) {
    case AlertLevel.INFO:
      return 'blue';
    case AlertLevel.WARNING:
      return 'orange';
    case AlertLevel.CRITICAL:
      return 'red';
    default:
      return 'gray';
  }
};

export const getAlertStatusColor = (status: AlertStatus): string => {
  switch (status) {
    case AlertStatus.NEW:
      return 'blue';
    case AlertStatus.ONGOING:
      return 'orange';
    case AlertStatus.RESOLVED:
      return 'green';
    default:
      return 'gray';
  }
};

export const getAlertStatusIcon = (status: AlertStatus): string => {
  switch (status) {
    case AlertStatus.NEW:
      return 'bell';
    case AlertStatus.ONGOING:
      return 'exclamation-triangle';
    case AlertStatus.RESOLVED:
      return 'check-circle';
    default:
      return 'circle';
  }
};

export const formatTimeSince = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else {
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
  }
};

export const getCommonMetricKeys = (): { label: string, value: string }[] => {
  return [
    { label: 'CPU Total Usage', value: 'cpu.total' },
    { label: 'Memory Used', value: 'mem.available' },

  ];
};

export const getCommonAlertConditions = (): { label: string, value: string }[] => {
  return [
    { label: 'Greater than (>)', value: '>' },
    { label: 'Less than (<)', value: '<' },
    { label: 'Equal to (==)', value: '==' },
    { label: 'Greater than or equal to (>=)', value: '>=' },
    { label: 'Less than or equal to (<=)', value: '<=' },
    { label: 'Not equal to (!=)', value: '!=' }
  ];
};