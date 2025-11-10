
"use client";

import React, { useEffect } from "react";
import type { CardProps } from "./CardViewer/page";

const Card27: React.FC<CardProps> = ({
  name = "Moss Throw Blanket",
  role = "Home",
  leftId = 211,
  eyebrow = "Out of stock",
  title = "Organic cotton • 130×170",
  body = "Soft, breathable weave with contrast stitching."
}) => {

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);

  const price = 39;
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5 opacity-90"
      style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}>
      <div className="relative">
        <img src={`https://picsum.photos/id/${leftId}/1200/800`} alt={name} className="h-36 w-full object-cover grayscale" />
        <div className="absolute inset-0 grid place-items-center text-white">
          <span className="rounded-full bg-black/70 px-3 py-1 text-sm">Out of stock</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-neutral-900">{name}</h3>
        <p className="text-sm text-neutral-500">{title}</p>
        <p className="mt-2 text-sm text-neutral-600">{body}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xl font-semibold text-neutral-900">${price}</div>
          <button className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-50 focus:outline-none focus:ring-4 focus:ring-neutral-200" onClick={() => alert("Notify when available")}>Notify me</button>
        </div>
      </div>
    </div>
  );
};

export default Card27;
