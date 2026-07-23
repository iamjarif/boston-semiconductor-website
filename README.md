# Boston Semiconductor Website

Next.js (App Router) marketing site with Sanity CMS-powered blog.

## Stack

- **Next.js 16** — App Router, TypeScript, ISR
- **Tailwind CSS v4** — CSS-based design tokens
- **Sanity CMS** — Blog content management via Sanity Studio

## Project Structure

```
src/
├── app/
│   ├── (marketing)/     # Static pages (homepage, future about/services/etc.)
│   └── blog/            # Blog list + [slug] detail pages
├── components/
│   ├── ui/              # Reusable UI (Button, Card, Nav, Footer)
│   └── sections/        # Page-specific sections (Hero, Services, etc.)
├── lib/
│   ├── config/          # Typed content constants (home.ts, site.ts)
│   ├── sanity/          # Sanity client, GROQ queries
│   ├── cms.ts           # CMS abstraction layer
│   └── blog.ts          # Blog data-fetching (no fetch in pages)
└── types/               # TypeScript interfaces (BlogPost, Career, etc.)
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in your Sanity project ID and dataset. Create a project at [sanity.io](https://www.sanity.io/) if you don't have one.

See [Newsletter & blog notifications](#newsletter--blog-notifications) below for Resend and webhook setup.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Sanity Studio (blog admin)

```bash
npm run studio
```

Opens at [http://localhost:3333](http://localhost:3333). Admins manage blog posts through Sanity Studio — no custom dashboard needed.

## Content Editing

- **Static page content** (hero, services, stats, etc.): edit typed constants in `src/lib/config/`
- **Blog posts**: managed in Sanity Studio
- **Nav/footer links**: `src/lib/config/site.ts`

## Adding Future Pages

New sections (e.g. `/careers`) follow the same pattern:

1. Add types in `src/types/`
2. Add data layer in `src/lib/`
3. Add route under `src/app/(marketing)/`
4. Add nav link in `src/lib/config/site.ts`

No restructuring of existing code required.

## Newsletter & blog notifications

Footer newsletter signups are stored in a **Resend Segment** and new blog posts trigger a **broadcast email** via a Sanity webhook.

### 1. Resend

1. Create a [Resend](https://resend.com/) Segment (e.g. “Blog Newsletter”) in the dashboard.
2. Copy the **Segment ID** into `.env.local` as `RESEND_SEGMENT_ID`.
3. Ensure `RESEND_API_KEY` is set. (`CONTACT_FORM_TO_EMAIL` is only used by the contact form — newsletter signups do not email admins.)

### 2. Sanity write token

Create a token with **Editor** access at [sanity.io/manage](https://www.sanity.io/manage) → API → Tokens.

Add to `.env.local`:

```env
SANITY_API_WRITE_TOKEN=your-token
```

This records `notificationSentAt` on each post so subscribers are not emailed twice when you edit a post.

### 3. Sanity webhook

In [sanity.io/manage](https://www.sanity.io/manage) → your project → **API** → **Webhooks** → **Create webhook**:

| Setting | Value |
|---------|--------|
| **URL** | `https://www.bostonsemiconductor.com/api/webhooks/sanity` |
| **Dataset** | `production` (or your dataset) |
| **Trigger on** | Create, Update |
| **Filter** | `_type == "post" && !(_id in path("drafts.**"))` |
| **Projection** | `{ "_type": _type, "_id": _id, "title": title, "slug": slug.current, "excerpt": excerpt, "notificationSentAt": notificationSentAt }` |
| **Secret** | Generate a secret → set as `SANITY_WEBHOOK_SECRET` in `.env.local` |

When you **publish** a new blog post (first time only), all segment subscribers receive an email with the title, excerpt, and link to the article. Edits to already-notified posts are skipped.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run studio` | Start Sanity Studio for blog editing |
