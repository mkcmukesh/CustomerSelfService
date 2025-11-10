
"use client";

import React, { useEffect } from "react";
import type { CardProps } from "./CardViewer/page";

const Card8: React.FC<CardProps> = ({ 
  name = "Theresa Webb",
  role = "Brand Strategist",
  avatarId = 1039,
  leftId = 140,
  eyebrow = "Spotlight",
  title = "Media overlay",
  body = "Full-bleed cover with gradient overlay and strong CTAs."
}) => {

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);

      return (
        <div className="relative w-full overflow-hidden rounded-3xl shadow-lg ring-1 ring-black/5"
          style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}>
          <img src={`https://picsum.photos/id/${leftId}/1200/800`} alt="" className="h-44 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-3 text-white">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider opacity-80">{eyebrow}</p>
              <h3 className="truncate text-2xl font-semibold leading-tight">{title}</h3>
              <p className="mt-1 line-clamp-2 text-sm opacity-90">{body}</p>
            </div>
            <button
              className="shrink-0 rounded-xl bg-white/90 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white focus:outline-none focus:ring-4 focus:ring-white/60 active:scale-[0.98]"
              onClick={() => alert(`${name} — Watch now`)}>
              Watch
            </button>
          </div>
        </div>
      );
    };

    export default Card8;
    