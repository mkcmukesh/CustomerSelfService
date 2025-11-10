"use client";

import React, { useState, PropsWithChildren, CSSProperties, ReactNode } from "react";
import DashboardHeader from "@/components/Panther-CSS/Header/Header-1";
import LeftSidebar from "@/components/Panther-CSS/Sidebar/LeftSidebar-1";
import RightSidebar from "@/components/Panther-CSS/Sidebar/RightSidebar-1";
import DashboardFooter from "@/components/Panther-CSS/Footer/Footer-1";

/* Utility */
function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

/* Background theme */
const dotBg: CSSProperties = {
  backgroundImage: "radial-gradient(white 1px, transparent 1px)",
  backgroundSize: "14px 14px",
  backgroundPosition: "0 0",
};

type Tone = "site" | "content" | "app";
const GRADIENTS: Record<Tone, string> = {
  site: "from-sky-400 via-sky-500 to-sky-600",
  content: "from-sky-400 via-sky-500 to-sky-600",
  app: "from-sky-400 via-sky-500 to-sky-600",
};

function ThemedBack({ tone }: { tone: Tone }) {
  return (
    <>
      <div className={cn("absolute inset-0 -z-10 bg-gradient-to-b", GRADIENTS[tone])} />
      <div aria-hidden className="absolute inset-0 -z-10 opacity-40" style={dotBg} />
    </>
  );
}

/* Props for the global shell */
type PageShellProps = PropsWithChildren<{
  tone?: Tone;
  containerClassName?: string;

  /* Regions */
  showHeader?: boolean;
  showFooter?: boolean;
  showSidebar?: boolean;
  showRightSidebar?: boolean;

  /* Overrides */
  header?: ReactNode;
  footer?: ReactNode;
  sidebar?: ReactNode;
  rightSidebar?: ReactNode;

  /* Footer behavior */
  fixedFooter?: boolean;
  footerHeightPx?: number;

  /* Sidebar sizing */
  sidebarWidth?: number;
  rightSidebarWidth?: number;
}>;

/**
 * Global application shell with pluggable header, footer, and left/right sidebars.
 * - Works for dashboards, sites, and content pages—toggle regions as needed.
 * - Supports fixed footer with automatic bottom padding.
 * - Sidebars can be swapped with custom components or disabled.
 */
export default function PageShell({
  children,
  tone = "app",
  containerClassName = "max-w-7xl mx-auto",
  showHeader = true,
  showFooter = true,
  showSidebar = true,
  showRightSidebar = false,
  header,
  footer,
  sidebar,
  rightSidebar,
  fixedFooter = true,
  footerHeightPx = 48,
  sidebarWidth = 256,        // ~w-64
  rightSidebarWidth = 320,   // inspector/detail panel width
}: PageShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  /* Defaults */
  const HeaderEl = header ?? <DashboardHeader />;
  const FooterEl = footer ?? <DashboardFooter left="Panther CSS · v1.0" />;
  const SidebarEl =
    sidebar ?? <LeftSidebar collapsed={collapsed} setCollapsed={setCollapsed} />;
  const RightSidebarEl =
    rightSidebar ?? <RightSidebar title="Actions & Updates" footerOffsetPx={footerHeightPx} />;

  /* Grid columns based on visible sidebars */
  const cols =
    showSidebar && showRightSidebar
      ? `${collapsed ? 64 : sidebarWidth}px 1fr ${rightSidebarWidth}px`
      : showSidebar
      ? `${collapsed ? 64 : sidebarWidth}px 1fr`
      : showRightSidebar
      ? `1fr ${rightSidebarWidth}px`
      : "1fr";

  /* Prevent main from hiding under fixed footer */
  const mainBottomPad = fixedFooter && showFooter ? { paddingBottom: `${footerHeightPx}px` } : {};

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <ThemedBack tone={tone} />

      {/* Header */}
      {showHeader ? <div className="sticky top-0 z-40">{HeaderEl}</div> : null}

      {/* Body grid */}
      <div
        className="grid"
        style={{ gridTemplateRows: "1fr", gridTemplateColumns: cols }}
      >
        {/* Left sidebar */}
        {showSidebar ? (
          <div
            style={{ width: collapsed ? 64 : sidebarWidth }}
            className="min-h-[calc(100dvh-var(--header-offset,0px))]"
          >
            {SidebarEl}
          </div>
        ) : null}

        {/* Main content */}
        <main className="p-4" style={mainBottomPad}>
          <div className={cn(containerClassName, "text-slate-800")}>{children}</div>
        </main>

        {/* Right sidebar (now wired) */}
        {showRightSidebar ? (
          <div style={{ width: rightSidebarWidth }}>
            {RightSidebarEl}
          </div>
        ) : null}
      </div>

      {/* Footer */}
      {showFooter ? (
        fixedFooter ? (
          <div style={{ height: footerHeightPx }} className="fixed bottom-0 left-0 right-0 z-40">
            {FooterEl}
          </div>
        ) : (
          <div>{FooterEl}</div>
        )
      ) : null}
    </div>
  );
}
