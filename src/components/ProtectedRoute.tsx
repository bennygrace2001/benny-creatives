import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAdmin();
  
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
}
