"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/** ---------- Types ---------- */
type FooterProps = {
  name?: string;
  role?: string;
  avatarId?: number;
  leftId?: number;
  rightTopId?: number;
  rightBottomId?: number;
  eyebrow?: string;
  title?: string;
  body?: string;
};

type RegistryItem = {
  key: string;
  label: string;
  Comp: React.ComponentType<FooterProps>;
  defaultProps: FooterProps;
  previewProps?: FooterProps;
};

/** ---------- Icons ---------- */

// Put near the top of the file (under icons or just above FloatingLibrary)
const THUMB_W = 220;  // was 256
const THUMB_H = 96;   // was 160 (tall)


const ChevronUp = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <path d="M18 15l-6-6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronDown = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Minus = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <path d="M5 12h14" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const Restore = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <path d="M4 8V4h4M20 16v4h-4" strokeWidth="2" strokeLinecap="round" />
    <rect x="7" y="7" width="10" height="10" rx="2" strokeWidth="2" />
  </svg>
);
const ChevronLeft = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronRight = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <path d="M9 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** ---------- Auto-discover footers from parent folder (../Footer*.tsx) ---------- */
type FooterModule = {
  default: React.ComponentType<FooterProps>;
  label?: string;
  defaultProps?: FooterProps;
  previewProps?: FooterProps;
};

declare const require: any;

// Extract numeric index for natural sort (Footer2 < Footer10)
const footerIndex = (fileKey: string) => {
  const clean = fileKey.replace(/^\.\/|(\.tsx|\.jsx|\.ts|\.js)$/g, ""); // "Footer12"
  const m = clean.match(/Footer\s*(\d+)/i);
  return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
};

function useRegistry(): RegistryItem[] {
  const ctx = useMemo(() => require.context("..", false, /^\.\/Footer.*\.(t|j)sx$/), []);
  return useMemo<RegistryItem[]>(() => {
    const keys: string[] = ctx.keys().sort((a, b) => {
      const na = footerIndex(a), nb = footerIndex(b);
      return na === nb ? a.localeCompare(b) : na - nb;
    });
    return keys.map((k) => {
      const mod: FooterModule = ctx(k);
      const Comp = mod.default;
      const file = k.replace(/^\.\/|(\.tsx|\.jsx|\.ts|\.js)$/g, "");
      const friendly =
        mod.label ??
        file
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/Footer\s?(\d+)/i, "Footer $1")
          .trim();
      const defaults: FooterProps =
        mod.defaultProps ?? {
          name: "Preview",
          role: file,
          avatarId: 1005,
          leftId: 1060,
          rightTopId: 1069,
          rightBottomId: 1070,
          eyebrow: "Eyebrow",
          title: "Title",
          body: "Body text goes here...",
        };
      return { key: file, label: friendly, Comp, defaultProps: defaults, previewProps: mod.previewProps };
    });
  }, [ctx]);
}

/** ---------- Tailwind grid class maps (safelisted) ---------- */
// responsive (used when viewMode = "auto")
const SM_COLS: Record<number, string> = { 1:"sm:grid-cols-1", 2:"sm:grid-cols-2", 3:"sm:grid-cols-3", 4:"sm:grid-cols-4", 5:"sm:grid-cols-5", 6:"sm:grid-cols-6" };
const MD_COLS: Record<number, string> = { 1:"md:grid-cols-1", 2:"md:grid-cols-2", 3:"md:grid-cols-3", 4:"md:grid-cols-4", 5:"md:grid-cols-5", 6:"md:grid-cols-6" };
const LG_COLS: Record<number, string> = { 1:"lg:grid-cols-1", 2:"lg:grid-cols-2", 3:"lg:grid-cols-3", 4:"lg:grid-cols-4", 5:"lg:grid-cols-5", 6:"lg:grid-cols-6" };
const XL_COLS: Record<number, string> = { 1:"xl:grid-cols-1", 2:"xl:grid-cols-2", 3:"xl:grid-cols-3", 4:"xl:grid-cols-4", 5:"xl:grid-cols-5", 6:"xl:grid-cols-6" };
// non-responsive (used when simulating a fixed viewport)
const BASE_COLS: Record<number, string> = { 1:"grid-cols-1", 2:"grid-cols-2", 3:"grid-cols-3", 4:"grid-cols-4", 5:"grid-cols-5", 6:"grid-cols-6" };

/** ---------- Viewport simulator ---------- */
type ViewMode = "auto" | "sm" | "md" | "lg" | "xl";
const VIEW_WIDTH: Record<ViewMode, number | "auto"> = { auto: "auto", sm: 640, md: 768, lg: 1024, xl: 1280 };

/** ---------- Floating Library (compact, grey theme) ---------- */
type Pos = { x: number; y: number };
const Clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const ALL_KEY = "__ALL__"; // special key for "show all"

type FloatingLibraryProps = {
  registry: RegistryItem[];
  selectedKey: string;
  setSelectedKey: (k: string) => void;
  smCols: number; mdCols: number; lgCols: number; xlCols: number;
  setSmCols: (n: number) => void; setMdCols: (n: number) => void;
  setLgCols: (n: number) => void; setXlCols: (n: number) => void;
  viewMode: ViewMode; setViewMode: (v: ViewMode) => void;
};

const FloatingLibrary: React.FC<FloatingLibraryProps> = ({
  registry, selectedKey, setSelectedKey,
  smCols, mdCols, lgCols, xlCols, setSmCols, setMdCols, setLgCols, setXlCols,
  viewMode, setViewMode
}) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const augmented = useMemo(() => [{ key: ALL_KEY, label: "All Footers" } as any].concat(registry), [registry]);
  const total = augmented.length;
  const selectedIndex = Math.max(0, augmented.findIndex((r: any) => r.key === selectedKey));

  // drag
  const [pos, setPos] = useState<Pos>({ x: 16, y: 96 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState<Pos>({ x: 0, y: 0 });
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const el = listRef.current?.querySelectorAll<HTMLDivElement>("[data-item]")[selectedIndex];
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedIndex]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (!dragging) return; setPos({ x: Math.max(8, e.clientX - offset.x), y: Math.max(8, e.clientY - offset.y) }); };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging, offset]);

  const onMouseDownFooter = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDragging(true);
  };

  const prevFooter = () => { if (!total) return; setSelectedKey(augmented[(selectedIndex - 1 + total) % total].key); };
  const nextFooter = () => { if (!total) return; setSelectedKey(augmented[(selectedIndex + 1) % total].key); };

  return (
    <div className="fixed z-50" style={{ left: pos.x, top: pos.y, width: minimized ? 260 : 320 }} role="dialog" aria-label="Footer Library">
      {/* Footer */}
      <div onMouseDown={onMouseDownFooter} className="cursor-move select-none flex items-center justify-between rounded-t-2xl border border-b-0 border-neutral-700 bg-neutral-800 px-3 py-2 shadow">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-neutral-700 text-neutral-200 text-xs">CL</span>
          <span className="text-sm font-semibold text-neutral-100">Footer Library</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={prevFooter} className="rounded-lg border border-neutral-600 bg-neutral-700 p-1.5 text-neutral-100 hover:bg-neutral-600" aria-label="Previous"><ChevronLeft className="h-4 w-4" /></button>
          <span className="mx-1 text-xs tabular-nums text-neutral-200">{total ? selectedIndex + 1 : 0} / {total}</span>
          <button onClick={nextFooter} className="rounded-lg border border-neutral-600 bg-neutral-700 p-1.5 text-neutral-100 hover:bg-neutral-600" aria-label="Next"><ChevronRight className="h-4 w-4" /></button>
          <button aria-label={minimized ? "Restore" : "Minimize"} onClick={() => setMinimized((m) => !m)} className="ml-1 rounded-lg border border-neutral-600 bg-neutral-700 p-1.5 text-neutral-100 hover:bg-neutral-600">{minimized ? <Restore className="h-4 w-4" /> : <Minus className="h-4 w-4" />}</button>
        </div>
      </div>

      {!minimized && (
        <div className="rounded-b-2xl border border-neutral-700 bg-neutral-900 shadow-lg overflow-hidden">
          {/* Viewport buttons */}
          <div className="p-3 border-b border-neutral-700">
            <p className="text-xs text-neutral-300 mb-2">Viewport (breakpoint tester)</p>
            <div className="grid grid-cols-5 gap-2">
              {(["auto","sm","md","lg","xl"] as ViewMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`h-8 rounded-lg border text-xs uppercase ${
                    viewMode === mode ? "border-neutral-300 bg-neutral-200 text-neutral-900"
                                       : "border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                  }`}
                  title={mode === "auto" ? "Auto (fluid)" : `${mode.toUpperCase()}`}
                >
                  {mode === "auto" ? "AUTO" : mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Grid columns per breakpoint */}
          <div className="p-3 border-b border-neutral-700">
            <p className="text-xs text-neutral-300 mb-2">Grid columns per breakpoint</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "SM", val: smCols, set: setSmCols },
                { label: "MD", val: mdCols, set: setMdCols },
                { label: "LG", val: lgCols, set: setLgCols },
                { label: "XL", val: xlCols, set: setXlCols },
              ].map(({ label, val, set }) => (
                <div key={label} className="rounded-lg bg-neutral-800 border border-neutral-700 p-2 flex flex-col items-center gap-1">
                  <div className="text-[11px] text-neutral-300 uppercase">{label}</div>
                  <div className="flex items-center gap-2">
                    <button className="h-6 w-6 rounded-md bg-neutral-700 text-neutral-100 flex items-center justify-center hover:bg-neutral-600" onClick={() => set(Clamp(val - 1, 1, 6))}>–</button>
                    <div className="w-6 text-center text-sm text-neutral-100 tabular-nums">{val}</div>
                    <button className="h-6 w-6 rounded-md bg-neutral-700 text-neutral-100 flex items-center justify-center hover:bg-neutral-600" onClick={() => set(Clamp(val + 1, 1, 6))}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Previews (with an extra card for All) */}
          <div ref={listRef} className="relative overflow-y-auto pr-2" style={{ maxHeight: "50vh" }}>
            <div className="space-y-3 px-3 py-3">
              {/* All Footers card */}
              <div
                data-item
                className={`cursor-pointer rounded-xl border bg-neutral-800 text-neutral-100 transition-shadow ${
                  selectedKey === ALL_KEY ? "ring-2 ring-neutral-200 border-neutral-600 shadow" : "ring-1 ring-black/30 border-neutral-700 hover:shadow"
                }`}
                onClick={() => setSelectedKey(ALL_KEY)}
                title="All Footers"
              >
                <div className="relative w-[256px] h-[64px] overflow-hidden rounded-t-xl bg-neutral-950 flex items-center justify-center text-xs text-neutral-300">
                  Show All Footers
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium">All Footers</p>
                  <p className="text-[11px] text-neutral-400">{ALL_KEY}</p>
                </div>
              </div>

              {registry.map((item) => {
                const Preview = item.Comp;
                const active = item.key === selectedKey;
                return (
           <div
  key={item.key}
  data-item
  className={`cursor-pointer rounded-xl border bg-neutral-800 text-neutral-100 transition-shadow ${
    active ? "ring-2 ring-neutral-200 border-neutral-600 shadow" : "ring-1 ring-black/30 border-neutral-700 hover:shadow"
  }`}
  onClick={() => setSelectedKey(item.key)}
  title={item.label}
>
  {/* ↓↓↓ replace this block */}
  <div
    className="relative overflow-hidden rounded-t-xl bg-neutral-950"
    style={{ width: THUMB_W, height: THUMB_H }}
  >
    <div
      style={{
        transform: `scale(${THUMB_W / 640})`,
        transformOrigin: "top left",
        width: 640,
      }}
      className="absolute top-0 left-0"
    >
      <Preview {...(item.previewProps ?? item.defaultProps)} />
    </div>
  </div>
  {/* ↑↑↑ */}
  <div className="p-3">
    <p className="text-xs font-medium">{item.label}</p>
    <p className="text-[11px] text-neutral-400">{item.key}</p>
  </div>
</div>
                );
              })}
            </div>
          </div>

          <div className="px-3 pb-3 text-[11px] text-neutral-400">
            Drag this window by the footer. Click a footer to load it — or use "All Footers" to render everything.
          </div>
        </div>
      )}
    </div>
  );
};

/** ---------- Page (one-per-row; supports ALL vs SELECTED) ---------- */
export default function FooterViewerPage() {
  const registry = useRegistry();
  const [selectedKey, setSelectedKey] = useState<string>(registry[0]?.key ?? ALL_KEY); // keep selection, default to first
  const [smCols, setSmCols] = useState(2);
  const [mdCols, setMdCols] = useState(3);
  const [lgCols, setLgCols] = useState(4);
  const [xlCols, setXlCols] = useState(5);

  const [viewMode, setViewMode] = useState<ViewMode>("auto");
  const frameWidth = VIEW_WIDTH[viewMode];

  if (registry.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-100 p-8">
        <div className="mx-auto max-w-xl text-center bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-8">
          <h1 className="text-xl font-semibold mb-2">No footers discovered</h1>
          <p className="text-neutral-600 text-sm">
            Place files named <code>Footer*.tsx</code> in <code>/Library/Footers/</code> next to <code>FooterViewer</code>.
          </p>
        </div>
      </div>
    );
  }

  const selected = useMemo(
    () => registry.find((r) => r.key === selectedKey) ?? registry[0],
    [registry, selectedKey]
  );

  // Keeping gridClass logic (for future extension / previews), though we render single-column rows.
  const fixedCols =
    viewMode === "sm" ? smCols :
    viewMode === "md" ? mdCols :
    viewMode === "lg" ? lgCols :
    viewMode === "xl" ? xlCols : undefined;

  const gridClass = viewMode === "auto"
    ? `grid grid-cols-1 ${SM_COLS[smCols]} ${MD_COLS[mdCols]} ${LG_COLS[lgCols]} ${XL_COLS[xlCols]} gap-6`
    : `grid ${BASE_COLS[fixedCols!]} gap-6`;

  const isAll = selectedKey === ALL_KEY;

  // Single footer renderer (full width)
  const renderSingleFooter = (item: RegistryItem) => {
    const C = item.Comp;
    const props = item.previewProps ?? item.defaultProps;
    return (
      <section key={item.key} className="mb-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-neutral-900">{item.label}</h2>
          <div className="text-sm text-neutral-500">{item.key}</div>
        </div>
        <div className="grid grid-cols-1">
          <C {...props} />
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-100 p-4 md:p-8">
      {/* Floating Library */}
      <FloatingLibrary
        registry={registry}
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
        smCols={smCols} mdCols={mdCols} lgCols={lgCols} xlCols={xlCols}
        setSmCols={setSmCols} setMdCols={setMdCols} setLgCols={setLgCols} setXlCols={setXlCols}
        viewMode={viewMode} setViewMode={setViewMode}
      />

      {/* Viewport frame */}
      <div className="mx-auto" style={{ width: frameWidth === "auto" ? "100%" : `${frameWidth}px` }}>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold text-neutral-900">
            {isAll ? "All Footers" : selected.label}
          </h1>
        <div className="text-sm text-neutral-500">
            {isAll ? `${registry.length} variants` : selected.key}
          </div>
        </div>

        {/* Content: All = list each once; Selected = only that footer */}
        {isAll ? (
          <div>
            {registry.map(renderSingleFooter)}
          </div>
        ) : (
          renderSingleFooter(selected)
        )}

        {frameWidth !== "auto" && (
          <div className="mt-6 text-center text-xs text-neutral-500">
            Viewport width: {frameWidth}px (breakpoint: {viewMode.toUpperCase()})
          </div>
        )}
      </div>
    </div>
  );
}
