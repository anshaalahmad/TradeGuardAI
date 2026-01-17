import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import './css/normalize.css';
import './css/tradeguard-ai.webflow.css';
import './css/webflow.css';

// Import page components
import DashboardApp from './pages/DashboardApp';
import { LandingPage } from './Components/Landing';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <DashboardApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardApp />
              </ProtectedRoute>
            }
          />
          {/* Redirect /cryptocurrency to /app for backward compatibility */}
          <Route path="/cryptocurrency" element={<Navigate to="/app" replace />} />
          
          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
