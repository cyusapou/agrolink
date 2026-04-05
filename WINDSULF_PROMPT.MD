# AgroLink Rwanda — Windsurf AI Instructions

## Who You Are Working With
You are assisting **Clever**, founder of DOCKS Corporation, Kigali Rwanda.
He is a Level 3 Software Development student building AgroLink — a B2B agricultural
marketplace that connects farming cooperatives directly to institutional buyers
(hotels, restaurants, schools) in Rwanda via MTN Mobile Money payments.

---

## Project Audit Document
A **complete technical audit** of this codebase is located at:
```
./AgroLink_Audit_Roadmap.docx
```
**Read this document before doing anything.** It contains:
- Every existing file and its current status (DONE / PARTIAL / MISSING)
- The full production roadmap (8 phases)
- All target entity schemas (User, Order, etc.)
- The complete API endpoint map (30+ endpoints)
- A checklist of every file that needs to be created

---

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Backend | NestJS + TypeORM + PostgreSQL |
| Auth | JWT (access token 15min + refresh token 7 days) |
| Payments | MTN MoMo API (sandbox) |
| SMS | Africa's Talking (not yet integrated) |
| Realtime | Socket.io via NestJS WebSocketGateway |
| Styling | Custom CSS variables in App.css + index.css |

---

## 🚨 CRITICAL RULES — READ BEFORE TOUCHING ANY FILE

### Rule 1 — NEVER modify these files
```
agrolink-frontend/src/App.css
agrolink-frontend/src/index.css
agrolink-frontend/src/pages/LandingPage.tsx
```
These files contain the production-quality design system (dark soil palette,
Fraunces serif typography, grain texture, animations). Any modification will
break the visual identity. **Do not touch them under any circumstance.**

### Rule 2 — Preserve the CSS variable system
All styling uses CSS custom properties defined in App.css:
- `--soil`, `--deep`, `--surface`, `--card` — background ramp
- `--lime` (#7fd147) — primary accent color
- `--gold` (#f5a832) — secondary accent
- `--cream` (#f0ede4) — primary text
- `--muted` (#6b8a62) — secondary text
- `--serif` (Fraunces), `--sans` (Plus Jakarta Sans) — fonts
- `--border` — rgba(127,209,71,0.12)

When creating new frontend pages, use these variables. Never hardcode colors.

### Rule 3 — Match existing patterns
- Backend: follow the existing module structure (entity → dto → service → controller → module)
- Frontend: follow existing page structure (functional component, axios calls, same className patterns)
- Auth: use the existing `@Public()` decorator for public endpoints, `@Roles()` for protected ones
- Never install a package without checking if a similar one is already in package.json

### Rule 4 — Work in phases, never all at once
The audit document defines 8 phases. Follow them in order:
1. Real Auth (User entity + register endpoint + bcrypt)
2. Orders Module
3. Frontend Auth (ProtectedRoute + useAuth hook + Axios interceptor)
4. Buyer Portal
5. Cooperative Manager Portal
6. Admin Portal (fix existing dashboard + missing pages)
7. Notifications (SMS + WebSocket)
8. Polish + PWA + Deploy

Do not jump to Phase 4 without completing Phase 1, 2, and 3 first.

---

## Current State Summary

### Backend — what exists
- `src/auth/` — JWT auth but users are HARDCODED in memory (no DB). Plain text passwords. No register endpoint.
- `src/cooperatives/` — Full CRUD ✅
- `src/farmers/` — Full CRUD ✅
- `src/produce/` — Full CRUD + analytics query ✅
- `src/payments/` — MTN MoMo initiate/confirm/track/callback ✅
- `src/app.module.ts` — TypeORM + PostgreSQL + JWT globally wired ✅

### Backend — critical gaps
- ❌ No `User` entity — users are a hardcoded array
- ❌ No `Order` entity — THE BIGGEST GAP. No way to record an order.
- ❌ No `/auth/register` endpoint
- ❌ No bcrypt password hashing
- ❌ No CORS config in main.ts
- ❌ No `.env.example` file
- ❌ `Payment` entity not linked to any order

### Frontend — what exists
- `/` — Landing page ✅ (DO NOT TOUCH)
- `/login` — Login form, calls `/auth/login` ✅
- `/signup` — Form only, POST is commented out ❌
- `/dashboard` — Generic admin view, hardcoded metrics ⚠️
- `DashboardLayout` — Sidebar has 5 links, 4 lead to missing pages ❌

### Frontend — critical gaps
- ❌ No route protection (anyone accesses /dashboard without login)
- ❌ No role-based routing (admin vs buyer vs coop manager)
- ❌ No Buyer Portal (/buyer/*)
- ❌ No Cooperative Manager Portal (/coop/*)
- ❌ Pages: /dashboard/cooperatives, /produce, /payments, /settings all missing
- ❌ No Axios instance with JWT interceptor
- ❌ No toast notifications

---

## Environment Variables Required
Create a `.env` file in `agrolink-backend/` with:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=yourpassword
DB_NAME=agrolink
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key
MTN_MOMO_API_KEY=your-mtn-sandbox-key
MTN_MOMO_USER_ID=your-mtn-user-id
MTN_MOMO_API_URL=https://sandbox.momodeveloper.mtn.com
AFRICAS_TALKING_API_KEY=your-at-key
AFRICAS_TALKING_USERNAME=sandbox
PORT=3000
```

---

## How to Run the Project
```bash
# Backend
cd agrolink-backend
npm install
npm run start:dev   # runs on port 3000

# Frontend
cd agrolink-frontend
npm install
npm run dev         # runs on port 5173
```

---

## When You Are Unsure
- Check `./AgroLink_Audit_Roadmap.docx` for the answer first
- Match the exact code patterns already in the codebase
- Ask Clever before creating files outside the existing module structure
- Never delete existing working code — only extend it