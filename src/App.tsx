import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import { extend } from "@react-three/fiber";
import * as THREE from "three";
import { useState, useEffect, useRef } from "react";
import { sounds } from "./data/sounds";
import { useAudio } from "./hooks/useAudio";
import PlayerBar from "./components/PlayerBar";

extend(THREE);

const DEFAULT_INDEX = sounds.findIndex((s) => s.id === 4); // white noise

type GradientColors = { color1: string; color2: string; color3: string };

const GRADIENT_THEMES: Record<number, GradientColors> = {
  1: { color1: "#0055cc", color2: "#88ccff", color3: "#001133" }, // rain — синий
  2: { color1: "#c8724a", color2: "#f5c880", color3: "#2d1205" }, // cafe — тёплый коричневый
  3: { color1: "#1a7a2e", color2: "#80e060", color3: "#061a09" }, // forest — зелёный
  4: { color1: "#d0d8e8", color2: "#ffffff", color3: "#8898b0" }, // white noise — белый/светло-серый
  5: { color1: "#2a0060", color2: "#9090b0", color3: "#05000f" }, // thunder — тёмный пурпур
};

const BASE_GRADIENT_PROPS = {
  animate: "on",
  axesHelper: "on",
  brightness: 1.1,
  cAzimuthAngle: 180,
  cDistance: 3.9,
  cPolarAngle: 115,
  cameraZoom: 1,
  destination: "onCanvas",
  embedMode: "off",
  envPreset: "city",
  format: "gif",
  fov: 45,
  frameRate: 10,
  gizmoHelper: "hide",
  grain: "off",
  lightType: "3d",
  pixelDensity: 1,
  positionX: -0.5,
  positionY: 0.1,
  positionZ: 0,
  range: "disabled",
  rangeEnd: 40,
  rangeStart: 0,
  reflection: 0.1,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 235,
  shader: "defaults",
  type: "waterPlane",
  uAmplitude: 0,
  uDensity: 1.1,
  uFrequency: 5.5,
  uSpeed: 0.1,
  uStrength: 2.4,
  uTime: 0.2,
  wireframe: false,
} as const;

function hexToRgb(hex: string) {
  const m = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")
  );
}

function lerpColor(from: string, to: string, t: number) {
  const f = hexToRgb(from);
  const e = hexToRgb(to);
  return rgbToHex(
    f.r + (e.r - f.r) * t,
    f.g + (e.g - f.g) * t,
    f.b + (e.b - f.b) * t,
  );
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function App() {
  const { isPlaying, currentSound, pause, resume, next, prev, setVolume } =
    useAudio(sounds, DEFAULT_INDEX);

  const initialColors = GRADIENT_THEMES[currentSound.id] ?? GRADIENT_THEMES[4];
  const [animatedColors, setAnimatedColors] =
    useState<GradientColors>(initialColors);
  const currentColorsRef = useRef<GradientColors>(initialColors);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const from = { ...currentColorsRef.current };
    const to = GRADIENT_THEMES[currentSound.id] ?? GRADIENT_THEMES[4];
    const duration = 1800;
    const start = performance.now();

    cancelAnimationFrame(rafRef.current);

    const animate = (now: number) => {
      const t = easeInOut(Math.min((now - start) / duration, 1));
      const colors: GradientColors = {
        color1: lerpColor(from.color1, to.color1, t),
        color2: lerpColor(from.color2, to.color2, t),
        color3: lerpColor(from.color3, to.color3, t),
      };
      currentColorsRef.current = colors;
      setAnimatedColors(colors);
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [currentSound.id]);

  return (
    <div style={{ width: "100%", height: "100dvh" }}>
      <ShaderGradientCanvas style={{ pointerEvents: "none" }}>
        <ShaderGradient {...BASE_GRADIENT_PROPS} {...animatedColors} />
      </ShaderGradientCanvas>

      <PlayerBar
        soundName={currentSound.name}
        isPlaying={isPlaying}
        onPlayPause={isPlaying ? pause : resume}
        onPrev={prev}
        onNext={next}
        onVolume={setVolume}
      />
    </div>
  );
}

export default App;
