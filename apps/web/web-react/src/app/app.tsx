import { Route, Routes, Link } from 'react-router-dom';
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
          element={<LoginPage />}
        />
      </Routes>
  );
}

export default App;
