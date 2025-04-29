export interface OsDistribution {
  name: string;
  value: number;
  color: string;
}

export interface SystemHealth {
  name: string;
  value: number;
  status: 'good' | 'warning' | 'critical';
}

export interface DeviceActivity {
  time: string;
  active: number;
  inactive: number;
}

export interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  trend?: number;
}