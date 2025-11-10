"use client";

import React, { useState, PropsWithChildren, CSSProperties } from "react";
import DashboardHeader from "@/components/Panther-CSS/Header/Header-1";
import DashboardSidebar from "@/components/Panther-CSS/Sidebar/Sidebar-1";
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

export const haloStyle: CSSProperties = {
  padding: "36px",
  background:
    "radial-gradient(circle at center, rgba(255,255,255,0.35) 1px, transparent 1px)",
  backgroundSize: "10px 10px",
  maskImage: "radial-gradient(circle, black 64%, transparent 66%)",
  WebkitMaskImage: "radial-gradient(circle, black 64%, transparent 66%)",
};

type LayoutKind = "site" | "content" | "dashboard";

const GRADIENTS: Record<LayoutKind, string> = {
  site: "from-sky-400 via-sky-500 to-sky-600",
  content: "from-sky-400 via-sky-500 to-sky-600",
  dashboard: "from-sky-400 via-sky-500 to-sky-600",
};

function ThemedBack({ tone }: { tone: LayoutKind }) {
  return (
    <>
      <div className={cn("absolute inset-0 -z-10 bg-gradient-to-b", GRADIENTS[tone])} />
      <div aria-hidden className="absolute inset-0 -z-10 opacity-40" style={dotBg} />
    </>
  );
}

/* Layout container width */
const CONTAINER = "max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8";

export default function PageShell({
  layout,
  children,
}: PropsWithChildren<{ layout: LayoutKind }>) {
  if (layout === "dashboard") {
    const [collapsed, setCollapsed] = useState(false);

    // Pad the main area to prevent overlap with the fixed footer.
    const footerPadClass = "pb-12";

    return (
      <div className="relative min-h-dvh overflow-hidden">
        <ThemedBack tone="dashboard" />

        {/* Header, sidebar, and content grid */}
        <div
          className="grid"
          style={{ gridTemplateRows: "auto 1fr", gridTemplateColumns: "auto 1fr" }}
        >
          <div className="col-span-2">
            <DashboardHeader />
          </div>

          <DashboardSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

          <main className={cn("p-4", footerPadClass)}>
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>

        {/* Fixed footer (same visual theme as the header) */}
        <DashboardFooter left="Panther CSS · v1.0" />
      </div>
    );
  }

  // Default: simple site layout
  return (
    <div className="relative min-h-dvh flex flex-col overflow-hidden">
      <ThemedBack tone="site" />
      <main className="flex-1 pt-16 md:pt-20">
        <div className={`${CONTAINER} text-slate-800`}>{children}</div>
      </main>
    </div>
  );
}
