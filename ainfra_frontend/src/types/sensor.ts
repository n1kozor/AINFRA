// src/types/sensor.ts

export enum AlertLevel {
  INFO = "info",
  WARNING = "warning",
  CRITICAL = "critical"
}

export enum AlertStatus {
  NEW = "new",
  ONGOING = "ongoing",
  RESOLVED = "resolved"
}

export interface Alert {
  id: number;
  sensor_id: number;
  value: number;
  message: string;
  is_resolved: boolean;
  timestamp: string;
  status: AlertStatus;
  first_detected_at: string;
  last_checked_at: string;
  resolution_time: string | null;
  consecutive_checks: number;
}

export interface Sensor {
  id: number;
  name: string;
  description: string | null;
  device_id: number;
  metric_key: string;
  alert_condition: string;
  alert_level: AlertLevel;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  alerts: Alert[];
}

export interface SensorCreate {
  name: string;
  description?: string;
  device_id: number;
  metric_key: string;
  alert_condition: string;
  alert_level?: AlertLevel;
}

export interface SensorUpdate {
  name?: string;
  description?: string;
  metric_key?: string;
  alert_condition?: string;
  alert_level?: AlertLevel;
  is_active?: boolean;
}

export interface AlertCreate {
  sensor_id: number;
  value: number;
  message: string;
  is_resolved?: boolean;
}

export interface AlertFilter {
  device_id?: number;
  days?: number;
}