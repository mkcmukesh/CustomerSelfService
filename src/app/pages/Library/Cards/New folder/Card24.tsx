
"use client";

import React, { useEffect } from "react";
import type { CardProps } from "./CardViewer/page";

const Check = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Card24: React.FC<CardProps> = ({
  name = "Polar Smartwatch",
  role = "Wearables",
  leftId = 207,
  eyebrow = "Features",
  title = "GPS • HR • 5ATM",
  body = "All‑day tracking with 2‑week battery."
}) => {

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);

  const price = 169;
  const features = ["AMOLED display", "SpO2 sensor", "Bluetooth 5.3", "Sleep stages"];
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5"
      style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}>
      <img src={`https://picsum.photos/id/${leftId}/1200/800`} alt={name} className="h-40 w-full object-cover" />
      <div className="p-4">
        <p className="text-[11px] uppercase tracking-wide text-neutral-500">{eyebrow}</p>
        <h3 className="text-lg font-semibold text-neutral-900">{name}</h3>
        <p className="text-sm text-neutral-500">{title}</p>
        <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
          {features.map((f,i)=> (
            <li key={i} className="flex items-center gap-2 text-neutral-700"><span className="grid h-5 w-5 place-items-center rounded-full bg-neutral-900 text-white"><Check/></span>{f}</li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xl font-semibold text-neutral-900">${price}</div>
          <button className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300" onClick={() => alert("Add to cart")}>Add to cart</button>
        </div>
      </div>
    </div>
  );
};

export default Card24;
