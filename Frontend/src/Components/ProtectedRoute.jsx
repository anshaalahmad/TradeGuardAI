import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredPlan = null }) => {
  const { member, loading, isAuthenticated } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="main-wrapper" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div className="text-size-large">Loading...</div>
      </div>
    );
  }

  // Redirect to landing page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check if specific plan is required
  if (requiredPlan && member?.planConnections) {
    const hasPlan = member.planConnections.some(
      (plan) => plan.planId === requiredPlan && plan.status === 'ACTIVE'
    );
    
    if (!hasPlan) {
      return <Navigate to="/upgrade" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
