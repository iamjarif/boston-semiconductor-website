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
cp .env.local.example .env.local
```

Fill in your Sanity project ID and dataset. Create a project at [sanity.io](https://www.sanity.io/) if you don't have one.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Sanity Studio (blog admin)

```bash
npx sanity dev --cwd sanity
```

Admins manage blog posts through Sanity Studio — no custom dashboard needed.

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

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
