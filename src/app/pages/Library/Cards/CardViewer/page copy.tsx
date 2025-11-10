"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

/** ---------- Types ---------- */
type CardProps = {
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
  // dynamic loader (must default export a React component that accepts CardProps)
  Comp: React.ComponentType<CardProps>;
  defaultProps: CardProps;
  // optional preview props to ensure visual variety
  previewProps?: CardProps;
};

/** ---------- Icons ---------- */
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

/** ---------- Dynamic imports (disable SSR) ---------- */
const Card1 = dynamic(() => import("../Card1"), { ssr: false });
const Card2 = dynamic(() => import("../Card2"), { ssr: false });

/** ---------- Registry of available cards ---------- */
const useRegistry = (): RegistryItem[] =>
  useMemo(
    () => [
      {
        key: "Card1",
        label: "Card 1 — Profile Mosaic",
        Comp: Card1,
        defaultProps: {
          name: "Jerome Bell",
          role: "Photographer",
          avatarId: 1005,
          leftId: 1060,
          rightTopId: 1069,
          rightBottomId: 1070,
          eyebrow: "Photographs",
          title: "Lorem ipsun",
          body: "Minim dolor in amet nulla laboris enim dolore consequatt...",
        },
        previewProps: {
          name: "Preview",
          role: "Card 1",
          avatarId: 1011,
          leftId: 1027,
          rightTopId: 1040,
          rightBottomId: 1043,
        },
      },
      {
        key: "Card2",
        label: "Card 2 — Minimal Photo Card",
        Comp: Card2,
        defaultProps: {
          name: "Bessie Cooper",
          role: "Art Director",
          avatarId: 1012,
          leftId: 110,
          rightTopId: 111,
          rightBottomId: 112,
          eyebrow: "Projects",
          title: "Amet commodo",
          body: "Do tempor aliqua in deserunt proident. Nisi cupidatat id velit.",
        },
        previewProps: {
          name: "Preview",
          role: "Card 2",
          avatarId: 1033,
          leftId: 130,
          rightTopId: 131,
          rightBottomId: 132,
        },
      },
    ],
    []
  );

/** ---------- Helper: build demo items for the grid ---------- */
const makeGridData = (base: CardProps): CardProps[] => {
  // 8 slightly varied items (different picsum IDs so it looks unique)
  const ids = [
    [1060, 1069, 1070],
    [1027, 1040, 1043],
    [1035, 1038, 1041],
    [1080, 1082, 1084],
    [109, 110, 111],
    [120, 121, 122],
    [130, 131, 132],
    [140, 141, 142],
  ];
  return ids.map(([L, T, B], i) => ({
    ...base,
    name: base.name ?? `Person ${i + 1}`,
    leftId: L,
    rightTopId: T,
    rightBottomId: B,
    avatarId: (base.avatarId ?? 1005) + i,
  }));
};

/** ---------- Floating Library (Draggable + Minimize) ---------- */
type Pos = { x: number; y: number };
type FloatingLibraryProps = {
  registry: RegistryItem[];
  selectedKey: string;
  setSelectedKey: (k: string) => void;
};

const FloatingLibrary: React.FC<FloatingLibraryProps> = ({ registry, selectedKey, setSelectedKey }) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);

  // drag state
  const [pos, setPos] = useState<Pos>(() => {
    // start near top-left; safe area
    return { x: 16, y: 96 };
  });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState<Pos>({ x: 0, y: 0 });
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const idx = registry.findIndex((r) => r.key === selectedKey);
    setActiveIdx(Math.max(0, idx));
    const el = listRef.current?.querySelectorAll<HTMLDivElement>("[data-item]")[idx];
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedKey, registry]);

  const scrollByItems = (delta: number) => {
    const items = listRef.current?.querySelectorAll<HTMLDivElement>("[data-item]");
    if (!items || items.length === 0) return;
    let next = Math.min(items.length - 1, Math.max(0, activeIdx + delta));
    setActiveIdx(next);
    items[next].scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  // drag handlers
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      setPos((prev) => {
        const nx = e.clientX - offset.x;
        const ny = e.clientY - offset.y;
        // clamp a bit so header stays visible
        return { x: Math.max(8, nx), y: Math.max(8, ny) };
      });
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, offset]);

  const onMouseDownHeader = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDragging(true);
  };

  return (
    <div
      className="fixed z-50"
      style={{ left: pos.x, top: pos.y, width: minimized ? 260 : 360 }}
      role="dialog"
      aria-label="Card Library"
    >
      {/* Header (drag handle) */}
      <div
        onMouseDown={onMouseDownHeader}
        className="cursor-move select-none flex items-center justify-between rounded-t-2xl border border-b-0 border-neutral-200 bg-white px-3 py-2 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <img src={`https://picsum.photos/seed/jspl/36/36`} className="h-7 w-7 rounded" alt="logo" />
          <span className="text-sm font-semibold text-neutral-800">Card Library</span>
        </div>
        <button
          aria-label={minimized ? "Restore" : "Minimize"}
          onClick={() => setMinimized((m) => !m)}
          className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white p-1.5 hover:bg-neutral-50"
          title={minimized ? "Restore" : "Minimize"}
        >
          {minimized ? <Restore className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
        </button>
      </div>

      {/* Body */}
      {!minimized && (
        <div className="rounded-b-2xl border border-neutral-200 bg-white shadow-lg overflow-hidden">
          {/* Controls */}
          <div className="flex items-center justify-between p-3">
            <span className="text-xs text-neutral-600">Choose a card</span>
            <div className="flex gap-1">
              <button
                className="p-2 rounded-lg border hover:bg-neutral-50"
                onClick={() => scrollByItems(-1)}
                aria-label="Scroll up"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                className="p-2 rounded-lg border hover:bg-neutral-50"
                onClick={() => scrollByItems(1)}
                aria-label="Scroll down"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div
            ref={listRef}
            className="relative overflow-y-auto scroll-smooth pr-1"
            style={{ maxHeight: "60vh" }}
          >
            <div className="space-y-3 px-3 pb-3">
              {registry.map((item) => {
                const Preview = item.Comp;
                const active = selectedKey === item.key;
                return (
                  <div
                    key={item.key}
                    data-item
                    className={`cursor-pointer rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow ${
                      active ? "ring-2 ring-neutral-900" : "ring-1 ring-black/5"
                    }`}
                    onClick={() => setSelectedKey(item.key)}
                    title={item.label}
                  >
                    {/* Preview box: render the card scaled down */}
                    <div className="relative h-[220px] w-full overflow-hidden rounded-t-xl bg-neutral-50">
                      <div className="absolute top-0 left-0 origin-top-left scale-[0.55] -translate-x-6 -translate-y-6 pointer-events-none">
                        <Preview {...(item.previewProps ?? item.defaultProps)} />
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-medium text-neutral-900">{item.label}</p>
                      <p className="text-[11px] text-neutral-500">{item.key}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-3 pb-3 text-[11px] text-neutral-500">
            Drag this window by the header. It stays above the grid.
          </div>
        </div>
      )}
    </div>
  );
};

/** ---------- Page (grid takes full width; library floats) ---------- */
export default function CardViewerPage() {
  const registry = useRegistry();
  const [selectedKey, setSelectedKey] = useState<string>(registry[0]?.key ?? "Card1");
  const selected = useMemo(
    () => registry.find((r) => r.key === selectedKey) ?? registry[0],
    [registry, selectedKey]
  );
  const gridData = useMemo(() => makeGridData(selected.defaultProps), [selected]);

  return (
    <div className="min-h-screen bg-neutral-100 p-4 md:p-8">
      {/* Floating Library (draggable, minimizable) */}
      <FloatingLibrary
        registry={registry}
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
      />

      {/* Full-width main content */}
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold text-neutral-900">{selected.label}</h1>
          <div className="text-sm text-neutral-500">{selected.key}</div>
        </div>

        {/* Responsive Grid (fills full width) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {gridData.map((props, i) => {
            const C = selected.Comp;
            return <C key={i} {...props} />;
          })}
        </div>
      </div>
    </div>
  );
}
