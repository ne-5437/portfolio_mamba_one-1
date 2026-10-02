<div align="center">

# Portfolio

**Dark neon-green racing theme** · Next.js 16 · TypeScript · Tailwind CSS v4

</div>

---

## Quick start

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Scripts

| Command         | Purpose                  |
| --------------- | ------------------------ |
| `npm run dev`   | Local dev server         |
| `npm run build` | Production build         |
| `npm start`     | Serve the production build |
| `npm run lint`  | ESLint                   |

## Editing content

All copy — profile, experience, projects, skills, certificates — lives in a single file:

```
data/content.ts
```

Swap the placeholder values there. No component changes needed.

## Structure

```
app/
  layout.tsx          Fonts, metadata, mounts the global UI layer
  page.tsx             Composes all sections
  api/contact/          Contact form endpoint → Supabase

components/
  cursor/               Trailing neon-glow cursor (fine-pointer only)
  ui/                   RibbonTrail, SignatureIntro, glass cards, etc.
  sections/             Hero, Expertise, Experience, Projects, Journey, Contact

data/
  content.ts            All site copy, in one place

docs/
  KNOWN_ISSUES.md        Engineering log — read before touching animation/glass

supabase/
  messages.sql           Contact-table schema (run once in Supabase SQL editor)
```

## Environment

Copy `.env.example` → `.env.local`:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

Both values come from Supabase → Project Settings → API. Add the same two in Vercel → Project → Settings → Environment Variables for production.

## Before touching animation or glass

Read [`docs/KNOWN_ISSUES.md`](docs/KNOWN_ISSUES.md) first — it records past bugs in `RibbonTrail`, `.glass-card`, and `backdrop-filter` with the rule that prevents each repeat.

## Deploy

**Vercel (recommended)**

1. Push to GitHub.
2. [vercel.com/new](https://vercel.com/new) → import the repo → deploy. Next.js is auto-detected.
3. Add your Supabase env vars in the project's Settings → Environment Variables.

**CLI**

```bash
npx vercel          # preview
npx vercel --prod   # production
```
