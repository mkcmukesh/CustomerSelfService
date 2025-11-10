
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

const Card26: React.FC<CardProps> = ({
  name = "Cloud Storage+",
  role = "Subscription",
  leftId = 210,
  eyebrow = "Plan",
  title = "2TB secure storage",
  body = "Encrypted backup, file history, and family sharing."
}) => {

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);

  const price = 9;
  return (
    <div className="w-full overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-black/5"
      style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}>
      <img src={`https://picsum.photos/id/${leftId}/1200/800`} alt={name} className="h-32 w-full object-cover" />
      <div className="p-5">
        <p className="text-[11px] uppercase tracking-wide text-neutral-500">{eyebrow}</p>
        <h3 className="text-xl font-semibold text-neutral-900">{name}</h3>
        <p className="text-neutral-600">{body}</p>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-3xl font-semibold text-neutral-900">${price}</div>
            <div className="text-xs text-neutral-500">per month</div>
          </div>
          <button className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300" onClick={() => alert("Subscribed")}>Subscribe</button>
        </div>
      </div>
    </div>
  );
};

export default Card26;
