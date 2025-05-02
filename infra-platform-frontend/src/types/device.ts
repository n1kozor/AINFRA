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

export interface ProcessInfo {
  pid: number;
  name: string;
  username: string;
  cpu_percent: number;
  memory_percent: number;
  status: string;
  cmdline: string;
}

export interface ContainerInfo {
  name: string;
  id: string;
  status: string;
  image: string[];
  cpu_percent: number;
  memory_percent: number | null;
  network_rx: number;
  network_tx: number;
  uptime: string;
}

export interface DeviceStats {
  system?: {
    hostname: string;
    os_name: string;
    os_version: string;
    platform: string;
    linux_distro?: string;
    uptime: string;
  };
  cpu?: {
    usage: number;
    user: number;
    system: number;
    idle: number;
    cores_count: number;
    logical_cores: number;
    cores: { core: number; usage: number }[];
  };
  memory?: {
    total: number;
    used: number;
    free: number;
    percent: number;
    cached: number;
    buffers: number;
    swap_total: number;
    swap_used: number;
    swap_free: number;
    swap_percent: number;
  };
  disk?: {
    device: string;
    mountpoint: string;
    fs_type: string;
    total: number;
    used: number;
    free: number;
    percent: number;
  }[];
  network?: {
    interface?: string;
    rx?: number;
    tx?: number;
    rx_packets?: number;
    tx_packets?: number;
  }[];
  processes?: {
    total: number;
    running: number;
    sleeping: number;
    thread: number;
    list: ProcessInfo[];
  };
  containers?: ContainerInfo[];
  error?: string;
}