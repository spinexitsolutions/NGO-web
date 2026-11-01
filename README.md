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

Design system ("field notes"):
- Sans-serif only: **Bricolage Grotesque** for display, **Geist** for text, **Geist Mono** for labels and meta.
- Deep forest green with an electric-lime accent. The accent is set from the admin and is always used as a fill under dark text, so contrast stays readable.
- Editorial 12-column grid, numbered section labels on hairline rules, a highlighter-pen mark on key phrases, and a notebook dot-grid texture.

Motion and UX:
- **Intro:** words roll past like an odometer while a percentage counts up, then five shutters lift away. Fully set from the admin.
- **Navbar:** separate tiles — logo, links with index numbers, a live campaign progress ring, Donate, and Menu. It hides when you scroll down and comes back when you scroll up. Menu opens with a column-shutter reveal, a lime band behind the hovered link, and an image preview. Mobile gets an app-style bottom dock.
- **Hero:** a live IST clock, a live-campaign widget, and a lime spotlight that follows the cursor over the dot grid. The main photo is cut into five strips that drift apart and lock into one image as you scroll.
- **Programmes:** an accordion of photo panels — horizontal on desktop, stacked on mobile.
- **Rest of the home page:** a bento grid of impact numbers, a featured campaign plus a draggable rail of the rest, an auto-advancing testimonial slider, and a partner marquee whose speed follows scroll speed.
- **Site-wide:** a custom cursor with labels, buttons whose text rolls on hover, images that wipe in, shutter page transitions, Lenis smooth scrolling, and support for reduced-motion settings.

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
