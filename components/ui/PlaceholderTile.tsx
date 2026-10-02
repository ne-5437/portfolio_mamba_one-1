interface PlaceholderTileProps {
  label: string;
  className?: string;
  variant?: "portrait" | "wide" | "fill";
}

const VARIANT_CLASS: Record<NonNullable<PlaceholderTileProps["variant"]>, string> = {
  portrait: "aspect-[3/4]",
  wide: "aspect-[16/9]",
  fill: "h-full w-full",
};

export default function PlaceholderTile({ label, className = "", variant = "portrait" }: PlaceholderTileProps) {
  const patternId = `circuit-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div
      className={`glass-card relative overflow-hidden rounded-3xl ${VARIANT_CLASS[variant]} ${className}`}
    >
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 200 260"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id={patternId} width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M0 20 H14 M26 20 H40 M20 0 V14 M20 26 V40"
              stroke="rgba(57,255,143,0.35)"
              strokeWidth="1"
              fill="none"
            />
            <circle cx="20" cy="20" r="2" fill="rgba(57,255,143,0.5)" />
          </pattern>
        </defs>
        <rect width="200" height="260" fill={`url(#${patternId})`} />
      </svg>

      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(0deg, rgba(4,6,10,0.55) 0%, transparent 45%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <span
          className="mono-tel text-4xl font-semibold text-neon/70 sm:text-5xl"
          style={{ textShadow: "0 0 24px rgba(57,255,143,0.35)" }}
        >
          {label}
        </span>
        <span className="mono-tel text-[10px] uppercase tracking-[0.3em] text-text-faint">
          Image slot
        </span>
      </div>

      <div className="absolute bottom-4 left-4 h-2 w-2 rounded-full bg-neon shadow-[0_0_8px_rgba(57,255,143,0.8)]" />
    </div>
  );
}
