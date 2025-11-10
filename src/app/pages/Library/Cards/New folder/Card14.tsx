
"use client";

import React, { useEffect } from "react";
import type { CardProps } from "./CardViewer/page";

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-neutral-50 px-3 py-2 text-center ring-1 ring-neutral-200">
    <div className="text-base font-semibold text-neutral-900">{value}</div>
    <div className="text-[11px] uppercase tracking-wide text-neutral-500">{label}</div>
  </div>
);

const Card14: React.FC<CardProps> = ({ 
  name = "Guy Hawkins",
  role = "UI Engineer",
  avatarId = 1042,
  eyebrow = "Profile",
  title = "Stats snapshot",
  body = "Quick view of social metrics—ideal for creator dashboards."
}) => {

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);

      return (
        <div className="w-full overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-black/5 p-5"
          style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}>
          <div className="flex items-center gap-4">
            <img src={`https://picsum.photos/id/${avatarId}/200/200`} alt={name} className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow" />
            <div>
              <p className="text-[11px] uppercase tracking-wide text-neutral-500">{eyebrow}</p>
              <h3 className="text-lg font-semibold text-neutral-900">{name}</h3>
              <p className="text-sm text-neutral-500">{role}</p>
            </div>
          </div>

          <p className="mt-3 text-sm text-neutral-600">{body}</p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat label="Posts" value="128" />
            <Stat label="Likes" value="3.4k" />
            <Stat label="Followers" value="12k" />
          </div>

          <div className="mt-4 flex gap-2">
            <button className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300 active:scale-[0.98]"
              onClick={() => alert("Follow")}>Follow</button>
            <button className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50 focus:outline-none focus:ring-4 focus:ring-neutral-200 active:scale-[0.98]"
              onClick={() => alert("Message")}>Message</button>
          </div>
        </div>
      );
    };

    export default Card14;
    