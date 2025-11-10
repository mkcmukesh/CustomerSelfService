"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CarFront,
  Fuel,
  Gauge,
  IndianRupee,
  Calendar,
  Plus,
  Trash2,
  Save,
  Upload,
  MapPin,
  LineChart,
  RefreshCcw,
  Percent,
  Info,
  Tag,
} from "lucide-react";

// ------------------------------------------------------------
// Fuel Economy & Cost Tracker — React + NextJS + TS + Tailwind
// Theme: same dark gradient + rose/fuchsia accents as the sample page
// Images: picsum.photos to keep UI vivid without broken links
// ------------------------------------------------------------

// Types
interface FillUp {
  id: string;
  date: string; // ISO date
  odometer: number; // km
  liters: number; // L
  pricePerL: number; // ₹/L
  station?: string;
  note?: string;
  fullTank: boolean; // whether this is a full tank fill
}

// Helpers
const uid = () => Math.random().toString(36).slice(2, 9);
const toNum = (v: string | number) => (v === "" ? 0 : Number(v)) || 0;
const inr = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);
const num = (n: number, d = 2) => (Math.round(n * 10 ** d) / 10 ** d).toFixed(d);

function useLocal<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);
  return [state, setState] as const;
}

// Demo data to get started
const DEMO: FillUp[] = [
  { id: uid(), date: new Date().toISOString().slice(0, 10), odometer: 45215, liters: 34.5, pricePerL: 104.2, station: "IOCL", note: "City runs", fullTank: true },
  { id: uid(), date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString().slice(0, 10), odometer: 44800, liters: 30.2, pricePerL: 103.9, station: "HPCL", note: "Highway", fullTank: true },
  { id: uid(), date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16).toISOString().slice(0, 10), odometer: 44340, liters: 32.8, pricePerL: 103.5, station: "BPCL", note: "Mixed", fullTank: true },
];

// Compute per-tank metrics using full-to-full method
function computeStats(rows: FillUp[]) {
  const sorted = [...rows].sort((a, b) => a.odometer - b.odometer);
  type RowStat = FillUp & { km?: number; kmPerL?: number; totalCost: number };
  const out: RowStat[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const cur = sorted[i];
    const prev = sorted[i - 1];
    const totalCost = cur.liters * cur.pricePerL;
    let km: number | undefined;
    let kmPerL: number | undefined;
    if (cur.fullTank && prev) {
      km = cur.odometer - prev.odometer;
      const litersUsed = cur.liters; // assumes previous tank consumed fully until this full fill
      if (litersUsed > 0 && km > 0) kmPerL = km / litersUsed;
    }
    out.push({ ...cur, km, kmPerL, totalCost });
  }

  const valid = out.filter((r) => r.kmPerL && isFinite(r.kmPerL)) as Required<RowStat>[];
  const avgKmPerL = valid.length ? valid.reduce((a, r) => a + r.kmPerL, 0) / valid.length : 0;
  const totalLiters = rows.reduce((a, r) => a + r.liters, 0);
  const totalCost = rows.reduce((a, r) => a + r.liters * r.pricePerL, 0);
  const distance = valid.reduce((a, r) => a + r.km, 0);
  const costPerKm = distance > 0 ? totalCost / distance : 0;

  return { rows: out, avgKmPerL, totalLiters, totalCost, distance, costPerKm };
}

// Sparkline SVG (no external charts)
function Spark({ points, width = 160, height = 40 }: { points: number[]; width?: number; height?: number }) {
  if (!points.length) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const step = width / Math.max(1, points.length - 1);
  const d = points
    .map((p, i) => {
      const x = i * step;
      const y = height - ((p - min) / span) * height;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="opacity-80">
      <path d={d} fill="none" stroke="url(#g)" strokeWidth={2} />
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#a21caf" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function FuelEconomyTracker() {
  const [fillups, setFillups] = useLocal<FillUp[]>("fuel_fillups", DEMO);

  const [draft, setDraft] = useState<FillUp>({
    id: uid(),
    date: new Date().toISOString().slice(0, 10),
    odometer: 0,
    liters: 0,
    pricePerL: 0,
    station: "",
    note: "",
    fullTank: true,
  });

  const stats = useMemo(() => computeStats(fillups), [fillups]);
  const kmplSeries = useMemo(() => stats.rows.map((r) => r.kmPerL || 0).filter(Boolean), [stats]);

  const add = () => {
    if (!draft.odometer || !draft.liters || !draft.pricePerL) return;
    setFillups((p) => [...p, { ...draft, id: uid() }]);
    setDraft((d) => ({ ...d, liters: 0, pricePerL: 0, note: "" }));
  };
  const remove = (id: string) => setFillups((p) => p.filter((x) => x.id !== id));
  const resetDemo = () => setFillups(DEMO);

  // CSV
  const exportCSV = () => {
    const header = "date,odometer,liters,pricePerL,fullTank,station,note";
    const rows = fillups.map((f) => [f.date, f.odometer, f.liters, f.pricePerL, f.fullTank ? 1 : 0, f.station ?? "", f.note ?? ""].join(","));
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "fuel-log.csv"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  };
  const importCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const lines = text.split(/\r?\n/).filter(Boolean);
      const body = lines.slice(1);
      const next: FillUp[] = body.map((l) => {
        const [date, odo, L, ppl, full, station, note] = l.split(",");
        return { id: uid(), date, odometer: toNum(odo), liters: toNum(L), pricePerL: toNum(ppl), fullTank: full === "1" || full === "true", station, note };
      });
      if (next.length) setFillups(next);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1220] via-[#0f1a2b] to-[#0b1220] text-slate-200 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-800/60 backdrop-blur-xl shadow-2xl">
          <img src="https://picsum.photos/1200/280?car" alt="hero" className="w-full h-40 md:h-56 object-cover object-center opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <div className="relative p-6 md:p-8 flex items-center gap-4">
            <motion.div initial={{ rotate: -10 }} animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity }} className="p-3 rounded-xl bg-gradient-to-br from-rose-500/30 to-fuchsia-500/30">
              <CarFront className="h-7 w-7 text-rose-300" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white inline-flex items-center gap-2">
                Fuel Economy & Cost Tracker
              </h1>
              <p className="text-slate-300 text-sm">Log each fill‑up and get your real‑world km/L, ₹/km, totals and trends.</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={exportCSV} className="rounded-xl px-3 py-2 border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"><Save className="h-4 w-4"/>Export</button>
              <label className="rounded-xl px-3 py-2 border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2 cursor-pointer"><Upload className="h-4 w-4"/>Import<input type="file" accept=".csv" className="hidden" onChange={(e)=>{ if(e.target.files?.[0]) importCSV(e.target.files[0]); }}/></label>
              <button onClick={resetDemo} className="rounded-xl px-3 py-2 border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"><RefreshCcw className="h-4 w-4"/>Demo</button>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-sm text-slate-300 inline-flex items-center gap-2"><Gauge className="h-4 w-4"/>Avg km/L</p>
            <p className="text-2xl font-semibold">{num(stats.avgKmPerL || 0, 2)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-sm text-slate-300 inline-flex items-center gap-2"><Fuel className="h-4 w-4"/>Total liters</p>
            <p className="text-2xl font-semibold">{num(stats.totalLiters, 1)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-sm text-slate-300 inline-flex items-center gap-2"><IndianRupee className="h-4 w-4"/>Total cost</p>
            <p className="text-2xl font-semibold">{inr(stats.totalCost)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-sm text-slate-300 inline-flex items-center gap-2"><Percent className="h-4 w-4"/>₹/km</p>
            <p className="text-2xl font-semibold">{num(stats.costPerKm || 0, 2)}</p>
          </div>
        </div>

        {/* Trend */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-pink-950/30 to-rose-950/20 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-300 inline-flex items-center gap-2"><LineChart className="h-4 w-4"/>km/L trend</p>
          </div>
          <Spark points={kmplSeries} />
        </div>

        {/* Form + Table */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="rounded-2xl border border-white/10 bg-white/10 p-5 order-last lg:order-first">
            <p className="text-sm text-slate-300 mb-3">Add fill‑up</p>
            <div className="grid grid-cols-1 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Calendar className="h-4 w-4"/>Date</span>
                <input type="date" value={draft.date} onChange={(e)=>setDraft(d=>({...d,date:e.target.value}))} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-400/60"/>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Gauge className="h-4 w-4"/>Odometer (km)</span>
                <input type="number" value={draft.odometer} onChange={(e)=>setDraft(d=>({...d,odometer:toNum(e.target.value)}))} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-400/60"/>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Fuel className="h-4 w-4"/>Liters</span>
                  <input type="number" step="0.1" value={draft.liters} onChange={(e)=>setDraft(d=>({...d,liters:toNum(e.target.value)}))} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-400/60"/>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-slate-300 inline-flex items-center gap-2"><IndianRupee className="h-4 w-4"/>₹/L</span>
                  <input type="number" step="0.1" value={draft.pricePerL} onChange={(e)=>setDraft(d=>({...d,pricePerL:toNum(e.target.value)}))} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-400/60"/>
                </label>
              </div>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-slate-300 inline-flex items-center gap-2"><MapPin className="h-4 w-4"/>Station (optional)</span>
                <input type="text" value={draft.station} onChange={(e)=>setDraft(d=>({...d,station:e.target.value}))} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-400/60"/>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={draft.fullTank} onChange={(e)=>setDraft(d=>({...d,fullTank:e.target.checked}))} />
                <span className="text-sm text-slate-300">Full tank</span>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Tag className="h-4 w-4"/>Note</span>
                <input type="text" value={draft.note} onChange={(e)=>setDraft(d=>({...d,note:e.target.value}))} className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-400/60"/>
              </label>
              <button onClick={add} className="rounded-xl bg-gradient-to-r from-rose-700 to-fuchsia-700 text-white px-4 py-2 text-sm shadow hover:opacity-90 transition inline-flex items-center gap-2"><Plus className="h-4 w-4"/>Add</button>
              <p className="text-xs text-slate-400">Tip: For accurate km/L, log full‑tank fills (Full tank ✓). The km since last full fill divided by the liters now gives tank economy.</p>
            </div>
          </div>

          {/* Table */}
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/10 p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-slate-300/90">
                  <tr className="text-left">
                    <th className="py-2 pr-2 font-medium">Date</th>
                    <th className="py-2 pr-2 font-medium">Odo</th>
                    <th className="py-2 pr-2 font-medium">Liters</th>
                    <th className="py-2 pr-2 font-medium">₹/L</th>
                    <th className="py-2 pr-2 font-medium">Cost</th>
                    <th className="py-2 pr-2 font-medium">km</th>
                    <th className="py-2 pr-2 font-medium">km/L</th>
                    <th className="py-2 pr-2 font-medium">—</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.rows
                    .sort((a,b)=> b.odometer - a.odometer)
                    .map((r) => (
                      <tr key={r.id} className="border-t border-white/10">
                        <td className="py-2 pr-2">{r.date}</td>
                        <td className="py-2 pr-2">{r.odometer}</td>
                        <td className="py-2 pr-2">{r.liters.toFixed(1)}</td>
                        <td className="py-2 pr-2">{r.pricePerL.toFixed(1)}</td>
                        <td className="py-2 pr-2">{inr(r.totalCost)}</td>
                        <td className="py-2 pr-2">{r.km ?? "—"}</td>
                        <td className="py-2 pr-2">{r.kmPerL ? r.kmPerL.toFixed(2) : "—"}</td>
                        <td className="py-2 pr-2">
                          <button onClick={()=>remove(r.id)} className="rounded-lg px-2 py-1 border border-white/20 bg-white/10 hover:bg-white/15"><Trash2 className="h-4 w-4"/></button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Gallery / image band for UX delight */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1,2,3,4].map(i=> (
            <img key={i} src={`https://picsum.photos/seed/fuel-${i}/400/240`} alt="motoring" className="rounded-xl object-cover w-full h-32 md:h-40 opacity-80 border border-white/10"/>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-xs text-slate-400 mt-6 inline-flex items-center gap-1"><Info className="h-3 w-3"/> Calculations use the full‑to‑full method. ₹/km is based on total spend divided by distance covered between full‑tank rows.</p>
      </div>
    </div>
  );
}
