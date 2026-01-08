import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiError, apiFetch, apiPostJson } from '../api';

type Company = {
  id: number;
  name: string;
  taxNumber: string;
  type: 'AFAS' | 'AFAMENTES';
  active: boolean;
};

type ListResp<T> = { data: T[]; meta: { page: number; limit: number; total: number; totalPages: number } };

export function CompaniesPage() {
  const [data, setData] = useState<Company[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search.trim()) qs.set('search', search.trim());
      if (showInactive) qs.set('status', 'inactive');
      const resp = await apiFetch<ListResp<Company>>(`/api/v1/companies?${qs.toString()}`);
      setData(resp.data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [page]);

  return (
    <div>
      <h2>Companies</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          placeholder="search name / taxNumber"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
          />
          Show inactive
        </label>
        <button onClick={() => void load()} disabled={loading}>
          Search
        </button>
        <span style={{ flex: 1 }} />
        <button
          onClick={async () => {
            const name = prompt('Company name?');
            const taxNumber = prompt('Tax number?');
            if (!name || !taxNumber) return;
            await apiPostJson('/api/v1/companies', { name, taxNumber, type: 'AFAS', active: true });
            await load();
          }}
        >
          New
        </button>
      </div>
      {error ? <div style={{ color: 'crimson' }}>{error}</div> : null}
      {loading ? <div>Loading…</div> : null}
      <table width="100%" cellPadding={6} style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">ID</th>
            <th align="left">Name</th>
            <th align="left">Tax number</th>
            <th align="left">Type</th>
            <th align="left">Status</th>
            <th align="left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>
                <Link to={`/companies/${c.id}`}>{c.name}</Link>
              </td>
              <td>{c.taxNumber}</td>
              <td>{c.type}</td>
              <td>{c.active ? 'active' : 'inactive'}</td>
              <td style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={async () => {
                    const name = prompt('New name?', c.name);
                    if (!name) return;
                    await apiFetch(`/api/v1/companies/${c.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name }),
                    });
                    await load();
                  }}
                  disabled={!c.active}
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (!confirm('Deactivate company?')) return;
                    await apiFetch(`/api/v1/companies/${c.id}`, { method: 'DELETE' });
                    await load();
                  }}
                  disabled={!c.active}
                >
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
          {data.length === 0 ? (
            <tr>
              <td colSpan={6}>No companies</td>
            </tr>
          ) : null}
        </tbody>
      </table>
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}

