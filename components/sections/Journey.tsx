"use client";

/**
 * Educational Journey — horizontal, scroll-driven.
 *
 * Progress mechanics follow portfolio_3: a tall track wraps a sticky stage, so
 * vertical scrolling maps to horizontal progress:
 *   progress = clamp(-trackRect.top / (trackRect.height - innerHeight), 0, 1)
 * and each milestone activates once `progress >= its own dateRatio`, where
 * dateRatio = (date - start) / (end - start).
 *
 * Layout notes, learned the hard way:
 *  - Ribbon amplitude must stay small. At ±13px the waves wandered away from the
 *    dots (which sit on the centre line) and the bar stopped reading as a bar.
 *  - Tier depth is capped, because milestones cluster hard in Aug–Oct 2023 and
 *    uncapped stacking pushed labels past the bottom of the viewport.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { journey, journeyRange, journeyStartLabel, journeyEndLabel } from "@/data/content";

const BASE_GAP = 46;
const TIER_STEP = 54;
const MAX_TIER = 2;
/** Percent of bar width below which two same-side labels are treated as colliding. */
const COLLISION_THRESHOLD = 10;
/** Keeps the first/last milestone off the very edges of the bar. */
const INSET = 5;

const VIEW_W = 1000;
const VIEW_H = 120;

/**
 * Five ribbons in distinct shades of the brand green, running in parallel with a
 * phase lag each so they read as a bundled signal rather than one line.
 */
const RIBBONS = [
  { color: "#b6ffd8", width: 1.8, offset: -15, lag: 0.0, opacity: 0.42 },
  { color: "#7dffc0", width: 2.6, offset: -7.5, lag: 0.24, opacity: 0.7 },
  { color: "#39ff8f", width: 3.4, offset: 0, lag: 0.48, opacity: 1 },
  { color: "#0bd977", width: 2.6, offset: 7.5, lag: 0.72, opacity: 0.74 },
  { color: "#12b5a5", width: 1.8, offset: 15, lag: 0.96, opacity: 0.5 },
];

/**
 * Two summed harmonics — a slow carrier plus a faster overtone — so the bar
 * reads like an audio waveform instead of a plain sine.
 *
 * Cycle counts are INTEGERS per VIEW_W. That makes the wave repeat exactly every
 * VIEW_W, so a path drawn across 2×VIEW_W can be translated left by VIEW_W on an
 * infinite CSS loop and tile seamlessly. The motion is therefore continuous and
 * GPU-driven — it never freezes when scrolling stops, and costs no JS per frame.
 */
const CARRIER_CYCLES = 3;
const CARRIER_AMP = 13;
const OVERTONE_CYCLES = 7;
const OVERTONE_AMP = 5;

/** Drawn across two tiles so the loop has somewhere to travel into. */
function ribbonPath(offset: number, lag: number) {
  const points: string[] = [];
  const SAMPLES = 400;
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES; // 0..1 across TWO tiles
    const x = t * VIEW_W * 2;
    const u = t * 2; // cycles are defined per tile
    const y =
      VIEW_H / 2 +
      offset +
      Math.sin(u * Math.PI * 2 * CARRIER_CYCLES + lag) * CARRIER_AMP +
      Math.sin(u * Math.PI * 2 * OVERTONE_CYCLES + lag * 1.6) * OVERTONE_AMP;
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(2)}`);
  }
  return points.join(" ");
}

export default function Journey() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  /**
   * The reveal edge, in the SAME percentage space the milestones are placed in.
   * Because dots sit at `INSET + ratio * (100 - 2*INSET)`, mapping the reveal
   * identically means the edge passes a dot exactly when `progress >= ratio` —
   * so the bar and the milestone activations can never disagree.
   */
  const revealPercent = INSET + progress * (100 - INSET * 2);

  /** Static geometry — the waving is done by CSS, not by rebuilding paths. */
  const ribbons = useMemo(
    () => RIBBONS.map((r) => ({ ...r, d: ribbonPath(r.offset, r.lag) })),
    []
  );

  const milestones = useMemo(() => {
    const start = new Date(journeyRange.start).getTime();
    const end = new Date(journeyRange.end).getTime();

    const sorted = [...journey]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item, index, arr) => {
        const ratio = Math.max(
          0,
          Math.min(1, (new Date(item.date).getTime() - start) / (end - start))
        );
        // The last milestone sits at the same edge as the axis end-date label
        // below the bar, so it's pinned "up" regardless of parity to avoid
        // colliding with it — the same reason index 0 naturally lands "up".
        const isLast = index === arr.length - 1;
        return {
          ...item,
          ratio,
          percent: INSET + ratio * (100 - INSET * 2),
          side: isLast || index % 2 === 0 ? "up" : ("down" as const),
        };
      });

    const lastOnSide: Record<string, { percent: number; tier: number } | undefined> = {};
    return sorted.map((item) => {
      const prev = lastOnSide[item.side];
      const tier =
        prev && item.percent - prev.percent < COLLISION_THRESHOLD
          ? Math.min(MAX_TIER, prev.tier + 1)
          : 0;
      lastOnSide[item.side] = { percent: item.percent, tier };
      return { ...item, tier, distance: BASE_GAP + tier * TIER_STEP };
    });
  }, []);

  useEffect(() => {
    let rafId: number | null = null;

    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      setProgress(Math.max(0, Math.min(1, -rect.top / scrollable)));
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        measure();
        rafId = null;
      });
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section id="journey" ref={trackRef} className="relative h-[500vh]">
      <div className="sticky top-0 flex h-screen flex-col px-6 sm:px-10">
        <div className="mx-auto w-full max-w-6xl shrink-0 pt-28">
          <SectionHeading index="04" eyebrow="Academic Journey" title="Journey" />
        </div>

        {/* Bar sits in the remaining space, with room above and below for labels. */}
        <div className="relative flex flex-1 items-center pb-10 sm:px-2">
          <div className="relative w-full">
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              preserveAspectRatio="none"
              className="block h-24 w-full overflow-visible"
              aria-hidden
            >
              <defs>
                {/*
                 * Reveal by clipping in X, not by stroke-dasharray. Dash length
                 * is measured along the ARC, which on a wavy path runs ahead of
                 * horizontal position — that mismatch is why the bar appeared
                 * only part-filled while every milestone had already lit up.
                 * Clipping shares the exact same x-mapping as the dots.
                 */}
                <clipPath id="journey-reveal">
                  <rect
                    x="0"
                    y="0"
                    width={(revealPercent / 100) * VIEW_W}
                    height={VIEW_H}
                    style={{ transition: "width 0.12s linear" }}
                  />
                </clipPath>
              </defs>

              {/* Unlit track */}
              <g className="journey-wave">
                {ribbons.map((r, i) => (
                  <path
                    key={`track-${i}`}
                    d={r.d}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth={r.width}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </g>

              {/* Lit portion — same waving geometry, clipped to the reveal. */}
              <g clipPath="url(#journey-reveal)">
                <g className="journey-wave">
                  {ribbons.map((r, i) => (
                    <path
                      key={`fill-${i}`}
                      d={r.d}
                      fill="none"
                      stroke={r.color}
                      strokeWidth={r.width}
                      strokeLinecap="round"
                      opacity={r.opacity}
                      vectorEffect="non-scaling-stroke"
                      style={{ filter: `drop-shadow(0 0 6px ${r.color})` }}
                    />
                  ))}
                </g>
              </g>
            </svg>

            <div className="pointer-events-none absolute inset-0">
              {milestones.map((item, i) => {
                const isActive = progress >= item.ratio;
                const isUp = item.side === "up";
                return (
                  <div key={item.id}>
                    <span
                      aria-hidden
                      className="absolute w-px"
                      style={{
                        left: `${item.percent}%`,
                        [isUp ? "bottom" : "top"]: "50%",
                        height: item.distance,
                        background: isActive
                          ? `linear-gradient(${isUp ? "to top" : "to bottom"}, ${item.color}66, ${item.color}00)`
                          : "rgba(255,255,255,0.07)",
                        transition: "background 0.4s ease",
                      }}
                    />

                    {/* Small dots — 7px, scaling only modestly when lit. */}
                    <span
                      className="absolute top-1/2 h-[7px] w-[7px] rounded-full"
                      style={{
                        left: `${item.percent}%`,
                        transform: `translate(-50%, -50%) scale(${isActive ? 1.35 : 0.85})`,
                        backgroundColor: isActive ? item.color : "#2e332f",
                        boxShadow: isActive ? `0 0 10px ${item.color}` : "none",
                        transition:
                          "transform 0.4s cubic-bezier(0.34, 1.4, 0.64, 1), background-color 0.4s ease, box-shadow 0.4s ease",
                        zIndex: 5,
                      }}
                    />

                    <div
                      className="journey-float absolute w-[168px] -translate-x-1/2 text-center"
                      style={{
                        left: `${item.percent}%`,
                        [isUp ? "bottom" : "top"]: `calc(50% + ${item.distance}px)`,
                        opacity: isActive ? 1 : 0.24,
                        animationDelay: `${(i % 7) * 0.55}s`,
                        animationDuration: `${4.2 + (i % 5) * 0.4}s`,
                        transition: "opacity 0.45s ease",
                      }}
                    >
                      <div
                        className="text-[13px] font-semibold leading-[1.25] tracking-[-0.01em]"
                        style={{
                          color: isActive ? item.color : "var(--color-text-faint)",
                          textShadow: isActive ? `0 0 20px ${item.color}44` : "none",
                          transition: "color 0.45s ease, text-shadow 0.45s ease",
                        }}
                      >
                        {item.title}
                      </div>
                      <div className="mono-tel mt-1 text-[9px] uppercase tracking-[0.16em] text-text-faint">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mono-tel mt-3 flex justify-between text-[10px] uppercase tracking-[0.2em] text-text-faint">
              <span>{journeyStartLabel}</span>
              <span>{journeyEndLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
