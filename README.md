# Portfolio — Dark Neon-Green Racing Theme

AI developer portfolio built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4. Dark theme, green night-neon palette, subtle motorsport accents, and a custom trailing-glow cursor.

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Known issues & engineering log

[`docs/KNOWN_ISSUES.md`](docs/KNOWN_ISSUES.md) records past bugs — symptom, root
cause, fix, and the rule that prevents a repeat. **Read it before changing the
animation or glass layer** (`RibbonTrail`, `.glass-card`, `backdrop-filter`).

## Editing content

All copy — profile, experience, projects, skills, blog posts, certificates — lives in [`data/content.ts`](data/content.ts). Swap the placeholder values there; no component changes needed.

## Structure

- `app/layout.tsx` — fonts, metadata, mounts `RibbonTrail`, `LiquidGlassFilter`, `SignatureIntro`, `CustomCursor`, `Header`
- `app/page.tsx` — composes all sections
- `components/cursor/CustomCursor.tsx` — trailing neon glow dot + ring, disabled on touch devices
- `components/ui/RibbonTrail.tsx` — WebGL cursor ribbon (ogl). See `docs/KNOWN_ISSUES.md#001` before editing
- `components/ui/` — `SectionHeading`, `RevealOnScroll`, `CheckeredAccent`, `PlaceholderTile`, `MapTile`, `SignatureIntro`
- `components/sections/` — `Hero`, `Expertise`, `Experience`, `Projects`, `Journey`, `Contact`

## Build

```bash
npm run build
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo, and deploy — Next.js is auto-detected, no config needed.
3. Add a custom domain in the Vercel project's Settings → Domains once deployed.

Alternatively, from the CLI: `npx vercel` (or `npx vercel --prod` for a production deploy) after running `vercel login`.
