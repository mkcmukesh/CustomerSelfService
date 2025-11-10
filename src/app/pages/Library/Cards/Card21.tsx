
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

const Star = ({ filled = true }) => (
  <svg viewBox="0 0 24 24" className={"h-4 w-4 " + (filled ? "text-amber-500" : "text-neutral-300")} fill="currentColor">
    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const Card21: React.FC<CardProps> = ({
  name = "Quill Mechanical Keyboard",
  role = "Accessories",
  leftId = 204,
  eyebrow = "Rating",
  title = "Hot‑swappable 75%",
  body = "Tactile switches with PBT keycaps."
}) => {

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);

  const price = 129;
  const rating = 4.7;
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5"
      style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}>
      <div className="flex gap-4">
        <img src={`https://picsum.photos/id/${leftId}/800/800`} alt={name} className="h-28 w-28 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-neutral-900">{name}</h3>
          <p className="text-sm text-neutral-500">{title}</p>
          <p className="mt-1 text-sm text-neutral-600">{body}</p>
          <div className="mt-2 flex items-center gap-1">
            {Array.from({length:5}).map((_,i)=>(<Star key={i} filled={i < Math.round(rating)-1} />))}
            <span className="ml-1 text-sm text-neutral-700">{rating}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xl font-semibold text-neutral-900">${price}</div>
            <button className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300" onClick={() => alert("Add to cart")}>Add to cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card21;
