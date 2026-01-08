import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiError, apiFetch } from '../api';

type ImportRun = {
  id: string;
  type: string;
  mode: 'dry-run' | 'apply';
  username: string;
  fileName: string | null;
  startedAt: string;
  finishedAt: string | null;
  summary: any;
};

export function ImportRunsPage() {
  const [data, setData] = useState<ImportRun[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const resp = await apiFetch<{ data: ImportRun[] }>('/api/v1/admin/import/runs?limit=20');
      setData(resp.data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load import runs');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div>
      <h2>Import runs (latest 20)</h2>
      {error ? <div style={{ color: 'crimson' }}>{error}</div> : null}
      {loading ? <div>Loading…</div> : null}
      <table width="100%" cellPadding={6} style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Started</th>
            <th align="left">Mode</th>
            <th align="left">User</th>
            <th align="left">File</th>
            <th align="left">Summary</th>
            <th align="left">Link</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.id}>
              <td>{r.startedAt}</td>
              <td>{r.mode}</td>
              <td>{r.username}</td>
              <td>{r.fileName ?? '-'}</td>
              <td>
                {r.summary ? (
                  <code style={{ fontSize: 12 }}>{JSON.stringify(r.summary)}</code>
                ) : (
                  '-'
                )}
              </td>
              <td>
                <Link to={`/import-runs/${r.id}`}>details</Link>
              </td>
            </tr>
          ))}
          {data.length === 0 ? (
            <tr>
              <td colSpan={6}>No import runs</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

