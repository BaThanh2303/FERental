import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUserInfo } from '../../context/UserContext.jsx';

export default function ProtectedAdminRoute() {
  const location = useLocation();
  const { user, loading } = useUserInfo();

  if (loading) return null;

  if (!user) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  if (String(user.role).toUpperCase() !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}


