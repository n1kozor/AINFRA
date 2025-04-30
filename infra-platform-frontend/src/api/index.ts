// src/api/index.ts
import { deviceApi } from './deviceApi';
import { standardDeviceApi } from './standardDeviceApi';
import { customDeviceApi } from './customDeviceApi';
import { pluginApi } from './pluginApi';
import { availabilityApi } from './availability';

// Export API modules
export const api = {
  devices: deviceApi,
  standardDevices: standardDeviceApi,
  customDevices: customDeviceApi,
  plugins: pluginApi,
  availability: availabilityApi,
};

// Export individual APIs for direct import
export { deviceApi, standardDeviceApi, customDeviceApi, pluginApi, availabilityApi };