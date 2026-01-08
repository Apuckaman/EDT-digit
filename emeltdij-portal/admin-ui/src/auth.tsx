import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch, apiPostJson } from './api';

export type User = { id: number; role: 'ADMIN' | 'UGYFEL'; clientId: number | null };

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const me = await apiFetch<{ user: User }>('/api/v1/auth/me');
      setUser(me.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function login(usernameOrEmail: string, password: string) {
    await apiPostJson('/api/v1/auth/login', { usernameOrEmail, password });
    // Ticket S6-01: login után kötelező /auth/me (session validálás)
    await refresh();
  }

  async function logout() {
    await apiPostJson('/api/v1/auth/logout', {});
    setUser(null);
  }

  const value = useMemo<AuthState>(
    () => ({ user, loading, login, logout, refresh }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthProvider missing');
  return ctx;
}

