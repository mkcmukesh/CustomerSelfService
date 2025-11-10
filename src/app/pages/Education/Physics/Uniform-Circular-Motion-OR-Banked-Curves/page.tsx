"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Car,
  Gauge,
  Ruler,
  Triangle,
  AlertTriangle,
  Info,
  BookOpen,
  GraduationCap,
  RefreshCcw,
  Share2,
  Compass,
  Target,
  LineChart,
  CheckCircle2,
  HelpCircle,
  Wand2,
} from "lucide-react";

// --------------------------------------------------------------
// Uniform Circular Motion / Banked Curves — Grade 12 Lab
// React + Next.js + TypeScript + Tailwind (dark navy + rose)
// Enhancements: Free‑body vectors overlay, "Design for v" calculator
// (superelevation), and an Instructor Mode with auto‑generated
// practice questions + answer checking.
// --------------------------------------------------------------

type Units = "metric" | "imperial"; // imperial display only (mph/ft)

interface Inputs {
  r: number; // m
  v: number; // m/s
  thetaDeg: number; // bank angle
  mu: number; // coefficient of static friction
  g: number; // m/s^2
  units: Units;
  showVectors: boolean;
}

const DEFAULTS: Inputs = {
  r: 50,
  v: 20, // 72 km/h
  thetaDeg: 10,
  mu: 0.6,
  g: 9.81,
  units: "metric",
  showVectors: true,
};

const toNum = (x: string | number) => (x === "" ? 0 : Number(x)) || 0;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const fmt = (n: number, d = 2) => (Math.round(n * 10 ** d) / 10 ** d).toFixed(d);

function bankCalcs(inp: Inputs) {
  const { r, v, thetaDeg, mu, g } = inp;
  const th = rad(thetaDeg);
  const sin = Math.sin(th), cos = Math.cos(th);

  // Frictionless design angle (given v, r)
  const thetaReq = deg(Math.atan((v * v) / (r * g)));

  // Safe speed range with friction μ:
  // v^2/r = g (sinθ ± μ cosθ) / (cosθ ∓ μ sinθ)
  const denomMax = cos - mu * sin;
  const denomMin = cos + mu * sin;
  const termMax = (sin + mu * cos) / Math.max(1e-9, denomMax);
  const termMin = (sin - mu * cos) / Math.max(1e-9, denomMin);

  const vMax = denomMax > 0 && termMax > 0 ? Math.sqrt(r * g * termMax) : NaN;
  const vMin = denomMin > 0 && termMin > 0 ? Math.sqrt(r * g * termMin) : 0;

  const vFlatMax = Math.sqrt(Math.max(0, inp.mu * g * r));

  let status: "inside" | "too_slow" | "too_fast" = "inside";
  if (!isNaN(vMax) && v > vMax + 1e-9) status = "too_fast";
  if (v < vMin - 1e-9) status = "too_slow";

  // Direction for friction arrow (qualitative):
  // too_fast → points down slope; too_slow → points up slope; inside → tiny either way
  const frictionDir = status === "too_fast" ? -1 : status === "too_slow" ? 1 : 0.25;

  return { thetaReq, vMax, vMin, vFlatMax, status, th, sin, cos, frictionDir };
}

function useLocal<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} }, [key, state]);
  return [state, setState] as const;
}

export default function BankedCurveLab() {
  const [inp, setInp] = useLocal<Inputs>("bank_inputs", DEFAULTS);
  const [mode, setMode] = useLocal<"learn" | "exam">("bank_mode", "learn");
  const out = useMemo(() => bankCalcs(inp), [inp.r, inp.v, inp.thetaDeg, inp.mu, inp.g]);

  // Display units
  const unitSpeed = inp.units === "metric" ? "m/s" : "mph";
  const unitLen = inp.units === "metric" ? "m" : "ft";
  const vDisplay = (mps: number) => (inp.units === "metric" ? mps : mps * 2.23694); // mph
  const rDisplay = (m: number) => (inp.units === "metric" ? m : m * 3.28084);

  // Inputs setters
  const setNum = (k: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) => setInp((p) => ({ ...p, [k]: toNum(e.target.value) }));
  const setSel = (k: keyof Inputs) => (e: React.ChangeEvent<HTMLSelectElement>) => setInp((p) => ({ ...p, [k]: e.target.value as any }));

  // Instructor mode state
  type QType = "theta" | "range";
  const [qType, setQType] = useState<QType>("theta");
  const [q, setQ] = useState<any>(null);
  const [ans, setAns] = useState<{ a?: string; b?: string }>({});
  const [feedback, setFeedback] = useState<string>("");

  const genQuestion = () => {
    if (qType === "theta") {
      // Given r, v → find θ0
      const r = 40 + Math.random() * 80; // 40..120 m
      const v = 12 + Math.random() * 22; // 12..34 m/s
      setQ({ r, v }); setAns({ a: "" }); setFeedback("");
    } else {
      // Given r, θ, μ → find v_min, v_max
      const r = 30 + Math.random() * 90;
      const thetaDeg = 5 + Math.random() * 25;
      const mu = 0.3 + Math.random() * 0.5;
      setQ({ r, thetaDeg, mu }); setAns({ a: "", b: "" }); setFeedback("");
    }
  };

  const checkAnswer = () => {
    if (!q) return;
    if (qType === "theta") {
      const theta = deg(Math.atan((q.v * q.v) / (q.r * inp.g)));
      const user = Number(ans.a);
      const ok = Math.abs(user - theta) <= 0.5;
      setFeedback(ok ? "Correct!" : `Close. θ₀ ≈ ${fmt(theta,1)}°`);
    } else {
      const th = rad(q.thetaDeg);
      const sin = Math.sin(th), cos = Math.cos(th);
      const denomMax = cos - q.mu * sin;
      const denomMin = cos + q.mu * sin;
      const termMax = (sin + q.mu * cos) / Math.max(1e-9, denomMax);
      const termMin = (sin - q.mu * cos) / Math.max(1e-9, denomMin);
      const vMax = denomMax > 0 && termMax > 0 ? Math.sqrt(q.r * inp.g * termMax) : NaN;
      const vMin = denomMin > 0 && termMin > 0 ? Math.sqrt(q.r * inp.g * termMin) : 0;
      const ua = Number(ans.a), ub = Number(ans.b);
      const ok = Math.abs((ua - vMin) / (vMin || 1)) < 0.05 && (isNaN(vMax) ? true : Math.abs((ub - vMax) / vMax) < 0.05);
      setFeedback(ok ? "Correct!" : `Expected v_min≈${fmt(vMin,2)} m/s, v_max≈${isNaN(vMax)?'—':fmt(vMax,2)} m/s`);
    }
  };

  // Simple SVG diagram (side view)
  const W = 720, H = 270; const pad = 24;
  const slopeY = H - 80; const slopeX1 = pad; const slopeX2 = W - pad;
  const rise = Math.tan(out.th) * (slopeX2 - slopeX1);
  const y1 = slopeY, y2 = slopeY - rise;
  const carX = W / 3, carY = y1 - (carX - slopeX1) * Math.tan(out.th) - 12;

  const statusColor = out.status === "inside" ? "#22c55e" : out.status === "too_fast" ? "#f97316" : "#06b6d4";

  // Helper to draw arrow
  const Arrow = ({ x1, y1, x2, y2, color = "#fff" }: any) => (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={3} />
      <polygon points={`${x2},${y2} ${x2 - 5},${y2 - 8} ${x2 + 5},${y2 - 8}`} fill={color} />
    </g>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1220] via-[#0f1a2b] to-[#0b1220] text-slate-200 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-800/60 backdrop-blur-xl shadow-2xl">
          <img src="https://picsum.photos/1200/280?highway" alt="hero" className="w-full h-40 md:h-56 object-cover object-center opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <div className="relative p-6 md:p-8 flex items-center gap-4">
            <motion.div initial={{ rotate: -10 }} animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity }} className="p-3 rounded-xl bg-gradient-to-br from-rose-500/30 to-fuchsia-500/30">
              <Car className="h-7 w-7 text-rose-300" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white inline-flex items-center gap-2">Uniform Circular Motion / Banked Curves</h1>
              <p className="text-slate-300 text-sm">Safe speeds, required angle & free‑body vectors. Includes Instructor Mode.</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => navigator.clipboard.writeText(JSON.stringify(inp))} className="rounded-xl px-3 py-2 border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"><Share2 className="h-4 w-4"/>Copy state</button>
              <button onClick={() => setInp(DEFAULTS)} className="rounded-xl px-3 py-2 border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"><RefreshCcw className="h-4 w-4"/>Reset</button>
            </div>
          </div>
        </div>

        {/* Controls + Diagram */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="rounded-2xl border border-white/10 bg-white/10 p-5 order-last lg:order-first">
            <p className="text-sm text-slate-300 inline-flex items-center gap-2 mb-3"><BookOpen className="h-4 w-4"/>Inputs</p>
            <div className="grid grid-cols-1 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Ruler className="h-4 w-4"/>Radius r ({unitLen})</span>
                <input type="number" value={rDisplay(inp.r)} onChange={(e)=> setInp(p=>({...p, r: inp.units==="metric"? toNum(e.target.value) : toNum(e.target.value)/3.28084 }))} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2"/>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Gauge className="h-4 w-4"/>Speed v ({unitSpeed})</span>
                <input type="range" min={1} max={60} step={0.5} value={vDisplay(inp.v)} onInput={(e)=> setInp(p=>({...p, v: inp.units==="metric"? toNum((e.target as HTMLInputElement).value) : toNum((e.target as HTMLInputElement).value)/2.23694 }))} />
                <input type="number" value={vDisplay(inp.v)} onChange={(e)=> setInp(p=>({...p, v: inp.units==="metric"? toNum(e.target.value) : toNum(e.target.value)/2.23694 }))} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2"/>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Triangle className="h-4 w-4"/>Bank angle θ (°)</span>
                <input type="range" min={0} max={45} step={1} value={inp.thetaDeg} onInput={(e)=> setInp(p=>({...p, thetaDeg: toNum((e.target as HTMLInputElement).value)}))} />
                <input type="number" value={inp.thetaDeg} onChange={setNum("thetaDeg")} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2"/>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Compass className="h-4 w-4"/>Friction μ</span>
                  <input type="number" step={0.05} value={inp.mu} onChange={setNum("mu")} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2"/>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-slate-300 inline-flex items-center gap-2"><LineChart className="h-4 w-4"/>g (m/s²)</span>
                  <input type="number" step={0.01} value={inp.g} onChange={setNum("g")} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2"/>
                </label>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={inp.showVectors} onChange={(e)=> setInp(p=>({...p, showVectors: e.target.checked}))}/><span>Show force vectors</span></label>
                <label className="inline-flex items-center gap-2"><span>Units</span>
                  <select value={inp.units} onChange={setSel("units")} className="rounded-lg bg-slate-900/60 border border-white/20 px-2 py-1">
                    <option value="metric">Metric (m, m/s)</option>
                    <option value="imperial">Imperial (ft, mph)</option>
                  </select>
                </label>
              </div>

              {/* Design for v */}
              <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
                <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2"><Wand2 className="h-4 w-4"/>Design for current v</span><span className="font-semibold">θ₀ = {fmt(out.thetaReq,1)}°</span></div>
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={()=> setInp(p=>({...p, thetaDeg: parseFloat(fmt(out.thetaReq,1))}))} className="rounded-lg px-2 py-1 border border-white/20 bg-white/10 hover:bg-white/15">Set θ = θ₀</button>
                  <span className="text-slate-400">Superelevation e = tanθ = <span className="font-semibold">{fmt(Math.tan(rad(out.thetaReq)),3)}</span> ({fmt(Math.tan(rad(out.thetaReq))*100,1)}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Diagram & KPIs */}
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/10 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-300 inline-flex items-center gap-2"><Target className="h-4 w-4"/>Banked curve diagram</p>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="270" className="rounded-xl bg-slate-900/40 border border-white/10">
              {/* slope */}
              <line x1={slopeX1} y1={y1} x2={slopeX2} y2={y2} stroke="#94a3b8" strokeWidth={4} />
              {/* car */}
              <g transform={`translate(${carX},${carY}) rotate(${-inp.thetaDeg})`}>
                <rect x={-20} y={-10} width={40} height={20} rx={4} fill="#e879f9" opacity={0.9} />
                <circle cx={-12} cy={10} r={6} fill="#0ea5e9" />
                <circle cx={12} cy={10} r={6} fill="#0ea5e9" />
              </g>
              {/* force arrows (qualitative) */}
              {inp.showVectors && (
                <g>
                  {/* weight */}
                  <Arrow x1={carX} y1={carY} x2={carX} y2={carY + 44} color="#f43f5e" />
                  {/* normal (perpendicular to slope) */}
                  <Arrow x1={carX} y1={carY} x2={carX - 44 * Math.sin(out.th)} y2={carY - 44 * Math.cos(out.th)} color="#22c55e" />
                  {/* friction along slope */}
                  <Arrow x1={carX} y1={carY} x2={carX + 44 * Math.cos(out.th) * out.frictionDir} y2={carY - 44 * Math.sin(out.th) * out.frictionDir} color="#f59e0b" />
                </g>
              )}
              {/* status tag */}
              <text x={W - 12} y={22} textAnchor="end" fill={statusColor} style={{ fontWeight: 600 }}>{out.status === 'inside' ? 'Within safe range' : out.status === 'too_fast' ? 'Too fast → skids up' : 'Too slow → skids down'}</text>
            </svg>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3">
                <p className="text-xs text-slate-300">Frictionless required angle</p>
                <p className="text-lg font-semibold">θ₀ = {fmt(out.thetaReq,1)}°</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3">
                <p className="text-xs text-slate-300">Safe speeds (with μ)</p>
                <p className="text-lg font-semibold">{fmt(vDisplay(out.vMin||0),1)} – {isNaN(out.vMax)?'—':fmt(vDisplay(out.vMax),1)} {unitSpeed}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3">
                <p className="text-xs text-slate-300">Flat road limit</p>
                <p className="text-lg font-semibold">≤ {fmt(vDisplay(out.vFlatMax),1)} {unitSpeed}</p>
              </div>
            </div>

            {isNaN(out.vMax) && (
              <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300 inline-flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400"/>
                <p>For the chosen θ and μ, the theoretical expression for v<sub>max</sub> becomes invalid (denominator ≤ 0). Increase θ or reduce μ.</p>
              </div>
            )}
          </div>
        </div>

        {/* Learn vs Exam */}
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
                <p className="font-medium mb-2">Core relations</p>
                <ul className="space-y-2 text-slate-200/90 list-disc list-inside">
                  <li>Frictionless bank: <em>tan θ = v²/(rg)</em> → required angle for given speed and radius.</li>
                  <li>Safe range with friction μ: <em>v²/r = g (sinθ ± μ cosθ)/(cosθ ∓ μ sinθ)</em>.</li>
                  <li>Flat road: <em>v ≤ √(μgr)</em>. Centripetal acceleration: <em>a<sub>c</sub>=v²/r</em>.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/10 p-4">
                <p className="font-medium mb-2">How to reason</p>
                <ul className="space-y-2 text-slate-200/90">
                  <li>Too fast → friction points <strong>down</strong> the slope to help centripetal force.</li>
                  <li>Too slow → friction points <strong>up</strong> the slope to prevent sliding down.</li>
                  <li>At θ=θ₀, friction is not required (ideal design speed).</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/10 p-4 text-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div><p className="text-slate-300">Design angle θ₀</p><p className="font-semibold">{fmt(out.thetaReq,1)}°</p></div>
                <div><p className="text-slate-300">Current status</p><p className="font-semibold" style={{color: statusColor}}>{out.status.replace('_',' ')}</p></div>
                <div><p className="text-slate-300">v<sub>min</sub></p><p className="font-semibold">{fmt(vDisplay(out.vMin||0),1)} {unitSpeed}</p></div>
                <div><p className="text-slate-300">v<sub>max</sub></p><p className="font-semibold">{isNaN(out.vMax)?'—':fmt(vDisplay(out.vMax),1)} {unitSpeed}</p></div>
              </div>
            </div>
          )}
        </div>

        {/* Instructor Mode */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-300 inline-flex items-center gap-2"><HelpCircle className="h-4 w-4"/>Instructor mode – Practice generator</p>
            <div className="flex items-center gap-2 text-xs">
              <select value={qType} onChange={(e)=> setQType(e.target.value as any)} className="rounded-lg bg-slate-900/60 border border-white/20 px-2 py-1">
                <option value="theta">Find θ₀ (frictionless)</option>
                <option value="range">Find safe speed range (θ, μ)</option>
              </select>
              <button onClick={genQuestion} className="rounded-lg px-3 py-1 border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"><Wand2 className="h-4 w-4"/>Generate</button>
            </div>
          </div>

          {q && qType === "theta" && (
            <div className="text-sm">
              <p className="mb-2">Given: r = <strong>{fmt(q.r,1)} m</strong>, v = <strong>{fmt(q.v,2)} m/s</strong>, g = <strong>{fmt(inp.g,2)} m/s²</strong>. Find the frictionless bank angle θ₀ (in degrees).</p>
              <div className="flex items-center gap-2">
                <input value={ans.a||""} onChange={(e)=> setAns({ a: e.target.value })} placeholder="θ₀ (°)" className="rounded-lg bg-slate-900/60 border border-white/20 px-3 py-2"/>
                <button onClick={checkAnswer} className="rounded-lg px-3 py-2 border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/>Check</button>
                {feedback && <span className="text-slate-300">{feedback}</span>}
              </div>
            </div>
          )}

          {q && qType === "range" && (
            <div className="text-sm">
              <p className="mb-2">Given: r = <strong>{fmt(q.r,1)} m</strong>, θ = <strong>{fmt(q.thetaDeg,1)}°</strong>, μ = <strong>{fmt(q.mu,2)}</strong>, g = <strong>{fmt(inp.g,2)} m/s²</strong>. Compute the safe speed range.</p>
              <div className="flex items-center gap-2 flex-wrap">
                <input value={ans.a||""} onChange={(e)=> setAns({ ...ans, a: e.target.value })} placeholder="v_min (m/s)" className="rounded-lg bg-slate-900/60 border border-white/20 px-3 py-2"/>
                <input value={ans.b||""} onChange={(e)=> setAns({ ...ans, b: e.target.value })} placeholder="v_max (m/s)" className="rounded-lg bg-slate-900/60 border border-white/20 px-3 py-2"/>
                <button onClick={checkAnswer} className="rounded-lg px-3 py-2 border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/>Check</button>
                {feedback && <span className="text-slate-300">{feedback}</span>}
              </div>
              <div className="mt-2 text-xs text-slate-400 inline-flex items-center gap-2"><Info className="h-3 w-3"/>Your answers are accepted within ±5%.</div>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 mt-6">This tool is conceptual and uses standard textbook relations for static friction limits and ideal banking. Real roads require safety factors.</p>
      </div>
    </div>
  );
}
