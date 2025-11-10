
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

const Check = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Card9: React.FC<CardProps> = ({ 
  name = "Marvin McKinney",
  role = "Growth Marketer",
  avatarId = 1044,
  eyebrow = "Checklist",
  title = "Minimal list",
  body = "Tight, content-first layout with a concise checklist."
}) => {

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);

      const items = ["Audience research", "Campaign setup", "A/B tests", "Insights & reporting"];
      return (
        <div className="w-full rounded-2xl bg-white p-5 shadow-md ring-1 ring-black/5"
          style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}>
          <div className="flex items-center gap-3">
            <img src={`https://picsum.photos/id/${avatarId}/200/200`} alt={name} className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow" />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-neutral-500">{eyebrow}</p>
              <h3 className="truncate text-base font-semibold text-neutral-900">{name}</h3>
              <p className="truncate text-sm text-neutral-500">{role}</p>
            </div>
          </div>

          <h4 className="mt-4 text-lg font-semibold text-neutral-900">{title}</h4>
          <p className="mt-1 text-sm text-neutral-600">{body}</p>

          <ul className="mt-3 grid gap-2 text-sm">
            {items.map((t, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-neutral-900 text-white"><Check /></span>
                <span className="text-neutral-700">{t}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex gap-2">
            <button className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300 active:scale-[0.98]"
              onClick={() => alert(`${name} — Start`)}>Start</button>
            <button className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50 focus:outline-none focus:ring-4 focus:ring-neutral-200 active:scale-[0.98]"
              onClick={() => alert(`${name} — Details`)}>Details</button>
          </div>
        </div>
      );
    };

    export default Card9;
    