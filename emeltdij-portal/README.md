## Start here (Codespaces / dev)

1. `cp .env.example .env`
2. `docker compose up -d`
3. `npm install`
4. `npm run seed`
5. `npm start`

Auth (dev): `POST /api/v1/auth/login` with `usernameOrEmail=admin`, `password=admin123` (from `.env`).
