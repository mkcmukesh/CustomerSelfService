
"use client";

import React, { useEffect } from "react";
import type { CardProps } from "./CardViewer/page";

const Card13: React.FC<CardProps> = ({ 
  name = "Blog",
  role = "Article",
  leftId = 1015,
  eyebrow = "From the blog",
  title = "Designing for speed and delight",
  body = "How to craft experiences that feel instant while staying beautiful."
}) => {

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);

      return (
        <div className="w-full overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5"
          style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}>
          <img src={`https://picsum.photos/id/${leftId}/1200/800`} alt="" className="h-36 w-full object-cover" />
          <div className="p-4">
            <p className="text-[11px] uppercase tracking-wide text-neutral-500">{eyebrow}</p>
            <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
            <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{body}</p>
            <button className="mt-3 rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300 active:scale-[0.98]"
              onClick={() => alert("Read more")}>Read more</button>
          </div>
        </div>
      );
    };

    export default Card13;
    