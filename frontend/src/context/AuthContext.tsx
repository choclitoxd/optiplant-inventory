import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthResponse, LoginCredentials, User } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  useEffect(() => {
    if (!token || !user) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [token, user]);

  const login = async (credentials: LoginCredentials) => {
    const response: AuthResponse = await authService.login(credentials);
    const loggedUser: User = {
      id: 0, // Since AuthResponse doesn't have ID, we rely on username for now, or you can add ID to AuthResponse in backend.
      username: response.username,
      email: response.email,
      fullName: response.fullName,
      roles: response.roles,
      branchId: response.branchId
    };

    setToken(response.token);
    setUser(loggedUser);
    
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(loggedUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
