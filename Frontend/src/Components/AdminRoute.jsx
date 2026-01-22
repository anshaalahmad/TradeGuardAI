/**
 * AdminRoute Component
 * Protected route wrapper that checks for admin access
 * Redirects non-admins to access denied page
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Access Denied component for non-admins
const AccessDenied = () => (
  <div className="access-denied-page">
    <div className="access-denied-container">
      <div className="access-denied-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ef5350" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M4.93 4.93l14.14 14.14"></path>
        </svg>
      </div>
      <h1 className="text-size-xlarge text-weight-semibold">Access Denied</h1>
      <p className="text-size-regular text-color-secondary">
        You don't have permission to access the admin panel.
        <br />
        Please contact an administrator if you believe this is an error.
      </p>
      <div className="access-denied-actions">
        <a href="/dashboard" className="button is-secondary">
          Go to Dashboard
        </a>
        <a href="/" className="button">
          Go Home
        </a>
      </div>
    </div>

    <style>{`
      .access-denied-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(180deg, #fafbfc 0%, #fff 100%);
        padding: 2rem;
      }
      
      .access-denied-container {
        text-align: center;
        max-width: 400px;
        padding: 3rem;
        background: white;
        border-radius: 1rem;
        border: 1px solid #e5e5e7;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
      }
      
      .access-denied-icon {
        margin-bottom: 1.5rem;
      }
      
      .access-denied-container h1 {
        margin: 0 0 1rem;
        color: #323539;
      }
      
      .access-denied-container p {
        margin: 0 0 2rem;
        line-height: 1.6;
      }
      
      .access-denied-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }
    `}</style>
  </div>
);

// Loading spinner while checking auth
const LoadingSpinner = () => (
  <div className="admin-loading">
    <div className="admin-loading-spinner"></div>
    <p>Verifying admin access...</p>

    <style>{`
      .admin-loading {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        background: #fafbfc;
      }
      
      .admin-loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e5e5e7;
        border-top-color: #1e65fa;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      .admin-loading p {
        color: #858c95;
        font-size: 0.875rem;
      }
    `}</style>
  </div>
);

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show access denied if not an admin
  if (!isAdmin) {
    return <AccessDenied />;
  }

  // Render admin content if authorized
  return children;
}
