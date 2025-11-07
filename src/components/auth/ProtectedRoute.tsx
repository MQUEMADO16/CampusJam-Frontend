import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/auth.context';
import { Spin } from 'antd';

/**
 * This component acts as a gatekeeper for private routes.
 * 1. If auth is loading, it shows a spinner.
 * 2. If no user is logged in, it redirects to the /login page.
 * 3. If a user is logged in, it renders the child routes (e.g., the dashboard).
 */
const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Show a full-page spinner while the auth state is being checked
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  // If loading is done and there's no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If loading is done and there IS a user, render the nested child routes
  return <Outlet />;
};

export default ProtectedRoute;
