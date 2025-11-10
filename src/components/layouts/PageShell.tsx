"use client";

import React, { useState, PropsWithChildren, CSSProperties } from "react";
import HamburgerMenu from "@/nav/HamburgerMenu";

/* tiny classnames helper */
function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

/* ======= Theme bits borrowed from homepage ======= */
const dotBg: CSSProperties = {
  backgroundImage: "radial-gradient(white 1px, transparent 1px)",
  backgroundSize: "14px 14px",
  backgroundPosition: "0 0",
};

/* in case you want the halo somewhere inside pages */
export const haloStyle: CSSProperties = {
  padding: "36px",
  background:
    "radial-gradient(circle at center, rgba(255,255,255,0.35) 1px, transparent 1px)",
  backgroundSize: "10px 10px",
  maskImage: "radial-gradient(circle, black 64%, transparent 66%)",
  WebkitMaskImage: "radial-gradient(circle, black 64%, transparent 66%)",
};

/* quick theme map if you want per-layout colors later */
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

/* ---------- Site header/footer ---------- */

const CONTAINER = "max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8";

function SiteHeader() {
  return (

        <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className={`navbar h-16 ${CONTAINER}`}>
        <div className="flex-1">
          <a className="btn btn-ghost text-slate-800 hover:bg-slate-100 text-xl">YourBrand</a>
        </div>
        <nav className="flex-none gap-2">
          <a className="btn btn-ghost text-slate-700 hover:bg-slate-100">Home</a>
          <a className="btn btn-ghost text-slate-700 hover:bg-slate-100">About</a>
          <a className="btn btn-ghost text-slate-700 hover:bg-slate-100">Contact</a>
        </nav>
      </div>
    </header>

    // <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
    //   <div className="navbar max-w-7xl mx-auto">
    //     <div className="flex-1">
    //       <a className="btn btn-ghost text-slate-800 hover:bg-slate-100 text-xl">YourBrand</a>
    //     </div>
    //     <nav className="flex-none gap-2">
    //       <a className="btn btn-ghost text-slate-700 hover:bg-slate-100">Home</a>
    //       <a className="btn btn-ghost text-slate-700 hover:bg-slate-100">About</a>
    //       <a className="btn btn-ghost text-slate-700 hover:bg-slate-100">Contact</a>
    //     </nav>
    //   </div>
    // </header>
  );
}

function SiteFooter() {
  return (

    <footer className="bg-white border-t shadow-sm">
      <div className={`${CONTAINER} py-6 text-sm text-slate-600`}>
        © {new Date().getFullYear()} YourBrand · All rights reserved
      </div>
    </footer>

    // <footer className="bg-white border-t shadow-sm">
    //   <div className="max-w-7xl mx-auto p-6 text-sm text-slate-600">
    //     © {new Date().getFullYear()} YourBrand · All rights reserved
    //   </div>
    // </footer>



  );
}

/* ---------- Dashboard chrome ---------- */
function DashboardHeader() {
  return (
    <div className="h-14 border-b bg-base-100/90 backdrop-blur flex items-center px-4">
      <div className="font-semibold">Dashboard</div>
      <div className="ml-auto flex items-center gap-2">
        <button className="btn btn-sm">Notifications</button>
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content rounded-full w-8">
            <span>U</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardFooter() {
  return (
    <div className="h-10 border-t bg-base-200/90 backdrop-blur text-xs flex items-center px-4">
      Dashboard footer · v1.0
    </div>
  );
}

function DashboardSidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) {
  return (
    <aside
      className={cn(
        "border-r bg-base-200/90 backdrop-blur transition-all",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-14 flex items-center justify-between px-3 border-b">
        <span className={cn("font-semibold", collapsed && "sr-only")}>Menu</span>
        <button className="btn btn-ghost btn-xs" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "»" : "«"}
        </button>
      </div>
      <nav className="menu p-2">
        <a className="menu-item btn btn-ghost justify-start">Overview</a>
        <a className="menu-item btn btn-ghost justify-start">Reports</a>
        <a className="menu-item btn btn-ghost justify-start">Settings</a>
      </nav>
    </aside>
  );
}

/* ---------- Universal PageShell ---------- */
export type LayoutKind =
  | "site"
  | "content"
  | "dashboard"
  | "contentFullHeightCenter"  // Content-FullHeight-Center
  | "contentFullWidth5050";    // Content-fullWidth-5050

function splitChildren(
  kids: React.ReactNode
): [React.ReactNode, React.ReactNode] {
  const arr = React.Children.toArray(kids);
  if (arr.length >= 2) return [arr[0], arr[1]];
  return [kids, null]; // if only one child is provided, it spans left; right stays empty
}








export default function PageShell({
  layout,
  children,
}: PropsWithChildren<{ layout: LayoutKind }>) {
  if (layout === "content") {
    // Content-only (no header/footer) — still gets the homepage theme
    return (

// CONTENT-ONLY layout
<main className="relative min-h-dvh w-full overflow-hidden py-16 md:py-20">
  <ThemedBack tone="content" />
  <div className={`${CONTAINER} text-slate-800`}>{children}</div>
</main>


  // <main className="relative min-h-dvh w-full overflow-hidden">
  //   <ThemedBack tone="content" />
  //   <div className="max-w-7xl mx-auto p-6 text-slate-800">{children}</div>
  // </main>
    );
  }

// ---------------- Content-FullHeight-Center ----------------
if (layout === "contentFullHeightCenter") {
  return (
    <main className="relative min-h-dvh w-full overflow-hidden">
      <ThemedBack tone="content" />
        <div className="absolute right-16 pt-3 z-[999]">
        <HamburgerMenu />
        </div>
      <div className={` min-h-dvh ${CONTAINER} flex items-center justify-center`}>
        <div className="relative w-full h-screen flex items-center justify-center align-middle text-center text-slate-800">
          {children}
        </div>
      </div>
    </main>
  );
}

// ---------------- Content-fullWidth-5050 ----------------
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
    return (
      <div className="relative min-h-dvh overflow-hidden">
        <ThemedBack tone="dashboard" />
        <div
          className="grid"
          style={{ gridTemplateRows: "auto 1fr auto", gridTemplateColumns: "auto 1fr" }}
        >
          {/* Header (spans) */}
          <div className="col-span-2">
            <DashboardHeader />
          </div>
          {/* Sidebar + main */}
          <DashboardSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <main className="p-4">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
          {/* Footer (spans) */}
          <div className="col-span-2">
            <DashboardFooter />
          </div>
        </div>
      </div>
    );
  }

  // Default: "site" (header + content + footer) — with homepage theme
  return (
    <div className="relative min-h-dvh flex flex-col overflow-hidden">
      <ThemedBack tone="site" />
      <SiteHeader />

<main className="flex-1 pt-16 md:pt-20">
  <div className={`${CONTAINER} text-slate-800`}>{children}</div>
</main>


      {/* <main className="flex-1">
        <div className="max-w-7xl mx-auto p-6 text-slate-800">{children}</div>
      </main> */}
      <SiteFooter />
    </div>
  );
}
