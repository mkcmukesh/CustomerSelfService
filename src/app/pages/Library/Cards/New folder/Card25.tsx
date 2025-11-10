
"use client";

import React, { useEffect } from "react";
import type { CardProps } from "./CardViewer/page";

const Card25: React.FC<CardProps> = ({
  name = "Studio Bundle",
  role = "Kit",
  leftId = 208,
  rightTopId = 209,
  eyebrow = "Bundle",
  title = "Mic + Arm + Pop Filter",
  body = "Complete desk setup for streaming or podcasting."
}) => {

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);

  const price = 199;
  return (
    <div className="w-full overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-black/5"
      style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}>
      <div className="grid grid-cols-2 gap-0">
        <img src={`https://picsum.photos/id/${leftId}/900/900`} alt="" className="h-44 w-full object-cover" />
        <img src={`https://picsum.photos/id/${rightTopId}/900/900`} alt="" className="h-44 w-full object-cover" />
      </div>
      <div className="p-5">
        <p className="text-[11px] uppercase tracking-wide text-neutral-500">{eyebrow}</p>
        <h3 className="text-lg font-semibold text-neutral-900">{name}</h3>
        <p className="text-sm text-neutral-500">{title}</p>
        <p className="mt-2 text-sm text-neutral-600">{body}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xl font-semibold text-neutral-900">${price}</div>
          <button className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300" onClick={() => alert("Add bundle")}>Add bundle</button>
        </div>
      </div>
    </div>
  );
};

export default Card25;
