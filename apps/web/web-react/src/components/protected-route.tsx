import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import AuthContext from '../context/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const location = useLocation();

  if (!authContext) {
    throw new Error('AuthContext is not provided');
  }

  // Show nothing or a loading spinner while auth status is being determined
  if (typeof authContext.isAuthenticated === 'undefined') {
    return null;
  }

  console.log(
    'ProtectedRoute rendering, isAuthenticated:',
    authContext.isAuthenticated
  );

  return (
    <>
      {!authContext.isAuthenticated ? (
        <Navigate to="/login" state={{ from: location }} replace />
      ) : (
        children
      )}
    </>
  );
};

export default ProtectedRoute;
