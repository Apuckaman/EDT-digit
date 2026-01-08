import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApiError, apiFetch } from '../api';

type Company = {
  id: number;
  name: string;
  taxNumber: string;
  type: 'AFAS' | 'AFAMENTES';
  active: boolean;
};

type Client = {
  id: number;
  code: string;
  name: string;
  billingAddress: string;
  email: string | null;
  phone: string | null;
  companyId: number;
  active: boolean;
};

type NumberRow = {
  id: number;
  number: string;
  clientId: number;
  companyId: number;
  provider: string | null;
  pricingPlan: string | null;
  status: 'active' | 'suspended' | 'archived';
};

type Overview = { company: Company; clients: Client[]; numbers: NumberRow[] };

export function CompanyDetailPage() {
  const { id } = useParams();
  const companyId = id ? parseInt(id, 10) : NaN;
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!Number.isFinite(companyId)) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await apiFetch<Overview>(`/api/v1/admin/companies/${companyId}/overview`);
      setData(resp);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load company overview');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [id]);

  async function createClient() {
    if (!data) return;
    const name = prompt('Client name?');
    if (!name) return;
    const code = prompt('Client code?', `C${Date.now()}`.slice(0, 8));
    if (!code) return;
    const billingAddress = prompt('Billing address?', 'IMPORT') || 'IMPORT';
    await apiFetch('/api/v1/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        name,
        billingAddress,
        email: null,
        phone: null,
        companyId: data.company.id,
        active: true,
      }),
    });
    await load();
  }

  async function createNumber() {
    if (!data) return;
    const number = prompt('Number? (phone_number)');
    if (!number) return;
    const clientIdRaw = prompt(
      'Client ID for this number?',
      data.clients[0] ? String(data.clients[0].id) : ''
    );
    if (!clientIdRaw) return;
    const clientId = parseInt(clientIdRaw, 10);
    if (!Number.isFinite(clientId)) return;
    await apiFetch('/api/v1/numbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        number,
        clientId,
        companyId: data.company.id,
        provider: null,
        pricingPlan: null,
        status: 'active',
      }),
    });
    await load();
  }

  async function toggleNumberStatus(n: NumberRow) {
    if (n.status === 'archived') return;
    const next = n.status === 'active' ? 'suspended' : 'active';
    await apiFetch(`/api/v1/numbers/${n.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });
    await load();
  }

  async function archiveNumber(n: NumberRow) {
    if (!confirm('Archive number?')) return;
    await apiFetch(`/api/v1/numbers/${n.id}`, { method: 'DELETE' });
    await load();
  }

  async function deactivateClient(c: Client) {
    if (!confirm('Deactivate client?')) return;
    await apiFetch(`/api/v1/clients/${c.id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div>
      <h2>Company detail</h2>
      {error ? <div style={{ color: 'crimson' }}>{error}</div> : null}
      {loading ? <div>Loading…</div> : null}
      {data ? (
        <>
          <div style={{ marginBottom: 16 }}>
            <div>
              <strong>{data.company.name}</strong> ({data.company.taxNumber}) –{' '}
              {data.company.active ? 'active' : 'inactive'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button onClick={() => void createClient()}>New client</button>
            <button onClick={() => void createNumber()}>New number</button>
          </div>

          <h3>Clients</h3>
          <table width="100%" cellPadding={6} style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th align="left">ID</th>
                <th align="left">Code</th>
                <th align="left">Name</th>
                <th align="left">Status</th>
                <th align="left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.clients.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.code}</td>
                  <td>{c.name}</td>
                  <td>{c.active ? 'active' : 'inactive'}</td>
                  <td>
                    <button onClick={() => void deactivateClient(c)} disabled={!c.active}>
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
              {data.clients.length === 0 ? (
                <tr>
                  <td colSpan={5}>No clients</td>
                </tr>
              ) : null}
            </tbody>
          </table>

          <h3 style={{ marginTop: 16 }}>Numbers</h3>
          <table width="100%" cellPadding={6} style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th align="left">ID</th>
                <th align="left">Number</th>
                <th align="left">ClientId</th>
                <th align="left">Status</th>
                <th align="left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.numbers.map((n) => (
                <tr key={n.id}>
                  <td>{n.id}</td>
                  <td>{n.number}</td>
                  <td>{n.clientId}</td>
                  <td>{n.status}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => void toggleNumberStatus(n)}
                      disabled={n.status === 'archived'}
                    >
                      Toggle active/suspended
                    </button>
                    <button onClick={() => void archiveNumber(n)} disabled={n.status === 'archived'}>
                      Archive
                    </button>
                  </td>
                </tr>
              ))}
              {data.numbers.length === 0 ? (
                <tr>
                  <td colSpan={5}>No numbers</td>
                </tr>
              ) : null}
            </tbody>
          </table>

          <div style={{ marginTop: 12, fontSize: 12, color: '#555' }}>
            Archived numbers are read-only (no actions).
          </div>
        </>
      ) : null}
    </div>
  );
}

