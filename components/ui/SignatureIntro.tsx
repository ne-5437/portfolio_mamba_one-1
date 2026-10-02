"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { SIGNATURE_STROKES, SIGNATURE_VIEWBOX } from "@/components/ui/signaturePath";

/**
 * Load intro — the signature is WRITTEN on a pitch-black field, holds, then
 * blends into the page. Plays on every load and reload.
 *
 * The geometry is a centreline skeleton extracted from public/signature.png
 * (threshold → Zhang-Suen thinning → skeleton walk → simplify → smooth), not a
 * traced outline. That distinction is the whole point: an outline is a filled
 * shape and can only be wiped or faded in, whereas these are open paths along
 * the pen's actual route, so `stroke-dashoffset` draws them exactly the way a
 * hand would — verified at 0.93 containment inside the original ink.
 *
 * Strokes fire in written order, each delayed by its own `start` fraction and
 * lasting in proportion to its share of total pen distance, so the pen keeps a
 * near-constant speed across the whole signature.
 *
 * Timing (~7.3s): write 4.6s · hold 1.1s · blend 1.6s.
 */

const WRITE_MS = 4600;
const HOLD_MS = 1100;
const BLEND_MS = 1600;

/**
 * Index-matched to SIGNATURE_RIBBON_OFFSETS — each entry paints one of the
 * PARALLEL offset paths, so the signature is written by a bundle of filaments.
 * Previously these were concentric copies of one path at different widths,
 * which just reads as a single thick pen with a glow.
 *
 * `lag` staggers each filament slightly so the bundle trails the leading edge
 * the way the cursor ribbon does.
 */
/**
 * Widths are in viewBox units and must stay below the ribbon centre spacing
 * (offsets are ±6/±2, so centres are 4u apart) or the bands merge into one line.
 * At display scale (~0.46) these render as fine ~1px filaments.
 *
 * The bundle is deliberately small: this signature's loops have radii of only a
 * few pixels, and any parallel offset wider than the local radius folds back
 * through itself — which is what made the earlier, fatter bands overlap.
 */
const RIBBONS = [
  { color: "#7dffc0", width: 2.2, opacity: 0.8, lag: 0.02 },
  { color: "#39ff8f", width: 2.6, opacity: 1, lag: 0 },
  { color: "#0bd977", width: 2.6, opacity: 0.95, lag: 0.01 },
  { color: "#12b5a5", width: 2.2, opacity: 0.75, lag: 0.03 },
];

const DIM_MS = 800;

function subscribeTipSupport() {
  return () => {};
}

function getTipSupportedSnapshot() {
  return CSS.supports("offset-path", 'path("M0 0 L1 1")');
}

function getTipSupportedServerSnapshot() {
  return false;
}

export default function SignatureIntro() {
  const [visible, setVisible] = useState(false);
  const [blending, setBlending] = useState(false);
  const tipSupported = useSyncExternalStore(
    subscribeTipSupport,
    getTipSupportedSnapshot,
    getTipSupportedServerSnapshot
  );
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // The browser restores the previous scroll position before this runs, so
    // without this the page silently jumps back to where you left off once
    // the intro's overflow:hidden lifts. Reloading should always start at top.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    // Deliberately ungated: a sessionStorage "once per tab" gate meant reloads
    // never replayed it, which read as the intro being broken. Mount-triggered
    // animation kickoff (starts a setTimeout chain), not state synchronization.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);

    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const toBlend = setTimeout(() => setBlending(true), WRITE_MS + HOLD_MS);
    const toHide = setTimeout(() => {
      setVisible(false);
      document.documentElement.style.overflow = prevOverflow;
    }, WRITE_MS + HOLD_MS + BLEND_MS);

    return () => {
      clearTimeout(toBlend);
      clearTimeout(toHide);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [reducedMotion]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-black"
      style={{
        opacity: blending ? 0 : 1,
        transition: `opacity ${BLEND_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      }}
    >
      {/* Bloom that expands out of the signature as it blends away. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[42vmin] w-[42vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(57,255,143,0.30), transparent 68%)",
          filter: "blur(60px)",
          opacity: blending ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${blending ? 3.4 : 0.6})`,
          transition: `opacity ${BLEND_MS}ms ease-out, transform ${BLEND_MS}ms cubic-bezier(0.2, 0, 0.2, 1)`,
        }}
      />

      <div
        className="relative flex w-full max-w-3xl flex-col items-center gap-6 px-8"
        style={{
          transform: `scale(${blending ? 1.1 : 1})`,
          filter: blending ? "blur(6px)" : "blur(0px)",
          transition: `transform ${BLEND_MS}ms cubic-bezier(0.4, 0, 0.2, 1), filter ${BLEND_MS}ms ease-in`,
        }}
      >
        <svg
          viewBox={SIGNATURE_VIEWBOX}
          className="w-full overflow-visible"
          role="img"
          aria-label="Eshwar Gottupalli signature"
        >
          <g>
            {SIGNATURE_STROKES.map((stroke, s) => {
              const isLast = s === SIGNATURE_STROKES.length - 1;
              const endMs = (stroke.start + stroke.share) * WRITE_MS;

              return RIBBONS.map((ribbon, r) => {
                const startMs = (stroke.start + ribbon.lag) * WRITE_MS;
                const drawMs = stroke.share * WRITE_MS;

                return (
                  <path
                    key={`${s}-${r}`}
                    d={stroke.ribbons[r]}
                    pathLength={1}
                    stroke={ribbon.color}
                    strokeWidth={ribbon.width}
                    className="sig-write"
                    style={
                      {
                        opacity: ribbon.opacity,
                        // Read by the sig-dim keyframe, so each band settles to
                        // half of ITS OWN opacity rather than a fixed value.
                        "--sig-o": ribbon.opacity,
                        // The final stroke keeps its full weight; everything
                        // written before it eases back once it is finished.
                        animationName: isLast ? "sig-write-run" : "sig-write-run, sig-dim",
                        animationDuration: isLast ? `${drawMs}ms` : `${drawMs}ms, ${DIM_MS}ms`,
                        animationDelay: isLast ? `${startMs}ms` : `${startMs}ms, ${endMs}ms`,
                        animationFillMode: isLast ? "both" : "both, forwards",
                        animationTimingFunction: isLast
                          ? "cubic-bezier(0.42, 0, 0.58, 1)"
                          : "cubic-bezier(0.42, 0, 0.58, 1), ease-out",
                        filter: `drop-shadow(0 0 10px ${ribbon.color})`,
                      } as React.CSSProperties
                    }
                  />
                );
              });
            })}

            {/* Pen tip riding the centreline, mirroring the cursor ribbon's head.
                Only rendered where offset-path is supported — without it the dot
                would sit stranded at the origin. */}
            {tipSupported &&
              SIGNATURE_STROKES.map((stroke, s) => (
                <circle
                  key={`tip-${s}`}
                  r={5}
                  cx={0}
                  cy={0}
                  fill="#d8ffe9"
                  className="sig-tip"
                  style={{
                    offsetPath: `path("${stroke.core}")`,
                    animationDelay: `${stroke.start * WRITE_MS}ms`,
                    animationDuration: `${stroke.share * WRITE_MS}ms`,
                    filter: "drop-shadow(0 0 10px #39ff8f)",
                  }}
                />
              ))}
          </g>
        </svg>

        <p
          className="mono-tel text-[10px] uppercase tracking-[0.45em] text-text-faint"
          style={{ animation: `sig-fade-in 900ms ease-out ${WRITE_MS - 600}ms both` }}
        >
          Eshwar Gottupalli
        </p>
      </div>
    </div>
  );
}
