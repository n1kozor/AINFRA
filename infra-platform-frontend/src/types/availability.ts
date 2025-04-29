export interface AvailabilityCheck {
  id: number;
  device_id: number;
  timestamp: string;
  is_available: boolean;
  response_time: number | null;
  check_method: string;
  error_message: string | null;
}

export interface AvailabilitySettings {
  check_interval_minutes: number;
}

export interface AvailabilityChartData {
  device_id: number;
  timestamps: string[];
  availability: number[]; // 1 for available, 0 for unavailable
  response_times: number[];
  daily_uptime: number[];
  daily_dates: string[];
  total_uptime_percent: number;
}

export interface DeviceAvailabilityStats {
  totalDevices: number;
  availableDevices: number;
  unavailableDevices: number;
  uptimePercent: number;
}

export interface CheckStatus {
  in_progress: boolean;
  completed_count: number;
  total_count: number;
  start_time: number | null;
  elapsed_seconds?: number;
  estimated_total_seconds?: number;
}

export interface DeviceAvailabilityResult {
  device_id: number;
  device_name: string;
  is_available: boolean;
  response_time: number | null;
  check_method: string;
  timestamp: string;
  error: string | null;
}