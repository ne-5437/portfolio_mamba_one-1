interface MapTileProps {
  className?: string;
}

/**
 * Stylized monochrome map placeholder (route-line pattern) standing in for a
 * real map image. Swap by rendering an <img> here once a real asset exists.
 */
export default function MapTile({ className = "" }: MapTileProps) {
  return (
    <svg
      aria-hidden
      className={`absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 300 300"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Translucent, not opaque — an opaque fill here would hide the glass. */}
      <rect width="300" height="300" fill="rgba(6, 12, 10, 0.35)" />
      <g stroke="rgba(234,243,236,0.16)" strokeWidth="1.4" fill="none">
        <path d="M-10 40 L120 30 L160 90 L310 70" />
        <path d="M-10 110 L90 100 L140 150 L200 140 L310 160" />
        <path d="M-10 190 L100 200 L150 170 L230 210 L310 200" />
        <path d="M-10 260 L110 250 L170 280 L310 250" />
        <path d="M40 -10 L60 120 L30 200 L70 310" />
        <path d="M150 -10 L140 90 L170 180 L150 310" />
        <path d="M250 -10 L230 100 L260 200 L240 310" />
      </g>
      <g stroke="rgba(57,255,143,0.55)" strokeWidth="2">
        <path d="M-10 145 L110 135 L155 155 L310 130" />
      </g>
      <circle cx="155" cy="150" r="5" fill="var(--color-neon)" />
      <circle cx="155" cy="150" r="10" fill="none" stroke="rgba(57,255,143,0.5)" strokeWidth="1.5" />
    </svg>
  );
}
