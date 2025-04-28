/**
 * Formats bytes into a human-readable string with appropriate units
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Formats a percentage value, ensuring it's between 0-100
 */
export const formatPercentage = (value: number): string => {
  // Ensure value is between 0 and 100
  const percentage = Math.max(0, Math.min(100, value));
  return `${Math.round(percentage)}%`;
};

/**
 * Truncates text to a specified length and adds ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Formats a date string into a localized date and time
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('default', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

/**
 * Formats a device type as a capitalized string
 */
export const formatDeviceType = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};