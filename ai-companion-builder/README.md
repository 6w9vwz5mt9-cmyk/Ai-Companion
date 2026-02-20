# AI Companion Builder (MVP)

This is a production-ready starter MVP using:
- Next.js (App Router)
- Tailwind CSS
- Supabase (Auth + Postgres)
- Stripe (Subscriptions + Credits)

## What works in this MVP
- Signup/Login (Supabase Auth)
- Protected app pages under `/app/*`
- Companion creation wizard (4 steps)
- Chat UI + message history
- Mock AI replies (safe romance, not explicit) – no AI API required yet
- Relationship levels based on messages
- Credits + photo placeholders (no real image generation)
- Stripe Checkout structure + webhooks

---

## Quick Launch (no coding knowledge required)

### 1) Create Supabase project
1. Go to Supabase → create a project
2. In Supabase SQL Editor:
   - Run `supabase/schema.sql`
   - Run `supabase/policies.sql`
3. Copy these values (Project Settings → API):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only)

### 2) Create Stripe Products
Create **two** prices in Stripe:
- Premium subscription: **€19.99 / month** → copy Price ID → `STRIPE_PREMIUM_PRICE_ID`
- Credits pack: **€6.99 one-time** for 100 credits → copy Price ID → `STRIPE_CREDITS_PRICE_ID`

Also copy:
- `STRIPE_SECRET_KEY`
- Create a webhook endpoint on Stripe pointing to:
  `https://YOUR_DOMAIN/api/stripe/webhook`
  Copy the signing secret → `STRIPE_WEBHOOK_SECRET`

### 3) Deploy on Vercel (recommended)
1. Create a GitHub repo and push this project (or upload the files).
2. Go to Vercel → Import Project from GitHub → Deploy
3. In Vercel project settings, add environment variables:

Required:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_APP_URL (example: https://yourapp.vercel.app)

Stripe (optional until you’re ready):
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- STRIPE_PREMIUM_PRICE_ID
- STRIPE_CREDITS_PRICE_ID

Re-deploy after setting env vars.

### 4) Done
Visit your URL:
- Landing: `/`
- App: `/app/dashboard` (will ask you to login)

---

## Notes
- Chat is mock (safe romance), easy to replace later with an AI API.
- Photo generation is placeholder-only but uses credits and stores entries in the gallery.
- Safety filter is basic keyword-based; you can replace with proper moderation later.
