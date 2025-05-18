"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from './types';
import { authService, userService } from './api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile if token exists
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const res = await userService.getUserProfile();
        setUser(res.user);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    await authService.login({ email, password });
    await refreshUser();
    setLoading(false);
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    await authService.register({ name, email, password });
    await refreshUser();
    setLoading(false);
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    await authService.logout();
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
