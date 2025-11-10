
"use client";

import React, { useEffect } from "react";
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

const Card22: React.FC<CardProps> = ({
  name = "Echo Smart Lamp",
  role = "Home",
  leftId = 205,
  eyebrow = "-30%",
  title = "Adaptive color & scenes",
  body = "Schedules, voice control and ambient sensor."
}) => {

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);

  const price = 59;
  const old = 84;
  return (
    <div className="w-full overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-black/5"
      style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}>
      <div className="relative">
        <img src={`https://picsum.photos/id/${leftId}/1200/800`} alt={name} className="h-40 w-full object-cover" />
        <div className="absolute right-3 top-3 rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white shadow-md">{eyebrow}</div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-neutral-900">{name}</h3>
        <p className="text-sm text-neutral-500">{title}</p>
        <p className="mt-2 text-sm text-neutral-600">{body}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold text-neutral-900">${price}</span>
            <span className="text-sm text-neutral-400 line-through">${old}</span>
          </div>
          <button className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300" onClick={() => alert("Add to cart")}>Add to cart</button>
        </div>
      </div>
    </div>
  );
};

export default Card22;
