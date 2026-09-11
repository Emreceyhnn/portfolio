import React, { useEffect, useRef, useState } from "react";

// FE-AA3 -- Signature Hero: a hand-written GLSL fragment shader rendered
// fullscreen via raw WebGL (no three.js/react-three-fiber -- deliberately
// a separate, lighter-weight path from Background3D.tsx's react-three-fiber
// scene, so a reviewer can see the actual shader math with nothing in
// between). Swapped in as the site's hero background in ExamplePage.tsx.
//
// What it draws: a slow-drifting aurora-style flow field. Three octaves of
// value noise, domain-warped by a second, offset noise sample (that's the
// "flow" part -- see fbm()/warp() below), colored along a custom indigo/
// violet gradient that matches the rest of the site instead of the
// playground's original teal/green palette, with the flow field's warp
// direction nudged toward the cursor and a film-grain dither pass on top
// to kill gradient banding.
//
// Uniforms used (2 of the 3 core ones the brief asks for, plus u_mouse):
//   u_time        seconds since first frame -- drives the noise's 3rd axis
//   u_resolution  canvas size in device pixels -- used to correct aspect
//                 ratio and to scale noise frequency independent of zoom
//   u_mouse       normalized (0..1) cursor position -- leans the flow
//                 field's warp offset gently toward the pointer

const VERTEX_SHADER = /* glsl */ `
  // A fullscreen triangle needs only clip-space positions -- no matrices,
  // no camera, because there's no 3D scene, just a 2D plane covering the
  // viewport that the fragment shader paints every pixel of.
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;

  // -- Hash / value noise --------------------------------------------------
  // A cheap 2D hash (no texture lookups) -- the classic "sin -> huge
  // multiply -> fract" trick. It's not cryptographically anything, it just
  // needs to look patternless at the scale we sample it at.
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Bilinear-interpolated value noise built on top of that hash: sample
  // the hash at the four corners of the cell containing p, smoothstep the
  // fractional part (so the interpolation has zero slope at cell edges --
  // that's what removes the visible grid lines a plain lerp would leave),
  // then blend.
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  // Fractal Brownian motion: stack a few octaves of the noise above at
  // doubling frequency and halving amplitude. Three octaves is enough to
  // read as "organic" without costing much -- this runs per-pixel every
  // frame, so each extra octave is a real, measurable cost on low-end GPUs.
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 3; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  // Domain warp: instead of coloring fbm(p) directly, sample fbm at a
  // position that is itself offset by another fbm sample. This is the one
  // trick that turns "noise" into "flow" -- straight fbm looks like static
  // clouds, warped fbm looks like it's actually moving through itself.
  // The cursor gently nudges the warp offset (see u_mouse below), so the
  // flow visibly leans toward wherever the visitor's pointer is.
  float warp(vec2 p, vec2 mouseInfluence) {
    vec2 q = vec2(
      fbm(p + vec2(0.0, 0.0)),
      fbm(p + vec2(5.2, 1.3))
    );
    vec2 r = vec2(
      fbm(p + 4.0 * q + vec2(1.7, 9.2) + mouseInfluence),
      fbm(p + 4.0 * q + vec2(8.3, 2.8) + mouseInfluence)
    );
    return fbm(p + 4.0 * r);
  }

  void main() {
    // Normalize to 0..1 with the aspect ratio corrected so the flow field
    // isn't stretched on non-square viewports.
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv;
    p.x *= u_resolution.x / u_resolution.y;

    // Slow drift: time only ever adds to the sample position, it never
    // resets or wraps, so the pattern never visibly "loops" or jumps.
    float t = u_time * 0.05;

    // Cursor influence: centered mouse coordinate, small magnitude so it
    // reads as a lean rather than a snap-to-cursor blob.
    vec2 mouseNorm = u_mouse / u_resolution.xy;
    vec2 mouseCentered = (mouseNorm - 0.5) * 0.6;

    float pattern = warp(p * 2.4 + vec2(t, t * 0.6), mouseCentered);

    // Color ramp: three-stop gradient (near-black -> indigo -> violet)
    // matching the site's #020202 / #4338ca / #818cf8 palette instead of
    // the shader playground's original teal. smoothstep gives soft
    // transitions between stops rather than hard bands.
    vec3 colorDeep = vec3(0.02, 0.02, 0.03);
    vec3 colorMid = vec3(0.26, 0.22, 0.79);   // ~#4338ca
    vec3 colorBright = vec3(0.51, 0.55, 0.99); // ~#818cf8

    vec3 color = mix(colorDeep, colorMid, smoothstep(0.15, 0.55, pattern));
    color = mix(color, colorBright, smoothstep(0.55, 0.85, pattern));

    // Vignette: darken the corners so the flow field reads as a hero
    // backdrop (attention pulled toward center/text) rather than an even
    // wash that competes with the overlaid headline everywhere equally.
    float vignette = smoothstep(0.9, 0.25, length(uv - 0.5));
    color *= mix(0.55, 1.0, vignette);

    // Film-grain dither: a tiny per-pixel random offset breaks up banding
    // in the smooth gradient, which is otherwise very visible on this
    // dark a palette (compressed video/JPEG makes banding worse, so this
    // also protects the shared screenshot in the README).
    float grain = (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.03;
    color += grain;

    gl_FragColor = vec4(color, 1.0);
  }
`;

type Status = "loading" | "ready" | "unsupported";

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // Surfaced to the console rather than thrown -- a shader compile
    // failure should fall back to the static gradient, not crash the page.
    console.error("ShaderHero: shader compile error", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export const ShaderHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);

  // Live-updates if the user flips the OS setting mid-session, same
  // pattern as Background3D's use3DQuality hook.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return; // static gradient fallback renders instead, see below
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!gl) {
      setStatus("unsupported");
      return;
    }

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) {
      setStatus("unsupported");
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setStatus("unsupported");
      return;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("ShaderHero: program link error", gl.getProgramInfoLog(program));
      setStatus("unsupported");
      return;
    }
    gl.useProgram(program);

    // Fullscreen triangle (covers the whole clip space in one draw call,
    // cheaper than two triangles / a quad -- the overdraw outside the
    // viewport is clipped for free by the rasterizer).
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const u_resolution = gl.getUniformLocation(program, "u_resolution");
    const u_time = gl.getUniformLocation(program, "u_time");
    const u_mouse = gl.getUniformLocation(program, "u_mouse");

    // Device pixel ratio capped at 1.5 -- shading every physical pixel of
    // a 3x-DPR phone screen for a purely decorative background is wasted
    // GPU work; visually indistinguishable from 1.5x at this blur level.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let mouse = { x: 0, y: 0 };
    let animationFrame = 0;
    let startTime = performance.now();
    let paused = false;

    function resize() {
      if (!canvas || !gl) return;
      const width = Math.floor(window.innerWidth * dpr);
      const height = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    }

    function handleMouseMove(e: MouseEvent) {
      mouse = { x: e.clientX * dpr, y: (window.innerHeight - e.clientY) * dpr };
    }

    // Animation pauses when the tab is hidden -- a background shader has
    // no reason to burn battery/GPU on a backgrounded tab, and resuming
    // just picks the elapsed-time uniform back up rather than jumping.
    function handleVisibility() {
      paused = document.hidden;
      if (!paused) {
        startTime = performance.now() - elapsedAtPause;
        render();
      }
    }

    let elapsedAtPause = 0;

    function render() {
      if (paused || !gl) return;
      const elapsed = (performance.now() - startTime) / 1000;
      elapsedAtPause = elapsed * 1000;

      gl.uniform2f(u_resolution, canvas!.width, canvas!.height);
      gl.uniform1f(u_time, elapsed);
      gl.uniform2f(u_mouse, mouse.x, mouse.y);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animationFrame = requestAnimationFrame(render);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("visibilitychange", handleVisibility);
    render();
    setStatus("ready");

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [reducedMotion]);

  // Reduced-motion / unsupported-WebGL fallback: the same static radial
  // gradient Background3D already uses for its own reduced-motion path,
  // reused here so the two hero treatments degrade identically.
  if (reducedMotion || status === "unsupported") {
    return (
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          background:
            "radial-gradient(circle at 50% 30%, #1e1b4b 0%, #020202 70%)",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        background: "#020202",
      }}
    />
  );
};
