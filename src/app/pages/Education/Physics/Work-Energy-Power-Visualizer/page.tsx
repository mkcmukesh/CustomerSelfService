"use client";

import React, { useEffect, useMemo, useState } from "react";

/**
 * Work–Energy & Power Visualizer
 * Tech: React + Next.js (app router) + Tailwind + TypeScript
 * Theme: matches your “Sample page theme” (gradient bg, card, sections)
 *
 * Scenarios included:
 *  - Free Fall (PE → KE)
 *  - Vertical Lift (Work & avg/inst Power)
 *  - Inclined Plane with Friction (Work vs losses; KE at bottom)
 *
 * Features:
 *  - Inputs on the left, Outputs on the right (mirrors sample layout)
 *  - Inline SVG icons/vectors and schematic drawings
 *  - Tiny smoke tests (console only)
 *  - Picsum images to avoid blank visuals
 */

// ---------------- Constants / Helpers ----------------

const G = 9.81; // m/s^2
type ScenarioKey = "freeFall" | "verticalLift" | "inclineFriction";

const SELECT_SCENARIOS: { key: ScenarioKey; label: string }[] = [
  { key: "freeFall", label: "Free Fall (PE → KE)" },
  { key: "verticalLift", label: "Vertical Lift (Work & Power)" },
  { key: "inclineFriction", label: "Incline with Friction (Work & Losses)" },
];

const DEFAULTS = {
  scenario: "freeFall" as ScenarioKey,
  mass: 10, // kg
  height: 20, // m
  velocity: 0, // m/s (for free fall start; used in incline output)
  liftTime: 5, // s (for vertical lift)
  angleDeg: 25, // degrees (for incline)
  mu: 0.2, // coefficient of kinetic friction
  distance: 15, // m along incline
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function toFixed(n: number, d = 2) {
  if (!isFinite(n)) return "—";
  return n.toFixed(d);
}

function degToRad(d: number) {
  return (d * Math.PI) / 180;
}

// ---------------- Icons (inline SVG) ----------------

const IconBolt = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" fill="currentColor" />
  </svg>
);
const IconWeight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 7a4 4 0 0 1 8 0h2l3 13H3L6 7h2z" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);
const IconMountain = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 20l7-11 4 6 3-4 4 9H3z" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);
const IconTimer = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M9 2h6M12 13l4-2" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const IconChart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 20h16M7 17V9m5 8V6m5 11v-5" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);
const IconRuler = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M6 6v12M10 6v12M14 6v12M18 6v12" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const IconFriction = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 21h18M4 17h6M8 13h12M4 9h10" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const IconInfo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M12 8h.01M11 12h2v6h-2z" fill="currentColor" />
  </svg>
);

// ---------------- Main ----------------

export default function WorkEnergyPowerPage() {
  const [scenario, setScenario] = useState<ScenarioKey>(DEFAULTS.scenario);
  const [mass, setMass] = useState<number>(DEFAULTS.mass);
  const [height, setHeight] = useState<number>(DEFAULTS.height);
  const [liftTime, setLiftTime] = useState<number>(DEFAULTS.liftTime);
  const [angleDeg, setAngleDeg] = useState<number>(DEFAULTS.angleDeg);
  const [mu, setMu] = useState<number>(DEFAULTS.mu);
  const [distance, setDistance] = useState<number>(DEFAULTS.distance);

  // Dev-only smoke tests
  useEffect(() => {
    const tests = [
      { name: "defaults mass>0", pass: mass > 0 },
      { name: "defaults gravity", pass: Math.abs(G - 9.81) < 0.01 },
      { name: "angle in bounds", pass: angleDeg >= 0 && angleDeg <= 60 },
      { name: "mu sane", pass: mu >= 0 && mu <= 1 },
    ];
    // eslint-disable-next-line no-console
    console.debug("[WE&P Visualizer smoke tests]", tests);
  }, [mass, angleDeg, mu]);

  // Physics calculations
  const outputs = useMemo(() => {
    const m = clamp(mass, 0.1, 1e4);
    const h = clamp(height, 0, 1e4);
    const tLift = clamp(liftTime, 0.1, 1e5);
    const theta = degToRad(clamp(angleDeg, 0, 75));
    const muClamped = clamp(mu, 0, 2);
    const s = clamp(distance, 0, 1e5);

    // Shared energies
    const PE = m * G * h; // potential energy (J)
    // Free fall final speed at drop height h: v=sqrt(2gh)
    const vFall = Math.sqrt(Math.max(0, 2 * G * h));
    const KE_fall = 0.5 * m * vFall * vFall;

    // Vertical lift work & power
    const workLift = m * G * h; // ignoring change in KE
    const avgPowerLift = workLift / tLift; // W
    // Instant power if constant speed (v = h/t)
    const vLift = h / tLift;
    const instPowerLift = m * G * vLift; // F*g*m * v

    // Incline with friction
    // Components along plane: m g sinθ down-slope; normal = m g cosθ
    // Work by gravity along plane over distance s: Wg = m g sinθ * s (favors motion)
    // Friction work: Wf = -μ N s = -μ m g cosθ s (opposes)
    const Wg = m * G * Math.sin(theta) * s;
    const Wf = -muClamped * m * G * Math.cos(theta) * s;
    const netWork = Wg + Wf;
    const KE_incline = Math.max(0, netWork); // if starting from rest and no height change aside from plane projection
    const vIncline = Math.sqrt(Math.max(0, (2 * KE_incline) / m));

    return {
      // shared
      m,
      h,
      tLift,
      theta,
      muClamped,
      s,
      // energies/work
      PE,
      vFall,
      KE_fall,
      workLift,
      avgPowerLift,
      instPowerLift,
      Wg,
      Wf,
      netWork,
      KE_incline,
      vIncline,
    };
  }, [mass, height, liftTime, angleDeg, mu, distance]);

  // Energy bars scaling
  const maxEnergyReference = Math.max(
    1,
    outputs.PE,
    outputs.KE_fall,
    outputs.workLift,
    Math.abs(outputs.netWork)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1220] via-[#0f1a2b] to-[#0b1220] text-slate-200 flex items-start justify-center p-10">
      <div className="w-full max-w-6xl rounded-2xl border border-slate-700/60 bg-slate-800/60 backdrop-blur-xl shadow-2xl">
        {/* Header */}
        <header className="px-6 py-5 border-b border-slate-700/60">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">Work–Energy & Power Visualizer</h1>
              <p className="text-sm text-slate-300 mt-1">
                Explore relationships between potential energy, kinetic energy, work, and power across common scenarios.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Badge icon={<IconBolt />} label="No libs" />
              <Badge icon={<IconChart />} label="Live math" />
              <Badge icon={<IconInfo />} label="SI units" />
            </div>
          </div>
        </header>

        {/* Hero visuals */}
        <div className="border-b border-slate-700/60">
          <div className="w-full h-40 md:h-56 relative overflow-hidden rounded-t-2xl">
            <img
              alt="steel energy visual"
              className="w-full h-full object-cover opacity-70"
              src="https://picsum.photos/seed/work-energy-hero/1600/400"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b1220]/70 via-transparent to-[#0b1220]/70" />
          </div>
        </div>

        {/* Content */}
        <main className="p-6 space-y-8">

          {/* Inputs / Outputs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inputs */}
            <section aria-labelledby="input-heading" className="space-y-4">
              <h2 id="input-heading" className="text-base font-medium text-slate-200">Inputs</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Scenario */}
                <Field label="Scenario" icon={<IconChart />}>
                  <select
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value as ScenarioKey)}
                    className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-400/60 focus:border-transparent"
                  >
                    {SELECT_SCENARIOS.map((s) => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </Field>

                {/* Mass */}
                <Field label="Mass (kg)" icon={<IconWeight />}>
                  <InputNumber value={mass} onChange={setMass} min={0.1} step={0.5} />
                </Field>

                {/* Height (used by freeFall + verticalLift) */}
                <Field label="Height (m)" icon={<IconMountain />}>
                  <InputNumber value={height} onChange={setHeight} min={0} step={0.5} />
                </Field>

                {/* Lift time (vertical lift) */}
                <Field label="Lift time (s)" icon={<IconTimer />}>
                  <InputNumber value={liftTime} onChange={setLiftTime} min={0.1} step={0.1} />
                </Field>

                {/* Incline */}
                <Field label="Incline angle (°)" icon={<IconMountain />}>
                  <InputNumber value={angleDeg} onChange={setAngleDeg} min={0} max={75} step={1} />
                </Field>

                {/* Friction */}
                <Field label="Friction μ (0–1)" icon={<IconFriction />}>
                  <InputNumber value={mu} onChange={setMu} min={0} max={1} step={0.05} />
                </Field>

                {/* Distance on incline */}
                <Field label="Distance along plane (m)" icon={<IconRuler />}>
                  <InputNumber value={distance} onChange={setDistance} min={0} step={0.5} />
                </Field>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setScenario(DEFAULTS.scenario);
                    setMass(DEFAULTS.mass);
                    setHeight(DEFAULTS.height);
                    setLiftTime(DEFAULTS.liftTime);
                    setAngleDeg(DEFAULTS.angleDeg);
                    setMu(DEFAULTS.mu);
                    setDistance(DEFAULTS.distance);
                  }}
                  className="rounded-xl bg-gradient-to-r from-rose-700 to-fuchsia-700 text-white px-4 py-2 text-sm shadow hover:opacity-90 transition"
                >
                  Reset
                </button>
              </div>

              {/* Schematic / images */}
              <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4 space-y-3">
                <p className="text-sm text-slate-300">Scenario schematic:</p>
                <ScenarioDrawing scenario={scenario} angleDeg={angleDeg} />
                <div className="grid grid-cols-2 gap-3">
                  <img
                    src="https://picsum.photos/seed/eng-1/600/400"
                    alt="lab 1"
                    className="rounded-lg object-cover h-32 w-full opacity-90"
                  />
                  <img
                    src="https://picsum.photos/seed/eng-2/600/400"
                    alt="lab 2"
                    className="rounded-lg object-cover h-32 w-full opacity-90"
                  />
                </div>
              </div>
            </section>

            {/* Outputs */}
            <section aria-labelledby="output-heading" className="space-y-4">
              <h2 id="output-heading" className="text-base font-medium text-slate-200">Outputs</h2>

              {/* Cards vary by scenario */}
              {scenario === "freeFall" && (
                <div className="space-y-4">
                  <InfoCard
                    title="Potential → Kinetic"
                    icon={<IconBolt />}
                    lines={[
                      ["Initial Potential Energy (mgh)", `${toFixed(outputs.PE)} J`],
                      ["Final Speed (√2gh)", `${toFixed(outputs.vFall)} m/s`],
                      ["Kinetic Energy at impact (½mv²)", `${toFixed(outputs.KE_fall)} J`],
                    ]}
                  />
                  <EnergyBars
                    items={[
                      { label: "PE (mgh)", value: outputs.PE },
                      { label: "KE (½mv²)", value: outputs.KE_fall },
                    ]}
                    max={maxEnergyReference}
                  />
                </div>
              )}

              {scenario === "verticalLift" && (
                <div className="space-y-4">
                  <InfoCard
                    title="Vertical Lift: Work & Power"
                    icon={<IconTimer />}
                    lines={[
                      ["Work to lift (mgh)", `${toFixed(outputs.workLift)} J`],
                      ["Avg Power (W = Work / time)", `${toFixed(outputs.avgPowerLift)} W`],
                      ["Instant Power (m g v)", `${toFixed(outputs.instPowerLift)} W`],
                    ]}
                  />
                  <EnergyBars
                    items={[
                      { label: "Work (mgh)", value: outputs.workLift },
                      { label: "Avg Power (×1s)", value: outputs.avgPowerLift }, // scaled notionally
                    ]}
                    max={maxEnergyReference}
                  />
                </div>
              )}

              {scenario === "inclineFriction" && (
                <div className="space-y-4">
                  <InfoCard
                    title="Inclined Plane with Friction"
                    icon={<IconMountain />}
                    lines={[
                      ["Work by gravity (m g sinθ s)", `${toFixed(outputs.Wg)} J`],
                      ["Work by friction (−μ m g cosθ s)", `${toFixed(outputs.Wf)} J`],
                      ["Net Work", `${toFixed(outputs.netWork)} J`],
                      ["Kinetic Energy gain", `${toFixed(outputs.KE_incline)} J`],
                      ["Final Speed (√(2W/m))", `${toFixed(outputs.vIncline)} m/s`],
                    ]}
                  />
                  <EnergyBars
                    items={[
                      { label: "Wg (down-slope)", value: outputs.Wg },
                      { label: "Wf (loss)", value: Math.abs(outputs.Wf) },
                      { label: "Net Work", value: Math.max(0, outputs.netWork) },
                    ]}
                    max={Math.max(1, Math.abs(outputs.Wg), Math.abs(outputs.Wf), Math.abs(outputs.netWork))}
                  />
                </div>
              )}

              {/* Tips */}
              <div className="rounded-xl border border-slate-700/60 bg-gradient-to-r from-[#3a1f2f]/70 to-[#2a1b2a]/70 p-5">
                <p className="text-sm text-slate-300 flex items-start gap-2">
                  <IconInfo /> <span>
                    This tool uses idealized formulas (no air resistance except friction on the incline). For teaching demos,
                    tweak mass, height, angle, and μ to see how energy bars and speeds respond.
                  </span>
                </p>
              </div>
            </section>
          </div>

          {/* Gallery strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["metals", "eng", "power", "motion"].map((seed) => (
              <img
                key={seed}
                src={`https://picsum.photos/seed/${seed}-strip/400/300`}
                alt={seed}
                className="rounded-lg border border-slate-700/60 object-cover h-28 w-full opacity-90"
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

// ---------------- Reusable UI ----------------

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-slate-300 inline-flex items-center gap-2">
        {icon ? <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-white/10 bg-white/10">{icon}</span> : null}
        {label}
      </span>
      {children}
    </label>
  );
}

function InputNumber({
  value,
  onChange,
  min,
  max,
  step,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step ?? 0.1}
      className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-400/60 focus:border-transparent placeholder:text-slate-500"
    />
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-slate-200">
      {icon}
      {label}
    </span>
  );
}

function InfoCard({
  title,
  icon,
  lines,
}: {
  title: string;
  icon?: React.ReactNode;
  lines: [string, string][];
}) {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-5">
      <div className="flex items-center gap-2 text-slate-200">
        {icon ? <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/10">{icon}</span> : null}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <ul className="mt-3 text-sm list-disc list-outside pl-5 marker:text-slate-500/70">
        {lines.map(([k, v]) => (
          <li key={k} className="flex items-center justify-between gap-3">
            <span className="opacity-85">{k}</span>
            <span className="font-medium text-slate-100">{v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EnergyBars({
  items,
  max,
}: {
  items: { label: string; value: number }[];
  max: number;
}) {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-5">
      <div className="flex items-center gap-2 text-slate-200">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/10">
          <IconBolt />
        </span>
        <h3 className="text-sm font-semibold">Energy / Work Bars</h3>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((it) => {
          const pct = clamp(max > 0 ? (Math.abs(it.value) / max) * 100 : 0, 0, 100);
          const isLoss = it.label.toLowerCase().includes("loss") || it.label.toLowerCase().includes("friction");
          return (
            <div key={it.label}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">{it.label}</span>
                <span className="text-slate-300">{toFixed(it.value)} J</span>
              </div>
              <div className="h-3 w-full rounded-md bg-slate-700/50 overflow-hidden border border-slate-700/60">
                <div
                  className={`h-full ${isLoss ? "bg-rose-500/80" : "bg-cyan-400/80"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScenarioDrawing({ scenario, angleDeg }: { scenario: ScenarioKey; angleDeg: number }) {
  // Simple inline SVG drawings to reinforce concepts
  if (scenario === "freeFall") {
    return (
      <svg viewBox="0 0 320 120" className="w-full h-28">
        <defs>
          <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#1e293b" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="320" height="120" fill="url(#sky)" />
        <rect x="0" y="100" width="320" height="20" fill="#0b1220" />
        <circle cx="60" cy="30" r="8" fill="#38bdf8" />
        <path d="M60 38v50" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
        <text x="72" y="60" fill="#cbd5e1" fontSize="10">h</text>
        <rect x="54" y="88" width="12" height="12" fill="#e11d48" />
        <text x="90" y="112" fill="#cbd5e1" fontSize="10">Ground</text>
      </svg>
    );
  }
  if (scenario === "verticalLift") {
    return (
      <svg viewBox="0 0 320 120" className="w-full h-28">
        <rect x="0" y="0" width="320" height="120" fill="#0f172a" />
        <rect x="150" y="20" width="20" height="80" fill="#334155" />
        <rect x="142" y="60" width="36" height="24" fill="#22d3ee" />
        <path d="M160 60v-30" stroke="#22d3ee" strokeWidth="2" />
        <polygon points="160,25 155,32 165,32" fill="#22d3ee" />
        <text x="180" y="36" fill="#cbd5e1" fontSize="10">Lift height</text>
      </svg>
    );
  }
  // incline
  const theta = clamp(angleDeg, 0, 75);
  const rad = degToRad(theta);
  const planeLen = 240;
  const h = Math.sin(rad) * planeLen;
  return (
    <svg viewBox="0 0 320 120" className="w-full h-28">
      <rect x="0" y="0" width="320" height="120" fill="#0f172a" />
      {/* Inclined plane */}
      <line
        x1="40"
        y1={100}
        x2={40 + planeLen * Math.cos(rad)}
        y2={100 - planeLen * Math.sin(rad)}
        stroke="#334155"
        strokeWidth="8"
      />
      {/* Block */}
      <rect
        x={40 + (planeLen * Math.cos(rad)) / 2 - 14}
        y={100 - (planeLen * Math.sin(rad)) / 2 - 14}
        width="28"
        height="28"
        fill="#22d3ee"
      />
      {/* Angle marker */}
      <path d="M50 100 A20 20 0 0 1 66 86" stroke="#e11d48" strokeWidth="2" fill="none" />
      <text x="70" y="90" fill="#cbd5e1" fontSize="10">{theta}°</text>
      {/* Height indicator */}
      <line x1={40 + planeLen * Math.cos(rad)} y1={100 - planeLen * Math.sin(rad)} x2={40 + planeLen * Math.cos(rad)} y2={100} stroke="#64748b" strokeWidth="2" />
      <text x={40 + planeLen * Math.cos(rad) - 40} y={100 - h / 2} fill="#cbd5e1" fontSize="10">height</text>
    </svg>
  );
}
