"use client";

import React, { useEffect } from "react";
import type { CardProps } from "../CardViewer/page";

const Check = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Card7: React.FC<CardProps> = ({
  name = "Ralph Edwards",
  role = "Creative Lead",
  avatarId = 1035,
  leftId = 130,
  rightTopId = 131,
  rightBottomId = 132,
  eyebrow = "Offer",
  title = "Team bundle",
  body = "A pricing-style card with feature list and strong CTA.",
}) => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  return (
    <div
      className="w-full overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-black/5"
      style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}
    >
      <div className="relative">
        <img src={`https://picsum.photos/id/${leftId}/1200/800`} alt="" className="h-32 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-3 text-white">
          <img
            src={`https://picsum.photos/id/${avatarId}/200/200`}
            alt={name}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-white/70"
          />
          <div>
            <p className="text-[11px] uppercase tracking-wide opacity-80">{eyebrow}</p>
            <p className="text-sm font-semibold leading-tight">{name}</p>
            <p className="text-xs opacity-90">{role}</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-semibold text-neutral-900">{title}</h3>
        <p className="mt-1 text-neutral-600">{body}</p>

        <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
          {["Up to 10 members", "Priority support", "Unlimited projects", "Brand assets kit"].map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-neutral-900 text-white">
                <Check />
              </span>
              <span className="text-neutral-700">{f}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <div className="text-3xl font-semibold text-neutral-900">$19</div>
            <div className="text-xs text-neutral-500">per member / month</div>
          </div>
          <button
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300 active:scale-[0.98]"
            onClick={() => alert(`${name} — Choose plan`)}
          >
            Choose plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card7;
