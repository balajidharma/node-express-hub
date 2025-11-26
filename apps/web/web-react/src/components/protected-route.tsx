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
      {authState.isLoading ? (
        <div className="mx-auto w-full max-w-sm rounded-md border border-blue-300 p-4">
          <div className="flex animate-pulse space-x-4">
            <div className="size-10 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 rounded bg-gray-200"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                  <div className="col-span-1 h-2 rounded bg-gray-200"></div>
                </div>
                <div className="h-2 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {!authState.isAuthenticated ? (
            <Navigate to="/login" state={{ from: location }} replace />
          ) : (
            children
          )}
        </>
      )}
    </>
  );
};

export default ProtectedRoute;
