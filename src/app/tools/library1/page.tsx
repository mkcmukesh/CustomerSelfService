"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Download, Bell, User, ArrowDownToLine, ArrowRight, Heart } from "lucide-react";
import CardMaster from "@/components/tools/CardMaster/page";
import CopyBadge from "@/components/CopyBadge";

import Link from "next/link";

/* --------------------------------------------
   Config: sections grouped for the sidebar
--------------------------------------------- */
type Section = { id: string; label: string; group: "Elements" | "Components" | "Custom" };

// LINKS SIDEBAR 
const SECTIONS: Section[] = [
    { id: "buttons", label: "Buttons", group: "Elements" },
    { id: "badges", label: "Badges", group: "Components" },
    { id: "avatars", label: "Avatars", group: "Components" }, // ← new
    { id: "dropdowns", label: "Dropdowns", group: "Components" },
    { id: "fabs", label: "FABs", group: "Components" },
    { id: "cards", label: "Cards", group: "Custom" },
    { id: "modals", label: "Modals", group: "Components" },
];

// Converts rendered HTML to React/TSX-ish markup
function htmlToTsx(html: string): string {
    let s = html;

    // class -> className
    s = s.replace(/\sclass=/g, " className=");

    // Common attribute camelCase
    s = s.replace(/\sfor=/g, " htmlFor=");
    s = s.replace(/\stabindex=/gi, " tabIndex=");
    s = s.replace(/\sreadonly(\s|>)/gi, " readOnly$1");
    s = s.replace(/\smaxlength=/gi, " maxLength=");
    s = s.replace(/\snovalidate(\s|>)/gi, " noValidate$1");
    s = s.replace(/\sautoplay(\s|>)/gi, " autoPlay$1");
    s = s.replace(/\splaysinline(\s|>)/gi, " playsInline$1");
    s = s.replace(/\ssrcset=/gi, " srcSet=");
    s = s.replace(/\scrossorigin=/gi, " crossOrigin=");
    s = s.replace(/\scontenteditable=/gi, " contentEditable=");

    // SVG attributes to camelCase
    s = s.replace(/\sstroke-width=/gi, " strokeWidth=");
    s = s.replace(/\sstroke-linecap=/gi, " strokeLinecap=");
    s = s.replace(/\sstroke-linejoin=/gi, " strokeLinejoin=");
    s = s.replace(/\sfill-rule=/gi, " fillRule=");
    s = s.replace(/\sclip-rule=/gi, " clipRule=");
    s = s.replace(/\sviewbox=/gi, " viewBox=");

    // Self-close common void elements when missing closing tags
    const voidTags = ["img", "input", "br", "hr", "meta", "link", "source", "track", "area", "base", "col", "embed", "param", "wbr"];
    for (const tag of voidTags) {
        const re = new RegExp(`<(${tag})([^>]*)>(?!\\s*</\\1>)`, "gi");
        s = s.replace(re, (_m, t, attrs) => `<${t}${attrs} />`);
    }

    // Ensure <img> has alt (TSX complains otherwise)
    s = s.replace(/<img((?:(?!alt=)[^>])*)\/?>/gi, (m, attrs) => {
        return /alt=/.test(attrs) ? m : `<img${attrs} alt="" />`;
    });

    // Boolean attributes normalization (e.g., disabled -> disabled={true})
    // Keep it light; React accepts just "disabled" as true, but this is optional:
    // s = s.replace(/\s(disabled|checked|selected)(\s|>)/gi, " $1$2");

    return s;
}


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
            const el = (e.target as HTMLElement).closest(".cpy") as HTMLElement | null;
            if (!el) return;
            e.preventDefault();

            // Clone and strip 'cpy' from the clicked node + descendants
            const clone = el.cloneNode(true) as HTMLElement;
            clone.classList.remove("cpy");
            clone.querySelectorAll(".cpy").forEach(x => x.classList.remove("cpy"));

            // Convert rendered HTML -> TSX
            const tsx = htmlToTsx(clone.outerHTML);

            try {
                await navigator.clipboard.writeText(tsx);
                setCopiedMsg("Copied TSX to clipboard");
                setTimeout(() => setCopiedMsg(null), 1100);
            } catch {
                setCopiedMsg("Copy failed");
                setTimeout(() => setCopiedMsg(null), 1500);
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


<button className="btn btn-primary">Open modal</button><dialog id="modal_basic" className="modal"><div className="modal-box"><h3 className="font-bold text-lg">Hello!</h3><p className="py-2">This modal uses the native &lt;dialog&gt; element.</p><div className="modal-action"><form method="dialog"><button className="btn">Close</button></form></div></div><form method="dialog" className="modal-backdrop"><button>close</button></form></dialog>


{/* MODALS — single white box, wrapped tiles */}
<section id="modals" className="scroll-mt-16 space-y-6">
  <h2 className="text-2xl font-bold border-b border-base-300 pb-2">Modals</h2>

  <div className="card bg-base-100 shadow">
    <div className="card-body space-y-5">

      {/* 1) BASIC (dialog + showModal) */}
      <div className="text-xs uppercase tracking-wide text-base-content/60">Basic (dialog)</div>
      <div className="flex flex-wrap items-start gap-3">
        <div className="rounded-xl bg-base-200 p-3 relative">
          <CopyBadge targetId="tile_modal_basic" />
          <div id="tile_modal_basic" className="space-x-2">
            <button
              className="btn btn-primary"
              onClick={() => (document.getElementById('modal_basic') as HTMLDialogElement).showModal()}
            >
              Open modal
            </button>
            <dialog id="modal_basic" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-2">This modal uses the native &lt;dialog&gt; element.</p>
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </div>
        </div>

        {/* 2) Close icon (top-right) */}
        <div className="rounded-xl bg-base-200 p-3 relative">
          <CopyBadge targetId="tile_modal_close_icon" />
          <div id="tile_modal_close_icon">
            <button
              className="btn"
              onClick={() => (document.getElementById('modal_close_icon') as HTMLDialogElement).showModal()}
            >
              With close icon
            </button>
            <dialog id="modal_close_icon" className="modal">
              <div className="modal-box relative">
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Modal title</h3>
                <p className="py-2">A small close button in the corner.</p>
                <div className="modal-action">
                  <form method="dialog"><button className="btn btn-primary">Done</button></form>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop"><button>close</button></form>
            </dialog>
          </div>
        </div>

        {/* 3) Confirm / cancel actions */}
        <div className="rounded-xl bg-base-200 p-3 relative">
          <CopyBadge targetId="tile_modal_actions" />
          <div id="tile_modal_actions">
            <button
              className="btn btn-secondary"
              onClick={() => (document.getElementById('modal_actions') as HTMLDialogElement).showModal()}
            >
              Confirm dialog
            </button>
            <dialog id="modal_actions" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Delete item?</h3>
                <p className="py-2">This action can’t be undone.</p>
                <div className="modal-action">
                  <form method="dialog" className="space-x-2">
                    <button className="btn">Cancel</button>
                    <button className="btn btn-error">Delete</button>
                  </form>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop"><button>close</button></form>
            </dialog>
          </div>
        </div>
      </div>

      {/* 4) Positions */}
      <div className="text-xs uppercase tracking-wide text-base-content/60">Positions</div>
      <div className="flex flex-wrap items-start gap-3">
        {/* Top */}
        <div className="rounded-xl bg-base-200 p-3 relative">
          <CopyBadge targetId="tile_modal_top" />
          <div id="tile_modal_top">
            <button className="btn" onClick={() => (document.getElementById('modal_top') as HTMLDialogElement).showModal()}>Top</button>
            <dialog id="modal_top" className="modal modal-top">
              <div className="modal-box">
                <h3 className="font-bold">Top-aligned</h3>
                <p className="py-2">Use <code>modal-top</code>.</p>
                <div className="modal-action"><form method="dialog"><button className="btn">Close</button></form></div>
              </div>
              <form method="dialog" className="modal-backdrop"><button>close</button></form>
            </dialog>
          </div>
        </div>
        {/* Middle */}
        <div className="rounded-xl bg-base-200 p-3 relative">
          <CopyBadge targetId="tile_modal_middle" />
          <div id="tile_modal_middle">
            <button className="btn" onClick={() => (document.getElementById('modal_middle') as HTMLDialogElement).showModal()}>Middle</button>
            <dialog id="modal_middle" className="modal modal-middle">
              <div className="modal-box">
                <h3 className="font-bold">Center-aligned</h3>
                <p className="py-2">Default position is middle.</p>
                <div className="modal-action"><form method="dialog"><button className="btn">Close</button></form></div>
              </div>
              <form method="dialog" className="modal-backdrop"><button>close</button></form>
            </dialog>
          </div>
        </div>
        {/* Bottom */}
        <div className="rounded-xl bg-base-200 p-3 relative">
          <CopyBadge targetId="tile_modal_bottom" />
          <div id="tile_modal_bottom">
            <button className="btn" onClick={() => (document.getElementById('modal_bottom') as HTMLDialogElement).showModal()}>Bottom</button>
            <dialog id="modal_bottom" className="modal modal-bottom">
              <div className="modal-box">
                <h3 className="font-bold">Bottom-aligned</h3>
                <p className="py-2">Use <code>modal-bottom</code>.</p>
                <div className="modal-action"><form method="dialog"><button className="btn">Close</button></form></div>
              </div>
              <form method="dialog" className="modal-backdrop"><button>close</button></form>
            </dialog>
          </div>
        </div>
      </div>

      {/* 5) Sizes */}
      <div className="text-xs uppercase tracking-wide text-base-content/60">Sizes</div>
      <div className="flex flex-wrap items-start gap-3">
        {/* Small */}
        <div className="rounded-xl bg-base-200 p-3 relative">
          <CopyBadge targetId="tile_modal_sm" />
          <div id="tile_modal_sm">
            <button className="btn btn-sm" onClick={() => (document.getElementById('modal_sm') as HTMLDialogElement).showModal()}>Small</button>
            <dialog id="modal_sm" className="modal">
              <div className="modal-box max-w-md">
                <h3 className="font-bold">Small</h3>
                <p className="py-2">Use <code>max-w-md</code>.</p>
                <div className="modal-action"><form method="dialog"><button className="btn">Close</button></form></div>
              </div>
              <form method="dialog" className="modal-backdrop"><button>close</button></form>
            </dialog>
          </div>
        </div>
        {/* Medium */}
        <div className="rounded-xl bg-base-200 p-3 relative">
          <CopyBadge targetId="tile_modal_md" />
          <div id="tile_modal_md">
            <button className="btn" onClick={() => (document.getElementById('modal_md') as HTMLDialogElement).showModal()}>Medium</button>
            <dialog id="modal_md" className="modal">
              <div className="modal-box">
                <h3 className="font-bold">Medium</h3>
                <p className="py-2">Default width.</p>
                <div className="modal-action"><form method="dialog"><button className="btn">Close</button></form></div>
              </div>
              <form method="dialog" className="modal-backdrop"><button>close</button></form>
            </dialog>
          </div>
        </div>
        {/* Wide */}
        <div className="rounded-xl bg-base-200 p-3 relative">
          <CopyBadge targetId="tile_modal_wide" />
          <div id="tile_modal_wide">
            <button className="btn btn-primary" onClick={() => (document.getElementById('modal_wide') as HTMLDialogElement).showModal()}>Wide</button>
            <dialog id="modal_wide" className="modal">
              <div className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold">Wide modal</h3>
                <p className="py-2">Use <code>w-11/12 max-w-5xl</code> for big content.</p>
                <div className="modal-action"><form method="dialog"><button className="btn">Close</button></form></div>
              </div>
              <form method="dialog" className="modal-backdrop"><button>close</button></form>
            </dialog>
          </div>
        </div>
      </div>

      {/* 6) Form modal */}
      <div className="text-xs uppercase tracking-wide text-base-content/60">Form</div>
      <div className="flex flex-wrap items-start gap-3">
        <div className="rounded-xl bg-base-200 p-3 relative">
          <CopyBadge targetId="tile_modal_form" />
          <div id="tile_modal_form">
            <button className="btn btn-primary" onClick={() => (document.getElementById('modal_form') as HTMLDialogElement).showModal()}>
              New project
            </button>
            <dialog id="modal_form" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Create project</h3>
                <div className="py-2 space-y-3">
                  <label className="form-control">
                    <span className="label-text">Name</span>
                    <input type="text" className="input input-bordered" placeholder="Project Alpha" />
                  </label>
                  <label className="form-control">
                    <span className="label-text">Visibility</span>
                    <select className="select select-bordered">
                      <option>Private</option>
                      <option>Team</option>
                      <option>Public</option>
                    </select>
                  </label>
                </div>
                <div className="modal-action">
                  <form method="dialog" className="space-x-2">
                    <button className="btn">Cancel</button>
                    <button className="btn btn-primary">Create</button>
                  </form>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop"><button>close</button></form>
            </dialog>
          </div>
        </div>
      </div>

      {/* 7) Image header */}
      <div className="text-xs uppercase tracking-wide text-base-content/60">Image header</div>
      <div className="flex flex-wrap items-start gap-3">
        <div className="rounded-xl bg-base-200 p-3 relative">
          <CopyBadge targetId="tile_modal_image" />
          <div id="tile_modal_image">
            <button className="btn" onClick={() => (document.getElementById('modal_image') as HTMLDialogElement).showModal()}>
              Preview image
            </button>
            <dialog id="modal_image" className="modal">
              <div className="modal-box p-0 overflow-hidden">
                <img src="https://picsum.photos/800/240" alt="header" className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg">Beautiful header</h3>
                  <p className="py-2">Use an image or any hero content at the top.</p>
                </div>
                <div className="modal-action px-4 pb-4">
                  <form method="dialog"><button className="btn">Close</button></form>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop"><button>close</button></form>
            </dialog>
          </div>
        </div>
      </div>

      {/* 8) Scrollable content */}
      <div className="text-xs uppercase tracking-wide text-base-content/60">Scrollable</div>
      <div className="flex flex-wrap items-start gap-3">
        <div className="rounded-xl bg-base-200 p-3 relative">
          <CopyBadge targetId="tile_modal_scroll" />
          <div id="tile_modal_scroll">
            <button className="btn" onClick={() => (document.getElementById('modal_scroll') as HTMLDialogElement).showModal()}>Long content</button>
            <dialog id="modal_scroll" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Lots of text</h3>
                <div className="mt-2 max-h-[60vh] overflow-y-auto space-y-2">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <p key={i}>Paragraph {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit…</p>
                  ))}
                </div>
                <div className="modal-action">
                  <form method="dialog"><button className="btn">Close</button></form>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop"><button>close</button></form>
            </dialog>
          </div>
        </div>
      </div>

      {/* 9) Backdrop variations */}
      <div className="text-xs uppercase tracking-wide text-base-content/60">Backdrop</div>
      <div className="flex flex-wrap items-start gap-3">
        {/* No backdrop */}
        <div className="rounded-xl bg-base-200 p-3 relative">
          <CopyBadge targetId="tile_modal_no_backdrop" />
          <div id="tile_modal_no_backdrop">
            <button className="btn" onClick={() => (document.getElementById('modal_no_backdrop') as HTMLDialogElement).showModal()}>No backdrop</button>
            <dialog id="modal_no_backdrop" className="modal">
              <div className="modal-box">
                <h3 className="font-bold">No backdrop element</h3>
                <p className="py-2">Omit the <code>.modal-backdrop</code> to disable outside click-to-close.</p>
                <div className="modal-action">
                  <form method="dialog"><button className="btn">Close</button></form>
                </div>
              </div>
              {/* No backdrop here */}
            </dialog>
          </div>
        </div>

        {/* Blur backdrop */}
        <div className="rounded-xl bg-base-200 p-3 relative">
          <CopyBadge targetId="tile_modal_blur" />
          <div id="tile_modal_blur">
            <button className="btn" onClick={() => (document.getElementById('modal_blur') as HTMLDialogElement).showModal()}>Blur backdrop</button>
            <dialog id="modal_blur" className="modal">
              <div className="modal-box">
                <h3 className="font-bold">Custom backdrop</h3>
                <p className="py-2">Add classes to backdrop for blur/color.</p>
                <div className="modal-action"><form method="dialog"><button className="btn">Close</button></form></div>
              </div>
              <form method="dialog" className="modal-backdrop backdrop-blur-sm bg-black/30">
                <button>close</button>
              </form>
            </dialog>
          </div>
        </div>
      </div>

      {/* 10) Full-screen-like */}
      <div className="text-xs uppercase tracking-wide text-base-content/60">Full-screen</div>
      <div className="flex flex-wrap items-start gap-3">
        <div className="rounded-xl bg-base-200 p-3 relative">
          <CopyBadge targetId="tile_modal_full" />
          <div id="tile_modal_full">
            <button className="btn btn-accent" onClick={() => (document.getElementById('modal_full') as HTMLDialogElement).showModal()}>
              Open full-screen
            </button>
            <dialog id="modal_full" className="modal">
              <div className="modal-box w-full max-w-none h-[90vh]">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">Full-screen-ish</h3>
                  <form method="dialog"><button className="btn btn-sm">Close</button></form>
                </div>
                <div className="mt-4 h-[calc(90vh-4rem)] overflow-auto space-y-4">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <p key={i}>Scrollable content line {i + 1}</p>
                  ))}
                </div>
              </div>
              <form method="dialog" className="modal-backdrop"><button>close</button></form>
            </dialog>
          </div>
        </div>
      </div>

      {/* 11) Checkbox (modal-toggle) */}
      <div className="text-xs uppercase tracking-wide text-base-content/60">Checkbox toggle</div>
      <div className="flex flex-wrap items-start gap-3">
        <div className="rounded-xl bg-base-200 p-3 relative">
          <CopyBadge targetId="tile_modal_toggle" />
          <div id="tile_modal_toggle">
            <label htmlFor="modal_toggle_demo" className="btn">Open (toggle)</label>
            <input type="checkbox" id="modal_toggle_demo" className="modal-toggle" />
            <div className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Modal via checkbox</h3>
                <p className="py-2">Uses input[type=checkbox].</p>
                <div className="modal-action">
                  <label htmlFor="modal_toggle_demo" className="btn">Close</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle + bottom + wide */}
        <div className="rounded-xl bg-base-200 p-3 relative">
          <CopyBadge targetId="tile_modal_toggle_bottom" />
          <div id="tile_modal_toggle_bottom">
            <label htmlFor="modal_toggle_bottom" className="btn">Bottom large</label>
            <input type="checkbox" id="modal_toggle_bottom" className="modal-toggle" />
            <div className="modal modal-bottom">
              <div className="modal-box w-11/12 max-w-4xl">
                <h3 className="font-bold text-lg">Large bottom modal</h3>
                <p className="py-2">Toggle + <code>modal-bottom</code> + wide box.</p>
                <div className="modal-action">
                  <label htmlFor="modal_toggle_bottom" className="btn">Close</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>




                    {/* Avatars section — compact tile grid in one white box */}
                    <section id="avatars" className="scroll-mt-16 space-y-6">
                        <div className="card bg-base-100 shadow">
                            <div className="card-body">
                                <h2 className="text-2xl font-bold border-b border-base-300 pb-2">Avatars</h2>
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
                    
                    {/* Buttons section — compact, content-hugging */}
                    <section id="buttons" className="scroll-mt-16 space-y-6">

                        <div className="card bg-base-100 shadow">
                            <div className="card-body space-y-6">
                                <h2 className="text-2xl font-bold border-b border-base-300 pb-2">Buttons</h2>


                                {/* AUTH / LOGIN */}
                                <div className="space-y-3">
                                    <div className="text-xs uppercase tracking-wide text-base-content/60">Auth / Login</div>

                                    {/* Solid */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* Google */}
                                        <button className="cpy btn bg-white text-black border">
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fill="#EA4335" d="M12 11.9v3.8h5.4c-.2 1.4-1.6 4-5.4 4-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 4 1.6l2.7-2.6C16.9 4.8 14.7 3.9 12 3.9 6.9 3.9 2.8 8 2.8 13.1S6.9 22.4 12 22.4c6.9 0 9.2-4.8 9.2-7.4 0-.5 0-.8-.1-1.2H12z" />
                                                <path fill="#34A853" d="M3.9 7.6l3.1 2.3c.8-1.8 2.5-3 5-3 .8 0 1.6.2 2.3.6l2.8-2.7C16.1 3.9 14.1 3.2 12 3.2c-3.9 0-7.3 2.2-8.9 5.4z" />
                                                <path fill="#FBBC05" d="M12 22.4c3 0 5.6-1 7.4-2.8l-3.2-2.6c-1 .7-2.3 1.2-4.2 1.2-3.3 0-6-2.2-7-5.2l-3.1 2.4C3.6 19.9 7.5 22.4 12 22.4z" />
                                                <path fill="#4285F4" d="M21.2 15.1c.1-.5.2-1 .2-1.7 0-.6-.1-1.2-.2-1.7H12v3.4h9.2z" />
                                            </svg>
                                            Sign in with Google
                                        </button>

                                        {/* GitHub */}
                                        <button className="cpy btn btn-neutral">
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fill="currentColor" d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.5-1.8-1.5-1.8-1.2-.8.1-.8.1-.8 1.3.1 2 . 9 2 .9 1.2 2 3.1 1.4 3.9 1 .1-.9.5-1.4.8-1.7-2.7-.3-5.6-1.4-5.6-6a4.6 4.6 0 0 1 1.2-3.2 4.2 4.2 0 0 1 .1-3.1s1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C16.7 4 17.7 4.3 17.7 4.3a4.2 4.2 0 0 1 .1 3.1 4.6 4.6 0 0 1 1.2 3.2c0 4.6-2.9 5.7-5.6 6 .5.4.9 1.2.9 2.5v3.7c0 .3.2.7.8.6A12 12 0 0 0 12 .5z" />
                                            </svg>
                                            Sign in with GitHub
                                        </button>

                                        {/* Facebook */}
                                        <button className="cpy btn bg-[#1877F2] text-white">
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fill="currentColor" d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.3V12h2.3V9.8c0-2.2 1.3-3.4 3.3-3.4.96 0 1.97.17 1.97.17v2.17h-1.11c-1.09 0-1.43.68-1.43 1.38V12h2.44l-.39 2.9h-2.05v7A10 10 0 0 0 22 12z" />
                                            </svg>
                                            Continue with Facebook
                                        </button>

                                        {/* Apple */}
                                        <button className="cpy btn btn-dark bg-black text-white">
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fill="currentColor" d="M16.2 12.9c0-2.4 2-3.5 2.1-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8-1.6 0-3 .9-3.8 2.4-1.6 2.7-.4 6.6 1.1 8.7 .8 1.1 1.7 2.3 2.9 2.3 1.1 0 1.6-.7 3-.7 1.4 0 1.8.7 3 .7 1.2 0 2-.1 3-1.6 1-1.4 1.4-2.8 1.5-2.9-.1 0-2.9-1.1-2.9-3.5zM14.3 5.7c.6-.7 1-1.7.9-2.7-1 .1-2 .6-2.6 1.3-.6.6-1.1 1.6-1 2.6 1 0 2-.6 2.7-1.2z" />
                                            </svg>
                                            Sign in with Apple
                                        </button>

                                        {/* X / Twitter */}
                                        <button className="cpy btn border bg-white text-black">
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fill="currentColor" d="M18.9 2H21l-6.6 7.5L22 22h-6.8l-4.6-6.2L4.9 22H3l7.2-8.2L2.3 2h6.9l4.2 5.7L18.9 2Zm-2.4 18h1.3L7.6 4H6.3l10.2 16Z" />
                                            </svg>
                                            Sign in with X
                                        </button>
                                    </div>

                                    {/* Outline */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button className="cpy btn btn-outline">
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fill="#EA4335" d="M12 11.9v3.8h5.4c-.2 1.4-1.6 4-5.4 4-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 4 1.6l2.7-2.6C16.9 4.8 14.7 3.9 12 3.9 6.9 3.9 2.8 8 2.8 13.1S6.9 22.4 12 22.4c6.9 0 9.2-4.8 9.2-7.4 0-.5 0-.8-.1-1.2H12z" />
                                                <path fill="#34A853" d="M3.9 7.6l3.1 2.3c.8-1.8 2.5-3 5-3 .8 0 1.6.2 2.3.6l2.8-2.7C16.1 3.9 14.1 3.2 12 3.2c-3.9 0-7.3 2.2-8.9 5.4z" />
                                                <path fill="#FBBC05" d="M12 22.4c3 0 5.6-1 7.4-2.8l-3.2-2.6c-1 .7-2.3 1.2-4.2 1.2-3.3 0-6-2.2-7-5.2l-3.1 2.4C3.6 19.9 7.5 22.4 12 22.4z" />
                                                <path fill="#4285F4" d="M21.2 15.1c.1-.5.2-1 .2-1.7 0-.6-.1-1.2-.2-1.7H12v3.4h9.2z" />
                                            </svg>
                                            Google
                                        </button>

                                        <button className="cpy btn btn-outline">
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fill="currentColor" d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.5-1.8-1.5-1.8-1.2-.8.1-.8.1-.8 1.3.1 2 .9 2 .9 1.2 2 3.1 1.4 3.9 1 .1-.9.5-1.4.8-1.7-2.7-.3-5.6-1.4-5.6-6a4.6 4.6 0 0 1 1.2-3.2 4.2 4.2 0 0 1 .1-3.1s1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C16.7 4 17.7 4.3 17.7 4.3a4.2 4.2 0 0 1 .1 3.1 4.6 4.6 0 0 1 1.2 3.2c0 4.6-2.9 5.7-5.6 6 .5.4.9 1.2.9 2.5v3.7c0 .3.2.7.8.6A12 12 0 0 0 12 .5z" />
                                            </svg>
                                            GitHub
                                        </button>

                                        <button className="cpy btn btn-outline text-[#1877F2] border-[#1877F2] hover:bg-[#1877F2] hover:text-white">
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fill="currentColor" d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.3V12h2.3V9.8c0-2.2 1.3-3.4 3.3-3.4.96 0 1.97.17 1.97.17v2.17h-1.11c-1.09 0-1.43.68-1.43 1.38V12h2.44l-.39 2.9h-2.05v7A10 10 0 0 0 22 12z" />
                                            </svg>
                                            Facebook
                                        </button>

                                        <button className="cpy btn btn-outline">
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fill="currentColor" d="M18.9 2H21l-6.6 7.5L22 22h-6.8l-4.6-6.2L4.9 22H3l7.2-8.2L2.3 2h6.9l4.2 5.7L18.9 2Zm-2.4 18h1.3L7.6 4H6.3l10.2 16Z" />
                                            </svg>
                                            X / Twitter
                                        </button>
                                    </div>

                                    {/* Sizes (auth style) */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button className="cpy btn btn-sm border">
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true"><path fill="#EA4335" d="M12 11.9v3.8h5.4c-.2 1.4-1.6 4-5.4 4-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 4 1.6l2.7-2.6C16.9 4.8 14.7 3.9 12 3.9 6.9 3.9 2.8 8 2.8 13.1S6.9 22.4 12 22.4c6.9 0 9.2-4.8 9.2-7.4 0-.5 0-.8-.1-1.2H12z" /></svg>
                                            Sign in
                                        </button>
                                        <button className="cpy btn">
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.5-1.8-1.5-1.8-1.2-.8.1-.8.1-.8 1.3.1 2 .9 2 .9 1.2 2 3.1 1.4 3.9 1 .1-.9.5-1.4.8-1.7-2.7-.3-5.6-1.4-5.6-6a4.6 4.6 0 0 1 1.2-3.2 4.2 4.2 0 0 1 .1-3.1s1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C16.7 4 17.7 4.3 17.7 4.3a4.2 4.2 0 0 1 .1 3.1 4.6 4.6 0 0 1 1.2 3.2c0 4.6-2.9 5.7-5.6 6 .5.4.9 1.2.9 2.5v3.7c0 .3.2.7.8.6A12 12 0 0 0 12 .5z" /></svg>
                                            Sign in
                                        </button>
                                        <button className="cpy btn btn-lg bg-white text-black border">
                                            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true"><path fill="#EA4335" d="M12 11.9v3.8h5.4c-.2 1.4-1.6 4-5.4 4-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 4 1.6l2.7-2.6C16.9 4.8 14.7 3.9 12 3.9 6.9 3.9 2.8 8 2.8 13.1S6.9 22.4 12 22.4c6.9 0 9.2-4.8 9.2-7.4 0-.5 0-.8-.1-1.2H12z" /></svg>
                                            Continue with Google
                                        </button>
                                    </div>

                                    {/* Loading / Disabled */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button className="cpy btn btn-neutral">
                                            <span className="loading loading-spinner" /> Signing in…
                                        </button>
                                        <button className="cpy btn btn-primary" disabled>
                                            <span className="loading loading-spinner" />
                                            Sign in
                                        </button>
                                    </div>

                                    {/* Icon-only (for compact headers, all have aria-labels) */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button className="cpy btn btn-ghost btn-square" aria-label="Sign in with Google">
                                            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true"><path fill="#EA4335" d="M12 11.9v3.8h5.4c-.2 1.4-1.6 4-5.4 4-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 4 1.6l2.7-2.6C16.9 4.8 14.7 3.9 12 3.9 6.9 3.9 2.8 8 2.8 13.1S6.9 22.4 12 22.4c6.9 0 9.2-4.8 9.2-7.4 0-.5 0-.8-.1-1.2H12z" /><path fill="#34A853" d="M3.9 7.6l3.1 2.3c.8-1.8 2.5-3 5-3 .8 0 1.6.2 2.3.6l2.8-2.7C16.1 3.9 14.1 3.2 12 3.2c-3.9 0-7.3 2.2-8.9 5.4z" /><path fill="#FBBC05" d="M12 22.4c3 0 5.6-1 7.4-2.8l-3.2-2.6c-1 .7-2.3 1.2-4.2 1.2-3.3 0-6-2.2-7-5.2l-3.1 2.4C3.6 19.9 7.5 22.4 12 22.4z" /><path fill="#4285F4" d="M21.2 15.1c.1-.5.2-1 .2-1.7 0-.6-.1-1.2-.2-1.7H12v3.4h9.2z" /></svg>
                                        </button>
                                        <button className="cpy btn btn-ghost btn-square" aria-label="Sign in with GitHub">
                                            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.5-1.8-1.5-1.8-1.2-.8.1-.8.1-.8 1.3.1 2 .9 2 .9 1.2 2 3.1 1.4 3.9 1 .1-.9.5-1.4.8-1.7-2.7-.3-5.6-1.4-5.6-6a4.6 4.6 0 0 1 1.2-3.2 4.2 4.2 0 0 1 .1-3.1s1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C16.7 4 17.7 4.3 17.7 4.3a4.2 4.2 0 0 1 .1 3.1 4.6 4.6 0 0 1 1.2 3.2c0 4.6-2.9 5.7-5.6 6 .5.4.9 1.2.9 2.5v3.7c0 .3.2.7.8.6A12 12 0 0 0 12 .5z" /></svg>
                                        </button>
                                        <button className="cpy btn btn-ghost btn-square" aria-label="Sign in with Apple">
                                            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.2 12.9c0-2.4 2-3.5 2.1-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8-1.6 0-3 .9-3.8 2.4-1.6 2.7-.4 6.6 1.1 8.7 .8 1.1 1.7 2.3 2.9 2.3 1.1 0 1.6-.7 3-.7 1.4 0 1.8.7 3 .7 1.2 0 2-.1 3-1.6 1-1.4 1.4-2.8 1.5-2.9-.1 0-2.9-1.1-2.9-3.5zM14.3 5.7c.6-.7 1-1.7.9-2.7-1 .1-2 .6-2.6 1.3-.6.6-1.1 1.6-1 2.6 1 0 2-.6 2.7-1.2z" /></svg>
                                        </button>
                                    </div>
                                </div>



                                {/* SOLID */}
                                <div className="space-y-3">
                                    <div className="text-xs uppercase tracking-wide text-base-content/60">Solid</div>
                                    <div className="flex flex-wrap items-center gap-2">
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

                                {/* OUTLINE / GHOST / LINK / GLASS */}
                                <div className="space-y-3">
                                    <div className="text-xs uppercase tracking-wide text-base-content/60">Outline / Ghost / Link / Glass</div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button className="cpy btn btn-outline">Outline</button>
                                        <button className="cpy btn btn-outline btn-primary">Outline Primary</button>
                                        <button className="cpy btn btn-outline btn-secondary">Outline Secondary</button>
                                        <button className="cpy btn btn-outline btn-accent">Outline Accent</button>
                                        <button className="cpy btn btn-ghost">Ghost</button>
                                        <button className="cpy btn btn-link">Link</button>
                                        <button className="cpy btn btn-glass">Glass</button>
                                    </div>
                                </div>

                                {/* SIZES */}
                                <div className="space-y-3">
                                    <div className="text-xs uppercase tracking-wide text-base-content/60">Sizes</div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button className="cpy btn btn-xs">XS</button>
                                        <button className="cpy btn btn-sm">SM</button>
                                        <button className="cpy btn">MD</button>
                                        <button className="cpy btn btn-lg">LG</button>

                                        {/* show wide without taking full row */}
                                        <div className="rounded-xl bg-base-200 p-2">
                                            <button className="cpy btn btn-wide">Wide</button>
                                        </div>

                                        {/* show block but constrain width */}
                                        <div className="rounded-xl bg-base-200 p-2 w-40">
                                            <button className="cpy btn btn-block">Block</button>
                                        </div>
                                    </div>
                                </div>

                                {/* SHAPES */}
                                <div className="space-y-3">
                                    <div className="text-xs uppercase tracking-wide text-base-content/60">Shapes</div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button className="cpy btn btn-circle">◎</button>
                                        <button className="cpy btn btn-square">■</button>
                                        <button className="cpy btn btn-circle btn-primary">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" strokeWidth="2"
                                                className="h-4 w-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6.75-4.5-6.75-10.125A6.75 6.75 0 0 1 12 4.125 6.75 6.75 0 0 1 18.75 10.5C18.75 16.5 12 21 12 21Z" />
                                            </svg>
                                        </button>
                                        <button className="cpy btn btn-square btn-outline">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" strokeWidth="2"
                                                className="h-4 w-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16.5V19a1 1 0 0 0 1 1h3.5m11.5-8-7 7m0 0H11m1.5 0V13" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* STATES */}
                                <div className="space-y-3">
                                    <div className="text-xs uppercase tracking-wide text-base-content/60">States</div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button className="cpy btn">
                                            <span className="loading loading-spinner" /> Loading
                                        </button>
                                        <button className="cpy btn btn-primary">
                                            <span className="loading loading-spinner" />
                                        </button>
                                        <button className="cpy btn" disabled>Disabled</button>
                                        <button className="cpy btn btn-primary no-animation">No Animation</button>
                                    </div>
                                </div>

                                {/* WITH ICONS */}
                                <div className="space-y-3">
                                    <div className="text-xs uppercase tracking-wide text-base-content/60">With Icons</div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button className="cpy btn btn-primary">
                                            {/* Plus icon */}
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" strokeWidth="2"
                                                className="h-4 w-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                                            </svg>
                                            Add
                                        </button>
                                        <button className="cpy btn">
                                            More
                                            {/* ArrowRight */}
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" strokeWidth="2"
                                                className="h-4 w-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                        <button className="cpy btn btn-outline">
                                            {/* Download */}
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" strokeWidth="2"
                                                className="h-4 w-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
                                            </svg>
                                            Download
                                        </button>
                                        <button className="cpy btn btn-accent">
                                            {/* Heart */}
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" strokeWidth="2"
                                                className="h-4 w-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6.75-4.5-6.75-10.125A6.75 6.75 0 0 1 12 4.125 6.75 6.75 0 0 1 18.75 10.5C18.75 16.5 12 21 12 21Z" />
                                            </svg>
                                            Like
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Badges section */}
                    <section id="badges" className="scroll-mt-16 space-y-6">
                        <div className="card bg-base-100 shadow">
                            <div className="card-body">
                                <h2 className="text-2xl font-bold border-b border-base-300 pb-2">Badges</h2>
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

                    {/* DROPDOWNS — single white box, wrapped tiles */}
                    <section id="dropdowns" className="scroll-mt-16 space-y-6">

                    <div className="card bg-base-100 shadow">
                        <div className="card-body space-y-4">
                    <h2 className="text-2xl font-bold border-b border-base-300 pb-2">Dropdowns</h2>


                    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4">
                    {/* Item 1: spans 1 → 2 → 2 → 2 cols */}
                    <div className="border shadow-sm p-4 col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-5">
                        Grid Layout 5/12
                    </div>

                    {/* Item 2: spans 1 → 1 → 1 → 2 cols */}
                    <div className="border shadow-sm p-4 col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2">
                        2/12
                    </div>

                    {/* Item 3: spans 1 → 1 → 2 → 1 cols */}
                    <div className="border shadow-sm p-4 col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-1">
                        1/12
                    </div>

                    {/* Item 4: full-width on small screens, then normal */}
                    <div className="border shadow-sm p-4 col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-12 bg-zinc-500 text-slate-50">
                        Testing  
                    </div>
                    <div className="border shadow-sm p-4 col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-12 ">
                        Testing  


                                


                    </div>
                    </section>


                    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4">
                    {/* Item 1: spans 1 → 2 → 2 → 2 cols */}
                    <div className="border shadow-sm p-4 col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-9">
                            <div className="text-xs uppercase tracking-wide text-base-content/60">Basics & Placement</div>
                        <div className="flex flex-wrap items-start gap-3">
                            {/* Basic (click) */}
                            <div className="rounded-xl bg-base-200 p-3">
                            <div className="cpy dropdown">
                                <button tabIndex={0} className="btn">Open menu</button>
                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                <li><a>Item 1</a></li>
                                <li><a>Item 2</a></li>
                                <li><a>Item 3</a></li>
                                </ul>
                            </div>
                            </div>

                            {/* Hover */}
                            <div className="rounded-xl bg-base-200 p-3">
                            <div className="cpy dropdown dropdown-hover">
                                <button tabIndex={0} className="btn">Hover me</button>
                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-48 p-2 shadow">
                                <li><a>Profile</a></li>
                                <li><a>Settings</a></li>
                                <li><a>Logout</a></li>
                                </ul>
                            </div>
                            </div>

                            {/* End aligned (right) */}
                            <div className="rounded-xl bg-base-200 p-3">
                            <div className="cpy dropdown dropdown-end">
                                <button tabIndex={0} className="btn">End</button>
                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow">
                                <li><a>Edit</a></li>
                                <li><a>Duplicate</a></li>
                                <li><a>Archive</a></li>
                                </ul>
                            </div>
                            </div>

                            {/* Dropup (top) */}
                            <div className="rounded-xl bg-base-200 p-3">
                            <div className="cpy dropdown dropdown-top">
                                <button tabIndex={0} className="btn">Top</button>
                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow">
                                <li><a>One</a></li>
                                <li><a>Two</a></li>
                                <li><a>Three</a></li>
                                </ul>
                            </div>
                            </div>

                            <div className="rounded-xl bg-base-200 p-3">
                            <div className="cpy dropdown dropdown-right">
                                <button tabIndex={0} className="btn">Right</button>
                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow">
                                <li><a>One</a></li>
                                <li><a>Two</a></li>
                                <li><a>Three</a></li>
                                </ul>
                            </div>
                            </div>

                            <div className="rounded-xl bg-base-200 p-3">
                            <div className="cpy dropdown dropdown-bottom">
                                <button tabIndex={0} className="btn">Bottom</button>
                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow">
                                <li><a>One</a></li>
                                <li><a>Two</a></li>
                                <li><a>Three</a></li>
                                </ul>
                            </div>
                            </div>

                            <div className="rounded-xl bg-base-200 p-3">
                            <div className="cpy dropdown dropdown-left">
                                <button tabIndex={0} className="btn">Left</button>
                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow">
                                <li><a>One</a></li>
                                <li><a>Two</a></li>
                                <li><a>Three</a></li>
                                </ul>
                            </div>
                            </div>
                        </div>
                    </div>

                    {/* Item 2: spans 1 → 1 → 1 → 2 cols */}
                    <div className="border shadow-sm p-4 col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-4">
                            {/* Triggers: Icon / Avatar / Ghost */}
                        <div className="text-xs uppercase tracking-wide text-base-content/60 pt-2">Triggers</div>
                        <div className="flex flex-wrap items-start gap-3">
                            {/* Icon button (kebab) */}
                            <div className="rounded-xl bg-base-200 p-3">
                            <div className="cpy dropdown dropdown-end">
                                <button tabIndex={0} className="btn btn-ghost btn-square">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                                </svg>
                                </button>
                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow">
                                <li><a>Share</a></li>
                                <li><a>Download</a></li>
                                <li><a className="text-error">Delete</a></li>
                                </ul>
                            </div>
                            </div>

                            {/* Avatar trigger */}
                            <div className="rounded-xl bg-base-200 p-3">
                            <div className="cpy dropdown dropdown-end">
                                <div tabIndex={0} className="avatar cursor-pointer">
                                <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src="https://i.pravatar.cc/100?img=18" alt="user" />
                                </div>
                                </div>
                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                <li><a>Dashboard</a></li>
                                <li><a>Settings</a></li>
                                <li><a>Sign out</a></li>
                                </ul>
                            </div>
                            </div>

                            {/* Ghost + badge indicator */}
                            <div className="rounded-xl bg-base-200 p-3">
                            <div className="cpy dropdown dropdown-end">
                                <button tabIndex={0} className="btn btn-ghost">
                                Notifications
                                <div className="badge badge-error">3</div>
                                </button>
                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-64 p-2 shadow">
                                <li><a>Welcome aboard 🎉</a></li>
                                <li><a>New comment on task</a></li>
                                <li><a>Deploy finished</a></li>
                                </ul>
                            </div>
                            </div>
                        </div>
                    </div>

                    {/* Item 2: spans 1 → 1 → 1 → 2 cols */}
                    <div className="border shadow-sm p-4 col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-4">
                            {/* Rich content (inputs, buttons) */}
                        <div className="text-xs uppercase tracking-wide text-base-content/60 pt-2">Rich content</div>
                        <div className="flex flex-wrap items-start gap-3">
                            {/* Search in menu */}
                            <div className="rounded-xl bg-base-200 p-3">
                            <div className="cpy dropdown dropdown-end">
                                <button tabIndex={0} className="btn">Search</button>
                                <div tabIndex={0} className="dropdown-content z-[1] w-64 p-3 bg-base-100 rounded-box shadow">
                                <div className="form-control">
                                    <label className="input input-bordered flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="7"/><path d="M21 21l-3.5-3.5"/>
                                    </svg>
                                    <input type="text" className="grow" placeholder="Search…" />
                                    </label>
                                </div>
                                <ul className="menu mt-2">
                                    <li><a>Result A</a></li>
                                    <li><a>Result B</a></li>
                                </ul>
                                </div>
                            </div>
                            </div>

                            {/* Actions group */}
                            <div className="rounded-xl bg-base-200 p-3">
                            <div className="cpy dropdown">
                                <button tabIndex={0} className="btn btn-primary">Actions</button>
                                <div tabIndex={0} className="dropdown-content z-[1] w-64 p-3 bg-base-100 rounded-box shadow space-y-2">
                                <div className="flex gap-2">
                                    <button className="btn btn-sm btn-outline">Edit</button>
                                    <button className="btn btn-sm">Save</button>
                                </div>
                                <div className="divider my-1"></div>
                                <ul className="menu">
                                    <li><a>Duplicate</a></li>
                                    <li><a className="text-error">Delete</a></li>
                                </ul>
                                </div>
                            </div>
                            </div>

                            {/* Checkbox items */}
                            <div className="rounded-xl bg-base-200 p-3">
                            <div className="cpy dropdown">
                                <button tabIndex={0} className="btn">Filters</button>
                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-56 p-2 shadow">
                                <li>
                                    <label className="label cursor-pointer justify-start gap-2 px-3">
                                    <input type="checkbox" className="checkbox checkbox-sm" />
                                    <span>Only active</span>
                                    </label>
                                </li>
                                <li>
                                    <label className="label cursor-pointer justify-start gap-2 px-3">
                                    <input type="checkbox" className="checkbox checkbox-sm" defaultChecked />
                                    <span>With alerts</span>
                                    </label>
                                </li>
                                <li>
                                    <label className="label cursor-pointer justify-start gap-2 px-3">
                                    <input type="checkbox" className="checkbox checkbox-sm" />
                                    <span>Include archived</span>
                                    </label>
                                </li>
                                </ul>
                            </div>
                            </div>
                        </div>
                    </div>

                    </section>


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


                    {/* FABS — single white box, wrapped tiles */}
                    <section id="fabs" className="scroll-mt-16 space-y-6">
                    <h2 className="text-2xl font-bold border-b border-base-300 pb-2">FABs</h2>

                    {/* FABS with Options (Speed-dial) */}
                    <div className="space-y-3">
                    <div className="text-xs uppercase tracking-wide text-base-content/60">FABs with Options</div>

                    <div className="flex flex-wrap items-start gap-3">



                        
                        {/* Bottom-right, opens UP (icons only) */}
                        <div className="rounded-xl bg-base-200 p-3">
                        <div className="cpy relative h-40 w-56 rounded-md">
                            <div className="dropdown dropdown-top dropdown-end absolute right-3 bottom-3">
                            <div tabIndex={0} role="button" className="btn btn-primary btn-circle">
                                {/* plus */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                                </svg>
                            </div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu bg-base-100 rounded-box p-2 shadow">
                                <li>
                                <button className="btn btn-sm btn-circle">
                                    {/* edit */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 21h6l12-12a2.1 2.1 0 0 0-3-3L6 18l-3 3z" />
                                    </svg>
                                </button>
                                </li>
                                <li>
                                <button className="btn btn-sm btn-circle">
                                    {/* share */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 16V4m0 0 4 4m-4-4-4 4" />
                                    </svg>
                                </button>
                                </li>
                                <li>
                                <button className="btn btn-sm btn-circle btn-error">
                                    {/* delete */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 6h18M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6M10 6V4h4v2" />
                                    </svg>
                                </button>
                                </li>
                            </ul>
                            </div>
                        </div>
                        </div>

                        {/* Extended FAB with text options */}
                        <div className="rounded-xl bg-base-200 p-3">
                        <div className="cpy relative h-40 w-64 rounded-md">
                            <div className="dropdown dropdown-top dropdown-end absolute right-3 bottom-3">
                            <div tabIndex={0} role="button" className="btn btn-primary gap-2 rounded-full px-4">
                                {/* plus */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                                </svg>
                                New
                            </div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu bg-base-100 rounded-box w-48 p-2 shadow">
                                <li><a>Blank document</a></li>
                                <li><a>From template</a></li>
                                <li><a className="text-error">Delete draft</a></li>
                            </ul>
                            </div>
                        </div>
                        </div>

                        {/* Hover to open (icon list), top-right position */}
                        <div className="rounded-xl bg-base-200 p-3">
                        <div className="cpy relative h-40 w-56 rounded-md">
                            <div className="dropdown dropdown-hover dropdown-top dropdown-end absolute right-3 top-3">
                            <div tabIndex={0} role="button" className="btn btn-accent btn-circle">
                                {/* star */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m12 17.3-6.2 3.7 1.7-7.2L2 8.9l7.3-.6L12 1.8l2.7 6.5 7.3.6-5.5 4.9 1.7 7.2-6.2-3.7z" />
                                </svg>
                            </div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu bg-base-100 rounded-box p-2 shadow">
                                <li><button className="btn btn-sm btn-circle btn-warning">!</button></li>
                                <li><button className="btn btn-sm btn-circle btn-info">i</button></li>
                                <li><button className="btn btn-sm btn-circle btn-success">✓</button></li>
                            </ul>
                            </div>
                        </div>
                        </div>

                        {/* Left-opening (dropdown-start) */}
                        <div className="rounded-xl bg-base-200 p-3">
                        <div className="cpy relative h-40 w-56 rounded-md">
                            <div className="dropdown dropdown-top dropdown-start absolute left-3 bottom-3">
                            <div tabIndex={0} role="button" className="btn btn-secondary btn-circle">
                                {/* menu */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu bg-base-100 rounded-box w-44 p-2 shadow">
                                <li><a>Settings</a></li>
                                <li><a>Profile</a></li>
                                <li><a>Help</a></li>
                            </ul>
                            </div>
                        </div>
                        </div>

                        {/* FAB with badge + options */}
                        <div className="rounded-xl bg-base-200 p-3">
                        <div className="cpy relative h-40 w-64 rounded-md">
                            <div className="dropdown dropdown-top dropdown-end absolute right-3 bottom-3">
                            <div className="indicator">
                                <span className="indicator-item badge badge-error">3</span>
                                <div tabIndex={0} role="button" className="btn btn-info btn-circle">
                                {/* bell */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .53-.21 1.04-.59 1.41L4 17h5m6 0a3 3 0 1 1-6 0" />
                                </svg>
                                </div>
                            </div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu bg-base-100 rounded-box w-64 p-2 shadow">
                                <li><a>Welcome aboard 🎉</a></li>
                                <li><a>New comment on task</a></li>
                                <li><a>Deploy finished</a></li>
                            </ul>
                            </div>
                        </div>
                        </div>

                    </div>

                    <div className="text-xs opacity-70">
                        Tip: In pages, make a global FAB with <code>fixed bottom-6 right-6</code>.  
                        Here we use a <code>relative</code> tile and an <code>absolute</code> FAB so previews stay contained.
                    </div>
                    </div>

                    </section>



{/* New Section */}




                </div>
            </main>
        </div>
    );
}
