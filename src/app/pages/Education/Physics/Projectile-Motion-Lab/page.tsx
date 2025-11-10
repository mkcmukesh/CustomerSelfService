"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Ruler,
  Clock,
  ArrowUp,
  Gauge,
  BookOpen,
  GraduationCap,
  RefreshCcw,
  Share2,
  Wind,
  Target,
  Info,
} from "lucide-react";

// -------------------------------------------------------------
// Projectile Motion Lab (Grade 12) — React + NextJS + TS + Tailwind
// Theme: dark navy gradient, rose/fuchsia accents.
// FIX: Sliders now update the trajectory immediately. We avoid
//      ambiguous type-casting by using explicit setters for numbers,
//      booleans and selects, and recompute the path from primitive
//      dependencies. We also use onInput for smooth slider updates.
// -------------------------------------------------------------

type Units = "metric" | "imperial";

interface Inputs {
  speed: number; // m/s
  angleDeg: number; // deg
  height: number; // m
  g: number; // m/s^2
  dragOn: boolean; // qualitative reduction (teaching only)
  units: Units;
}

const DEFAULTS: Inputs = {
  speed: 25,
  angleDeg: 45,
  height: 0,
  g: 9.81,
  dragOn: false,
  units: "metric",
};

const toNum = (v: string | number) => (v === "" ? 0 : Number(v)) || 0;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const fmt = (n: number, d = 2) => (Math.round(n * 10 ** d) / 10 ** d).toFixed(d);

function kinematics({ speed: u, angleDeg, height: y0, g, dragOn }: Inputs) {
  const th = rad(angleDeg);
  const ux = u * Math.cos(th);
  const uy = u * Math.sin(th);

  // y(t) = y0 + uy t - 0.5 g t^2; solve for t when y = 0
  const disc = uy * uy + 2 * g * y0;
  const tof = (uy + Math.sqrt(Math.max(0, disc))) / g; // positive root
  const range = ux * tof;
  const hmax = y0 + (uy * uy) / (2 * g);
  const tHmax = uy / g;
  const vImpactY = uy - g * tof;
  const impactSpeed = Math.sqrt(ux * ux + vImpactY * vImpactY);
  const impactAngleDeg = deg(Math.atan2(vImpactY, ux));

  const dragFactor = dragOn ? 0.85 : 1; // conceptual only

  return {
    ux,
    uy,
    tof: tof * dragFactor,
    range: range * dragFactor,
    hmax,
    tHmax,
    impactSpeed: impactSpeed * dragFactor,
    impactAngleDeg,
  };
}

function buildPath(inp: Inputs, stats: ReturnType<typeof kinematics>) {
  const th = rad(inp.angleDeg);
  const ux = inp.speed * Math.cos(th);
  const uy = inp.speed * Math.sin(th);
  const steps = 100;
  const pts: { x: number; y: number }[] = [];
  const tEnd = Math.max(0.001, stats.tof);
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * tEnd;
    let x = ux * t;
    let y = inp.height + uy * t - 0.5 * inp.g * t * t;
    if (inp.dragOn) {
      const scale = 1 - 0.15 * (t / tEnd);
      x *= scale; y *= scale;
    }
    if (y < 0) y = 0;
    pts.push({ x, y });
  }
  return pts;
}

function useLocal<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} }, [key, state]);
  return [state, setState] as const;
}

export default function ProjectileMotionLab() {
  const [inp, setInp] = useLocal<Inputs>("proj_inputs", DEFAULTS);
  const [mode, setMode] = useLocal<"learn" | "exam">("proj_mode", "learn");

  // Explicit setters (prevents stale or stringy state)
  const setNum = (k: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) => setInp((p) => ({ ...p, [k]: toNum(e.target.value) }));
  const setNumByInput = (k: keyof Inputs) => (e: React.FormEvent<HTMLInputElement>) => setInp((p) => ({ ...p, [k]: toNum((e.target as HTMLInputElement).value) })); // for onInput of range
  const setBool = (k: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) => setInp((p) => ({ ...p, [k]: e.target.checked as any }));
  const setSel = (k: keyof Inputs) => (e: React.ChangeEvent<HTMLSelectElement>) => setInp((p) => ({ ...p, [k]: e.target.value as any }));

  const stats = useMemo(() => kinematics(inp), [inp.speed, inp.angleDeg, inp.height, inp.g, inp.dragOn]);
  const path = useMemo(() => buildPath(inp, stats), [inp.speed, inp.angleDeg, inp.height, inp.g, inp.dragOn, stats.tof]);

  // Units (visual only)
  const unitL = inp.units === "metric" ? "m" : "ft";
  const unitV = inp.units === "metric" ? "m/s" : "ft/s";
  const scaleL = inp.units === "metric" ? 1 : 3.28084;
  const scaleV = scaleL;

  // Smoke test
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.debug("[Projectile] state", inp);
  }, [inp]);

  // SVG mapping
  const W = 720, H = 300, pad = 24;
  const maxX = Math.max(10, ...path.map((p) => p.x)) * 1.1;
  const maxY = Math.max(10, ...path.map((p) => p.y)) * 1.2;
  const toSvg = (p: { x: number; y: number }) => {
    const x = pad + (p.x / maxX) * (W - 2 * pad);
    const y = H - pad - (p.y / maxY) * (H - 2 * pad);
    return `${x},${y}`;
  };
  const d = path.map((p, i) => `${i === 0 ? "M" : "L"}${toSvg(p)}`).join(" ");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1220] via-[#0f1a2b] to-[#0b1220] text-slate-200 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-800/60 backdrop-blur-xl shadow-2xl">
          <img src="https://picsum.photos/1200/280?rocket" alt="hero" className="w-full h-40 md:h-56 object-cover object-center opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <div className="relative p-6 md:p-8 flex items-center gap-4">
            <motion.div initial={{ rotate: -10 }} animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity }} className="p-3 rounded-xl bg-gradient-to-br from-rose-500/30 to-fuchsia-500/30">
              <Rocket className="h-7 w-7 text-rose-300" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white inline-flex items-center gap-2">Projectile Motion Lab</h1>
              <p className="text-slate-300 text-sm">Move the sliders — the trajectory and numbers update instantly.</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => navigator.clipboard.writeText(JSON.stringify(inp))} className="rounded-xl px-3 py-2 border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"><Share2 className="h-4 w-4"/>Copy state</button>
              <button onClick={() => setInp(DEFAULTS)} className="rounded-xl px-3 py-2 border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"><RefreshCcw className="h-4 w-4"/>Reset</button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-5 order-last lg:order-first">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-300 inline-flex items-center gap-2"><BookOpen className="h-4 w-4"/>Controls</p>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-300 flex items-center gap-2">
                  <input type="checkbox" checked={inp.dragOn} onChange={setBool("dragOn")} />
                  <span className="inline-flex items-center gap-1"><Wind className="h-3 w-3"/>Air drag</span>
                </label>
                <select value={inp.units} onChange={setSel("units")} className="rounded-lg bg-slate-900/60 border border-white/20 px-2 py-1 text-xs">
                  <option value="metric">Metric (m, m/s)</option>
                  <option value="imperial">Imperial (ft, ft/s)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Gauge className="h-4 w-4"/>Speed (m/s): <strong>{fmt(inp.speed)}</strong></span>
                <input type="range" min={1} max={80} step={0.5} value={inp.speed} onInput={setNumByInput("speed")} />
                <input type="number" className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2" value={inp.speed} onChange={setNum("speed")} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-slate-300 inline-flex items-center gap-2"><ArrowUp className="h-4 w-4"/>Angle (°): <strong>{fmt(inp.angleDeg,0)}</strong></span>
                <input type="range" min={0} max={89} step={1} value={inp.angleDeg} onInput={setNumByInput("angleDeg")} />
                <input type="number" className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2" value={inp.angleDeg} onChange={setNum("angleDeg")} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Ruler className="h-4 w-4"/>Launch height (m)</span>
                  <input type="number" className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2" value={inp.height} onChange={setNum("height")} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Clock className="h-4 w-4"/>g (m/s²)</span>
                  <input type="number" step={0.01} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2" value={inp.g} onChange={setNum("g")} />
                </label>
              </div>
            </div>
          </div>

          {/* Plot & quick KPIs */}
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/10 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-300 inline-flex items-center gap-2"><Target className="h-4 w-4"/>Trajectory</p>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="300" className="rounded-xl bg-slate-900/40 border border-white/10">
              <defs>
                <linearGradient id="gline" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#a21caf" />
                </linearGradient>
              </defs>
              <line x1={24} y1={H-24} x2={W-24} y2={H-24} stroke="#475569" strokeDasharray="4 4" />
              <path d={d} fill="none" stroke="url(#gline)" strokeWidth={3} />
            </svg>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3"><p className="text-xs text-slate-300">Time of flight</p><p className="text-lg font-semibold">{fmt(stats.tof)} s</p></div>
              <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3"><p className="text-xs text-slate-300">Range</p><p className="text-lg font-semibold">{fmt(stats.range*scaleL)} {unitL}</p></div>
              <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3"><p className="text-xs text-slate-300">Max height</p><p className="text-lg font-semibold">{fmt(stats.hmax*scaleL)} {unitL}</p></div>
              <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3"><p className="text-xs text-slate-300">Impact speed</p><p className="text-lg font-semibold">{fmt(stats.impactSpeed*scaleV)} {unitV}</p></div>
            </div>
          </div>
        </div>

        {/* Learn/Exam */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-pink-950/30 to-rose-950/20 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-300 inline-flex items-center gap-2"><GraduationCap className="h-4 w-4"/>Learn mode</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setMode("learn")} className={`rounded-lg px-3 py-1 text-sm border ${mode==="learn"?"bg-white/20":"bg-white/10"}`}>Learn</button>
              <button onClick={() => setMode("exam")} className={`rounded-lg px-3 py-1 text-sm border ${mode==="exam"?"bg-white/20":"bg-white/10"}`}>Exam</button>
            </div>
          </div>

          {mode === "learn" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl border border-white/10 bg-white/10 p-4">
                <p className="font-medium mb-2">Step-by-step derivations</p>
                <ol className="list-decimal list-inside space-y-2 text-slate-200/90">
                  <li>Resolve <strong>u</strong> into components: <em>u<sub>x</sub>=u cosθ</em>, <em>u<sub>y</sub>=u sinθ</em>.</li>
                  <li>Vertical motion: <em>y(t)=y<sub>0</sub>+u<sub>y</sub>t−½gt²</em>. Time of flight: <em>t=(u<sub>y</sub>+√(u<sub>y</sub>²+2gy<sub>0</sub>))/g</em>.</li>
                  <li>Range: <em>R=u<sub>x</sub>·t</em>. Max height: <em>H=y<sub>0</sub>+u<sub>y</sub>²/(2g)</em>.</li>
                  <li>Impact: <em>v<sub>y</sub>=u<sub>y</sub>−gt</em>, speed <em>v=√(u<sub>x</sub>²+v<sub>y</sub>²)</em>.</li>
                </ol>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/10 p-4">
                <p className="font-medium mb-2">Quick insights</p>
                <ul className="space-y-2 text-slate-200/90">
                  <li>Higher launch height increases time aloft and range.</li>
                  <li>With no height and no drag, max range occurs near 45°.</li>
                  <li>Air drag reduces range; our toggle is conceptual only.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/10 p-4 text-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div><p className="text-slate-300">u<sub>x</sub>, u<sub>y</sub></p><p className="font-semibold">{fmt(stats.ux*scaleV)} {unitV}, {fmt(stats.uy*scaleV)} {unitV}</p></div>
                <div><p className="text-slate-300">t<sub>Hmax</sub></p><p className="font-semibold">{fmt(stats.tHmax)} s</p></div>
                <div><p className="text-slate-300">Impact angle</p><p className="font-semibold">{fmt(stats.impactAngleDeg)}°</p></div>
                <div><p className="text-slate-300">Range</p><p className="font-semibold">{fmt(stats.range*scaleL)} {unitL}</p></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
