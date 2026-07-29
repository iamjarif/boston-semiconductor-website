# Boston Semiconductor Website

Marketing website and blog for [Boston Semiconductor](https://www.bostonsemiconductor.com) — a VLSI design partner delivering silicon-proven engineering from concept to tapeout.

Built as a fast, content-driven Next.js application with scroll-driven storytelling on the homepage, a Sanity-powered blog, and production-ready contact and newsletter flows.

## Highlights

- **Single-page marketing experience** — Hero, mission, services, process, engagement models, security, why-us, blog preview, and contact sections on one scrollable homepage
- **Scroll-driven motion** — GSAP ScrollTrigger, Lenis smooth scroll, parallax cards, and section reveal animations (with reduced-motion support)
- **Sanity CMS blog** — Categories, portable text, related posts, and ISR-backed listing/detail pages
- **Newsletter system** — Footer signups stored in Sanity, confirmation emails, unsubscribe links, and automatic new-post notifications via webhook
- **Contact form API** — Rate-limited, validated submissions delivered through Resend
- **Security-first defaults** — CSP, HSTS, rate limiting, honeypot fields, and shared API route guards
- **Observability** — Vercel Analytics and Speed Insights

## Tech Stack

| Layer | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, CSS design tokens |
| CMS | Sanity v6, Portable Text |
| Motion | GSAP, Motion, Lenis |
| Email | Resend |
| Validation | Zod |
| Icons | Phosphor Icons |
| Hosting | Vercel (recommended) |

## Project Structure

```
src/
├── app/
│   ├── (marketing)/          # Homepage and future static marketing routes
│   ├── api/                  # Contact, newsletter, Sanity webhook routes
│   ├── blog/                 # Blog listing, detail pages, server actions
│   └── layout.tsx            # Root layout, fonts, analytics
├── components/
│   ├── blog/                 # Blog-specific UI (headers, grid, portable text)
│   ├── sections/             # Homepage sections (Hero, Services, Contact, etc.)
│   └── ui/                   # Shared UI (Button, Card, Nav, Footer, motion helpers)
├── hooks/                    # Client hooks (hover prefs, mouse position)
├── lib/
│   ├── config/               # Site metadata, nav/footer config
│   ├── content/              # Static content (e.g. service offerings)
│   ├── email/                # Resend templates and senders
│   ├── motion/               # Reveal presets and animation variants
│   ├── navigation/           # Scroll-to-section utilities
│   ├── newsletter/           # Subscriber storage and unsubscribe tokens
│   ├── sanity/               # Sanity client, queries, write client
│   ├── security/             # Rate limiting, validation, API helpers
│   ├── blog.ts               # Blog data layer (used by pages)
│   └── cms.ts                # CMS abstraction over Sanity
└── types/                    # Shared TypeScript types

sanity/
├── schema/                   # Post, category, newsletter subscriber schemas
└── sanity.config.ts          # Sanity Studio configuration

scripts/
├── run-studio.mjs            # Start local Sanity Studio
└── deploy-studio.mjs         # Deploy Sanity Studio
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- A Sanity project ([sanity.io](https://www.sanity.io/))
- Resend account (for contact form and newsletter emails)

### 1. Clone and install

```bash
git clone https://github.com/iamjarif/boston-semiconductor-website.git
cd boston-semiconductor-website
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in the values in `.env.local`. At minimum, for local development:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

See [Environment variables](#environment-variables) for the full list.

### 3. Run the site

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Run Sanity Studio (blog admin)

```bash
npm run studio
```

Opens at [http://localhost:3333](http://localhost:3333). Blog posts, categories, and newsletter subscribers are managed here.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID (public) |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Sanity dataset, usually `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Yes | Sanity API version date |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site URL (emails, unsubscribe links) |
| `SANITY_API_READ_TOKEN` | No | Optional read token for draft/preview content |
| `SANITY_API_WRITE_TOKEN` | Yes* | Write token for subscribers and post notification tracking |
| `SANITY_WEBHOOK_SECRET` | Yes* | Secret for Sanity webhook verification |
| `RESEND_API_KEY` | Yes* | Resend API key for transactional email |
| `CONTACT_FORM_TO_EMAIL` | Yes* | Inbox for contact form submissions |

\* Required for full contact, newsletter, and blog notification functionality in production.

Never commit `.env.local` or other secret files.

## Developer Guide

### Where to edit content

| Content | Location |
| --- | --- |
| Site name, metadata, footer locations, social links | `src/lib/config/site.ts` |
| Service offerings | `src/lib/content/services.ts` |
| Homepage section copy and layout | `src/components/sections/` |
| Blog posts | Sanity Studio |
| Blog categories | Sanity Studio |
| Nav links and scroll targets | `NavigationBar.tsx` + section `id` attributes |
| Email copy and templates | `src/lib/email/` |

### Homepage sections

The marketing homepage is composed in `src/app/(marketing)/page.tsx`:

```tsx
<HeroSection />
<MissionStatement />
<ServicesGrid />
<ProcessBreakdown />
<EngagementModels />
<SecuritySection />
<WhyUsSection />
<BlogSection />
<ContactSection />
```

Each section lives in `src/components/sections/`. Scroll-linked variants (e.g. `HeroSectionScroll`, `ProcessBreakdownScroll`) handle pinned/scrub animations on desktop.

### Blog data flow

Pages do not fetch Sanity directly. They go through the data layer:

```
page.tsx → src/lib/blog.ts → src/lib/cms.ts → Sanity GROQ queries
```

This keeps route files thin and makes a future CMS swap easier.

### API routes

| Route | Purpose |
| --- | --- |
| `POST /api/contact` | Contact form submissions |
| `POST /api/newsletter` | Newsletter signup |
| `GET /api/newsletter/unsubscribe` | One-click unsubscribe |
| `POST /api/webhooks/sanity` | New blog post email notifications |

All routes use shared helpers in `src/lib/security/` for rate limiting, validation, and honeypot checks.

### Adding a new marketing page

1. Add types in `src/types/` if needed
2. Add data or config in `src/lib/`
3. Create a route under `src/app/(marketing)/`
4. Wrap with `SiteShell` via the marketing layout (or reuse it)
5. Add navigation links in `NavigationBar` and/or `Footer`

### Motion and accessibility

- Scroll animations respect `prefers-reduced-motion`
- Desktop-only pinned sections fall back to simpler scroll reveals on mobile
- Shared reveal presets live in `src/lib/motion/`

## Newsletter & Blog Notifications

Footer newsletter signups are stored in **Sanity** as subscriber records. Signups send a **confirmation email** to the subscriber only — no admin notification.

When a blog post is **published for the first time**, active subscribers receive a notification email. Re-editing an already-notified post does not re-send.

### Resend setup

1. Create a [Resend](https://resend.com/) account and API key
2. Add `RESEND_API_KEY` to `.env.local`
3. Set `CONTACT_FORM_TO_EMAIL` for the contact form inbox

### Sanity write token

Create a token with **Editor** access at [sanity.io/manage](https://www.sanity.io/manage) → API → Tokens.

```env
SANITY_API_WRITE_TOKEN=your-token
```

Used to store subscribers and mark posts with `notificationSentAt`.

### Sanity webhook

In [sanity.io/manage](https://www.sanity.io/manage) → your project → **API** → **Webhooks** → **Create webhook**:

| Setting | Value |
| --- | --- |
| **URL** | `https://www.bostonsemiconductor.com/api/webhooks/sanity` |
| **Dataset** | `production` (or your dataset) |
| **Trigger on** | Create, Update |
| **Filter** | `_type == "post" && !(_id in path("drafts.**"))` |
| **Projection** | `{ "_type": _type, "_id": _id, "title": title, "slug": slug.current, "excerpt": excerpt, "notificationSentAt": notificationSentAt }` |
| **Secret** | Generate a secret → set as `SANITY_WEBHOOK_SECRET` in `.env.local` |

Subscribers can unsubscribe from any email. Active and unsubscribed records are visible in Sanity Studio under **Newsletter Subscriber**.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run studio` | Start local Sanity Studio |
| `npm run studio:deploy` | Deploy Sanity Studio |

## Deployment

The site is designed for [Vercel](https://vercel.com/):

1. Connect the GitHub repository
2. Add all environment variables from `.env.example`
3. Deploy `main` (or your production branch)

For Sanity Studio in production:

```bash
npm run studio:deploy
```

Ensure the webhook URL points to your production domain before publishing blog posts.

## Branching

- `main` — production
- `staging` — pre-production testing

Merge `staging` into `main` when changes are ready to ship.

## License

Private — Boston Semiconductor. All rights reserved.
