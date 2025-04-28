// MainLayout.tsx
import React, { ReactNode } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import { useAppContext } from '../context/AppContext';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { sidebarOpen } = useAppContext();

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      background: theme => theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #0a1929 0%, #132f4c 100%)'
        : 'linear-gradient(135deg, #f0f4f8 0%, #d7e3fc 100%)',
      overflow: 'hidden'
    }}>
      <CssBaseline />
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: sidebarOpen ? 'calc(100% - 280px)' : '100%' },
          ml: { sm: 0 },
          transition: theme => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
          overflowX: 'hidden',
        }}
      >
        <Toolbar /> {/* This adds spacing below the app bar */}
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;