"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminSidebar } from "./AdminSidebarProvider";

/* -------------------------------------------
   Double-Esc hook (Esc twice within threshold)
-------------------------------------------- */
function useDoubleEsc(onDoubleEsc: () => void, threshold = 400) {
  const timer = React.useRef<number | null>(null);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.isComposing) return;

      // ignore when typing
      const t = e.target as HTMLElement | null;
      const tag = (t?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || t?.isContentEditable) return;

      if (timer.current != null) {
        window.clearTimeout(timer.current);
        timer.current = null;
        onDoubleEsc(); // second Esc → toggle
      } else {
        timer.current = window.setTimeout(() => {
          timer.current = null;
        }, threshold);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      if (timer.current != null) window.clearTimeout(timer.current);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onDoubleEsc, threshold]);
}

/* -------------------------
   Minimal inline icons
-------------------------- */
type IconName =
  | "layout"
  | "template"
  | "dashboard"
  | "doc"
  | "login"
  | "chevron"
  | "library"
  | "blocks"
  | "columns";

const Icon = ({ name, className = "w-4 h-4" }: { name: IconName; className?: string }) => {
  const s = "stroke-current";
  switch (name) {
    case "layout":
      return (<svg viewBox="0 0 24 24" className={className}><rect x="3" y="4" width="18" height="16" rx="2" className={s} fill="none" strokeWidth="2"/><path d="M3 9h18M9 9v11" className={s} fill="none" strokeWidth="2"/></svg>);
    case "template":
      return (<svg viewBox="0 0 24 24" className={className}><rect x="4" y="4" width="16" height="16" rx="2" className={s} fill="none" strokeWidth="2"/><path d="M8 8h8M8 12h8M8 16h5" className={s} fill="none" strokeWidth="2"/></svg>);
    case "dashboard":
      return (<svg viewBox="0 0 24 24" className={className}><path d="M3 13h8V3H3zM13 21h8V11h-8zM13 3v6h8V3zM3 21h8v-6H3z" className={s} fill="none" strokeWidth="2"/></svg>);
    case "doc":
      return (<svg viewBox="0 0 24 24" className={className}><path d="M6 3h7l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" className={s} fill="none" strokeWidth="2"/><path d="M13 3v6h6" className={s} fill="none" strokeWidth="2"/></svg>);
    case "login":
      return (<svg viewBox="0 0 24 24" className={className}><path d="M10 17l5-5-5-5" className={s} fill="none" strokeWidth="2"/><path d="M15 12H3" className={s} fill="none" strokeWidth="2"/><path d="M21 21V3" className={s} fill="none" strokeWidth="2"/></svg>);
    case "chevron":
      return (<svg viewBox="0 0 24 24" className={className}><path d="M8 10l4 4 4-4" className={s} fill="none" strokeWidth="2"/></svg>);
    case "library":
      return (<svg viewBox="0 0 24 24" className={className}><path d="M4 19h16M6 17V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v12M14 17V7a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v10" className={s} fill="none" strokeWidth="2"/></svg>);
    case "blocks": // generic component icon
      return (<svg viewBox="0 0 24 24" className={className}><rect x="3" y="3" width="8" height="8" rx="2" className={s} fill="none" strokeWidth="2"/><rect x="13" y="3" width="8" height="8" rx="2" className={s} fill="none" strokeWidth="2"/><rect x="3" y="13" width="8" height="8" rx="2" className={s} fill="none" strokeWidth="2"/><rect x="13" y="13" width="8" height="8" rx="2" className={s} fill="none" strokeWidth="2"/></svg>);
    case "columns": // layout-ish icon for headers/navs/footers
      return (<svg viewBox="0 0 24 24" className={className}><rect x="3" y="4" width="18" height="16" rx="2" className={s} fill="none" strokeWidth="2"/><path d="M3 9h18M8 9v11M16 9v11" className={s} fill="none" strokeWidth="2"/></svg>);
  }
};

/* -------------------------
   Types & utilities
-------------------------- */
type NavItem = {
  label: string;
  href?: string;
  icon?: IconName;
  external?: boolean;
  children?: NavItem[];
};
type NavGroup = {
  id: string;
  title: string;
  icon?: IconName;
  items: NavItem[];
};

const isActive = (pathname: string | null, href?: string) =>
  !!pathname && !!href && (pathname === href || pathname.startsWith(href + "/"));

const STORAGE_KEY = "adminSidebar.openGroups";

/* ---------------------------------------------------------
   Optional DS adapter (works only if your registry exists)
---------------------------------------------------------- */
let DS_GROUP: NavGroup | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { ORDERED_KEYS, getSection } = require("@/nav");
  DS_GROUP = {
    id: "ds",
    title: "DS",
    icon: "library",
    items: (ORDERED_KEYS as string[]).map((key) => {
      const sec = getSection(key);
      return {
        label: sec.title as string,
        children: sec.items.map((it: { href: string; label: string }) => ({
          label: it.label,
          href: it.href,
          icon: "doc",
        })),
      } as NavItem;
    }),
  };
} catch { /* ignore if registry not available */ }

/* ---------------------------------------------
   SINGLE SOURCE OF TRUTH — edit NAV only here
   Library now has parallel categories:
   - Cards
   - Headers
   - Footers
   - Navs
---------------------------------------------- */
const NAV: NavGroup[] = [
  {
    id: "templates",
    title: "Templates",
    icon: "template",
    items: [
      { label: "Content-FullHeight-Center", href: "/templates/centered",  icon: "doc" },
      { label: "Content-fullWidth-5050",    href: "/templates/split5050", icon: "doc" },
      { label: "Website (Site Layout)",     href: "/templates/website",   icon: "doc" },
      { label: "Dashboard (Sidebar)",       href: "/templates/dashboard", icon: "dashboard" },
      { label: "Content Only (Legal)",      href: "/templates/legal",     icon: "doc" },
      { label: "Login",                      href: "/templates/login",     icon: "login" },
    ],
  },
  {
    id: "tools",
    title: "Tools",
    icon: "template",
    items: [
      { label: "E-mailer", href: "/pages/Tools/E-mailer", icon: "doc" },
      { label: "Time Utility", href: "/pages/Tools/Time-Utility", icon: "doc" },
      { label: "Electricity Bill Calculator", href: "/pages/Tools/Electricity/Electricity-Bill-Calculator", icon: "doc" },
      { label: "Energy Consumption Calculator", href: "/pages/Tools/Electricity/Energy-Consumption-Calculator", icon: "doc" },
      { label: "Fuel Economy & Cost Tracker", href: "/pages/Tools/Electricity/Fuel-Economy-Cost-Tracker", icon: "doc" },
      { label: "Solar Roi & Sizing", href: "/pages/Tools/Electricity/Solar-Roi-Sizing", icon: "doc" },
      // more tools…
    ],
  },

  /* -------- Library: parallel categories -------- */
  {
    id: "education",
    title: "Education",
    icon: "education",
    items: [
      {
        label: "Physics",
        icon: "blocks",
        children: [
          { label: "Projectile Motion Lab", href: "/pages/Education/Physics/Projectile-Motion-Lab", icon: "doc" },
          { label: "Uniform Circular Motion / Banked Curves", href: "/pages/Education/Physics/Uniform-Circular-Motion-OR-Banked-Curves", icon: "doc" },
          { label: "Work–Energy & Power Visualizer", href: "/pages/Education/Physics/Work-Energy-Power-Visualizer", icon: "doc" },
        ],
      },
      {
        label: "Chemistry",
        icon: "columns",
        children: [
          { label: "Header Viewer", href: "/pages/Library/Headers/HeaderViewer", icon: "doc" },
        ],
      },
      {
        label: "Mathematics",
        icon: "columns",
        children: [
          // { label: "Footer Viewer", href: "/pages/Library/Footers/FooterViewer", icon: "doc" },
        ],
      },
      {
        label: "Biology",
        icon: "columns",
        children: [
          // { label: "Navs Viewer", href: "/pages/Library/Navs/NavViewer", icon: "doc" },
        ],
      },
            {
        label: "Common / Lab Skills",
        icon: "columns",
        children: [
          // { label: "Footer Viewer", href: "/pages/Library/Footers/FooterViewer", icon: "doc" },
        ],
      },     
    ],
  },




  /* -------- Library: parallel categories -------- */
  {
    id: "library",
    title: "Library",
    icon: "library",
    items: [
      {
        label: "Cards",
        icon: "blocks",
        children: [
          { label: "Card Viewer", href: "/pages/Library/Cards/CardViewer", icon: "doc" },
          { label: "Header Viewer", href: "/pages/Library/Headers/HeaderViewer", icon: "doc" },
          { label: "Footer Viewer", href: "/pages/Library/Footers/FooterViewer", icon: "doc" },
          // optional: direct links to specific card demo pages
          // { label: "Card 1", href: "/pages/Library/Cards/Card1", icon: "doc" },
          // { label: "Card 2", href: "/pages/Library/Cards/Card2", icon: "doc" },
        ],
      },
      {
        label: "Headers",
        icon: "columns",
        children: [
          { label: "Header Viewer", href: "/pages/Library/Headers/HeaderViewer", icon: "doc" },
          // add: { label: "Header 1", href: "/pages/Library/Headers/Header1", icon: "doc" },
        ],
      },
      {
        label: "Footers",
        icon: "columns",
        children: [
          { label: "Footer Viewer", href: "/pages/Library/Footers/FooterViewer", icon: "doc" },
          // add: { label: "Footer 1", href: "/pages/Library/Footers/Footer1", icon: "doc" },
        ],
      },
      {
        label: "Navs",
        icon: "columns",
        children: [
          { label: "Navs Viewer", href: "/pages/Library/Navs/NavViewer", icon: "doc" },
          // add: { label: "Top Nav", href: "/pages/Library/Navs/TopNav", icon: "doc" },
        ],
      },
    ],
  },

  ...(DS_GROUP ? [DS_GROUP] : []),
];

/* ---------------------------------------------
   Small UI building blocks
---------------------------------------------- */
function Group({
  group,
  expanded,
  onToggle,
  children,
}: {
  group: NavGroup;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-base-300 bg-base-100/70">
      <button
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-base-200/80"
        aria-expanded={expanded}
        onClick={onToggle}
      >
        {group.icon && <Icon name={group.icon} className="w-4 h-4 opacity-80" />}
        <span className="text-sm font-semibold flex-1">{group.title}</span>
        <span className={["transition-transform", expanded ? "rotate-180" : ""].join(" ")}>
          <Icon name="chevron" className="w-4 h-4 opacity-70" />
        </span>
      </button>
      <div
        className={[
          "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        ].join(" ")}
      >
        <div className="min-h-0">{children}</div>
      </div>
    </div>
  );
}

function LeafLink({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick?: () => void;
}) {
  const cls = ["btn w-full justify-start", active ? "btn-primary" : "btn-ghost"].join(" ");
  return item.href ? (
    <Link
      href={item.href}
      className={cls}
      onClick={onClick}
      target={item.external ? "_blank" : undefined}
    >
      {item.icon && <Icon name={item.icon as IconName} className="w-4 h-4 mr-2 opacity-80" />}
      {item.label}
    </Link>
  ) : (
    <div className="btn btn-ghost w-full justify-start opacity-60">
      {item.icon && <Icon name={item.icon as IconName} className="w-4 h-4 mr-2 opacity-60" />}
      {item.label}
    </div>
  );
}

function Branch({
  item,
  pathname,
  onAnyClick,
}: {
  item: NavItem;            // item with children
  pathname: string | null;
  onAnyClick?: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  // auto-open if any child is active
  React.useEffect(() => {
    const hasActive = item.children?.some((c) => isActive(pathname, c.href));
    if (hasActive) setOpen(true);
  }, [pathname, item.children]);

  return (
    <div className="rounded border border-base-300/70">
      <button
        className="w-full flex items-center gap-2 px-2 py-2 text-left hover:bg-base-200/60"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-xs uppercase opacity-70">{item.label}</span>
        <span className={["ml-auto transition-transform", open ? "rotate-180" : ""].join(" ")}>
          <Icon name="chevron" className="w-3 h-3 opacity-60" />
        </span>
      </button>
      <div
        className={[
          "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        ].join(" ")}
      >
        <div className="min-h-0 py-1">
          {item.children?.map((leaf) => (
            <LeafLink
              key={leaf.href ?? leaf.label}
              item={leaf}
              active={isActive(pathname, leaf.href)}
              onClick={onAnyClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   Main Sidebar Component
---------------------------------------------- */
export default function AdminSidebar() {
  const { open, setOpen, toggle } = useAdminSidebar();
  const pathname = usePathname();

  // Esc + Esc toggle
  useDoubleEsc(toggle);

  // Persisted expanded groups
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setExpanded(JSON.parse(raw));
    } catch {}
  }, []);
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expanded));
    } catch {}
  }, [expanded]);

  // Auto-expand the group that contains the current route
  React.useEffect(() => {
    if (!pathname) return;
    setExpanded((prev) => {
      const next = { ...prev };
      NAV.forEach((g) => {
        const contains = g.items.some((it) =>
          it.children ? it.children.some((c) => isActive(pathname, c.href)) : isActive(pathname, it.href)
        );
        if (contains) next[g.id] = true;
      });
      return next;
    });
  }, [pathname]);

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
          "shadow-lg flex flex-col min-h-0",
        ].join(" ")}
      >
        {/* Header */}
        <div className="h-14 border-b flex items-center justify-between px-3">
          <span className="font-semibold">Admin</span>
          <button className="btn btn-ghost btn-xs" onClick={() => setOpen(false)} aria-label="Close sidebar">
            ✕
          </button>
        </div>

        {/* Groups */}
        <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 space-y-3 pb-20">
          {NAV.map((group) => {
            const isOpen = !!expanded[group.id];
            return (
              <Group
                key={group.id}
                group={group}
                expanded={isOpen}
                onToggle={() => setExpanded((s) => ({ ...s, [group.id]: !s[group.id] }))}
              >
                <div className="p-2 space-y-2">
                  {group.items.map((it) =>
                    it.children && it.children.length > 0 ? (
                      <Branch
                        key={it.label}
                        item={it}
                        pathname={pathname}
                        onAnyClick={() => setOpen(false)}
                      />
                    ) : (
                      <LeafLink
                        key={it.href ?? it.label}
                        item={it}
                        active={isActive(pathname, it.href)}
                        onClick={() => setOpen(false)}
                      />
                    )
                  )}
                </div>
              </Group>
            );
          })}

          <div className="divider my-2" />
          <button className="btn btn-outline btn-sm w-full justify-center" onClick={toggle}>
            Toggle (or press Esc twice)
          </button>
        </nav>

        {/* Footer tip */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-xs opacity-70 border-t">
          Click a category to expand; click a link to navigate. Double-Esc toggles.
        </div>
      </aside>
    </>
  );
}
