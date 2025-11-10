"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlugZap, Plus, Minus, Calculator, Copy, Share2, RefreshCcw, Trash2, Save, Upload, Zap, IndianRupee, Flame, Moon, Sun } from "lucide-react";

// ---------------- Types ----------------
interface Item {
  id: string;
  name: string;
  watts: number; // per unit
  qty: number;
  hoursPerDay: number; // typical running hours per day
  daysPerMonth: number; // e.g., 30
  peakSplit?: number; // 0..1 portion of hours run in peak window
}

// ---------------- Helpers ----------------
const toNum = (v: string | number): number => Number(v || 0) || 0;
const toMoney = (n: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(Math.round(n * 100) / 100);
const uid = () => Math.random().toString(36).slice(2, 9);

function kwhPerDay(it: Item) { return (it.watts * it.qty * it.hoursPerDay) / 1000; }
function kwhPerMonth(it: Item) { return kwhPerDay(it) * it.daysPerMonth; }

function useLocal<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} }, [key, state]);
  return [state, setState] as const;
}

// Catalog of common appliances (demo defaults)
const CATALOG: Omit<Item, "id">[] = [
  { name: "LED Bulb (9W)", watts: 9, qty: 4, hoursPerDay: 5, daysPerMonth: 30 },
  { name: "Ceiling Fan", watts: 70, qty: 3, hoursPerDay: 8, daysPerMonth: 30 },
  { name: "Fridge (200L)", watts: 120, qty: 1, hoursPerDay: 10, daysPerMonth: 30 },
  { name: "Washing Machine", watts: 500, qty: 1, hoursPerDay: 0.8, daysPerMonth: 12 },
  { name: "Television (LED)", watts: 80, qty: 1, hoursPerDay: 3, daysPerMonth: 30 },
  { name: "Laptop", watts: 60, qty: 1, hoursPerDay: 5, daysPerMonth: 26 },
  { name: "AC 1.5 Ton (Inverter)", watts: 1400, qty: 1, hoursPerDay: 6, daysPerMonth: 30, peakSplit: 0.7 },
];

export default function EnergyConsumptionCalculator() {
  const [items, setItems] = useLocal<Item[]>("ecc_items", CATALOG.map(c => ({ id: uid(), ...c})));
  const [rate, setRate] = useLocal<number>("ecc_rate", 7); // ₹/kWh
  const [hasTimeOfDay, setHasTimeOfDay] = useLocal<boolean>("ecc_tod", false);
  const [peakRate, setPeakRate] = useLocal<number>("ecc_peak", 9);
  const [offRate, setOffRate] = useLocal<number>("ecc_off", 5.5);
  const [peakHoursName, setPeakHoursName] = useLocal<string>("ecc_peakname", "6–11 PM");

  const addItemFromCatalog = (c: Omit<Item, "id">) => setItems(prev => [...prev, { id: uid(), ...c }]);
  const addBlank = () => setItems(prev => [...prev, { id: uid(), name: "New appliance", watts: 0, qty: 1, hoursPerDay: 1, daysPerMonth: 30 }]);
  const remove = (id: string) => setItems(prev => prev.filter(x => x.id !== id));
  const reset = () => { setItems(CATALOG.map(c=>({id: uid(), ...c}))); setRate(7); setHasTimeOfDay(false); setPeakRate(9); setOffRate(5.5); };

  // CSV export/import (simple)
  function exportCSV() {
    const rows = ["name,watts,qty,hoursPerDay,daysPerMonth,peakSplit"].concat(items.map(i=>[i.name,i.watts,i.qty,i.hoursPerDay,i.daysPerMonth,(i.peakSplit??"")].join(',')));
    const blob = new Blob([rows.join("\n")], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='energy-items.csv'; a.click(); setTimeout(()=>URL.revokeObjectURL(url), 500);
  }
  function importCSV(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result||'');
        const lines = text.split(/\r?\n/).filter(Boolean).slice(1);
        const parsed: Item[] = lines.map(l=>{ const [name,watts,qty,h,d,ps] = l.split(','); return { id: uid(), name, watts: toNum(watts), qty: toNum(qty), hoursPerDay: toNum(h), daysPerMonth: toNum(d), peakSplit: ps? Number(ps): undefined }; });
        if (parsed.length) setItems(parsed);
      } catch {}
    };
    reader.readAsText(file);
  }

  // Totals
  const totals = useMemo(() => {
    const byItem = items.map(it => ({ id: it.id, kwhDay: kwhPerDay(it), kwhMonth: kwhPerMonth(it) }));
    const month = byItem.reduce((a,b)=>a+b.kwhMonth, 0);
    const day = byItem.reduce((a,b)=>a+b.kwhDay, 0);

    let cost = month * rate;
    let peakKwh = 0, offKwh = 0, costTOD = 0;
    if (hasTimeOfDay) {
      for (const it of items) {
        const split = Math.min(Math.max(it.peakSplit ?? 0.5, 0), 1); // default 50%
        const m = kwhPerMonth(it);
        peakKwh += m * split; offKwh += m * (1 - split);
      }
      costTOD = peakKwh * peakRate + offKwh * offRate;
    }

    return { day, month, cost, byItem, peakKwh, offKwh, costTOD };
  }, [items, rate, hasTimeOfDay, peakRate, offRate]);

  const share = async () => {
    const text = `Energy/day: ${toMoney(totals.day)} kWh\nEnergy/month: ${toMoney(totals.month)} kWh\nEstimated cost: ₹${toMoney(hasTimeOfDay ? totals.costTOD : totals.cost)}`;
    try { if (navigator.share) await navigator.share({ title: 'Energy Estimate', text }); else await navigator.clipboard.writeText(text); } catch {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-6 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl">
        <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <motion.div initial={{ rotate: -12 }} animate={{ rotate: [-12, 10, -12] }} transition={{ duration: 6, repeat: Infinity }} className="p-2 rounded-xl bg-gradient-to-br from-pink-500/30 to-rose-500/30"><PlugZap className="h-6 w-6 text-pink-300"/></motion.div>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight inline-flex items-center gap-2"><Calculator className="h-5 w-5"/>Energy Consumption Calculator</h1>
              <p className="text-slate-300 text-sm">Add household appliances to estimate daily/monthly kWh and cost.</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={share} className="rounded-xl px-3 py-2 border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"><Share2 className="h-4 w-4"/>Share</button>
              <button onClick={exportCSV} className="rounded-xl px-3 py-2 border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"><Save className="h-4 w-4"/>Export CSV</button>
              <label className="rounded-xl px-3 py-2 border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2 cursor-pointer"><Upload className="h-4 w-4"/>Import CSV<input type="file" accept=".csv" className="hidden" onChange={(e)=>{ if(e.target.files?.[0]) importCSV(e.target.files[0]); }}/></label>
              <button onClick={reset} className="rounded-xl px-3 py-2 border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"><RefreshCcw className="h-4 w-4"/>Reset</button>
            </div>
          </div>

          {/* Tariff */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Zap className="h-4 w-4"/>Flat rate (₹/kWh)</span>
                <input type="number" min={0} step={0.1} value={rate} onChange={(e)=>setRate(toNum(e.target.value))} className="rounded-xl bg-white/10 border border-white/20 px-3 py-3 outline-none focus:ring-2 focus:ring-pink-400"/>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={hasTimeOfDay} onChange={(e)=>setHasTimeOfDay(e.target.checked)} className="h-4 w-4"/>
                <span className="text-sm text-slate-300">Use Time‑of‑Day (peak/off‑peak)</span>
              </label>
              {hasTimeOfDay && (
                <>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Flame className="h-4 w-4"/>Peak rate (₹/kWh)</span>
                    <input type="number" min={0} step={0.1} value={peakRate} onChange={(e)=>setPeakRate(toNum(e.target.value))} className="rounded-xl bg-white/10 border border-white/20 px-3 py-3 outline-none focus:ring-2 focus:ring-pink-400"/>
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Moon className="h-4 w-4"/>Off‑peak rate (₹/kWh)</span>
                    <input type="number" min={0} step={0.1} value={offRate} onChange={(e)=>setOffRate(toNum(e.target.value))} className="rounded-xl bg-white/10 border border-white/20 px-3 py-3 outline-none focus:ring-2 focus:ring-pink-400"/>
                  </label>
                </>
              )}
            </div>
            {hasTimeOfDay && (
              <p className="text-xs text-slate-400 mt-2">Peak window: {peakHoursName}. Each item can set a <em>Peak %</em> of hours that fall inside this window.</p>
            )}
          </div>

          {/* Items table */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-300">Appliance list</p>
              <div className="flex items-center gap-2">
                <button onClick={addBlank} className="rounded-lg px-2 py-1 border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-1"><Plus className="h-4 w-4"/>Add item</button>
                <div className="relative inline-block">
                  <details>
                    <summary className="rounded-lg px-2 py-1 border border-white/20 bg-white/10 hover:bg-white/15 list-none cursor-pointer">Quick add</summary>
                    <div className="absolute right-0 z-10 mt-2 w-56 rounded-xl border border-white/15 bg-slate-900/95 backdrop-blur shadow-2xl p-2 max-h-72 overflow-auto">
                      {CATALOG.map((c, idx)=> (
                        <button key={idx} onClick={()=>addItemFromCatalog(c)} className="w-full text-left rounded-lg px-2 py-2 hover:bg-white/10 flex items-center justify-between">
                          <span>{c.name}</span>
                          <span className="text-xs text-slate-400">{c.watts} W</span>
                        </button>
                      ))}
                    </div>
                  </details>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 text-xs text-slate-300 pb-1">
              <div className="col-span-3">Item</div>
              <div className="col-span-2">Watts</div>
              <div className="col-span-1">Qty</div>
              <div className="col-span-2">Hours/Day</div>
              <div className="col-span-2">Days/Month</div>
              {hasTimeOfDay && <div className="col-span-1">Peak %</div>}
              <div className="col-span-1">—</div>
            </div>

            {items.map((it) => (
              <div key={it.id} className="grid grid-cols-12 gap-2 items-center mb-2">
                <input value={it.name} onChange={(e)=> setItems(prev=> prev.map(x=> x.id===it.id? { ...x, name: e.target.value } : x))} className="col-span-3 rounded-lg bg-white/10 border border-white/20 px-2 py-2"/>
                <input type="number" value={it.watts} onChange={(e)=> setItems(prev=> prev.map(x=> x.id===it.id? { ...x, watts: toNum(e.target.value) } : x))} className="col-span-2 rounded-lg bg-white/10 border border-white/20 px-2 py-2"/>
                <input type="number" value={it.qty} onChange={(e)=> setItems(prev=> prev.map(x=> x.id===it.id? { ...x, qty: toNum(e.target.value) } : x))} className="col-span-1 rounded-lg bg-white/10 border border-white/20 px-2 py-2"/>
                <input type="number" value={it.hoursPerDay} step={0.1} onChange={(e)=> setItems(prev=> prev.map(x=> x.id===it.id? { ...x, hoursPerDay: toNum(e.target.value) } : x))} className="col-span-2 rounded-lg bg-white/10 border border-white/20 px-2 py-2"/>
                <input type="number" value={it.daysPerMonth} onChange={(e)=> setItems(prev=> prev.map(x=> x.id===it.id? { ...x, daysPerMonth: toNum(e.target.value) } : x))} className="col-span-2 rounded-lg bg-white/10 border border-white/20 px-2 py-2"/>
                {hasTimeOfDay && (
                  <input type="number" value={it.peakSplit ?? 50} min={0} max={100} onChange={(e)=> setItems(prev=> prev.map(x=> x.id===it.id? { ...x, peakSplit: Math.min(100, Math.max(0, toNum(e.target.value))) / 100 } : x))} className="col-span-1 rounded-lg bg-white/10 border border-white/20 px-2 py-2"/>
                )}
                <button onClick={()=>remove(it.id)} className="col-span-1 rounded-lg px-2 py-2 border border-white/20 bg-white/10 hover:bg-white/15"><Trash2 className="h-4 w-4"/></button>
              </div>
            ))}

            <p className="text-xs text-slate-400 mt-2">Tip: Peak % is the portion of usage during peak hours (e.g., AC might run 70% in evening).</p>
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-pink-950/30 to-rose-950/20 p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="rounded-xl border border-white/10 bg-white/10 p-4">
                <p className="text-slate-300 text-sm mb-1">Daily energy</p>
                <p className="text-2xl font-semibold">{toMoney(totals.day)} kWh</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/10 p-4">
                <p className="text-slate-300 text-sm mb-1">Monthly energy</p>
                <p className="text-2xl font-semibold">{toMoney(totals.month)} kWh</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/10 p-4">
                <p className="text-slate-300 text-sm mb-1">Estimated cost</p>
                <p className="text-2xl font-semibold inline-flex items-center gap-1"><IndianRupee className="h-6 w-6"/>{toMoney(hasTimeOfDay ? totals.costTOD : totals.cost)}</p>
              </div>
            </div>

            {hasTimeOfDay && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-4">
                <p className="text-slate-300 text-sm mb-2">Time‑of‑Day split</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg bg-white/10 p-3">
                    <p className="text-sm text-slate-300 inline-flex items-center gap-2"><Flame className="h-4 w-4"/>Peak {peakHoursName}</p>
                    <p className="text-xl font-semibold">{toMoney(totals.peakKwh)} kWh</p>
                    <p className="text-slate-400 text-sm">₹{toMoney(peakRate)} / kWh → ₹{toMoney(totals.peakKwh * peakRate)}</p>
                  </div>
                  <div className="rounded-lg bg-white/10 p-3">
                    <p className="text-sm text-slate-300 inline-flex items-center gap-2"><Sun className="h-4 w-4"/>Off‑peak</p>
                    <p className="text-xl font-semibold">{toMoney(totals.offKwh)} kWh</p>
                    <p className="text-slate-400 text-sm">₹{toMoney(offRate)} / kWh → ₹{toMoney(totals.offKwh * offRate)}</p>
                  </div>
                  <div className="rounded-lg bg-white/10 p-3">
                    <p className="text-sm text-slate-300">Cost (TOD)</p>
                    <p className="text-xl font-semibold inline-flex items-center gap-1"><IndianRupee className="h-5 w-5"/>{toMoney(totals.costTOD)}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-slate-300/90">
                  <tr className="text-left">
                    <th className="py-2 pr-2 font-medium">Appliance</th>
                    <th className="py-2 pr-2 font-medium">kWh/day</th>
                    <th className="py-2 pr-2 font-medium">kWh/month</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(it => (
                    <tr key={it.id} className="border-t border-white/10">
                      <td className="py-2 pr-2">{it.name} <span className="text-xs text-slate-400">({it.qty} × {it.watts}W)</span></td>
                      <td className="py-2 pr-2">{toMoney(kwhPerDay(it))}</td>
                      <td className="py-2 pr-2">{toMoney(kwhPerMonth(it))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-400 mt-4">All numbers are estimates. Actual consumption depends on efficiency, ambient temperature, and usage patterns.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
