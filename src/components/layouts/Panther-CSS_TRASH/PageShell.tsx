"use client";

import React, { useState, useRef, useEffect, PropsWithChildren, CSSProperties } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  LayoutDashboard,
  Users2,
  CalendarDays,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  FolderKanban,
  ShoppingCart,
  ChevronDown,
  FileText,          // Inquiry
  ClipboardList,     // Orders
  CreditCard,        // Accounts
  MessageCircleWarning, // Complaints
  Gauge,             // Performance
  BarChart3,         // Reports
  HelpCircle,        // Helpdesk
} from "lucide-react";
import HamburgerMenu from "@/nav/HamburgerMenu";

import DashboardHeader from "@/components/Panther-CSS/Header/DashboardHeader";




/* tiny classnames helper */
function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

/* ======= Theme bits ======= */
const dotBg: CSSProperties = {
  backgroundImage: "radial-gradient(white 1px, transparent 1px)",
  backgroundSize: "14px 14px",
  backgroundPosition: "0 0",
};


export const haloStyle: CSSProperties = {
  padding: "36px",
  background:
    "radial-gradient(circle at center, rgba(255,255,255,0.35) 1px, transparent 1px)",
  backgroundSize: "10px 10px",
  maskImage: "radial-gradient(circle, black 64%, transparent 66%)",
  WebkitMaskImage: "radial-gradient(circle, black 64%, transparent 66%)",
};

const GRADIENTS: Record<LayoutKind, string> = {
  site: "from-sky-400 via-sky-500 to-sky-600",
  content: "from-sky-400 via-sky-500 to-sky-600",
  dashboard: "from-sky-400 via-sky-500 to-sky-600",
};

/* shared background layer used in all layouts */
function ThemedBack({ tone }: { tone: LayoutKind }) {
  return (
    <>
      <div className={cn("absolute inset-0 -z-10 bg-gradient-to-b", GRADIENTS[tone])} />
      <div aria-hidden className="absolute inset-0 -z-10 opacity-40" style={dotBg} />
    </>
  );
}

/* ---------- Site header/footer (unchanged look) ---------- */

const CONTAINER = "max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8";

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className={`navbar h-16 ${CONTAINER}`}>
        <div className="flex-1">
          <a className="btn btn-ghost text-slate-800 hover:bg-slate-100 text-xl">YourBrand1</a>
        </div>
        <nav className="flex-none gap-2">
          <a className="btn btn-ghost text-slate-700 hover:bg-slate-100">Home</a>
          <a className="btn btn-ghost text-slate-700 hover:bg-slate-100">About</a>
          <a className="btn btn-ghost text-slate-700 hover:bg-slate-100">Contact</a>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-white border-t shadow-sm">
      <div className={`${CONTAINER} py-6 text-sm text-slate-600`}>
        © {new Date().getFullYear()} YourBrand · All rights reserved
      </div>
    </footer>
  );
}

/* ---------- Dashboard chrome (UPDATED per your request) ---------- */

function ActionsDropdown() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // close on Esc or outside click
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (!panelRef.current || !btnRef.current) return;
      if (
        !panelRef.current.contains(e.target as Node) &&
        !btnRef.current.contains(e.target as Node)
      ) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const item =
    "flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 " +
    "text-slate-700 hover:bg-[#00B5FD] hover:text-white transition";

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger */}
      <button
        ref={btnRef}
        type="button"
        className="flex items-center gap-1 hover:text-slate-900 transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="actions-menu"
        onClick={() => setOpen(v => !v)} // supports click/tap
      >
        Actions
        <ChevronDown className="w-4 h-4 translate-y-[1px]" />
      </button>

      {/* Panel */}
      <div
        ref={panelRef}
        id="actions-menu"
        role="menu"
        className={[
          "absolute right-0 top-full z-50 w-[240px] rounded-xl border border-slate-200",
          "bg-white shadow-xl p-2 mt-2 transition",
          open
            ? "opacity-100 visible translate-y-0 pointer-events-auto"
            : "opacity-0 invisible -translate-y-1 pointer-events-none",
          // small hover bridge to prevent flicker when moving from button to panel
          "before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2",
        ].join(" ")}
      >
        <ul className="space-y-2">
          <li><Link href="/actions/inquiry" className={item} role="menuitem">
            <FileText className="w-5 h-5 opacity-70" /> <span>Inquiry</span>
          </Link></li>

          <li><Link href="/actions/orders" className={item} role="menuitem">
            <ClipboardList className="w-5 h-5 opacity-70" /> <span>Orders</span>
          </Link></li>

          <li><Link href="/actions/accounts" className={item} role="menuitem">
            <CreditCard className="w-5 h-5 opacity-70" /> <span>Accounts</span>
          </Link></li>

          <li><Link href="/actions/complaints" className={item} role="menuitem">
            <MessageCircleWarning className="w-5 h-5 opacity-70" /> <span>Complaints</span>
          </Link></li>

          <li><Link href="/actions/performance" className={item} role="menuitem">
            <Gauge className="w-5 h-5 opacity-70" /> <span>Performance</span>
          </Link></li>

          <li><Link href="/actions/reports" className={item} role="menuitem">
            <BarChart3 className="w-5 h-5 opacity-70" /> <span>Reports</span>
          </Link></li>

          <li><Link href="/actions/helpdesk" className={item} role="menuitem">
            <HelpCircle className="w-5 h-5 opacity-70" /> <span>Helpdesk</span>
          </Link></li>
        </ul>
      </div>
    </div>
  );
}


  <DashboardHeader
    cartCount={8}
    userName="Ashish Kumar"
    userRole="Dealer & Retailer"
    avatarSrc="/images/avatars/ashish-kumar.jpg"
  />





/** Footer: same theme as header + fixed at bottom. */
const DASHBOARD_FOOTER_HEIGHT = 48; // keep in sync with h-12 below

function DashboardFooter() {
  return (
    <footer
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        "h-12 border-t border-slate-200 bg-white/90 backdrop-blur",
        "text-xs text-slate-600"
      )}
    >
      <div className="h-full px-4 flex items-center">
        DeepSight VMS · v1.0
      </div>
    </footer>
  );
}

/** Sidebar: same theme (white/blur), full available height, icons for items. */
function DashboardSidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) {
  /** header is 4rem (h-16); footer is 3rem (h-12). Fill the remaining height. */
  const fullHeightClass =
    "min-h-[calc(100dvh-4rem-3rem)]"; // 100dvh - header(64px) - footer(48px)

const item = "rounded justify-start hover:bg-[#00B5FD] hover:text-white focus-visible:ring-2 focus-visible:ring-[#00B5FD]";


  return (
    <aside
      className={cn(
        "border-r border-slate-200 bg-white/90 backdrop-blur transition-all",
        collapsed ? "w-16" : "w-64"
      )}



      /* make it scroll independently if content overflows */
      style={{ contain: "layout paint", overflow: "hidden" }}
    >
      <div className="h-14 flex items-center justify-between px-3 border-b border-slate-200 bg-white/80">
        <span className={cn("font-semibold text-slate-700", collapsed && "sr-only")}>Menu</span>
        <button
          className="btn btn-ghost btn-xs text-slate-600"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav
        className={cn(
          "p-2 overflow-y-auto text-slate-700",
          fullHeightClass
        )}
      >
        
        <ul className="menu gap-1">
          <li className={item}>
            <Link href="/pages/DS-VMS/Dashboard" className="btn btn-ghost justify-start gap-3 item">
              <LayoutDashboard className="w-4 h-4" />
              <span className={collapsed ? "sr-only" : ""}>Overview</span>
            </Link>
          </li>
          <li className={item}>
            <Link href="/pages/DS-VMS/Employee/EmployeeDashboard" className="btn btn-ghost justify-start gap-3">
              <Users2 className="w-4 h-4" />
              <span className={collapsed ? "sr-only" : ""}>Team</span>
            </Link>
          </li>
          <li className={item}>
            <Link href="/pages/DS-VMS/Reports" className="btn btn-ghost justify-start gap-3">
              <BarChart3 className="w-4 h-4" />
              <span className={collapsed ? "sr-only" : ""}>Reports</span>
            </Link>
          </li>
          <li className={item}>
            <Link href="/pages/DS-VMS/Settings" className="btn btn-ghost justify-start gap-3">
              <Settings className="w-4 h-4" />
              <span className={collapsed ? "sr-only" : ""}>Settings</span>
            </Link>
          </li>

          <li className="mt-2 opacity-60">
            <span className={cn("px-2 text-[10px] uppercase tracking-wider", collapsed && "sr-only")}>
              Shortcuts
            </span>
          </li>
          <li className={item}>
            <Link href="/pages/DS-VMS/Calendar" className="btn btn-ghost justify-start gap-3">
              <CalendarDays className="w-4 h-4" />
              <span className={collapsed ? "sr-only" : ""}>Calendar</span>
            </Link>
          </li>
          <li className={item}>
            <Link href="/pages/DS-VMS/Projects" className="btn btn-ghost justify-start gap-3">
              <FolderKanban className="w-4 h-4" />
              <span className={collapsed ? "sr-only" : ""}>Projects</span>
            </Link>
          </li>

          <li className="mt-2">
            <button className="btn btn-ghost justify-start gap-3 text-rose-600">
              <LogOut className="w-4 h-4" />
              <span className={collapsed ? "sr-only" : ""}>Sign out</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

/* ---------- Universal PageShell ---------- */

export type LayoutKind =
  | "site"
  | "content"
  | "dashboard"
  | "contentFullHeightCenter" // Content-FullHeight-Center
  | "contentFullWidth5050";   // Content-fullWidth-5050

function splitChildren(kids: React.ReactNode): [React.ReactNode, React.ReactNode] {
  const arr = React.Children.toArray(kids);
  if (arr.length >= 2) return [arr[0], arr[1]];
  return [kids, null];
}

export default function PageShell({
  layout,
  children,
}: PropsWithChildren<{ layout: LayoutKind }>) {
  if (layout === "content") {
    return (
      <main className="relative min-h-dvh w-full overflow-hidden py-16 md:py-20">
        <ThemedBack tone="content" />
        <div className={`${CONTAINER} text-slate-800`}>{children}</div>
      </main>
    );
  }

  if (layout === "contentFullHeightCenter") {
    return (
      <main className="relative min-h-dvh w-full overflow-hidden">
        <ThemedBack tone="content" />
        <div className="absolute right-16 pt-3 z-[999]">
          <HamburgerMenu />
        </div>
        <div className={`min-h-dvh ${CONTAINER} flex items-center justify-center`}>
          <div className="relative w-full h-screen flex items-center justify-center text-center text-slate-800">
            {children}
          </div>
        </div>
      </main>
    );
  }

  if (layout === "contentFullWidth5050") {
    const [left, right] = splitChildren(children);
    return (
      <main className="relative min-h-dvh w-full overflow-hidden">
        <ThemedBack tone="content" />
        <div className={`${CONTAINER} py-10`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start text-slate-800">
            <section className="min-h-[40vh]">{left}</section>
            <aside className="min-h-[40vh]">{right}</aside>
          </div>
        </div>
      </main>
    );
  }

  if (layout === "dashboard") {
    const [collapsed, setCollapsed] = useState(false);

    /** content needs bottom padding so it doesn't go under the fixed footer */
    const footerPadClass = "pb-12"; // matches h-12 in DashboardFooter

    return (
      <div className="relative min-h-dvh overflow-hidden">
        <ThemedBack tone="dashboard" />

        {/* Grid with header (span), sidebar + content; footer is fixed separately */}
        <div
          className="grid"
          style={{ gridTemplateRows: "auto 1fr", gridTemplateColumns: "auto 1fr" }}
        >
          {/* Header (spans) */}
          <div className="col-span-2">
            <DashboardHeader />
          </div>

          {/* Sidebar + main */}
          {/* <DashboardSidebar collapsed={collapsed} setCollapsed={setCollapsed} /> */}
<div className="col-span-2">
  <DashboardHeader />
</div>

          <main className={cn("p-4", footerPadClass)}>
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>

        {/* Fixed footer (same theme as header) */}
        <DashboardFooter />
      </div>
    );
  }

  // Default: "site"
  return (
    <div className="relative min-h-dvh flex flex-col overflow-hidden">
      <ThemedBack tone="site" />
      <SiteHeader />
      <main className="flex-1 pt-16 md:pt-20">
        <div className={`${CONTAINER} text-slate-800`}>{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
