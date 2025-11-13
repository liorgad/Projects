import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ShiftDetails from './pages/ShiftDetails';
import CreateShift from './pages/CreateShift';
import DebugPanel from './components/DebugPanel';
import useLogger from './hooks/useLogger';

function App() {
  const logger = useLogger('App');
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  
  useEffect(() => {
    logger.info('App component initialized');
    
    // Log navigation events
    const logNavigation = () => {
      logger.debug(`Navigation: ${window.location.pathname}`);
    };

    // Keyboard shortcut to toggle debug panel (Ctrl+Shift+D)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        setShowDebugPanel(prev => {
          const newValue = !prev;
          logger.info(`Debug panel ${newValue ? 'shown' : 'hidden'}`);
          return newValue;
        });
      }
    };
    
    window.addEventListener('popstate', logNavigation);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('popstate', logNavigation);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [logger]);
  
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes for all authenticated users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shifts/:id" element={<ShiftDetails />} />
          </Route>

          {/* Admin-only routes */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route path="/shifts/new" element={<CreateShift />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        
        {/* Debug Panel - only show in development or when toggled */}
        <DebugPanel isVisible={showDebugPanel} />
      </Router>
    </AuthProvider>
  );
}

export default App;
