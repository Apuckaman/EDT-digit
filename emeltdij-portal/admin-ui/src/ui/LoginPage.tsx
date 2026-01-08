import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../api';
import { useAuth } from '../auth';

export function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        try {
          await login(usernameOrEmail, password);
          nav('/companies');
        } catch (e) {
          if (e instanceof ApiError) setError(e.message);
          else setError('Login failed');
        } finally {
          setBusy(false);
        }
      }}
      style={{ maxWidth: 420 }}
    >
      <h2>Admin login</h2>
      <label>
        Username / email
        <input value={usernameOrEmail} onChange={(e) => setUsernameOrEmail(e.target.value)} />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {error ? <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div> : null}
      <button disabled={busy} style={{ marginTop: 12 }}>
        {busy ? 'Signing in…' : 'Login'}
      </button>
    </form>
  );
}

