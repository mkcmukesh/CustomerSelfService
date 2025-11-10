
"use client";

import React, { useEffect, useState } from "react";
export type CardProps = {
  name?: string;
  role?: string;
  avatarId?: number;
  leftId?: number;     // kept since it's in your props (even if unused here)
  eyebrow?: string;
  title?: string;      // kept for parity with your original props
  body?: string;
};

const Quote = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M7 7h5v5H9v5H4v-6a4 4 0 0 1 3-4zM17 7h5v5h-3v5h-5v-6a4 4 0 0 1 3-4z"/>
  </svg>
);

const Card23: React.FC<CardProps> = ({
  name = "Breeze Air Purifier",
  role = "Home",
  leftId = 206,
  eyebrow = "Compare",
  title = "HEPA H13 • 60m²",
  body = "Three-stage filtration with ultra quiet mode."
}) => {

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);

  const price = 119;
  const [cmp, setCmp] = useState(false);
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5"
      style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}>
      <div className="flex gap-4">
        <img src={`https://picsum.photos/id/${leftId}/800/800`} alt={name} className="h-28 w-28 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-neutral-500">{eyebrow}</p>
              <h3 className="text-lg font-semibold text-neutral-900">{name}</h3>
              <p className="text-sm text-neutral-500">{title}</p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="toggle toggle-sm" checked={cmp} onChange={(e)=>setCmp(e.target.checked)} />
              Compare
            </label>
          </div>
          <p className="mt-2 text-sm text-neutral-600">{body}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xl font-semibold text-neutral-900">${price}</div>
            <button className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300" onClick={() => alert(cmp ? "Added + compared" : "Added to cart")}>Add to cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card23;
