"use client";

import React, { useEffect } from "react";

export type CardProps = {
  name?: string;
  role?: string;
  avatarId?: number;
  leftId?: number;
  rightTopId?: number;
  rightBottomId?: number;
  eyebrow?: string;
  title?: string;
  body?: string;
};

const Card2: React.FC<CardProps> = ({
  name = "Bessie Cooper",
  role = "Art Director",
  avatarId = 1012,
  leftId = 110,
  rightTopId = 111,
  rightBottomId = 112,
  eyebrow = "Projects",
  title = "Amet commodo",
  body = "Do tempor aliqua in deserunt proident. Nisi cupidatat id velit.",
}) => {
  // Load Inter + Poppins on the client
  useEffect(() => {
    const link1 = document.createElement("link");
    link1.rel = "preconnect";
    link1.href = "https://fonts.googleapis.com";
    const link2 = document.createElement("link");
    link2.rel = "preconnect";
    link2.href = "https://fonts.gstatic.com";
    link2.crossOrigin = "anonymous";
    const link3 = document.createElement("link");
    link3.rel = "stylesheet";
    link3.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.append(link1, link2, link3);
    return () => { link1.remove(); link2.remove(); link3.remove(); };
  }, []);

  return (
    <div
      className="w-full bg-white rounded-3xl shadow-lg ring-1 ring-black/5 overflow-hidden"
      style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-4 md:p-6">
        <img
          src={`https://picsum.photos/id/${avatarId}/200/200`}
          alt={name}
          loading="lazy"
          className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-sm"
        />
        <div className="min-w-0">
          <h3 className="text-xl font-semibold text-neutral-900">{name}</h3>
          <p className="text-neutral-500">{role}</p>
        </div>
      </div>

      {/* Image row */}
      <div className="grid grid-cols-3 gap-2 px-4 md:px-6">
        <img src={`https://picsum.photos/id/${leftId}/800/600`} alt="" loading="lazy" className="h-28 w-full object-cover rounded-xl" />
        <img src={`https://picsum.photos/id/${rightTopId}/800/600`} alt="" loading="lazy" className="h-28 w-full object-cover rounded-xl" />
        <img src={`https://picsum.photos/id/${rightBottomId}/800/600`} alt="" loading="lazy" className="h-28 w-full object-cover rounded-xl" />
      </div>

      {/* Body */}
      <div className="p-4 md:p-6">
        <p className="text-sm uppercase tracking-wide text-neutral-400">{eyebrow}</p>
        <h4 className="text-2xl font-semibold text-neutral-900 mt-1">{title}</h4>
        <p className="text-neutral-600 mt-2">{body}</p>
        <div className="mt-4">
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-transform active:scale-[0.98] focus:outline-none focus:ring-4 bg-neutral-900 text-white hover:bg-black focus:ring-neutral-300"
            onClick={() => alert(`${name} — Open`)}
          >
            Open
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card2;
