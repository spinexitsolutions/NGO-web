# Ummeed Foundation — NGO website + CMS/CRM

A demo NGO website built with **Next.js 15 (App Router)**, **Tailwind CSS v4**, **Framer Motion** and **Lenis**, with a built-in admin panel that controls the whole site.

## Quick start

```bash
npm install
npm run dev
```

- Website → http://localhost:3000
- Admin → http://localhost:3000/admin (demo login: `admin@ummeed.org` / `ummeed@2026`)

Copy `.env.example` to `.env.local` to change the admin credentials and session secret.

## Website

Pages: Home, About, Programmes (+ detail), Campaigns (+ detail with live progress), Donate (3-step checkout with simulated payment and an 80G receipt number), Impact & transparency (reports, fund allocation, FAQ), Stories (+ article pages with a reading-progress bar), Events (+ registration with seat limits), Gallery (filter + lightbox), Volunteer, Contact (+ map and FAQ), 404.

Motion and design:
- Intro loader: a word cycle, a counter and a curtain reveal. It runs once per session and is fully configurable from the admin.
- "Dynamic island" navbar: it shrinks to a small pill on scroll, the menu button shows scroll progress, and the full-screen menu opens with a circular reveal and image previews.
- Hero image that expands to full screen on scroll. Text lights up word by word as you scroll. Programmes scroll sideways on desktop and swipe on mobile. Testimonial cards stack. A photo follows the cursor over the events list. The gallery has parallax columns. Partner names scroll in a marquee. Page changes use a two-layer curtain.
- Mobile-first layout, smooth scrolling, and support for reduced-motion settings.
- Type: Inter Tight paired with Instrument Serif italic. The accent colour is set from the admin.

## Admin panel (`/admin`)

- **Dashboard**: key numbers, a 12-month donations chart, a breakdown by campaign, recent donations, and the inbox.
- **CRM**:
  - Donors: lifetime value and gift history.
  - Donations: filters, CSV export and offline entries.
  - Volunteers: a pipeline board.
  - Inbox, subscribers, and event registrations.
- **CMS**: homepage hero and section order/visibility, programmes, campaigns, events, stories, team, testimonials, gallery, partners, FAQs, reports, fund allocation, impact stats, and the About page.
- **Site**: navbar links, intro animation, brand colour, contact details, social links, legal IDs (80G/FCRA/CSR), the announcement bar, and SEO.

## Data

Everything is stored in a JSON file database (`src/lib/db.ts`). It is filled with demo data from `src/lib/seed.ts` on first run and written to `./data/db.json`. If that folder can't be written to, it falls back to `/tmp`, so on serverless hosts changes are temporary. For production, swap `db.ts` for Postgres, Supabase or similar; every read and write goes through it. Online payment is simulated: connect Razorpay or Stripe in `src/app/api/public/donate/route.ts`.
