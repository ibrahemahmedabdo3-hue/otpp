# OTPProvider Cloud

Enterprise OTP delivery & verification platform — **working foundation build**.

## ⚠️ Scope of this build — read this first

The original spec requested an enormous platform: 7 OTP channels, 4+ payment
gateways, AI routing/fraud detection, 7 language SDKs, full reseller billing,
etc. That is genuinely months of engineering work, not something any single
generation pass can produce as real, working code. Rather than hand you
thousands of lines of placeholder stubs dressed up to *look* complete, this
build is a **solid, honest, fully-functional core** you can run today and
extend incrementally:

**Fully working right now:**
- Single login page, one dashboard, role auto-detected (Super Admin, Admin, Support, Client, Reseller)
- Real JWT auth + refresh token rotation + TOTP 2FA + enforced RBAC
- User management (create/suspend/activate/delete/reset password) with real permission boundaries per role
- OTP over **SMS**: generate → send (Twilio-ready, demo/console fallback) → verify → expire → rate-limit → wallet billing, end-to-end
- Wallet: balance, recharge, transaction history
- **Sub-domain pages**: Super Admin / Admin can create branded landing pages (HTML/CSS/JS) from the dashboard, stored in the database and rendered live on any `*.otpprovider.com` sub-domain — no file deploy, no server restart, no reverse proxy needed (handled inside the backend itself)
- Swagger API docs, audit logging, login history, helmet, rate limiting

**Scaffolded but not yet built (next increments):**
- WhatsApp / Email / Voice / Telegram / Push OTP channels (the architecture supports adding these as new `OtpDeliveryProvider` implementations — SMS shows the pattern)
- Stripe / PayPal / USDT / Binance Pay payment gateways (wallet recharge endpoint exists; gateway webhooks are not wired)
- AI smart routing / fraud detection
- SDKs, Postman collection
- Admin UI screens for providers, countries, currencies, SMTP, feature flags, etc.

## Local development

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api/v1
- Swagger docs: http://localhost:4000/api/docs

Migrations run automatically on backend startup. To load sample accounts:

```bash
docker compose exec backend npx ts-node prisma/seed.ts
```

`docker-compose.yml` is for local dev and self-hosted VPS use only. It is
**not** used for the Vercel + Neon deployment below — on that path each
piece deploys independently.

## Sample Accounts (after seeding)

| Role | Email | Password |
|---|---|---|
| Super Admin | superadmin@otpprovider.com | ChangeMe123! |
| Admin | admin@otpprovider.com | ChangeMe123! |
| Support | support@otpprovider.com | ChangeMe123! |
| Reseller | reseller@otpprovider.com | ChangeMe123! |
| Client | client@otpprovider.com | ChangeMe123! |

**Change these passwords before any real deployment.**

## Deploying for free: Vercel (x2 projects) + Neon

No Render, no Docker host, no third service — **both** the backend and the
frontend deploy as separate Vercel projects from the same repo, and Neon is
the database. This is what changed from the earlier build:

- The NestJS app no longer needs a persistent Node server. It's wrapped as
  a single Vercel serverless function at `backend/api/index.ts` (built with
  `serverless-http` + `@nestjs/platform-express`'s `ExpressAdapter`). The
  app itself — modules, guards, validation, the `api/v1` prefix — is
  unchanged from `src/main.ts`, which is still used for local dev /
  `docker compose up`.
- `backend/vercel.json` rewrites every incoming path to that one function,
  so `https://<backend>.vercel.app/api/v1/...` routes exactly like it did
  on Render.
- Prisma Client is (re)generated automatically after every `npm install` on
  Vercel via the `postinstall` script — no manual step needed.

### 1. Database — Neon

1. Create a project at https://neon.tech (free tier, scales to zero when
   idle, never expires).
2. Copy the **pooled** connection string from the Neon dashboard (the one
   with `-pooler` in the hostname) — serverless functions open a fresh
   connection per invocation, so you want PgBouncer pooling, not the direct
   connection. It should look like:
   ```
   postgresql://user:password@ep-xxxx-pooler.region.aws.neon.tech/dbname?sslmode=require&pgbouncer=true&connection_limit=1
   ```

### 2. Push to GitHub

```bash
git init
git add .
git commit -m "init"
git remote add origin <your-repo-url>
git push -u origin main
```

### 3. Backend — Vercel project #1

1. Import the repo into Vercel → **Root Directory**: `backend`.
2. Framework preset: **Other**.
3. Environment variables:
   - `DATABASE_URL` → the pooled Neon string from step 1
   - `JWT_ACCESS_SECRET` → generate one: `openssl rand -hex 32`
   - `JWT_ACCESS_EXPIRES` → `15m`
   - `NODE_ENV` → `production`
   - `ROOT_DOMAIN` → `otpprovider.com` (or your real domain)
   - `FRONTEND_URL` → fill in after step 4 (leave blank or your best guess
     for now, e.g. `https://your-app.vercel.app`)
   - `TWILIO_*` → only if you want real SMS; otherwise leave blank
4. Deploy. Confirm it's up: `https://<your-backend>.vercel.app/api/v1/health`
5. Run migrations + seed **from your own machine**, pointed at Neon (there's
   no shell tab on Vercel the way Render had one):
   ```bash
   cd backend
   DATABASE_URL="<your pooled Neon string>" npx prisma migrate deploy
   DATABASE_URL="<your pooled Neon string>" npx ts-node prisma/seed.ts
   ```
   Run `prisma migrate deploy` again the same way any time you change
   `schema.prisma` and push a new migration.

### 4. Frontend — Vercel project #2

1. Import the **same** GitHub repo again as a second Vercel project → **Root
   Directory**: `frontend`.
2. Environment variables:
   - `NEXT_PUBLIC_API_URL` → `https://<your-backend>.vercel.app/api/v1`
   - `NEXT_PUBLIC_ROOT_DOMAIN` → `otpprovider.com` (or your real domain)
3. Deploy.
4. Go back to the **backend** project's env vars and set `FRONTEND_URL` to
   this frontend's actual URL, then redeploy the backend so CORS allows it.

### 5. Sub-domain pages in production

The backend still detects the sub-domain from the `Host` header itself (see
`src/microsites/subdomain.middleware.ts`) and renders the published page
straight from Neon — no extra service needed. The one thing that changed:
**wildcard domains (`*.otpprovider.com`) on Vercel require a Pro plan** — the
free Hobby plan only lets you attach individual domains one at a time, so on
the free tier you'd add each sub-domain (`promo.otpprovider.com`, etc.)
manually as a domain on the backend Vercel project as you create pages,
rather than one wildcard entry.

**Testing locally** before you touch real DNS:
```bash
curl -H "Host: promo.otpprovider.com" http://localhost:4000/
```

### Known trade-offs of the serverless backend vs. the old Render setup

- **Swagger UI** (`/api/docs`) is only wired up in `src/main.ts` for local
  dev / `docker compose up`. It's intentionally left out of the serverless
  handler (`api/index.ts`) — serving Swagger's static assets reliably from
  a function adds complexity for little benefit on a backend most people
  hit through the dashboard, not directly. It can be added back if you want
  it; ask and it can be wired in.
- **No cold-spin-down wait** unlike Render's free tier, but you do still get
  serverless cold starts (usually well under a second for this app size).
- Function execution is capped at 10s on Vercel's free plan — fine for
  everything this app does (auth, OTP, wallet, microsites), just not a fit
  for anything long-running you might add later.

## Sub-domain pages (admin-managed micro-sites)

Go to the dashboard → **Sub-domain Pages** (visible to Super Admin / Admin).
Create a page with a sub-domain label (e.g. `promo`), write the HTML/CSS/JS
directly in the editor, and hit **Publish**. It's immediately live at
`promo.otpprovider.com` — nothing is written to disk, the backend renders it
straight from the database on every request.

- `POST/GET/PATCH/DELETE /api/v1/admin/microsites` — protected CRUD, Super Admin / Admin only
- Rendering is handled by `SubdomainMiddleware`, which runs on every request
  before routing: if the `Host` header matches a sub-domain, it serves that
  page and stops; otherwise the request passes through to the normal
  dashboard/API routes untouched.

**Security note:** this stores and renders raw HTML/CSS/JS exactly as
entered — that's the point (a page builder), but it means anyone with Admin
or Super Admin access can inject arbitrary scripts served publicly. Only
grant those roles to people you trust with that level of access, same as
CMS admin access on any site.

## Enabling real SMS delivery

By default, OTP codes are logged to the backend console (safe for local
testing). To send real SMS via Twilio, set in `backend/.env` (or the
backend's Vercel project environment variables):

```
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=...
```

## Architecture

```
/backend       NestJS + Prisma + PostgreSQL, deployed as a Vercel serverless
               function (backend/api/index.ts + backend/vercel.json)
/frontend      Next.js 14 (App Router) + TypeScript + TailwindCSS
docker-compose.yml   local dev / self-hosted VPS only
```

## Security notes before production

- Set `JWT_ACCESS_SECRET` to a long random value yourself in the backend's
  Vercel project settings, e.g. `openssl rand -hex 32`
- CORS locks to `FRONTEND_URL` automatically when `NODE_ENV=production`
- Review rate limits in `src/otp/otp.service.ts` for your traffic profile
- The wallet recharge endpoint currently trusts the caller for `method: manual`
  only — real payment gateways must credit the wallet from a verified webhook,
  not a client-facing call
