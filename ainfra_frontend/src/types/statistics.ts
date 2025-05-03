// src/types/statistics.ts
export interface SystemStatus {
  timestamp: string;
  service_name: string;
  version: string;
  background_checks_running: boolean;
  check_interval_minutes: number;
  time_range?: string;
}

export interface DeviceSummary {
  total_devices: number;
  active_devices: number;
  inactive_devices: number;
}

export interface AvailabilitySummary {
  devices_available: number;
  devices_unavailable: number;
  availability_rate: number;
  avg_response_time_ms: number | null;
}

export interface HourlyTrend {
  hour: string;
  availability_rate: number;
  check_count: number;
}

export interface DeviceError {
  device_id: number;
  device_name: string;
  error_message: string;
  timestamp: string;
}

export interface SlowDevice {
  device_id: number;
  device_name: string;
  is_available: boolean;
  response_time: number;
  check_method: string;
  timestamp: string;
  error: string | null;
}

export interface SystemStatistics {
  system_status: SystemStatus;
  device_summary: DeviceSummary;
  availability_summary: AvailabilitySummary;
  check_methods: Record<string, number>;
  hourly_trend: HourlyTrend[];
  recent_errors: DeviceError[];
  top_slowest_devices: SlowDevice[];
  error?: string;
  message?: string;
}

export type TimeRangeOption = '30m' | '1h' | '6h' | '24h' | '7d' | 'all';