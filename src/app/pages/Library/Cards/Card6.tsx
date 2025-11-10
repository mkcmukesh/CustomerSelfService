"use client";

import React, { useEffect } from "react";
import type { CardProps } from "../CardViewer/page";

const Check = ({ className = "h-3.5 w-3.5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Card6: React.FC<CardProps> = ({
  name = "Annette Black",
  role = "Retoucher",
  avatarId = 1033,
  leftId = 120,
  rightTopId = 121,
  rightBottomId = 122,
  eyebrow = "Activity",
  title = "Timeline",
  body = "A vertical timeline with steps and thumbnails — good for progress feeds.",
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
      className="w-full overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5"
      style={{ fontFamily: '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system' }}
    >
      <div className="flex items-center gap-3 p-4">
        <img
          src={`https://picsum.photos/id/${avatarId}/200/200`}
          alt={name}
          className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow"
        />
        <div>
          <p className="text-[11px] uppercase tracking-wide text-neutral-500">{eyebrow}</p>
          <h3 className="text-base font-semibold text-neutral-900">{name}</h3>
          <p className="text-sm text-neutral-500">{role}</p>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="relative ml-3 border-l border-neutral-200 pl-4">
          {[leftId, rightTopId, rightBottomId].map((id, i) => (
            <div key={i} className="relative mb-4 last:mb-0">
              <span className="absolute -left-[9px] mt-1 grid h-4 w-4 place-items-center rounded-full bg-neutral-900 text-white">
                <Check />
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={`https://picsum.photos/id/${id}/400/300`}
                  alt=""
                  className="h-16 w-24 rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-neutral-900">Milestone {i + 1}</p>
                  <p className="text-xs text-neutral-500">Updated just now</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300 active:scale-[0.98]"
            onClick={() => alert(`${name} — Share`)}
          >
            Share
          </button>
          <button
            className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50 focus:outline-none focus:ring-4 focus:ring-neutral-200 active:scale-[0.98]"
            onClick={() => alert(`${name} — Comment`)}
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card6;
