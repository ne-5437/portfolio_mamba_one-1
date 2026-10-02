# Known Issues & Engineering Log

A record of bugs that cost real debugging time, why they happened, and the rule
that prevents a repeat. Read this before touching the animation/glass layer.

Newest first. Each entry: **Symptom → Root cause → Fix → Rule.**

---

## 001 — Ribbon trail invisible or flickering ("seen and gone")

**Date:** 2026-08-20 · **Severity:** high · **Files:** `components/ui/RibbonTrail.tsx`

### Symptom
The cursor ribbon rendered intermittently — visible for an instant, then gone,
then back. Looked like a broken WebGL context or a load/timing glitch. Appeared
to work on some machines/sessions and not others.

### Root cause
Frame-rate-dependent math, **not** an environment problem.

The trail advanced each point toward the one ahead of it with:

```js
const segmentDelay = maxAge / (points.length - 1);
const alpha = Math.min(1, (dt * speedMultiplier) / segmentDelay); // ← bug
points[i].lerp(points[i - 1], alpha);
```

With `maxAge: 420` over 52 points, `segmentDelay ≈ 8.2ms`. Any frame longer than
that drives `alpha` to exactly **1.0**, and `lerp(target, 1)` snaps the point
*precisely onto* its predecessor. All 52 points stack into one zero-length dot —
nothing to draw.

A 60Hz frame is 16.7ms, i.e. **double the collapse threshold**. The effect only
survived above ~130Hz. So it rendered on fast frames and vanished on slow ones,
flickering as the framerate wobbled.

Measured `alpha` for the old config:

| Framerate | old `min(1, …)` | collapses? |
|---|---|---|
| 144Hz | 0.463 | no |
| **60Hz** | **1.000** | **yes → invisible** |
| **30Hz stutter** | **1.000** | **yes → invisible** |

### Fix
Exponential smoothing, which approaches 1 asymptotically but never reaches it:

```js
const alpha = 1 - Math.exp(-(dt * speedMultiplier) / segmentDelay);
```

Plus:
- `maxAge` 420 → **900ms**, so each segment is ~17ms and a 60Hz frame advances
  the chain by roughly one segment (a real flowing trail, not a compressed stub).
- `dt` clamped to **32ms** so one stalled frame can't jerk the trail.
- Clock reset on `visibilitychange` — a backgrounded tab reports one enormous
  `dt` on its first frame back.
- `dpr` capped at 2 (`devicePixelRatio` can be 2.5–3 on dense displays,
  quadrupling fragment work for no visible gain on a soft glow).

### Rule
> **Never use `Math.min(1, …)` as the alpha of a per-frame `lerp` chain.**
> Reaching exactly 1 collapses the chain. Use `1 - Math.exp(-k)` for any
> frame-rate-independent smoothing/damping/easing driven by `dt`.

> When an animation is **intermittent** rather than absent, suspect
> frame-rate-dependent math *before* suspecting the browser, the cache, or the
> GPU. Intermittent = a threshold is being crossed, and `dt` is usually it.

---

## 002 — SVG `url()` in `backdrop-filter` starves the animation loop

**Date:** 2026-08-20 · **Severity:** high · **Files:** `app/globals.css`, `components/ui/LiquidGlassFilter.tsx`

### Symptom
Page-wide framerate wobble. Directly contributed to #001 by pushing frame times
across the collapse threshold.

### Root cause
`.glass-card` used `backdrop-filter: url(#glass-blur) blur(16px) saturate(190%)`,
where `#glass-blur` is an `feTurbulence` + `feDisplacementMap` refraction filter.

There are **~29 `.glass-card` elements** on the page, and the ribbon animates
*behind* all of them. Every ribbon frame invalidates all 29 backdrop regions,
each of which re-runs turbulence generation and a displacement pass. Chromium
has no fast path for an SVG `url()` filter inside `backdrop-filter`, so the whole
cost lands on the compositor every single frame.

### Fix
Removed the `url(#glass-blur)` layer. `.glass-card` keeps GPU-accelerated
`blur(16px) saturate(190%)`, plus its rim highlights and shadows — the glass look
survives. `LiquidGlassFilter.tsx` is still mounted but currently unreferenced.

### Rule
> Treat `backdrop-filter` as a **per-element, per-frame** cost. It is fine on a
> few elements; it is not fine on dozens with something animating behind them.
> An SVG `url()` filter inside it is roughly an order of magnitude worse than
> plain `blur()`.
>
> If refraction is wanted back, **scope it to a handful of surfaces** (e.g. the
> five hero tiles) — never all `.glass-card`s.

---

## 003 — Glass reflection: JS version removed, pure-CSS version shipped

**Date:** 2026-08-20 · **Files:** `app/globals.css`, `components/ui/GlassReflection.tsx` *(unused)*

### Current implementation (keep this one)
A **pure-CSS** hover sheen in `globals.css`:

```css
@property --glass-angle { syntax: "<angle>"; inherits: true; initial-value: 140deg; }
.glass-card::after { background: linear-gradient(var(--glass-angle), …);
                     opacity: var(--glass-sheen, .85);
                     transition: --glass-angle .55s …, opacity .45s ease; }
.glass-card-hover:hover { --glass-angle: 310deg; --glass-sheen: 1; }
```

No listener, no rAF, no layout reads. Cost is one gradient repaint on one
element, only on enter/leave — it cannot compete with `RibbonTrail` for frame
budget. Two constraints that are easy to get wrong:

- **`inherits: true` is mandatory.** The gradient lives on `::after`, and a
  pseudo-element takes its values from the originating element *by
  inheritance*. With `inherits: false` the hover value never reaches `::after`,
  which silently falls back to `initial-value` and never moves.
- **Scoped to `.glass-card-hover`**, not `.glass-card`, so the nav bar stays
  static. Nested glass (`PlaceholderTile` is a `.glass-card` inside card
  articles) inherits and sweeps along with its parent — intended: one light
  source, so all glass in a tile turns together.

### What was removed
A JS version (`GlassReflection.tsx`) writing those same properties per-card on
pointer-move and scroll.

### Why it was pulled
Removed while bisecting #001. It was **not** the cause — but two genuine
problems surfaced, and both must be avoided if cursor-tracking is ever added
back on top of the CSS version:

1. **Transition duration must stay short when the target moves.** It was set to
   `1.1s` for a "smoother" feel. Because the hover handler recomputed the target
   angle every pointer frame (~16ms), a long transition can never converge — it
   perpetually chases a moving target and reads as *stuck* or *laggy*. Keep it
   ≤ ~0.3s. (The shipped CSS version uses `0.55s` safely *because* its target is
   static: hover sets one fixed angle, so the transition converges.)
2. **The scroll pass scanned all 29 cards with `getBoundingClientRect()` on every
   scroll-driven rAF tick** — a forced synchronous layout every frame, competing
   with the ribbon's render loop, during scroll (when the ribbon is already doing
   extra work). Throttled to ~120ms before removal; any restored version must
   stay throttled and use `IntersectionObserver` rather than a full rect scan.

`GlassReflection.tsx` is left in the tree, unmounted, as a starting point.

### Rule
> Prefer **pure CSS** for hover/state visuals. If it can be done with a
> registered custom property and a transition, it costs nothing on the JS thread
> and cannot destabilise an animation loop.

> A CSS transition on a value you recompute every frame must be **shorter than
> the interval between recomputations**, or it never settles. A static target
> can afford a long, luxurious transition; a moving one cannot.

> Never run `getBoundingClientRect()` over many elements inside a per-frame
> handler — especially not on scroll. Throttle it, or use `IntersectionObserver`.

> Scroll-driven ambient effects across *all* cards scale with card count and fire
> at the worst moment. Hover-driven effects are bounded to one element and cost
> nothing at rest. Prefer hover.

---

## 004 — Reload restored previous scroll position under the intro overlay

**Date:** 2026-08-20 · **Files:** `components/ui/SignatureIntro.tsx`

### Symptom
Reloading mid-page played the signature intro correctly, but when the overlay
lifted the page was at the *previous* scroll offset instead of the top.

### Root cause
The browser restores scroll position before React mounts. The intro sets
`overflow: hidden` while it plays, hiding the jump — so the restore was only
revealed when the overlay cleared.

### Fix
```js
if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
window.scrollTo(0, 0);
```
in its own effect, before the intro's timing effect.

### Rule
> A full-screen intro/splash does not prevent native scroll restoration — it only
> conceals it. Opt out explicitly with `history.scrollRestoration = "manual"`.

---

## 005 — Section headings misaligned (Journey 40px off)

**Date:** 2026-08-20 · **Files:** `components/sections/Journey.tsx`

### Symptom
Four section titles aligned; `Journey`'s sat ~40px to the right.

### Root cause
Every other section puts horizontal padding on the outer `<section>`, *outside*
the `mx-auto max-w-6xl` wrapper. Journey had `px-6 sm:px-10` on a div **inside**
that wrapper, so the padding was added on top of the centered max-width box.

### Fix
Moved padding to the sticky container, outside `max-w-6xl`. All five headings now
share an identical left edge.

### Rule
> Keep horizontal padding **outside** the `mx-auto max-w-*` box, consistently.
> Padding inside a centered max-width wrapper shifts content relative to every
> other section on the page.

---

## 006 — Dev server serves a deleted component (`X is not defined`)

**Date:** 2026-08-20 · **Severity:** low (dev-only, but very misleading)

### Symptom
After deleting `Footer` (and later unmounting `GlassReflection`), the browser
threw `ReferenceError: Footer is not defined` / `GlassReflection is not defined`
from the server-rendered payload — even though no source file referenced them.

### Root cause
A stale Turbopack/RSC payload cached in the **open browser tab**. Plain reload
(and even hard-reload) can reconnect the same page instance via HMR.

### Fix
Kill the dev server → `rm -rf .next` → restart → **open a brand-new tab**.

### Rule
> After deleting or unmounting a component, a lingering `is not defined` error is
> almost always a stale tab/build, not a real code reference. Verify with
> `grep -r ComponentName app components` before debugging further, then do a
> clean restart in a *new tab*.

---

## 007 — `next/image` serves a stale optimized rendition

**Date:** 2026-08-20 · **Files:** `public/images/`

### Symptom
Replaced `public/images/signal-portrait.png` on disk; the page kept showing the
old picture across restarts.

### Root cause
Two independent caches: Next's optimizer cache — `.next/dev/cache/images`
under `next dev`, `.next/cache/images` under `next build`/`start` — keyed on
the request URL — which doesn't change when file *contents* change — and the
browser's own cache of `/_next/image?url=…`.

### Fix
`rm -rf .next` and load in a fresh tab. Verified with a no-store fetch comparing
`blob.size` against the on-disk byte count.

### Rule
> Replacing an image at the same path does **not** bust `next/image`'s cache.
> Clear `.next` and use a fresh tab. Deleting only `.next/cache/images` is not
> enough in dev — the dev server reads `.next/dev/cache/images` (2026-10-02). To confirm what's actually being served:
> ```js
> fetch('/images/x.png', {cache:'no-store'}).then(r=>r.blob()).then(b=>b.size)
> ```
> and compare to the real file size — don't trust what's rendered.

---

## Debugging notes for this codebase

- **The stack is animation-heavy and cost-sensitive.** A WebGL canvas
  (`RibbonTrail`), ~29 `backdrop-filter` surfaces, infinite CSS keyframe loops
  (`.journey-wave`, `.journey-float`), and a scroll-driven `Journey` track all
  run simultaneously. New per-frame work competes with all of it.
- **Verify with numbers, not vibes.** The #001 fix was only confirmed by
  computing `alpha` at 60/144/30Hz and showing the old formula hit exactly 1.0.
- **`document.hidden` blocks `requestAnimationFrame`.** Headless/background
  automation cannot observe animation — rAF reports zero ticks. Diagnose motion
  bugs from *state and math*, or from a real foreground browser.
- **Useful one-liners:**
  ```js
  document.querySelectorAll('.glass-card').length            // backdrop-filter surface count
  document.querySelector('canvas').getContext('webgl2').isContextLost()
  getComputedStyle(document.querySelector('.glass-card')).backdropFilter
  ```
