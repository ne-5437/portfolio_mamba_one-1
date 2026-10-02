/**
 * Displacement filter used by `.glass-card`'s backdrop-filter (see globals.css).
 *
 * The turbulence is consumed *only* as feDisplacementMap's `in2` — it is never
 * drawn. That is the whole trick: blending the noise into the output (e.g. via
 * feBlend/feSpecularLighting) paints it as visible grey fog over the surface,
 * whereas using it purely as a displacement map bends the backdrop and reads as
 * real refraction.
 *
 * Low `baseFrequency` + a single octave keeps the warp broad and smooth rather
 * than grainy; `scale` is the knob for how hard light bends. Keep it modest —
 * upstream's 200 is tuned for small floating widgets and smears large soft
 * gradients into visible blobs on full-size cards.
 */
export default function LiquidGlassFilter() {
  return (
    <svg aria-hidden focusable="false" className="pointer-events-none absolute h-0 w-0">
      <defs>
        <filter
          id="glass-blur"
          x="0"
          y="0"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.003 0.007"
            numOctaves="1"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="34"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
