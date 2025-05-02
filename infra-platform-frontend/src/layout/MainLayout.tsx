import { ReactNode, useEffect } from 'react';
import { Box, CssBaseline, alpha, useTheme } from '@mui/material';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { sidebarOpen } = useAppContext();
  const theme = useTheme();

  // Apply smooth scrolling to the document
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      background: theme.palette.mode === 'dark'
        ? `linear-gradient(135deg, ${alpha('#06101f', 0.92)} 0%, ${alpha('#0f172a', 0.95)} 100%)`
        : `linear-gradient(135deg, ${alpha('#f8fafc', 0.92)} 0%, ${alpha('#eef2f7', 0.95)} 100%)`,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <CssBaseline />

      {/* Decorative elements for visual interest */}
      <Box
        sx={{
          position: 'fixed',
          top: '10%',
          right: '5%',
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)}, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(60px)',
          opacity: 0.6,
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: 'fixed',
          bottom: '15%',
          left: '10%',
          width: '250px',
          height: '250px',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.15)}, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(60px)',
          opacity: 0.5,
          zIndex: 0,
        }}
      />

      <Header />
      <Sidebar />

      <Box
        component={motion.main}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        sx={{
          flexGrow: 1,
          p: 0,
          pl: 0, // Remove left padding
          width: { sm: sidebarOpen ? 'calc(100% - 280px)' : '100%' },
          ml: { sm: sidebarOpen ? '280px' : 0 }, // Match Sidebar width
          transition: theme => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
          overflowX: 'hidden',
          overflowY: 'auto', // Make content scrollable
          position: 'fixed', // Fix the position
          top: '64px', // Header height
          bottom: 0,
          right: 0,
          zIndex: 1, // Position above decorative elements
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;