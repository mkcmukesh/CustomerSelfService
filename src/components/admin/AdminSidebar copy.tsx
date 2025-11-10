"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminSidebar } from "./AdminSidebarProvider";

// centralized nav registry
import { ORDERED_KEYS, getSection } from "@/nav";

/* ───── inline icons (no deps) ───── */
type IconName = "layout" | "template" | "dashboard" | "doc" | "login" | "chevron" | "library";
function Icon({ name, className = "w-4 h-4" }: { name: IconName; className?: string }) {
  const s = "stroke-current";
  switch (name) {
    case "layout":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <rect x="3" y="4" width="18" height="16" rx="2" className={s} fill="none" strokeWidth="2" />
          <path d="M3 9h18M9 9v11" className={s} fill="none" strokeWidth="2" />
        </svg>
      );
    case "template":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <rect x="4" y="4" width="16" height="16" rx="2" className={s} fill="none" strokeWidth="2" />
          <path d="M8 8h8M8 12h8M8 16h5" className={s} fill="none" strokeWidth="2" />
        </svg>
      );
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path d="M3 13h8V3H3zM13 21h8V11h-8zM13 3v6h8V3zM3 21h8v-6H3z" className={s} fill="none" strokeWidth="2" />
        </svg>
      );
    case "doc":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path d="M6 3h7l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" className={s} fill="none" strokeWidth="2" />
          <path d="M13 3v6h6" className={s} fill="none" strokeWidth="2" />
        </svg>
      );
    case "login":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path d="M10 17l5-5-5-5" className={s} fill="none" strokeWidth="2" />
          <path d="M15 12H3" className={s} fill="none" strokeWidth="2" />
          <path d="M21 21V3" className={s} fill="none" strokeWidth="2" />
        </svg>
      );
    case "chevron":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path d="M8 10l4 4 4-4" className={s} fill="none" strokeWidth="2" />
        </svg>
      );
    case "library":
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path d="M4 19h16M6 17V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v12M14 17V7a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v10" className={s} fill="none" strokeWidth="2" />
        </svg>
      );
  }
}

/* ───── models ───── */
type Item = { href: string; label: string; icon?: IconName; external?: boolean };
type Group = { id: string; title: string; icon?: IconName; items: Item[]; kind?: "flat" | "ds" };

/* DS group built from registry (submenu per section) */
function buildDSGroup(): Group {
  return { id: "ds", title: "DS", icon: "library", items: [], kind: "ds" };
}

/* your existing static groups */
const STATIC_GROUPS: Group[] = [
  {
    id: "main",
    title: "Main",
    icon: "layout",
    items: [
      { href: "/about", label: "Website (Header+Footer)", icon: "doc" },
      { href: "/legal", label: "Content Only",           icon: "doc" },
      { href: "/dashboard", label: "Dashboard",          icon: "dashboard" },
    ],
  },
  {
    id: "templates",
    title: "Templates",
    icon: "template",
    items: [
      { href: "/templates/centered",  label: "Content-FullHeight-Center", icon: "doc" },
      { href: "/templates/split5050", label: "Content-fullWidth-5050",    icon: "doc" },
      { href: "/templates/website",   label: "Website (Site Layout)",     icon: "doc" },
      { href: "/templates/dashboard", label: "Dashboard (Sidebar)",       icon: "dashboard" },
      { href: "/templates/legal",     label: "Content Only (Legal)",      icon: "doc" },
      { href: "/templates/login",     label: "Login",                     icon: "login" },
    ],
  },
];

/* ✅ NEW: Tools group (flat) shown above DS */
const TOOLS_GROUP: Group = {
  id: "tools",
  title: "Tools",
  icon: "template", // reusing the template icon
  items: [
    // Route for: src/app/pages/Tools/E-mailer/page.tsx
    { href: "/pages/Tools/E-mailer", label: "E-mailer", icon: "doc" },
    // { href: "/pages/Tools/E-mailer", label: "E-mailer", icon: "doc" },
    // { href: "/pages/Tools/E-mailer", label: "E-mailer", icon: "doc" },
    // { href: "/pages/Tools/E-mailer", label: "E-mailer", icon: "doc" },
  ],
};

/* ───── helpers ───── */
function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}
const STORAGE_KEY = "adminSidebar.openGroups";
const DS_SUB_KEY = "adminSidebar.dsOpenSubs";
const HOVER_DELAY_MS = 250;

/* ───── component ───── */
export default function AdminSidebar() {
  const { open, setOpen, toggle } = useAdminSidebar();
  const pathname = usePathname();
  const router = useRouter();

  // reorder: Templates → Tools → DS
  const [MAIN_GROUP, TEMPLATES_GROUP] = STATIC_GROUPS; // if STATIC_GROUPS = [main, templates]
  const GROUPS: Group[] = [TEMPLATES_GROUP, TOOLS_GROUP, buildDSGroup()];

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [dsOpenSubs, setDsOpenSubs] = useState<Record<string, boolean>>({}); // per-section open state

  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFinePointer = useRef(true);

  // load persisted state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setOpenGroups(JSON.parse(raw));
      const dsRaw = localStorage.getItem(DS_SUB_KEY);
      if (dsRaw) setDsOpenSubs(JSON.parse(dsRaw));
    } catch {}
    if (typeof window !== "undefined" && window.matchMedia) {
      isFinePointer.current = window.matchMedia("(pointer: fine)").matches;
    }
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(openGroups)); } catch {}
  }, [openGroups]);
  useEffect(() => {
    try { localStorage.setItem(DS_SUB_KEY, JSON.stringify(dsOpenSubs)); } catch {}
  }, [dsOpenSubs]);

  // auto-open the group that contains current route
  useEffect(() => {
    if (!pathname) return;
    setOpenGroups(prev => {
      const next = { ...prev };
      for (const g of GROUPS) {
        if (g.id === "ds") {
          // check inside DS registry sections
          const any = ORDERED_KEYS.some(k => {
            const sec = getSection(k);
            return sec.items.some(it => isActive(pathname, it.href));
          });
          if (any) next[g.id] = true;
        } else {
          const any = g.items.some(it => isActive(pathname, it.href));
          if (any) next[g.id] = true;
        }
      }
      return next;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleGroup = (id: string) => setOpenGroups(s => ({ ...s, [id]: !s[id] }));
  const toggleDsSub = (id: string) => setDsOpenSubs(s => ({ ...s, [id]: !s[id] }));

  // Hover preview kept ONLY for templates; DS & Tools are click-only
  const startHoverPreview = (href: string) => {
    if (!isFinePointer.current) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      router.push(href);
      // do NOT close on hover
    }, HOVER_DELAY_MS);
  };
  const cancelHoverPreview = () => {
    if (hoverTimer.current) { clearTimeout(hoverTimer.current); hoverTimer.current = null; }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={[
          "fixed inset-0 z-[70] bg-black/30 transition-opacity",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Sidebar */}
      <aside
        className={[
          "fixed z-[71] left-0 top-0 h-dvh w-72 max-w-[80vw] bg-base-200 border-r",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
          "shadow-lg",
          "flex flex-col min-h-0",
        ].join(" ")}
      >
        {/* Header */}
        <div className="h-14 border-b flex items-center justify-between px-3">
          <span className="font-semibold">Admin</span>
          <button className="btn btn-ghost btn-xs" onClick={() => setOpen(false)} aria-label="Close sidebar">✕</button>
        </div>

        {/* Groups */}
        <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 space-y-3 pb-20">
          {GROUPS.map((group) => {
            const expanded = !!openGroups[group.id];

            return (
              <div key={group.id} className="rounded-lg border border-base-300 bg-base-100/70">
                {/* Group header */}
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-base-200/80"
                  aria-expanded={expanded}
                  onClick={() => toggleGroup(group.id)}
                >
                  {group.icon && <Icon name={group.icon} className="w-4 h-4 opacity-80" />}
                  <span className="text-sm font-semibold flex-1">{group.title}</span>
                  <span className={["transition-transform", expanded ? "rotate-180" : ""].join(" ")}>
                    <Icon name="chevron" className="w-4 h-4 opacity-70" />
                  </span>
                </button>

                {/* Group content */}
                <div
                  className={[
                    "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out",
                    expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  ].join(" ")}
                >
                  <div className="min-h-0">
                    {group.kind === "ds" ? (
                      /* DS: submenus (click to expand; links click-only) */
                      <div className="p-2 space-y-2">
                        {ORDERED_KEYS.map((key) => {
                          const section = getSection(key);
                          const subOpen = !!dsOpenSubs[section.id];
                          // auto-open the submenu containing current route
                          const hasActiveItem = section.items.some(it => isActive(pathname, it.href));
                          const openState = subOpen || hasActiveItem;

                          return (
                            <div key={section.id} className="rounded border border-base-300/70">
                              <button
                                className="w-full flex items-center gap-2 px-2 py-2 text-left hover:bg-base-200/60"
                                aria-expanded={openState}
                                onClick={() => toggleDsSub(section.id)}
                              >
                                <span className="text-xs uppercase opacity-70">{section.title}</span>
                                <span className={["ml-auto transition-transform", openState ? "rotate-180" : ""].join(" ")}>
                                  <Icon name="chevron" className="w-3 h-3 opacity-60" />
                                </span>
                              </button>
                              <div
                                className={[
                                  "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out",
                                  openState ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                                ].join(" ")}
                              >
                                <div className="min-h-0">
                                  <div className="py-1">
                                    {section.items.map((it) => {
                                      const active = isActive(pathname, it.href);
                                      const cls = ["btn btn-ghost w-full justify-start", active ? "btn-primary" : ""].join(" ");
                                      return (
                                        <Link
                                          key={it.href}
                                          href={it.href}
                                          className={cls}
                                          onClick={() => setOpen(false)} // close on click
                                        >
                                          <Icon name="doc" className="w-4 h-4 mr-2 opacity-80" />
                                          {it.label}
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* Flat groups: Templates & Tools */
                      <div className="p-2 space-y-1">
                        {group.items.map((item) => {
                          const active = isActive(pathname, item.href);
                          const cls = ["btn w-full justify-start", active ? "btn-primary" : "btn-ghost"].join(" ");
                          const hoverProps =
                            group.id === "templates"
                              ? { onMouseEnter: () => startHoverPreview(item.href), onMouseLeave: cancelHoverPreview }
                              : {}; // DS & Tools are click-only
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setOpen(false)}
                              className={cls}
                              {...hoverProps}
                            >
                              {item.icon && <Icon name={item.icon} className="w-4 h-4 mr-2 opacity-80" />}
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="divider my-2" />
          <button className="btn btn-outline btn-sm w-full justify-center" onClick={toggle}>
            Toggle (or press Esc twice)
          </button>
        </nav>

        {/* Footer tip */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-xs opacity-70 border-t">
          DS links: click to navigate (no hover). Templates support hover preview. Double-Esc toggles.
        </div>
      </aside>
    </>
  );
}
