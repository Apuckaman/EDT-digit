import React from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { LoginPage } from './LoginPage';
import { CompaniesPage } from './CompaniesPage';

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <strong>EDT digit – Admin</strong>
        <Link to="/companies">Companies</Link>
        <span style={{ flex: 1 }} />
        {user ? (
          <>
            <span>Role: {user.role}</span>
            <button
              onClick={async () => {
                await logout();
                nav('/login');
              }}
            >
              Logout
            </button>
          </>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/companies"
          element={
            <RequireAuth>
              <CompaniesPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/companies" replace />} />
      </Routes>
    </Layout>
  );
}

