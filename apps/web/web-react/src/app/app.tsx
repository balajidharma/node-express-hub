import { Route, Routes, Link } from 'react-router';
import HomePage from '../pages/home';
import LoginPage from '../pages/auth/login';

export function App() {
  return (
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/login"
          element={<LoginPage canResetPassword={true} />}
        />
      </Routes>
  );
}

export default App;
