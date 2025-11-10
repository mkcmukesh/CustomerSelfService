# Architecture Upgrade Pack

This zip contains add-on files to bring your mixed website + web app project up to production standards in Next.js 14.

## What's inside
- `middleware.ts` — protects `/dashboard` and `/tools` with NextAuth JWT.
- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth route handler (Google provider by default).
- `src/app/(app)/dashboard/layout.tsx` — server-side session check to guard the dashboard.
- `src/app/login/page.tsx` — simple login page using `next-auth/react`.
- `src/lib/env.ts` — Zod-based env validation.
- `src/app/sitemap.ts`, `src/app/robots.ts` — SEO essentials.
- `.env.example` — non-secret env template.
- `.github/workflows/ci.yml` — minimal CI: install, typecheck, lint, build.

## How to apply
1. Unzip into your repo root. Accept folder merges; do **not** overwrite your existing files unless intended.
2. Install packages (if not already present): 
   ```bash
   npm i next-auth zod
   # If using Prisma adapter: npm i @prisma/client @next-auth/prisma-adapter
   ```
3. Create `.env` from `.env.example` and fill secrets.
4. Ensure you have a Google OAuth app (Authorized redirect URIs should include: `http://localhost:3000/api/auth/callback/google`).
5. Run dev:
   ```bash
   npm run dev
   ```
6. Visit `/login` to sign in; `/dashboard` should now be protected by both middleware and server checks.

## Notes
- If you don't use Google login, swap in Credentials or another provider in the NextAuth handler.
- `middleware.ts` must live at repository root (not `/src`). Keep it committed.
- Update `NEXT_PUBLIC_SITE_URL` for correct sitemap/robots in production.
