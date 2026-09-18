# Push to GitHub + Deploy on Vercel

The repo is committed locally. Because GitHub credentials were never provided, the push
is left for you — it's 4 commands.

## 1. Create the GitHub repo

Go to https://github.com/new, name it `sat-act-tutor` (private or public), and **do not**
initialize with a README. Copy the repo URL, e.g. `https://github.com/YOU/sat-act-tutor.git`.

## 2. Push from this machine

```bash
cd ~/workspace/sat-act-tutor
git remote add origin https://github.com/YOU/sat-act-tutor.git
git branch -M main
git push -u origin main
```

(If GitHub asks for credentials, use a Personal Access Token: GitHub → Settings →
Developer settings → Personal access tokens → Generate new token with `repo` scope.)

## 3. Deploy on Vercel

1. Go to https://vercel.com/new and **Import** the `sat-act-tutor` repo.
2. Framework preset: Next.js (auto-detected). Leave build command as `npm run build`.
3. Add Environment Variables:
   - `DATABASE_URL` — your PostgreSQL connection string (Neon/Supabase/Vercel Postgres).
     Use the **pooled** URL if your provider gives you one.
   - `ADMIN_TOKEN` — a long random string (`openssl rand -hex 32`). This unlocks `/admin`.
   - `NEXT_PUBLIC_SITE_NAME` — e.g. `Pro Minds`.
4. Click **Deploy**.

## 4. Seed the question bank (one time)

After the first deploy, from your machine:

```bash
cd ~/workspace/sat-act-tutor
DATABASE_URL="<your-production-database-url>" npm run db:seed
```

(Or: `npx prisma db push` first if you skipped migrations — see README.)

## 5. Custom domain

Vercel → your project → **Settings → Domains** → add your domain.
Vercel shows the exact DNS records to add at your registrar (usually an A record for
`@` and a CNAME for `www`). Done — HTTPS is automatic.

## After deploy

- Open `/admin`, enter your `ADMIN_TOKEN`, and add/edit questions any time.
- Booking inquiries from `/contact` land in the admin **Inquiries** tab.
- Edit tutor details/pricing in `src/lib/site.ts`, commit, and `git push` — Vercel redeploys automatically.
