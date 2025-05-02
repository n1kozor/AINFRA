// src/types/device.ts
export type DeviceType = 'standard' | 'custom';
export type OSType = 'windows' | 'macos' | 'linux';

export interface StandardDeviceData {
  id: number;
  os_type: OSType;
  hostname: string;
}

export interface CustomDeviceData {
  id: number;
  plugin_id: number;
  plugin_name: string;
  connection_params: Record<string, any>;
}

export interface Device {
  id: number;
  name: string;
  description: string | null;
  ip_address: string;
  type: DeviceType;
  created_at: string;
  updated_at: string;
  standard_device: StandardDeviceData | null;
  custom_device: CustomDeviceData | null;
}

export interface StandardDeviceCreate {
  os_type: OSType;
  hostname: string;
}

export interface CustomDeviceCreate {
  plugin_id: number;
  connection_params: Record<string, any>;
}

export interface DeviceCreate {
  name: string;
  description?: string;
  ip_address: string;
  type: DeviceType;
  standard_device?: StandardDeviceCreate;
  custom_device?: CustomDeviceCreate;
}

export interface DeviceUpdate {
  name?: string;
  description?: string;
  ip_address?: string;
}

export interface DeviceStats {
  cpu?: {
    usage: number;
    cores: { core: number; usage: number }[];
    temperature: any[];
  };
  memory?: {
    total: number;
    used: number;
    free: number;
    percent: number;
  };
  disk?: {
    device: string;
    mountpoint: string;
    total: number;
    used: number;
    free: number;
    percent: number;
  }[];
  network?: {
    interface: string;
    rx: number;
    tx: number;
    rx_packets: number;
    tx_packets: number;
  }[];
  processes?: {
    total: number;
    running: number;
    sleeping: number;
    thread: number;
  };
  system?: {
    hostname: string;
    os_name: string;
    os_version: string;
    uptime: string;
  };
  error?: string;
}