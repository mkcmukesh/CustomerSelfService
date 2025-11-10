# Architecture Upgrade (Applied)

These files were added alongside your existing project to improve auth, routing, SEO, env validation, and CI.

## Added
- `middleware.ts` — protects `/dashboard` and `/tools`
- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth route handler
- `src/app/(app)/dashboard/layout.tsx` — server-side auth gate
- `src/app/login/page.tsx` — login page
- `src/lib/env.ts` — env validation with Zod
- `src/app/sitemap.ts` + `src/app/robots.ts` — SEO essentials
- `.env.example` — env template
- `.github/workflows/ci.yml` — minimal CI

> If a file already existed, a `.merged` variant was written to avoid overwriting. Compare and integrate as needed.
