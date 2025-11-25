import { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import HomePage from '../pages/home';
import LoginPage from '../pages/auth/login';
import RegisterPage from '../pages/auth/register';
import DashboardPage from '../pages/dashboard';
import ProtectedRoute from '../components/protected-route';
import { useSelector, useDispatch } from 'react-redux'
import { getSession } from '@web-react/features/auth/authSlice';

export function App() {
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.auth);
  let gettingSession = false;
  useEffect(() => {
    if (authState.status === 'initial' && !gettingSession) {
      gettingSession = true;
      dispatch(getSession() as any);
    }
  }, [authState.status]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage canResetPassword={true} />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
