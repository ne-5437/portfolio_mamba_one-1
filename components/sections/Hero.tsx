"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { profile } from "@/data/content";
import MapTile from "@/components/ui/MapTile";

const cardMotion = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

/**
 * Small registration mark shared by every tile — a "+" plus a short system
 * code (ID·01 … GEO·05). Same typographic treatment everywhere, different
 * code each time, so the five modules read as one instrumented system
 * rather than five independent components placed side by side.
 */
function RegMark({ code }: { code: string }) {
  return (
    <span className="mono-tel flex shrink-0 items-center gap-1 text-[9px] uppercase tracking-[0.22em] text-text-faint">
      <span aria-hidden className="text-text-faint/70">
        +
      </span>
      {code}
    </span>
  );
}

/**
 * Home composition — five modules on a 3-column × 2-row grid at desktop.
 *
 *   ┌──────────┬──────────┬──────────┐
 *   │ Identity │          │  Signal  │   row 1
 *   ├──────────┤   Core   ├──────────┤
 *   │ Racecraft│  (tall)  │   Geo    │   row 2
 *   └──────────┴──────────┴──────────┘
 *
 * Core spans both rows in the middle column; the remaining four modules are
 * plain 1×1 cells, so CSS grid's auto-placement fills every track on its own —
 * no gaps, and no explicit col/row coordinates needed beyond Core's span.
 *
 * Reading order (DOM order = visual priority): Identity(01) → Core(02) →
 * Signal(03) → Racecraft(04) → Geo(05) — matching each tile's RegMark code.
 */
export default function Hero() {
  return (
    <section id="top" className="relative px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-10">
      <div className="mx-auto grid w-full max-w-6xl auto-rows-[minmax(200px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
        {/* 01 — Identity */}
        <motion.div
          {...cardMotion(0)}
          className="glass-card glass-card-hover relative flex flex-col overflow-hidden rounded-3xl p-6"
        >
          {/* Cropped signature — deliberately oversized and clipped by the
              card edge, anchored with a coordinate tick so it reads as a
              registered mark rather than leftover decorative type. */}
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-8 -right-4 select-none text-[7rem] font-bold leading-none text-white/[0.035] sm:text-[8.5rem]"
          >
            {profile.initials}
          </span>
          <span className="mono-tel pointer-events-none absolute bottom-20 right-6 text-[8px] text-text-faint/40 sm:bottom-24">
            00.00
          </span>

          <div className="relative flex items-center justify-between">
            <p className="mono-tel flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-neon">
              <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_8px_rgba(57,255,143,0.8)]" />
              {profile.role}
            </p>
            <RegMark code="ID·01" />
          </div>

          <div className="relative flex flex-1 items-center">
            <h1 className="text-4xl font-bold uppercase leading-[1.05] tracking-tight text-text sm:text-5xl">
              {profile.firstName}
              <br />
              <span className="text-neon">{profile.lastName}</span>
            </h1>
          </div>

          <div className="relative flex items-center gap-3">
            <span className="ruler-line flex-1" />
            <span className="mono-tel shrink-0 text-[9px] uppercase tracking-[0.25em] text-text-faint">
              Operator
            </span>
          </div>
        </motion.div>

        {/* 02 — Core, spans both rows in the middle column */}
        <motion.div
          {...cardMotion(0.1)}
          className="glass-card glass-card-hover flex flex-col rounded-3xl p-7 sm:p-8 lg:row-span-2"
        >
          <div className="flex items-center justify-between">
            <p className="mono-tel text-[11px] font-bold uppercase tracking-[0.28em] text-text-muted">
              Behind The Wheel
            </p>
            <RegMark code="CORE·02" />
          </div>

          <span className="ruler-line mt-8 w-12" />

          <p className="mt-8 text-[20px] font-semibold leading-[1.35] tracking-tight text-text sm:text-[22px]">
            Demonstrated expertise in Artificial Intelligence, Computer Vision, and Embedded
            Systems, with <span className="text-neon">1+ years</span> of professional experience
            building innovative systems.
          </p>

          {/* A quiet personal detail tucked into the card's unused lower
              space — no label, just the reference itself. */}
          <div className="mt-auto">
            <span className="ruler-line w-12" />
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.1em] text-text-muted">
              In And Out Of Love
            </p>
            <p className="mt-1 text-[11px] text-text-faint">
              Armin van Buuren feat. Sharon den Adel
            </p>
            <p className="mt-3 text-[11px] italic leading-relaxed text-text-faint/80">
              &ldquo;A signal I keep returning to.&rdquo;
            </p>
          </div>
        </motion.div>

        {/* 03 — Signal (personal photo). The HUD framing (corner brackets,
            crosshair, status + subject labels) is composited into the source
            image itself, so the tile is just the photo — no duplicate overlay. */}
        <motion.div
          {...cardMotion(0.2)}
          className="glass-card glass-card-hover relative aspect-[4/3] h-full min-h-[220px] overflow-hidden rounded-3xl"
        >
          <Image
            src="/images/signal-portrait.png"
            alt="Eshwar Gottupalli"
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
            priority
          />
        </motion.div>

        {/* 04 — Racecraft */}
        <motion.div
          {...cardMotion(0.3)}
          className="glass-card glass-card-hover flex flex-col rounded-3xl p-6"
        >
          <div className="flex items-center justify-between">
            <p className="mono-tel text-[11px] font-bold uppercase tracking-[0.28em] text-text-muted">
              Racecraft
            </p>
            <RegMark code="LOG·04" />
          </div>

          <div className="flex flex-1 items-center">
            <p className="text-lg leading-snug text-text">
              <span className="text-neon">&ldquo;</span>
              {profile.quote}
              <span className="text-neon">&rdquo;</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="ruler-line flex-1" />
            <a
              href="#projects"
              data-cursor-hover
              className="mono-tel shrink-0 text-[10px] uppercase tracking-[0.2em] text-neon transition-opacity hover:opacity-70"
            >
              View Work →
            </a>
          </div>
        </motion.div>

        {/* 05 — Geo (location) */}
        <motion.div
          {...cardMotion(0.4)}
          className="glass-card glass-card-hover relative flex flex-col overflow-hidden rounded-3xl p-6"
        >
          <MapTile />
          {/* Keeps the map legible behind the type without hiding it. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />

          <div className="relative flex items-center justify-between">
            <p className="mono-tel text-[11px] font-bold uppercase tracking-[0.28em] text-text-muted">
              Base
            </p>
            <RegMark code="GEO·05" />
          </div>

          <div className="relative mt-auto">
            <h2 className="whitespace-nowrap text-2xl font-bold uppercase leading-none tracking-tight text-text">
              {profile.city} <span className="text-text-muted">{profile.country}</span>
            </h2>
            <p className="mono-tel mt-3 whitespace-nowrap text-[10px] uppercase tracking-[0.18em] text-neon">
              {profile.latLabel} &nbsp;&nbsp; {profile.longLabel}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
