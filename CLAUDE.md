@AGENTS.md

## Before touching the animation or glass layer

Read [`docs/KNOWN_ISSUES.md`](docs/KNOWN_ISSUES.md) first. It records bugs that
already cost significant debugging time, with the rule that prevents each repeat.

The two that bite hardest:

- **Never use `Math.min(1, …)` as the alpha of a per-frame `lerp` chain** —
  alpha reaching exactly 1 collapses the chain. Use `1 - Math.exp(-k)` for any
  `dt`-driven smoothing. (This silently killed the cursor ribbon at 60Hz.)
- **`backdrop-filter` is a per-element, per-frame cost.** ~29 `.glass-card`
  surfaces sit in front of an animating WebGL canvas. Do not add an SVG `url()`
  filter to `backdrop-filter`, and do not add new per-frame work that scans all
  cards.

When an animation is *intermittent* rather than absent, suspect frame-rate-dependent
math before suspecting the browser, the cache, or the GPU.
