
"use client";

import React, { useEffect } from "react";
import type { CardProps } from "./CardViewer/page";

const Card18: React.FC<CardProps> = ({
  name = "Aurora Headphones",
  role = "Audio",
  leftId = 200,
  rightTopId = 201,
  eyebrow = "New",
  title = "Premium wireless over‑ear",
  body = "Active noise canceling, 40h battery, ultra-soft cups."
}) => {

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);

  const price = 149;
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5"
      style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}>
      <div className="relative">
        <img src={`https://picsum.photos/id/${leftId}/1200/800`} alt={name} className="h-44 w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-medium text-white">{eyebrow}</span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-neutral-900">{name}</h3>
        <p className="text-sm text-neutral-500">{title}</p>
        <p className="mt-2 text-sm text-neutral-600">{body}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xl font-semibold text-neutral-900">${price}</div>
          <div className="flex gap-2">
            <button className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300" onClick={() => alert("Added to cart")}>Add to cart</button>
            <button className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-900 hover:bg-neutral-50 focus:outline-none focus:ring-4 focus:ring-neutral-200" onClick={() => alert("Wishlisted")}>Wishlist</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card18;
