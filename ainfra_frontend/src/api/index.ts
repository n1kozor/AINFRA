// src/api/index.ts
import { deviceApi } from './deviceApi';
import { standardDeviceApi } from './standardDeviceApi';
import { customDeviceApi } from './customDeviceApi';
import { pluginApi } from './pluginApi';
import { availabilityApi } from './availability';
import { statisticsApi } from './statisticsApi';
import { sensorApi } from './sensorApi';
import { llmApi } from './llmApi';

// Export API modules
export const api = {
  devices: deviceApi,
  standardDevices: standardDeviceApi,
  customDevices: customDeviceApi,
  plugins: pluginApi,
  availability: availabilityApi,
  statistics: statisticsApi,
  sensors: sensorApi,
  llm: llmApi
};

// Export individual APIs for direct import
export {
  deviceApi,
  standardDeviceApi,
  customDeviceApi,
  pluginApi,
  availabilityApi,
  statisticsApi,
  sensorApi,
  llmApi
};