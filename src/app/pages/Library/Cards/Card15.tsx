"use client";

import React, { useEffect } from "react";

export type CardProps = {
  name?: string;
  role?: string;
  avatarId?: number;

  // image id inputs
  leftId?: number;
  rightTopId?: number;
  rightBottomId?: number;

  eyebrow?: string;
  title?: string;
  body?: string;
};

const Quote = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M7 7h5v5H9v5H4v-6a4 4 0 0 1 3-4zM17 7h5v5h-3v5h-5v-6a4 4 0 0 1 3-4z" />
  </svg>
);

const Card15: React.FC<CardProps> = ({
  name = "Gallery",
  role = "Curated",
  leftId = 1066,
  rightTopId = 1067,
  rightBottomId = 1068,
  eyebrow = "Collection",
  title = "3x2 gallery",
  body = "Compact grid of six thumbnails with a simple header.",
}) => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, []);

  const ids: number[] = [
    leftId,
    rightTopId,
    rightBottomId,
    leftId + 1,
    rightTopId + 1,
    rightBottomId + 1,
  ];

  return (
    <div
      className="w-full overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5"
      style={{
        fontFamily:
          '"Inter","Poppins",ui-sans-serif,system-ui,-apple-system',
      }}
      aria-label={`${name} - ${role}`}
    >
      <div className="p-4">
        <p className="text-[11px] uppercase tracking-wide text-neutral-500">
          {eyebrow}
        </p>
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        <p className="mt-1 text-sm text-neutral-600">{body}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 p-4 pt-0">
        {ids.map((id, i) => (
          <img
            key={i}
            src={`https://picsum.photos/id/${id}/600/600`}
            alt=""
            className="h-20 w-full rounded-lg object-cover"
            loading="lazy"
          />
        ))}
      </div>

      <div className="px-4 pb-4">
        <button
          className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-300 active:scale-[0.98]"
          onClick={() => alert("Open gallery")}
          type="button"
        >
          Open gallery
        </button>
      </div>
    </div>
  );
};

export default Card15;
