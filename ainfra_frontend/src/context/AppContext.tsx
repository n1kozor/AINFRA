// src/context/AppContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { sensorApi } from '../api';
import { Alert, AlertStatus } from '../types/sensor';

type AppContextType = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeAlerts: Alert[];
  loadingAlerts: boolean;
  refreshAlerts: () => Promise<Alert[]>;
  resolveAlert: (alertId: number) => Promise<boolean>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const refreshAlerts = async () => {
    try {
      setLoadingAlerts(true);
      const alerts = await sensorApi.getActiveAlerts();
      const filteredAlerts = alerts.filter(alert =>
        alert.status === AlertStatus.NEW ||
        alert.status === AlertStatus.ONGOING
      );
      setActiveAlerts(filteredAlerts);
      return alerts;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    } finally {
      setLoadingAlerts(false);
    }
  };

  const resolveAlert = async (alertId: number) => {
    try {
      await sensorApi.resolveAlert(alertId);
      setActiveAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
      return true;
    } catch (error) {
      console.error('Error resolving alert:', error);
      return false;
    }
  };

  useEffect(() => {
    refreshAlerts();

    const interval = setInterval(() => {
      refreshAlerts();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        searchQuery,
        setSearchQuery,
        activeAlerts,
        loadingAlerts,
        refreshAlerts,
        resolveAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};