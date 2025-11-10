"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Home,
  Battery,
  IndianRupee,
  Gauge,
  Leaf,
  CloudSun,
  Factory,
  Calculator,
  Save,
  Upload,
  RefreshCcw,
  Plus,
  LineChart,
  Percent, ListChecks, CheckCircle2 ,InfoIcon , AlertTriangle, 
  Ruler,
} from "lucide-react";

// --------------------------------------------------------------------
// Solar ROI & Sizing — React + NextJS + TS + Tailwind
// Theme: dark navy gradient with rose/fuchsia accents (matches sample)
// Images: picsum.photos (no blank links)
// --------------------------------------------------------------------

// Types & helpers ------------------------------------------------------
interface Inputs {
  roofAreaM2: number; // usable area
  panelWatt: number; // Wp per panel
  panelAreaM2: number; // m2 per panel
  performanceRatio: number; // 0..1
  sunHours: number; // avg equivalent full sun hours per day
  tariff: number; // ₹/kWh
  systemCostPerKW: number; // ₹/kW (capex)
  subsidyPercent: number; // 0..100
  oAndMPercent: number; // % of capex / year
  degradationPercent: number; // % per year
}

const toNum = (v: string | number) => (v === "" ? 0 : Number(v)) || 0;
const INR = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const fix = (n: number, d = 2) => (Math.round(n * 10 ** d) / 10 ** d).toFixed(d);
const uid = () => Math.random().toString(36).slice(2, 9);

function useLocal<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} }, [key, state]);
  return [state, setState] as const;
}

// SVG sparkline for payback / savings trajectory ----------------------
function Spark({ points, width = 220, height = 56 }: { points: number[]; width?: number; height?: number }) {
  if (!points?.length) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const step = width / Math.max(1, points.length - 1);
  const d = points.map((p, i) => ` ${i === 0 ? "M" : "L"}${i * step},${height - ((p - min) / span) * height}`).join("");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="opacity-90">
      <defs>
        <linearGradient id="sg" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#a21caf" />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke="url(#sg)" strokeWidth={2.5} />
    </svg>
  );
}

// Core calc ------------------------------------------------------------
function compute(inputs: Inputs) {
  const {
    roofAreaM2,
    panelWatt,
    panelAreaM2,
    performanceRatio,
    sunHours,
    tariff,
    systemCostPerKW,
    subsidyPercent,
    oAndMPercent,
    degradationPercent,
  } = inputs;

  // Fit panels by area, then size (kW)
  const panelsFit = Math.floor(roofAreaM2 / Math.max(panelAreaM2, 0.01));
  const systemKW = (panelsFit * panelWatt) / 1000; // kWp

  // Production
  const kwhPerDay = systemKW * sunHours * performanceRatio;
  const kwhPerMonth = kwhPerDay * 30; // approx
  const kwhPerYear = kwhPerDay * 365;

  // Costs
  const capex = systemKW * systemCostPerKW;
  const subsidy = (subsidyPercent / 100) * capex;
  const netCapex = Math.max(0, capex - subsidy);
  const oAndM = (oAndMPercent / 100) * capex; // annual

  // Savings trajectory with degradation
  const years = 25;
  const yearly: { year: number; kwh: number; savings: number; cashflow: number; cum: number }[] = [];
  let cum = -netCapex; // upfront spend at year 0
  for (let y = 1; y <= years; y++) {
    const kwh = kwhPerYear * (1 - degradationPercent / 100) ** (y - 1);
    const savings = kwh * tariff - oAndM;
    cum += savings;
    yearly.push({ year: y, kwh, savings, cashflow: savings, cum });
  }
  const paybackYear = yearly.find((y) => y.cum >= 0)?.year ?? null;
  const simpleROI = paybackYear ? (100 * yearly[paybackYear - 1].cum) / netCapex : (100 * yearly[yearly.length - 1].cum) / netCapex;

  return {
    panelsFit,
    systemKW,
    kwhPerDay,
    kwhPerMonth,
    kwhPerYear,
    capex,
    subsidy,
    netCapex,
    oAndM,
    yearly,
    paybackYear,
    simpleROI,
  };
}

// Defaults -------------------------------------------------------------
const DEFAULTS: Inputs = {
  roofAreaM2: 60,
  panelWatt: 540,
  panelAreaM2: 2.2,
  performanceRatio: 0.8,
  sunHours: 5.5,
  tariff: 9.0,
  systemCostPerKW: 55000,
  subsidyPercent: 20,
  oAndMPercent: 1.5,
  degradationPercent: 0.7,
};

export default function SolarRoiSizing() {
  const [inp, setInp] = useLocal<Inputs>("solar_inputs", DEFAULTS);
  const [imgSeeds] = useState(["roof", "panels", "meter", "battery"]);

  const out = useMemo(() => compute(inp), [inp]);
  const trend = out.yearly.map((y) => y.cum);

  const on = (k: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) => setInp((p) => ({ ...p, [k]: toNum(e.target.value) }));

  const exportCSV = () => {
    const header = "year,kwh,savings,cumulative";
    const rows = out.yearly.map((y) => [y.year, fix(y.kwh, 0), fix(y.savings, 0), fix(y.cum, 0)].join(","));
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "solar-roi.csv"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 500);
  };
  const reset = () => setInp(DEFAULTS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1220] via-[#0f1a2b] to-[#0b1220] text-slate-200 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-800/60 backdrop-blur-xl shadow-2xl">
          <img src={`https://picsum.photos/1200/280?${imgSeeds[0]}`} alt="hero" className="w-full h-40 md:h-56 object-cover object-center opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <div className="relative p-6 md:p-8 flex items-center gap-4">
            <motion.div initial={{ rotate: -10 }} animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity }} className="p-3 rounded-xl bg-gradient-to-br from-rose-500/30 to-fuchsia-500/30">
              <Sun className="h-7 w-7 text-rose-300" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white inline-flex items-center gap-2">
                Solar ROI & Sizing
              </h1>
              <p className="text-slate-300 text-sm">Estimate system size, production, payback and savings based on your roof & tariff.</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={exportCSV} className="rounded-xl px-3 py-2 border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"><Save className="h-4 w-4"/>Export</button>
              <button onClick={reset} className="rounded-xl px-3 py-2 border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"><RefreshCcw className="h-4 w-4"/>Reset</button>
            </div>
          </div>
        </div>

        {/* Highlights & Assumptions (bullet points with icons) */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
            <p className="text-sm text-slate-300 inline-flex items-center gap-2"><ListChecks className="h-4 w-4"/>Key highlights</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400"/><span>Estimated <span className="font-semibold">{fix(out.systemKW,2)} kWp</span> system with <span className="font-semibold">{out.panelsFit}</span> panels.</span></li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400"/><span>Generates about <span className="font-semibold">{fix(out.kwhPerMonth,0)} kWh/month</span> at current inputs.</span></li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400"/><span>Net upfront cost <span className="font-semibold">{INR(out.netCapex)}</span> after subsidy.</span></li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400"/><span>Projected payback <span className="font-semibold">{out.paybackYear ? `${out.paybackYear} years` : "> 25 years"}</span>.</span></li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
            <p className="text-sm text-slate-300 inline-flex items-center gap-2"><InfoIcon className="h-4 w-4"/>Assumptions</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-amber-400"/><span>Production = kWp × sun‑hours × Performance Ratio (currently {fix(inp.performanceRatio,2)}).</span></li>
              <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-amber-400"/><span>Annual O&M assumed {fix(inp.oAndMPercent,1)}% of gross capex.</span></li>
              <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-amber-400"/><span>Module degradation {fix(inp.degradationPercent,1)}%/yr compounded.</span></li>
              <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-amber-400"/><span>Tariff benefits calculated at ₹{fix(inp.tariff,2)}/kWh; adjust to your DISCOM rate.</span></li>
            </ul>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-sm text-slate-300 inline-flex items-center gap-2"><Ruler className="h-4 w-4"/>Panels fit</p>
            <p className="text-2xl font-semibold">{out.panelsFit}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-sm text-slate-300 inline-flex items-center gap-2"><Home className="h-4 w-4"/>System size</p>
            <p className="text-2xl font-semibold">{fix(out.systemKW, 2)} kWp</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-sm text-slate-300 inline-flex items-center gap-2"><CloudSun className="h-4 w-4"/>Energy / month</p>
            <p className="text-2xl font-semibold">{fix(out.kwhPerMonth, 0)} kWh</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-sm text-slate-300 inline-flex items-center gap-2"><IndianRupee className="h-4 w-4"/>Capex (net)</p>
            <p className="text-2xl font-semibold">{INR(out.netCapex)}</p>
          </div>
        </div>

        {/* Trend & KPIs */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-pink-950/30 to-rose-950/20 p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="col-span-2">
              <p className="text-sm text-slate-300 inline-flex items-center gap-2"><LineChart className="h-4 w-4"/>Cumulative savings (₹) over years</p>
              <Spark points={trend} />
            </div>
            <div className="rounded-xl border border-white/10 bg-white/10 p-4">
              <p className="text-sm text-slate-300 inline-flex items-center gap-2"><Gauge className="h-4 w-4"/>Payback</p>
              <p className="text-2xl font-semibold">{out.paybackYear ? `${out.paybackYear} years` : "> 25 years"}</p>
              <p className="text-sm text-slate-400">Simple ROI: {fix(out.simpleROI, 1)}%</p>
            </div>
          </div>
        </div>

        {/* Inputs + Table */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs */}
          <div className="rounded-2xl border border-white/10 bg-white/10 p-5 order-last lg:order-first">
            <p className="text-sm text-slate-300 mb-3 inline-flex items-center gap-2"><Calculator className="h-4 w-4"/>Inputs</p>
            <div className="grid grid-cols-1 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Home className="h-4 w-4"/>Usable roof area (m²)</span>
                <input type="number" value={inp.roofAreaM2} onChange={on("roofAreaM2")} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-400/60"/>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Sun className="h-4 w-4"/>Panel watt (Wp)</span>
                  <input type="number" value={inp.panelWatt} onChange={on("panelWatt")} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-400/60"/>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Ruler className="h-4 w-4"/>Panel area (m²)</span>
                  <input type="number" step="0.1" value={inp.panelAreaM2} onChange={on("panelAreaM2")} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-400/60"/>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-slate-300 inline-flex items-center gap-2"><CloudSun className="h-4 w-4"/>Sun hours/day</span>
                  <input type="number" step="0.1" value={inp.sunHours} onChange={on("sunHours")} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-400/60"/>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Percent className="h-4 w-4"/>Performance ratio</span>
                  <input type="number" step="0.01" value={inp.performanceRatio} onChange={on("performanceRatio")} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-400/60"/>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-slate-300 inline-flex items-center gap-2"><IndianRupee className="h-4 w-4"/>Tariff (₹/kWh)</span>
                  <input type="number" step="0.1" value={inp.tariff} onChange={on("tariff")} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-400/60"/>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Factory className="h-4 w-4"/>System cost (₹/kW)</span>
                  <input type="number" value={inp.systemCostPerKW} onChange={on("systemCostPerKW")} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-400/60"/>
                </label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Percent className="h-4 w-4"/>Subsidy %</span>
                  <input type="number" step="0.1" value={inp.subsidyPercent} onChange={on("subsidyPercent")} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-400/60"/>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Percent className="h-4 w-4"/>O&M %/yr</span>
                  <input type="number" step="0.1" value={inp.oAndMPercent} onChange={on("oAndMPercent")} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-400/60"/>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Percent className="h-4 w-4"/>Degradation %/yr</span>
                  <input type="number" step="0.1" value={inp.degradationPercent} onChange={on("degradationPercent")} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-400/60"/>
                </label>
              </div>
            </div>
          </div>

          {/* Results table */}
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/10 p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <img src={`https://picsum.photos/seed/${imgSeeds[1]}/400/240`} alt="panels" className="rounded-xl object-cover w-full h-24 opacity-80 border border-white/10 col-span-2" />
              <img src={`https://picsum.photos/seed/${imgSeeds[2]}/400/240`} alt="meter" className="rounded-xl object-cover w-full h-24 opacity-80 border border-white/10" />
              <img src={`https://picsum.photos/seed/${imgSeeds[3]}/400/240`} alt="battery" className="rounded-xl object-cover w-full h-24 opacity-80 border border-white/10" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-slate-300/90">
                  <tr className="text-left">
                    <th className="py-2 pr-2 font-medium">Metric</th>
                    <th className="py-2 pr-2 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/10"><td className="py-2 pr-2">System size</td><td className="py-2 pr-2">{fix(out.systemKW,2)} kWp ({out.panelsFit} panels)</td></tr>
                  <tr className="border-t border-white/10"><td className="py-2 pr-2">Production / day</td><td className="py-2 pr-2">{fix(out.kwhPerDay,0)} kWh</td></tr>
                  <tr className="border-t border-white/10"><td className="py-2 pr-2">Production / month</td><td className="py-2 pr-2">{fix(out.kwhPerMonth,0)} kWh</td></tr>
                  <tr className="border-t border-white/10"><td className="py-2 pr-2">Production / year</td><td className="py-2 pr-2">{fix(out.kwhPerYear,0)} kWh</td></tr>
                  <tr className="border-t border-white/10"><td className="py-2 pr-2">Capex (gross)</td><td className="py-2 pr-2">{INR(out.capex)}</td></tr>
                  <tr className="border-t border-white/10"><td className="py-2 pr-2">Subsidy</td><td className="py-2 pr-2">{INR(out.subsidy)}</td></tr>
                  <tr className="border-t border-white/10"><td className="py-2 pr-2">Capex (net)</td><td className="py-2 pr-2">{INR(out.netCapex)}</td></tr>
                  <tr className="border-t border-white/10"><td className="py-2 pr-2">O&M / year</td><td className="py-2 pr-2">{INR(out.oAndM)}</td></tr>
                  <tr className="border-t border-white/10"><td className="py-2 pr-2">Payback</td><td className="py-2 pr-2">{out.paybackYear ? `${out.paybackYear} years` : "> 25 years"}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sustainability band */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 inline-flex items-center gap-3"><Leaf className="h-6 w-6 text-emerald-400"/><div><p className="text-sm text-slate-300">CO₂ avoided (est.)</p><p className="text-xl font-semibold">{fix(out.kwhPerYear * 0.82, 0)} kg/yr</p></div></div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 inline-flex items-center gap-3"><Battery className="h-6 w-6 text-yellow-300"/><div><p className="text-sm text-slate-300">Daily energy</p><p className="text-xl font-semibold">{fix(out.kwhPerDay,0)} kWh</p></div></div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 inline-flex items-center gap-3"><IndianRupee className="h-6 w-6 text-rose-300"/><div><p className="text-sm text-slate-300">Savings first year</p><p className="text-xl font-semibold">{INR(out.kwhPerYear * inp.tariff - out.oAndM)}</p></div></div>
        </div>

        <p className="text-xs text-slate-400 mt-6">Assumptions: production = kWp × sun‑hours × PR; O&M = % of gross capex; degradation is compounded annually; CO₂ factor assumed 0.82 kg/kWh. Adjust fields as per your region/policy.</p>
      </div>
    </div>
  );
}
