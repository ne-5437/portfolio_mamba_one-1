"use client";

/**
 * Flowing ribbon cursor trail — React Bits' `Ribbons`
 * (src/ts-tailwind/Animations/Ribbons/Ribbons.tsx), rendered with ogl.
 *
 * Two necessary adaptations from upstream:
 *  - listens for pointer movement on `window`, not the container. The container
 *    is `pointer-events: none` (it sits behind the whole page), so it would
 *    never receive a mousemove of its own.
 *  - bails out on coarse pointers and reduced-motion, where a cursor trail has
 *    nothing to follow or is unwanted.
 *
 * Mounted behind every card, so the glass refracts the ribbons as they pass.
 */

import { useEffect, useRef } from "react";
import { Renderer, Transform, Vec3, Color, Polyline } from "ogl";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface RibbonTrailProps {
  colors?: string[];
  baseSpring?: number;
  baseFriction?: number;
  baseThickness?: number;
  offsetFactor?: number;
  maxAge?: number;
  pointCount?: number;
  speedMultiplier?: number;
  enableFade?: boolean;
  enableShaderEffect?: boolean;
  effectAmplitude?: number;
}

export default function RibbonTrail({
  // Brand greens plus a cyan and a pale mint, so the strands read as separate
  // filaments of light rather than one thick band.
  colors = ["#39ff8f", "#0bd977", "#7dffc0", "#12b5a5"],
  baseSpring = 0.045,
  baseFriction = 0.88,
  baseThickness = 9,
  offsetFactor = 0.03,
  // Trail length in ms. Must comfortably exceed one frame per segment —
  // 900ms over 52 points is ~17ms each, so a 60Hz frame advances the chain by
  // roughly one segment and the ribbon reads as a continuous flowing trail.
  maxAge = 900,
  pointCount = 52,
  speedMultiplier = 0.55,
  enableFade = true,
  enableShaderEffect = true,
  effectAmplitude = 1.4,
}: RibbonTrailProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (reducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    // Cap DPR at 2. On high-density displays `devicePixelRatio` can be 2.5–3,
    // which quadruples the fragment work for a full-viewport canvas and buys
    // nothing visible on a soft glowing trail.
    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      alpha: true,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    gl.canvas.style.position = "absolute";
    gl.canvas.style.top = "0";
    gl.canvas.style.left = "0";
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    container.appendChild(gl.canvas);

    const scene = new Transform();
    const lines: {
      spring: number;
      friction: number;
      mouseVelocity: Vec3;
      mouseOffset: Vec3;
      points: Vec3[];
      polyline: Polyline;
    }[] = [];

    const vertex = `
      precision highp float;

      attribute vec3 position;
      attribute vec3 next;
      attribute vec3 prev;
      attribute vec2 uv;
      attribute float side;

      uniform vec2 uResolution;
      uniform float uDPR;
      uniform float uThickness;
      uniform float uTime;
      uniform float uEnableShaderEffect;
      uniform float uEffectAmplitude;

      varying vec2 vUV;

      vec4 getPosition() {
          vec4 current = vec4(position, 1.0);
          vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
          vec2 nextScreen = next.xy * aspect;
          vec2 prevScreen = prev.xy * aspect;
          vec2 tangent = normalize(nextScreen - prevScreen);
          vec2 normal = vec2(-tangent.y, tangent.x);
          normal /= aspect;
          normal *= mix(1.0, 0.1, pow(abs(uv.y - 0.5) * 2.0, 2.0));
          float dist = length(nextScreen - prevScreen);
          normal *= smoothstep(0.0, 0.02, dist);
          float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
          float pixelWidth = current.w * pixelWidthRatio;
          normal *= pixelWidth * uThickness;
          current.xy -= normal * side;
          if(uEnableShaderEffect > 0.5) {
            current.xy += normal * sin(uTime + current.x * 10.0) * uEffectAmplitude;
          }
          return current;
      }

      void main() {
          vUV = uv;
          gl_Position = getPosition();
      }
    `;

    const fragment = `
      precision highp float;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uEnableFade;
      varying vec2 vUV;
      void main() {
          float fadeFactor = 1.0;
          if(uEnableFade > 0.5) {
              fadeFactor = 1.0 - smoothstep(0.0, 1.0, vUV.y);
          }
          gl_FragColor = vec4(uColor, uOpacity * fadeFactor);
      }
    `;

    function resize() {
      if (!container) return;
      renderer.setSize(container.clientWidth, container.clientHeight);
      lines.forEach((line) => line.polyline.resize());
    }
    window.addEventListener("resize", resize);

    const center = (colors.length - 1) / 2;
    colors.forEach((color, index) => {
      const spring = baseSpring + (Math.random() - 0.5) * 0.05;
      const friction = baseFriction + (Math.random() - 0.5) * 0.05;
      const thickness = baseThickness + (Math.random() - 0.5) * 3;
      const mouseOffset = new Vec3(
        (index - center) * offsetFactor + (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.1,
        0
      );

      const points: Vec3[] = [];
      for (let i = 0; i < pointCount; i++) points.push(new Vec3());

      const polyline = new Polyline(gl, {
        points,
        vertex,
        fragment,
        uniforms: {
          uColor: { value: new Color(color) },
          uThickness: { value: thickness },
          uOpacity: { value: 1.0 },
          uTime: { value: 0.0 },
          uEnableShaderEffect: { value: enableShaderEffect ? 1.0 : 0.0 },
          uEffectAmplitude: { value: effectAmplitude },
          uEnableFade: { value: enableFade ? 1.0 : 0.0 },
        },
      });
      polyline.mesh.setParent(scene);

      lines.push({ spring, friction, mouseVelocity: new Vec3(), mouseOffset, points, polyline });
    });

    resize();

    const mouse = new Vec3();
    // The pointer's own position, and a separate scroll-induced displacement.
    // Keeping them apart means the decay below can relax the scroll push back to
    // zero without ever dragging the ribbons away from where the cursor is.
    let pointerX = 0;
    let pointerY = 0;
    let scrollPush = 0;

    function updateMouse(e: MouseEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      pointerY = ((e.clientY - rect.top) / container.clientHeight) * -2 + 1;
    }
    window.addEventListener("mousemove", updateMouse, { passive: true });

    // Scroll flow: displace along the scroll direction so the strands stream
    // even when the pointer is still.
    let lastScrollY = window.scrollY;
    function onScroll() {
      const delta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      // Clamped so a fast flick doesn't fling the ribbons off-screen.
      scrollPush += Math.max(-0.4, Math.min(0.4, delta / 240));
      scrollPush = Math.max(-1.2, Math.min(1.2, scrollPush));
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    const tmp = new Vec3();
    let frameId = 0;
    let lastTime = performance.now();

    // A tab restored from the background reports one enormous dt on its first
    // frame. Reset the clock so that frame is treated as a normal one.
    function onVisibility() {
      if (!document.hidden) lastTime = performance.now();
    }
    document.addEventListener("visibilitychange", onVisibility);

    function update() {
      frameId = requestAnimationFrame(update);
      const currentTime = performance.now();
      // Clamped: a single long frame (GC, tab switch, layout spike) must not
      // be allowed to advance the trail arbitrarily far in one step.
      const dt = Math.min(currentTime - lastTime, 32);
      lastTime = currentTime;

      // Decay the scroll push so the ribbons settle back onto the cursor.
      scrollPush *= 0.94;
      mouse.set(pointerX, pointerY + scrollPush, 0);

      lines.forEach((line) => {
        tmp.copy(mouse).add(line.mouseOffset).sub(line.points[0]).multiply(line.spring);
        line.mouseVelocity.add(tmp).multiply(line.friction);
        line.points[0].add(line.mouseVelocity);

        /*
         * Exponential smoothing, NOT a linear `min(1, dt/segmentDelay)`.
         *
         * That linear form is the reason the ribbon used to blink out of
         * existence: it reaches alpha === 1 whenever a frame is longer than
         * `segmentDelay`, and alpha 1 snaps every point exactly onto the one
         * ahead of it, collapsing all 52 points into a single zero-length
         * dot. With a 420ms maxAge over 52 points that threshold sits at
         * ~8ms — under any 60Hz frame — so the trail vanished on every slow
         * frame and flickered back on every fast one.
         *
         * `1 - exp(-k)` approaches 1 asymptotically and never reaches it, so
         * the chain always keeps its spacing, and the trail now looks the
         * same at 60Hz, 120Hz, or mid-stutter.
         */
        const segmentDelay =
          isFinite(maxAge) && maxAge > 0 ? maxAge / (line.points.length - 1) : 0;
        const alpha =
          segmentDelay > 0 ? 1 - Math.exp(-(dt * speedMultiplier) / segmentDelay) : 0.9;

        for (let i = 1; i < line.points.length; i++) {
          line.points[i].lerp(line.points[i - 1], alpha);
        }
        if (line.polyline.mesh.program.uniforms.uTime) {
          line.polyline.mesh.program.uniforms.uTime.value = currentTime * 0.001;
        }
        line.polyline.updateGeometry();
      });

      renderer.render({ scene });
    }
    update();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", updateMouse);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(frameId);
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
      // Removing the canvas node alone doesn't free its GPU context — that
      // only happens on GC, which isn't guaranteed to keep pace with dev-mode
      // remounts (Fast Refresh, React 18 Strict Mode's double-invoke). Chrome
      // caps live WebGL contexts per renderer process at ~16; past that,
      // new contexts silently fail to draw instead of erroring. Explicit
      // release here is what actually frees the slot on every unmount.
      const loseCtx = gl.getExtension("WEBGL_lose_context");
      if (loseCtx) loseCtx.loseContext();
    };
  }, [
    colors,
    baseSpring,
    baseFriction,
    baseThickness,
    offsetFactor,
    maxAge,
    pointCount,
    speedMultiplier,
    enableFade,
    enableShaderEffect,
    effectAmplitude,
    reducedMotion,
  ]);

  return (
    <>
      <div className="page-grid" aria-hidden />
      <div
        ref={containerRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-black"
      />
    </>
  );
}
