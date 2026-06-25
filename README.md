# Runnaract 2.0

Event registration platform for the Runnaract 2.0 running race at Zitara Golf Club. Built with TanStack Start.

## Tech Stack

- **Framework:** TanStack Start (Vite + React + SSR)
- **Routing:** TanStack Router (file-based)
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Server:** Nitro (Vercel-ready)
- **Animations:** Framer Motion, Spline 3D
- **Forms:** React Hook Form + Zod
- **UI:** shadcn/ui (Radix primitives)

## Prerequisites

- Node.js 20+
- npm or bun

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start dev server
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key |
| `SUPABASE_URL` | Same URL (for SSR) |
| `SUPABASE_PUBLISHABLE_KEY` | Same key (for SSR) |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin key (server-side only) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at `:8080` |
| `npm run build` | Production build (Vite + Nitro) |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Project Structure

```
src/
├── assets/           Images and static files
├── components/       Reusable UI components
│   └── ui/          shadcn/ui primitives
├── hooks/           Custom React hooks
├── integrations/    Third-party service clients
│   └── supabase/    Supabase client + types
├── lib/             Utilities and config
├── routes/          File-based TanStack Router routes
│   ├── __root.tsx   Root layout
│   ├── index.tsx    Landing page
│   ├── registro.tsx Registration form
│   ├── consulta.tsx Registration lookup
│   ├── admin.tsx    Admin panel
│   └── pago.$id.tsx Payment page
├── router.tsx       Router configuration
├── server.ts        Server entry point
├── start.ts         App middleware config
└── styles.css       Global styles
supabase/
└── migrations/      SQL migrations
```

## Deployment

The project deploys to Vercel automatically on push via the `runaract` remote. The Nitro plugin generates the correct serverless output for Vercel.

## Routes

| Path | Page |
|------|------|
| `/` | Landing |
| `/registro` | Registration form |
| `/consulta` | Look up registration |
| `/pago/:id` | Payment |
| `/admin` | Admin panel |
