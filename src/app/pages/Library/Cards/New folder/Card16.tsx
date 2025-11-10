
"use client";

import React, { useEffect } from "react";
import type { CardProps } from "./CardViewer/page";

const Card16: React.FC<CardProps> = ({ 
  name = "Compact",
  role = "Chips",
  avatarId = 1052,
  eyebrow = "Tags",
  title = "Chip actions",
  body = "Use chips for quick filters or topics."
}) => {

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);

      const chips = ["UI", "Motion", "Brand", "Typography", "Web"];
      return (
        <div className="w-full overflow-hidden rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5"
          style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}>
          <div className="flex items-center gap-3">
            <img src={`https://picsum.photos/id/${avatarId}/200/200`} alt={name} className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow" />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-neutral-500">{eyebrow}</p>
              <h3 className="truncate text-base font-semibold text-neutral-900">{title}</h3>
              <p className="truncate text-sm text-neutral-500">{body}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((c, i) => (
              <button key={i} className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-4 focus:ring-neutral-200 active:scale-[0.98]"
                onClick={() => alert(`Filter: ${c}`)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      );
    };

    export default Card16;
    