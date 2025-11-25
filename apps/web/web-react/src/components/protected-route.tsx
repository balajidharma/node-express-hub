import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useSelector } from 'react-redux'

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authState = useSelector((state: any) => state.auth);
  const location = useLocation();
  return (
    <>
      {!authState.isAuthenticated ? (
        <Navigate to="/login" state={{ from: location }} replace />
      ) : (
        children
      )}
    </>
  );
};

export default ProtectedRoute;
