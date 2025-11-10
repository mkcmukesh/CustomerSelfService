// src/components/admin/AdminSidebarProvider.tsx
"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

type AdminSidebarContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
};

const AdminSidebarContext = createContext<AdminSidebarContextValue | null>(null);
export function useAdminSidebar() {
  const ctx = useContext(AdminSidebarContext);
  if (!ctx) throw new Error("useAdminSidebar must be used within <AdminSidebarProvider>");
  return ctx;
}

const OPEN_KEY = "adminSidebar.isOpen";

export default function AdminSidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  // load persisted open
  useEffect(() => {
    try {
      const raw = localStorage.getItem(OPEN_KEY);
      if (raw) setOpen(JSON.parse(raw));
    } catch {}
  }, []);

  // persist on change
  useEffect(() => {
    try {
      localStorage.setItem(OPEN_KEY, JSON.stringify(open));
    } catch {}
  }, [open]);

  // double-Esc toggle
  const lastEsc = useRef(0);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const now = Date.now();
      if (now - lastEsc.current < 400) {
        setOpen(v => !v);     // toggle on 2nd Esc
        lastEsc.current = 0;
      } else {
        lastEsc.current = now;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <AdminSidebarContext.Provider value={{ open, setOpen, toggle: () => setOpen(v => !v) }}>
      {children}
    </AdminSidebarContext.Provider>
  );
}
