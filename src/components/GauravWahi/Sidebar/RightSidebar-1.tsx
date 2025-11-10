"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Bell,
  CalendarDays,
  MessageSquare,
  Upload,
  Download,
  Filter,
  Bookmark,
  HelpCircle,
  LifeBuoy,
  Settings,

} from "lucide-react";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export type RightSidebarProps = {
  title?: string;
  footerOffsetPx?: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
  className?: string;
};

export default function RightSidebar({
  title = "Panel",
  footerOffsetPx = 48,
  collapsed,
  onToggleCollapse,
  onClose,
  className,
}: RightSidebarProps) {
  const item =
    "flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 " +
    "hover:bg-[#00B5FD] hover:text-white transition";

  return (
    <aside
      className={cn(
        "border-l border-slate-200 bg-white/90 backdrop-blur flex flex-col h-full",
        className
      )}
      style={{ paddingBottom: `${footerOffsetPx}px` }}
    >
      {/* Sticky panel header with collapse + close */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200 px-2 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-xs text-slate-600"
              onClick={onToggleCollapse}
              title={collapsed ? "Expand" : "Collapse"}
              aria-label={collapsed ? "Expand panel" : "Collapse panel"}
            >
              {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            <h3 className={cn("text-sm font-semibold text-slate-700", collapsed && "sr-only")}>
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <Link
              href="#"
              className={cn("text-xs text-slate-500 hover:text-slate-800 transition", collapsed && "sr-only")}
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
            <button
              type="button"
              className="btn btn-ghost btn-xs text-slate-600"
              onClick={onClose}
              title="Close panel"
              aria-label="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6 text-slate-700">
        {/* Quick Actions */}
        <section>
          <h4 className={cn("text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2", collapsed && "sr-only")}>
            Quick Actions
          </h4>
          <div className="grid grid-cols-1 gap-2">
            <button className={item}><Upload className="w-4 h-4 opacity-70" /> <span className={collapsed ? "sr-only" : ""}>Upload Documents</span></button>
            <button className={item}><Download className="w-4 h-4 opacity-70" /> <span className={collapsed ? "sr-only" : ""}>Download Reports</span></button>
            <button className={item}><Filter className="w-4 h-4 opacity-70" /> <span className={collapsed ? "sr-only" : ""}>Apply Filters</span></button>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h4 className={cn("text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2", collapsed && "sr-only")}>
            Notifications
          </h4>
          <ul className="space-y-2">
            {[
              { icon: Bell, text: "3 pending approvals awaiting your review" },
              { icon: CalendarDays, text: "Meeting with supplier at 3:30 PM" },
              { icon: MessageSquare, text: "New comment on WO-1824" },
            ].map((item, i) => (
              <li key={i} className={cn("rounded-lg border border-slate-200 bg-white px-3 py-2 flex items-start gap-3")}>
                <item.icon className="w-4 h-4 text-slate-400 mt-0.5" />
                <span className={cn("text-sm leading-5", collapsed && "sr-only")}>{item.text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Shortcuts */}
        <section>
          <h4 className={cn("text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2", collapsed && "sr-only")}>
            Shortcuts
          </h4>
          <div className="grid grid-cols-1 gap-2">
            <Link href="/pages/DS-VMS/Employee/EmployeeDashboard" className={item}>
              <Bookmark className="w-4 h-4 opacity-70" />
              <span className={collapsed ? "sr-only" : ""}>Employee Dashboard</span>
            </Link>
            <Link href="/pages/DS-VMS/Reports" className={item}>
              <Bookmark className="w-4 h-4 opacity-70" />
              <span className={collapsed ? "sr-only" : ""}>Reports</span>
            </Link>
            <Link href="/pages/DS-VMS/Settings" className={item}>
              <Bookmark className="w-4 h-4 opacity-70" />
              <span className={collapsed ? "sr-only" : ""}>Settings</span>
            </Link>
          </div>
        </section>

        {/* Help */}
        <section>
          <h4 className={cn("text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2", collapsed && "sr-only")}>
            Help & Support
          </h4>
          <div className="grid grid-cols-1 gap-2">
            <Link href="/support/knowledge-base" className={item}>
              <HelpCircle className="w-4 h-4 opacity-70" />
              <span className={collapsed ? "sr-only" : ""}>Knowledge Base</span>
            </Link>
            <Link href="/support/tickets/new" className={item}>
              <LifeBuoy className="w-4 h-4 opacity-70" />
              <span className={collapsed ? "sr-only" : ""}>Raise a Ticket</span>
            </Link>
          </div>
        </section>
      </div>
    </aside>
  );
}
