"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Download, Bell, User, ArrowDownToLine } from "lucide-react";
import CardMaster from "@/components/tools/CardMaster/page";
import Link from "next/link";

/* --------------------------------------------
   Config: sections grouped for the sidebar
--------------------------------------------- */
type Section = { id: string; label: string; group: "Elements" | "Components" | "Custom" };

const SECTIONS: Section[] = [
    { id: "buttons", label: "Buttons", group: "Elements" },
    { id: "badges", label: "Badges", group: "Components" },
    { id: "avatars", label: "Avatars", group: "Components" }, // ← new
    { id: "cards", label: "Cards", group: "Custom" },
];

/* --------------------------------------------
   Page
--------------------------------------------- */
export default function Library1Page() {
    const [query, setQuery] = useState("");
    const searchRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const normalize = (s: string) => s.trim().toLowerCase();

    // Click to Copy Code
    const [copiedMsg, setCopiedMsg] = useState<string | null>(null);
    useEffect(() => {
        const container = contentRef.current;
        if (!container) return;

        const onClick = async (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest(".cpy") as HTMLElement | null;
            if (!target) return;

            // Prevent accidental form submits / focus side effects
            e.preventDefault();

            // Clone the clicked element and remove the 'cpy' class from that element
            const clone = target.cloneNode(true) as HTMLElement;
            clone.classList.remove("cpy");

            // Serialize the outer HTML (no formatting needed; paste-ready)
            const toCopy = clone.outerHTML;

            try {
                await navigator.clipboard.writeText(toCopy);
                setCopiedMsg("Copied component markup to clipboard");
                // auto-hide toast in ~1s
                window.setTimeout(() => setCopiedMsg(null), 1100);
            } catch {
                setCopiedMsg("Copy failed. Check clipboard permissions.");
                window.setTimeout(() => setCopiedMsg(null), 1500);
            }
        };

        container.addEventListener("click", onClick);
        return () => container.removeEventListener("click", onClick);
    }, []);





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
                                    <button className="cpy btn btn-xs">xs</button>
                                    <button className="cpy btn btn-sm">sm</button>
                                    <button className="cpy btn">md</button>
                                    <button className="cpy btn btn-lg">lg</button>
                                    <button className="cpy btn btn-circle">◎</button>
                                    <button className="cpy btn btn-square">■</button>
                                    <button className="cpy btn btn-wide">Wide</button>
                                    <button className="cpy btn btn-block">Block</button>
                                </div>
                            </div>
                        </div>

                        {/* States */}
                        <div className="card bg-base-100 shadow">
                            <div className="card-body">
                                <h3 className="card-title text-base mb-2">States</h3>
                                <div className="flex flex-wrap items-center gap-2">
                                    <button className="cpy btn">
                                        <span className="loading loading-spinner"></span>
                                        Loading
                                    </button>
                                    <button className="cpy btn" disabled>Disabled</button>
                                    <button className="cpy btn btn-primary no-animation">No Animation</button>
                                    <button className="cpy btn btn-glass">Glass</button>
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
                                    <button className="cpy btn btn-primary">
                                        <Plus className="h-4 w-4 shrink-0" />
                                        Add
                                    </button>
                                    <button className="cpy btn">
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
                                    <div className="cpy badge">Default</div>
                                    <div className="cpy badge badge-neutral">Neutral</div>
                                    <div className="cpy badge badge-primary">Primary</div>
                                    <div className="cpy badge badge-secondary">Secondary</div>
                                    <div className="cpy badge badge-accent">Accent</div>
                                    <div className="cpy badge badge-info">Info</div>
                                    <div className="cpy badge badge-success">Success</div>
                                    <div className="cpy badge badge-warning">Warning</div>
                                    <div className="cpy badge badge-error">Error</div>
                                    <div className="cpy badge badge-outline">Outline</div>
                                </div>
                            </div>
                        </div>
                    </section>


                    {/* Avatars section — compact tile grid in one white box */}
                    <section id="avatars" className="scroll-mt-16 space-y-6">
                        <div className="card bg-base-100 shadow">
                            <div className="card-body">
                                <h2 className="text-2xl font-bold border-b border-base-300 pb-2">Avatars1</h2>
                                {/* Tight, responsive grid: shrinks tiles and wraps cleanly */}
                                <div className="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-3">

                                    {/* Basic + Sizes */}
                                    <div className="rounded-xl bg-base-200 p-3 grid place-items-center">
                                        <div className="cpy avatar">
                                            <div className="w-8 rounded">
                                                <img src="https://i.pravatar.cc/80?img=1" alt="xs" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-base-200 p-3 grid place-items-center">
                                        <div className="cpy avatar">
                                            <div className="w-12 rounded">
                                                <img src="https://i.pravatar.cc/100?img=2" alt="sm" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-base-200 p-3 grid place-items-center">
                                        <div className="cpy avatar">
                                            <div className="w-16 rounded">
                                                <img src="https://i.pravatar.cc/120?img=3" alt="md" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-base-200 p-3 grid place-items-center">
                                        <div className="cpy avatar">
                                            <div className="w-20 rounded">
                                                <img src="https://i.pravatar.cc/160?img=4" alt="lg" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ring + Status */}
                                    <div className="rounded-xl bg-base-200 p-3 grid place-items-center">
                                        <div className="cpy avatar">
                                            <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                <img src="https://i.pravatar.cc/120?img=5" alt="ring" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-base-200 p-3 grid place-items-center">
                                        <div className="cpy avatar online">
                                            <div className="w-16 rounded-full">
                                                <img src="https://i.pravatar.cc/120?img=6" alt="online" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-base-200 p-3 grid place-items-center">
                                        <div className="cpy avatar offline">
                                            <div className="w-16 rounded-full">
                                                <img src="https://i.pravatar.cc/120?img=7" alt="offline" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Placeholder / Initials / Icon */}
                                    <div className="rounded-xl bg-base-200 p-3 grid place-items-center">
                                        <div className="cpy avatar placeholder">
                                            <div className="w-16 rounded-full bg-neutral text-neutral-content">
                                                <span>DJ</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-base-200 p-3 grid place-items-center">
                                        <div className="cpy avatar placeholder">
                                            <div className="w-16 rounded-full bg-base-300 text-base-content">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a8.25 8.25 0 0 1 15 0" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Indicators (badge + dot) */}
                                    <div className="rounded-xl bg-base-200 p-3 grid place-items-center">
                                        <div className="cpy indicator">
                                            <span className="indicator-item badge badge-secondary">9+</span>
                                            <div className="avatar">
                                                <div className="w-16 rounded-full">
                                                    <img src="https://i.pravatar.cc/120?img=8" alt="badge" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-base-200 p-3 grid place-items-center">
                                        <div className="cpy indicator">
                                            <span className="indicator-item indicator-bottom indicator-end badge badge-xs badge-success"></span>
                                            <div className="avatar">
                                                <div className="w-16 rounded-full">
                                                    <img src="https://i.pravatar.cc/120?img=9" alt="dot" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shapes (mask utils) */}
                                    <div className="rounded-xl bg-base-200 p-3 grid place-items-center">
                                        <div className="cpy avatar">
                                            <div className="w-16 mask mask-squircle">
                                                <img src="https://i.pravatar.cc/120?img=10" alt="squircle" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-base-200 p-3 grid place-items-center">
                                        <div className="cpy avatar">
                                            <div className="w-16 mask mask-hexagon">
                                                <img src="https://i.pravatar.cc/120?img=11" alt="hexagon" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-base-200 p-3 grid place-items-center">
                                        <div className="cpy avatar">
                                            <div className="w-16 mask mask-triangle">
                                                <img src="https://i.pravatar.cc/120?img=12" alt="triangle" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-base-200 p-3 grid place-items-center">
                                        <div className="cpy avatar">
                                            <div className="w-16">
                                                <img src="https://i.pravatar.cc/120?img=13" alt="square" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Group */}
                                    <div className="rounded-xl bg-base-200 p-3 grid place-items-center">
                                        <div className="cpy avatar-group -space-x-3 rtl:space-x-reverse">
                                            <div className="avatar">
                                                <div className="w-10"><img src="https://i.pravatar.cc/100?img=14" alt="a" /></div>
                                            </div>
                                            <div className="avatar">
                                                <div className="w-10"><img src="https://i.pravatar.cc/100?img=15" alt="b" /></div>
                                            </div>
                                            <div className="avatar">
                                                <div className="w-10"><img src="https://i.pravatar.cc/100?img=16" alt="c" /></div>
                                            </div>
                                            <div className="avatar placeholder">
                                                <div className="w-10 bg-neutral text-neutral-content">
                                                    <span>+3</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* /grid */}
                            </div>
                        </div>
                    </section>





                    {/* Avatars section */}
                    <section id="avatars" className="scroll-mt-16 space-y-6">
                        <h2 className="text-2xl font-bold border-b border-base-300 pb-2">Avatars</h2>

                        {/* Basic + Sizes */}
                        <div className="card bg-base-100 shadow">
                            <div className="card-body">
                                <h3 className="card-title text-base mb-2">Basic & Sizes</h3>
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="cpy avatar">
                                        <div className="w-8 rounded">
                                            <img src="https://i.pravatar.cc/80?img=1" alt="avatar xs" />
                                        </div>
                                    </div>
                                    <div className="cpy avatar">
                                        <div className="w-12 rounded">
                                            <img src="https://i.pravatar.cc/100?img=2" alt="avatar sm" />
                                        </div>
                                    </div>
                                    <div className="cpy avatar">
                                        <div className="w-16 rounded">
                                            <img src="https://i.pravatar.cc/120?img=3" alt="avatar md" />
                                        </div>
                                    </div>
                                    <div className="cpy avatar">
                                        <div className="w-20 rounded">
                                            <img src="https://i.pravatar.cc/160?img=4" alt="avatar lg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ring / Status */}
                        <div className="card bg-base-100 shadow">
                            <div className="card-body">
                                <h3 className="card-title text-base mb-2">Ring & Status</h3>
                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="cpy avatar">
                                        <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <img src="https://i.pravatar.cc/120?img=5" alt="ring" />
                                        </div>
                                    </div>
                                    <div className="cpy avatar online">
                                        <div className="w-16 rounded-full">
                                            <img src="https://i.pravatar.cc/120?img=6" alt="online" />
                                        </div>
                                    </div>
                                    <div className="cpy avatar offline">
                                        <div className="w-16 rounded-full">
                                            <img src="https://i.pravatar.cc/120?img=7" alt="offline" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Placeholder / Initials / Icon */}
                        <div className="card bg-base-100 shadow">
                            <div className="card-body">
                                <h3 className="card-title text-base mb-2">Placeholder</h3>
                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="cpy avatar placeholder">
                                        <div className="w-16 rounded-full bg-neutral text-neutral-content">
                                            <span>DJ</span>
                                        </div>
                                    </div>
                                    <div className="cpy avatar placeholder">
                                        <div className="w-16 rounded-full bg-base-300 text-base-content">
                                            {/* icon */}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a8.25 8.25 0 0 1 15 0" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Indicator (badge/dot) */}
                        <div className="card bg-base-100 shadow">
                            <div className="card-body">
                                <h3 className="card-title text-base mb-2">Indicators</h3>
                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="cpy indicator">
                                        <span className="indicator-item badge badge-secondary">9+</span>
                                        <div className="avatar">
                                            <div className="w-16 rounded-full">
                                                <img src="https://i.pravatar.cc/120?img=8" alt="indicator badge" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="cpy indicator">
                                        <span className="indicator-item indicator-bottom indicator-end badge badge-xs badge-success"></span>
                                        <div className="avatar">
                                            <div className="w-16 rounded-full">
                                                <img src="https://i.pravatar.cc/120?img=9" alt="indicator dot" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shapes (mask utilities) */}
                        <div className="card bg-base-100 shadow">
                            <div className="card-body">
                                <h3 className="card-title text-base mb-2">Shapes (Mask)</h3>
                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="cpy avatar">
                                        <div className="w-16 mask mask-squircle">
                                            <img src="https://i.pravatar.cc/120?img=10" alt="squircle" />
                                        </div>
                                    </div>
                                    <div className="cpy avatar">
                                        <div className="w-16 mask mask-hexagon">
                                            <img src="https://i.pravatar.cc/120?img=11" alt="hexagon" />
                                        </div>
                                    </div>
                                    <div className="cpy avatar">
                                        <div className="w-16 mask mask-triangle">
                                            <img src="https://i.pravatar.cc/120?img=12" alt="triangle" />
                                        </div>
                                    </div>
                                    <div className="cpy avatar">
                                        <div className="w-16">
                                            <img src="https://i.pravatar.cc/120?img=13" alt="square" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Group */}
                        <div className="card bg-base-100 shadow">
                            <div className="card-body">
                                <h3 className="card-title text-base mb-2">Avatar Group</h3>
                                <div className="cpy avatar-group -space-x-3 rtl:space-x-reverse">
                                    <div className="avatar">
                                        <div className="w-10"><img src="https://i.pravatar.cc/100?img=14" alt="a" /></div>
                                    </div>
                                    <div className="avatar">
                                        <div className="w-10"><img src="https://i.pravatar.cc/100?img=15" alt="b" /></div>
                                    </div>
                                    <div className="avatar">
                                        <div className="w-10"><img src="https://i.pravatar.cc/100?img=16" alt="c" /></div>
                                    </div>
                                    <div className="avatar placeholder">
                                        <div className="w-10 bg-neutral text-neutral-content">
                                            <span>+3</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>




                    {/* Cards section */}
                    <section id="cards" className="scroll-mt-16 space-y-6">
                        <h2 className="text-2xl font-bold border-b border-base-300 pb-2">Cards</h2>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {/* 1) Basic */}
                            <CardMaster
                                variant="basic"
                                title="Basic Card"
                                subtitle="Just title + text + actions"
                                description="Use this when you need a simple block of content."
                                badges={[{ text: "New", color: "success" }]}
                                actions={[
                                    { label: "Primary", color: "primary", cpy: true },
                                    { label: "Ghost", color: "ghost", outline: true, cpy: true },
                                ]}
                            />

                            {/* 2) Media on top */}
                            <CardMaster
                                variant="mediaTop"
                                mediaSrc="https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1200&auto=format&fit=crop"
                                mediaAlt="Mountains"
                                title="Media Top"
                                subtitle="Beautiful cover"
                                description="Header image with content below. Great for blog/product cards."
                                badges={[{ text: "Featured", color: "primary" }]}
                                actions={[
                                    { label: "Read more", color: "primary", cpy: true },
                                    { label: "Share", outline: true, cpy: true },
                                ]}
                            />

                            {/* 3) Media side */}
                            <CardMaster
                                variant="mediaSide"
                                mediaSrc="https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=1200&auto=format&fit=crop"
                                mediaAlt="Laptop"
                                title="Media Side"
                                subtitle="Split layout"
                                description="When you want the image to sit beside the text on large screens."
                                actions={[
                                    { label: "Details", color: "secondary", cpy: true },
                                ]}
                            />

                            {/* 4) Profile */}
                            <CardMaster
                                variant="profile"
                                avatarSrc="https://i.pravatar.cc/100?img=12"
                                avatarAlt="User"
                                title="Arjun Mehta"
                                subtitle="Product Designer"
                                description="Focused on component systems, accessibility, and motion."
                                badges={[{ text: "Available", color: "success" }]}
                                actions={[
                                    { label: "Message", color: "primary", cpy: true },
                                    { label: "Follow", outline: true, cpy: true },
                                ]}
                            />

                            {/* 5) Product */}
                            <CardMaster
                                variant="product"
                                mediaSrc="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop"
                                mediaAlt="Headphones"
                                title="Nova Headphones"
                                subtitle="Wireless • ANC"
                                price="$129"
                                rating={4.5}
                                ratingCount={128}
                                badges={[{ text: "Best Seller", color: "warning" }]}
                                actions={[
                                    { label: "Add to Cart", color: "primary", cpy: true },
                                    { label: "Wishlist", outline: true, cpy: true },
                                ]}
                            />

                            {/* 6) Stats */}
                            <CardMaster
                                variant="stats"
                                title="Monthly Overview"
                                subtitle="August 2025"
                                stats={[
                                    { label: "Revenue", value: "$42,300", helper: "+8.1% MoM" },
                                    { label: "Orders", value: "1,238", helper: "+2.4% MoM" },
                                    { label: "Refunds", value: "14", helper: "-0.6% MoM" },
                                    { label: "NPS", value: "62", helper: "+4 vs last" },
                                ]}
                                actions={[
                                    { label: "View report", color: "primary", cpy: true },
                                ]}
                            />

                            {/* 7) List */}
                            <CardMaster
                                variant="list"
                                title="Tasks"
                                subtitle="Today"
                                items={[
                                    { title: "Design review", meta: "10:00 AM – UI kit sync" },
                                    { title: "Ship dashboard", meta: "PR #451 ready for QA" },
                                    { title: "Call supplier", meta: "ETA confirmation" },
                                ]}
                                actions={[
                                    { label: "Add task", color: "primary", cpy: true },
                                ]}
                            />
                        </div>
                    </section>



                </div>
            </main>
        </div>
    );
}
