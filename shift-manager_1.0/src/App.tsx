import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoginPage } from '@/components/auth/LoginPage';
import { RegisterPage } from '@/components/auth/RegisterPage';
import { DashboardPage } from '@/components/pages/DashboardPage';
import { CalendarPage } from '@/components/pages/CalendarPage';
import { VolunteersPage } from '@/components/pages/VolunteersPage';
import { LocationsPage } from '@/components/pages/LocationsPage';
import { ProfilePage } from '@/components/pages/ProfilePage';
import { ROUTES } from '@/constants';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              <Route path={ROUTES.DASHBOARD.slice(1)} element={<DashboardPage />} />
              <Route path={ROUTES.CALENDAR.slice(1)} element={<CalendarPage />} />
              <Route path={ROUTES.VOLUNTEERS.slice(1)} element={<VolunteersPage />} />
              <Route path={ROUTES.LOCATIONS.slice(1)} element={<LocationsPage />} />
              <Route path={ROUTES.PROFILE.slice(1)} element={<ProfilePage />} />
            </Route>
            
            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Routes>
          
          {/* Global toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
              success: {
                iconTheme: {
                  primary: 'hsl(var(--primary))',
                  secondary: 'hsl(var(--primary-foreground))',
                },
              },
              error: {
                iconTheme: {
                  primary: 'hsl(var(--destructive))',
                  secondary: 'hsl(var(--destructive-foreground))',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App; 