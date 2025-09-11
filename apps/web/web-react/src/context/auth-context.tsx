import { createContext, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface User {
  sub: string;
  exp: number;
  [key: string]: any;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, expiresAt: string) => void;
  logout: () => void;
}

const authContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const getAuthToken = () => {
  const token = Cookies.get('token');
  if (token) {
    const decodedToken = jwtDecode<User>(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp > currentTime) {
      return true;
    }
  }
  return false;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(getAuthToken());

  const login = (token: string, expiresAt: string) => {
    Cookies.set('token', token, {
      expires: new Date(expiresAt),
      secure: true,
      sameSite: 'strict',
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
  };

  return (
    <authContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </authContext.Provider>
  );
}

export default authContext;
