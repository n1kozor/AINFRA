// src/utils/sensorUtils.ts
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
    { label: 'Memory Usage', value: 'mem.used' },

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