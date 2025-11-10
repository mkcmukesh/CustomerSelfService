"use client";

import React from "react";

/* tiny classnames helper */
function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export const DASHBOARD_FOOTER_HEIGHT = 48; // keep in sync with h-12 below

type DashboardFooterProps = {
  /** Left text in the footer */
  left?: React.ReactNode;
  /** Optional right-aligned content (e.g., links) */
  right?: React.ReactNode;
  /** Extra classes if you want to tweak visuals */
  className?: string;
};

/** Fixed footer that matches the header (white/blur theme) */
export default function DashboardFooter({
  left = "DeepSight VMS · v1.0",
  right,
  className,
}: DashboardFooterProps) {
  return (
    <footer
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        "h-12 border-t border-slate-200 bg-white/90 backdrop-blur",
        "text-xs text-slate-600",
        className
      )}
    >
      <div className="h-full px-4 flex items-center justify-between">
        <div>{left}</div>
        {right ? <div>{right}</div> : null}
      </div>
    </footer>
  );
}
