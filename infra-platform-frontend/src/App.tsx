import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import MainLayout from './layout/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import StandardDevices from './pages/Devices/StandardDevices';
import CustomDevices from './pages/Devices/CustomDevices';
import DeviceDetails from './pages/Devices/DeviceDetails';
import NewDevice from './pages/Devices/NewDevice';
import Plugins from './pages/Plugins';
import PluginDetails from './pages/Plugins/PluginDetails';
import NewPlugin from './pages/Plugins/NewPlugin';
import Settings from './pages/Settings';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppProvider>
          <CssBaseline />

          <BrowserRouter>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/devices">
                  <Route path="standard" element={<StandardDevices />} />
                  <Route path="custom" element={<CustomDevices />} />
                  <Route path="new" element={<NewDevice />} />
                  <Route path=":id" element={<DeviceDetails />} />
                </Route>
                <Route path="/plugins">
                  <Route index element={<Plugins />} />
                  <Route path=":id" element={<PluginDetails />} />
                  <Route path="new" element={<NewPlugin />} />
                </Route>
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;