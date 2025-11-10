"use client";

import React, { useEffect } from "react";
import type { CardProps } from "../CardViewer/page";

const Star = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const Card5: React.FC<CardProps> = ({
  name = "Jenny Wilson",
  role = "Illustrator",
  avatarId = 1029,
  leftId = 109,
  rightTopId = 110,
  rightBottomId = 111,
  eyebrow = "Top rated",
  title = "Stat badge",
  body = "Compact card with rating and quick actions — perfect for lists and catalogs.",
}) => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  return (
    <div
      className="w-full overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5"
      style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}
    >
      <div className="relative">
        <img src={`https://picsum.photos/id/${leftId}/1200/800`} alt="" className="h-40 w-full object-cover" />
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-medium shadow ring-1 ring-black/5">
          <Star className="h-3.5 w-3.5 text-amber-500" />
          4.9
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3">
          <img
            src={`https://picsum.photos/id/${avatarId}/200/200`}
            alt={name}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow"
          />
          <div>
            <p className="text-[11px] uppercase tracking-wide text-neutral-500">{eyebrow}</p>
            <h3 className="text-base font-semibold text-neutral-900">{name}</h3>
            <p className="text-sm text-neutral-500">{role}</p>
          </div>
        </div>

        <p className="mt-3 text-sm text-neutral-600">{body}</p>

        <div className="mt-3 flex items-center justify-between">
          <button
            className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300 active:scale-[0.98]"
            onClick={() => alert(`${name} — Hire`)}
          >
            Hire
          </button>
          <button
            className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50 focus:outline-none focus:ring-4 focus:ring-neutral-200 active:scale-[0.98]"
            onClick={() => alert(`${name} — Details`)}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card5;
