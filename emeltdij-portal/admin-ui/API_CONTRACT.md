## Admin UI – Frontend integrációs checklist (API contract) (S6-00)

### Base + auth
- **Base**: `/api/v1`
- **Session**: cookie alapú (`credentials: include`)
- **Login flow**:
  - `POST /auth/login` → siker esetén **kötelező** `GET /auth/me` (session validálás)
  - 401 esetén frontend: **redirect /login**
  - 403 esetén frontend: “nincs jogosultság” üzenet (admin UI-ban jellemzően nem fordulhat elő)

### Error contract
Minden hiba:

```json
{ "error": { "code": "STRING", "message": "Human", "details": {} } }
```

Fontos 409 példák:
- `BUSINESS_RULE_VIOLATION` (pl. inactive company/client)
- `NUMBER_ARCHIVED` (archived number read-only)
- `COMPANY_INACTIVE` (import)
- `NUMBER_ARCHIVED` (import)

### List response (pagination)
Minden lista:

```json
{
  "data": [],
  "meta": { "page": 1, "limit": 20, "total": 0, "totalPages": 0 }
}
```

Query:
- `page`, `limit`
- `search` (S4)
- `status` (companies/clients: `active|inactive`, numbers: `active|suspended|archived`)

### Auth endpoints
- `POST /auth/login` body: `{ "usernameOrEmail": "string", "password": "string" }`
- `GET /auth/me` → `{ "user": { "id": 1, "role": "ADMIN", "clientId": null } }`
- `POST /auth/logout` → `{ "ok": true }`

### Companies
- `GET /companies` (default: csak active)
- `GET /companies/:id`
- `POST /companies`
- `PUT /companies/:id` (**inactive company → 409**)
- `DELETE /companies/:id` soft delete → `active=false` (UI label: **Deactivate**)

### Clients (csak company contextusból UI-ban)
- `GET /clients?companyId=...`
- `POST /clients` (companyId kötelező; inactive company → 409)
- `PUT /clients/:id` (inactive company → 409)
- `DELETE /clients/:id` soft delete → `active=false`

### Numbers
- `GET /numbers?companyId=&clientId=&status=&search=`
- `POST /numbers` (inactive company/client → 409)
- `PUT /numbers/:id` (archived → 409 `NUMBER_ARCHIVED`)
  - status toggle: `active ↔ suspended`
- `DELETE /numbers/:id` → `status=archived` (archived read-only a UI-ban)

### Import
- `POST /admin/import/premium-numbers?mode=dry-run` (multipart `file`)
- `POST /admin/import/premium-numbers?mode=apply` (multipart `file`)

Import response:

```json
{
  "importId": "uuid",
  "summary": { "total": 0, "created": 0, "updated": 0, "skipped": 0, "failed": 0 },
  "rows": [
    {
      "rowNumber": 2,
      "status": "CREATED|UPDATED|SKIPPED|FAILED",
      "entity": "company|client|number",
      "keys": {},
      "errors": [{ "code": "CSV_PARSE_ERROR", "message": "...", "field": "..." }]
    }
  ]
}
```

UI szabály: **Apply csak sikeres dry-run után** engedett.

### Admin overview
- `GET /admin/companies/:id/overview` → `{ company, clients, numbers }`

