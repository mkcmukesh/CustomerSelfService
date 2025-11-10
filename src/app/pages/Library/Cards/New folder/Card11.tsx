
"use client";

import React, { useEffect } from "react";
import type { CardProps } from "./CardViewer/page";

const Card11: React.FC<CardProps> = ({ 
  name = "Studio Light",
  role = "Portable",
  leftId = 1011,
  avatarId = 1048,
  eyebrow = "Product",
  title = "LED Panel Pro",
  body = "High CRI, dimmable, lightweight. Ideal for shoots on the go."
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
          <img src={`https://picsum.photos/id/${leftId}/1200/800`} alt="" className="h-40 w-full object-cover" />
          <div className="p-5">
            <p className="text-[11px] uppercase tracking-wide text-neutral-500">{eyebrow}</p>
            <h3 className="text-xl font-semibold text-neutral-900">{title}</h3>
            <p className="mt-1 text-neutral-600">{body}</p>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="text-2xl font-semibold text-neutral-900">$129</div>
                <div className="text-xs text-neutral-500">incl. carrying bag</div>
              </div>
              <button className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300 active:scale-[0.98]"
                onClick={() => alert("Added to cart")}>Add to cart</button>
            </div>
          </div>
        </div>
      );
    };

    export default Card11;
    