import React from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { LoginPage } from './LoginPage';
import { CompaniesPage } from './CompaniesPage';
import { CompanyDetailPage } from './CompanyDetailPage';
import { ImportRunsPage } from './ImportRunsPage';
import { ImportRunDetailPage } from './ImportRunDetailPage';
import { ImportPage } from './ImportPage';

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <strong>EDT digit – Admin</strong>
        <Link to="/companies">Companies</Link>
        <Link to="/import">Import</Link>
        <Link to="/import-runs">Import runs</Link>
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
  const { refresh } = useAuth();
  const nav = useNavigate();

  React.useEffect(() => {
    const handler = async () => {
      await refresh();
      nav('/login');
    };
    window.addEventListener('auth:unauthorized', handler as EventListener);
    return () => window.removeEventListener('auth:unauthorized', handler as EventListener);
  }, [nav, refresh]);

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
        <Route
          path="/companies/:id"
          element={
            <RequireAuth>
              <CompanyDetailPage />
            </RequireAuth>
          }
        />
        <Route
          path="/import"
          element={
            <RequireAuth>
              <ImportPage />
            </RequireAuth>
          }
        />
        <Route
          path="/import-runs"
          element={
            <RequireAuth>
              <ImportRunsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/import-runs/:id"
          element={
            <RequireAuth>
              <ImportRunDetailPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/companies" replace />} />
      </Routes>
    </Layout>
  );
}

