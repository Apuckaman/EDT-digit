import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApiError, apiFetch } from '../api';

type ImportRow = {
  rowNumber: number;
  status: string;
  entity: string;
  keys: Record<string, unknown>;
  errors: { code: string; message: string; field?: string }[];
};

type ImportRun = {
  id: string;
  type: string;
  mode: 'dry-run' | 'apply';
  username: string;
  fileName: string | null;
  startedAt: string;
  finishedAt: string | null;
  summary: any;
  rows?: ImportRow[];
};

export function ImportRunDetailPage() {
  const { id } = useParams();
  const [run, setRun] = useState<ImportRun | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await apiFetch<{ data: ImportRun }>(`/api/v1/admin/import/runs/${id}`);
      setRun(resp.data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load import run');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [id]);

  return (
    <div>
      <h2>Import run detail</h2>
      {error ? <div style={{ color: 'crimson' }}>{error}</div> : null}
      {loading ? <div>Loading…</div> : null}
      {run ? (
        <>
          <div>
            <div>
              <strong>importId:</strong> <code>{run.id}</code>
            </div>
            <div>
              <strong>mode:</strong> {run.mode}
            </div>
            <div>
              <strong>user:</strong> {run.username}
            </div>
            <div>
              <strong>file:</strong> {run.fileName ?? '-'}
            </div>
            <div>
              <strong>summary:</strong>{' '}
              <code style={{ fontSize: 12 }}>{JSON.stringify(run.summary)}</code>
            </div>
          </div>

          <h3 style={{ marginTop: 16 }}>FAILED rows (first iteration)</h3>
          <table width="100%" cellPadding={6} style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th align="left">Row</th>
                <th align="left">Entity</th>
                <th align="left">Keys</th>
                <th align="left">Errors</th>
              </tr>
            </thead>
            <tbody>
              {(run.rows ?? []).map((r) => (
                <tr key={r.rowNumber}>
                  <td>{r.rowNumber}</td>
                  <td>{r.entity}</td>
                  <td>
                    <code style={{ fontSize: 12 }}>{JSON.stringify(r.keys)}</code>
                  </td>
                  <td>
                    <code style={{ fontSize: 12 }}>{JSON.stringify(r.errors)}</code>
                  </td>
                </tr>
              ))}
              {(run.rows ?? []).length === 0 ? (
                <tr>
                  <td colSpan={4}>No failed rows</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </>
      ) : null}
    </div>
  );
}

