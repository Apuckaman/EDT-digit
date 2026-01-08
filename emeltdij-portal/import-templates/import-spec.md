# Premium numbers import (CSV) – Sprint 5

## Format
- **Fájltípus**: CSV (Excelből exportálható)
- **1 sor = 1 prémium szám rekord**, a szükséges kapcsolatokkal
- **Header kötelező** (első sor)

## Oszlopok

### Kötelező
- `company_taxNumber`: Company azonosító (taxNumber) – **kötelező**
- `company_name`: Company név – **kötelező**
- `client_name`: Client név – **kötelező**
- `number`: emelt díjas szám – **kötelező**, globálisan unique

### Opcionális
- `number_status`: `active|suspended|archived` (default: `active`)

## Azonosítási és upsert szabályok (kanonikus)
- **Company**: `company_taxNumber` alapján upsert
  - ha a meglévő company **inactive** és a `company_name` eltér → **FAILED (409 COMPANY_INACTIVE)**
  - ha active és a `company_name` eltér → **UPDATE**
- **Client**: `(company_id + client_name)` alapján upsert
- **Number**: `number` alapján upsert
  - ha a meglévő number `status=archived` → **FAILED (409 NUMBER_ARCHIVED)** és nem módosít

## Minta fájl
Lásd: `premium-import-template.csv`

