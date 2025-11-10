"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  FileText,
  ClipboardList,
  CreditCard,
  MessageCircleWarning,
  Gauge,
  BarChart3,
  HelpCircle,
} from "lucide-react";

export default function ActionsDropdown() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // close on Esc or outside click
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    function onClick(e: MouseEvent) {
      if (!panelRef.current || !btnRef.current) return;
      if (!panelRef.current.contains(e.target as Node) && !btnRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
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
      <button
        ref={btnRef}
        type="button"
        className="flex items-center gap-1 hover:text-slate-900 transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="actions-menu"
        onClick={() => setOpen(v => !v)}
      >
        Actions
        <ChevronDown className="w-4 h-4 translate-y-[1px]" />
      </button>

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
          // hover bridge to prevent flicker
          "before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2",
        ].join(" ")}
      >
        <ul className="space-y-2">
          <li><Link href="/actions/inquiry" className={item} role="menuitem"><FileText className="w-5 h-5 opacity-70" /><span>Inquiry</span></Link></li>
          <li><Link href="/actions/orders" className={item} role="menuitem"><ClipboardList className="w-5 h-5 opacity-70" /><span>Orders</span></Link></li>
          <li><Link href="/actions/accounts" className={item} role="menuitem"><CreditCard className="w-5 h-5 opacity-70" /><span>Accounts</span></Link></li>
          <li><Link href="/actions/complaints" className={item} role="menuitem"><MessageCircleWarning className="w-5 h-5 opacity-70" /><span>Complaints</span></Link></li>
          <li><Link href="/actions/performance" className={item} role="menuitem"><Gauge className="w-5 h-5 opacity-70" /><span>Performance</span></Link></li>
          <li><Link href="/actions/reports" className={item} role="menuitem"><BarChart3 className="w-5 h-5 opacity-70" /><span>Reports</span></Link></li>
          <li><Link href="/actions/helpdesk" className={item} role="menuitem"><HelpCircle className="w-5 h-5 opacity-70" /><span>Helpdesk</span></Link></li>
        </ul>
      </div>
    </div>
  );
}
