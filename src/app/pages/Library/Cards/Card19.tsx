
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

const Card19: React.FC<CardProps> = ({
  name = "Nimbus Backpack",
  role = "Travel",
  leftId = 202,
  eyebrow = "Best seller",
  title = "Lightweight 28L carry",
  body = "Water-resistant shell, padded laptop sleeve, hidden pocket."
}) => {

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);

  const price = 89;
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5"
      style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}>
      <div className="grid grid-cols-5 gap-0">
        <img src={`https://picsum.photos/id/${leftId}/900/900`} alt={name} className="col-span-2 h-full w-full object-cover" />
        <div className="col-span-3 p-4">
          <p className="text-[11px] uppercase tracking-wide text-neutral-500">{eyebrow}</p>
          <h3 className="text-lg font-semibold text-neutral-900">{name}</h3>
          <p className="text-sm text-neutral-500">{title}</p>
          <p className="mt-2 text-sm text-neutral-600">{body}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xl font-semibold text-neutral-900">${price}</div>
            <button className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300" onClick={() => alert("Buy now")}>Buy now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card19;
