"use client";

import React, { useEffect } from "react";
import type { CardProps } from "../CardViewer/page";

const Card4: React.FC<CardProps> = ({
  name = "Wade Warren",
  role = "Videographer",
  avatarId = 1027,
  leftId = 1080,
  rightTopId = 1082,
  rightBottomId = 1084,
  eyebrow = "Reels",
  title = "Split media",
  body = "Two-column composition: media tiles left, details and actions right.",
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
      <div className="grid grid-cols-2 gap-0">
        <div className="grid grid-rows-2">
          <img src={`https://picsum.photos/id/${leftId}/800/600`} alt="" className="h-full w-full object-cover" />
          <div className="grid grid-cols-2">
            <img src={`https://picsum.photos/id/${rightTopId}/800/600`} alt="" className="h-40 w-full object-cover" />
            <img src={`https://picsum.photos/id/${rightBottomId}/800/600`} alt="" className="h-40 w-full object-cover" />
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="flex items-center gap-3">
            <img
              src={`https://picsum.photos/id/${avatarId}/200/200`}
              alt={name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow"
            />
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">{eyebrow}</p>
              <h3 className="text-lg font-semibold text-neutral-900">{name}</h3>
              <p className="text-neutral-500">{role}</p>
            </div>
          </div>

          <h4 className="mt-4 text-xl font-semibold text-neutral-900">{title}</h4>
          <p className="mt-2 text-neutral-600">{body}</p>

          <div className="mt-4 flex gap-2">
            <button
              className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300 active:scale-[0.98]"
              onClick={() => alert(`${name} — Play`)}
            >
              Play
            </button>
            <button
              className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50 focus:outline-none focus:ring-4 focus:ring-neutral-200 active:scale-[0.98]"
              onClick={() => alert(`${name} — Save`)}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card4;
