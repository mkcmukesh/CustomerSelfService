"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users2,
  BarChart3,
  Settings,
  CalendarDays,
  FolderKanban,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/** local tiny classnames helper */
function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export type DashboardSidebarProps = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
};

/** Sidebar: white/blur theme, full available height, icons; hover #00B5FD */
export default function DashboardSidebar({
  collapsed,
  setCollapsed,
}: DashboardSidebarProps) {
  // header is 4rem (h-16); footer is 3rem (h-12). Fill the remaining height.
  const fullHeightClass = "min-h-[calc(100dvh-4rem-3rem)]";
  const item =
    "rounded justify-start hover:bg-[#00B5FD] hover:text-white " +
    "focus-visible:ring-2 focus-visible:ring-[#00B5FD]";

  return (
    <aside
      className={cn(
        "border-r border-slate-200 bg-white/90 backdrop-blur transition-all",
        collapsed ? "w-16" : "w-64"
      )}
      style={{ contain: "layout paint", overflow: "hidden" }} // independent scroll if needed
    >
      <div className="h-14 flex items-center justify-between px-3 border-b border-slate-200 bg-white/80">
        <span className={cn("font-semibold text-slate-700", collapsed && "sr-only")}>
          Menu
        </span>
        <button
          className="btn btn-ghost btn-xs text-slate-600"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className={cn("p-2 overflow-y-auto text-slate-700", fullHeightClass)}>
        <ul className="menu gap-1">
          <li className={item}>
            <Link href="/pages/DS-VMS/Dashboard" className="btn btn-ghost justify-start gap-3">
              <LayoutDashboard className="w-4 h-4" />
              <span className={collapsed ? "sr-only" : ""}>Overview</span>
            </Link>
          </li>
          <li className={item}>
            <Link
              href="/pages/DS-VMS/Employee/EmployeeDashboard"
              className="btn btn-ghost justify-start gap-3"
            >
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
