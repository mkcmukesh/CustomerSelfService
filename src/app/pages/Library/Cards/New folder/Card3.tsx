"use client";

import React, { useEffect } from "react";
import type { CardProps } from "../CardViewer/page";

const Card3: React.FC<CardProps> = ({
  name = "Courtney Henry",
  role = "Designer",
  avatarId = 1024,
  leftId = 1035,
  rightTopId = 1038,
  rightBottomId = 1041,
  eyebrow = "Showcase",
  title = "Glass profile",
  body = "A clean, glassy card with a blurred hero image and actionable buttons.",
}) => {
  // Load fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl">
      {/* Hero */}
      <img
        src={`https://picsum.photos/id/${leftId}/1200/800`}
        alt=""
        className="h-40 w-full object-cover"
        loading="lazy"
      />

      {/* Glass layer */}
      <div
        className="absolute inset-x-4 -bottom-8 mx-auto rounded-2xl bg-white/70 backdrop-blur-md shadow-xl ring-1 ring-black/5 p-4"
        style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}
      >
        <div className="flex items-center gap-4">
          <img
            src={`https://picsum.photos/id/${avatarId}/200/200`}
            alt={name}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow"
          />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-neutral-500">{eyebrow}</p>
            <h3 className="truncate text-lg font-semibold text-neutral-900">{name}</h3>
            <p className="truncate text-neutral-500">{role}</p>
          </div>
        </div>

        <p className="mt-3 text-sm text-neutral-600">{body}</p>

        <div className="mt-4 flex items-center gap-2">
          <button
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300 active:scale-[0.98]"
            onClick={() => alert(`${name} — Follow`)}
          >
            Follow
          </button>
          <button
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50 focus:outline-none focus:ring-4 focus:ring-neutral-200 active:scale-[0.98]"
            onClick={() => alert(`${name} — Message`)}
          >
            Message
          </button>
        </div>
      </div>

      {/* Spacer to accommodate glass layer */}
      <div className="h-16 w-full bg-transparent" />
    </div>
  );
};

export default Card3;
