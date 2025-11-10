"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Download, Bell, User, ArrowDownToLine } from "lucide-react";
import Link from "next/link";

/* --------------------------------------------
   Config: sections grouped for the sidebar
--------------------------------------------- */
type Section = { id: string; label: string; group: "Elements" | "Components" | "Custom" };
const SECTIONS: Section[] = [
  { id: "buttons", label: "Buttons", group: "Elements" },
  { id: "badges", label: "Badges", group: "Components" },
  { id: "cards",  label: "Cards",  group: "Custom"     },
];

/* --------------------------------------------
   Page
--------------------------------------------- */
export default function Library1Page() {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

const normalize = (s: string) => s.trim().toLowerCase();



  // group sidebar items
  const grouped = useMemo(() => {
    const by = { Elements: [] as Section[], Components: [] as Section[], Custom: [] as Section[] };
    for (const s of SECTIONS) (by as any)[s.group].push(s);
    return by;
  }, []);

  // Focus search on any typing (without modifier keys). ESC clears.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isTypingKey = e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey;
      if (isTypingKey && document.activeElement !== searchRef.current) {
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setQuery("");
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Smooth scroll inside the content area
  const scrollToId = (id: string) => {
    const container = contentRef.current;
    const el = container?.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    if (!container || !el) return;
    const top = el.offsetTop - 12; // small offset for section heading
    container.scrollTo({ top, behavior: "smooth" });
  };

  // Optional: simple client-side filter of visible sections (by label)
  const visibleSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SECTIONS.map((s) => s.id);
    return SECTIONS.filter((s) => s.label.toLowerCase().includes(q)).map((s) => s.id);
  }, [query]);

  return (
    <div className="min-h-[100dvh] grid grid-cols-1 md:grid-cols-[260px_1fr] bg-base-200">
      {/* Sidebar */}
      <aside className="border-r border-base-300 bg-base-100/70 backdrop-blur">
        <div className="sticky top-0 z-10 space-y-3 border-b border-base-300 bg-base-100 p-3">
          {/* <div className="flex items-center gap-2">
            <Link href="/" className="btn btn-ghost btn-sm">← Home</Link>
            <h1 className="text-lg font-semibold">Library 1</h1>
          </div> */}
          <input
  ref={searchRef}
  value={query}
  onChange={(e) => {
    const q = e.target.value;
    setQuery(q);

    // Auto-scroll to the first matching section while typing
    const nq = normalize(q);
    if (nq) {
      const target = SECTIONS.find(s => normalize(s.label).includes(nq));
      if (target) scrollToId(target.id);
    }
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      const nq = normalize(query);
      const target = SECTIONS.find(s => normalize(s.label).includes(nq));
      if (target) scrollToId(target.id);
    }
    if (e.key === "Escape") {
      setQuery("");
      searchRef.current?.blur();
    }
  }}
  placeholder="Search sections…"
  className="input input-sm input-bordered w-full"
  aria-label="Search sections"
/>
        </div>

        <nav className="p-3 space-y-6">
          {/* Elements */}
          <div>
            <div className="mb-2 text-xs uppercase tracking-wide text-base-content/60">Elements</div>
            <ul className="menu menu-sm rounded-lg bg-base-200 p-2">
              {grouped.Elements.map((s) => (
                <li key={s.id} className={visibleSections.includes(s.id) ? "" : "hidden"}>
                  <button onClick={() => scrollToId(s.id)}>{s.label}</button>
                </li>
              ))}
            </ul>
          </div>
          {/* Components */}
          <div>
            <div className="mb-2 text-xs uppercase tracking-wide text-base-content/60">Components</div>
            <ul className="menu menu-sm rounded-lg bg-base-200 p-2">
              {grouped.Components.map((s) => (
                <li key={s.id} className={visibleSections.includes(s.id) ? "" : "hidden"}>
                  <button onClick={() => scrollToId(s.id)}>{s.label}</button>
                </li>
              ))}
            </ul>
          </div>
          {/* Custom */}
          <div>
            <div className="mb-2 text-xs uppercase tracking-wide text-base-content/60">Custom</div>
            <ul className="menu menu-sm rounded-lg bg-base-200 p-2">
              {grouped.Custom.map((s) => (
                <li key={s.id} className={visibleSections.includes(s.id) ? "" : "hidden"}>
                  <button onClick={() => scrollToId(s.id)}>{s.label}</button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </aside>

      {/* Content area */}
      <main ref={contentRef} className="max-h-[100dvh] overflow-y-auto">
        <div className="container mx-auto p-6 space-y-12">
          {/* Buttons section */}
          <section id="buttons" className="scroll-mt-16 space-y-6">
            <h2 className="text-2xl font-bold border-b border-base-300 pb-2">Buttons</h2>

            {/* Solids */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h3 className="card-title text-base mb-2">Solid</h3>
                <div className="flex flex-wrap gap-2">
                  <button className="cpy btn">Default</button>
                  <button className="cpy btn btn-primary">Primary</button>
                  <button className="cpy btn btn-secondary">Secondary</button>
                  <button className="cpy btn btn-accent">Accent</button>
                  <button className="cpy btn btn-info">Info</button>
                  <button className="cpy btn btn-success">Success</button>
                  <button className="cpy btn btn-warning">Warning</button>
                  <button className="cpy btn btn-error">Error</button>
                </div>
              </div>
            </div>

            {/* Outline & Ghost */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h3 className="card-title text-base mb-2">Outline / Ghost / Link</h3>
                <div className="flex flex-wrap gap-2">
                  <button className="cpy btn btn-outline">Outline</button>
                  <button className="cpy btn btn-outline btn-primary">Outline Primary</button>
                  <button className="cpy btn btn-outline btn-secondary">Outline Secondary</button>
                  <button className="cpy btn btn-ghost">Ghost</button>
                  <button className="cpy btn btn-link">Link</button>
                </div>
              </div>
            </div>

            {/* Sizes & Shapes */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h3 className="card-title text-base mb-2">Sizes / Shapes</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <button className="btn btn-xs">xs</button>
                  <button className="btn btn-sm">sm</button>
                  <button className="btn">md</button>
                  <button className="btn btn-lg">lg</button>
                  <button className="btn btn-circle">◎</button>
                  <button className="btn btn-square">■</button>
                  <button className="btn btn-wide">Wide</button>
                  <button className="btn btn-block">Block</button>
                </div>
              </div>
            </div>

            {/* States */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h3 className="card-title text-base mb-2">States</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <button className="btn">
                    <span className="loading loading-spinner"></span>
                    Loading
                  </button>
                  <button className="btn" disabled>Disabled</button>
                  <button className="btn btn-primary no-animation">No Animation</button>
                  <button className="btn btn-glass">Glass</button>
                </div>
              </div>
            </div>

            {/* With icons */}
<div className="card bg-base-100 shadow">
  <div className="card-body">
    <h3 className="card-title text-base mb-2">With Icons</h3>

    <div className="flex flex-wrap items-center gap-2">
      {/* Solid PLUS icon (fills with current text color) */}



      
    </div>

<div className="flex flex-wrap items-center gap-2">
  <button className="btn btn-primary">
    <Plus className="h-4 w-4 shrink-0" />
    Add
  </button>
  <button className="btn">
    Download
    <ArrowDownToLine className="h-4 w-4 shrink-0" />
  </button>
</div>

  </div>
</div>

          </section>

          {/* Badges section */}
          <section id="badges" className="scroll-mt-16 space-y-6">
            <h2 className="text-2xl font-bold border-b border-base-300 pb-2">Badges</h2>
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <div className="flex flex-wrap gap-2">
                  <div className="badge">Default</div>
                  <div className="badge badge-neutral">Neutral</div>
                  <div className="badge badge-primary">Primary</div>
                  <div className="badge badge-secondary">Secondary</div>
                  <div className="badge badge-accent">Accent</div>
                  <div className="badge badge-info">Info</div>
                  <div className="badge badge-success">Success</div>
                  <div className="badge badge-warning">Warning</div>
                  <div className="badge badge-error">Error</div>
                  <div className="badge badge-outline">Outline</div>
                </div>
              </div>
            </div>
          </section>

          {/* Cards section */}
          <section id="cards" className="scroll-mt-16 space-y-6">
            <h2 className="text-2xl font-bold border-b border-base-300 pb-2">Cards</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card bg-base-100 shadow">
                  <div className="card-body">
                    <h3 className="card-title">Card {i}</h3>
                    <p>Example content to demonstrate scrolling context.</p>
                    <div className="card-actions justify-end">
                      <button className="btn btn-primary btn-sm">Action</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
