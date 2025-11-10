
"use client";

import React, { useEffect } from "react";
export type CardProps = {
  name?: string;
  role?: string;
  avatarId?: number;
  leftId?: number;     // kept since it's in your props (even if unused here)
  eyebrow?: string;
  title?: string;      // kept for parity with your original props
  body?: string;
};

const Quote = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M7 7h5v5H9v5H4v-6a4 4 0 0 1 3-4zM17 7h5v5h-3v5h-5v-6a4 4 0 0 1 3-4z"/>
  </svg>
);

const CalendarIcon = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 2v4M8 2v4M3 10h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Card12: React.FC<CardProps> = ({ 
  name = "Design Summit",
  role = "2025",
  leftId = 1003,
  eyebrow = "Event",
  title = "Creative Tech Week",
  body = "Oct 18 • San Francisco — Talks, workshops, and networking."
}) => {

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);

      return (
        <div className="w-full overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-black/5"
          style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}>
          <div className="relative">
            <img src={`https://picsum.photos/id/${leftId}/1200/800`} alt="" className="h-36 w-full object-cover" />
            <div className="absolute right-3 top-3 rounded-lg bg-white/90 px-2 py-1 text-xs font-medium shadow ring-1 ring-black/5 flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" /> Save date
            </div>
          </div>
          <div className="p-5">
            <p className="text-[11px] uppercase tracking-wide text-neutral-500">{eyebrow}</p>
            <h3 className="text-xl font-semibold text-neutral-900">{title}</h3>
            <p className="text-neutral-600 mt-1">{body}</p>
            <div className="mt-4 flex gap-2">
              <button className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300 active:scale-[0.98]"
                onClick={() => alert("Register")}>Register</button>
              <button className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50 focus:outline-none focus:ring-4 focus:ring-neutral-200 active:scale-[0.98]"
                onClick={() => alert("Add to calendar")}>Add to calendar</button>
            </div>
          </div>
        </div>
      );
    };

    export default Card12;
    