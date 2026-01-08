import React, { useState } from 'react';
import { ApiError, apiFetch } from '../api';

type ImportRow = {
  rowNumber: number;
  status: string;
  entity: string;
  keys: Record<string, unknown>;
  errors: { code: string; message: string; field?: string }[];
};

type ImportResp = {
  importId: string;
  summary: { total: number; created: number; updated: number; skipped: number; failed: number };
  rows: ImportRow[];
};

async function postImport(file: File, mode: 'dry-run' | 'apply') {
  const fd = new FormData();
  fd.append('file', file);
  return apiFetch<ImportResp>(`/api/v1/admin/import/premium-numbers?mode=${mode}`, {
    method: 'POST',
    body: fd,
  });
}

export function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dryRun, setDryRun] = useState<ImportResp | null>(null);
  const [applyRes, setApplyRes] = useState<ImportResp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const canApply = !!file && !!dryRun && dryRun.summary.failed === 0;

  return (
    <div>
      <h2>CSV import</h2>
      <input
        type="file"
        accept=".csv,text/csv"
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          setFile(f);
          setDryRun(null);
          setApplyRes(null);
          setError(null);
        }}
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button
          style={{ background: '#eee' }}
          disabled={!file || busy}
          onClick={async () => {
            if (!file) return;
            setBusy(true);
            setError(null);
            try {
              const resp = await postImport(file, 'dry-run');
              setDryRun(resp);
            } catch (e) {
              setError(e instanceof ApiError ? e.message : 'Dry-run failed');
            } finally {
              setBusy(false);
            }
          }}
        >
          Dry-run
        </button>
        <button
          style={{ background: canApply ? '#ffd54f' : '#eee' }}
          disabled={!canApply || busy}
          onClick={async () => {
            if (!file) return;
            setBusy(true);
            setError(null);
            try {
              const resp = await postImport(file, 'apply');
              setApplyRes(resp);
            } catch (e) {
              setError(e instanceof ApiError ? e.message : 'Apply failed');
            } finally {
              setBusy(false);
            }
          }}
        >
          Apply
        </button>
      </div>

      {error ? <div style={{ color: 'crimson', marginTop: 12 }}>{error}</div> : null}

      {dryRun ? (
        <div style={{ marginTop: 16 }}>
          <h3>Dry-run result</h3>
          <div>
            <strong>importId:</strong> <code>{dryRun.importId}</code>
          </div>
          <div>
            <strong>summary:</strong> <code>{JSON.stringify(dryRun.summary)}</code>
          </div>
          <h4>Rows</h4>
          <pre style={{ maxHeight: 260, overflow: 'auto', background: '#f6f6f6', padding: 8 }}>
            {JSON.stringify(dryRun.rows.slice(0, 50), null, 2)}
          </pre>
        </div>
      ) : null}

      {applyRes ? (
        <div style={{ marginTop: 16 }}>
          <h3>Apply result</h3>
          <div>
            <strong>importId:</strong> <code>{applyRes.importId}</code>
          </div>
          <div>
            <strong>summary:</strong> <code>{JSON.stringify(applyRes.summary)}</code>
          </div>
        </div>
      ) : null}
    </div>
  );
}

