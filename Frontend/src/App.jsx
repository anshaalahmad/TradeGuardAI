import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminRoute from './Components/AdminRoute';
import './css/normalize.css';
import './css/tradeguard-ai.webflow.css';
import './css/webflow.css';

// Import page components
import DashboardApp from './pages/DashboardApp';
import PredictionsPage from './pages/PredictionsPage';
import ProfilePage from './pages/ProfilePage';
import { LandingPage } from './Components/Landing';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Resources pages
import LearningPlatformPage from './pages/LearningPlatformPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ChartPatternsPage from './pages/ChartPatternsPage';
import PatternDetailPage from './pages/PatternDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import BookmarksPage from './pages/BookmarksPage';

// Admin pages
import {
  AdminDashboardPage,
  UserManagementPage,
  ContentManagementPage,
  ArticleFormPage,
  PatternFormPage,
  AuditLogsPage
} from './pages/admin';

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
          {/* Cryptocurrency pages */}
          <Route
            path="/cryptocurrency"
            element={
              <ProtectedRoute>
                <DashboardApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cryptocurrency/:coinName"
            element={
              <ProtectedRoute>
                <DashboardApp />
              </ProtectedRoute>
            }
          />
          {/* Predictions page */}
          <Route
            path="/predictions"
            element={
              <ProtectedRoute>
                <PredictionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/predictions/:coinId"
            element={
              <ProtectedRoute>
                <PredictionsPage />
              </ProtectedRoute>
            }
          />
          {/* Profile page */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          
          {/* Resources - Learning Platform */}
          <Route
            path="/resources/learning"
            element={
              <ProtectedRoute>
                <LearningPlatformPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources/learning/:slug"
            element={
              <ProtectedRoute>
                <ArticleDetailPage />
              </ProtectedRoute>
            }
          />
          
          {/* Resources - Chart Patterns */}
          <Route
            path="/resources/patterns"
            element={
              <ProtectedRoute>
                <ChartPatternsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources/patterns/:slug"
            element={
              <ProtectedRoute>
                <PatternDetailPage />
              </ProtectedRoute>
            }
          />
          
          {/* Resources - Search */}
          <Route
            path="/resources/search"
            element={
              <ProtectedRoute>
                <SearchResultsPage />
              </ProtectedRoute>
            }
          />
          
          {/* Resources - Bookmarks */}
          <Route
            path="/resources/bookmarks"
            element={
              <ProtectedRoute>
                <BookmarksPage />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/content"
            element={
              <AdminRoute>
                <ContentManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/content/articles/new"
            element={
              <AdminRoute>
                <ArticleFormPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/content/articles/:id/edit"
            element={
              <AdminRoute>
                <ArticleFormPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/content/patterns/new"
            element={
              <AdminRoute>
                <PatternFormPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/content/patterns/:id/edit"
            element={
              <AdminRoute>
                <PatternFormPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <AdminRoute>
                <AuditLogsPage />
              </AdminRoute>
            }
          />
          
          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
