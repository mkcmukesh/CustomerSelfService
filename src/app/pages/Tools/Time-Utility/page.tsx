"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CalendarClock,
  Copy,
  ChevronDown,
  Share2,
  CalendarPlus,
  Coffee,
  Target,
  Sun,
  Moon,
  Timer,
  AlarmClock,
  ClipboardCheck,
  Clipboard
} from "lucide-react";

// ---------- Helpers ----------
function clamp(n: number, min: number, max: number) { return Math.min(Math.max(n, min), max); }

function parseTimeToMinutes(value: string): number | null {
  if (!value) return null;
  const parts = value.split(":");
  if (parts.length !== 2) return null;
  const h = clamp(parseInt(parts[0], 10), 0, 23);
  const m = clamp(parseInt(parts[1], 10), 0, 59);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

function formatMinutes24(total: number): string {
  const mins = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(mins / 60); const m = mins % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function formatMinutes12(total: number): string {
  const mins = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  let h = Math.floor(mins / 60); const m = mins % 60;
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12; if (h === 0) h = 12;
  return `${h}:${m.toString().padStart(2, "0")} ${suffix}`;
}

function dayOffsetText(total: number, base: number): string {
  const diff = Math.floor(total / (24 * 60)) - Math.floor(base / (24 * 60));
  if (diff === 1) return "+1 day"; if (diff > 1) return `+${diff} days`;
  if (diff === -1) return "−1 day"; if (diff < -1) return `${diff} days`;
  return "";
}

function roundTo(mins: number, step: number) { return step ? Math.round(mins / step) * step : mins; }

// ICS formatting helpers
function icsDate(dt: Date) {
  const y = dt.getFullYear();
  const mo = (dt.getMonth() + 1).toString().padStart(2, "0");
  const d = dt.getDate().toString().padStart(2, "0");
  const h = dt.getHours().toString().padStart(2, "0");
  const m = dt.getMinutes().toString().padStart(2, "0");
  const s = dt.getSeconds().toString().padStart(2, "0");
  return `${y}${mo}${d}T${h}${m}${s}`; // floating (local) time
}

const HOURS_OPTIONS = [8, 8.5, 9] as const;
const FIFTEEN_MIN_LIST = Array.from({ length: 96 }, (_, i) => i * 15);

// ---------- Custom 15‑min quick select (popover) ----------
function QuickTimeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(v => !v)} className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-3 pr-10 text-left hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-pink-400">
        <span className="inline-flex items-center gap-2"><Timer className="h-4 w-4 opacity-80"/>{value ? (<span>{value} ({formatMinutes12(parseTimeToMinutes(value) ?? 0)})</span>) : (<span className="text-slate-300">Select time…</span>)}</span>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-70" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.15 }} className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-white/20 bg-slate-900/95 shadow-2xl backdrop-blur-md">
            {FIFTEEN_MIN_LIST.map((mins) => {
              const v = formatMinutes24(mins);
              return (
                <button key={v} type="button" onClick={() => { onChange(v); setOpen(false); }} className="flex w-full items-center justify-between px-3 py-2 hover:bg-white/10">
                  <span className="inline-flex items-center gap-2"><AlarmClock className="h-4 w-4 opacity-70"/>{v}</span>
                  <span className="text-xs text-slate-300">{formatMinutes12(mins)}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- Drag Clock (hour + minute, AM/PM toggle, pink gradient) ----------
function angleFromPoint(cx: number, cy: number, px: number, py: number) {
  const dx = px - cx; const dy = py - cy; const a = Math.atan2(dy, dx);
  return (a + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2); // 0 at top, clockwise
}
function angleForHour(h: number) { return (h % 12) / 12 * Math.PI * 2; }
function angleForMinute(m: number) { return (m % 60) / 60 * Math.PI * 2; }

function DragClock({ initial, onClose, onSelect }: { initial: string; onClose: () => void; onSelect: (v: string) => void }) {
  const init = parseTimeToMinutes(initial) ?? 9 * 60;
  const [stage, setStage] = useState<'hour' | 'minute'>('hour');
  const [hour24, setHour24] = useState(Math.floor(init / 60));
  const [minute, setMinute] = useState(init % 60);
  const [ampm, setAmpm] = useState(hour24 >= 12 ? 'PM' : 'AM');
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragging = useRef(false);

  useEffect(() => { // keep hour bucket when toggling AM/PM
    setHour24(prev => { const h12 = prev % 12; return ampm === 'PM' ? h12 + 12 : h12; });
  }, [ampm]);

  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      if (!dragging.current || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2; const cy = rect.top + rect.height / 2;
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const ang = angleFromPoint(cx, cy, clientX, clientY);
      if (stage === 'hour') {
        let h = Math.round(ang / (Math.PI * 2) * 12); if (h === 0) h = 12; const base = ampm === 'PM' ? 12 : 0; setHour24(((h % 12) + base) % 24);
      } else { let m = Math.round(ang / (Math.PI * 2) * 60) % 60; setMinute(m); }
    }
    function onUp() { dragging.current = false; }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove as any, { passive: false } as any);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('touchmove', onMove as any); window.removeEventListener('mouseup', onUp); window.removeEventListener('touchend', onUp); };
  }, [stage, ampm]);

  function beginDrag(e: React.MouseEvent | React.TouchEvent) { e.preventDefault(); dragging.current = true; }
  function commit() { onSelect(formatMinutes24(hour24 * 60 + minute)); onClose(); }
  const hour12 = (hour24 % 12) === 0 ? 12 : (hour24 % 12);

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/60 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-[360px] rounded-2xl border border-white/10 bg-slate-900 shadow-2xl overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-pink-500/25 via-fuchsia-500/25 to-rose-500/25">
          <div className="text-sm text-slate-200 inline-flex items-center gap-2"><Clock className="h-4 w-4"/> Select time</div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-white/10">✕</button>
        </div>
        <div className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <button onClick={() => setStage('hour')} className={`rounded-lg px-3 py-1 text-sm inline-flex items-center gap-2 ${stage==='hour' ? 'bg-pink-600 text-white' : 'bg-white/10 text-slate-200'}`}><Sun className="h-4 w-4"/>Hour</button>
            <button onClick={() => setStage('minute')} className={`rounded-lg px-3 py-1 text-sm inline-flex items-center gap-2 ${stage==='minute' ? 'bg-pink-600 text-white' : 'bg-white/10 text-slate-200'}`}><Moon className="h-4 w-4"/>Minute</button>
            <div className="ml-auto inline-flex rounded-lg border border-pink-500/40 overflow-hidden">
              <button onClick={() => setAmpm('AM')} className={`px-3 py-1 text-sm inline-flex items-center gap-1 ${ampm==='AM' ? 'bg-pink-500 text-white' : 'bg-white/10 text-slate-200'}`}><Sun className="h-4 w-4"/>AM</button>
              <button onClick={() => setAmpm('PM')} className={`px-3 py-1 text-sm inline-flex items-center gap-1 ${ampm==='PM' ? 'bg-pink-500 text-white' : 'bg-white/10 text-slate-200'}`}><Moon className="h-4 w-4"/>PM</button>
            </div>
          </div>

          <div className="mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-600/20 via-fuchsia-600/20 to-rose-600/20 p-4">
            <svg ref={svgRef} width={220} height={220} viewBox="0 0 220 220" onMouseDown={beginDrag} onTouchStart={beginDrag}>
              <defs>
                <linearGradient id="hand" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
              </defs>
              <circle cx={110} cy={110} r={96} className="fill-slate-900 stroke-white/15" />

              {stage==='hour' && Array.from({length:12},(_,i)=>i+1).map((h)=>{
                const a = (h % 12) / 12 * Math.PI * 2 - Math.PI/2; const x = 110 + Math.cos(a) * 78; const y = 110 + Math.sin(a) * 78; const active = h === hour12;
                return (<g key={h}><circle cx={x} cy={y} r={active?16:14} className={active?"fill-pink-500":"fill-slate-800 stroke-white/20"} /><text x={x} y={y+5} textAnchor="middle" className="fill-white text-[12px]">{h}</text></g>);
              })}

              {stage==='minute' && Array.from({length:12},(_,i)=>i*5).map((m)=>{
                const a = (m / 60) * Math.PI * 2 - Math.PI/2; const x = 110 + Math.cos(a) * 88; const y = 110 + Math.sin(a) * 88; const active = m === Math.round(minute/5)*5;
                return (<g key={m}><circle cx={x} cy={y} r={active?10:8} className={active?"fill-pink-500":"fill-slate-800 stroke-white/20"} /><text x={x} y={y+4} textAnchor="middle" className="fill-white text-[10px]">{m.toString().padStart(2,'0')}</text></g>);
              })}

              {/* Animated hand */}
              {stage==='hour' && (
                <line x1={110} y1={110} x2={110 + Math.cos((hour12 / 12) * Math.PI * 2 - Math.PI/2) * 70} y2={110 + Math.sin((hour12 / 12) * Math.PI * 2 - Math.PI/2) * 70} stroke="url(#hand)" strokeWidth={3} />
              )}
              {stage==='minute' && (
                <line x1={110} y1={110} x2={110 + Math.cos((minute / 60) * Math.PI * 2 - Math.PI/2) * 86} y2={110 + Math.sin((minute / 60) * Math.PI * 2 - Math.PI/2) * 86} stroke="url(#hand)" strokeWidth={3} />
              )}
            </svg>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-slate-200 text-sm">{formatMinutes12(hour24*60+minute)} <span className="text-slate-400">({formatMinutes24(hour24*60+minute)})</span></div>
            <button onClick={commit} className="rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-4 py-2 text-sm font-medium text-white shadow hover:from-pink-500 hover:to-rose-500">Set time</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ---------- Page ----------
export default function PunchOutCalculator() {
  const [punchIn, setPunchIn] = useState<string>("");
  const [hours, setHours] = useState<number>(HOURS_OPTIONS[0]);
  const [breakMin, setBreakMin] = useState<number>(0); // unpaid break added to punch-out
  const [roundStep, setRoundStep] = useState<number>(0); // 0, 5, 15
  const [copied, setCopied] = useState(false);
  const [showClock, setShowClock] = useState(false);

  // load/persist settings
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("punch_prefs") || "{}");
      if (s.punchIn) setPunchIn(s.punchIn);
      if (s.hours != null) setHours(Number(s.hours));
      if (s.breakMin != null) setBreakMin(Number(s.breakMin));
      if (s.roundStep != null) setRoundStep(Number(s.roundStep));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("punch_prefs", JSON.stringify({ punchIn, hours, breakMin, roundStep })); } catch {}
  }, [punchIn, hours, breakMin, roundStep]);

  const totalMinutes = useMemo(() => {
    const start = parseTimeToMinutes(punchIn);
    if (start == null) return null;
    const total = start + Math.round(hours * 60) + breakMin;
    return roundTo(total, roundStep);
  }, [punchIn, hours, breakMin, roundStep]);

  const startMinutes = useMemo(() => parseTimeToMinutes(punchIn), [punchIn]);

  const out24 = useMemo(() => (totalMinutes == null ? "—" : formatMinutes24(totalMinutes)), [totalMinutes]);
  const out12 = useMemo(() => (totalMinutes == null ? "—" : formatMinutes12(totalMinutes)), [totalMinutes]);
  const offsetLabel = useMemo(() => {
    if (startMinutes == null || totalMinutes == null) return "";
    return dayOffsetText(totalMinutes, startMinutes);
  }, [startMinutes, totalMinutes]);
  const isValid = totalMinutes != null;

  const overtime = useMemo(() => hours > 9, [hours]);

  // Shift presets
  function setPreset(time: string, hrs: number, brk = breakMin) {
    setPunchIn(time); setHours(hrs); setBreakMin(brk);
  }

  // ICS download (robust join to avoid build issues)
  function downloadICS() {
    if (startMinutes == null || totalMinutes == null) return;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Math.floor(startMinutes/60), startMinutes%60, 0);
    const diff = totalMinutes - (startMinutes);
    const end = new Date(start.getTime() + diff * 60 * 1000);
const lines = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Jindal Steel Punch Out//EN',
  'BEGIN:VEVENT',
  `UID:${Date.now()}@jindalsteel.com`,
  `DTSTAMP:${icsDate(new Date())}`,
  `DTSTART:${icsDate(start)}`,
  `DTEND:${icsDate(end)}`,
  'SUMMARY:Punch-out shift',
  `DESCRIPTION:Punch-in ${formatMinutes12(startMinutes)} (${formatMinutes24(startMinutes)}), Punch-out ${formatMinutes12(totalMinutes)} (${formatMinutes24(totalMinutes)})`,
  'END:VEVENT',
  'END:VCALENDAR',
];
const NL = String.fromCharCode(13, 10); // <<< change here
const ics = lines.join(NL);             // <<< and here
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'punch-shift.ics'; a.click(); setTimeout(()=>URL.revokeObjectURL(url), 1000);
  }

  // Share text
  async function shareSummary() {
    if (!isValid) return;
    const text = `Punch-in: ${punchIn}
Hours: ${hours} + break ${breakMin}m
Punch-out: ${out12} (${out24}) ${offsetLabel ? '['+offsetLabel+']' : ''}`;
    try {
      if (navigator.share) { await navigator.share({ text, title: 'Punch-Out' }); }
      else { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false), 1200); }
    } catch {}
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="w-full max-w-4xl">
        <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <motion.div initial={{ rotate: -8 }} animate={{ rotate: [ -8, 8, -8 ] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="p-2 rounded-xl bg-gradient-to-br from-pink-500/30 to-rose-500/30"><CalendarClock className="h-6 w-6 text-pink-300" /></motion.div>
            <div><h1 className="text-xl md:text-2xl font-semibold tracking-tight inline-flex items-center gap-2">Punch‑Out Time Calculator</h1><p className="text-slate-300 text-sm">12‑hour shown first for India. Choose time via native input, quick 15‑min list, or drag clock. Break + rounding + presets included.</p></div>
          </div>

          {/* Shift presets */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 mt-2 inline-flex items-center gap-1"><AlarmClock className="h-3 w-3"/>Presets:</span>
            <button onClick={()=>setPreset('09:00', 8.5)} className="rounded-xl px-3 py-2 text-sm bg-white/10 hover:bg-white/15 border border-white/15 inline-flex items-center gap-2"><Sun className="h-4 w-4"/>General 9:00 / 8.5h</button>
            <button onClick={()=>setPreset('07:00', 8)} className="rounded-xl px-3 py-2 text-sm bg-white/10 hover:bg-white/15 border border-white/15 inline-flex items-center gap-2"><Sun className="h-4 w-4"/>Morning 7:00 / 8h</button>
            <button onClick={()=>setPreset('13:00', 9)} className="rounded-xl px-3 py-2 text-sm bg-white/10 hover:bg-white/15 border border-white/15 inline-flex items-center gap-2"><Sun className="h-4 w-4"/>Evening 13:00 / 9h</button>
            <button onClick={()=>setPreset('21:00', 9)} className="rounded-xl px-3 py-2 text-sm bg-white/10 hover:bg-white/15 border border-white/15 inline-flex items-center gap-2"><Moon className="h-4 w-4"/>Night 21:00 / 9h</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Native time */}
            <label className="flex flex-col gap-2 md:col-span-1">
              <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Clock className="h-4 w-4"/>Punch‑in (type/system)</span>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60"/>
                <input type="time" step={60} value={punchIn} onChange={(e)=>setPunchIn(e.target.value)} className="w-full rounded-xl bg-white/10 border border-white/20 pl-9 pr-3 py-3 outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent" placeholder="09:00" />
              </div>
            </label>

            {/* 15‑min quick picker */}
            <label className="flex flex-col gap-2 md:col-span-1">
              <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Timer className="h-4 w-4"/>Punch‑in (15‑min quick pick)</span>
              <QuickTimeSelect value={punchIn} onChange={setPunchIn} />
            </label>

            {/* Hours */}
            <label className="flex flex-col gap-2 md:col-span-1">
              <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Target className="h-4 w-4"/>Hours of work</span>
              <select value={hours} onChange={(e)=>setHours(Number(e.target.value))} className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-3 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent">
                {[8,8.5,9,9.5,10].map((opt) => (<option key={opt} value={opt} className="bg-slate-900">{opt} hrs</option>))}
              </select>
            </label>

            {/* Break */}
            <label className="flex flex-col gap-2 md:col-span-1">
              <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Coffee className="h-4 w-4"/>Unpaid break</span>
              <select value={breakMin} onChange={(e)=>setBreakMin(Number(e.target.value))} className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-3 outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent">
                {[0,15,30,45,60].map((m)=> (<option key={m} value={m} className="bg-slate-900">{m===0? 'No break': `${m} min`}</option>))}
              </select>
            </label>
          </div>

          {/* Extras row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <label className="flex flex-col gap-2">
              <span className="text-sm text-slate-300 inline-flex items-center gap-2"><Target className="h-4 w-4"/>Rounding</span>
              <select value={roundStep} onChange={(e)=>setRoundStep(Number(e.target.value))} className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-3 outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent">
                <option value={0} className="bg-slate-900">No rounding</option>
                <option value={5} className="bg-slate-900">Nearest 5 min</option>
                <option value={15} className="bg-slate-900">Nearest 15 min</option>
              </select>
            </label>

            <div className="flex items-end gap-2">
              <button type="button" onClick={()=>setShowClock(true)} className="w-full rounded-xl px-3 py-3 border border-pink-500/40 bg-gradient-to-br from-pink-600/20 to-rose-600/20 text-pink-100 hover:from-pink-600/30 hover:to-rose-600/30 inline-flex items-center justify-center gap-2"><Clock className="h-4 w-4"/>Open drag clock</button>
            </div>
          </div>

          {/* Result */}
          <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-pink-950/30 to-rose-950/20 p-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <motion.div initial={{ scale: 1 }} animate={{ scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 2.4 }} className="p-2 rounded-lg bg-pink-500/15 ring-1 ring-pink-500/30"><Clock className="h-5 w-5 text-pink-300" /></motion.div>
                <div>
                  <p className="text-sm text-slate-300">Punch‑out time</p>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <motion.p key={out12} initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl font-semibold tracking-tight text-emerald-300">{out12}</motion.p>
                    <p className="text-slate-300">({out24})</p>
                    {offsetLabel && (<span className="text-xs px-2 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">{offsetLabel}</span>)}
                    {overtime && (<span className="text-xs px-2 py-1 rounded-md bg-red-500/15 text-red-300 border border-red-500/30 inline-flex items-center gap-1"><AlarmClock className="h-3 w-3"/>Overtime</span>)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={()=>isValid && downloadICS()} disabled={!isValid} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-white/20 bg-white/10 hover:bg-white/15 disabled:opacity-50" title="Add to calendar"><CalendarPlus className="h-4 w-4"/><span>.ics</span></button>
                <button type="button" onClick={shareSummary} disabled={!isValid} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-white/20 bg-white/10 hover:bg-white/15 disabled:opacity-50" title="Share"><Share2 className="h-4 w-4"/><span>Share</span></button>
                <button type="button" onClick={()=>{ if(isValid) { navigator.clipboard.writeText(`${out12} (${out24})`); setCopied(true); setTimeout(()=>setCopied(false), 900);} }} disabled={!isValid} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-white/20 bg-white/10 hover:bg-white/15 disabled:opacity-50" title="Copy result">
                  <AnimatePresence initial={false} mode="wait">
                    {copied ? (
                      <motion.span key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="inline-flex items-center gap-2"><ClipboardCheck className="h-4 w-4"/>Copied</motion.span>
                    ) : (
                      <motion.span key="copy" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="inline-flex items-center gap-2"><Clipboard className="h-4 w-4"/>Copy</motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
            {!isValid && (<p className="text-sm text-rose-300 mt-3">Enter/select a valid punch‑in time to calculate.</p>)}
            <p className="sr-only" aria-live="polite">Punch-out time {out12} ({out24})</p>
          </div>
        </div>
      </motion.div>

      {showClock && (<DragClock initial={punchIn || "09:00"} onClose={()=>setShowClock(false)} onSelect={setPunchIn} />)}
    </div>
  );
}
