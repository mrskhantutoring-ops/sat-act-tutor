# SAT & ACT Tutoring Website

A full-stack tutoring website for **Faryal Tutoring**: marketing landing pages plus a free
practice app with timed modes, instant explanations, and progress tracking.

- **Frontend:** Next.js 14 (App Router) + React 18 + Tailwind CSS
- **Backend:** Next.js API routes + Prisma ORM + PostgreSQL
- **Auth:** Email/password with bcrypt + httpOnly cookie sessions (no third-party provider needed)
- **Admin:** `/admin` dashboard (protected by `ADMIN_TOKEN`) for question CRUD and the booking inbox

## Features

- Landing page: hero, SAT/ACT practice cards, how-it-works, pricing (placeholders), testimonials (placeholders), FAQ, CTA
- Practice app for 4 subjects: SAT Math, ACT Math, SAT Reading & Writing, ACT English
  - Topic + difficulty filters, untimed drills, timed presets mirroring real test modules
  - Instant explanations, grid-in (typed answer) support for SAT math, results screen
- Accounts: signup/login, per-user attempt history
- Dashboard: overall accuracy, per-subject and per-topic breakdowns, recent attempts
- Booking/contact form → saved as inquiries, visible in `/admin`
- 25 original seed questions (see `research.md` for the 2026–27 test blueprints they follow)

## Local development

1. **Install:** `npm install`
2. **Database:** get a PostgreSQL connection string. Easiest free options: [Neon](https://neon.tech),
   Supabase, or local Docker: `docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`
3. **Env:** `cp .env.example .env` and set `DATABASE_URL` + a long random `ADMIN_TOKEN`
   (generate with `openssl rand -hex 32`).
4. **Schema:** `npx prisma db push` (quick) or `npm run db:migrate` (migrations).
5. **Seed questions:** `npm run db:seed`
6. **Run:** `npm run dev` → http://localhost:3000

> Network note: `prisma generate` downloads engine binaries. If your network blocks
> that download, pre-place the engines and point Prisma at them:
> `PRISMA_SCHEMA_ENGINE_BINARY=/path/to/schema-engine`
> `PRISMA_QUERY_ENGINE_LIBRARY=/path/to/libquery_engine.so.node`
> (matching your Prisma version's commit hash under `~/.cache/prisma`). This is not
> needed on Vercel.

Admin: open `/admin` and enter your `ADMIN_TOKEN`.

## Environment variables

| Var | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ADMIN_TOKEN` | Yes | Secret that unlocks `/admin` (set a long random value) |
| `NEXT_PUBLIC_SITE_NAME` | No | Site name shown in navbar/titles |

## Deploying to Vercel

See **PUSH_GUIDE.md** for the exact commands. Short version:

1. Push this repo to GitHub.
2. Import it in Vercel, add the env vars above (use a pooled `DATABASE_URL` if your provider offers one).
3. Deploy. Prisma client is generated automatically during `npm run build`.
4. After first deploy, run the seed once: `npx prisma db seed` — or temporarily run
   `DATABASE_URL=... npm run db:seed` from your machine.

Custom domain: Vercel → Project Settings → Domains → add your domain, then point your
DNS at Vercel (they show the exact records).

## Customizing

- Tutor details, pricing, email: edit `src/lib/site.ts` (placeholders are marked `TODO`).
- Testimonials: replace the placeholder cards in `src/app/page.tsx`.
- Questions: use `/admin`, or edit `prisma/seed.mjs` and re-run the seed.

## Hardening notes (if you grow)

- `/api/questions` currently returns answers (fine for a practice app). For secure testing,
  strip `correctIndex`/`correctText`/`explanation` from the response and add a
  `/api/grade` endpoint that checks answers server-side.
- Consider rate-limiting `/api/auth/*` and `/api/inquiries` (e.g. Vercel + Upstash).
- Add email notifications for new inquiries (Resend/Postmark) — currently they're inbox-only in `/admin`.
