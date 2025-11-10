
"use client";


import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Plus, Minus, Calculator, Copy, Share2, RefreshCcw, IndianRupee, Info, Settings2 } from "lucide-react";

// ---------------- Types ----------------
interface Slab { upto: number | null; rate: number; }

// ---------------- Helpers ----------------
const toMoney = (n: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(Math.round(n * 100) / 100);
const readNum = (v: string) => (v === "" || v === undefined || v === null ? 0 : Number(v));

function calcEnergyBySlab(units: number, slabs: Slab[]) {
  // slabs ordered by upto asc; last slab may have upto=null (infinite)
  let remaining = units;
  const rows: { from: number; to: number | null; units: number; rate: number; amount: number }[] = [];
  let start = 0;
  for (let i = 0; i < slabs.length && remaining > 0; i++) {
    const s = slabs[i];
    const limit = s.upto ?? Infinity;
    const slabUnits = Math.max(0, Math.min(remaining, limit - start));
    const amount = slabUnits * s.rate;
    if (slabUnits > 0) {
      rows.push({ from: start, to: s.upto, units: slabUnits, rate: s.rate, amount });
      remaining -= slabUnits;
      start = limit;
    }
  }
  // if still remaining and last slab didn't have Infinity, add an open slab at last rate
  if (remaining > 0) {
    const last = slabs[slabs.length - 1];
    const rate = last ? last.rate : 0;
    rows.push({ from: start, to: null, units: remaining, rate, amount: remaining * rate });
  }
  const energy = rows.reduce((a, r) => a + r.amount, 0);
  return { rows, energy };
}

function useLocal<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} }, [key, state]);
  return [state, setState] as const;
}

// ---------------- Component ----------------
export default function ElectricityBillCalculator() {
  // Inputs
  const [units, setUnits] = useLocal<number>("ebc_units", 250);
  const [slabs, setSlabs] = useLocal<Slab[]>("ebc_slabs", [
    { upto: 100, rate: 3.5 },
    { upto: 200, rate: 5.5 },
    { upto: null, rate: 7.0 }, // open-ended
  ]);
  const [fuelSurcharge, setFuelSurcharge] = useLocal<number>("ebc_fpppa", 1.2); // ₹/kWh
  const [fixedCharge, setFixedCharge] = useLocal<number>("ebc_fixed", 50);
  const [meterRent, setMeterRent] = useLocal<number>("ebc_meter", 20);
  const [taxPercent, setTaxPercent] = useLocal<number>("ebc_tax", 5); // e.g., electricity duty/GST combined
  const [notes, setNotes] = useLocal<string>("ebc_notes", "Sample rates for demo. Replace with your DISCOM tariff.");

  // Presets (illustrative only)
  const presets: { name: string; slabs: Slab[]; fixed: number; fpppa: number; meter: number; tax: number }[] = [
    { name: "Simple 3‑slab (demo)", slabs: [ { upto: 100, rate: 3.5 }, { upto: 200, rate: 5.5 }, { upto: null, rate: 7.0 } ], fixed: 50, fpppa: 1.2, meter: 20, tax: 5 },
    { name: "Flat rate ₹6/kWh", slabs: [ { upto: null, rate: 6 } ], fixed: 60, fpppa: 0.8, meter: 25, tax: 5 },
    { name: "Low‑use friendly", slabs: [ { upto: 50, rate: 2.5 }, { upto: 150, rate: 4.5 }, { upto: null, rate: 6.5 } ], fixed: 40, fpppa: 1.0, meter: 20, tax: 5 },
  ];

  // Calculations
  const { rows, energy } = useMemo(() => calcEnergyBySlab(units, slabs), [units, slabs]);
  const fuel = useMemo(() => units * fuelSurcharge, [units, fuelSurcharge]);
  const subTotal = energy + fixedCharge + meterRent + fuel;
  const tax = subTotal * (taxPercent / 100);
  const total = subTotal + tax;

  // Actions
  const addSlab = () => setSlabs((prev) => [...prev, { upto: null, rate: 0 }]);
  const removeSlab = (i: number) => setSlabs((prev) => prev.filter((_, idx) => idx !== i));
  const setPreset = (i: number) => {
    const p = presets[i];
    setSlabs(p.slabs); setFixedCharge(p.fixed); setFuelSurcharge(p.fpppa); setMeterRent(p.meter); setTaxPercent(p.tax);
  };
  const reset = () => { setUnits(250); setPreset(0); };

  const share = async () => {
    const text = `Units: ${units}\nEnergy: ₹${toMoney(energy)}\nFixed: ₹${toMoney(fixedCharge)}\nMeter: ₹${toMoney(meterRent)}\nFuel: ₹${toMoney(fuel)}\nTax (${taxPercent}%): ₹${toMoney(tax)}\nTotal: ₹${toMoney(total)}`;
    try {
      if (navigator.share) await navigator.share({ title: "Electricity Bill", text });
      else await navigator.clipboard.writeText(text);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-6 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl">
        <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <motion.div initial={{ rotate: -10 }} animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity }} className="p-2 rounded-xl bg-gradient-to-br from-pink-500/30 to-rose-500/30"><Zap className="h-6 w-6 text-pink-300"/></motion.div>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight inline-flex items-center gap-2"><Calculator className="h-5 w-5"/>Household Electricity Bill</h1>
              <p className="text-slate-300 text-sm">Use your DISCOM slabs and charges. Values below are <span className="text-amber-300">demo placeholders</span>.</p>
            </div>
          </div>

          {/* Presets */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 inline-flex items-center gap-1"><Settings2 className="h-3 w-3"/>Presets:</span>
            {presets.map((p, i) => (
              <button key={p.name} onClick={() => setPreset(i)} className="rounded-xl px-3 py-2 text-sm bg-white/10 hover:bg-white/15 border border-white/15">{p.name}</button>
            ))}
            <button onClick={reset} className="ml-auto rounded-xl px-3 py-2 text-sm border border-white/15 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"><RefreshCcw className="h-4 w-4"/>Reset</button>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <label className="flex flex-col gap-2">
              <span className="text-sm text-slate-300">Units consumed (kWh)</span>
              <input type="number" min={0} step={1} value={units} onChange={(e)=>setUnits(readNum(e.target.value))} className="rounded-xl bg-white/10 border border-white/20 px-3 py-3 outline-none focus:ring-2 focus:ring-pink-400"/>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm text-slate-300">Fuel adj. / kWh (₹)</span>
              <input type="number" min={0} step={0.1} value={fuelSurcharge} onChange={(e)=>setFuelSurcharge(readNum(e.target.value))} className="rounded-xl bg-white/10 border border-white/20 px-3 py-3 outline-none focus:ring-2 focus:ring-pink-400"/>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm text-slate-300">Tax % (duty / GST)</span>
              <input type="number" min={0} step={0.1} value={taxPercent} onChange={(e)=>setTaxPercent(readNum(e.target.value))} className="rounded-xl bg-white/10 border border-white/20 px-3 py-3 outline-none focus:ring-2 focus:ring-pink-400"/>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <label className="flex flex-col gap-2">
              <span className="text-sm text-slate-300">Fixed charge (₹)</span>
              <input type="number" min={0} step={1} value={fixedCharge} onChange={(e)=>setFixedCharge(readNum(e.target.value))} className="rounded-xl bg-white/10 border border-white/20 px-3 py-3 outline-none focus:ring-2 focus:ring-pink-400"/>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm text-slate-300">Meter rent (₹)</span>
              <input type="number" min={0} step={1} value={meterRent} onChange={(e)=>setMeterRent(readNum(e.target.value))} className="rounded-xl bg-white/10 border border-white/20 px-3 py-3 outline-none focus:ring-2 focus:ring-pink-400"/>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Info className="h-4 w-4"/>Notes</span>
              <input type="text" value={notes} onChange={(e)=>setNotes(e.target.value)} className="rounded-xl bg-white/10 border border-white/20 px-3 py-3 outline-none focus:ring-2 focus:ring-pink-400"/>
            </label>
          </div>

          {/* Slab table */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-300">Tariff slabs (₹ / kWh)</p>
              <div className="flex items-center gap-2">
                <button onClick={addSlab} className="rounded-lg px-2 py-1 border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-1"><Plus className="h-4 w-4"/>Add slab</button>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2 text-xs text-slate-300 pb-1">
              <div className="col-span-4">Upto (kWh)</div>
              <div className="col-span-4">Rate (₹/kWh)</div>
              <div className="col-span-3">—</div>
            </div>
            {slabs.map((s, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center mb-2">
                <input type="number" className="col-span-4 rounded-lg bg-white/10 border border-white/20 px-2 py-2" placeholder="leave blank for last slab" value={s.upto ?? ""} onChange={(e)=>{
                  const v = e.target.value === "" ? null : Number(e.target.value); setSlabs(prev => prev.map((x, idx)=> idx===i ? { ...x, upto: v } : x));
                }}/>
                <input type="number" className="col-span-4 rounded-lg bg-white/10 border border-white/20 px-2 py-2" value={s.rate} step={0.1} onChange={(e)=>{
                  const v = Number(e.target.value); setSlabs(prev => prev.map((x, idx)=> idx===i ? { ...x, rate: v } : x));
                }}/>
                <div className="col-span-3 text-slate-400">{i===slabs.length-1 ? "open" : `up to ${s.upto ?? ''}`}</div>
                <button onClick={()=>removeSlab(i)} className="col-span-1 rounded-lg px-2 py-2 border border-white/20 bg-white/10 hover:bg-white/15"><Minus className="h-4 w-4"/></button>
              </div>
            ))}
            <p className="text-xs text-slate-400 mt-2">Order slabs ascending by <em>Upto</em>. Last slab can be left blank for open‑ended rate.</p>
          </div>

          {/* Breakdown */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-pink-950/30 to-rose-950/20 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-300">Bill breakdown</p>
              <div className="flex items-center gap-2">
                <button onClick={share} className="rounded-xl px-3 py-2 border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"><Share2 className="h-4 w-4"/>Share</button>
                <button onClick={()=>navigator.clipboard.writeText(`Total: ₹${toMoney(total)}`)} className="rounded-xl px-3 py-2 border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"><Copy className="h-4 w-4"/>Copy total</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-slate-300/90">
                  <tr className="text-left">
                    <th className="py-2 pr-2 font-medium">Slab</th>
                    <th className="py-2 pr-2 font-medium">Units</th>
                    <th className="py-2 pr-2 font-medium">Rate</th>
                    <th className="py-2 pr-2 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr><td colSpan={4} className="py-3 text-slate-400">No usage in configured slabs.</td></tr>
                  )}
                  {rows.map((r, i) => (
                    <tr key={i} className="border-t border-white/10">
                      <td className="py-2 pr-2">{r.to === null ? `${r.from}+` : `${r.from}–${r.to}`}</td>
                      <td className="py-2 pr-2">{r.units}</td>
                      <td className="py-2 pr-2">₹ {toMoney(r.rate)}</td>
                      <td className="py-2 pr-2">₹ {toMoney(r.amount)}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-white/10"><td colSpan={3} className="py-2 pr-2">Energy charge</td><td className="py-2 pr-2">₹ {toMoney(energy)}</td></tr>
                  <tr className="border-t border-white/10"><td colSpan={3} className="py-2 pr-2">Fixed charge</td><td className="py-2 pr-2">₹ {toMoney(fixedCharge)}</td></tr>
                  <tr className="border-t border-white/10"><td colSpan={3} className="py-2 pr-2">Meter rent</td><td className="py-2 pr-2">₹ {toMoney(meterRent)}</td></tr>
                  <tr className="border-t border-white/10"><td colSpan={3} className="py-2 pr-2">Fuel adj. ({units} × ₹{toMoney(fuelSurcharge)})</td><td className="py-2 pr-2">₹ {toMoney(fuel)}</td></tr>
                  <tr className="border-t border-white/10"><td colSpan={3} className="py-2 pr-2">Sub‑total</td><td className="py-2 pr-2">₹ {toMoney(subTotal)}</td></tr>
                  <tr className="border-t border-white/10"><td colSpan={3} className="py-2 pr-2">Tax {taxPercent}%</td><td className="py-2 pr-2">₹ {toMoney(tax)}</td></tr>
                  <tr className="border-t border-white/10 text-emerald-300 font-semibold"><td colSpan={3} className="py-2 pr-2">Total payable</td><td className="py-2 pr-2 inline-flex items-center gap-1"><IndianRupee className="h-4 w-4"/> {toMoney(total)}</td></tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-400 mt-4">This is a general calculator. Tariffs vary by state/DISCOM and may include additional surcharges/waivers. Please update the slabs and charges to match your bill.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
