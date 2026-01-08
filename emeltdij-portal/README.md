## Start here (Codespaces / dev)

1. `cp .env.example .env`
2. `docker compose up -d`
3. `npm install`
4. `npm run seed`
5. `npm start`

Auth (dev): `POST /api/v1/auth/login` with `usernameOrEmail=admin`, `password=admin123` (from `.env`).

## Admin backend flow (Sprint 3)

Előfeltétel: fut a backend + DB, és van admin user (`npm run seed`).

### 1) Login (session cookie)

```bash
curl -fsS -c cookies.txt -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"admin123"}' \
  http://localhost:3000/api/v1/auth/login
```

### 2) Company létrehozás + listázás

```bash
curl -fsS -b cookies.txt -H "Content-Type: application/json" \
  -d '{"name":"Ween Bt.","taxNumber":"25145940-1-02","type":"AFAMENTES","bankAccount":null,"active":true}' \
  http://localhost:3000/api/v1/companies

curl -fsS -b cookies.txt "http://localhost:3000/api/v1/companies?page=1&limit=50"

# Default: csak active companyk. Soft-deleted megjelenítés:
curl -fsS -b cookies.txt "http://localhost:3000/api/v1/companies?page=1&limit=50&status=inactive"
```

## List response (Sprint 4)

Minden listázó endpoint egységes struktúrát ad:

```json
{ "data": [], "meta": { "page": 1, "limit": 20, "total": 0, "totalPages": 0 } }
```

## Search (Sprint 4)

Részleges, case-insensitive keresés: `?search=`.

- `GET /api/v1/companies?search=` (name, taxNumber)
- `GET /api/v1/clients?search=` (name)
- `GET /api/v1/numbers?search=` (number)

## Admin overview endpoint (Sprint 4)

UI-hoz “egy hívásos” aggregált read:

```bash
curl -fsS -b cookies.txt "http://localhost:3000/api/v1/admin/companies/1/overview"
```

## CSV import (Sprint 5)

Spec és minta:
- `import-templates/import-spec.md`
- `import-templates/premium-import-template.csv`

### Dry-run (validáció, DB write nélkül)

```bash
curl -fsS -b cookies.txt -F "file=@import-templates/premium-import-template.csv;type=text/csv" \
  "http://localhost:3000/api/v1/admin/import/premium-numbers?mode=dry-run"
```

### Apply (éles import, idempotens)

```bash
curl -fsS -b cookies.txt -F "file=@import-templates/premium-import-template.csv;type=text/csv" \
  "http://localhost:3000/api/v1/admin/import/premium-numbers?mode=apply"
```

### 3) Client létrehozás (companyId kötelező)

```bash
curl -fsS -b cookies.txt -H "Content-Type: application/json" \
  -d '{"code":"UGYF001","name":"Teszt Ügyfél 1","billingAddress":"1111 Budapest, Teszt utca 1.","email":null,"phone":null,"companyId":1,"active":true}' \
  http://localhost:3000/api/v1/clients
```

### 4) Premium number létrehozás + listázás

```bash
curl -fsS -b cookies.txt -H "Content-Type: application/json" \
  -d '{"number":"0690-111-1111","clientId":1,"companyId":1,"provider":"Telekom","pricingPlan":"Alap","status":"active"}' \
  http://localhost:3000/api/v1/numbers

curl -fsS -b cookies.txt "http://localhost:3000/api/v1/numbers?page=1&limit=50&companyId=1&status=active"
```

### 5) Soft delete példák

```bash
curl -fsS -b cookies.txt -X DELETE "http://localhost:3000/api/v1/numbers/1"
curl -fsS -b cookies.txt -X DELETE "http://localhost:3000/api/v1/clients/1"
curl -fsS -b cookies.txt -X DELETE "http://localhost:3000/api/v1/companies/1"
```
