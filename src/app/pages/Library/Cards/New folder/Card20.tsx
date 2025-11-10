
"use client";

import React, { useEffect, useState } from "react";
import type { CardProps } from "./CardViewer/page";

const SW = ({ c }: { c: string }) => <span className="h-6 w-6 rounded-full ring-1 ring-black/10" style={{ backgroundColor: c }} />;

const Card20: React.FC<CardProps> = ({
  name = "Flux Sneakers",
  role = "Footwear",
  leftId = 203,
  eyebrow = "Colors",
  title = "Breathable knit runner",
  body = "Responsive foam sole with anti‑slip pattern."
}) => {

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);

  const price = 79;
  const colors = ["#111827", "#E11D48", "#10B981", "#2563EB"];
  const [sel, setSel] = useState(0);
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5"
      style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}>
      <img src={`https://picsum.photos/id/${leftId}/1200/800`} alt={name} className="h-40 w-full object-cover" />
      <div className="p-4">
        <p className="text-[11px] uppercase tracking-wide text-neutral-500">{eyebrow}</p>
        <h3 className="text-lg font-semibold text-neutral-900">{name}</h3>
        <p className="text-sm text-neutral-500">{title}</p>

        <div className="mt-3 flex items-center gap-2">
          {colors.map((c, i) => (
            <button key={i} className={"grid place-items-center rounded-full p-0.5 " + (sel===i ? "ring-2 ring-neutral-900" : "ring-0")} onClick={() => setSel(i)}><SW c={c} /></button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xl font-semibold text-neutral-900">${price}</div>
          <button className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300" onClick={() => alert(`Added size/color ${sel+1}`)}>Add to cart</button>
        </div>
      </div>
    </div>
  );
};

export default Card20;
