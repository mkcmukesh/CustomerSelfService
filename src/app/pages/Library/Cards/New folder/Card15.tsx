
"use client";

import React, { useEffect } from "react";
import type { CardProps } from "./CardViewer/page";

const Card15: React.FC<CardProps> = ({ 
  name = "Gallery",
  role = "Curated",
  leftId = 1066,
  rightTopId = 1067,
  rightBottomId = 1068,
  eyebrow = "Collection",
  title = "3x2 gallery",
  body = "Compact grid of six thumbnails with a simple header."
}) => {

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);

      const ids = [leftId, rightTopId, rightBottomId, (leftId||0)+1, (rightTopId||0)+1, (rightBottomId||0)+1];
      return (
        <div className="w-full overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5"
          style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}>
          <div className="p-4">
            <p className="text-[11px] uppercase tracking-wide text-neutral-500">{eyebrow}</p>
            <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
            <p className="mt-1 text-sm text-neutral-600">{body}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 p-4 pt-0">
            {ids.map((id, i) => (
              <img key={i} src={`https://picsum.photos/id/${id}/600/600`} alt="" className="h-20 w-full object-cover rounded-lg" />
            ))}
          </div>
          <div className="px-4 pb-4">
            <button className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300 active:scale-[0.98]"
              onClick={() => alert("Open gallery")}>Open gallery</button>
          </div>
        </div>
      );
    };

    export default Card15;
    