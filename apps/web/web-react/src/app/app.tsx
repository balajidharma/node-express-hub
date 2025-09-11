import { Route, Routes } from 'react-router';
import HomePage from '../pages/home';
import LoginPage from '../pages/auth/login';
import RegisterPage from '../pages/auth/register';
import DashboardPage from '../pages/dashboard';
import { AuthProvider } from '../context/auth-context';
import ProtectedRoute from '../components/protected-route';

export function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
